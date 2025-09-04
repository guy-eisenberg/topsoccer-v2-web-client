import QueryTabs from "@/app/components/core/QueryTabs";
import Skeleton from "@/app/components/core/Skeleton";
import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ManageEventBestPlayersTab } from "./ManageEventBestPlayersTab/ManageEventBestPlayersTab";
import ManageEventCancelsTab from "./ManageEventCancelsTab/ManageEventCancelsTab";
import ManageEventDetailsTab from "./ManageEventDetailsTab";
import ManageEventImagesTab from "./ManageEventImagesTab";
import ManageEventMapTab from "./ManageEventMapTab/ManageEventMapTab";
import ManageEventPlayersTab from "./ManageEventPlayersTab/ManageEventPlayersTab";
import ManageEventTeamsTab from "./ManageEventTeamsTab/ManageEventTeamsTab";
import ManageEventVideosTab from "./ManageEventVideosTab";
import ManageEventWaitingListTab from "./ManageEventWaitingListTab/ManageEventWaitingListTab";
import ManageEventWinningTeamsTab from "./ManageEventWinningTeamsTab";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab: string }>;
}) {
  const user = await fetchAuth();
  if (!user || (user.role !== "admin" && user.role !== "worker")) redirect("/");

  const { id } = await params;
  const newEvent = id === "new";

  const event = newEvent ? null : await fetchEvent(id);
  if (!event && !newEvent) redirect("/");

  const stadiums = await fetchStadiums();

  const { tab } = await searchParams;

  return (
    <main className="flex min-h-full flex-1 flex-col md:max-h-full">
      <QueryTabs
        options={[
          { key: "details", title: "פרטים" },
          event ? { key: "players", title: "שחקנים" } : null,
          event ? { key: "waiting-list", title: "רשימת המתנה" } : null,
          event ? { key: "cancels", title: "ביטולים" } : null,
          event && event.sub_type === "Teams"
            ? { key: "teams", title: "קבוצות" }
            : null,
          event ? { key: "images", title: "תמונות" } : null,
          event ? { key: "videos", title: "סרטונים" } : null,
          event ? { key: "map", title: "נבחרת המחזור" } : null,
          event ? { key: "winning-teams", title: "הקבוצות המנצחות" } : null,
          event ? { key: "best-players", title: "מלכי השערים" } : null,
        ]}
        field="tab"
        fallback="details"
        className="h-full"
        classNames={{ panel: "flex-1 flex flex-col pt-2" }}
      />
      {(!tab || tab === "details") && (
        <ManageEventDetailsTab user={user} event={event} stadiums={stadiums} />
      )}
      {tab === "players" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageEventPlayersTab event={event!} />
        </Suspense>
      )}
      {tab === "waiting-list" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageEventWaitingListTab event={event!} />
        </Suspense>
      )}
      {tab === "cancels" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageEventCancelsTab event={event!} />
        </Suspense>
      )}
      {tab === "teams" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageEventTeamsTab event={event!} />
        </Suspense>
      )}
      {tab === "images" && <ManageEventImagesTab event={event!} />}
      {tab === "videos" && <ManageEventVideosTab event={event!} />}
      {tab === "map" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageEventMapTab event={event!} />
        </Suspense>
      )}
      {tab === "winning-teams" && <ManageEventWinningTeamsTab event={event!} />}
      {tab === "best-players" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageEventBestPlayersTab event={event!} />
        </Suspense>
      )}
    </main>
  );
}

async function fetchEvent(id: string) {
  const supabase = await createClient();

  const { data: event } = await supabase
    .rpc("z2_get_event_manage_details", { _id: id })
    .maybeSingle<
      Topsoccer.Event.Object & {
        workers: Topsoccer.User.UserInterface[];
      }
    >();

  return event;
}

async function fetchStadiums() {
  const supabase = await createClient();

  const { data: stadiums } = await supabase.from("stadiums").select();

  return stadiums as Topsoccer.Stadium.FullStadium[];
}
