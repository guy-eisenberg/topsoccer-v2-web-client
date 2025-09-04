"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import Textarea from "@/app/components/core/Textarea";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import { EVENT_TYPES } from "@/utils/constants";
import toast from "@/utils/toast";
import { cn } from "@heroui/react";
import { useState } from "react";
import { upsertStadium as _upsertStadium } from "./actions";

export default function EditStadiumDetailsTab({
  stadium,
}: {
  stadium: Topsoccer.Stadium.FullStadium | null;
}) {
  const router = useRouter();

  const [name, setName] = useState(stadium?.name || "");
  const [description, setDescription] = useState(stadium?.description || "");
  const [city, setCity] = useState(stadium?.city || "");
  const [address, setAddress] = useState(stadium?.address || "");
  const [wazeUrl, setWazeUrl] = useState(stadium?.waze_url || "");
  const [whatsappUrl, setWhatsappUrl] = useState(stadium?.whatsapp_url || "");
  const [days, setDays] = useState(
    stadium?.days || [false, false, false, false, false, false, false],
  );
  const [types, setTypes] = useState(stadium?.types || []);

  return (
    <form className="flex h-full min-h-0 flex-1 flex-col gap-2">
      <p className="text-2xl font-semibold">
        {name || (stadium ? "ערוך מגרש קיים" : "צור מגרש חדש")}
      </p>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        <Input
          className="w-full"
          placeholder="שם מגרש"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          className="w-full"
          placeholder="עיר"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          className="w-full"
          placeholder="כתובת"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          className="w-full"
          placeholder="קישור Waze"
          value={wazeUrl}
          onChange={(e) => setWazeUrl(e.target.value)}
        />
        <Input
          className="w-full"
          placeholder="קישור Whatsapp"
          value={whatsappUrl}
          onChange={(e) => setWhatsappUrl(e.target.value)}
        />
        <Textarea
          style={{ resize: "none" }}
          className="min-h-[256px] w-full flex-1"
          placeholder="תיאור מגרש"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex items-center gap-4">
          <span>ימי פעילות:</span>
          <div className="flex overflow-hidden rounded-xl border border-black">
            {days.map((active, i) => (
              <button
                className={cn(
                  "w-12 py-2 text-center hover:brightness-95",
                  active
                    ? "bg-theme-green text-white"
                    : "bg-theme-foreground text-theme-gray",
                  i < 6 && "border-l border-black",
                )}
                onClick={(e) => {
                  e.preventDefault();

                  const newDays = [...days];
                  newDays[i] = !active;

                  setDays(newDays);
                }}
                key={i}
              >
                {["א", "ב", "ג", "ד", "ה", "ו", "ש"][i]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>סוגי משחקים :</span>
          <div className="flex overflow-hidden rounded-xl border border-black">
            {EVENT_TYPES.map((type, i) => (
              <button
                className={cn(
                  "w-16 py-2 text-center hover:brightness-95",
                  types.includes(type)
                    ? "bg-theme-green text-white"
                    : "bg-theme-foreground text-theme-gray",
                  i < EVENT_TYPES.length - 1 && "border-l border-black",
                )}
                onClick={(e) => {
                  e.preventDefault();

                  const newTypes = [...types];

                  const removeIndex = newTypes.findIndex((t) => t === type);

                  if (removeIndex === -1) newTypes.push(type);
                  else newTypes.splice(removeIndex, 1);

                  setTypes(newTypes);
                }}
                key={i}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button color="secondary" onPress={() => router.back()}>
          חזור
        </Button>

        <Button color="primary" onPress={upsertStadium}>
          {stadium ? "שמור שינויים" : "צור אצטדיון"}
        </Button>
      </div>
    </form>
  );

  async function upsertStadium() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const id = await _upsertStadium({
        id: stadium?.id,
        name,
        description: description ? description : null,
        city,
        address,
        waze_url: wazeUrl ? wazeUrl : null,
        whatsapp_url: whatsappUrl ? whatsappUrl : null,
        days,
        types,
      });

      if (stadium) await router.refresh();
      else await router.replace(`/stadium/edit/${id}`);

      toast.success(stadium ? "שינויים נשמרו בהצלחה!" : "מגרש נוצר בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
