"use server";

import { Contentful } from "@/clients/contentful";
import { createServiceClient } from "@/clients/supabase/service";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { generateTicketPayment } from "@/utils/server/generateTicketPayment";
import { getOrigin } from "@/utils/server/getOrigin";

export async function buyTicket({
  ticket_id,
  payment_method,
}: {
  ticket_id: string;
  payment_method: Topsoccer.PaymentMethod;
}) {
  const origin = await getOrigin();

  const user = await fetchAuth();

  if (!user) throw new Error("Unauthorized");
  if (user.blocked) throw new Error("User is blocked.");
  if (!user.birth_date || !user.city || !user.phone_number || !user.tz_id)
    throw new Error("User profile must be complete.");

  if (
    payment_method === "Cash" ||
    payment_method === "Team" ||
    payment_method === "Wallet" ||
    payment_method === "Manual"
  )
    throw new Error("Unsupported payment method.");

  const tickets = await Contentful.getAvailableTickets();
  const ticket = tickets.find((t) => t.id === ticket_id);

  if (!ticket) throw new Error(`Ticket with id of: ${ticket_id} not found.`);

  const supabase = createServiceClient();
  const { url } = await generateTicketPayment(supabase, {
    ticket,
    user_id: user.id,
    user_name: user.display_name,
    user_phone: user.phone_number,
    user_email: user.email,
    payment_method,
    origin,
  });

  return url;
}
