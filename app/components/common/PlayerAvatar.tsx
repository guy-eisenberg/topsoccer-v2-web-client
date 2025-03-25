"use client";

import { Avatar, type AvatarProps } from "../core/Avatar";
import PlayerIcon from "./icons/PlayerIcon";

export default function PlayerAvatar({ src, ...rest }: AvatarProps) {
  return (
    <Avatar
      {...rest}
      classNames={{ fallback: "h-full w-full" }}
      fallback={<PlayerIcon />}
      src={src}
    />
  );
}
