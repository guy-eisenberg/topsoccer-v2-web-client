import { Tabs as _Tabs, cn, type TabsProps } from "@heroui/react";

export default function Tabs({ className, classNames, ...rest }: TabsProps) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col md:rounded-xl", className)}
    >
      <_Tabs
        {...rest}
        classNames={{
          ...classNames,
          tabList: cn(
            "w-full font-semibold rounded-t-none md:rounded-t-xl rounded-b-none md:border border-theme-light-gray",
            classNames?.tabList as string,
          ),
          panel: cn(
            "p-0 min-h-0 overflow-y-auto scrollbar-hide",
            classNames?.panel as string,
          ),
        }}
      />
    </div>
  );
}
