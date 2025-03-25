import { grow } from "@/clients/grow";
import { verifone } from "@/clients/verifone";
import type { Topsoccer } from "@/types";
import { type SupabaseClient } from "@supabase/supabase-js";
import { prepareGrowPayload } from "./prepareGrowPayload";
import { prepareVerifonePayload } from "./prepareVerifonePayload";

type GenerateEventPaymentTypes =
  | {
      type: "authenticated";
      user_id: string;
    }
  | {
      type: "unauthenticated";
      user_id?: undefined;
    };

type GenerateEventPaymentData = GenerateEventPaymentTypes & {
  event_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  payment_method: Topsoccer.PaymentMethod;
  origin: string;
};

export async function generateEventPayment(
  supabase: SupabaseClient,
  data: GenerateEventPaymentData,
) {
  const {
    type,
    user_id,
    user_name,
    user_phone,
    user_email,
    event_id,
    payment_method,
    origin,
  } = data;

  const { data: event } = await supabase
    .from("events")
    .select()
    .eq("id", event_id)
    .single();

  let payment_id: string | undefined = undefined;
  if (type === "authenticated") {
    const { data: payment } = await supabase
      .from("events_payments")
      .update({ method: payment_method })
      .eq("event_id", event_id)
      .eq("user_id", user_id)
      .or("status.eq.Waiting,status.eq.Canceled")
      .select()
      .maybeSingle();

    if (payment) payment_id = payment.id;
    else {
      const { data: payment } = await supabase
        .from("events_payments")
        .upsert(
          {
            event_id,
            user_id,
            status: "Waiting",
            method: payment_method,
          },
          { onConflict: "event_id, user_id" },
        )
        .select()
        .single();

      payment_id = payment.id;
    }
  } else {
    const { data: payment } = await supabase
      .from("events_ot_payments")
      .insert({
        event_id,
        method: payment_method,
        status: "Waiting",
        full_name: user_name,
        phone: user_phone,
        email: user_email,
      })
      .select()
      .single();

    payment_id = payment.id;
  }

  // If the payment method is BIT, use Grow:
  if (payment_method === "Bit") {
    const payload = prepareGrowPayload({
      price: event.price,
      description: event.title,
      user: {
        id: user_id,
        full_name: user_name,
        phone: user_phone,
        email: user_email,
      },
      success_url: `${origin}/payment/${payment_id}?type=${type}`,
      cancel_url: `${origin}/event/${event_id}`,
      update_url: `${process.env.UPDATE_BIT_PAYMENT_API_URL}?type=${type}&payment_id=${payment_id}`,
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

  const merchant_reference =
    (type === "authenticated" ? "A" : "U") + "+" + payment_id;

  const payload = prepareVerifonePayload({
    price: event.price,
    description: event.title,
    payment_method,
    merchant_reference,
    success_url: `${origin}/payment/${payment_id}?type=${type}`,
    cancel_url: `${origin}/event/${event_id}`,
  });

  const { data: response } = await verifone.post<{
    id: string;
    url: string;
    details: object;
  }>("/checkout-service/v2/checkout", payload);

  return response;
}
