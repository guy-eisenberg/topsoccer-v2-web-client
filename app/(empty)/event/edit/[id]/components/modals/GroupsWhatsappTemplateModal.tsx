import { Button } from "@/app/components/core/Button";
import Textarea from "@/app/components/core/Textarea";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  type ModalProps,
} from "@heroui/react";
import { useState } from "react";

interface GroupsWhatsappTemplateModalProps
  extends Omit<ModalProps, "children"> {
  text: string;
  groupsTemplates: {
    name: string;
    emoji: string;
    str: string;
  }[];
}

const GroupsWhatsappTemplateModal: React.FC<
  GroupsWhatsappTemplateModalProps
> = ({ text, groupsTemplates, ...rest }) => {
  const [selectedGroupTemplate, setSelectedGroupTemplate] = useState<{
    name: string;
    emoji: string;
    str: string;
  } | null>(null);

  return (
    <Modal placement="center" hideCloseButton {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              {groupsTemplates.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  <button
                    className="shrink-0 rounded-xl border border-theme-light-gray px-3 py-2 hover:border-theme-green"
                    onClick={() => setSelectedGroupTemplate(null)}
                  >
                    <span>כללי</span>
                  </button>
                  {groupsTemplates.map((group) => (
                    <button
                      className="shrink-0 rounded-xl border border-theme-light-gray px-3 py-2 hover:border-theme-green"
                      onClick={() => setSelectedGroupTemplate(group)}
                      key={group.name}
                    >
                      <span>{group.emoji}</span>
                      <span>{group.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <Textarea
                className="min-h-[384px]"
                value={selectedGroupTemplate ? selectedGroupTemplate.str : text}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                סגור
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  navigator.clipboard.writeText(
                    selectedGroupTemplate ? selectedGroupTemplate.str : text,
                  );
                }}
              >
                העתק
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GroupsWhatsappTemplateModal;
