"use server";

import { createClient } from "@/clients/supabase/server";
import { getOrigin } from "@/utils/server/getOrigin";

export async function passwordSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}

export async function googleSignin() {
  const origin = await getOrigin();

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}?status=signin_success`,
      },
    });

    if (error) throw error;

    return data.url;
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}

export async function signup({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
        },
      },
    });

    if (error) throw error;
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}

export async function resetPassword({ email }: { email: string }) {
  const origin = await getOrigin();

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/new-password`,
    });

    if (error) throw error;
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}

export async function changePassword({ password }: { password: string }) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) throw error;
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}
