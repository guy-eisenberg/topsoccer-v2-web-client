"use client";

import { Button as _Button } from "@heroui/button";
import { extendVariants } from "@heroui/system";

export const Button = extendVariants(_Button, {
  variants: {
    color: {
      secondary: "border-theme-green border",
    },
  },
});
