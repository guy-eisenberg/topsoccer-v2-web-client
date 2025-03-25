import TeamCard from "@/app/components/common/TeamCard";
import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import Link from "next/link";

export default async function MyTeamsList() {
  const teams = await fetchTeams();

  return (
    <div>
      {teams.length > 0 && (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
          {teams.map((team) => (
            <Link href={`team/${team.id}`} key={team.id}>
              <TeamCard team={team} isAdmin={team.is_admin} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

async function fetchTeams() {
  const supabase = await createClient();

  const { data: teams } = (await supabase.rpc("z2_get_user_teams")) as {
    data: {
      id: string;
      name: string;
      photo_url: string | null;
      is_admin: boolean;
      players: Topsoccer.User.UserInterface[];
    }[];
  };

  return teams;
}
