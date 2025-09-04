"use client";

import { Select as _Select, extendVariants } from "@heroui/react";

export const Select = extendVariants(_Select, {
  defaultVariants: {
    classNames: {
      trigger:
        "shadow-none border border-theme-light-gray bg-white dark:bg-default-100 data-[hover=true]:bg-white hover:!border-theme-green/75 data-[focus=true]:border-theme-green data-[open=true]:border-theme-green",
      selectorIcon: "static",
    } as any,
  },
});
