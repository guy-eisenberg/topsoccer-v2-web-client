"use client";

import Tabs from "@/app/components/core/Tabs";
import type { Topsoccer } from "@/types";
import { Tab } from "@heroui/react";
import dynamic from "next/dynamic";

const EditStadiumDetailsTab = dynamic(() => import("./EditStadiumDetailsTab"), {
  ssr: false,
});
const EditStadiumImagesTab = dynamic(() => import("./EditStadiumImagesTab"), {
  ssr: false,
});

export default function EditStadiumPageContent({
  stadium,
}: {
  stadium: Topsoccer.Stadium.FullStadium | null;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <Tabs classNames={{ panel: "pt-2 flex-1" }}>
        <Tab key="details" title="פרטים">
          <EditStadiumDetailsTab stadium={stadium} />
        </Tab>
        {stadium && (
          <Tab key="gallery" title="תמונות">
            <EditStadiumImagesTab stadium={stadium} />
          </Tab>
        )}
      </Tabs>
    </main>
  );
}
