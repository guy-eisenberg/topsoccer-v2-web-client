"use client";

import BrandIcon from "@/app/components/common/icons/BrandIcon";
import GoogleIcon from "@/app/components/common/icons/GoogleIcon";
import { showLoading } from "@/app/components/common/Loader/Loader";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import toast from "@/utils/toast";
import { type AuthError } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  googleSignin as _googleSignin,
  passwordSignin as _passwordSignin,
} from "../actions";

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className="m-auto w-full max-w-md text-center"
      onSubmit={(e) => {
        e.preventDefault();

        passwordSignin();
      }}
    >
      <div className="mx-auto mb-8 h-12 w-8">
        <BrandIcon className="h-12 w-8" />
      </div>
      <div className="mb-2">
        <p className="text-2xl font-semibold">ברוך הבא לטופסוקר</p>
        <p className="text-lg">היכנס</p>
      </div>
      <Button
        className="mb-2 h-14 w-full border border-theme-light-gray bg-theme-foreground hover:border-theme-green"
        onPress={googleSignin}
        type="button"
      >
        <div className="flex items-center gap-2">
          בעזרת חשבון גוגל
          <GoogleIcon className="h-6 w-6" />
        </div>
      </Button>
      <div className="mb-2 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-theme-light-gray" />
        <span className="text-theme-gray">או</span>
        <div className="h-[1px] flex-1 bg-theme-light-gray" />
      </div>
      <div className="mb-6 flex flex-col gap-4">
        <Input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="דואר אלקטרוני"
          value={email}
          type="email"
          autoComplete="on"
        />
        <Input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          type="password"
          value={password}
          autoComplete="on"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          color="primary"
          className="h-14 w-full"
          isDisabled={
            !email
              .toLocaleLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              ) || password.length < 6
          }
          type="submit"
        >
          היכנס
        </Button>
        <div className="flex justify-between">
          <Link href="/signup">
            <u className="text-theme-green">איך לך חשבון?</u>
          </Link>
          <Link href="/forgot-password">
            <u className="text-theme-green">שכחת סיסמה?</u>
          </Link>
        </div>
      </div>
    </form>
  );

  async function passwordSignin() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const error = await _passwordSignin({ email, password });

      if (error) throw new Error(error.message);

      router.replace("/?status=signin_success");
    } catch (err) {
      hideLoading();

      const msg = getSigninErrorMessage(err as AuthError);

      if (msg) {
        toast.error(msg);
      } else {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      }
    }
  }

  async function googleSignin() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const url = await _googleSignin();

      window.location.replace(url);
    } catch (err) {
      console.log(err);
      toast.error();

      hideLoading();

      return Promise.reject(err);
    }
  }

  function getSigninErrorMessage(err: AuthError) {
    switch (err.message) {
      case "invalid_credentials":
        return "שם משתמש או סיסמה לא נכונים";
      default:
        return false;
    }
  }
}
