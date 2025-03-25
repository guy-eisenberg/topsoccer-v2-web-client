import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import type { Topsoccer } from "../../../../types";
import { Button } from "../../core/Button";

interface WaitingListModalProps extends Omit<ModalProps, "children"> {
  user: Topsoccer.User.Auth;
  enroll: () => void;
}

const WaitingListModal: React.FC<WaitingListModalProps> = ({
  user,
  enroll,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) =>
          user.blocked ? (
            <p className="text-danger">
              המשתמש שלך חסום, פנה למנהל לקבלת עזרה.
            </p>
          ) : (
            <>
              <ModalHeader>רשימת המתנה</ModalHeader>
              <ModalBody>
                <p>בטוח שברצונך להכנס לרשימת המתנה?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="border border-theme-green"
                  color="secondary"
                  onPress={onClose}
                >
                  לא, חזור אחורה
                </Button>
                <Button color="primary" onPress={enroll}>
                  אני בטוח
                </Button>
              </ModalFooter>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
};

export default WaitingListModal;
