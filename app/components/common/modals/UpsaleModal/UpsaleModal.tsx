"use client";

import { Button } from "@/app/components/core/Button";
import Checkbox from "@/app/components/core/Checkbox";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpsaleModal({ banners }: { banners: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [shown, setShown] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);
  const [switchSlides, setSwitchSlides] = useState(true);

  const [hideNextTime, setHideNextTime] = useState(false);

  useEffect(() => {
    const showUpsale = searchParams.get("show-upsale");
    if (showUpsale === "true") {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete("show-upsale");
      router.replace(`${pathname}?${nextSearchParams}`);
    } else return;

    const stillHidden = isStillHidden();
    if (stillHidden) return;
    else {
      localStorage.removeItem("upsale-hidden-until");
    }

    setShown(true);
  }, [router, pathname, searchParams]);

  useEffect(() => {
    if (!switchSlides) return;

    const interval = setInterval(() => {
      setSlideIndex((index) => {
        if (index >= banners.length - 1) return 0;

        return index + 1;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [switchSlides, banners]);

  return (
    <Modal
      placement="center"
      classNames={{ base: "max-w-[unset]" }}
      isOpen={shown}
      onOpenChange={(open) => {
        if (!open) updateHideNextTime();

        setShown(open);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody>
            <div className="relative flex flex-col gap-4">
              <a href="https://shirt4u.co.il" target="_blank">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Image Zoom"
                  src={banners[slideIndex]}
                  className="mx-auto h-[75vh] w-auto overflow-hidden rounded-xl object-cover"
                />
              </a>

              <div className="flex justify-center gap-2">
                <Checkbox
                  isSelected={hideNextTime}
                  onValueChange={setHideNextTime}
                >
                  הסתר למשך 14 יום
                </Checkbox>
              </div>
              <Button className="mx-auto" color="secondary" onPress={onClose}>
                סגור
              </Button>

              <Button
                onPress={() => {
                  setSlideIndex(
                    slideIndex === 0 ? banners.length - 1 : slideIndex - 1,
                  );

                  setSwitchSlides(false);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2"
                color="secondary"
                isIconOnly
              >
                <IconCaretLeftFilled />
              </Button>
              <Button
                onPress={() => {
                  setSlideIndex(
                    slideIndex === banners.length - 1 ? 0 : slideIndex + 1,
                  );

                  setSwitchSlides(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                color="secondary"
                isIconOnly
              >
                <IconCaretRightFilled />
              </Button>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );

  function isStillHidden() {
    const hiddenUntil = localStorage.getItem("upsale-hidden-until");
    if (hiddenUntil) {
      return new Date() < new Date(hiddenUntil);
    }

    return false;
  }

  function updateHideNextTime() {
    if (hideNextTime) {
      const today = new Date();

      localStorage.setItem(
        "upsale-hidden-until",
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 14,
        ).toISOString(),
      );
    } else {
      localStorage.removeItem("upsale-hidden-until");
    }
  }
}
