"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import CropImageModal from "@/app/components/common/modals/CropImageModal/CropImageModal";
import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { createClient } from "@/clients/supabase/client";
import type { Topsoccer } from "@/types";
import { TIMEZONE } from "@/utils/constants";
import toast from "@/utils/toast";
import { DatePicker } from "@heroui/date-picker";
import { Skeleton } from "@heroui/skeleton";
import { fromDate, toCalendarDate } from "@internationalized/date";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  deleteAvatar as _deleteAvatar,
  updateProfile as _updateProfile,
} from "./actions";

export default function ProfileForm({
  user,
  loading = false,
}: {
  user: Topsoccer.User.Auth;
  loading?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dataMissing, setDataMissing] = useState(false);

  const nextPageUrl = useRef<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFile = useRef<File | Blob | undefined>(undefined);

  const [cropImageModalOpen, setCropImageModalOpen] = useState(false);

  const [photoURL, setPhotoURL] = useState<string | null>(user.photo_url);
  const [displayName, setDisplayName] = useState(user.display_name);
  const [tzId, setTzId] = useState(user.tz_id || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");
  const [email, setEmail] = useState(user.email || "");
  const [city, setCity] = useState(user.city || "");
  const [birthDate, setBirthDate] = useState(
    user.birth_date
      ? toCalendarDate(fromDate(new Date(user.birth_date), TIMEZONE))
      : null,
  );

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "data-missing") {
      toast.warning("יש להשלים פרטי חשבון.");

      setDataMissing(true);

      const next = searchParams.get("next");
      if (next) nextPageUrl.current = decodeURIComponent(next);
    }
  }, [searchParams]);

  return (
    <main className="m-auto w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          updateProfile();
        }}
      >
        <div className="mb-8">
          <p className="text-3xl font-semibold">עדכן את הפרופיל שלך</p>
          <p className="text-theme-gray">
            על מנת להרשם למשחקים, עלייך למלא את כלל הפרטים הבאים:
          </p>
        </div>
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="rounded-xl" isLoaded={!loading}>
            <PlayerAvatar
              className="h-24 w-24 rounded-xl object-cover"
              src={photoURL}
            />
          </Skeleton>

          <div className="flex flex-col space-y-2">
            <input
              accept="image/*"
              onChange={onImageUpload}
              type="file"
              name="avatar"
              id="avatar-input"
              ref={fileInputRef}
              hidden
            />
            <Button
              type="button"
              color="primary"
              onPress={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              isDisabled={loading}
            >
              שנה תמונה
            </Button>
            <Button
              type="button"
              color="secondary"
              isDisabled={loading || photoURL === null}
              onPress={() => {
                deleteAvatar();
              }}
            >
              מחק תמונה
            </Button>
          </div>
        </div>
        <div className="mb-6 flex flex-col gap-2">
          <Skeleton className="rounded-xl" isLoaded={!loading}>
            <Input
              placeholder="שם מלא"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Skeleton>
          <Skeleton className="rounded-xl" isLoaded={!loading}>
            <Input
              placeholder="מספר תעודת זהות"
              value={tzId}
              onChange={(e) => setTzId(e.target.value)}
            />
          </Skeleton>
          <Skeleton className="rounded-xl" isLoaded={!loading}>
            <Input
              placeholder="מספר טלפון"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Skeleton>
          <Skeleton className="rounded-xl" isLoaded={!loading}>
            <Input
              placeholder="כתובת אימייל"
              value={email}
              type="email"
              isDisabled
              onChange={(e) => setEmail(e.target.value)}
            />
          </Skeleton>
          <Skeleton className="rounded-xl" isLoaded={!loading}>
            <Input
              placeholder="מקום מגורים"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Skeleton>
          <Skeleton className="rounded-xl" isLoaded={!loading}>
            <DatePicker
              classNames={{
                input: "text-base",
              }}
              className="w-full"
              value={birthDate}
              onChange={setBirthDate}
            />
          </Skeleton>
        </div>
        <div className="flex gap-2">
          <Button
            color="secondary"
            onPress={() => router.back()}
            isDisabled={loading}
            type="button"
          >
            ביטול
          </Button>
          <Button
            type="submit"
            color="primary"
            isDisabled={
              loading ||
              displayName.length < 4 ||
              (tzId.length !== 9 && (dataMissing || tzId.length > 0)) ||
              (phoneNumber.length !== 10 &&
                (dataMissing || phoneNumber.length > 0)) ||
              !email
                .toLocaleLowerCase()
                .match(
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                ) ||
              (city.length < 2 && (dataMissing || city.length > 0)) ||
              (!birthDate && dataMissing)
            }
          >
            שמור שינויים
          </Button>
        </div>
      </form>

      {photoURL && (
        <CropImageModal
          src={photoURL}
          onSave={onImageCrop}
          isOpen={cropImageModalOpen}
          onOpenChange={setCropImageModalOpen}
        />
      )}
    </main>
  );

  function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      currentFile.current = e.target.files[0];

      const imageUrl = URL.createObjectURL(currentFile.current);

      e.target.value = "";

      setPhotoURL(imageUrl);
      setCropImageModalOpen(true);
    }
  }

  function onImageCrop(data: { file: Blob; img: string }) {
    const { file, img } = data;

    currentFile.current = file;

    setCropImageModalOpen(false);
    setPhotoURL(img);
  }

  async function updateProfile() {
    toast.loading("מעדכן פרטים...");
    const hideLoading = showLoading();

    try {
      let newPhotoURL: string | null = photoURL;
      if (currentFile.current) {
        const supabase = createClient();

        await supabase.storage
          .from("images")
          .upload(`avatars/${user.id}`, currentFile.current, { upsert: true });

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(`avatars/${user.id}`);

        newPhotoURL = publicUrl;
      }

      await _updateProfile({
        display_name: displayName,
        photo_url: newPhotoURL,
        tz_id: tzId ? tzId : null,
        phone_number: phoneNumber ? phoneNumber : null,
        email,
        city: city ? city : null,
        birth_date: birthDate ? birthDate.toString() : null,
      });

      toast.success("פרטים עודכנו בהצלחה!");

      if (nextPageUrl.current) router.replace(nextPageUrl.current);
      else router.back();
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function deleteAvatar() {
    if (photoURL === user.photo_url) {
      toast.loading("מוחק...");
      const hideLoading = showLoading();

      try {
        await _deleteAvatar();

        toast.success("תמונה נמחקה בהצלחה!");
      } catch (err) {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      } finally {
        hideLoading();
      }
    }

    setPhotoURL(currentFile.current ? user.photo_url : null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (currentFile.current) currentFile.current = undefined;
  }
}
