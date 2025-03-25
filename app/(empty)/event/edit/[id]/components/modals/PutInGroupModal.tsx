import GroupIcon from "@/app/components/common/GroupIcon";
import { Button } from "@/app/components/core/Button";
import type { Topsoccer } from "@/types";
import { GROUPS } from "@/utils/constants";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { IconWashDryclean } from "@tabler/icons-react";

interface PutInGroupModalProps extends Omit<ModalProps, "children"> {
  putPlayerInGroup: (groupName: Topsoccer.Group.Name) => Promise<void>;
  removePlayerFromGroup: () => Promise<void>;
}

const PutInGroupModal: React.FC<PutInGroupModalProps> = ({
  putPlayerInGroup,
  removePlayerFromGroup,
  ...rest
}) => {
  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>בחר צבע:</ModalHeader>
            <ModalBody>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="lg"
                  className="border-theme-light-gray hover:border-theme-green"
                  color="secondary"
                  onClick={async () => {
                    await removePlayerFromGroup();

                    onClose();
                  }}
                  isIconOnly
                >
                  <IconWashDryclean className="text-theme-gray" />
                </Button>
                {GROUPS.map((group) => (
                  <Button
                    size="lg"
                    className="border-theme-light-gray hover:border-theme-green"
                    color="secondary"
                    key={group}
                    onClick={async () => {
                      await putPlayerInGroup(group);

                      onClose();
                    }}
                    isIconOnly
                  >
                    <GroupIcon color={group} />
                  </Button>
                ))}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PutInGroupModal;
