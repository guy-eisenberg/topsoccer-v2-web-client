import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { Button } from "./Button";

export interface SortButtonProps {
  method: "desc" | "asc" | undefined;
  onMethodChange?: (method: "desc" | "asc" | undefined) => void;
}

export const SortButton: React.FC<
  React.ComponentProps<typeof Button> & SortButtonProps
> = ({ method, onMethodChange, ...rest }) => {
  const Icon = (() => {
    switch (method) {
      case undefined:
        return <IconSelector className="h-4 w-4" />;
      case "asc":
        return <IconChevronUp className="h-4 w-4 transition" />;
      case "desc":
        return <IconChevronUp className="h-4 w-4 rotate-180 transition" />;
    }
  })();

  return (
    <Button
      {...rest}
      className="border border-theme-light-gray bg-white hover:!opacity-100 data-[hover=true]:border-theme-green dark:bg-theme-card"
      endContent={Icon}
      onPress={onPress}
    >
      זמן
    </Button>
  );

  function onPress() {
    let newMethod: "desc" | "asc" | undefined;
    switch (method) {
      case undefined:
        newMethod = "asc";
        break;
      case "asc":
        newMethod = "desc";
        break;
      case "desc":
        newMethod = undefined;
        break;
    }

    if (onMethodChange) onMethodChange(newMethod);
  }
};
