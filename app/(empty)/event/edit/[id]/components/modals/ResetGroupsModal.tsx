import { Button } from "@/app/components/core/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";

interface ResetGroupsModalProps extends Omit<ModalProps, "children"> {
  resetGroups: () => Promise<void>;
}

const ResetGroupsModal: React.FC<ResetGroupsModalProps> = ({
  resetGroups,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>איפוס כוחות</ModalHeader>
            <ModalBody>
              <p>האם בטוח שברצונך לאפס את הכוחות?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                לא, חזור אחורה
              </Button>
              <Button
                color="secondary"
                onPress={async () => {
                  await resetGroups();

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

export default ResetGroupsModal;
