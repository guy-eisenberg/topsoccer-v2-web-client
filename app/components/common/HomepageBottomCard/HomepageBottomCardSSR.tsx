import { Contentful } from "@/clients/contentful";
import { createClient } from "@/clients/supabase/server";
import { Suspense } from "react";
import Skeleton from "../../core/Skeleton";
import HomepageBottomCard from "./HomepageBottomCard";

export default function HomepageBottomCardSSR(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <Suspense
      fallback={<Skeleton {...props} className="h-full md:rounded-xl" />}
    >
      <_HomepageBottomCardSSR {...props} />
    </Suspense>
  );
}

async function _HomepageBottomCardSSR(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const data = await fetchData();

  return <HomepageBottomCard {...props} {...data} />;
}

async function fetchData() {
  const supabase = await createClient();

  const [weeklyBestMove, { data: monthlyTopGoals }, { data: overallTopGoals }] =
    await Promise.all([
      Contentful.getWeeklyBestMoveLink(),
      supabase.rpc("z2_get_top_goals", { _trunc: "month" }),
      supabase.rpc("z2_get_top_goals"),
    ]);

  return {
    weeklyBestMove,
    monthlyTopGoals,
    overallTopGoals,
  };
}
