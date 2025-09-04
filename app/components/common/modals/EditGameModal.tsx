import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@heroui/react";
import { useMemo, useState } from "react";
import type { Topsoccer } from "../../../../types";
import { Button } from "../../core/Button";
import GameCard from "../GameCard";

interface EditGameModalProps extends Omit<ModalProps, "children"> {
  fullLevel: Topsoccer.Level.FullLevel & {
    games: Topsoccer.Game.FullGame[];
  };
  fullTeams: Topsoccer.Team.FullTeam[];
  fullGames?: Topsoccer.Game.FullGame[];
  onGameSubmit?: (data: {
    game: Topsoccer.Game.GameCreateData;
    level: Topsoccer.Level.FullLevel;
  }) => void;
}

const EditGameModal: React.FC<EditGameModalProps> = ({
  fullLevel,
  fullTeams,
  fullGames,
  onGameSubmit,
  ...rest
}) => {
  const [scores, setScores] = useState<
    | {
        teamAScore?: number;
        teamBScore?: number;
      }
    | undefined
  >(undefined);
  const game = useMemo(() => {
    if (!fullGames || fullGames.length === 0) return undefined;

    const game = fullGames.find(
      (fullGame) =>
        fullLevel &&
        fullLevel.games &&
        fullLevel.games.length > 0 &&
        fullLevel.games[0].id === fullGame.id,
    )!;

    const teamA = fullTeams.find((team) => team.id === game.team_a_id);
    const teamB = fullTeams.find((team) => team.id === game.team_b_id);

    return {
      teamA: {
        team: teamA!,
        score:
          scores?.teamAScore !== undefined
            ? scores.teamAScore
            : game.team_a_score,
      },
      teamB: {
        team: teamB!,
        score:
          scores?.teamBScore !== undefined
            ? scores.teamBScore
            : game.team_b_score,
      },
      uid: game.id,
    };
  }, [fullLevel, fullTeams, fullGames, scores]);

  return (
    <Modal placement="center" {...rest}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>ערוך משחק</ModalHeader>
            <ModalBody>
              {game && (
                <GameCard
                  className="mt-4"
                  teams={{ teamA: game.teamA, teamB: game.teamB }}
                  onScoresChange={(scores) => setScores(scores)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                ביטול
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  if (game && onGameSubmit)
                    onGameSubmit({
                      game,
                      level: fullLevel,
                    });

                  onClose();
                }}
              >
                שמור
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditGameModal;
