import Textarea from "@/app/components/core/Textarea";
import { Modal, ModalBody, ModalContent, type ModalProps } from "@heroui/modal";

interface GroupsWhatsappTemplateModalProps
  extends Omit<ModalProps, "children"> {
  text: string;
}

const GroupsWhatsappTemplateModal: React.FC<
  GroupsWhatsappTemplateModalProps
> = ({ text, ...rest }) => {
  return (
    <Modal placement="center" hideCloseButton {...rest}>
      <ModalContent>
        <ModalBody>
          <Textarea className="min-h-[384px]" value={text} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GroupsWhatsappTemplateModal;
