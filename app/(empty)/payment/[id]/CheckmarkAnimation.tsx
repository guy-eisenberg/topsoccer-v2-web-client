"use client";

import { Animation } from "@/app/components/core/Animation";
import checkmark from "./animations/checkmark.json";

export default function CheckmarkAnimation() {
  return (
    <Animation
      className="-mt-16 h-48 w-48"
      animationData={checkmark}
      loop={false}
    />
  );
}
