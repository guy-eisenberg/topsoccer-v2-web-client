import LoseIcon from "@/app/components/common/icons/LoseIcon";
import MVPIcon from "@/app/components/common/icons/MVPIcon";
import TieIcon from "@/app/components/common/icons/TieIcon";
import PlayerCard from "@/app/components/common/PlayerCard";
import TeamAvatar from "@/app/components/common/TeamAvatar";
import { Button } from "@/app/components/core/Button";
import { QuerySelect } from "@/app/components/core/QuerySelect";
import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ trunc: string }>;
}) {
  const { id } = await params;
  const { trunc } = await searchParams;

  const { stats, is_admin } = await fetchData(id, trunc);
  if (!stats) redirect("/");

  return (
    <main className="m-auto flex w-full max-w-xl flex-col md:max-h-full">
      <div className="mb-8 flex items-center gap-4">
        <TeamAvatar
          className="h-24 w-24 rounded-xl object-contain"
          src={stats.photo_url}
        />
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl font-semibold">{stats.name}</p>
            <div className="flex flex-wrap gap-2">
              <QuerySelect
                className="w-28"
                size="sm"
                field="trunc"
                fallback="all"
                options={[
                  { key: "all", label: "מצטבר" },
                  { key: "month", label: "החודש" },
                  { key: "week", label: "השבוע" },
                ]}
                disallowEmptySelection
              />
              {is_admin && (
                <Link href={`/team/edit/${id}`}>
                  <Button size="sm" color="secondary">
                    ערוך קבוצה
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-1 md:gap-0">
            <div className="flex items-center gap-1">
              <p className="whitespace-nowrap">
                סך נצחונות: <b>{stats.wins}</b>
              </p>
              <MVPIcon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1">
              <p className="whitespace-nowrap">
                סך הפסדים: <b>{stats.loses}</b>
              </p>
              <LoseIcon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1">
              <p className="whitespace-nowrap">
                סך תיקו: <b>{stats.ties}</b>
              </p>
              <TieIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 flex min-h-0 flex-col rounded-xl border border-theme-light-gray bg-theme-card px-6 py-4">
        <p className="mb-4 text-theme-gray">שחקנים</p>
        <ul className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
          {stats.players.map((player, i) => (
            <li key={player.id}>
              <Link href={`/player/${player.id}`}>
                <PlayerCard player={player} index={i} showStats={false} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

async function fetchData(team_id: string, trunc: string) {
  const supabase = await createClient();

  const [{ data: stats }, { data: is_admin }] = await Promise.all([
    supabase
      .rpc("z2_get_team_stats", {
        _team_id: team_id,
        _trunc: trunc === "all" ? null : trunc,
      })
      .single<{
        id: string;
        name: string;
        photo_url: string | null;
        wins: number;
        loses: number;
        ties: number;
        players: Topsoccer.User.UserInterface[];
      }>(),
    supabase
      .rpc("z2_is_team_admin", {
        _team_id: team_id,
      })
      .single<boolean>(),
  ]);

  return { stats, is_admin };
}
