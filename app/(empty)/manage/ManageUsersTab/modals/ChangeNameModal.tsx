import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";

export default function ChangeNameModal({
  initialName = "",
  submit,
  ...rest
}: { initialName?: string; submit: (name: string) => void } & Omit<
  ModalProps,
  "children"
>) {
  const [name, setName] = useState(initialName);

  return (
    <Modal {...rest} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>רשום שם חדש:</ModalHeader>
            <ModalBody>
              <Input
                variant="bordered"
                size="lg"
                endContent={
                  <IconUser className="flex-shrink-0 text-2xl text-default-400" />
                }
                value={name}
                isInvalid={name.length < 4}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" type="button" onPress={onClose}>
                סגור
              </Button>
              <Button
                color="primary"
                isDisabled={name.length < 4}
                onPress={() => {
                  submit(name);
                  onClose();
                }}
              >
                שמור
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
