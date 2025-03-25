import Link from "next/link";
import EventsListCardSSR from "../components/common/EventsListCard/EventsListCardSSR";
import HighlightsCardSSR from "../components/common/HighlightsCard/HighlightsCardSSR";
import HomepageBottomCardSSR from "../components/common/HomepageBottomCard/HomepageBottomCardSSR";
import WhatsappGroupsCardSSR from "../components/common/WhatsappGroupsCard/WhatsappGroupsCardSSR";
import { Button } from "../components/core/Button";

export default async function HomePage() {
  return (
    <>
      <Link href="/tickets">
        <Button className="h-14 w-full rounded-none bg-theme-green text-lg font-bold text-white md:h-8 md:rounded-xl md:text-sm">
          🎫
          <p>לרכישת כרטיסיות משתלמות במיוחד</p>
          🎫
        </Button>
      </Link>
      <main className="flex h-full min-h-0 flex-1 flex-col md:flex-row md:gap-2">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:gap-2">
          <div className="md:mt-0">
            <WhatsappGroupsCardSSR />
          </div>
          <div className="h-[236px] md:overflow-hidden">
            <HighlightsCardSSR className="h-full" />
          </div>
          <div className="min-h-0 flex-1">
            <EventsListCardSSR className="h-full min-h-0" time="future" />
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:gap-2">
          <div className="min-h-0 flex-1">
            <EventsListCardSSR className="h-full min-h-0" time="past" />
          </div>
          <div className="flex h-[336px] flex-col">
            <HomepageBottomCardSSR />
          </div>
        </div>
      </main>
    </>
  );
}
