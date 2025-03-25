"use client";

import isSafariAgent from "@/utils/isSafariAgent";
import { Skeleton } from "@heroui/skeleton";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function HLSPlayer({
  src,
  autoplay = true,
  controls = false,
  onVideoPlay,
  onVideoPause,
  ...rest
}: React.HTMLAttributes<HTMLVideoElement> & {
  src: string;
  autoplay?: boolean;
  controls?: boolean;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
}) {
  const [loading, setLoading] = useState(true);

  const videoPlayer = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoPlayer.current) return;

    let hls: Hls;

    if (Hls.isSupported() && !isSafariAgent()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(videoPlayer.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
      });
    } else if (
      videoPlayer.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      videoPlayer.current.src = src;
    }

    return () => {
      hls.destroy();
    };
  }, [src]);

  useEffect(() => {
    const player = videoPlayer.current;
    if (!player) return;

    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);

    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };

    function onPlay() {
      if (onVideoPlay) onVideoPlay();
    }

    function onPause() {
      if (onVideoPause) onVideoPause();
    }
  }, [onVideoPause, onVideoPlay]);

  return (
    <Skeleton className="h-full w-full rounded-xl" isLoaded={!loading}>
      <video
        {...rest}
        className="h-full w-full rounded-xl object-cover"
        id="hls-player"
        ref={videoPlayer}
        muted={true}
        autoPlay={autoplay}
        controls={controls}
        playsInline
      />
    </Skeleton>
  );
}
