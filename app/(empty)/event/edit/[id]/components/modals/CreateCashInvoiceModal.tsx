import { Button } from "@/app/components/core/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/react";

interface CancelEventModalProps extends Omit<ModalProps, "children"> {
  createCashInvoice: () => Promise<void>;
}

const CreateCashInvoiceModal: React.FC<CancelEventModalProps> = ({
  createCashInvoice,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>הפקת חשבונית</ModalHeader>
            <ModalBody>
              <p>האם בטוח שברצונך להפיק חשבונית?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                לא, חזור אחורה
              </Button>
              <Button
                color="secondary"
                onPress={async () => {
                  await createCashInvoice();

                  onClose();
                }}
              >
                אני בטוח
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateCashInvoiceModal;
