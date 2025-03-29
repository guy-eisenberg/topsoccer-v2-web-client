"use server";

import { createClient } from "@/clients/supabase/server";
import { createServiceClient } from "@/clients/supabase/service";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { generateEventPayment } from "@/utils/server/generateEventPayment";
import { getOrigin } from "@/utils/server/getOrigin";

export async function enrollEvent({
  event_id,
  payment_method,
  waiting_list,
}: {
  event_id: string;
  payment_method: Topsoccer.PaymentMethod | null;
  waiting_list: boolean;
}) {
  const origin = await getOrigin();

  const user = await fetchAuth();

  if (!user) throw new Error("Unauthorized");
  if (user.blocked) throw new Error("User is blocked.");
  if (!user.birth_date || !user.city || !user.phone_number || !user.tz_id)
    throw new Error("User profile must be complete.");

  const supabase = createServiceClient();

  const { data: event } = await supabase
    .from("events")
    .select()
    .eq("id", event_id)
    .single<Topsoccer.Event.Object>();
  if (!event) throw new Error(`Event of id ${event_id} not found.`);

  if (payment_method === "Manual") throw new Error("Unauthorized");
  if (payment_method === "Cash" && !user.can_pay_cash)
    throw new Error("Unauthorized");
  if (payment_method === "Team" && event.sub_type !== "Teams")
    throw new Error("Unauthorized");
  if (payment_method === "Wallet" && user.wallet === 0)
    throw new Error("Insufficient funds in user wallet.");
  if (payment_method === null && !waiting_list) throw new Error("Unauthorized");

  if (waiting_list) {
    await Promise.all([
      supabase
        .from("events_players_waiting")
        .upsert({ event_id, user_id: user.id }, { ignoreDuplicates: true }),
      supabase
        .from("events_players")
        .delete()
        .eq("event_id", event_id)
        .eq("user_id", user.id),
      supabase
        .from("events_players_cancels")
        .delete()
        .eq("event_id", event_id)
        .eq("user_id", user.id),
    ]);

    return `${origin}/event/${event_id}?status=enroll_success&show-upsale=true`;
  }

  if (
    payment_method === "Cash" ||
    payment_method === "Team" ||
    payment_method === "Wallet"
  ) {
    await Promise.all([
      supabase.from("events_players").upsert(
        {
          event_id,
          user_id: user.id,
        },
        { ignoreDuplicates: true },
      ),
      supabase
        .from("events_players_cancels")
        .delete()
        .eq("event_id", event_id)
        .eq("user_id", user.id),
      supabase.from("events_payments").upsert(
        {
          event_id,
          user_id: user.id,
          method: payment_method,
          status: "Completed",
        },
        { onConflict: "event_id, user_id" },
      ),
      payment_method === "Wallet"
        ? supabase.rpc("z2_update_user_wallet", {
            _user_id: user.id,
            _amount: -1,
          })
        : null,
    ]);

    return `${origin}/event/${event_id}?status=enroll_success&show-upsale=true`;
  }

  const { url } = await generateEventPayment(supabase, {
    type: "authenticated",
    user_id: user.id,
    user_name: user.display_name,
    user_phone: user.phone_number,
    user_email: user.email,
    event_id,
    payment_method: payment_method!,
    origin,
  });

  return url;
}

export async function singleUnrollEvent({ event_id }: { event_id: string }) {
  const origin = await getOrigin();

  const user = await fetchAuth();
  if (!user) throw new Error("Unauthorized");

  const supabase = createServiceClient();
  await supabase.rpc("z2_single_unroll_event", {
    _event_id: event_id,
    _user_id: user.id,
  });

  return `${origin}/event/${event_id}?status=unroll_success`;
}

export async function teamEnrollEvent({
  event_id,
  team_id,
}: {
  event_id: string;
  team_id: string;
}) {
  const origin = await getOrigin();

  const user = await fetchAuth();
  if (!user) throw new Error("Unauthorized");
  if (user.blocked) throw new Error("User is blocked.");

  const authClient = await createClient();
  const { data: isTeamAdmin } = await authClient
    .rpc("z2_is_team_admin", {
      _team_id: team_id,
    })
    .single<boolean>();
  if (!isTeamAdmin) throw new Error("Unauthorized");

  const supabase = createServiceClient();

  const { error } = await supabase.rpc("z2_team_enroll_event", {
    _event_id: event_id,
    _team_id: team_id,
    _invoker_id: user.id,
  });

  if (error) throw error;

  return `${origin}/event/${event_id}?status=enroll_success&show-upsale=true`;
}

export async function teamUnrollEvent({
  event_id,
  team_id,
}: {
  event_id: string;
  team_id: string;
}) {
  const origin = await getOrigin();

  const user = await fetchAuth();
  if (!user) throw new Error("Unauthorized");

  const authClient = await createClient();
  const { data: isTeamAdmin } = await authClient
    .rpc("z2_is_team_admin", {
      _team_id: team_id,
    })
    .single<boolean>();
  if (!isTeamAdmin) throw new Error("Unauthorized");

  const supabase = createServiceClient();

  if (!isTeamAdmin) throw new Error("Unauthorized");

  await supabase.rpc("z2_team_unroll_event", {
    _event_id: event_id,
    _team_id: team_id,
  });

  return `${origin}/event/${event_id}?status=unroll_success`;
}
