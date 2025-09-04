"use client";

import { DatePicker as __DatePicker, extendVariants } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";

const _DatePicker = extendVariants(__DatePicker, {
  defaultVariants: {
    classNames: {
      input: "text-base",
      inputWrapper:
        "border border-theme-light-gray dark:focus-within:hover:bg-default-100 focus-within:hover:bg-white shadow-none bg-white dark:bg-default-100 group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-default-100 dark:data-[hover=true]:bg-default-100 data-[hover=true]:bg-white group-data-[focus=true]:border-theme-green hover:border-theme-green/75",
    } as any,
  },
});

export default function DatePicker(
  props: React.ComponentProps<typeof _DatePicker>,
) {
  return (
    <I18nProvider locale="he-IL">
      <_DatePicker {...props} />
    </I18nProvider>
  );
}
