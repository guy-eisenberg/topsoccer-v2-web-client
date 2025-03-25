"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import TeamCard from "@/app/components/common/TeamCard";
import TournamentView from "@/app/components/common/TournamentView/TournamentView";
import { Button } from "@/app/components/core/Button";
import Input from "@/app/components/core/Input";
import { createClient } from "@/clients/supabase/client";
import { useRouter } from "@/context/RouterContext";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import Link from "next/link";
import { useState } from "react";
import CommonActionButtons from "../components/CommonActionButtons";
import RemoveTeamModal from "../components/modals/RemoveTeamModal";
import {
  addGames as _addGames,
  addLevel as _addLevel,
  deleteGames as _deleteGames,
  deleteLevel as _deleteLevel,
  manualEnrollTeam as _manualEnrollTeam,
  removeTeam as _removeTeam,
} from "./actions";

export default function ManageEventTeamsTabContent({
  event,
  teams,
  levels,
  games,
}: {
  event: Topsoccer.Event.Object;
  teams: (Topsoccer.Team.FullTeam & {
    players: Topsoccer.User.UserInterface[];
    admins: Topsoccer.User.UserInterface[];
  })[];
  levels: (Topsoccer.Level.FullLevel & {
    games: Topsoccer.Game.FullGame[];
    teams: Topsoccer.Team.FullTeam[];
  })[];
  games: Topsoccer.Game.FullGame[];
}) {
  const router = useRouter();

  const [selectedTeam, setSelectedTeam] =
    useState<Topsoccer.Team.FullTeam | null>(null);
  const [removeTeamModalOpen, setRemoveTeamModalOpen] = useState(false);

  const [teamNameTerm, setTeamNameTerm] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <p className="text-lg font-semibold">קבוצות:</p>
        <div className="flex flex-1 items-center gap-4">
          <Input
            className="flex-1"
            placeholder="הוסף לפי שם קבוצה"
            value={teamNameTerm}
            onChange={(e) => setTeamNameTerm(e.target.value)}
          />
          <Button
            color="primary"
            onPress={manualEnrollTeam}
            isDisabled={teamNameTerm.length === 0}
          >
            הוסף
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          {teams.map((team) => (
            <Link href={`/team/${team.id}`} key={team.id}>
              <TeamCard
                className="h-full w-full"
                team={team}
                buttons={
                  <>
                    <Button
                      color="danger"
                      onPress={() => {
                        setSelectedTeam(team);
                        setRemoveTeamModalOpen(true);
                      }}
                    >
                      מחק
                    </Button>
                  </>
                }
              />
            </Link>
          ))}
        </div>
        <TournamentView
          className="mt-2 min-w-0 overflow-x-auto"
          levels={levels}
          games={games}
          teams={teams}
          onLevelAdd={addLevel}
          onLevelDelete={deleteLevel}
          onGamesSubmit={addGamesToLevel}
          onGamesDelete={deleteGamesFromLevel}
        />
      </div>
      <div className="flex justify-end">
        <CommonActionButtons event={event} />
      </div>

      {selectedTeam && (
        <RemoveTeamModal
          team={selectedTeam}
          removeTeam={removeTeam}
          isOpen={removeTeamModalOpen}
          onOpenChange={setRemoveTeamModalOpen}
        />
      )}
    </div>
  );

  async function addLevel(level: Topsoccer.Level.LevelCreateData) {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _addLevel({ event_id: event.id, level });

      await router.refresh();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function deleteLevel(level: Topsoccer.Level.FullLevel) {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _deleteLevel({ event_id: event.id, level_id: level.id });

      await router.refresh();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function addGamesToLevel({
    level,
    games,
  }: {
    level: Topsoccer.Level.FullLevel;
    games: Topsoccer.Game.GameCreateData[];
  }) {
    toast.loading();
    const hideLoading = showLoading();

    const gamesData = games.map((game) => ({
      id: game.id ? game.id : undefined,
      event_id: event.id,
      level_id: level.id,
      team_a_id: game.teamA.team.id,
      team_a_score: game.teamA.score || null,
      team_b_id: game.teamB.team.id,
      team_b_score: game.teamB.score || null,
    }));

    const teamsData: { event_id: string; level_id: string; team_id: string }[] =
      [];
    games.forEach((game) => {
      teamsData.push(
        ...[
          {
            event_id: event.id,
            level_id: level.id,
            team_id: game.teamA.team.id,
          },
          {
            event_id: event.id,
            level_id: level.id,
            team_id: game.teamB.team.id,
          },
        ],
      );
    });

    try {
      await _addGames({ games: gamesData, teams: teamsData });

      await router.refresh();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function deleteGamesFromLevel({
    level,
    games,
  }: {
    level: Topsoccer.Level.FullLevel;
    games: Topsoccer.Game.GameCreateData[];
  }) {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _deleteGames({
        event_id: event.id,
        level_id: level.id,
        games: games.map((g) => g.id!),
      });

      await router.refresh();

      toast.success("שינויים נשמרו בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function manualEnrollTeam() {
    toast.loading("מוצא קבוצה...");
    const hideLoading = showLoading();

    const supabase = createClient();

    try {
      const { data: team } = await supabase
        .from("teams")
        .select()
        .eq("name", teamNameTerm.trim())
        .single<Topsoccer.Team.FullTeam>();

      if (!team) throw new Error("קבוצה לא נמצאה");

      if (teams.map((team) => team.id).includes(team.id))
        throw new Error("לא ניתן להוסיף קבוצה יותר מפעם אחת");

      await _manualEnrollTeam({ event_id: event.id, team_id: team.id });

      await router.refresh();

      toast.success("קבוצה נוספה בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }

  async function removeTeam() {
    if (!selectedTeam) return;

    toast.loading();
    const hideLoading = showLoading();

    try {
      await _removeTeam({ event_id: event.id, team_id: selectedTeam.id });

      await router.refresh();

      toast.success("קבוצה הוסרה בהצלחה!");
    } catch (err) {
      console.log(err);
      toast.error();

      return Promise.reject(err);
    } finally {
      hideLoading();
    }
  }
}
