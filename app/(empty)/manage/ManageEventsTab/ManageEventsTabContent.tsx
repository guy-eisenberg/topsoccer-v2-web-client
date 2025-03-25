"use client";

import EventCard from "@/app/components/common/EventCard";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import type { Topsoccer } from "@/types";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

export default function ManageEventsTabContent({
  user,
  future_events,
  past_events,
}: {
  user: Topsoccer.User.Auth;
  future_events: Topsoccer.Event.Object[];
  past_events: Topsoccer.Event.Object[];
}) {
  const [term, setTerm] = useState("");
  const defferedTerm = useDeferredValue(term);

  const filteredFutureEvents = useMemo(() => {
    if (!future_events || future_events.length === 0) return [];

    return future_events.filter((event) => event.title.match(defferedTerm));
  }, [future_events, defferedTerm]);

  const filteredPastEvents = useMemo(() => {
    if (!past_events || past_events.length === 0) return [];

    return past_events
      .filter((event) => event.title.match(defferedTerm))
      .sort(
        (event1, event2) =>
          new Date(event2.time).getTime() - new Date(event1.time).getTime(),
      );
  }, [past_events, defferedTerm]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="flex-1"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="חפש לפי שם אירוע"
        />
        {user?.role === "admin" && (
          <Link href="/event/edit/new">
            <Button color="primary" className="whitespace-nowrap">
              צור אירוע
            </Button>
          </Link>
        )}
      </div>
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col gap-2 md:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <p className="pb-1 font-semibold">אירועים עתידיים</p>
          <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto scrollbar-hide">
            {filteredFutureEvents &&
              filteredFutureEvents.map((event) => (
                <li className="flex items-center gap-4" key={event.id}>
                  <EventCard
                    className="min-w-0 flex-1"
                    event={event}
                    overrideUrl={`/event/edit/${event.id}`}
                    showVideoIcon={false}
                  />
                </li>
              ))}
          </ul>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <p className="pb-1 font-semibold">אירועים שהתקיימו</p>
          <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto scrollbar-hide">
            {filteredPastEvents &&
              filteredPastEvents.map((event) => (
                <li className="flex items-center gap-4" key={event.id}>
                  <EventCard
                    className="min-w-0 flex-1"
                    event={event}
                    overrideUrl={`/event/edit/${event.id}`}
                    showVideoIcon={false}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
