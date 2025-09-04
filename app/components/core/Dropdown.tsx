import { Dropdown as _Dropdown, extendVariants } from "@heroui/react";

const Dropdown = extendVariants(_Dropdown, {
  defaultVariants: {
    classNames: {
      trigger: "!transition-none data-[hover=true]:border-theme-green",
    } as any,
  },
});

export default Dropdown;
