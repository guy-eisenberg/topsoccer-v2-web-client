import { Dropdown as _Dropdown } from "@heroui/dropdown";
import { extendVariants } from "@heroui/system";

const Dropdown = extendVariants(_Dropdown, {
  defaultVariants: {
    classNames: {
      trigger: "!transition-none data-[hover=true]:border-theme-green",
    } as any,
  },
});

export default Dropdown;
