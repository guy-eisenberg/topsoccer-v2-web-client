"use client";

import BestPlayerCard from "@/app/components/common/BestPlayerCard";
import GroupIcon from "@/app/components/common/GroupIcon";
import ImageGrid from "@/app/components/common/ImageGrid/ImageGrid";
import { showLoading } from "@/app/components/common/Loader/Loader";
import ImageExpandModal from "@/app/components/common/modals/ImageExpandModal";
import PaymentMethodModal from "@/app/components/common/modals/PaymentMethodModal";
import TeamEnrollModal from "@/app/components/common/modals/TeamEnrollModal";
import TeamUnrollModal from "@/app/components/common/modals/TeamUnrollModal";
import UnrollEventModal from "@/app/components/common/modals/UnrollEventModal";
import WaitingListModal from "@/app/components/common/modals/WaitingListModal";
import PlayerCard from "@/app/components/common/PlayerCard";
import SoccerMap from "@/app/components/common/SoccerMap/SoccerMap";
import StadiumCard from "@/app/components/common/StadiumCard/StadiumCard";
import TeamCard from "@/app/components/common/TeamCard";
import TournamentView from "@/app/components/common/TournamentView/TournamentView";
import WinningTeamCard from "@/app/components/common/WinningTeamCard";
import { Button } from "@/app/components/core/Button";
import Tabs from "@/app/components/core/Tabs";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { isPast } from "@/utils/isPast";
import toast from "@/utils/toast";
import { Chip } from "@heroui/chip";
import { Tab } from "@heroui/tabs";
import {
  IconClock,
  IconEdit,
  IconExternalLink,
  IconLocation,
  IconUsersGroup,
  IconVideo,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  enrollEvent as _enrollEvent,
  singleUnrollEvent as _singleUnrollEvent,
  teamEnrollEvent as _teamEnrollEvent,
  teamUnrollEvent as _teamUnrollEvent,
} from "./actions";

type Player = Topsoccer.User.UserInterface &
  Topsoccer.Event.Stats & {
    group?: Topsoccer.Group.Name;
  };

type EventData = Topsoccer.Event.Object & {
  stadium: Topsoccer.Stadium.FullStadium | null;
  map: Topsoccer.Event.Map[];
  players: Player[];
  waiting_list: Topsoccer.User.UserInterface[];
  teams: (Topsoccer.Team.FullTeam & {
    is_admin: boolean;
    players: Topsoccer.User.UserInterface[];
    admins: Topsoccer.User.UserInterface[];
  })[];
  groups: (Topsoccer.Group.FullGroup & {
    players: Topsoccer.User.UserInterface[];
  })[];
  levels: (Topsoccer.Level.FullLevel & {
    teams: Topsoccer.Team.FullTeam[];
    games: Topsoccer.Game.FullGame[];
  })[];
  games: Topsoccer.Game.FullGame[];
};

