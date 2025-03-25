import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { Button } from "../../core/Button";

interface UnrollEventModalProps extends Omit<ModalProps, "children"> {
  unroll: () => void;
}

const UnrollEventModal: React.FC<UnrollEventModalProps> = ({
  unroll,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>ביטול הרשמה</ModalHeader>
            <ModalBody>
              <p>האם בטוח שברצונך לבטל הרשמה למשחק?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                לא, חזור אחורה
              </Button>
              <Button color="danger" onPress={unroll}>
                אני בטוח
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UnrollEventModal;
