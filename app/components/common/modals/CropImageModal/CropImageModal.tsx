import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "../../../core/Button";
import getCroppedImg from "./utils";

export default function CropImageModal({
  src,
  aspect = 1,
  onSave: _onSave,
  ...rest
}: {
  src: string;
  aspect?: number;
  onSave: (data: { file: Blob; img: string }) => void;
} & Omit<ModalProps, "children">) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  return (
    <Modal
      placement="center"
      classNames={{ base: "max-w-[unset]" }}
      hideCloseButton
      {...rest}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>חתוך תמונה</ModalHeader>
            <ModalBody className="items-center">
              <div className="relative h-[75vh] w-[75vw]">
                <Cropper
                  image={src}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedAreaPixels) => {
                    setCroppedAreaPixels(croppedAreaPixels);
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                חזור
              </Button>
              <Button color="primary" onPress={onSave}>
                שמור
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  async function onSave() {
    if (!croppedAreaPixels) return src;

    const data = await getCroppedImg(src, croppedAreaPixels);
    if (!data) return;

    _onSave(data);
  }
}
