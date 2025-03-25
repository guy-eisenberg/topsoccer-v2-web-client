"use server";

import { createClient } from "@/clients/supabase/server";
import { createServiceClient } from "@/clients/supabase/service";
import type { Topsoccer } from "@/types";
import { createRefundInvoice } from "@/utils/server/createInvoice";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { generateEventPayment } from "@/utils/server/generateEventPayment";
import { getOrigin } from "@/utils/server/getOrigin";
import { refundGrowPayment } from "@/utils/server/refundGrowPayment";
import { refundPaymePayment } from "@/utils/server/refundPaymePayment";
import { refundVerifonePayment } from "@/utils/server/refundVerifonePayment";

export async function upsertEvent({
  event: {
    id,
    address,
    city,
    comment,
    description,
    price,
    max_players,
    time,
    title,
    type,
    sub_type,
    waze_url,
    whatsapp_url,
    stadium_id,
  },
  workers,
}: {
  event: {
    id: string | null;
    address: string;
    city: string;
    comment: string | null;
    description: string | null;
    price: number;
    max_players: number | null;
    time: string;
    title: string;
    type: Topsoccer.Event.Type;
    sub_type: Topsoccer.Event.SubType;
    waze_url: string | null;
    whatsapp_url: string | null;
    stadium_id: string | null;
  };
  workers: string[];
}) {
  const supabase = await createClient();

  const { data: eventId, error } = await supabase
    .rpc("z2_upsert_event", {
      _id: id,
      _address: address,
      _city: city,
      _comment: comment,
      _description: description,
      _price: price,
      _max_players: max_players,
      _time: time,
      _title: title,
      _type: type,
      _sub_type: sub_type,
      _waze_url: waze_url,
      _whatsapp_url: whatsapp_url,
      _stadium_id: stadium_id,
      _workers: workers,
    })
    .single<string>();

  if (error) throw error;

  return eventId;
}

export async function updateImages({
  event_id,
  images,
}: {
  event_id: string;
  images: string[];
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ images })
    .eq("id", event_id);

  if (error) throw error;
}

export async function updateVideos({
  event_id,
  videos,
  best_move,
}: {
  event_id: string;
  videos: { url: string; description?: string }[];
  best_move: string | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ videos, best_move })
    .eq("id", event_id);

  if (error) throw error;
}

export async function updateWinningTeams({
  event_id,
  winning_team,
  winning_team_2,
}: {
  event_id: string;
  winning_team: Topsoccer.Event.WinningTeam | null;
  winning_team_2: Topsoccer.Event.WinningTeam | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ winning_team, winning_team_2 })
    .eq("id", event_id);

  if (error) throw error;
}

export async function updateBestPlayers({
  event_id,
  best_player,
  best_player_2,
}: {
  event_id: string;
  best_player: Topsoccer.Event.BestPlayer | null;
  best_player_2: Topsoccer.Event.BestPlayer | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ best_player, best_player_2 })
    .eq("id", event_id);

  if (error) throw error;
}

export async function duplicateEvent({ id }: { id: string }) {
  const supabase = await createClient();

  const { data: eventId, error } = await supabase
    .rpc("z2_duplicate_event", {
      _id: id,
    })
    .single<string>();

  if (error) throw error;

  return eventId;
}

