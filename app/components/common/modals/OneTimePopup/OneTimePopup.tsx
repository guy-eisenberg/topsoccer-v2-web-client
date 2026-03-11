"use client";

import { Button } from "@/app/components/core/Button";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { useEffect, useState } from "react";

type OneTimePopupProps = {
  id: string;
  ctaText?: string;
  children: React.ReactNode;
};

export default function OneTimePopup({
  id,
  ctaText = "סגור",
  children,
}: OneTimePopupProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(storageKey(id))) {
      setShown(true);
    }
  }, [id]);

  function handleClose() {
    localStorage.setItem(storageKey(id), "true");
    setShown(false);
  }

  return (
    <Modal
      placement="center"
      scrollBehavior="inside"
      isOpen={shown}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className="flex flex-col gap-4 pb-6 pt-4">
            {children}
            <Button className="w-full self-center" color="secondary" onPress={onClose}>
              {ctaText}
            </Button>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}

function storageKey(id: string) {
  return `popup-seen-${id}`;
}
