import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import ManageEventWaitingListTabContent from "./ManageEventWaitingListTabContent";

export default async function ManageEventWaitingListTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const players_waiting = await fetchData(event.id);

  return (
    <ManageEventWaitingListTabContent
      event={event}
      players_waiting={players_waiting}
    />
  );
}

export async function fetchData(id: string) {
  const supabase = await createClient();

  const { data: players_waiting } = await supabase.rpc(
    "z2_get_event_manage_waiting_list",
    { _id: id },
  );

  return players_waiting;
}
