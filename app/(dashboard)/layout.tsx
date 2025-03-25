import { fetchAuth } from "@/utils/server/fetchAuth";
import { Skeleton } from "@heroui/skeleton";
import Link from "next/link";
import { Suspense } from "react";
import Logo from "../components/common/assets/Logo";
import AlertChip from "./components/AlertChip";
import DesktopHeader from "./components/DesktopHeader";
import MobileHeader from "./components/MobileHeader";
import NavMenu from "./components/NavMenu/NavMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchAuth();

  return (
    <div className="flex flex-1 flex-col md:mx-auto md:grid md:h-full md:w-full md:max-w-7xl md:flex-1 md:grid-cols-4 md:flex-col md:gap-4 md:p-2">
      <MobileHeader className="md:hidden" user={user} />

      <div className="col-span-1 hidden flex-col rounded-xl bg-theme-foreground md:flex">
        <Link href="/">
          <div className="flex justify-center border-b border-theme-light-gray px-12 py-8">
            <Logo className="h-10" />
          </div>
        </Link>
        <NavMenu className="p-4" user={user} />
      </div>

      <div className="min-h-[calc(100vh-80px)] md:col-span-3 md:flex md:min-h-0 md:flex-col md:gap-2">
        <Suspense
          fallback={
            <Skeleton className="border border-transparent p-4 text-sm md:hidden">
              <p>PLACEHOLDER</p>
              <p>PLACEHOLDER</p>
            </Skeleton>
          }
        >
          <AlertChip className="p-4 md:hidden" />
        </Suspense>

        <DesktopHeader className="hidden md:flex" user={user} />
        {children}
      </div>
    </div>
  );
}
