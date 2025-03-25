import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import ManageEventTeamsTabContent from "./ManageEventTeamsTabContent";

export default async function ManageEventTeamsTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const { teams, levels, games } = await fetchData(event.id);

  return (
    <ManageEventTeamsTabContent
      event={event}
      teams={teams}
      levels={levels}
      games={games || []}
    />
  );
}

async function fetchData(id: string) {
  const supabase = await createClient();

  const [{ data: teams }, { data: levels }, { data: games }] =
    await Promise.all([
      supabase.rpc("z2_get_event_manage_teams", { _id: id }),
      supabase.rpc("z2_get_event_manage_levels", { _id: id }),
      supabase.from("events_levels_games").select().eq("event_id", id),
    ]);

  return { teams, levels, games };
}
