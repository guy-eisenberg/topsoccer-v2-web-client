import GoalIcon from "@/app/components/common/icons/GoalIcon";
import MVPIcon from "@/app/components/common/icons/MVPIcon";
import ShowIcon from "@/app/components/common/icons/ShowIcon";
import { Skeleton } from "@heroui/react";

export default function PlayersStatsTableLoading() {
  return (
    <div className="flex flex-col gap-16 rounded-xl border border-theme-light-gray bg-theme-card px-4 py-3 md:flex-row">
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <GoalIcon className="h-4 w-4" />
          <p className="font-bold text-warning">גולים</p>
          <GoalIcon className="h-4 w-4" />
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {new Array(10).fill(null).map((_, i) => (
            <Skeleton className="h-[42px] rounded-xl" key={i} />
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <ShowIcon className="h-4 w-4" />
          <p className="font-bold text-warning">הופעות</p>
          <ShowIcon className="h-4 w-4" />
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {new Array(10).fill(null).map((_, i) => (
            <Skeleton className="h-[42px] rounded-xl" key={i} />
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <MVPIcon className="h-4 w-4" />
          <p className="font-bold text-warning">נצחונות</p>
          <MVPIcon className="h-4 w-4" />
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {new Array(10).fill(null).map((_, i) => (
            <Skeleton className="h-[42px] rounded-xl" key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
