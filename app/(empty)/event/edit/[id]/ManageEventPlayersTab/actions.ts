"use server";

import { createClient } from "@/clients/supabase/server";
import { createServiceClient } from "@/clients/supabase/service";
import type { Topsoccer } from "@/types";
import { createCashInvoice as _createCashInvoice } from "@/utils/server/createInvoice";
import { fetchAuth } from "@/utils/server/fetchAuth";

export async function manualEnroll({
  event_id,
  player_id,
}: {
  event_id: string;
  player_id: string;
}) {
  const user = await fetchAuth();
  if (!user || (user.role !== "admin" && user.role !== "worker"))
    return new Error("Unauthorized");

  const supabase = createServiceClient();
  await Promise.all([
    supabase.from("events_players").upsert(
      {
        event_id,
        user_id: player_id,
      },
      { ignoreDuplicates: true },
    ),
    supabase
      .from("events_players_cancels")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", player_id),
    supabase.from("events_payments").upsert(
      {
        event_id,
        user_id: player_id,
        method: "Cash",
        status: "Completed",
      },
      { onConflict: "event_id, user_id" },
    ),
  ]);
}

export async function revealGroups({
  event_id,
  reveal_groups,
}: {
  event_id: string;
  reveal_groups: boolean;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ reveal_groups })
    .eq("id", event_id);

  if (error) throw error;
}

export async function setGroupWins({
  event_id,
  group_id,
  wins,
}: {
  event_id: string;
  group_id: string;
  wins: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events_groups")
    .update({ wins })
    .eq("event_id", event_id)
    .eq("id", group_id);

  if (error) throw error;
}

export async function putPlayersInGroup({
  event_id,
  group,
  players,
}: {
  event_id: string;
  group: Topsoccer.Group.Name;
  players: string[];
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("z2_put_players_in_group", {
    _event_id: event_id,
    _players: players,
    _group_name: group,
  });

  if (error) throw error;
}

export async function removePlayersFromGroup({
  event_id,
  players,
}: {
  event_id: string;
  players: string[];
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("z2_remove_players_from_group", {
    _event_id: event_id,
    _players: players,
  });

  if (error) throw error;
}

export async function resetEventGroups({ event_id }: { event_id: string }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events_players")
    .update({ group_id: null })
    .eq("event_id", event_id);

  if (error) throw error;
}

export async function removePlayer({
  event_id,
  player_id,
}: {
  event_id: string;
  player_id: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("z2_single_unroll_event", {
    _event_id: event_id,
    _user_id: player_id,
  });

  if (error) throw error;
}

export async function removeOTPlayer({
  event_id,
  payment_id,
}: {
  event_id: string;
  payment_id: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events_ot_payments")
    .update({
      status: "Canceled",
    })
    .eq("event_id", event_id)
    .eq("id", payment_id);

  if (error) throw error;
}

export async function createCashInvoice({
  event_id,
  player_id,
}: {
  event_id: string;
  player_id: string;
}) {
  const user = await fetchAuth();
  if (!user || (user.role !== "admin" && user.role !== "worker"))
    throw new Error("Unauthorized");

  const supabase = createServiceClient();

  const { data: invoiceData } = await supabase
    .rpc("z2_get_invoice_required_data", {
      _event_id: event_id,
      _user_id: player_id,
    })
    .select()
    .single();

  const { doc_url } = await _createCashInvoice({
    client_name: invoiceData.display_name,
    email: invoiceData.email,
    vat_id: invoiceData.tz_id,
    description: invoiceData.title,
    price: invoiceData.price,
  });

  await supabase
    .from("events_payments")
    .update({
      invoice_url: doc_url,
    })
    .eq("event_id", event_id)
    .eq("user_id", player_id);
}

export async function setStats({
  event_id,
  player_id,
  goals,
  penalty_saved,
  clean_net,
  is_goalkeeper,
}: {
  event_id: string;
  player_id: string;
  goals: number;
  penalty_saved: number;
  clean_net: number;
  is_goalkeeper: boolean;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events_players")
    .update({
      goals,
      penalty_saved,
      clean_net,
      is_goalkeeper,
    })
    .eq("event_id", event_id)
    .eq("user_id", player_id);

  return error;
}
