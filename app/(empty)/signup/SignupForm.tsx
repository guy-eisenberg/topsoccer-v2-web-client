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
import { googleSignin as _googleSignin, signup as _signup } from "../actions";

export default function SignupForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  return (
    <form
      className="m-auto w-full max-w-md text-center"
      onSubmit={(e) => {
        e.preventDefault();

        passwordSignup();
      }}
    >
      <div className="mx-auto mb-8 h-12 w-8">
        <BrandIcon className="h-12 w-8" />
      </div>
      <div className="mb-2">
        <p className="text-2xl font-semibold">ברוך הבא לטופסוקר</p>
        <p className="text-lg">צור חשבון חדש</p>
      </div>
      <Button
        className="mb-2 h-14 w-full border border-theme-light-gray bg-theme-card hover:border-theme-green"
        onPress={googleSignup}
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
        <div className="flex gap-2">
          <Input
            className="w-1/2"
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="שם פרטי"
            value={firstName}
          />
          <Input
            className="w-1/2"
            onChange={(e) => setLastName(e.target.value)}
            placeholder="שם משפחה"
            value={lastName}
          />
        </div>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="דואר אלקטרוני"
          value={email}
          type="email"
        />
        <Input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          type="password"
          value={password}
        />
        <Input
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="אימות סיסמה"
          type="password"
          value={repeatPassword}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          color="primary"
          className="mb-3 h-14 w-full"
          isDisabled={
            firstName.length < 2 ||
            lastName.length < 2 ||
            !email
              .toLocaleLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              ) ||
            password.length < 6 ||
            repeatPassword !== password
          }
          type="submit"
        >
          הירשם
        </Button>
        <Link href="/signin">
          <u className="text-theme-green">כבר יש לך חשבון?</u>
        </Link>
      </div>
    </form>
  );

  async function passwordSignup() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _signup({ firstName, lastName, email, password });

      router.replace("/status=signup_success");
    } catch (err) {
      hideLoading();

      const msg = getSignupErrorMessage(err as AuthError);

      if (msg) {
        toast.error(msg);
      } else {
        console.log(err);
        toast.error();

        return Promise.reject(err);
      }
    }
  }

  async function googleSignup() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const url = await _googleSignin();

      window.location.replace(url);
    } catch (err) {
      const msg = getSignupErrorMessage(err as AuthError);

      if (msg) {
        toast.error(msg);
      } else {
        console.log(err);
        toast.error();

        hideLoading();

        return Promise.reject(err);
      }
    }
  }

  function getSignupErrorMessage(err: AuthError) {
    switch (err.message) {
      case "User already registered":
        return "כתובת אימייל כבר בשימוש";
      default:
        return err.message;
    }
  }
}
