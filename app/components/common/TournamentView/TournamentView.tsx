import { cn } from "@heroui/react";
import { useMemo } from "react";
import type { Topsoccer } from "../../../../types";
import LevelCard from "../LevelCard";
import AddLevelButton from "./AddLevelButton";

interface TournamentViewProps extends React.HTMLAttributes<HTMLDivElement> {
  levels?: (Topsoccer.Level.FullLevel & {
    teams: Topsoccer.Team.FullTeam[];
    games: Topsoccer.Game.FullGame[];
  })[];
  games?: Topsoccer.Game.FullGame[];
  teams: Topsoccer.Team.FullTeam[];
  onLevelAdd?: (level: Topsoccer.Level.LevelCreateData) => void;
  onLevelDelete?: (level: Topsoccer.Level.FullLevel) => void;
  onGamesSubmit?: (data: {
    games: Topsoccer.Game.GameCreateData[];
    level: Topsoccer.Level.FullLevel;
  }) => void;
  onGamesDelete?: (data: {
    games: Topsoccer.Game.GameCreateData[];
    level: Topsoccer.Level.FullLevel;
  }) => void;
}

const TournamentView: React.FC<TournamentViewProps> = ({
  levels: fullLevels,
  games: fullGames,
  teams: fullTeams,
  onLevelAdd,
  onLevelDelete,
  onGamesSubmit,
  onGamesDelete,
  ...rest
}) => {
  const levels = useMemo(() => {
    if (!fullTeams || !fullLevels) return undefined;

    return fullLevels.map((level) => {
      const teams = fullTeams.filter((team) =>
        level.teams.map((team) => team.id).includes(team.id),
      );
      const games = fullGames?.filter((game) =>
        level.games?.map((game) => game.id).includes(game.id),
      );

      return {
        ...level,
        teams,
        games,
      };
    });
  }, [fullLevels, fullGames, fullTeams]);

  const houseLevels = useMemo(
    () => levels && levels.filter((level) => level.type === "House"),
    [levels],
  );
  const teamsInHouseLevel = useMemo(
    () =>
      houseLevels &&
      houseLevels.reduce(
        (arr, level) => [...arr, ...level.teams],
        [] as Topsoccer.Team.FullTeam[],
      ),
    [houseLevels],
  );
  const houseScores = useMemo(() => {
    return fullTeams.map((team) => {
      const teamGames = findTeamHouseGames(team);

      return teamGames.reduce((score, game) => {
        if (game.team_a_id === team.id) {
          if ((game.team_a_score || 0) > (game.team_b_score || 0))
            return score + 3;
          else if (game.team_a_score === game.team_b_score) return score + 1;
          else if ((game.team_a_score || 0) < (game.team_b_score || 0))
            return score;
        } else if (game.team_b_id === team.id) {
          if ((game.team_b_score || 0) > (game.team_a_score || 0))
            return score + 3;
          else if (game.team_b_score === game.team_a_score) return score + 1;
          else if ((game.team_b_score || 0) < (game.team_a_score || 0))
            return score;
        }

        return score + 1;
      }, 0);
    });

    function findTeamHouseGames(team: Topsoccer.Team.FullTeam) {
      return fullGames
        ? fullGames.filter((game) => {
            const level =
              fullLevels &&
              fullLevels.find((level) => level.id === game.level_id);

            if (!level || level.type !== "House") return false;

            return game.team_a_id === team.id || game.team_b_id === team.id;
          })
        : [];
    }
  }, [fullLevels, fullTeams, fullGames]);
  const houseTeamsWithScores = useMemo(() => {
    const teamsWithScores = fullTeams
      ? fullTeams.map((team, i) => {
          return { ...team, score: houseScores[i] };
        })
      : [];

    teamsWithScores.sort((team1, team2) => team2.score - team1.score);

    return teamsWithScores;
  }, [fullTeams, houseScores]);

  const teamsAvailableForQuarters = useMemo(() => {
    return houseLevels
      ? houseLevels.reduce((arr, level) => {
          const levelTeams = houseTeamsWithScores.filter((team) =>
            level.teams.map((team) => team.id).includes(team.id),
          );

          return [...arr, levelTeams[0], levelTeams[1]];
        }, [] as Topsoccer.Team.FullTeam[])
      : [];
  }, [houseTeamsWithScores, houseLevels]);

  const quarterLevels = useMemo(
    () => levels && levels.filter((level) => level.type === "Quarters"),
    [levels],
  );
  const teamsInQuarterLevel = useMemo(
    () =>
      quarterLevels &&
      quarterLevels.reduce(
        (arr, level) => [...arr, ...level.teams],
        [] as Topsoccer.Team.FullTeam[],
      ),
    [quarterLevels],
  );
  const quarterScores = useMemo(() => {
    return teamsInQuarterLevel
      ? teamsInQuarterLevel.map((team) => {
          const game = findTeamQuarterGame(team);

          if (!game) return 0;

          return team.id === game.team_a_id
            ? game.team_a_score || 0
            : game.team_b_score || 0;
        })
      : [];

    function findTeamQuarterGame(team: Topsoccer.Team.FullTeam) {
      return (
        fullGames &&
        fullGames.find((game) => {
          const level =
            quarterLevels &&
            quarterLevels.find((level) => level.id === game.level_id)!;

          if (!level) return false;

          return game.team_a_id === team.id || game.team_b_id === team.id;
        })
      );
    }
  }, [fullGames, quarterLevels, teamsInQuarterLevel]);
  const quarterTeamsWithScores = useMemo(() => {
    const teamsWithScores = teamsInQuarterLevel
      ? teamsInQuarterLevel.map((team, i) => {
          return { ...team, score: quarterScores[i] };
        })
      : [];

    teamsWithScores.sort((team1, team2) => team2.score - team1.score);

    return teamsWithScores;
  }, [teamsInQuarterLevel, quarterScores]);

  const teamsAvailableForSemis = useMemo(() => {
    return (
      quarterLevels &&
      quarterLevels.reduce((arr, level) => {
        const levelTeams = quarterTeamsWithScores.filter((team) =>
          level.teams.map((team) => team.id).includes(team.id),
        );

        return [...arr, levelTeams[0]];
      }, [] as Topsoccer.Team.FullTeam[])
    );
  }, [quarterLevels, quarterTeamsWithScores]);

  const semiLevels = useMemo(
    () => levels && levels.filter((level) => level.type === "Semi"),
    [levels],
  );
  const teamsInSemiLevel = useMemo(
    () =>
      semiLevels &&
      semiLevels.reduce(
        (arr, level) => [...arr, ...level.teams],
        [] as Topsoccer.Team.FullTeam[],
      ),
    [semiLevels],
  );
  const semiScores = useMemo(() => {
    return teamsInSemiLevel
      ? teamsInSemiLevel.map((team) => {
          const game = findTeamSemiGame(team);

          if (!game) return 0;

          return team.id === game.team_a_id
            ? game.team_a_score || 0
            : game.team_b_score || 0;
        })
      : [];

    function findTeamSemiGame(team: Topsoccer.Team.FullTeam) {
      return (
        fullGames &&
        fullGames.find((game) => {
          const level =
            semiLevels &&
            semiLevels.find((level) => level.id === game.level_id)!;

          if (!level) return false;

          return game.team_a_id === team.id || game.team_b_id === team.id;
        })
      );
    }
  }, [fullGames, semiLevels, teamsInSemiLevel]);
  const semiTeamsWithScores = useMemo(() => {
    const teamsWithScores = teamsInSemiLevel
      ? teamsInSemiLevel.map((team, i) => {
          return { ...team, score: semiScores[i] };
        })
      : [];

    teamsWithScores.sort((team1, team2) => team2.score - team1.score);

    return teamsWithScores;
  }, [teamsInSemiLevel, semiScores]);

  const teamsAvailableForFinal = useMemo(() => {
    return (
      semiLevels &&
      semiLevels.reduce((arr, level) => {
        const levelTeams = semiTeamsWithScores.filter((team) =>
          level.teams.map((team) => team.id).includes(team.id),
        );

        return [...arr, levelTeams[0]];
      }, [] as Topsoccer.Team.FullTeam[])
    );
  }, [semiLevels, semiTeamsWithScores]);

  const finalLevel = useMemo(
    () => levels && levels.find((level) => level.type === "Final"),
    [levels],
  );
  const teamsInFinalLevel = useMemo(
    () => (finalLevel ? finalLevel.teams : []),
    [finalLevel],
  );
  const finalScores = useMemo(() => {
    return teamsInFinalLevel
      ? teamsInFinalLevel.map((team) => {
          const game = findTeamSemiGame(team);

          if (!game) return 0;

          return team.id === game.team_a_id
            ? game.team_a_score || 0
            : game.team_b_score || 0;
        })
      : [];

    function findTeamSemiGame(team: Topsoccer.Team.FullTeam) {
      return (
        fullGames &&
        fullGames.find((game) => {
          const level = [finalLevel].find(
            (level) => level?.id === game.level_id,
          )!;

          if (!level) return false;

          return game.team_a_id === team.id || game.team_b_id === team.id;
        })
      );
    }
  }, [finalLevel, fullGames, teamsInFinalLevel]);
  const finalTeamsWithScores = useMemo(() => {
    const teamsWithScores = teamsInFinalLevel
      ? teamsInFinalLevel.map((team, i) => {
          return { ...team, score: finalScores[i] };
        })
      : [];

    teamsWithScores.sort((team1, team2) => team2.score - team1.score);

    return teamsWithScores;
  }, [finalScores, teamsInFinalLevel]);

  return (
    <div {...rest} className={cn("flex flex-col", rest.className)}>
      <p className="font-semibold">טבלת הטורניר:</p>
      <div className="relative mt-2 flex gap-24">
        <div className="flex shrink-0 flex-col gap-8">
          {fullLevels &&
            houseLevels &&
            houseLevels.map((level, i) => {
              const fullLevel = fullLevels.find(
                (fullLevel) => fullLevel.id === level.id,
              )!;

              return (
                fullLevel.id && (
                  <LevelCard
                    fullLevel={fullLevel}
                    fullGames={level.games}
                    fullTeams={houseTeamsWithScores.filter((team) =>
                      level.teams.map((team) => team.id).includes(team.id),
                    )}
                    onLevelDelete={
                      onLevelDelete ? () => onLevelDelete(fullLevel) : undefined
                    }
                    onGamesSubmit={onGamesSubmit}
                    onGamesDelete={onGamesDelete}
                    showDeleteButton={
                      (fullTeams.length > 6 &&
                        (!quarterLevels || quarterLevels.length === 0)) ||
                      (fullTeams.length <= 6 &&
                        (!semiLevels || semiLevels.length === 0))
                    }
                    index={i}
                    key={fullLevel.id}
                  />
                )
              );
            })}
          {onLevelAdd &&
            teamsInHouseLevel &&
            teamsInHouseLevel.length < fullTeams.length && (
              <AddLevelButton
                teams={fullTeams}
                exclude={teamsInHouseLevel}
                levelType="House"
                onLevelSubmit={onLevelAdd}
              />
            )}
        </div>
        {fullTeams.length > 6 && houseLevels && houseLevels.length > 0 && (
          <div className="my-auto flex shrink-0 flex-col gap-8">
            {fullLevels &&
              quarterLevels &&
              quarterLevels.map((level, i) => {
                const fullLevel = fullLevels.find(
                  (fullLevel) => fullLevel.id === level.id,
                )!;

                return (
                  <LevelCard
                    fullLevel={fullLevel}
                    fullGames={level.games}
                    fullTeams={quarterTeamsWithScores.filter((team) =>
                      level.teams.map((team) => team.id).includes(team.id),
                    )}
                    onLevelDelete={
                      onLevelDelete ? () => onLevelDelete(fullLevel) : undefined
                    }
                    onGamesSubmit={onGamesSubmit}
                    onGamesDelete={onGamesDelete}
                    showDeleteButton={!semiLevels || semiLevels.length === 0}
                    index={i}
                    key={fullLevel.id}
                  />
                );
              })}
            {onLevelAdd &&
              houseLevels &&
              houseLevels.length > 0 &&
              teamsInQuarterLevel &&
              teamsAvailableForQuarters &&
              teamsInQuarterLevel.length < teamsAvailableForQuarters.length && (
                <AddLevelButton
                  teams={teamsAvailableForQuarters}
                  exclude={teamsInQuarterLevel}
                  levelType="Quarters"
                  onLevelSubmit={onLevelAdd}
                />
              )}
          </div>
        )}
        {quarterLevels && quarterLevels.length > 0 && (
          <div className="my-auto flex shrink-0 flex-col gap-8">
            {fullLevels &&
              semiLevels &&
              semiLevels.map((level, i) => {
                const fullLevel = fullLevels.find(
                  (fullLevel) => fullLevel.id === level.id,
                )!;

                return (
                  <LevelCard
                    fullLevel={fullLevel}
                    fullGames={level.games}
                    fullTeams={semiTeamsWithScores.filter((team) =>
                      level.teams.map((team) => team.id).includes(team.id),
                    )}
                    onLevelDelete={
                      onLevelDelete ? () => onLevelDelete(fullLevel) : undefined
                    }
                    onGamesSubmit={onGamesSubmit}
                    onGamesDelete={onGamesDelete}
                    showDeleteButton={!finalLevel}
                    index={i}
                    key={fullLevel.id}
                  />
                );
              })}
            {onLevelAdd &&
              quarterLevels &&
              quarterLevels.length > 0 &&
              teamsInSemiLevel &&
              teamsAvailableForSemis &&
              teamsInSemiLevel.length < teamsAvailableForSemis.length && (
                <AddLevelButton
                  teams={teamsAvailableForSemis}
                  exclude={teamsInSemiLevel}
                  levelType="Semi"
                  onLevelSubmit={onLevelAdd}
                />
              )}
          </div>
        )}
        {fullTeams.length <= 6 && houseLevels && houseLevels.length > 0 && (
          <div className="my-auto flex shrink-0 flex-col gap-8">
            {fullLevels &&
              semiLevels &&
              semiLevels.map((level, i) => {
                const fullLevel = fullLevels.find(
                  (fullLevel) => fullLevel.id === level.id,
                )!;

                return (
                  <LevelCard
                    fullLevel={fullLevel}
                    fullGames={level.games}
                    fullTeams={semiTeamsWithScores.filter((team) =>
                      level.teams.map((team) => team.id).includes(team.id),
                    )}
                    onLevelDelete={
                      onLevelDelete ? () => onLevelDelete(fullLevel) : undefined
                    }
                    onGamesSubmit={onGamesSubmit}
                    onGamesDelete={onGamesDelete}
                    showDeleteButton={!finalLevel}
                    index={i}
                    key={fullLevel.id}
                  />
                );
              })}
            {onLevelAdd &&
              houseLevels &&
              houseLevels.length > 0 &&
              teamsInSemiLevel &&
              teamsAvailableForQuarters &&
              teamsInSemiLevel.length < teamsAvailableForQuarters.length && (
                <AddLevelButton
                  teams={teamsAvailableForQuarters}
                  exclude={teamsInSemiLevel}
                  levelType="Semi"
                  onLevelSubmit={onLevelAdd}
                />
              )}
          </div>
        )}
        {semiLevels && semiLevels.length > 0 && (
          <div className="my-auto flex shrink-0 flex-col gap-8">
            {fullLevels &&
              finalLevel &&
              [finalLevel].map((level, i) => {
                const fullLevel = fullLevels.find(
                  (fullLevel) => fullLevel.id === level.id,
                )!;

                return (
                  <LevelCard
                    fullLevel={fullLevel}
                    fullGames={level.games}
                    fullTeams={finalTeamsWithScores.filter((team) =>
                      level.teams.map((team) => team.id).includes(team.id),
                    )}
                    onLevelDelete={
                      onLevelDelete ? () => onLevelDelete(fullLevel) : undefined
                    }
                    onGamesSubmit={onGamesSubmit}
                    onGamesDelete={onGamesDelete}
                    showDeleteButton
                    index={i}
                    key={fullLevel.id}
                  />
                );
              })}
            {onLevelAdd &&
              semiLevels &&
              semiLevels.length > 0 &&
              teamsInFinalLevel &&
              teamsAvailableForFinal &&
              teamsInFinalLevel.length < teamsAvailableForFinal.length && (
                <AddLevelButton
                  teams={teamsAvailableForFinal}
                  exclude={teamsInFinalLevel}
                  levelType="Final"
                  onLevelSubmit={onLevelAdd}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentView;
