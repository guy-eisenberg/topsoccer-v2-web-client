"use client";

import {
  Avatar as _Avatar,
  type AvatarProps as _AvatarProps,
} from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { cn } from "@heroui/theme";
import _Image, { type ImageProps } from "next/image";
import { forwardRef, useEffect, useState } from "react";
import { v4 } from "uuid";

export type AvatarProps = Omit<_AvatarProps, "src"> & {
  disableCache?: boolean;
  src: string | undefined | null;
};

export function Avatar({ disableCache = true, src, ...rest }: AvatarProps) {
  const [loading, setLoading] = useState(src !== null && src !== undefined);
  const [error, setError] = useState(false);

  const [version, setVersion] = useState("");

  useEffect(() => {
    if (src && !src.startsWith("blob:") && disableCache) {
      setVersion(v4());
    }

    return () => {
      setVersion("");
    };
  }, [src, disableCache]);

  return (
    <Skeleton
      {...rest}
      className={cn("shrink-0 !overflow-hidden", rest.className)}
      classNames={{ content: "w-full h-full" }}
      isLoaded={!loading}
    >
      <_Avatar
        {...rest}
        className={cn("rounded-none", rest.className)}
        ImgComponent={Image}
        imgProps={
          {
            "data-loaded": `${(!error && !loading).toString()}`,
            fill: true,
            sizes: "10vw",
            onLoad: () => {
              setLoading(false);
            },
            onError: () => {
              setLoading(false);
              setError(true);
            },
          } as never
        }
        src={
          src ? `${src}${version.length > 0 ? `?v=${version}` : ""}` : undefined
        }
        showFallback={error}
      />
    </Skeleton>
  );
}

const Image = forwardRef<
  HTMLImageElement,
  ImageProps & { disableAnimation?: boolean }
>(function Image(_props, ref) {
  const props = { ..._props };

  if (props.disableAnimation !== undefined) delete props.disableAnimation;

  return <_Image {...props} ref={ref} />;
});
