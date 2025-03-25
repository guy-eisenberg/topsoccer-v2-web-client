"use client";

import toast from "@/utils/toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { hideAllLoading } from "./Loader/Loader";

export default function StatusToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) {
      switch (status) {
        case "signup_success":
          toast.success("נרשמת לאתר בהצלחה!");
          break;
        case "signin_success":
          toast.success("נכנסת לחשבונך בהצלחה!");
          break;
        case "signout_success":
          toast.success("יצאת מחשבונך בהצלחה!");
          break;
        case "new_password_success":
          toast.success("סיסמה עודכנה בהצלחה!");
          break;
        case "enroll_success":
          toast.success("הרשמה בוצעה בהצלחה!");
          break;
        case "unroll_success":
          toast.success("ביטול הרשמה בוצע בהצלחה!");
          break;
      }

      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete("status");
      router.replace(`${pathname}?${nextSearchParams}`);

      hideAllLoading();
    }
  }, [router, searchParams, pathname]);

  return <></>;
}
