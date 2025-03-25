import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import ManageEventBestPlayersTabContent from "./ManageEventBestPlayersTabContent";

export async function ManageEventBestPlayersTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const players = await fetchPlayers(event.id);

  return <ManageEventBestPlayersTabContent event={event} players={players} />;
}

async function fetchPlayers(id: string) {
  const supabase = await createClient();

  const { data: players } = await supabase.rpc("z2_get_event_manage_players", {
    _id: id,
  });

  return players;
}
