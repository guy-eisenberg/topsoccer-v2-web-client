import GoalIcon from "@/app/components/common/icons/GoalIcon";
import MVPIcon from "@/app/components/common/icons/MVPIcon";
import ShowIcon from "@/app/components/common/icons/ShowIcon";
import PlayerCard from "@/app/components/common/PlayerCard";
import { createClient } from "@/clients/supabase/server";
import Link from "next/link";

export default async function PlayersStatsTable({
  trunc,
}: {
  trunc: "all" | "month" | "week";
}) {
  const stats = await getStats(trunc);

  return (
    <div className="flex flex-col gap-16 rounded-xl border border-theme-light-gray bg-theme-card px-4 py-3 md:flex-row">
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <GoalIcon className="h-4 w-4" />
          <p className="font-bold text-warning">גולים</p>
          <GoalIcon className="h-4 w-4" />
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {stats.goals.map((player, i) => (
            <Link href={`/player/${player.id}`} key={player.id}>
              <PlayerCard
                player={player}
                index={i}
                key={player.id}
                arbitraryStat={player.goals}
                showStats={false}
              />
            </Link>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <ShowIcon className="h-4 w-4" />
          <p className="font-bold text-warning">הופעות</p>
          <ShowIcon className="h-4 w-4" />
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {stats.shows.map((player, i) => (
            <Link href={`/player/${player.id}`} key={player.id}>
              <PlayerCard
                player={player}
                index={i}
                key={player.id}
                arbitraryStat={player.shows}
                showStats={false}
              />
            </Link>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <MVPIcon className="h-4 w-4" />
          <p className="font-bold text-warning">נצחונות</p>
          <MVPIcon className="h-4 w-4" />
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {stats.wins.map((player, i) => (
            <Link href={`/player/${player.id}`} key={player.id}>
              <PlayerCard
                player={player}
                index={i}
                key={player.id}
                arbitraryStat={player.wins}
                showStats={false}
              />
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function getStats(trunc: string) {
  const supabase = await createClient();

  const {
    data: [stats],
  } = await supabase.rpc("z2_get_latest_stats", {
    _trunc: trunc === "all" ? null : trunc,
  });

  return stats as {
    goals: {
      id: string;
      display_name: string;
      photo_url: string | null;
      goals: number;
    }[];
    shows: {
      id: string;
      display_name: string;
      photo_url: string | null;
      shows: number;
    }[];
    wins: {
      id: string;
      display_name: string;
      photo_url: string | null;
      wins: number;
    }[];
  };
}
