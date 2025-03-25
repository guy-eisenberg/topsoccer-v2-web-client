import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import ManageEventsTabContent from "./ManageEventsTabContent";

export default async function ManageEventsTab({
  user,
}: {
  user: Topsoccer.User.Auth;
}) {
  const { past_events, future_events } = await fetchEvents();

  return (
    <ManageEventsTabContent
      user={user}
      past_events={past_events || []}
      future_events={future_events || []}
    />
  );
}

async function fetchEvents() {
  const supabase = await createClient();

  const {
    data: { future_events, past_events },
  } = await supabase.rpc("z2_get_manage_events");

  return { future_events, past_events };
}
