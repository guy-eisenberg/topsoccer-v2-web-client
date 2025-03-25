import EventsListCard from "@/app/components/common/EventsListCard/EventsListCard";
import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";

export default async function MyEventsPage() {
  const user = await fetchAuth();
  if (!user) redirect("/");

  const { past_events, future_events } = await getEvents();

  return (
    <main className="min-h-0 flex-1 gap-2 md:flex">
      <EventsListCard
        className="flex-1"
        events={future_events}
        label="אירועים שנרשמתי אליהם"
        time="future"
      />
      <EventsListCard
        className="flex-1"
        events={past_events}
        label="אירועים שהשתתפתי בהם"
        time="past"
      />
    </main>
  );
}

async function getEvents() {
  const supabase = await createClient();

  const {
    data: [events],
  } = await supabase.rpc("z2_get_user_events");

  return events as {
    past_events: Topsoccer.Event.Object[];
    future_events: Topsoccer.Event.Object[];
  };
}
