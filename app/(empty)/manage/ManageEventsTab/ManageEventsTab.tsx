import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import ManageEventsTabContent from "./ManageEventsTabContent";

export default async function ManageEventsTab({
  user,
  past_events_start,
  past_events_end,
}: {
  user: Topsoccer.User.Auth;
  past_events_start?: string;
  past_events_end?: string;
}) {
  const { past_events, future_events } = await fetchEvents(
    past_events_start ||
      (() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
      })().toISOString(),
    past_events_end,
  );

  return (
    <ManageEventsTabContent
      user={user}
      past_events={past_events || []}
      future_events={future_events || []}
      past_events_start={past_events_start}
      past_events_end={past_events_end}
    />
  );
}

async function fetchEvents(
  past_events_start: string,
  past_events_end?: string,
) {
  const supabase = await createClient();

  console.log(past_events_end);

  const {
    data: { future_events, past_events },
  } = await supabase.rpc("z2_get_manage_events", {
    _past_start: past_events_start,
    _past_end: past_events_end || null,
  });

  return { future_events, past_events };
}
