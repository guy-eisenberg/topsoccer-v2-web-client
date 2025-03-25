import { Button } from "@/app/components/core/Button";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { Skeleton } from "@heroui/skeleton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MyTeamsList from "./MyTeamsList";

export default async function MyTeamsPage() {
  const user = await fetchAuth();
  if (!user) redirect("/");

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">הקבוצות שלי</p>
        <Link href="/team/edit/new">
          <Button color="primary">צור קבוצה חדשה</Button>
        </Link>
      </div>
      <Suspense fallback={<Skeleton className="w-full flex-1 rounded-xl" />}>
        <MyTeamsList />
      </Suspense>
    </main>
  );
}
