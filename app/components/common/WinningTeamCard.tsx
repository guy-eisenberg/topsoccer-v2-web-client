import Image from "next/image";
import { useState } from "react";
import ImageExpandModal from "./modals/ImageExpandModal";

export default function WinningTeamCard({
  team,
}: {
  team: { title: string; image: string };
}) {
  const [imageExpandModalOpen, setImageExpandModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative h-full cursor-pointer"
        onClick={() => setImageExpandModalOpen(true)}
      >
        <Image
          alt="Winning Team"
          className="object-cover"
          src={team.image}
          fill
        />
        <div className="absolute bottom-0 left-0 right-0 flex h-24 items-center justify-center gap-2 bg-gradient-to-t from-black to-transparent text-center font-bold text-white">
          <p className="mt-10 text-lg">{team.title}</p>
        </div>
      </div>
      <ImageExpandModal
        src={team.image}
        isOpen={imageExpandModalOpen}
        onOpenChange={setImageExpandModalOpen}
      />
    </>
  );
}
