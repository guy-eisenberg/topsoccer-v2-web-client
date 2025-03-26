"use client";

import BrandIcon from "@/app/components/common/icons/BrandIcon";
import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import toast from "@/utils/toast";
import { useState } from "react";
import { resetPassword as _resetPassword } from "../actions";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  return (
    <form
      className="text-center"
      onSubmit={(e) => {
        e.preventDefault();

        resetPassword();
      }}
    >
      <div className="flex flex-col">
        <div className="mx-auto mb-8 h-12 w-8">
          <BrandIcon className="h-12 w-8" />
        </div>
        <p className="text-2xl font-semibold">איפוס סיסמה</p>
        <p className="mt-4">
          הכנס את כתובת האימייל איתה נרשמת לאתר, ומיד נשלח לך לינק לאיפוס סיסמה:
        </p>
        <Input
          className="mt-2"
          placeholder="דואר אלקטרוני"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Button
          color="primary"
          className="mt-6 h-14"
          isDisabled={
            !email
              .toLocaleLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              )
          }
          type="submit"
        >
          איפוס סיסמה
        </Button>
      </div>
    </form>
  );

  async function resetPassword() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _resetPassword({ email });

      toast.success("לינק לאיפוס סיסמה נשלח לכתובת האימייל");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
