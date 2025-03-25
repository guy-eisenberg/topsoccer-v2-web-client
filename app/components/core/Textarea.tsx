"use client";

import { Textarea as _Textarea } from "@heroui/input";
import { extendVariants } from "@heroui/system";

const Textarea = extendVariants(_Textarea, {
  defaultVariants: {
    disableAutosize: "true",
    classNames: {
      input: "h-full flex-1 text-base",
      innerWrapper: "h-full flex-1 flex flex-col",
      inputWrapper:
        "border flex-1 flex-col border-theme-light-gray h-full shadow-none bg-white dark:bg-default-100 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-default-100 dark:data-[hover=true]:bg-default-100 data-[hover=true]:bg-white group-data-[focus=true]:border-theme-green hover:border-theme-green/75",
    } as any,
    style: {
      height: "100%",
    } as any,
  },
});

export default Textarea;
