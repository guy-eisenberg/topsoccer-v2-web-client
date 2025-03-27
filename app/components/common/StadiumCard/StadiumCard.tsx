import type { Topsoccer } from "@/types";
import { cn } from "@heroui/theme";
import { IconCalendar, IconLayout2, IconMapPin } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "../../core/Button";
import WazeIcon from "../icons/WazeIcon";
import WhatsappIcon from "../icons/WhatsappIcon";
import DeleteStadiumModal from "./DeleteStadiumModal";

interface StadiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  stadium: Topsoccer.Stadium.FullStadium;
  onStadiumDelete: () => void;
  showControls?: boolean;
  showImageArrows?: boolean;
}

const StadiumCard: React.FC<StadiumCardProps> = ({
  stadium,
  onStadiumDelete,
  showControls = true,
  // showImageArrows = false,
  ...rest
}) => {
  const [deleteStadiumModalOpen, setDeleteStadiumModalOpen] = useState(false);

  // const [activatedImageIndex, setActivatedImageIndex] = useState(0);

  const images = useMemo(() => {
    return [
      stadium.main_image || "/images/soccer-field.jpeg",
      ...stadium.images,
    ];
  }, [stadium]);

  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-xl p-4 text-white",
        rest.className,
      )}
    >
      <Image
        alt="stadium thumbnail"
        className="object-cover"
        layout="fill"
        src={images[0]}
      />

      <div className="absolute bottom-0 left-0 right-0 top-0 bg-black/60"></div>

      <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-2">
        {stadium.whatsapp_url && (
          <Button
            className="w-32 border border-theme-green bg-green-50 text-xs text-theme-green"
            onPress={() =>
              window.open(stadium.whatsapp_url as string, "_blank")
            }
            endContent={<WhatsappIcon className="h-4 w-4" />}
          >
            קבוצת ווטסאפ
          </Button>
        )}
        {stadium.waze_url && (
          <Button
            className="w-32 border border-black bg-[#e8f2fa] text-xs text-black"
            onPress={() => window.open(stadium.waze_url as string, "_blank")}
            endContent={<WazeIcon className="h-4 w-4" />}
          >
            ניווט בוויז
          </Button>
        )}
      </div>

      <div className="relative flex w-full flex-col">
        <div className="flex items-center justify-between">
          <b className="text-xl">{stadium.name}</b>
          <div className="flex items-center gap-1 text-white">
            <IconMapPin width={14} height={14} />
            <span className="text-sm">
              {stadium.address}, {stadium.city}
            </span>
          </div>
        </div>
        <p className="mt-2 min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-xs text-white scrollbar-hide">
          {stadium.description}
        </p>
        <div className="my-3 flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex w-14 items-center gap-1">
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
          <div className="flex gap-2">
            <div className="flex w-14 items-center gap-1">
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
        {showControls && (
          <div className="mt-auto flex gap-2">
            <Link href={`/stadium/edit/${stadium.id}`}>
              <Button color="secondary">עריכה</Button>
            </Link>

            <Button
              color="danger"
              onPress={() => setDeleteStadiumModalOpen(true)}
            >
              מחיקה
            </Button>
          </div>
        )}
      </div>

      <DeleteStadiumModal
        stadium={stadium}
        onStadiumDelete={onStadiumDelete}
        isOpen={deleteStadiumModalOpen}
        onOpenChange={setDeleteStadiumModalOpen}
      />
    </div>
  );
};

export default StadiumCard;
