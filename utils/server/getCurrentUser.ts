import type { Topsoccer } from "@/types";
import { type SupabaseClient } from "@supabase/supabase-js";

interface FullUserData {
  id: string;
  created_at: string;
  display_name: string;
  email: string;
  photo_url: string;
  last_seen: string;
  birth_date: string;
  city: string;
  phone_number: string;
  tz_id: string;
  role: Topsoccer.User.Role;
  can_pay_cash: boolean;
  blocked: boolean;
  provider: Topsoccer.User.Provider;
  wallet: number;
}

export default async function getCurrentUser(
  request: Request,
  client: SupabaseClient,
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  const { data } = await client.auth.getUser(token);
  if (!data.user) return null;

  const {
    data: [user],
  } = await client.rpc("z2_get_full_user", { _user_id: data.user.id });

  return user as FullUserData;
}
