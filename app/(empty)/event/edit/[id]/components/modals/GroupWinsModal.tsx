"use client";

import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import type { Topsoccer } from "@/types";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { useState } from "react";

interface GropuWinsModalProps extends Omit<ModalProps, "children"> {
  group: Topsoccer.Group.FullGroup;
  setWins: (wins: number) => Promise<void>;
}

const GroupWinsModal: React.FC<GropuWinsModalProps> = ({
  group,
  setWins,
  ...rest
}) => {
  const [value, setValue] = useState(group.wins || 0);

  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>הכנס כמות נצחונות לקבוצה:</ModalHeader>
            <ModalBody>
              <Input
                type="number"
                value={value === 0 ? "" : value.toString()}
                onChange={(e) => setValue(parseInt(e.target.value))}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                בטל
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await setWins(value);

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
};

export default GroupWinsModal;
