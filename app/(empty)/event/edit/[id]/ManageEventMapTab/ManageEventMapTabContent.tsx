"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import PlayerCard from "@/app/components/common/PlayerCard";
import SoccerMap from "@/app/components/common/SoccerMap/SoccerMap";
import { Button } from "@/app/components/core/Button";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { IconMinus, IconPlus, IconStar } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import CommonActionButtons from "../components/CommonActionButtons";
import { updateMap as _updateMap } from "./actions";

export default function ManageEventMapTabContent({
  event,
  players: _players,
  map: _map,
}: {
  event: Topsoccer.Event.Object;
  players: (Topsoccer.User.UserInterface & {
    goals: number;
    assists: number;
    balls_outside: number;
    self_goal: number;
    penalty_saved: number;
    clean_net: number;
    late: boolean;
    is_goalkeeper: boolean;
    group: Topsoccer.Group.Name | null;
    team: Topsoccer.Team.FullTeam | null;
  })[];
  map: Topsoccer.Event.Map[];
}) {
  const router = useRouter();

  const [map, setMap] = useState(_map);

  const playersWithAssociation = useMemo<
    (Topsoccer.User.UserInterface &
      Topsoccer.Event.Stats & {
        group: Topsoccer.Group.Name | null;
        team: Topsoccer.Team.FullTeam | null;
      })[]
  >(() => {
    if (event.sub_type === "Singles")
      return _players.sort((player1, player2) =>
        (player2.group || "").localeCompare(player1.group || ""),
      );
    else if (event.sub_type === "Teams")
      return _players.sort((player1, player2) =>
        (player2.team?.name || "").localeCompare(player1.team?.name || ""),
      );

    return _players;
  }, [event.sub_type, _players]);

  const players = useMemo(() => {
    if (!map) return [];

    return map.filter((p) => _players.map((p) => p.id).includes(p.user_id));
  }, [_players, map]);

  const { playersInMap, playersNotInMap } = useMemo(() => {
    if (!playersWithAssociation)
      return { playersInMap: [], playersNotInMap: [] };

    const playersInMapUids = players.map((player) => player.user_id);

    return {
      playersInMap: playersWithAssociation.filter((player) =>
        playersInMapUids.includes(player.id),
      ),
      playersNotInMap: playersWithAssociation.filter(
        (player) => !playersInMapUids.includes(player.id),
      ),
    };
  }, [playersWithAssociation, players]);

  useEffect(() => {
    setMap(_map);
  }, [_map]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <p className="text-lg font-semibold">נבחרת המחזור:</p>
      <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto scrollbar-hide">
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-sm font-semibold">לא בנבחרת:</p>
            {playersNotInMap.map((player, i) => (
              <div className="flex gap-2" key={player.id}>
                <PlayerCard
                  className="flex-1"
                  player={player}
                  group={player.group}
                  index={i}
                />
                <Button
                  color="primary"
                  onPress={() => {
                    setMap([
                      ...players,
                      {
                        event_id: event.id,
                        user_id: player.id,
                        name: player.display_name,
                        x: 0,
                        y: 0,
                        is_mvp: false,
                        image: player.photo_url,
                        group: player.group,
                      },
                    ]);
                  }}
                  isIconOnly
                >
                  <IconPlus width={20} height={20} color="white" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-sm font-semibold">בנבחרת:</p>
            {playersInMap.map((player, i) => {
              const playerMapIndex = players.findIndex(
                (p) => p.user_id === player.id,
              );
              const playerMapEntry = players[playerMapIndex];

              return (
                <div className="flex gap-2" key={player.id}>
                  <PlayerCard
                    className="flex-1"
                    player={player}
                    group={player.group}
                    index={i}
                  />
                  <Button
                    color="primary"
                    onClick={() => {
                      if (playerMapIndex === -1) return;

                      const newPlayers = [...players];
                      newPlayers.splice(playerMapIndex, 1);

                      setMap(newPlayers);
                    }}
                    isIconOnly
                  >
                    <IconMinus width={20} height={20} color="white" />
                  </Button>
                  <Button
                    className="relative"
                    color="warning"
                    onClick={() => {
                      if (playerMapIndex === -1) return;

                      const newPlayers = [...players];
                      newPlayers[playerMapIndex].is_mvp =
                        !playerMapEntry.is_mvp;

                      setMap(newPlayers);
                    }}
                    isIconOnly
                  >
                    <IconStar />
                    {playerMapEntry.is_mvp && (
                      <div className="absolute h-[2px] w-3/4 rotate-45 bg-black" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-full min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          <SoccerMap players={players} updatePlayers={setMap} enableEdit />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <Button className="shrink-0" color="primary" onPress={updateMap}>
          שמור את נבחרת המחזור
        </Button>
        <CommonActionButtons event={event} />
      </div>
    </div>
  );

  async function updateMap() {
    toast.loading("שומר...");
    const hideLoading = showLoading();

    const newMap = map.map((entry) => ({
      event_id: entry.event_id,
      user_id: entry.user_id,
      x: entry.x,
      y: entry.y,
      is_mvp: entry.is_mvp,
    }));

    try {
      await _updateMap({ event_id: event.id, map: newMap });

      await router.refresh();

      toast.success("נבחרת מחזור נשמרה בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
