"use client";

import type { Topsoccer } from "@/types";
import { cn, ScrollShadow } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Select } from "../../core/Select";
import { SelectItem } from "../../core/SelectItem";
import { SortButton } from "../../core/SortButton";
import EventCard from "../EventCard";

interface EventsListCardProps extends React.HTMLAttributes<HTMLDivElement> {
  events: Topsoccer.Event.Object[];
  leftLink?: string;
  label?: string;
  time: "future" | "past";
}

const EventsListCard: React.FC<EventsListCardProps> = ({
  events,
  time,
  label,
  leftLink,
  ...rest
}) => {
  const [typeFilter, setTypeFilter] = useState<Topsoccer.Event.Type[]>([]);
  const [subTypeFilter, setSubTypeFilter] = useState<Topsoccer.Event.SubType[]>(
    [],
  );
  const [timeSort, setTimeSort] = useState<"desc" | "asc" | undefined>(
    undefined,
  );

  const availableTypeFilters = useMemo(() => {
    const typeFiltersKeys: { [key: string]: boolean } = {};

    events.forEach((event) => {
      typeFiltersKeys[event.type] = true;
    });

    return Object.keys(typeFiltersKeys).map((type) => ({
      key: type,
      label: type,
    }));
  }, [events]);

  const finalEvents = useMemo(() => {
    let arr = [...events];

    if (typeFilter.length > 0)
      arr = arr.filter((e) => typeFilter.includes(e.type));
    if (subTypeFilter.length > 0)
      arr = arr.filter((e) => subTypeFilter.includes(e.sub_type));

    const finalTimeSort = timeSort || (time === "future" ? "asc" : "desc");

    arr.sort((event1, event2) =>
      finalTimeSort === "asc"
        ? new Date(event1.time).getTime() - new Date(event2.time).getTime()
        : new Date(event2.time).getTime() - new Date(event1.time).getTime(),
    );

    return arr;
  }, [events, typeFilter, subTypeFilter, timeSort, time]);

  return (
    <div
      {...rest}
      className={cn(
        "relative overflow-hidden md:flex md:flex-col",
        rest.className,
      )}
    >
      <div className="relative shrink-0 overflow-hidden px-5 py-3 md:rounded-xl md:rounded-b-none">
        <Image
          alt="Stadium"
          className="object-cover brightness-50"
          src="/images/soccer-field.jpeg"
          fill
        />
        <div className="relative mb-2 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">
            {label || (time === "past" ? "אירועים שהתקיימו" : "אירועים קרובים")}
          </p>
          {leftLink && (
            <Link
              className="pr-6 text-sm font-medium text-theme-green underline"
              href={leftLink}
            >
              לכל המשחקים
            </Link>
          )}
        </div>
        <div className="relative flex justify-between gap-2">
          <Select
            aria-label="סוג"
            size="sm"
            placeholder="סוג"
            selectionMode="multiple"
            items={availableTypeFilters}
            selectedKeys={typeFilter}
            onSelectionChange={(keys) => {
              setTypeFilter([...keys] as Topsoccer.Event.Type[]);
            }}
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
          <Select
            aria-label="סוג משני"
            size="sm"
            placeholder="סוג משני"
            selectionMode="multiple"
            items={[
              { key: "Singles", label: "יחידים" },
              { key: "Teams", label: "קבוצות" },
            ]}
            selectedKeys={subTypeFilter}
            onSelectionChange={(keys) => {
              setSubTypeFilter([...keys] as Topsoccer.Event.SubType[]);
            }}
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
          <SortButton
            aria-label="זמן"
            size="sm"
            method={timeSort}
            onMethodChange={(method) => setTimeSort(method)}
          />
        </div>
      </div>
      <ScrollShadow hideScrollBar>
        <ul className="relative flex flex-col gap-1 px-2 py-2 md:px-0">
          {finalEvents.map((event) => (
            <li key={event.id}>
              <EventCard className="w-full" event={event} />
            </li>
          ))}
        </ul>
      </ScrollShadow>
    </div>
  );
};

export default EventsListCard;
