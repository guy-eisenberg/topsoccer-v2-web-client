import type { Topsoccer } from "@/types";
import { cn } from "@heroui/theme";
import { useState } from "react";
import { Button } from "../core/Button";
import EditGameModal from "./modals/EditGameModal";
import HouseGamesModal from "./modals/HouseGamesModal";
import TeamAvatar from "./TeamAvatar";

interface LevelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fullLevel: Topsoccer.Level.FullLevel & {
    games: Topsoccer.Game.FullGame[];
  };
  fullTeams: (Topsoccer.Team.FullTeam & { score: number })[];
  fullGames?: Topsoccer.Game.FullGame[];
  onGamesSubmit?: (data: {
    games: Topsoccer.Game.GameCreateData[];
    level: Topsoccer.Level.FullLevel;
  }) => void;
  onGamesDelete?: (data: {
    games: Topsoccer.Game.GameCreateData[];
    level: Topsoccer.Level.FullLevel;
  }) => void;
  onLevelDelete?: () => void;
  showDeleteButton?: boolean;
  index: number;
}

const LevelCard: React.FC<LevelCardProps> = ({
  fullLevel,
  fullTeams,
  fullGames,
  onLevelDelete,
  onGamesSubmit,
  onGamesDelete,
  showDeleteButton,
  index,
  ...rest
}) => {
  const [houseGamesModalOpen, setHouseGamesModalOpen] = useState(false);
  const [editGameModalOpen, setEditGameModalOpen] = useState(false);

  const levelLabel = (() => {
    switch (fullLevel.type) {
      case "House":
        return "בית";
      case "Quarters":
        return "רבע גמר";
      case "Semi":
        return "חצי גמר";
      case "Final":
        return "גמר";
    }
  })();

  return (
    <div {...rest} className={cn("flex shrink-0 flex-col", rest.className)}>
      <p className="text-sm text-theme-gray">
        {levelLabel} {index + 1}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-xl border border-theme-light-gray">
          {fullTeams &&
            fullTeams.map((team, i) => (
              <div
                className={cn(
                  "flex items-center justify-between gap-16 overflow-hidden p-1",
                  i !== fullTeams.length - 1 &&
                    "border-b border-theme-light-gray",
                )}
                key={team.id}
              >
                <div className="flex items-center gap-2">
                  <TeamAvatar
                    className="h-8 w-8 overflow-hidden rounded-xl"
                    src={team.photo_url}
                  />

                  <p className="whitespace-nowrap">{team.name}</p>
                </div>
                <p className="ml-2">{team.score}</p>
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-2">
          {onGamesSubmit && onGamesDelete && (
            <Button
              color="secondary"
              onPress={() => {
                if (fullLevel.type === "House") setHouseGamesModalOpen(true);
                else setEditGameModalOpen(true);
              }}
            >
              ערוך
            </Button>
          )}

          {showDeleteButton && onLevelDelete && (
            <Button color="danger" onPress={onLevelDelete}>
              מחק
            </Button>
          )}
        </div>
      </div>

      <HouseGamesModal
        fullLevel={fullLevel}
        fullTeams={fullTeams}
        fullGames={fullGames}
        onGamesSubmit={onGamesSubmit}
        onGamesDelete={onGamesDelete}
        isOpen={houseGamesModalOpen}
        onOpenChange={setHouseGamesModalOpen}
      />

      <EditGameModal
        fullLevel={fullLevel}
        fullTeams={fullTeams}
        fullGames={fullGames}
        onGameSubmit={(data) =>
          onGamesSubmit && onGamesSubmit({ ...data, games: [data.game] })
        }
        isOpen={editGameModalOpen}
        onOpenChange={setEditGameModalOpen}
      />
    </div>
  );
};

export default LevelCard;
