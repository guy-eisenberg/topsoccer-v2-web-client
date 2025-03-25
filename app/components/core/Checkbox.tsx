import { Checkbox as _Checkbox, type CheckboxProps } from "@heroui/checkbox";

export default function Checkbox({ ...rest }: CheckboxProps) {
  return (
    <_Checkbox
      {...rest}
      classNames={{
        wrapper:
          "!transition-none group-data-[hover=true]:group-[&:not([data-selected])]:border group-data-[hover=true]:group-[&:not([data-selected])]:border-theme-green",
      }}
    />
  );
}
