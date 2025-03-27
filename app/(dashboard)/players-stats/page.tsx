import { QuerySelect } from "@/app/components/core/QuerySelect";
import { Suspense } from "react";
import PlayersStatsTable from "./PlayersStatsTable";
import PlayersStatsTableLoading from "./PlayersStatsTableLoading";

export default async function PlayersStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ trunc?: "all" | "month" | "week" }>;
}) {
  const { trunc } = await searchParams;

  return (
    <main className="mt-2 flex flex-1 flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="whitespace-nowrap text-xl font-semibold">
          סטטיסטיקות שחקנים:
        </p>
        <QuerySelect
          className="max-w-36"
          size="sm"
          field="trunc"
          fallback="all"
          options={[
            { key: "all", label: "מצטבר" },
            { key: "month", label: "החודש" },
            { key: "week", label: "השבוע" },
          ]}
          disallowEmptySelection
        />
      </div>
      <Suspense fallback={<PlayersStatsTableLoading />} key={trunc}>
        <PlayersStatsTable trunc={trunc || "all"} />
      </Suspense>
    </main>
  );
}
