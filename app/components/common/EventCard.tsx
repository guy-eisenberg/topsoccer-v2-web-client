import type { Topsoccer } from "@/types";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { isPast } from "@/utils/isPast";
import { cn } from "@heroui/react";
import { IconClock, IconMapPin, IconVideo } from "@tabler/icons-react";
import Link from "next/link";

interface EventCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: Topsoccer.Event.Object;
  overrideUrl?: string;
  showVideoIcon?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  overrideUrl,
  showVideoIcon = true,
  ...rest
}) => {
  const dateTime = new Date(event.time).getTime();

  const time = getFormattedDate(dateTime);

  const nowOccurring = isPast(dateTime) && !isPast(dateTime + 7200 * 1000);

  const title = event.title
    .replace(event.city, "")
    .trim()
    .replace("-", "")
    .trim();

  const city = (() => {
    switch (event.city) {
      case "ראשון לציון":
        return "ראשל״צ";
      default:
        return event.city;
    }
  })();

  return (
    <Link
      {...rest}
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-theme-light-gray bg-white p-2 hover:border-theme-green dark:bg-theme-foreground",
        rest.className,
      )}
      href={overrideUrl || `/event/${event.id}`}
    >
      <div className="flex gap-1 self-stretch text-sm text-theme-gray">
        <div className="flex w-10 items-center justify-center rounded-xl bg-green-100 text-[10px] font-medium text-green-800">
          <p className="hidden md:block">{event.type}</p>
          <p className="md:hidden">{event.type.split("X")[0] + "X"}</p>
        </div>
        {nowOccurring ? (
          <div className="flex w-14 items-center justify-center rounded-xl bg-red-100 text-center text-[10px] font-medium text-red-800">
            קורה כעת
          </div>
        ) : (
          <div className="flex w-14 items-center justify-center rounded-xl bg-orange-100 text-center text-[10px] text-orange-800">
            {city}
          </div>
        )}
      </div>
      <div className="relative flex-1 overflow-hidden">
        {showVideoIcon && (
          <>
            <div className="absolute inset-0 z-[5] bg-gradient-to-l from-transparent from-80% to-white to-90% dark:to-[#3f3f46]"></div>
            <div className="absolute left-1 top-1 z-[5] rounded-full bg-purple-100 p-[5px] text-purple-800">
              <IconVideo width={12} height={12} />
            </div>
          </>
        )}
        <div className="mb-1 flex gap-2">
          <p
            className={cn(
              "overflow-hidden text-ellipsis whitespace-nowrap text-right",
              event.canceled && "line-through",
            )}
          >
            {title}
          </p>
          {event.canceled && <p className="text-danger">בוטל</p>}
        </div>
        <div className="flex gap-4 text-theme-gray">
          <div className="flex items-center gap-1">
            <IconClock width={16} height={16} />
            <p
              className="overflow-hidden text-ellipsis whitespace-nowrap text-xs"
              suppressHydrationWarning
            >{`${time?.day}.${time?.month} · ${time?.hour}:${time?.minute}`}</p>
          </div>
          <div className="flex items-center gap-1">
            <IconMapPin width={16} height={16} />
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">
              {event.address}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
