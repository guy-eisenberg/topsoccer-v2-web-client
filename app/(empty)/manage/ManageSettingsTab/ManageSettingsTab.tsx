import { createClient } from "@/clients/supabase/server";
import ManageSettingsTabContent from "./ManageSettingsTabContent";

export default async function ManageSettingsTab() {
  const { player_profile_default_viewmode } = await getSettings();

  return (
    <ManageSettingsTabContent settings={{ player_profile_default_viewmode }} />
  );
}

async function getSettings() {
  const supabase = await createClient();

  const { data: player_profile_default_viewmode } = await supabase
    .from("data")
    .select("value")
    .eq("key", "player_profile_default_viewmode")
    .maybeSingle();

  return {
    player_profile_default_viewmode: player_profile_default_viewmode
      ? (player_profile_default_viewmode.value as "last_events" | "stats")
      : "last_events",
  };
}
