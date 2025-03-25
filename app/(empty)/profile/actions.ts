"use server";

import { createClient } from "@/clients/supabase/server";
import { fetchAuth } from "@/utils/server/fetchAuth";

export async function updateProfile({
  display_name,
  photo_url,
  tz_id,
  phone_number,
  email,
  city,
  birth_date,
}: {
  display_name: string;
  photo_url: string | null;
  tz_id: string | null;
  phone_number: string | null;
  email: string;
  city: string | null;
  birth_date: string | null;
}) {
  const supabase = await createClient();
  const user = await fetchAuth();
  if (!user) throw new Error("Unauthorized");

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from("users")
      .update({
        display_name,
        email,
        photo_url,
      })
      .eq("id", user.id),
    supabase
      .from("users_private_data")
      .update({
        birth_date: birth_date ? birth_date : null,
        city: city ? city : null,
        phone_number: phone_number ? phone_number : null,
        tz_id: tz_id ? tz_id : null,
      })
      .eq("id", user.id)
      .select(),
  ]);

  if (error1) throw error1;
  if (error2) throw error2;
}

export async function deleteAvatar() {
  const supabase = await createClient();
  const user = await fetchAuth();
  if (!user) throw new Error("Unauthorized");

  const { error: storageError } = await supabase.storage
    .from("images")
    .remove([`avatars/${user.id}`]);

  if (storageError) throw storageError;

  const { error } = await supabase
    .from("users")
    .update({ photo_url: null })
    .eq("id", user.id);

  if (error) throw error;
}
