"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "./Select";
import { SelectItem } from "./SelectItem";

export function QuerySelect({
  field,
  fallback,
  options,
  ...rest
}: React.ComponentProps<typeof Select> & {
  field: string;
  fallback?: string;
  options?: { key: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = searchParams.get(field) || fallback;

  return (
    <Select
      {...rest}
      selectedKeys={[filter as string]}
      onChange={(e) => {
        const key = e.target.value;

        const params = new URLSearchParams(searchParams.toString());
        params.set(field, key as string);

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }}
    >
      {options &&
        options.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))}
    </Select>
  );
}
