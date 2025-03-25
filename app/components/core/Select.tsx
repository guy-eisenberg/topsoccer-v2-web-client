"use client";

import { Select as _Select } from "@heroui/select";
import { extendVariants } from "@heroui/system";

export const Select = extendVariants(_Select, {
  defaultVariants: {
    classNames: {
      trigger:
        "shadow-none border border-theme-light-gray bg-white dark:bg-default-100 data-[hover=true]:bg-white hover:!border-theme-green/75 data-[focus=true]:border-theme-green data-[open=true]:border-theme-green",
    } as any,
  },
});
