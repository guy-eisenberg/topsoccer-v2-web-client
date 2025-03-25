"use client";

import ImageGrid from "@/app/components/common/ImageGrid/ImageGrid";
import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import FileUploader from "@/app/components/core/FileUploader";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import { getBucketFileFromURL } from "@/utils/getBucketFileFromURL";
import toast from "@/utils/toast";
import { useEffect, useMemo, useState } from "react";
import { updateImages as _updateImages } from "./actions";
import CommonActionButtons from "./components/CommonActionButtons";

export default function ManageEventImagesTab({
  event,
}: {
  event: Topsoccer.Event.Object;
}) {
  const router = useRouter();

  const [existingImages, setExistingImages] = useState(event.images);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const imageItems = useMemo(() => {
    const newImagesItems = imageFiles.map((image) =>
      URL.createObjectURL(image),
    );

    return [...existingImages, ...newImagesItems];
  }, [existingImages, imageFiles]);

  useEffect(() => {
    setExistingImages(event.images);
    setImageFiles([]);
  }, [event]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <p className="text-lg font-semibold">מדיה:</p>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-2 md:flex-row">
        <FileUploader
          className="h-full min-w-0 flex-1"
          files={imageFiles}
          onAdd={addImageFiles}
          onDelete={deleteImageFile}
        />
        {imageItems && imageItems.length > 0 && (
          <ImageGrid
            className="min-h-0 flex-1"
            images={imageItems}
            itemDeleted={deleteItem}
            showControls
          />
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button color="primary" onPress={updateImages}>
            שמור תמונות
          </Button>
        </div>
        <CommonActionButtons event={event} />
      </div>
    </div>
  );

  async function updateImages() {
    toast.loading("שומר תמונות...");
    const hideLoading = showLoading();

    try {
      const images = await uploadImages();

      await _updateImages({ event_id: event.id, images });

      await router.refresh();

      toast.success("תמונות נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }

    async function uploadImages() {
      const supabase = createClient();

      const imagesUrls = existingImages;

      await Promise.all([deleteUneededExistingImages(), uploadNewImages()]);

      return imagesUrls;

      async function deleteUneededExistingImages() {
        const imagesToDelete: string[] = [];
        if (event && event.images && event.images.length > 0) {
          const existingImagesMap: { [key: string]: boolean } = {};
          existingImages.forEach((image) => (existingImagesMap[image] = true));

          for (const image of event.images)
            if (!existingImagesMap[image]) imagesToDelete.push(image);
        }

        if (imagesToDelete.length > 0)
          await supabase.storage
            .from("images")
            .remove(
              imagesToDelete.map((img) => getBucketFileFromURL("images", img)),
            );
      }

      async function uploadNewImages() {
        for (const image of imageFiles) {
          const imageName = crypto.randomUUID();

          await supabase.storage
            .from("images")
            .upload(`events/${event.id}/${imageName}`, image);

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("images")
            .getPublicUrl(`events/${event.id}/${imageName}`);

          imagesUrls.push(publicUrl);
        }
      }
    }
  }

  function deleteItem(index: number) {
    if (index < existingImages.length) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);

      setExistingImages(newExistingImages);
    } else {
      const newImageFiles = [...imageFiles];
      newImageFiles.splice(index - existingImages.length, 1);

      setImageFiles(newImageFiles);
    }
  }

  function deleteImageFile(index: number) {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);

    setImageFiles(newImageFiles);
  }

  async function addImageFiles(newFiles: File[]) {
    const newImageFiles = [...imageFiles, ...newFiles];

    setImageFiles(newImageFiles);
  }
}
