"use server";

import { createClient } from "@/clients/supabase/server";

export async function signout() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  } catch (err) {
    console.error("User signout error:", err);

    return Promise.reject(err);
  }
}
