"use server";

import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";

export async function upsertStadium(stadium: {
  id?: string;
  name: string;
  description: string | null;
  city: string;
  address: string;
  days: boolean[];
  types: Topsoccer.Event.Type[];
  waze_url: string | null;
  whatsapp_url: string | null;
}) {
  const supabase = await createClient();

  const { data: newStadium, error } = await supabase
    .from("stadiums")
    .upsert(stadium)
    .select()
    .single<Topsoccer.Stadium.FullStadium>();

  if (error) throw error;
  if (!stadium) throw new Error();

  return newStadium.id;
}

export async function updateImages({
  stadium_id,
  main_image,
  images,
}: {
  stadium_id: string;
  main_image: string | null;
  images: string[];
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("stadiums")
    .update({ main_image, images })
    .eq("id", stadium_id);

  if (error) throw error;
}
