"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import { useEffect } from "react";

export default function EventPageLoading() {
  useEffect(() => {
    const hideLoading = showLoading();

    return () => {
      hideLoading();
    };
  }, []);

  return <></>;
}
