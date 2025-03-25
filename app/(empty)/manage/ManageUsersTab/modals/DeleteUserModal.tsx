import { Button } from "@/app/components/core/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";

export default function DeleteUserModal({
  name,
  submit,
  ...rest
}: { name: string; submit: () => void } & Omit<ModalProps, "children">) {
  return (
    <Modal {...rest} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>מחק משתמש</ModalHeader>
            <ModalBody className="gap-0 text-sm">
              <p>האם בטוח שברצונך למחוק את {name}?</p>
              <p className="font-medium text-danger">זו פעולה בלתי הפיכה!</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="button" onPress={onClose}>
                סגור
              </Button>
              <Button
                onPress={() => {
                  submit();
                  onClose();
                }}
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
