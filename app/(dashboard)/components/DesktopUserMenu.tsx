"use client";

import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import type { Topsoccer } from "@/types";
import { cn } from "@heroui/react";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import UserMenu from "./UserMenu";

export default function DesktopUserMenu({
  user,
}: {
  user: Topsoccer.User.Auth;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("click", dismiss);

    return () => {
      document.removeEventListener("click", dismiss);
    };

    function dismiss() {
      setMenuOpen(false);
    }
  }, []);

  return (
    <div
      className={cn(
        "relative -my-2 flex cursor-pointer gap-2 rounded-xl border border-transparent px-4 py-2",
        menuOpen
          ? "rounded-b-none border-l border-r border-t border-theme-light-gray bg-theme-foreground"
          : "hover:border-theme-green",
      )}
      onClick={(e) => {
        e.nativeEvent.stopImmediatePropagation();

        setMenuOpen(!menuOpen);
      }}
    >
      <PlayerAvatar className="rounded-xl" src={user.photo_url} />
      <div className="flex flex-col items-start justify-center">
        <div className="flex">
          <span className="leading-5">שלום</span>
          <IconChevronDown className="h-5 w-5" />
        </div>

        <span className="font-semibold leading-5">{user?.display_name}</span>
      </div>
      <UserMenu
        className={cn(
          "absolute left-[-1px] right-[-1px] top-full rounded-b-xl border-b border-l border-r border-theme-light-gray",
          menuOpen ? "block" : "hidden",
        )}
        user={user}
      />
    </div>
  );
}
