"use server";

import { createClient } from "@/clients/supabase/server";

export async function updateMap({
  event_id,
  map,
}: {
  event_id: string;
  map: {
    event_id: string;
    user_id: string;
    x: number;
    y: number;
    is_mvp: boolean;
  }[];
}) {
  const supabase = await createClient();

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase.from("events_maps").delete().eq("event_id", event_id),
    supabase
      .from("events_maps")
      .upsert(map, { onConflict: "event_id, user_id" }),
  ]);

  if (error1) throw error1;
  if (error2) throw error2;
}
