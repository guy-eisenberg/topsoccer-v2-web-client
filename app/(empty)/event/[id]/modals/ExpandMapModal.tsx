import SoccerMap from "@/app/components/common/SoccerMap/SoccerMap";
import type { Topsoccer } from "@/types";
import { Modal, ModalBody, ModalContent, type ModalProps } from "@heroui/modal";

export default function ExpandMapModal({
  map,
  ...rest
}: { map: Topsoccer.Event.Map[] } & Omit<ModalProps, "children">) {
  return (
    <Modal placement="center" classNames={{ base: "max-w-xl" }} {...rest}>
      <ModalContent>
        <ModalBody>
          <SoccerMap
            className="h-full overflow-hidden rounded-xl"
            players={map}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
