import UpsaleModalSSR from "@/app/components/common/modals/UpsaleModal/UpsaleModalSSR";
import { createClient } from "@/clients/supabase/server";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import EventPageContent from "./EventPageContent";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await fetchAuth();

  const { event, teams, payment, is_worker } = await fetchData({
    event_id: id,
    user_id: user ? user.id : null,
  });
  if (!event) redirect("/");

  return (
    <>
      <EventPageContent
        user={user}
        user_teams={teams}
        payment={payment}
        is_worker={is_worker || false}
        event={event}
      />
      <UpsaleModalSSR />
    </>
  );
}

async function fetchData({
  event_id,
  user_id,
}: {
  event_id: string;
  user_id: string | null;
}) {
  const supabase = await createClient();

  const [
    { data: event },
    { data: teams },
    { data: payment },
    { data: is_worker },
  ] = await Promise.all([
    supabase
      .rpc("z2_get_event_data", {
        _id: event_id,
      })
      .single<any>(),
    supabase.rpc("z2_get_user_admin_teams"),
    supabase
      .from("events_payments")
      .select()
      .eq("event_id", event_id)
      .eq("user_id", user_id)
      .single(),
    supabase
      .rpc("z2_is_event_worker", { _event_id: event_id })
      .single<boolean>(),
  ]);

  return { event, teams, payment, is_worker };
}
