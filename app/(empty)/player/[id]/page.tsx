import ChampionIcon from "@/app/components/common/icons/ChampionIcon";
import CleanNetIcon from "@/app/components/common/icons/CleanNetIcon";
import GoalIcon from "@/app/components/common/icons/GoalIcon";
import MVPIcon from "@/app/components/common/icons/MVPIcon";
import PenaltyIcon from "@/app/components/common/icons/PenaltyIcon";
import ShowIcon from "@/app/components/common/icons/ShowIcon";
import SoccerFieldIcon from "@/app/components/common/icons/SoccerFieldIcon";
import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { QuerySelect } from "@/app/components/core/QuerySelect";
import { createClient } from "@/clients/supabase/server";
import { redirect } from "next/navigation";

export default async function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ trunc?: "all" | "month" | "week" }>;
}) {
  const { id } = await params;
  const { trunc } = await searchParams;

  const stats = await fetchData(id, trunc || "all");
  if (!stats) redirect("/");

  const playerValue =
    Math.floor(stats.points / 100) * 1000000 +
    Math.floor((stats.points % 100) / 10) * 100000 +
    (stats.points % 10) * 10000;

  return (
    <main className="m-auto flex w-full max-w-lg flex-col">
      <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center">
        <PlayerAvatar className="h-24 w-24 rounded-xl" src={stats.photo_url} />
        <div className="flex w-full flex-1 flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-cols gap-3">
              <p className="text-2xl font-semibold">{stats.display_name}</p>
              <p className="font-semibold text-theme-green">
                {stats.points || 0} נקודות פנטזי
              </p>
              <p className="font-semibold text-theme-green">
                ערך:{" "}
                <span>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(playerValue)}
                </span>
              </p>
            </div>
            <QuerySelect
              className="max-w-36"
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
          </div>
          <div className="flex flex-col flex-wrap overflow-hidden rounded-xl border border-theme-light-gray bg-white dark:bg-theme-card md:flex-row">
            <div className="flex w-full items-center border-b border-theme-light-gray">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray py-2">
                <GoalIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                גולים
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap py-2 font-semibold">
                {stats.goals}
              </p>
            </div>
            <div className="flex w-full items-center border-b border-theme-light-gray">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray px-4 py-2">
                <ShowIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                הופעות
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap px-4 py-2 font-semibold">
                {stats.shows}
              </p>
            </div>
            <div className="flex w-full items-center border-b border-theme-light-gray">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray px-4 py-2">
                <MVPIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                נצחונות
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap px-4 py-2 font-semibold">
                {stats.wins}
              </p>
            </div>
            {/* <div className="flex w-full items-center border-b border-theme-light-gray">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray px-4 py-2">
                <ShowIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                כדורים בחוץ
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap px-4 py-2 font-semibold">
                {stats.balls_outside}
              </p>
            </div> */}
            {/* <div className="flex w-full items-center border-b border-theme-light-gray">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray px-4 py-2">
                <TieIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                שערים עצמיים
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap px-4 py-2 font-semibold">
                {stats.self_goal}
              </p>
            </div> */}
            <div className="flex w-full items-center border-b border-theme-light-gray">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray px-4 py-2">
                <PenaltyIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                הצלות פנדלים
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap px-4 py-2 font-semibold">
                {stats.penalty_saved}
              </p>
            </div>
            <div className="flex w-full items-center border-b border-theme-light-gray">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray px-4 py-2">
                <CleanNetIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                רשת נקייה
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap px-4 py-2 font-semibold">
                {stats.clean_net}
              </p>
            </div>
            <div className="flex w-full items-center border-b border-theme-light-gray">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray px-4 py-2">
                <SoccerFieldIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                נכלל בנבחרת המחזור
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap px-4 py-2 font-semibold">
                {stats.in_map}
              </p>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-1/5 border-spacing-3 justify-center border-l border-theme-light-gray px-4 py-2">
                <ChampionIcon className="h-6 w-6" />
              </div>
              <p className="flex-1 whitespace-nowrap border-l border-theme-light-gray px-4 py-2 text-center">
                איש המחזור
              </p>
              <p className="flex w-1/5 justify-center whitespace-nowrap px-4 py-2 font-semibold">
                {stats.is_mvp}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

async function fetchData(user_id: string, trunc: string) {
  const supabase = await createClient();

  const { data: stats } = await supabase
    .rpc("z2_get_player_stats", {
      _user_id: user_id,
      _trunc: trunc === "all" ? null : trunc,
    })
    .single();

  return stats as {
    id: string;
    display_name: string;
    photo_url: string | null;
    points: number;
    goals: number;
    shows: number;
    wins: number;
    balls_outside: number;
    self_goal: number;
    penalty_saved: number;
    clean_net: number;
    in_map: number;
    is_mvp: number;
  } | null;
}
