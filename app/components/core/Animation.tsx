import { useMounted } from "@/hooks/useMounted";
import { type LottieComponentProps } from "lottie-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function Animation(props: LottieComponentProps) {
  const mounted = useMounted();

  if (!mounted) return null;

  return <Lottie {...props} />;
}
