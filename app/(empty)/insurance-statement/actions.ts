"use server";

import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";

export async function updateInsuranceStatement(
  data: Omit<Topsoccer.User.InsuranceStatement, "signed_on">,
) {
  const {
    heart_problems,
    exercise_difficulty,
    lung_problems,
    diabetes,
    epilepsy,
    other_issues,
    full_name,
    tz_id,
  } = data;

  try {
    const user = await fetchAuth();
    if (!user) throw new Error("Not authenticated.");

    const supabase = await createClient();

    const { error } = await supabase
      .from("users_private_data")
      .update({
        insurance_statement: {
          heart_problems,
          exercise_difficulty,
          lung_problems,
          diabetes,
          epilepsy,
          other_issues,
          full_name,
          tz_id,
          signed_on: new Date().toISOString(),
        },
      })
      .eq("id", user!.id);

    if (error) throw error;
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}
