import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import ManageEventMapTabContent from "./ManageEventMapTabContent";

export default async function ManageEventMapTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const { players, map } = await fetchData(event.id);

  return <ManageEventMapTabContent event={event} players={players} map={map} />;
}

async function fetchData(id: string) {
  const supabase = await createClient();

  const [{ data: players }, { data: map }] = await Promise.all([
    supabase.rpc("z2_get_event_manage_players", {
      _id: id,
    }),
    supabase.rpc("z2_get_event_map", { _id: id }),
  ]);

  return { players, map };
}
