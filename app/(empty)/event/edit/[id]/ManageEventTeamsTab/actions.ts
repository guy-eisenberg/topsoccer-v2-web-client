"use server";

import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";

export async function addLevel({
  event_id,
  level,
}: {
  event_id: string;
  level: Topsoccer.Level.LevelCreateData;
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("z2_event_add_level", {
    _event_id: event_id,
    _type: level.type,
    _team_a_id: level.teams[0].id,
    _team_b_id: level.teams[1].id,
  });

  if (error) throw error;
}

export async function deleteLevel({
  event_id,
  level_id,
}: {
  event_id: string;
  level_id: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events_levels")
    .delete()
    .eq("event_id", event_id)
    .eq("id", level_id);

  if (error) throw error;
}

export async function addGames({
  games,
  teams,
}: {
  games: {
    id: string | undefined;
    event_id: string;
    level_id: string;
    team_a_id: string;
    team_a_score: number | null;
    team_b_id: string;
    team_b_score: number | null;
  }[];
  teams: { event_id: string; level_id: string; team_id: string }[];
}) {
  const supabase = await createClient();

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from("events_levels_games")
      .upsert(games, { defaultToNull: false }),
    supabase
      .from("events_levels_teams")
      .upsert(teams, { onConflict: "event_id, level_id, team_id" }),
  ]);

  if (error1) throw error1;
  if (error2) throw error2;
}

export async function deleteGames({
  event_id,
  level_id,
  games,
}: {
  event_id: string;
  level_id: string;
  games: string[];
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("z2_event_level_delete_games", {
    _event_id: event_id,
    _level_id: level_id,
    _games: games,
  });

  if (error) throw error;
}

export async function manualEnrollTeam({
  event_id,
  team_id,
}: {
  event_id: string;
  team_id: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("z2_team_enroll_event", {
    _event_id: event_id,
    _team_id: team_id,
  });

  if (error) throw error;
}

export async function removeTeam({
  event_id,
  team_id,
}: {
  event_id: string;
  team_id: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("z2_team_unroll_event", {
    _event_id: event_id,
    _team_id: team_id,
  });

  if (error) throw error;
}
