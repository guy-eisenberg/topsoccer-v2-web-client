"use client";

import { Avatar, type AvatarProps } from "../core/Avatar";
import TeamIcon from "./icons/TeamIcon";

export default function TeamAvatar({ src, ...rest }: AvatarProps) {
  return (
    <Avatar
      {...rest}
      classNames={{ fallback: "h-full w-full" }}
      fallback={<TeamIcon />}
      src={src}
    />
  );
}
