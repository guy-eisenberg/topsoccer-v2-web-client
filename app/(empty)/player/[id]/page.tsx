import ChampionIcon from "@/app/components/common/icons/ChampionIcon";
import CleanNetIcon from "@/app/components/common/icons/CleanNetIcon";
import GoalIcon from "@/app/components/common/icons/GoalIcon";
import GoalsKingIcon from "@/app/components/common/icons/GoalsKingIcon";
import MVPIcon from "@/app/components/common/icons/MVPIcon";
import PenaltyIcon from "@/app/components/common/icons/PenaltyIcon";
import ShowIcon from "@/app/components/common/icons/ShowIcon";
import SoccerFieldIcon from "@/app/components/common/icons/SoccerFieldIcon";
import PlayerAvatar from "@/app/components/common/PlayerAvatar";
import { QuerySelect } from "@/app/components/core/QuerySelect";
import QueryTabs from "@/app/components/core/QueryTabs";
import { createClient } from "@/clients/supabase/server";
import { Topsoccer } from "@/types";
import { getEventSubTypeLabel } from "@/utils/getEventSubTypeLabel";
import { getFormattedDate } from "@/utils/getFormattedDate";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    tab?: "stats" | "last_events";
    trunc?: "all" | "month" | "week";
  }>;
}) {
  const { id } = await params;
  const { tab, trunc } = await searchParams;

  const stats = await fetchData(id, trunc || "all");
  if (!stats) redirect("/");

  const playerValue =
    Math.floor(stats.points / 100) * 1000000 +
    Math.floor((stats.points % 100) / 10) * 100000 +
    (stats.points % 10) * 10000;

  const defaultTab = stats.last_stats.length > 0 ? "last_events" : "stats";

  return (
    <main className="m-auto flex w-full max-w-lg flex-col">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <PlayerAvatar
            className="h-24 w-24 rounded-xl"
            src={stats.photo_url}
          />
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
        </div>
        <div className="flex w-full flex-1 flex-col">
          <QueryTabs
            fallback={defaultTab}
            field="tab"
            options={[
              { key: "stats", title: "סטטיסטיקות" },
              stats.last_stats.length > 0
                ? { key: "last_events", title: "משחקים אחרונים" }
                : null,
            ]}
          />
          {((!tab && defaultTab === "stats") || tab === "stats") && (
            <div className="flex w-full flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <QuerySelect
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
          )}
          {((!tab && defaultTab === "last_events") ||
            tab === "last_events") && (
            <div className="flex flex-col gap-2">
              {stats.last_stats.map((event) => {
                const dateTime = new Date(event.time).getTime();

                const time = getFormattedDate(dateTime);

                const city = (() => {
                  switch (event.city) {
                    case "ראשון לציון":
                      return "ראשל״צ";
                    default:
                      return event.city;
                  }
                })();

                return (
                  <Link href={`/event/${event.id}`} key={event.id}>
                    <div className="flex justify-between rounded-xl border border-theme-light-gray bg-theme-foreground p-2 hover:border-theme-green">
                      <div className="flex gap-2">
                        <div className="flex flex-col">
                          <p className="text-sm">
                            {city} - {getEventSubTypeLabel(event.sub_type)} -{" "}
                            {event.type}
                          </p>
                          <p className="text-xs text-theme-gray">{`${time.day}.${time.month}.${time.year}`}</p>
                        </div>
                        <div className="flex">
                          {event.is_mvp && <MVPIcon className="h-6 w-6" />}
                          {event.is_goalking && (
                            <GoalsKingIcon className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-transparent bg-default-100 px-[6px] py-1 md:py-0">
                          <GoalIcon className="h-4 w-4" />

                          <p className="w-3 text-sm leading-4">
                            {event.goals || 0}
                          </p>
                        </div>
                        {event.is_goalkeeper && (
                          <>
                            <div className="flex items-center gap-1 rounded-lg border border-transparent bg-default-100 px-[6px] py-1 md:py-0">
                              <PenaltyIcon className="h-4 w-4" />

                              <p className="w-3 text-sm leading-4">
                                {event.penalty_saved || 0}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 rounded-lg border border-transparent bg-default-100 px-[6px] py-1 md:py-0">
                              <CleanNetIcon className="h-4 w-4" />

                              <p className="w-3 text-sm leading-4">
                                {event.clean_net || 0}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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
    is_mvp: boolean;
    last_stats: {
      id: string;
      time: string;
      city: string;
      type: Topsoccer.Event.Type;
      sub_type: Topsoccer.Event.SubType;
      goals: number;
      is_goalkeeper: boolean;
      penalty_saved: number;
      clean_net: number;
      is_goalking: boolean;
      is_mvp: boolean;
    }[];
  } | null;
}
