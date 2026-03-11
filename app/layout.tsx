import type { Metadata } from "next";
import { Suspense } from "react";
import Loader from "./components/common/Loader/Loader";
import SafetyPopup from "./components/common/modals/SafetyPopup/SafetyPopup";
import StatusToast from "./components/common/StatusToast";
import "./globals.css";
import { Providers } from "./providers";
import { getFeatureFlag } from "@/utils/server/featureFlags";

export const metadata: Metadata = {
  title: "Topsoccer - הטופ של אירועי הכדורגל!",
  description:
    "מטרת טופסוקר היא לאפשר לכל חובב כדורגל לקחת חלק בפעילויות כדורגל איכותיות ומהנות. יש מקום לנוער, למבוגרים, לצעירים, לחיילים ולכל מי שרוצה לקחת חלק בפעילות יכול בלחיצת כפתור להירשם וליהנות.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showAnnouncementPopup = await getFeatureFlag("show_announcement_popup");

  return (
    <html
      className="flex min-h-full flex-col md:h-full"
      suppressHydrationWarning
    >
      <body
        className="flex flex-1 flex-col bg-gradient-to-br from-theme-bg via-theme-green/15 to-theme-bg md:h-full"
        dir="rtl"
      >
        <Providers>
          <Suspense>
            <StatusToast />
          </Suspense>
          {children}
          {showAnnouncementPopup && <SafetyPopup />}
          <Loader />
        </Providers>
      </body>
    </html>
  );
}
