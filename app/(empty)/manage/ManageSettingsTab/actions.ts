"use server";

import { createClient } from "@/clients/supabase/server";

export async function setSetting(key: string, value: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("data")
    .upsert({ key, value }, { onConflict: "key" });

  if (error) throw error;
}
