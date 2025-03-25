import type { Topsoccer } from "@/types";

export default function TicketCard({
  user,
  ticket,
  ...rest
}: {
  user: Topsoccer.User.Auth | null;
  ticket: Topsoccer.Ticket.Object;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className="bg cursor-pointer rounded-xl border border-theme-light-gray bg-white p-2 hover:border-theme-green dark:bg-theme-foreground"
    >
      <div className="rounded-xl border border-dashed border-theme-gray p-2 text-center text-black dark:text-white">
        <p className="mb-3 text-lg font-semibold text-theme-green">
          {ticket.title}
        </p>
        <p>שלם: ₪{ticket.price}</p>
        <p>
          קבל: <span className="font-bold">{ticket.amount} ניקובים</span>
        </p>
        {user ? (
          <p className="mt-4 underline">לחץ בכדי לרכוש</p>
        ) : (
          <p className="mt-4 text-sm text-theme-gray">הירשם בכדי לרכוש</p>
        )}
      </div>
    </div>
  );
}
