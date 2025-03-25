import { grow } from "@/clients/grow";
import { verifone } from "@/clients/verifone";
import type { Topsoccer } from "@/types";
import { type SupabaseClient } from "@supabase/supabase-js";
import { prepareGrowPayload } from "./prepareGrowPayload";
import { prepareVerifonePayload } from "./prepareVerifonePayload";

type GenerateTicketPaymentData = {
  ticket: Topsoccer.Ticket.Object;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  payment_method: "CreditCard" | "Bit" | "Apple" | "Google";
  origin: string;
};

export async function generateTicketPayment(
  supabase: SupabaseClient,
  {
    ticket,
    user_id,
    user_name,
    user_phone,
    user_email,
    payment_method,
    origin,
  }: GenerateTicketPaymentData,
) {
  const { data: payment } = await supabase
    .from("tickets_payments")
    .insert({
      user_id,
      title: ticket.title,
      amount: ticket.amount,
      price: ticket.price,
      method: payment_method,
      status: "Waiting",
    })
    .select()
    .single();

  if (payment_method === "Bit") {
    const payload = prepareGrowPayload({
      price: ticket.price,
      description: ticket.title,
      user: {
        id: user_id,
        full_name: user_name,
        phone: user_phone,
        email: user_email,
      },
      success_url: `${origin}/payment/${payment.id}?type=ticket`,
      cancel_url: `${origin}/tickets`,
      update_url: `${process.env.UPDATE_BIT_PAYMENT_API_URL}?type=ticket&payment_id=${payment.id}`,
    });

    const {
      data: { data: response },
    } = await grow.post<{
      status: number;
      err: string;
      data: { processId: string; processToken: string; url: string };
    }>("/createPaymentProcess/", payload);

    return response;
  }

  const merchant_reference = "T+" + payment.id;

  const payload = prepareVerifonePayload({
    price: ticket.price,
    description: ticket.title,
    payment_method,
    merchant_reference,
    success_url: `${origin}/payment/${payment.id}?type=ticket`,
    cancel_url: `${origin}/tickets`,
  });

  const { data: response } = await verifone.post<{
    id: string;
    url: string;
    details: object;
  }>("/checkout-service/v2/checkout", payload);

  return response;
}
