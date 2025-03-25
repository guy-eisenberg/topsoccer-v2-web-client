"use client";

import Logo from "@/app/components/common/assets/Logo";
import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { Button } from "@/app/components/core/Button";
import type { Topsoccer } from "@/types";
import { cn } from "@heroui/theme";
import { IconMenu2, IconX } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavMenu from "./NavMenu/NavMenu";

const UserMenu = dynamic(() => import("./UserMenu"));

export default function MobileHeader({
  user,
  ...rest
}: React.HTMLAttributes<HTMLHeadElement> & {
  user: Topsoccer.User.Auth | null;
}) {
  const pathname = usePathname();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("click", dismiss);

    return () => {
      document.removeEventListener("click", dismiss);
    };

    function dismiss() {
      setUserMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
    setNavMenuOpen(false);
  }, [pathname]);

  return (
    <header
      {...rest}
      className={cn(
        "sticky left-0 right-0 top-0 z-10 flex h-20 items-center justify-between border-b border-theme-light-gray bg-theme-foreground",
        rest.className,
      )}
    >
      <button
        className="h-20 w-20 shrink-0 p-4"
        onClick={() => {
          setUserMenuOpen(false);
          setNavMenuOpen(!navMenuOpen);
        }}
      >
        {navMenuOpen ? (
          <IconX className="h-full w-full" />
        ) : (
          <IconMenu2 className="h-full w-full" />
        )}
      </button>
      <Logo className="h-full p-6" />
      {user ? (
        <button
          className="h-20 w-20 shrink-0 p-4"
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();

            setNavMenuOpen(false);
            setUserMenuOpen(!userMenuOpen);
          }}
        >
          <PlayerAvatar
            alt="User Profile Image"
            className="h-full w-full shrink-0 rounded-xl"
            src={user.photo_url}
          />
        </button>
      ) : (
        <Link className="ml-4" href="/signin">
          <Button color="primary">כניסה</Button>
        </Link>
      )}

      {user && (
        <UserMenu
          className="absolute left-0 top-full w-1/2 rounded-br-xl border-b border-r border-theme-light-gray"
          user={user}
          style={{ maxHeight: userMenuOpen ? 316 : 0 }}
        />
      )}

      <nav
        className="absolute left-0 right-0 top-full flex h-[calc(100vh-80px)] flex-col overflow-hidden bg-theme-foreground px-4 transition-all"
        style={{ maxHeight: navMenuOpen ? "calc(100vh - 80px)" : 0 }}
      >
        <NavMenu user={user} />
      </nav>
    </header>
  );
}