export async function refundPlayer({
  event_id,
  player_id,
  payment_id,
}: {
  event_id: string;
  player_id: string | null;
  payment_id: string | null;
}) {
  const user = await fetchAuth();
  if (!user || (user.role !== "admin" && user.role !== "worker"))
    throw new Error("Unauthorized");

  const supabase = createServiceClient();

  const { data: event } = (await supabase
    .from("events")
    .select()
    .eq("id", event_id)
    .single()) as { data: Topsoccer.Event.Object };

  let client_name = "";
  let email = "";
  const description = event.title;
  let price = 0;
  let card_number = "";
  let card_type = "";
  let confirmation_code = "";

  let payment:
    | {
        status: Topsoccer.PaymentStatus;
        method: Omit<
          Topsoccer.PaymentMethod,
          "Cash" | "Manual" | "Team" | "Wallet"
        >;
        payme?: Topsoccer.PaymePaymentData | null;
        grow: Topsoccer.GrowPaymentData | null;
        verifone: Topsoccer.VerifonePaymentData | null;
      }
    | undefined = undefined;

  if (payment_id) {
    const { data } = (await supabase
      .from("events_ot_payments")
      .select()
      .eq("id", payment_id)
      .eq("event_id", event_id)
      .single()) as { data: Topsoccer.Event.OTPayment };

    client_name = data.full_name;
    email = data.email;

    payment = data;
  } else if (player_id) {
    const [{ data }, { data: user }] = await Promise.all([
      supabase
        .from("events_payments")
        .select()
        .eq("event_id", event_id)
        .eq("user_id", player_id)
        .single(),
      supabase.from("users").select().eq("id", player_id).single(),
    ]);

    client_name = user.display_name;
    email = user.email;

    payment = data;
  }

  if (
    payment &&
    (payment.method === "CreditCard" ||
      payment.method === "Bit" ||
      payment.method === "Google" ||
      payment.method === "Apple") &&
    payment.status === "Completed"
  ) {
    if (payment.payme) {
      await refundPaymePayment(payment.payme.payme_sale_id);

      price = payment.payme.price;
      card_number = payment.payme.buyer_card_mask.slice(-4);
      card_type = payment.payme.payme_transaction_card_brand;
      confirmation_code = payment.payme.payme_transaction_auth_number;
    } else if (payment.grow) {
      await refundGrowPayment({
        transactionId: payment.grow.data.transactionId,
        transactionToken: payment.grow.data.transactionToken,
        refundSum: payment.grow.data.sum,
      });

      price = payment.grow.data.sum;
      card_number = payment.grow.data.cardSuffix;
      card_type = payment.grow.data.cardType;
      confirmation_code = payment.grow.data.asmachta;
    } else if (payment.verifone) {
      await refundVerifonePayment({
        transactionId: payment.verifone.itemId,
      });

      price = parseInt(payment.verifone.content.amount);
      card_number = payment.verifone.content.masked_card_number.slice(-4);
      card_type = payment.verifone.content.card_brand;
      confirmation_code = payment.verifone.content.authorization_code;
    } else throw new Error();

    const { doc_url: invoice_url } = await createRefundInvoice({
      client_name,
      email,
      description,
      price,
      card_number,
      card_type,
      confirmation_code,
    });

    if (payment_id)
      await supabase
        .from("events_ot_payments")
        .update({ invoice_url, status: "Canceled", refunded: true })
        .eq("event_id", event_id)
        .eq("id", payment_id);
    else if (player_id)
      await supabase
        .from("events_payments")
        .update({ invoice_url, status: "Canceled" })
        .eq("event_id", event_id)
        .eq("user_id", player_id);
  } else if (
    payment &&
    payment.method === "Wallet" &&
    payment.status === "Completed"
  ) {
    await Promise.all([
      supabase
        .from("events_payments")
        .update({ status: "Canceled" })
        .eq("event_id", event_id)
        .eq("user_id", player_id),
      supabase.rpc("z2_update_user_wallet", {
        user_id: user.id,
        amount: 1,
      }),
    ]);
  }
}

export async function setEventFull({
  event_id,
  full,
}: {
  event_id: string;
  full: boolean;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ full })
    .eq("id", event_id);

  if (error) throw error;
}

export async function setEventCanceled({
  event_id,
  canceled,
}: {
  event_id: string;
  canceled: boolean;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ canceled })
    .eq("id", event_id);

  if (error) throw error;
}

export async function generatePaymentLink({
  event_id,
  user_name,
  user_phone,
  user_email,
  payment_method,
}: {
  event_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  payment_method: Topsoccer.PaymentMethod;
}) {
  const origin = await getOrigin();

  const supabase = await createClient();

  const { url } = await generateEventPayment(supabase, {
    type: "unauthenticated",
    event_id,
    user_name,
    user_phone,
    user_email,
    payment_method,
    origin,
  });

  return url;
}
