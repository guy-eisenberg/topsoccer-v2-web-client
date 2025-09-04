import { Button } from "@/app/components/core/Button";
import Skeleton from "@/app/components/core/Skeleton";
import type { Topsoccer } from "@/types";
import { cn } from "@heroui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import AlertChip from "./AlertChip";
import WelcomeCommentChip from "./WelcomeCommentChip";

const DesktopUserMenu = dynamic(() => import("./DesktopUserMenu"));

export default function DesktopHeader({
  user,
  ...rest
}: React.HTMLAttributes<HTMLHeadElement> & {
  user: Topsoccer.User.Auth | null;
}) {
  return (
    <header
      {...rest}
      className={cn(
        "z-10 flex flex-col gap-3 border-b border-theme-light-gray pb-3",
        rest.className,
      )}
    >
      <Suspense
        fallback={
          <Skeleton className="rounded-xl border border-transparent px-4 py-2 text-sm">
            PLACEHOLDER
          </Skeleton>
        }
      >
        <AlertChip className="rounded-xl px-4 py-2" />
      </Suspense>

      <div className="flex justify-between">
        <div className="flex gap-4">
          <p className="text-2xl leading-10">
            {user ? "ברוך שובך לטופסוקר!" : "ברוך הבא לטופסוקר!"}
          </p>
          <Suspense
            fallback={
              <Skeleton className="rounded-xl px-4">PLACEHOLDER</Skeleton>
            }
          >
            <WelcomeCommentChip className="rounded-xl px-4" />
          </Suspense>
        </div>

        {user ? (
          <DesktopUserMenu user={user} />
        ) : (
          <div className="flex gap-2 border border-transparent">
            <Link href="/signup">
              <Button color="secondary">הירשם</Button>
            </Link>
            <Link href="/signin">
              <Button color="primary">היכנס</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
