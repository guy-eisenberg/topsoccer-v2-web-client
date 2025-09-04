import { Modal, ModalBody, ModalContent, type ModalProps } from "@heroui/react";

export default function ImageExpandModal({
  src,
  ...rest
}: { src: string } & Omit<ModalProps, "children">) {
  return (
    <Modal
      placement="center"
      classNames={{ base: "max-w-[unset]" }}
      hideCloseButton
      {...rest}
    >
      <ModalContent>
        <ModalBody>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Image Zoom"
            src={src}
            className="h-full max-h-[95vh] w-auto rounded-xl object-contain"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
