"use client";

import { Animation } from "@/app/components/core/Animation";
import money from "./animations/money.json";

export default function MoneyAnimation() {
  return (
    <Animation
      className="-mt-16 mb-8 h-48 w-48"
      animationData={money}
      loop={false}
    />
  );
}
