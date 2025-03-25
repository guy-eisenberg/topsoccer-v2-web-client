import RouterProvider from "@/context/RouterContext";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import Loader from "./components/common/Loader/Loader";
import StatusToast from "./components/common/StatusToast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Topsoccer - הטופ של אירועי הכדורגל!",
  description:
    "מטרת טופסוקר היא לאפשר לכל חובב כדורגל לקחת חלק בפעילויות כדורגל איכותיות ומהנות. יש מקום לנוער, למבוגרים, לצעירים, לחיילים ולכל מי שרוצה לקחת חלק בפעילות יכול בלחיצת כפתור להירשם וליהנות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="flex min-h-full flex-col md:h-full"
      suppressHydrationWarning
    >
      <body
        className="flex flex-1 flex-col bg-gradient-to-br from-theme-bg via-theme-green/15 to-theme-bg md:h-full"
        dir="rtl"
      >
        <ThemeProvider defaultTheme="dark" attribute="class">
          <HeroUIProvider className="flex flex-1 flex-col md:h-full">
            <ToastProvider placement="top-center" />
            <Suspense>
              <StatusToast />
            </Suspense>
            <RouterProvider>{children}</RouterProvider>
            <Loader />
          </HeroUIProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
