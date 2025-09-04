"use client";

import { Button as _Button, extendVariants } from "@heroui/react";

export const Button = extendVariants(_Button, {
  variants: {
    color: {
      secondary: "border-theme-green border",
    },
  },
});
