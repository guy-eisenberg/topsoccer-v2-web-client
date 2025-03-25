import EventsListCard from "@/app/components/common/EventsListCard/EventsListCard";
import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";

export default async function PlayerEventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await fetchAuth();
  if (!user || user.role !== "admin") redirect("/");

  const { id } = await params;
  if (!id) redirect("/");

  const { past_events, future_events } = await getEvents(id);

  return (
    <main className="min-h-0 flex-1 gap-2 md:flex">
      <EventsListCard
        className="flex-1"
        events={future_events}
        label="אירועים קרובים"
        time="future"
      />
      <EventsListCard
        className="flex-1"
        events={past_events}
        label="אירועי עבר"
        time="past"
      />
    </main>
  );
}

async function getEvents(id: string) {
  const supabase = await createClient();

  const {
    data: [events],
  } = await supabase.rpc("z2_get_user_events", { _user_id: id });

  return events as {
    past_events: Topsoccer.Event.Object[];
    future_events: Topsoccer.Event.Object[];
  };
}
