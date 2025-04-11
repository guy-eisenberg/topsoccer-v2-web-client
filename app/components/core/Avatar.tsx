"use client";

import { useMounted } from "@/hooks/useMounted";
import {
  Avatar as _Avatar,
  type AvatarProps as _AvatarProps,
} from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { cn } from "@heroui/theme";
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

  const mounted = useMounted();

  useEffect(() => {
    if (src && !src.startsWith("blob:") && disableCache) {
      setVersion(v4());
    }

    return () => {
      setVersion("");
    };
  }, [src, disableCache]);

  if (!mounted) return null;

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
  React.HTMLAttributes<HTMLImageElement> & { disableAnimation?: boolean }
>(function Image(_props, ref) {
  const props = { ..._props };

  if (props.disableAnimation !== undefined) delete props.disableAnimation;

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} ref={ref} />;
});
