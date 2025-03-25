import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import TeamForm from "./TeamForm";

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await fetchAuth();
  if (!user) redirect("/");

  const { id } = await params;
  const newTeam = id === "new";

  const team = newTeam ? null : await fetchTeam(id);
  if (!team && !newTeam) redirect("/");

  return (
    <main className="m-auto w-full max-w-lg md:max-h-full">
      <TeamForm user={user} team={team} />
    </main>
  );
}

async function fetchTeam(team_id: string) {
  const supabase = await createClient();

  const { data: is_team_admin } = await supabase
    .rpc("z2_is_team_admin", { _team_id: team_id })
    .select()
    .single<boolean>();
  if (!is_team_admin) return null;

  const { data: team } = await supabase
    .rpc("z2_get_team_data", { _team_id: team_id })
    .single<{
      id: string;
      name: string;
      photo_url: string | null;
      players: Topsoccer.User.UserInterface[];
      admins: Topsoccer.User.UserInterface[];
    }>();

  return team;
}
