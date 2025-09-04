"use client";

import EventCard from "@/app/components/common/EventCard";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import type { Topsoccer } from "@/types";
import { TIMEZONE } from "@/utils/constants";
import { DateRangePicker } from "@heroui/react";
import { fromDate, toCalendarDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

export default function ManageEventsTabContent({
  user,
  future_events,
  past_events,
  past_events_start,
  past_events_end,
}: {
  user: Topsoccer.User.Auth;
  future_events: Topsoccer.Event.Object[];
  past_events: Topsoccer.Event.Object[];
  past_events_start?: string;
  past_events_end?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [term, setTerm] = useState("");
  const defferedTerm = useDeferredValue(term);

  const filteredFutureEvents = useMemo(() => {
    if (!future_events || future_events.length === 0) return [];

    return future_events.filter((event) => event.title.match(defferedTerm));
  }, [future_events, defferedTerm]);

  const [pastEventsDateRange, setPastEventsDateRange] = useState({
    start: toCalendarDate(
      fromDate(
        (() => {
          const date = new Date();
          date.setMonth(date.getMonth() - 1);
          return date;
        })(),
        TIMEZONE,
      ),
    ),
    end: toCalendarDate(fromDate(new Date(), TIMEZONE)),
  });

  const filteredPastEvents = useMemo(() => {
    if (!past_events || past_events.length === 0) return [];

    return past_events
      .filter((event) => event.title.match(defferedTerm))
      .sort(
        (event1, event2) =>
          new Date(event2.time).getTime() - new Date(event1.time).getTime(),
      );
  }, [past_events, defferedTerm]);

  useEffect(() => {
    setPastEventsDateRange({
      start: toCalendarDate(
        fromDate(
          (() => {
            if (past_events_start) return new Date(past_events_start);

            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            return date;
          })(),
          TIMEZONE,
        ),
      ),
      end: toCalendarDate(
        fromDate(
          past_events_end ? new Date(past_events_end) : new Date(),
          TIMEZONE,
        ),
      ),
    });
  }, [past_events_start, past_events_end]);

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
          <ul className="scrollbar-hide flex min-h-0 flex-col gap-1 overflow-y-auto">
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
          <div className="flex items-center justify-between pb-1">
            <p className="font-semibold">אירועים שהתקיימו</p>
            <I18nProvider locale="he-IL">
              <DateRangePicker
                classNames={{
                  base: "[direction:ltr]",
                  popoverContent: "[direction:ltr]",
                }}
                value={pastEventsDateRange}
                onChange={(range) => {
                  if (!range) return;

                  const params = new URLSearchParams(searchParams.toString());
                  params.set(
                    "past_events_start",
                    range?.start.toDate(TIMEZONE).toISOString(),
                  );
                  params.set(
                    "past_events_end",
                    range?.end.toDate(TIMEZONE).toISOString(),
                  );

                  router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                className="max-w-xs"
                variant="bordered"
              />
            </I18nProvider>
          </div>
          <ul className="scrollbar-hide flex min-h-0 flex-col gap-1 overflow-y-auto">
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
