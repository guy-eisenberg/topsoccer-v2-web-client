import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";

export async function fetchAuth() {
  const supabase = await createClient();

  const { data: user } = await supabase
    .rpc("z2_get_full_user")
    .select()
    .single<Topsoccer.User.Auth>();

  if (user)
    await supabase
      .from("users")
      .update({ last_seen: new Date().toISOString() })
      .eq("id", user.id);

  if (!user) return null;

  return user;
}
