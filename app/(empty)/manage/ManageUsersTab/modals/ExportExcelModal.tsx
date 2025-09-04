import { Button } from "@/app/components/core/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  type ModalProps,
  type RadioProps,
} from "@heroui/react";
import { IconChartPieFilled, IconCircleFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function ExportExcelModal({
  submit,
  ...rest
}: { submit: (option: string) => void } & Omit<ModalProps, "children">) {
  const [exportOption, setExportOption] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExportOption(null);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [rest.isOpen]);

  return (
    <Modal {...rest} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>מה ברצונך לייצא?</ModalHeader>
            <ModalBody>
              <RadioGroup value={exportOption} onValueChange={setExportOption}>
                {EXPORT_OPTIONS.map((option) => (
                  <ExportOptionRadio value={option.key} key={option.key}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-xl">
                        {option.icon}
                      </div>
                      <div>
                        <p>{option.label}</p>
                        <p className="text-xs text-[#808080]">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </ExportOptionRadio>
                ))}
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" type="button" onPress={onClose}>
                סגור
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  submit(exportOption!);
                  onClose();
                }}
                isDisabled={!exportOption}
              >
                המשך
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function ExportOptionRadio({ children, ...rest }: RadioProps) {
  return (
    <Radio
      {...rest}
      classNames={{
        base: "flex-row-reverse justify-between max-w-[unset] border border-theme-light-gray rounded-xl m-0 data-[selected=true]:border-theme-green data-[selected=true]:bg-theme-green/5",
      }}
    >
      {children}
    </Radio>
  );
}

const EXPORT_OPTIONS = [
  {
    key: "all",
    label: "הכל",
    description: "יצא את כל הנתונים במסד.",
    icon: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-theme-green to-theme-bg/20">
        <IconCircleFilled className="text-black/80" />
      </div>
    ),
  },
  {
    key: "current",
    label: "חלקי",
    description: "יצא רק את הנתונים הנראים כעת בטבלה.",
    icon: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-theme-green to-theme-bg/20">
        <IconChartPieFilled className="text-black/80" />
      </div>
    ),
  },
];
