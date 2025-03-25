import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/modal";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type { Topsoccer } from "../../../../types";
import { Button } from "../../core/Button";
import GameCard from "../GameCard";
import SelectTeamsModal from "./SelectTeamsModal";

interface HouseGamesModalProps extends Omit<ModalProps, "children"> {
  fullLevel: Topsoccer.Level.FullLevel;
  fullTeams: Topsoccer.Team.FullTeam[];
  fullGames?: Topsoccer.Game.FullGame[];
  onGamesSubmit?: (data: {
    games: Topsoccer.Game.GameCreateData[];
    level: Topsoccer.Level.FullLevel;
  }) => void;
  onGamesDelete?: (data: {
    games: Topsoccer.Game.GameCreateData[];
    level: Topsoccer.Level.FullLevel;
  }) => void;
}

const HouseGamesModal: React.FC<HouseGamesModalProps> = ({
  fullLevel,
  fullTeams,
  fullGames,
  onGamesSubmit,
  onGamesDelete,
  ...rest
}) => {
  const [selectTeamsModalOpen, setSelectTeamsModalOpen] = useState(false);

  const [addedGames, setAddedGames] = useState<Topsoccer.Game.GameCreateData[]>(
    [],
  );
  const [deletedGamesIndexes, setDeletedGamesIndexes] = useState<number[]>([]);
  const [scores, setScores] = useState<{
    [key: number]: { teamAScore?: number; teamBScore?: number };
  }>([]);

  const finalGames = useMemo(() => {
    if (!fullGames) return addedGames;

    return [
      ...fullGames.map((game, i): Topsoccer.Game.GameCreateData => {
        const teamA = fullTeams.find((team) => team.id === game.team_a_id);
        const teamB = fullTeams.find((team) => team.id === game.team_b_id);

        return {
          teamA: {
            team: teamA!,
            score: scores[i]?.teamAScore || game.team_a_score,
          },
          teamB: {
            team: teamB!,
            score: scores[i]?.teamBScore || game.team_b_score,
          },
          id: game.id,
        };
      }),
      ...addedGames.map((game, i) => {
        return {
          teamA: {
            ...game.teamA,
            score: scores[fullGames.length + i]?.teamAScore || game.teamA.score,
          },
          teamB: {
            ...game.teamB,
            score: scores[fullGames.length + i]?.teamBScore || game.teamB.score,
          },
        };
      }),
    ];
  }, [fullTeams, addedGames, fullGames, scores]);

  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>משחקי בית</ModalHeader>
            <ModalBody>
              {finalGames.length > 0 && (
                <ul className="mt-4 flex h-full min-h-0 flex-col gap-2 overflow-y-auto">
                  {finalGames.map((game, i) => {
                    return (
                      !deletedGamesIndexes.includes(i) && (
                        <li key={i}>
                          <GameCard
                            teams={{ teamA: game.teamA, teamB: game.teamB }}
                            onScoresChange={(newScores) =>
                              setScores({ ...scores, [i]: newScores })
                            }
                            onGameDelete={() =>
                              setDeletedGamesIndexes([
                                ...deletedGamesIndexes,
                                i,
                              ])
                            }
                            showDeleteButton
                          />
                        </li>
                      )
                    );
                  })}
                </ul>
              )}
              <Button
                color="primary"
                endContent={<IconPlus />}
                onPress={() => setSelectTeamsModalOpen(true)}
              >
                <p>צור משחק חדש</p>
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                ביטול
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  if (onGamesSubmit)
                    onGamesSubmit({
                      games: finalGames.filter(
                        (_, i) => !deletedGamesIndexes.includes(i),
                      ),
                      level: fullLevel,
                    });

                  if (onGamesDelete)
                    onGamesDelete({
                      games: finalGames.filter((_, i) =>
                        deletedGamesIndexes.includes(i),
                      ),
                      level: fullLevel,
                    });
                }}
              >
                שמור
              </Button>
            </ModalFooter>
            <SelectTeamsModal
              amount={2}
              teams={fullTeams}
              onTeamsSubmit={addGame}
              isOpen={selectTeamsModalOpen}
              onOpenChange={setSelectTeamsModalOpen}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );

  function addGame(selectedTeams: Topsoccer.Team.FullTeam[]) {
    const newGame: Topsoccer.Game.GameCreateData = {
      teamA: {
        team: selectedTeams[0],
      },
      teamB: {
        team: selectedTeams[1],
      },
    };

    setAddedGames([...addedGames, newGame]);
  }
};

export default HouseGamesModal;
