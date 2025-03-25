"use client";

import ImageGrid from "@/app/components/common/ImageGrid/ImageGrid";
import ImageItem from "@/app/components/common/ImageGrid/ImageItem";
import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import FileUploader from "@/app/components/core/FileUploader";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import { getBucketFileFromURL } from "@/utils/getBucketFileFromURL";
import toast from "@/utils/toast";
import { useMemo, useState } from "react";
import { updateImages as _updateImages } from "./actions";

export default function EditStadiumImagesTab({
  stadium,
}: {
  stadium: Topsoccer.Stadium.FullStadium;
}) {
  const router = useRouter();

  const [mainImage, setMainImage] = useState<string | File | null>(
    stadium.main_image,
  );
  const [existingImages, setExistingImages] = useState<string[]>(
    stadium.images,
  );
  const [imageFiles, setImages] = useState<File[]>([]);

  const mainImageItem: string | undefined = useMemo(() => {
    if (!mainImage) return undefined;

    if (typeof mainImage === "string") return mainImage;

    return URL.createObjectURL(mainImage);
  }, [mainImage]);

  const imageItems = useMemo(() => {
    const newImagesItems = imageFiles.map((image) =>
      URL.createObjectURL(image),
    );

    return [...existingImages, ...newImagesItems];
  }, [existingImages, imageFiles]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2">
      <p className="text-lg font-semibold">תמונה ראשית:</p>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-2 md:flex-row">
        <FileUploader
          className="h-full flex-1"
          files={mainImage instanceof File ? [mainImage] : []}
          onAdd={(files) => {
            setMainImage(files[0]);
          }}
          onDelete={() => {
            setMainImage(null);
          }}
        />
        {mainImage && mainImageItem && (
          <ImageItem
            className="flex-1 rounded-xl"
            image={mainImageItem}
            itemDeleted={() => setMainImage(null)}
            showControls
          />
        )}
      </div>
      <p className="text-lg font-semibold">תמונות:</p>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-2 md:flex-row">
        <FileUploader
          className="h-full flex-1"
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
      <div>
        <Button color="primary" onPress={updateImages}>
          שמור תמונות
        </Button>
      </div>
    </div>
  );

  async function updateImages() {
    toast.loading("שומר תמונות...");
    const hideLoading = showLoading();

    try {
      const { main_image, images } = await uploadImages();

      await _updateImages({
        stadium_id: stadium.id,
        main_image: main_image || null,
        images,
      });

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

      let mainImageUrl = stadium.main_image;
      const imagesUrls = existingImages;

      await Promise.all([deleteUneededExistingImages(), uploadNewImages()]);

      return { main_image: mainImageUrl, images: imagesUrls };

      async function deleteUneededExistingImages() {
        const imagesToDelete: string[] = [];
        if (stadium && stadium.images && stadium.images.length > 0) {
          const existingImagesMap: { [key: string]: boolean } = {};
          existingImages?.forEach((image) => (existingImagesMap[image] = true));

          for (const image of stadium.images)
            if (!existingImagesMap[image]) imagesToDelete.push(image);
        }

        if (mainImageUrl && (!mainImage || mainImage instanceof File)) {
          imagesToDelete.push(mainImageUrl);
          mainImageUrl = null;
        }

        if (imagesToDelete.length > 0)
          await supabase.storage
            .from("images")
            .remove(
              imagesToDelete.map((img) => getBucketFileFromURL("images", img)),
            );
      }

      async function uploadNewImages() {
        if (mainImage && mainImage instanceof File) {
          const imageName = crypto.randomUUID();

          await supabase.storage
            .from("images")
            .upload(`stadiums/${stadium.id}/${imageName}`, mainImage);

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("images")
            .getPublicUrl(`stadiums/${stadium.id}/${imageName}`);

          mainImageUrl = publicUrl;
        }

        for (const image of imageFiles) {
          const imageName = crypto.randomUUID();

          await supabase.storage
            .from("images")
            .upload(`stadiums/${stadium.id}/${imageName}`, image);

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("images")
            .getPublicUrl(`stadiums/${stadium.id}/${imageName}`);

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

      setImages(newImageFiles);
    }
  }

  function deleteImageFile(index: number) {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);

    setImages(newImageFiles);
  }

  function addImageFiles(newFiles: File[]) {
    const newImageFiles = [...imageFiles, ...newFiles];

    setImages(newImageFiles);
  }
}
