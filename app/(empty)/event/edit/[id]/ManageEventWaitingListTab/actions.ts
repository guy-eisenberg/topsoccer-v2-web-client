"use server";

import { createClient } from "@/clients/supabase/server";
import { createServiceClient } from "@/clients/supabase/service";
import { fetchAuth } from "@/utils/server/fetchAuth";

export async function manualEnrollWaitingList({
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
    supabase
      .from("events_players_waiting")
      .upsert({ event_id, user_id: player_id }, { ignoreDuplicates: true }),
    supabase
      .from("events_players")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", player_id),
    supabase
      .from("events_players_cancels")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", player_id),
  ]);
}

export async function removeWaitingPlayer({
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
