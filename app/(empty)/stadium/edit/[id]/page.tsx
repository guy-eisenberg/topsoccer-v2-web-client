import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import EditStadiumPageContent from "./EditStadiumPageContent";

export default async function EditStadiumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await fetchAuth();
  if (!user || user.role !== "admin") redirect("/");

  const supabase = await createClient();
  const { data: stadium } = await supabase
    .from("stadiums")
    .select()
    .eq("id", id)
    .single<Topsoccer.Stadium.FullStadium>();

  const newStadium = id === "new";

  if (!stadium && !newStadium) redirect("/");

  return <EditStadiumPageContent stadium={stadium} />;
}
