import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/react";
import { useEffect, useState } from "react";

export default function UpdateUserWalletModal({
  initialWallet,
  submit,
  ...rest
}: { initialWallet: number; submit: (wallet: number) => void } & Omit<
  ModalProps,
  "children"
>) {
  const [wallet, setWallet] = useState(initialWallet);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWallet(initialWallet);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [rest.isOpen, initialWallet]);

  return (
    <Modal {...rest} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>עדכן יתרת ניקובים</ModalHeader>
            <ModalBody className="gap-0 text-sm">
              <Input
                type="number"
                value={wallet.toString()}
                isInvalid={wallet < 0}
                onChange={(e) => {
                  setWallet(parseInt(e.target.value));
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="button" onPress={onClose}>
                סגור
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  submit(wallet);
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
