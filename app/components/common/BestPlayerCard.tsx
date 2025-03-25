import type { Topsoccer } from "@/types";
import { cn } from "@heroui/theme";
import Image from "next/image";
import PlayerAvatar from "./PlayerAvatar";

type Player = Topsoccer.User.UserInterface & {
  goals: number;
};

export default function BestPlayerCard({
  player,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  player: { player: Player; title?: string; image?: string };
}) {
  return player.image ? (
    <>
      <div
        {...rest}
        className={cn("relative h-full cursor-pointer", rest.className)}
      >
        <Image
          alt="Winning Team"
          className="object-cover"
          src={player.image}
          fill
        />
        <div className="absolute left-0 right-0 top-0 flex h-24 items-center justify-center gap-2 bg-gradient-to-b from-black to-transparent text-center font-bold text-white">
          <p className="mb-10 text-lg">
            {player.player.display_name} -{" "}
            <span className="text-warning">{player.player.goals} שערים</span>
          </p>
        </div>
        {player.title && (
          <div className="absolute bottom-0 left-0 right-0 flex h-24 items-center justify-center gap-2 bg-gradient-to-t from-black to-transparent text-center font-bold text-white">
            <p className="mt-10 text-lg">{player.title}</p>
          </div>
        )}
      </div>
    </>
  ) : (
    <div
      {...rest}
      className={cn(
        "relative flex h-full overflow-hidden bg-white pb-6 pt-4 text-white",
        rest.className,
      )}
    >
      <Image
        alt="Background"
        className="blur-[2px] brightness-50"
        src="/images/soccer_field.jpeg"
        fill
      />
      <div className="relative flex flex-1 flex-col text-center text-warning">
        <div className="mb-3 flex items-center justify-center">
          <p className="text-3xl font-bold">{player.title || "מלך השערים"}</p>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <PlayerAvatar
            className="h-16 w-16 rounded-xl object-cover"
            src={player.player.photo_url}
          />

          <p className="mt-1 text-lg">{player.player.display_name}</p>
          <p className="mt-auto text-4xl font-semibold">
            {player.player.goals} שערים
          </p>
          <div className="mt-3 h-[2px] w-1/4 rounded-[100%] bg-warning blur-[4px]" />
        </div>
      </div>
    </div>
  );
}
