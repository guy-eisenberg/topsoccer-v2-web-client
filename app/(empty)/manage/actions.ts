"use server";

import { createClient } from "@/clients/supabase/server";

export async function deleteStadium({ stadium_id }: { stadium_id: string }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("stadiums")
    .delete()
    .eq("id", stadium_id);

  if (error) throw error;
}
