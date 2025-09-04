"use client";

import { Tab, type TabsProps } from "@heroui/react";
import Link from "next/link";
import Tabs from "../../core/Tabs";
import PlayerAvatar from "../PlayerAvatar";

export default function HomepageBottomCard({
  weeklyBestMove,
  monthlyTopGoals,
  overallTopGoals,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  weeklyBestMove: string;
  monthlyTopGoals: {
    id: string;
    display_name: string;
    photo_url: string;
    goals: number;
  }[];
  overallTopGoals: {
    id: string;
    display_name: string;
    photo_url: string;
    goals: number;
  }[];
}) {
  return (
    <Tabs
      {...(rest as TabsProps)}
      classNames={{ panel: "flex-1 px-2 md:px-0" }}
    >
      {overallTopGoals.length > 0 && (
        <Tab key="overall-top-goals" title="מלך השערים - מצטבר">
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pt-2">
            {overallTopGoals.map((row, i) => (
              <HighlightPlayerRow player={row} index={i} key={row.id} />
            ))}
          </div>
        </Tab>
      )}
      {monthlyTopGoals.length > 0 && (
        <Tab key="monthly-top-goals" title="מלך השערים - חודשי">
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pt-2">
            {monthlyTopGoals.map((row, i) => (
              <HighlightPlayerRow player={row} index={i} key={row.id} />
            ))}
          </div>
        </Tab>
      )}
      <Tab key="weekly-best-move" title="המהלך היפה של השבוע">
        <div className="h-full pt-2">
          <iframe
            className="h-full w-full rounded-t-xl md:rounded-xl"
            src={weeklyBestMove}
          />
        </div>
      </Tab>
    </Tabs>
  );
}

function HighlightPlayerRow({
  index,
  player,
}: {
  index: number;
  player: {
    id: string;
    display_name: string;
    photo_url: string;
    goals: number;
  };
}) {
  return (
    <Link href={`/player/${player.id}`} key={player.id}>
      <div className="flex items-center justify-between overflow-clip rounded-xl border border-theme-light-gray bg-white pl-4 text-sm hover:border-theme-green dark:bg-[#3f3f46]">
        <div className="flex items-center gap-4">
          <PlayerAvatar
            className="h-12 w-12 object-cover"
            src={player.photo_url}
          />
          <p className="font-semibold text-theme-green">{index + 1}.</p>
          <p>{player.display_name}</p>
        </div>
        <p className="font-semibold text-theme-green">{player.goals}</p>
      </div>
    </Link>
  );
}
