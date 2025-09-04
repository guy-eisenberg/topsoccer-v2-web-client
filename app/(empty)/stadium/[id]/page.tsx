import WazeIcon from "@/app/components/common/icons/WazeIcon";
import WhatsappIcon from "@/app/components/common/icons/WhatsappIcon";
import ImageGrid from "@/app/components/common/ImageGrid/ImageGrid";
import ImageItem from "@/app/components/common/ImageGrid/ImageItem";
import { Button } from "@/app/components/core/Button";
import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { cn } from "@heroui/react";
import { IconCalendar, IconLayout2, IconMapPin } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function StadiumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: stadium } = await supabase
    .from("stadiums")
    .select()
    .eq("id", id)
    .single<Topsoccer.Stadium.FullStadium>();

  if (!stadium) redirect("/");

  return (
    <main className="m-auto flex min-h-0 w-full max-w-xl flex-col">
      <div className="flex justify-between">
        <p className="text-3xl font-semibold">{stadium.name}</p>
        <div className="flex items-center gap-2 text-sm text-theme-gray">
          <IconMapPin width={16} height={16} />
          <span className="text">
            {stadium.address}, {stadium.city}
          </span>
        </div>
      </div>
      <p className="mt-6">{stadium.description}</p>
      <div className="my-4 flex flex-col gap-2">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <IconCalendar width={16} height={16} />
            <span>ימים:</span>
          </div>
          <div className="flex overflow-hidden rounded-xl border border-black">
            {stadium.days.map((isActive, i) => (
              <div
                className={cn(
                  "w-8 text-center text-lg",
                  isActive
                    ? "bg-theme-green text-white"
                    : "bg-theme-light-gray text-theme-gray",
                  i < 6 && "border-l border-black",
                )}
                key={i}
              >
                {["א", "ב", "ג", "ד", "ה", "ו", "ש"][i]}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <IconLayout2 width={16} height={16} />
            <span>סוגים:</span>
          </div>
          <div className="flex gap-2">
            {stadium.types.map((type, i) => (
              <span
                className="rounded-xl bg-theme-green px-2 py-1 text-white"
                key={i}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
      {(stadium.waze_url || stadium.whatsapp_url) && (
        <div className="mb-4 flex gap-4">
          {stadium.whatsapp_url && (
            <a href={stadium.whatsapp_url} target="_blank">
              <Button color="secondary">
                <p className="ml-2">לקבוצת ווטסאפ</p>
                <WhatsappIcon className="h-6 w-6" />
              </Button>
            </a>
          )}

          {stadium.waze_url && (
            <a href={stadium.waze_url} target="_blank">
              <Button color="secondary">
                <p className="ml-2">ניווט בוויז</p>
                <WazeIcon className="h-6 w-6" />
              </Button>
            </a>
          )}
        </div>
      )}
      {stadium.main_image && (
        <ImageItem
          className="mb-2 h-80 rounded-xl"
          image={stadium.main_image}
        />
      )}
      <ImageGrid images={stadium.images} />
    </main>
  );
}
