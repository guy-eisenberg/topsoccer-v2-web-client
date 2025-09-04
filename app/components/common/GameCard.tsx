import type { Topsoccer } from "@/types";
import { cn } from "@heroui/react";
import { useState } from "react";
import { Button } from "../core/Button";
import Input from "../core/Input";
import TeamAvatar from "./TeamAvatar";

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  teams?: {
    teamA: {
      team: Topsoccer.Team.FullTeam;
      score?: number;
    };
    teamB: {
      team: Topsoccer.Team.FullTeam;
      score?: number;
    };
  };
  onScoresChange?: (scores: {
    teamAScore?: number;
    teamBScore?: number;
  }) => void;
  onGameDelete?: () => void;
  showDeleteButton?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  teams,
  onScoresChange,
  onGameDelete,
  showDeleteButton = false,
  ...rest
}) => {
  const [teamAScore, setTeamAScore] = useState(
    teams?.teamA.score?.toString() || "0",
  );
  const [teamBScore, setTeamBScore] = useState(
    teams?.teamB.score?.toString() || "0",
  );

  return (
    <div {...rest} className={cn("flex flex-col items-center", rest.className)}>
      <div className="relative flex w-72 flex-col overflow-hidden rounded-xl border border-theme-light-gray">
        {teams &&
          [teams.teamA, teams.teamB].map((team) => (
            <div
              className="flex items-center justify-between overflow-hidden border-b border-theme-light-gray p-1"
              key={team.team.id}
            >
              <div className="flex items-center gap-2">
                <TeamAvatar
                  className="h-12 w-12 rounded-xl object-contain"
                  src={team.team.photo_url}
                />

                <p>{team.team?.name}</p>
              </div>
              <Input
                className="w-28"
                placeholder="ניקוד"
                type="number"
                value={
                  team.team.id === teams.teamA.team.id ? teamAScore : teamBScore
                }
                onChange={(e) => {
                  if (onScoresChange)
                    onScoresChange({
                      teamAScore:
                        team.team.id === teams.teamA.team.id
                          ? parseInt(e.target.value)
                          : parseInt(teamAScore),
                      teamBScore:
                        team.team.id === teams.teamB.team.id
                          ? parseInt(e.target.value)
                          : parseInt(teamBScore),
                    });

                  if (team.team.id === teams.teamA.team.id)
                    setTeamAScore(e.target.value);
                  else setTeamBScore(e.target.value);
                }}
              />
            </div>
          ))}
        {showDeleteButton && (
          <div className="my-2 flex flex-col gap-2 self-center">
            <Button color="danger" onPress={onGameDelete}>
              מחק
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
