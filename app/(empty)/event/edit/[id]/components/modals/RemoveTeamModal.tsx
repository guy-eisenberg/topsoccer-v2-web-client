import { Button } from "@/app/components/core/Button";
import type { Topsoccer } from "@/types";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/react";

interface RemoveTeamModalProps extends Omit<ModalProps, "children"> {
  team: Topsoccer.Team.FullTeam;
  removeTeam: () => Promise<void>;
}

const RemoveTeamModal: React.FC<RemoveTeamModalProps> = ({
  team,
  removeTeam,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>מחיקת קבוצה</ModalHeader>
            <ModalBody>
              <p>בטוח שברצונך למחוק את {team.name}?</p>
              <p className="text-sm font-semibold text-danger">
                הסרת הקבוצה לא תזכה את השחקנים באופן אוטומטי!
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                לא, חזור אחורה
              </Button>
              <Button
                color="secondary"
                onPress={async () => {
                  await removeTeam();

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

export default RemoveTeamModal;
