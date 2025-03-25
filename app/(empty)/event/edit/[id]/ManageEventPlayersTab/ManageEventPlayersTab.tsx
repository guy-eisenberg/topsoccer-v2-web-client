import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import ManageEventPlayersTabContent from "./ManageEventPlayersTabContent";

export default async function ManageEventPlayersTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const { players, ot_players, groups } = await fetchData(event.id);

  return (
    <ManageEventPlayersTabContent
      event={event}
      players={players}
      ot_players={ot_players || []}
      groups={groups}
    />
  );
}

async function fetchData(id: string) {
  const supabase = await createClient();

  const [{ data: players }, { data: ot_players }, { data: groups }] =
    await Promise.all([
      supabase.rpc("z2_get_event_manage_players", {
        _id: id,
      }),
      supabase
        .from("events_ot_payments")
        .select()
        .eq("event_id", id)
        .or("status.eq.Completed,status.eq.Canceled"),
      supabase.rpc("z2_get_event_groups", { _id: id }),
    ]);

  return { players, ot_players, groups };
}