export default function EventPageContent({
  user,
  is_worker,
  payment,
  user_teams,
  event,
  banners,
}: {
  user: Topsoccer.User.Auth | null;
  is_worker: boolean;
  payment: Topsoccer.Event.Payment | null;
  user_teams: (Topsoccer.Team.FullTeam & {
    players: Topsoccer.User.UserInterface[];
  })[];
  event: EventData;
  banners: string[];
}) {
  const router = useRouter();

  const past = isPast(new Date(event.time).getTime());

  const { day, month, hour, minute } = getFormattedDate(
    new Date(event.time).getTime(),
  );

  const canUnrollByTime =
    new Date(event.time).getTime() - Date.now() > 28800000 &&
    (() => {
      const date = new Date(event.time);
      date.setHours(10);

      return new Date() < date;
    })();
  const noPlace =
    event && event.max_players && event?.players.length >= event.max_players;

  const enrolled =
    user !== null && event.players.map((player) => player.id).includes(user.id);
  const inWaitingList =
    user !== null &&
    event.waiting_list.map((player) => player.id).includes(user.id);
  const hasOwnTeamEnrolled =
    user !== null &&
    (event.teams.map((team) => team.creator_id).includes(user.id) ||
      event.teams
        .map((team) => team.admins)
        .flat()
        .map((a) => a.id)
        .includes(user.id) ||
      (event.teams.length > 0 && user.role === "admin"));

  const shouldCompletePayment =
    enrolled &&
    (payment?.status !== "Completed" ||
      payment.method === "Cash" ||
      payment.method === "Manual" ||
      payment.method === "Team");

  const statsEmpty = useMemo(
    () =>
      event.players.reduce((sum, player) => sum + (player.goals || 0), 0) === 0,
    [event.players],
  );

  type SortedPlayers = (Topsoccer.User.UserInterface &
    Topsoccer.Event.Stats & {
      group?: Topsoccer.Group.Name;
      goals: number;
      goalsKing?: boolean;
      mvp?: boolean;
    })[];
  const sortedPlayers = useMemo<SortedPlayers>(() => {
    if (!event.players) return [];
    if (event.players.length === 0) return [];

    const playersWithGroups = event.players.sort((player1, player2) =>
      (player2.group || "").localeCompare(player1.group || ""),
    );

    const playersWithStats = playersWithGroups.map((player) => {
      return {
        ...player,
        mvp: false,
        goalsKing: false,
      };
    });

    if (!statsEmpty) {
      playersWithStats.sort((player1, player2) => {
        return (player2.goals || 0) - (player1.goals || 0);
      });

      playersWithStats[0].goalsKing = true;

      playersWithStats.sort((player1, player2) => {
        const player1Score = player1.goals * 2;
        const player2Score = player2.goals * 2;

        return player2Score - player1Score;
      });

      playersWithStats[0].mvp = true;
    }

    return playersWithStats;
  }, [event.players, statsEmpty]);

  const winningTeams = useMemo(() => {
    const arr: {
      title: string;
      image: string;
    }[] = [];
    if (event.winning_team) arr.push(event.winning_team);
    if (event.winning_team_2) arr.push(event.winning_team_2);

    return arr;
  }, [event.winning_team, event.winning_team_2]);

  const bestPlayers = useMemo(() => {
    const arr: {
      player: Topsoccer.User.UserInterface &
        Topsoccer.Event.Stats & {
          group?: Topsoccer.Group.Name;
          goals: number;
          goalsKing?: boolean;
          mvp?: boolean;
        };
      title?: string;
      image?: string;
    }[] = [];

    if (event.best_player) {
      const player = sortedPlayers.find(
        (p) => p.id === event.best_player!.user_id,
      )!;

      if (player)
        arr.push({
          player,
          title: event.best_player.title,
          image: event.best_player.image,
        });
    }
    if (event.best_player_2) {
      const player = sortedPlayers.find(
        (p) => p.id === event.best_player_2!.user_id,
      )!;

      if (player)
        arr.push({
          player,
          title: event.best_player_2.title,
          image: event.best_player_2.image,
        });
    }

    return arr;
  }, [event.best_player, event.best_player_2, sortedPlayers]);

  const [topTab, setTopTab] = useState<
    | "stadium"
    | "winning-team"
    | "winning-team-2"
    | "best-player"
    | "best-player-2"
  >(
    winningTeams[0]
      ? "winning-team"
      : bestPlayers[0]
        ? "best-player"
        : "stadium",
  );
  const [topTabSwitch, setTopTabSwitch] = useState(true);

  const [leftTab, setLeftTab] = useState<
    "players" | "description" | "best-move" | "formation" | "gallery"
  >(
    event.map.length > 0
      ? "formation"
      : past && event.best_move
        ? "best-move"
        : "players",
  );
  const [leftTabSwitch, setLeftTabSwitch] = useState(true);

  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const [singleEnrollModalOpen, setSingleEnrollModalOpen] = useState(false);
  const [completePaymentModalOpen, setCompletePaymentModalOpen] =
    useState(false);
  const [unrollEventModalOpen, setUnrollEventModalOpen] = useState(false);
  const [waitingListModalOpen, setWaitingListModalOpen] = useState(false);
  const [teamEnrollModalOpen, setTeamEnrollModalOpen] = useState(false);
  const [teamUnrollModalOpen, setTeamUnrollModalOpen] = useState(false);

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (!leftTabSwitch) return;

    const interval = setInterval(() => {
      setLeftTab((tab) => {
        if (tab === "players") {
          if (event.description) return "description";
          else if (event.images.length > 0 || event.videos.length > 0)
            return "gallery";
          else if (event.best_move) return "best-move";
          else if (event.map.length > 0) return "formation";
          return "players";
        }
        if (tab === "description") {
          if (event.images.length > 0 || event.videos.length > 0)
            return "gallery";
          else if (event.best_move) return "best-move";
          else if (event.map.length > 0) return "formation";
          return "players";
        } else if (tab === "gallery") {
          if (event.best_move) return "best-move";
          else if (event.map.length > 0) return "formation";
          return "players";
        } else if (tab === "best-move") {
          if (event.map.length > 0) return "formation";
          return "players";
        } else if (tab === "formation") {
          return "players";
        }

        return tab;
      });
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  }, [
    event.best_move,
    event.description,
    event.images.length,
    event.map.length,
    event.videos.length,
    leftTabSwitch,
  ]);

  useEffect(() => {
    if (!topTabSwitch) return;

    const interval = setInterval(() => {
      setTopTab((tab) => {
        if (tab === "stadium") {
          if (winningTeams[0]) return "winning-team";
          else if (winningTeams[1]) return "winning-team-2";
          else if (bestPlayers[0]) return "best-player";
          else if (bestPlayers[1]) return "best-player-2";
        } else if (tab === "winning-team") {
          if (winningTeams[1]) return "winning-team-2";
          else if (bestPlayers[0]) return "best-player";
          else if (bestPlayers[1]) return "best-player-2";
          else if (event.stadium) return "stadium";
        } else if (tab === "winning-team-2") {
          if (bestPlayers[0]) return "best-player";
          else if (bestPlayers[1]) return "best-player-2";
          else if (event.stadium) return "stadium";
          else if (winningTeams[0]) return "winning-team";
        } else if (tab === "best-player") {
          if (bestPlayers[1]) return "best-player-2";
          else if (event.stadium) return "stadium";
          else if (winningTeams[0]) return "winning-team";
          else if (winningTeams[1]) return "winning-team-2";
        } else if (tab === "best-player-2") {
          if (event.stadium) return "stadium";
          else if (winningTeams[0]) return "winning-team";
          else if (winningTeams[1]) return "winning-team-2";
          else if (bestPlayers[0]) return "best-player";
        }

        return tab;
      });
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [event.stadium, winningTeams, bestPlayers, topTabSwitch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((index) => {
        if (index >= banners.length - 1) return 0;

        return index + 1;
      });
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [banners]);

  const showGroups = past || event?.reveal_groups;

  return (
    <>
      <main className="m-auto flex min-h-0 w-full flex-col gap-4 text-center md:h-full md:flex-row">
        <div className="flex min-h-0 flex-1 flex-col gap-2 text-right md:max-w-[50%]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <p className="flex-1 text-xl font-semibold">{event.title}</p>
              {(user?.role === "admin" || is_worker) && (
                <Link href={`/event/edit/${event.id}`}>
                  <Button variant="bordered" color="default" size="sm">
                    <IconEdit className="cursor-pointer" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex flex-wrap justify-between gap-2 text-theme-green md:flex-row">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 rounded-xl border border-theme-green bg-theme-green/10 px-2">
                    <IconClock className="h-4 w-4" />
                    <p>{`${hour}:${minute} · ${day}.${month}`}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl border border-theme-green bg-theme-green/10 px-2">
                    <IconLocation className="h-4 w-4" />
                    <p>{event.address}</p>
                  </div>
                </div>
                <Chip
                  className="inline-flex h-8 gap-2 border border-purple-800 bg-purple-200 px-2 text-purple-800"
                  endContent={<IconVideo className="ml-2 h-4 w-4" />}
                  classNames={{ content: "pl-0" }}
                >
                  משחק זה מצולם בזמן אמת
                </Chip>
              </div>

              {(event.stadium ||
                winningTeams.length > 0 ||
                bestPlayers.length > 0) && (
                <div className="flex min-h-0 flex-col overflow-hidden md:rounded-xl">
                  <Tabs
                    classNames={{
                      panel:
                        "p-0 h-72 border border-theme-light-gray rounded-b-xl border-t-0",
                    }}
                    selectedKey={topTab}
                    onSelectionChange={(key) => {
                      setTopTab(key as any);
                      setTopTabSwitch(false);
                    }}
                  >
                    {event.stadium && (
                      <Tab key="stadium" title="מגרש">
                        <Link href={`/stadium/${event.stadium.id}`}>
                          <StadiumCard
                            className="h-full !rounded-none"
                            stadium={event.stadium}
                            onStadiumDelete={() => {}}
                            showControls={false}
                            showImageArrows
                          />
                        </Link>
                      </Tab>
                    )}
                    {winningTeams[0] && (
                      <Tab
                        key="winning-team"
                        title={winningTeams[0].title || "הקבוצה המנצחת"}
                      >
                        <WinningTeamCard team={winningTeams[0]} />
                      </Tab>
                    )}
                    {winningTeams[1] && (
                      <Tab
                        key="winning-team-2"
                        title={winningTeams[1].title || "הקבוצה המנצחת 2"}
                      >
                        <WinningTeamCard team={winningTeams[1]} />
                      </Tab>
                    )}
                    {bestPlayers[0] && (
                      <Tab
                        key="best-player"
                        title={bestPlayers[0].title || "מלך השערים"}
                      >
                        <BestPlayerCard
                          player={bestPlayers[0]}
                          onClick={() => {
                            if (bestPlayers[0].image)
                              setExpandedImage(bestPlayers[0].image);
                          }}
                        />
                      </Tab>
                    )}
                    {bestPlayers[1] && (
                      <Tab
                        key="best-player-2"
                        title={bestPlayers[1].title || "מלך השערים 2"}
                      >
                        <BestPlayerCard
                          player={bestPlayers[1]}
                          onClick={() => {
                            if (bestPlayers[1].image)
                              setExpandedImage(bestPlayers[1].image);
                          }}
                        />
                      </Tab>
                    )}
                  </Tabs>
                </div>
              )}
            </div>

            {enrolled && !canUnrollByTime && (
              <p className="inline-block rounded-xl border border-danger bg-danger-50 px-2 py-1 text-center text-sm font-semibold text-danger">
                🚨 ביטול אפשרי עד 10:00 בבוקר ביום המשחק 🚨
              </p>
            )}

            {!past && (
              <p className="rounded-xl border border-warning bg-warning-50 px-2 py-1 text-center text-sm font-semibold text-warning">
                מזכירים כי אין ביטוח לפציעות שחקנים!
              </p>
            )}
            <div className="flex justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  className="w-20 border border-theme-green bg-white text-theme-green"
                  onPress={() => {
                    const previousRoute = localStorage.getItem("previousRoute");

                    router.push(previousRoute || "/");
                  }}
                >
                  חזרה
                </Button>

                {!past &&
                  ((event?.sub_type === "Singles" &&
                    (enrolled || inWaitingList)) ||
                    (event?.sub_type === "Teams" && hasOwnTeamEnrolled)) && (
                    <Button
                      color="danger"
                      isDisabled={
                        !canUnrollByTime || (enrolled && payment === null)
                      }
                      onPress={() => {
                        if (event?.sub_type === "Singles") {
                          setUnrollEventModalOpen(true);
                        } else if (event.teams && event?.sub_type === "Teams") {
                          setTeamUnrollModalOpen(true);
                        }
                      }}
                    >
                      בטל הרשמה
                    </Button>
                  )}

                {user ? (
                  ((event?.sub_type === "Singles" &&
                    !enrolled &&
                    !inWaitingList) ||
                    (event?.sub_type === "Teams" && !event.full)) &&
                  !past && (
                    <Button
                      className="font-medium"
                      color="primary"
                      isDisabled={
                        event?.sub_type === "Singles" &&
                        payment !== null &&
                        payment.status === "Completed"
                      }
                      onPress={() => {
                        if (
                          event?.sub_type === "Singles" &&
                          !noPlace &&
                          !event.full
                        )
                          return setSingleEnrollModalOpen(true);
                        else if (event?.sub_type === "Singles")
                          return setWaitingListModalOpen(true);
                        else if (event?.sub_type === "Teams" && !event.full) {
                          return setTeamEnrollModalOpen(true);
                        }
                      }}
                    >
                      {event?.sub_type === "Singles"
                        ? noPlace || event.full
                          ? "היכנס לרשימת המתנה"
                          : `הירשם - ${event.price}₪ / ניקוב`
                        : `רישום קבוצה`}
                    </Button>
                  )
                ) : (
                  <Link href="/signin">
                    <Button className="font-medium" color="primary">
                      היכנס בכדי להרשם
                    </Button>
                  </Link>
                )}

                {user !== null && shouldCompletePayment && (
                  <Button
                    color="primary"
                    onPress={() => setCompletePaymentModalOpen(true)}
                  >
                    השלם תשלום
                  </Button>
                )}
              </div>
              {event?.sub_type === "Singles" && (
                <Link href="/tickets">
                  <Button
                    className="border border-theme-green bg-theme-green/10 text-theme-green"
                    endContent={<IconExternalLink className="h-4 w-4" />}
                  >
                    לקניית כרטיסייה
                  </Button>
                </Link>
              )}
            </div>
          </div>
          {banners.length > 0 && (
            <div className="relative hidden max-h-[320px] flex-1 md:block">
              <a href="https://shirt4u.co.il" target="_blank">
                <Image
                  alt="Banner"
                  className="rounded-xl object-cover"
                  src={banners[currentBannerIndex]}
                  fill
                />
              </a>
            </div>
          )}
        </div>
        <Tabs
          classNames={{
            panel:
              "border border-t-0 border-theme-light-gray bg-theme-card p-3 flex-1 rounded-b-xl",
          }}
          selectedKey={leftTab}
          onSelectionChange={(key) => {
            setLeftTab(key as any);
            setLeftTabSwitch(false);
          }}
        >
          <Tab key="players" title="משתתפים">
            <div className="flex min-h-0 flex-1 flex-col rounded-b-xl">
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex flex-1 gap-2 overflow-x-auto">
                    {event?.sub_type === "Singles" &&
                      showGroups &&
                      event.groups.map((group) => (
                        <div
                          className="flex shrink-0 items-center gap-2 rounded-xl border border-theme-light-gray bg-theme-foreground p-2"
                          key={group.id}
                        >
                          <GroupIcon
                            className="!h-10 !w-10"
                            color={group.name}
                          />
                          <div className="text-right">
                            {past && (
                              <p className="whitespace-nowrap text-sm font-medium">
                                {group.wins || 0} נצחונות
                              </p>
                            )}
                            <p className="whitespace-nowrap text-xs text-theme-gray">
                              {group.players?.length} שחקנים
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-col items-end gap-2 text-sm">
                    {true && (
                      <Chip
                        className="inline-flex h-8 gap-2 border border-warning bg-warning/10 px-2 text-xs text-warning"
                        classNames={{ content: "pl-0" }}
                        endContent={<IconClock className="ml-2 h-4 w-4" />}
                      >
                        <p className="font-semibold">ברשימת המתנה</p>
                      </Chip>
                    )}
                    <Chip
                      className="inline-flex h-8 max-w-[unset] gap-2 border border-theme-green bg-theme-green/10 px-2 text-xs text-theme-green"
                      classNames={{ content: "pl-0" }}
                      endContent={<IconUsersGroup className="ml-2 h-4 w-4" />}
                    >
                      <span className="font-semibold">
                        {event.players.length || 0}
                      </span>{" "}
                      שחקנים{" "}
                      {event.players &&
                        event.players.length > 0 &&
                        !past &&
                        "כבר נרשמו"}
                    </Chip>
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto scrollbar-hide">
                  {event?.sub_type === "Singles" ? (
                    [
                      ...sortedPlayers.map((player, i) => {
                        return (
                          <Link href={`/player/${player.id}`} key={player.id}>
                            <PlayerCard
                              player={player}
                              group={showGroups ? player.group : undefined}
                              mvp={player.mvp}
                              goalsKing={player.goalsKing}
                              index={i}
                            />
                          </Link>
                        );
                      }),
                      event.waiting_list && event.waiting_list.length > 0 && (
                        <React.Fragment key="waiting-list">
                          <div className="relative py-2" key="seperator">
                            <div className="h-[1px] bg-warning" />
                            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 dark:bg-theme-card">
                              רשימת המתנה
                            </p>
                          </div>
                          {...(event.waiting_list || []).map((player, i) => {
                            return (
                              <Link
                                href={`/player/${player.id}`}
                                key={player.id}
                              >
                                <PlayerCard
                                  player={player}
                                  index={sortedPlayers.length + i}
                                />
                              </Link>
                            );
                          })}
                        </React.Fragment>
                      ),
                    ]
                  ) : (
                    <>
                      <div
                        className="flex gap-2 overflow-x-auto"
                        style={{
                          flexDirection: event.levels ? "row" : "column",
                        }}
                      >
                        {event.teams.map((team) => (
                          <Link href={`/team/${team.id}`} key={team.id}>
                            <TeamCard team={team} isAdmin={team.is_admin} />
                          </Link>
                        ))}
                      </div>
                      <TournamentView
                        className="overflow-x-auto"
                        levels={event.levels}
                        games={event.games}
                        teams={event.teams}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </Tab>
          <Tab key="description" title="קונספט המשחק">
            <p className="whitespace-pre-wrap">{event.description}</p>
          </Tab>
          {(event.images.length > 0 || event.videos.length > 0) && (
            <Tab key="gallery" title="גלריה">
              <ImageGrid
                className="w-full"
                images={event.images}
                videos={event.videos}
              />
            </Tab>
          )}
          {event.best_move && (
            <Tab key="best-move" title="המהלך היפה">
              <iframe
                className="h-full min-h-[320px] w-full"
                src={event?.best_move}
              ></iframe>
            </Tab>
          )}
          {event.map.length > 0 && (
            <Tab key="formation" title="נבחרת המחזור">
              <SoccerMap players={event.map} />
            </Tab>
          )}
        </Tabs>

        <ImageExpandModal
          src={expandedImage || ""}
          isOpen={expandedImage !== null}
          onOpenChange={(open) => {
            if (!open) setExpandedImage(null);
          }}
        />

        {user && (
          <>
            <PaymentMethodModal
              user={user}
              onMethodSelect={enrollEvent}
              enableWallet={user.wallet > 0}
              isOpen={singleEnrollModalOpen}
              onOpenChange={setSingleEnrollModalOpen}
            />

            <PaymentMethodModal
              user={user}
              onMethodSelect={enrollEvent}
              enableCash={false}
              isOpen={completePaymentModalOpen}
              onOpenChange={setCompletePaymentModalOpen}
            />

            <UnrollEventModal
              unroll={singleUnrollEvent}
              isOpen={unrollEventModalOpen}
              onOpenChange={setUnrollEventModalOpen}
            />

            <WaitingListModal
              user={user}
              enroll={enrollWaitingList}
              isOpen={waitingListModalOpen}
              onOpenChange={setWaitingListModalOpen}
            />

            <TeamEnrollModal
              event={event}
              enroll={teamEnrollEvent}
              userTeams={user_teams}
              isOpen={teamEnrollModalOpen}
              onOpenChange={setTeamEnrollModalOpen}
            />

            <TeamUnrollModal
              unroll={teamUnrollEvent}
              userTeams={event.teams.filter((team) =>
                user_teams.map((t) => t.id).includes(team.id),
              )}
              isOpen={teamUnrollModalOpen}
              onOpenChange={setTeamUnrollModalOpen}
            />
          </>
        )}
      </main>
    </>
  );

  async function enrollEvent(payment_method: Topsoccer.PaymentMethod) {
    toast.loading(
      payment_method === "Cash" ||
        payment_method === "Wallet" ||
        payment_method === "Team"
        ? "טוען..."
        : "טוען עמוד תשלום...",
    );
    const hideLoading = showLoading();

    const supabase = createClient();
    const { data: nextUrl } = await supabase
      .rpc("z2_check_eligibility")
      .single<string | null>();

    if (nextUrl) {
      await parseNextUrls(nextUrl);

      hideLoading();

      return;
    }

    try {
      const url = await _enrollEvent({
        event_id: event.id,
        payment_method,
        waiting_list: false,
      });

      window.location.replace(url);
    } catch (err) {
      console.log(err);
      toast.error();

      hideLoading();

      return Promise.reject(err);
    }
  }

  async function enrollWaitingList() {
    toast.loading();
    const hideLoading = showLoading();

    const supabase = createClient();
    const { data: nextUrl } = await supabase
      .rpc("z2_check_eligibility")
      .single<string | null>();

    if (nextUrl) {
      await parseNextUrls(nextUrl);

      hideLoading();

      return;
    }

    try {
      const url = await _enrollEvent({
        event_id: event.id,
        payment_method: null,
        waiting_list: true,
      });

      window.location.replace(url);
    } catch (err) {
      console.log(err);
      toast.error();

      hideLoading();

      return Promise.reject(err);
    }
  }

  async function singleUnrollEvent() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const url = await _singleUnrollEvent({
        event_id: event.id,
      });

      window.location.replace(url);
    } catch (err) {
      console.log(err);
      toast.error();

      hideLoading();

      return Promise.reject(err);
    }
  }

  async function teamEnrollEvent(team_id: string) {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const url = await _teamEnrollEvent({ event_id: event.id, team_id });

      window.location.replace(url);
    } catch (err) {
      console.log(err);
      toast.error();

      hideLoading();

      return Promise.reject(err);
    }
  }

  async function teamUnrollEvent(team_id: string) {
    toast.loading();
    const hideLoading = showLoading();

    try {
      const url = await _teamUnrollEvent({ event_id: event.id, team_id });

      window.location.replace(url);
    } catch (err) {
      console.log(err);
      toast.error();

      hideLoading();

      return Promise.reject(err);
    }
  }

  async function parseNextUrls(nextUrl: string) {
    const urls = nextUrl.split("&next=");

    if (urls.length === 1)
      await router.replace(
        `${urls[0]}?status=data-missing&next=/event/${event.id}`,
      );
    else
      await router.replace(
        `${urls[0]}?status=data-missing&next=${encodeURIComponent(`${urls[1]}?status=data-missing&next=/event/${event.id}`)}`,
      );
  }
}
