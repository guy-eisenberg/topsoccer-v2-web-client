"use client";

import { SelectItem as _SelectItem, extendVariants } from "@heroui/react";

export const SelectItem = extendVariants(_SelectItem, {
  defaultVariants: {
    classNames: {
      base: "border border-transparent data-[hover=true]:border-theme-green data-[hover=true]:!bg-[unset]",
    } as any,
  },
});
