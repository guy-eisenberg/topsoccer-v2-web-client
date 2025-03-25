"use server";

import { createClient } from "@/clients/supabase/server";
import { fetchAuth } from "@/utils/server/fetchAuth";

export async function upsertTeam({
  id,
  name,
  players,
  admins,
}: {
  id: string | null;
  name: string;
  players: string[];
  admins: string[];
}) {
  const user = await fetchAuth();
  if (!user) throw new Error("Unauthorized");

  const supabase = await createClient();

  if (id === null) {
    const { data: existingTeam, error } = await supabase
      .from("teams")
      .select()
      .eq("name", name)
      .maybeSingle();

    if (error) throw error;
    if (existingTeam) throw new Error("TEAM_ALREADY_EXISTS");
  }

  const { data: teamId, error } = await supabase
    .rpc("z2_upsert_team", {
      _id: id,
      _name: name,
      _players: players,
      _admins: admins,
    })
    .single<string>();

  if (error) throw error;
  if (!teamId) throw new Error();

  return teamId;
}

export async function deletePhoto({ team_id }: { team_id: string }) {
  const supabase = await createClient();

  const { error: storageError } = await supabase.storage
    .from("images")
    .remove([`team-avatars/${team_id}`]);

  if (storageError) throw storageError;

  const { error } = await supabase
    .from("teams")
    .update({ photo_url: null })
    .eq("id", team_id);

  if (error) throw error;
}
