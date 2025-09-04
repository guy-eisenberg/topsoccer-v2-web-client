import { Button } from "@/app/components/core/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/react";

interface RemovePlayerModalProps extends Omit<ModalProps, "children"> {
  player: { display_name: string };
  removePlayer: () => Promise<void>;
}

const RemovePlayerModal: React.FC<RemovePlayerModalProps> = ({
  player,
  removePlayer,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>מחיקת משתתף</ModalHeader>
            <ModalBody>
              <p className="font-semibold">
                בטוח שברצונך למחוק את {player.display_name}?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                לא, חזור אחורה
              </Button>
              <Button
                color="secondary"
                onPress={async () => {
                  await removePlayer();

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

export default RemovePlayerModal;
