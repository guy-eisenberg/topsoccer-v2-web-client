"use client";

import BrandIcon from "@/app/components/common/icons/BrandIcon";
import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import toast from "@/utils/toast";
import { type AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { changePassword as _changePassword } from "../actions";

export default function NewPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");

  return (
    <form
      className="m-auto w-full max-w-md text-center"
      onSubmit={(e) => {
        e.preventDefault();

        changePassword();
      }}
    >
      <div className="flex flex-col">
        <div className="mx-auto mb-8 h-12 w-8">
          <BrandIcon className="h-12 w-8" />
        </div>
        <p className="text-2xl font-semibold">שינוי סיסמה</p>
        <Input
          className="mt-6"
          placeholder="סיסמה חדשה"
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          color="primary"
          className="mt-4 h-14"
          isDisabled={password.length < 6}
          type="submit"
        >
          שנה סיסמה
        </Button>
      </div>
    </form>
  );

  async function changePassword() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _changePassword({ password });

      router.replace("/?status=new_password_success");
    } catch (err) {
      hideLoading();

      const msg = getNewPasswordErrorMessage(err as AuthError);

      if (msg) {
        toast.error(msg);
      } else {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      }
    }
  }

  function getNewPasswordErrorMessage(err: AuthError) {
    switch (err.message) {
      case "New password should be different from the old password.":
        return "נדרשת סיסמה שונה מהקודמת";
      default:
        return false;
    }
  }
}
