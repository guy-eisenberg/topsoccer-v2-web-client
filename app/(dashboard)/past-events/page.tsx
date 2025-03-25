import EventsListCardSSR from "@/app/components/common/EventsListCard/EventsListCardSSR";

export default function PastEventsPage() {
  return (
    <main className="min-h-0 flex-1">
      <EventsListCardSSR className="md:h-full" time="past" />
    </main>
  );
}
