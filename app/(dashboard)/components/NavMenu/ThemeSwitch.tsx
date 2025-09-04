"use client";

import { Select } from "@/app/components/core/Select";
import { SelectItem } from "@/app/components/core/SelectItem";
import {
  IconMoonFilled,
  IconSunFilled,
  IconSunMoon,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="border-theme-light-gray bg-default-100 flex items-center justify-between gap-4 rounded-xl border px-3 py-2 md:mt-auto">
      <span className="font-semibold">מצב תאורה:</span>
      <Select
        aria-label="Theme Select"
        className="flex-1"
        selectedKeys={[theme || "system"]}
        onChange={(e) => {
          setTheme(e.target.value);
        }}
        endContent={(() => {
          switch (theme) {
            case "system":
              return <IconSunMoon className="h-4 w-4" />;
            case "dark":
              return <IconMoonFilled className="h-4 w-4" />;
            case "light":
              return <IconSunFilled className="h-4 w-4" />;
            default:
              return <IconSunMoon className="h-4 w-4" />;
          }
        })()}
        disallowEmptySelection
      >
        <SelectItem
          key="system"
          endContent={<IconSunMoon className="h-4 w-4" />}
          hideSelectedIcon
        >
          אוטומטי
        </SelectItem>
        <SelectItem
          key="dark"
          endContent={<IconMoonFilled className="h-4 w-4" />}
          hideSelectedIcon
        >
          חשוך
        </SelectItem>
        <SelectItem
          key="light"
          endContent={<IconSunFilled className="h-4 w-4" />}
          hideSelectedIcon
        >
          בהיר
        </SelectItem>
      </Select>
    </div>
  );
}
