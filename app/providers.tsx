"use client";

import RouterProvider from "@/context/RouterContext";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <HeroUIProvider className="flex flex-1 flex-col md:h-full">
        <ToastProvider placement="top-center" />
        <RouterProvider>{children}</RouterProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
