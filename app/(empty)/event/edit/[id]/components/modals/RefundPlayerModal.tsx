import { Button } from "@/app/components/core/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/react";

interface RefundPlayerModalProps extends Omit<ModalProps, "children"> {
  player: { display_name: string };
  refundPlayer: () => Promise<void>;
}

const RefundPlayerModal: React.FC<RefundPlayerModalProps> = ({
  player,
  refundPlayer,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>החזר כספי</ModalHeader>
            <ModalBody>
              <p>בטוח שברצונך לבצע זיכוי כספי ל {player.display_name}?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                לא, חזור אחורה
              </Button>
              <Button
                color="secondary"
                onPress={async () => {
                  await refundPlayer();

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

export default RefundPlayerModal;
