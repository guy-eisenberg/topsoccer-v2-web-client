"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import PlayerCard from "@/app/components/common/PlayerCard";
import { Button } from "@/app/components/core/Button";
import DatePicker from "@/app/components/core/DatePicker";
import Input from "@/app/components/core/Input";
import { Select } from "@/app/components/core/Select";
import { SelectItem } from "@/app/components/core/SelectItem";
import Textarea from "@/app/components/core/Textarea";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import { calculateEventTitle } from "@/utils/calculateEventTitle";
import { EVENT_SUBTYPES, EVENT_TYPES, TIMEZONE } from "@/utils/constants";
import { getEventSubTypeLabel } from "@/utils/getEventSubTypeLabel";
import toast from "@/utils/toast";
import { cn } from "@heroui/theme";
import { fromDate, now, ZonedDateTime } from "@internationalized/date";
import { useMemo, useState } from "react";
import { upsertEvent as _upsertEvent } from "./actions";
import CommonActionButtons from "./components/CommonActionButtons";

export default function ManageEventDetailsTab({
  user,
  event,
  stadiums,
}: {
  user: Topsoccer.User.Auth;
  event:
    | (Topsoccer.Event.Object & {
        workers: Topsoccer.User.UserInterface[];
      })
    | null;
  stadiums: Topsoccer.Stadium.FullStadium[];
}) {
  const router = useRouter();

  const [stadium, setStadium] = useState<Topsoccer.Stadium.FullStadium | null>(
    stadiums.find((s) => s.id === event?.stadium_id) || null,
  );
  const [maxPlayers, setMaxPlayers] = useState<number | null>(
    event?.max_players || null,
  );
  const [price, setPrice] = useState(event?.price || 50);
  const [type, setType] = useState<Topsoccer.Event.Type>(event?.type || "5X5");
  const [subType, setSubType] = useState<Topsoccer.Event.SubType>(
    event?.sub_type || "Singles",
  );
  const [city, setCity] = useState(event?.city || "");
  const [address, setAddress] = useState(event?.address || "");
  const [dateTime, setDateTime] = useState<ZonedDateTime | null>(
    event ? fromDate(new Date(event.time), TIMEZONE) : now(TIMEZONE),
  );
  const [comment, setComment] = useState(event?.comment || "");
  const [wazeUrl, setWazeUrl] = useState(event?.waze_url || "");
  const [whatsappUrl, setWhatsappUrl] = useState(event?.whatsapp_url || "");
  const [description, setDescription] = useState(event?.description || "");

  const title = useMemo(() => {
    if (city && dateTime && type && subType) {
      const date = new Date(Date.parse(dateTime.toDate().toISOString()));

      return calculateEventTitle(city, date.getDay(), type, subType, comment);
    }

    return "";
  }, [city, dateTime, type, subType, comment]);

  const [workerEmailTerm, setWorkerEmailTerm] = useState("");

  const [workers, setWorkers] = useState<Topsoccer.User.UserInterface[]>(
    event?.workers || [],
  );

  const availableEventTypes = useMemo(() => {
    if (!stadium) return EVENT_TYPES;
    return EVENT_TYPES.filter((type) => stadium.types.includes(type));
  }, [stadium]);

  return (
    <form
      className="flex h-full min-h-0 flex-1 flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();

        upsertEvent();
      }}
    >
      <div className="flex items-center gap-2">
        <p
          className={cn(
            "text-2xl font-semibold",
            event?.canceled && "line-through",
          )}
        >
          {title || (event ? "ערוך אירוע קיים" : "צור אירוע חדש")}
        </p>
        {event?.canceled && (
          <p className="text-lg font-semibold text-danger">בוטל</p>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        <Select
          aria-label="Stadium Select"
          selectedKeys={stadium?.id ? [stadium.id] : []}
          onChange={(e) => {
            const id = e.target.value;
            const stadium = stadiums.find((stadium) => stadium.id === id);

            setStadium(stadium || null);

            if (stadium) {
              setCity(stadium.city);
              setAddress(stadium.address);
              setWazeUrl(stadium.waze_url || "");
              setWhatsappUrl(stadium.whatsapp_url || "");
            } else {
              setCity("");
              setAddress("");
              setWazeUrl("");
              setWhatsappUrl("");
            }
          }}
          items={stadiums.map((s) => ({ key: s.id, label: s.name }))}
        >
          {(item: any) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
        <div className="flex flex-wrap gap-2">
          <Input
            className="min-w-[128px] flex-1"
            placeholder="כמות שחקנים מקסימלית"
            value={maxPlayers?.toString()}
            type="number"
            onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
          />
          <Input
            className="flex-1"
            placeholder="עלות"
            value={price.toString()}
            type="number"
            onChange={(e) => setPrice(parseInt(e.target.value))}
            endContent={<span>₪</span>}
          />
          <Select
            aria-label="Event Type Select"
            className="flex-1"
            selectedKeys={[type]}
            onChange={(e) => {
              setType(e.target.value as Topsoccer.Event.Type);
            }}
            items={availableEventTypes.map((t) => ({
              key: t,
              label: t,
            }))}
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
          <Select
            aria-label="Event Sub-Type Select"
            className="flex-1"
            selectedKeys={[subType]}
            onChange={(e) => {
              setSubType(e.target.value as Topsoccer.Event.SubType);
            }}
            items={EVENT_SUBTYPES.map((t) => ({
              key: t,
              label: getEventSubTypeLabel(t),
            }))}
          >
            {(item: any) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
        </div>
        <div className="flex gap-2">
          <Input
            className="w-2/5"
            placeholder="עיר"
            isDisabled={stadium !== null}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            className="w-3/5"
            placeholder="מקום/כתובת"
            isDisabled={stadium !== null}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div dir="ltr">
          <DatePicker
            value={dateTime}
            onChange={setDateTime as any}
            calendarProps={{ style: { direction: "ltr" } }}
            hourCycle={24}
            hideTimeZone
            showMonthAndYearPickers
            suppressHydrationWarning
          />
        </div>
        <Input
          className="w-full"
          placeholder="הערות"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Input
          className="w-full"
          placeholder="Waze קישור"
          value={wazeUrl}
          isDisabled={stadium !== null}
          onChange={(e) => setWazeUrl(e.target.value)}
        />
        <Input
          className="w-full"
          placeholder="Whatsapp קישור"
          value={whatsappUrl}
          isDisabled={stadium !== null}
          onChange={(e) => setWhatsappUrl(e.target.value)}
        />
        <Textarea
          className="min-h-[320px] w-full flex-1"
          placeholder="תיאור אירוע"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {user.role === "admin" && (
          <>
            <div className="flex items-center gap-6">
              <p className="font-semibold">הוסף עובדים:</p>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Input
                  className="min-w-0 flex-1"
                  placeholder="חפש לפי אימייל או מספר טלפון"
                  value={workerEmailTerm}
                  onChange={(e) => setWorkerEmailTerm(e.target.value)}
                />
                <Button
                  color="primary"
                  isDisabled={workerEmailTerm.length === 0}
                  onPress={addWorker}
                  type="button"
                >
                  הוסף
                </Button>
              </div>
            </div>
            {workers && workers.length > 0 && (
              <ul className="space-y-2">
                {workers.map((worker, i) => (
                  <li key={worker.id}>
                    <PlayerCard
                      player={worker}
                      index={i}
                      onDelete={(index) => {
                        const workersCopy = [...workers];

                        workersCopy.splice(index, 1);

                        setWorkers(workersCopy);
                      }}
                      showStats={false}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className="flex justify-between gap-4">
        <Button className="shrink-0" color="primary" type="submit">
          {event ? "שמור שינויים" : "צור אירוע"}
        </Button>
        {event && <CommonActionButtons event={event} />}
      </div>
    </form>
  );

  async function upsertEvent() {
    toast.loading(event ? "שומר שינויים..." : "יוצר אירוע...");
    const hideLoading = showLoading();

    try {
      const eventId = await _upsertEvent({
        event: {
          id: event ? event.id : null,
          address,
          city,
          comment: comment ? comment : null,
          description: description ? description : null,
          price,
          max_players: maxPlayers ? maxPlayers : null,
          time: dateTime!.toAbsoluteString(),
          title,
          type,
          sub_type: subType,
          waze_url: wazeUrl ? wazeUrl : null,
          whatsapp_url: whatsappUrl ? whatsappUrl : null,
          stadium_id: stadium ? stadium.id : null,
        },
        workers: workers.map((w) => w.id),
      });

      await router.replace(`/event/edit/${eventId}`);

      toast.success(event ? "שינויים נשמרו בהצלחה!" : "אירוע נוצר בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function addWorker() {
    toast.loading("מוצא שחקן...");
    const hideLoading = showLoading();

    const supabase = createClient();

    try {
      const { data: worker, error } = await supabase
        .rpc("z2_get_worker_by_email", {
          _email_term: workerEmailTerm,
        })
        .maybeSingle<Topsoccer.User.UserInterface>();

      if (error) throw error;

      if (!worker) {
        toast.error("עובד לא נמצא.");
        return;
      }

      if (worker.id === user.id) {
        toast.warning("לא ניתן להוסיף את עצמך.");
        return;
      }

      if (workers.map((worker) => worker.id).includes(worker.id)) {
        toast.warning("לא ניתן להוסיף עובד יותר מפעם אחת.");
        return;
      }

      toast.dismiss();
      setWorkerEmailTerm("");
      setWorkers([...workers, worker]);
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
