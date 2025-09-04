import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { Suspense } from "react";
import Skeleton from "../../core/Skeleton";
import EventsListCard from "./EventsListCard";

type EventsListCardSSRProps = React.HTMLAttributes<HTMLDivElement> & {
  time: "past" | "future";
};

export default function EventsListCardSSR(props: EventsListCardSSRProps) {
  return (
    <Suspense
      fallback={
        <Skeleton {...props} className="h-screen md:h-full md:rounded-xl" />
      }
    >
      <_EventsListSSR {...props} />
    </Suspense>
  );
}

async function _EventsListSSR({ time, ...rest }: EventsListCardSSRProps) {
  let events: Topsoccer.Event.Object[] = [];
  if (time === "past") events = await getPastEvents();
  else if (time === "future") events = await getFutureEvents();

  return <EventsListCard {...rest} events={events} time={time} />;
}

async function getPastEvents() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select()
    .order("time", { ascending: false })
    .lt("time", new Date(Date.now() - 7200000).toISOString())
    .eq("canceled", false)
    .limit(40);

  return (events || []) as Topsoccer.Event.Object[];
}

async function getFutureEvents() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select()
    .gte("time", new Date(Date.now() - 7200000).toISOString())
    .eq("canceled", false)
    .limit(40);

  return (events || []) as Topsoccer.Event.Object[];
}
