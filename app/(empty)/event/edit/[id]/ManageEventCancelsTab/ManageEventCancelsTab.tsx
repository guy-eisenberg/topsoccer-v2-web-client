import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import ManageEventCancelsTabContent from "./ManageEventCancelsTabContent";

export default async function ManageEventCancelsTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const players_cancels = await fetchData(event.id);

  return (
    <ManageEventCancelsTabContent
      event={event}
      players_cancels={players_cancels}
    />
  );
}

async function fetchData(id: string) {
  const supabase = await createClient();

  const { data: players_cancels } = await supabase.rpc(
    "z2_get_event_manage_cancels",
    { _id: id },
  );

  return players_cancels;
}
