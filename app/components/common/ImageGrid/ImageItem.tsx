"use client";

import { cn } from "@heroui/theme";
import { IconTrash, IconZoomIn } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../../core/Button";
import ImageExpandModal from "../modals/ImageExpandModal";

interface ImageItemProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image: string;
  showControls?: boolean;
  itemDeleted?: () => void;
}

const ImageItem: React.FC<ImageItemProps> = ({
  image,
  showControls = false,
  itemDeleted,
  ...rest
}) => {
  const [imageExpandModalOpen, setImageExpandModalOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-xl",
          rest.className,
        )}
        onClick={() => setImageExpandModalOpen(true)}
      >
        <div className="peer absolute bottom-0 left-0 right-0 top-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition hover:opacity-100">
          {showControls && (
            <Button
              className="absolute left-2 top-2"
              color="danger"
              onPress={deleteImage}
            >
              <IconTrash />
            </Button>
          )}
          <IconZoomIn className="text-white" />
          <p className="text-white">לחץ על מנת להגדיל</p>
        </div>
        <Image alt={rest.alt || ""} className="object-cover" fill src={image} />
      </div>
      <ImageExpandModal
        src={image}
        isOpen={imageExpandModalOpen}
        onOpenChange={setImageExpandModalOpen}
      />
    </>
  );

  function deleteImage() {
    if (itemDeleted) itemDeleted();
  }
};

export default ImageItem;
