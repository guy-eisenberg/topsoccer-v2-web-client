import QueryTabs from "@/app/components/core/QueryTabs";
import Skeleton from "@/app/components/core/Skeleton";
import { createClient } from "@/clients/supabase/server";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ManageEventsTab from "./ManageEventsTab/ManageEventsTab";
import ManageInsuranceStatementTab from "./ManageInsuranceStatementTab/ManageInsuranceStatementTab";
import ManageSettingsTab from "./ManageSettingsTab/ManageSettingsTab";
import ManageStadiumsTab from "./ManageStadiumsTab";
import ManageTermsOfUseTab from "./ManageTermsOfUseTab/ManageTermsOfUseTab";
import ManageTicketsPaymentsTab from "./ManageTicketsPaymentsTab";
import ManageUsersTab from "./ManageUsersTab/ManageUsersTab";

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  const { tab } = await searchParams;

  const user = await fetchAuth();
  if (!user || (user.role !== "admin" && user.role !== "worker")) redirect("/");

  const stadiums = await fetchStadiums();

  return (
    <main className="flex min-h-full flex-1 flex-col md:max-h-full">
      <QueryTabs
        options={[
          { key: "users", title: "משתמשים" },
          { key: "events", title: "אירועים" },
          user.role === "admin" ? { key: "stadiums", title: "מגרשים" } : null,
          user.role === "admin" ? { key: "tickets", title: "כרטיסיות" } : null,
          user.role === "admin"
            ? { key: "terms-of-use", title: "תנאי שימוש" }
            : null,
          user.role === "admin"
            ? { key: "insurance-statement", title: "הצהרת ביטוח" }
            : null,
          user.role === "admin" ? { key: "settings", title: "הגדרות" } : null,
        ]}
        field="tab"
        fallback="users"
        className="h-full"
        classNames={{ panel: "flex-1 flex flex-col pt-2" }}
      />
      {(!tab || tab === "users") && (
        <ManageUsersTab stadiums={stadiums || []} />
      )}
      {tab === "events" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageEventsTab user={user} />
        </Suspense>
      )}
      {tab === "stadiums" && <ManageStadiumsTab stadiums={stadiums || []} />}
      {tab === "tickets" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageTicketsPaymentsTab />
        </Suspense>
      )}
      {tab === "terms-of-use" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageTermsOfUseTab />
        </Suspense>
      )}
      {tab === "insurance-statement" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageInsuranceStatementTab />
        </Suspense>
      )}
      {tab === "settings" && (
        <Suspense fallback={<Skeleton className="flex-1 rounded-xl" />}>
          <ManageSettingsTab />
        </Suspense>
      )}
    </main>
  );
}

async function fetchStadiums() {
  const supabase = await createClient();

  const { data: stadiums } = await supabase.from("stadiums").select();

  return stadiums;
}
