"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { Select } from "@/app/components/core/Select";
import { SelectItem } from "@/app/components/core/SelectItem";
import { useRouter } from "@/context/RouterContext";
import toast from "@/utils/toast";
import { setSetting as _setSetting } from "./actions";

export default function ManageSettingsTabContent({
  settings: { player_profile_default_viewmode },
}: {
  settings: {
    player_profile_default_viewmode: "last_events" | "stats";
  };
}) {
  const router = useRouter();

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap">מצב פרופיל שחקן ברירת מחדל:</span>
        <Select
          selectedKeys={[player_profile_default_viewmode]}
          onChange={(e) => {
            const value = e.target.value as "last_events" | "stats";

            setSetting("player_profile_default_viewmode", value);
          }}
          selectionMode="single"
          disallowEmptySelection
        >
          <SelectItem key="stats">סטטיסטיקות</SelectItem>
          <SelectItem key="last_events">משחקים אחרונים</SelectItem>
        </Select>
      </div>
    </div>
  );

  async function setSetting(key: string, value: string) {
    toast.loading("שומר...");
    const hideLoading = showLoading();

    try {
      await _setSetting(key, value);

      await router.refresh();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
