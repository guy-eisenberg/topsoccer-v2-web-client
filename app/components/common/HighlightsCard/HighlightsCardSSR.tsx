import { createClient } from "@/clients/supabase/server";
import { Skeleton } from "@heroui/skeleton";
import { Suspense } from "react";
import HighlightsCard from "./HighlightsCard";

export default function HighlightsCardSSR(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <Suspense
      fallback={
        <Skeleton {...props} className="h-full md:rounded-xl"></Skeleton>
      }
    >
      <_HighlightsCardSSR {...props} />
    </Suspense>
  );
}

async function _HighlightsCardSSR(props: React.HTMLAttributes<HTMLDivElement>) {
  const highlights = await fetchHighlights();

  return <HighlightsCard {...props} highlights={highlights} />;
}

async function fetchHighlights() {
  const supabase = await createClient();

  const {
    data: [highlights],
  } = await supabase.rpc("z2_get_latest_highlights");

  return highlights;
}
