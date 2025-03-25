import Image from "next/image";

export default function WinningTeamCompCard({
  team,
}: {
  team: { stadium_name: string; title: string; image: string };
}) {
  return (
    <div className="relative h-full flex-1 cursor-pointer">
      <Image
        alt="Winning Team"
        className="object-cover"
        src={team.image}
        fill
      />
      <div className="absolute left-0 right-0 top-0 flex h-12 items-center justify-center gap-2 bg-gradient-to-b from-black to-transparent text-center text-sm text-white">
        <p className="text-lg">{team.stadium_name}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-center gap-2 bg-gradient-to-t from-black to-transparent text-center font-bold">
        <p className="text-lg text-warning">
          {team.title || "הקבוצה המנצחת של הערב"}
        </p>
      </div>
    </div>
  );
}
