import { Contentful } from "@/clients/contentful";
import { fetchAuth } from "@/utils/server/fetchAuth";
import TicketsPageContent from "./TicketsPageContent";

export default async function TicketsPage() {
  const [user, tickets] = await Promise.all([
    fetchAuth(),
    Contentful.getAvailableTickets(),
  ]);

  return (
    <main className="flex-1">
      <TicketsPageContent user={user} tickets={tickets} />
    </main>
  );
}
