"use client";

import { showLoading } from "@/app/components/common/Loader/Loader";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TicketCard from "../../components/common/TicketCard";
import PaymentMethodModal from "../../components/common/modals/PaymentMethodModal";
import { buyTicket as _buyTicket } from "./actions";

export default function TicketsPageContent({
  user,
  tickets,
}: {
  user: Topsoccer.User.Auth | null;
  tickets: Topsoccer.Ticket.Object[];
}) {
  const router = useRouter();

  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <div className="h-full w-full p-4 md:p-0">
      <p className="text-2xl font-medium md:text-3xl">
        הוסף ניקובים לחשבון שלך
      </p>
      <p className="text-theme-gray md:text-xl">
        בחר את הכרטיסיה המתאימה עבורך:
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.title}
            user={user}
            ticket={ticket}
            onClick={() => {
              if (!user) router.replace("/signin");
              else setSelectedTicket(ticket.id);
            }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-theme-gray">
        💡 שחקנים קבועים? הכרטיסייה יותר משתלמת. אבל אפשר לשלם ישירות בעמוד
        המשחק.
      </p>

      {user && (
        <PaymentMethodModal
          user={user}
          enableCash={false}
          isOpen={selectedTicket !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedTicket(null);
          }}
          onMethodSelect={(method) => {
            if (!selectedTicket) return;

            buyTicket(selectedTicket, method);
          }}
        />
      )}
    </div>
  );

  async function buyTicket(
    ticket_id: string,
    payment_method: Topsoccer.PaymentMethod,
  ) {
    toast.loading("טוען עמוד תשלום...");
    const hideLoading = showLoading();

    try {
      const saleUrl = await _buyTicket({ ticket_id, payment_method });

      window.location.replace(saleUrl);
    } catch (err) {
      console.error(err);
      toast.error();

      hideLoading();

      return Promise.reject(err);
    }
  }
}
