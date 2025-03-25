"use client";

import { Tab, type TabsProps } from "@heroui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Tabs from "./Tabs";

export default function QueryTabs({
  options,
  field,
  fallback,
  ...rest
}: {
  options: ({ key: string; title: string } | null)[];
  field: string;
  fallback?: string;
} & TabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = searchParams.get(field) || fallback;

  return (
    <Tabs
      {...rest}
      className="flex-initial pb-2"
      classNames={{
        ...rest.classNames,
        panel: "hidden",
      }}
      selectedKey={filter}
      onSelectionChange={(key) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(field, key as string);

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }}
    >
      {options
        .filter((o) => o !== null)
        .map((option) => (
          <Tab key={option.key} title={option.title} />
        ))}
    </Tabs>
  );
}
