"use client";

import { cn } from "@heroui/theme";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../core/Button";
import BestPlayerCompCard from "../BestPlayerCompCard";
import WinningTeamCompCard from "../WinningTeamCompCard";

interface Highlight {
  event_id: string;
  stadium_name: string;
  title: string;
  image: string;
}

export default function HighlightsCard({
  highlights,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  highlights: {
    winning_team: Highlight[];
    winning_team_2: Highlight[];
    best_player: Highlight[];
    best_player_2: Highlight[];
  };
}) {
  const [topRightIndex, setTopRightIndex] = useState(0);
  const [switchSlides, setSwitchSlides] = useState(true);

  const topRightElements = useMemo<(Highlight & { type: string })[]>(() => {
    return [
      ...highlights.winning_team.map((t) => ({ ...t, type: "team" })),
      ...highlights.winning_team_2.map((t) => ({ ...t, type: "team" })),
      ...highlights.best_player
        .filter((p) => p.image != null)
        .map((t) => ({ ...t, type: "player" })),
      ...highlights.best_player_2
        .filter((p) => p.image != null)
        .map((t) => ({ ...t, type: "player" })),
    ];
  }, [
    highlights.best_player,
    highlights.best_player_2,
    highlights.winning_team,
    highlights.winning_team_2,
  ]);

  useEffect(() => {
    if (!switchSlides) return;

    const interval = setInterval(() => {
      setTopRightIndex((index) => {
        if (index >= topRightElements.length - 1) return 0;

        return index + 1;
      });
    }, 7500);

    return () => {
      clearInterval(interval);
    };
  }, [topRightElements.length, switchSlides]);

  return topRightElements.length > 0 ? (
    <div
      className={cn(
        "relative overflow-hidden text-xs md:rounded-xl",
        rest.className,
      )}
    >
      {topRightElements.map((e, i) => {
        return (
          <Link
            className={cn("hidden h-full", topRightIndex === i && "!block")}
            href={`/event/${e.event_id}`}
            key={i}
          >
            {e.type === "team" ? (
              <WinningTeamCompCard team={e} />
            ) : (
              <BestPlayerCompCard player={e} />
            )}
          </Link>
        );
      })}
      <Button
        onPress={() => {
          setTopRightIndex(
            topRightIndex === 0
              ? topRightElements.length - 1
              : topRightIndex - 1,
          );

          setSwitchSlides(false);
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2"
        color="secondary"
        isIconOnly
      >
        <IconCaretLeftFilled />
      </Button>
      <Button
        onPress={() => {
          setTopRightIndex(
            topRightIndex === topRightElements.length - 1
              ? 0
              : topRightIndex + 1,
          );

          setSwitchSlides(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2"
        color="secondary"
        isIconOnly
      >
        <IconCaretRightFilled />
      </Button>
    </div>
  ) : null;
}
