import { createServiceClient } from "@/clients/supabase/service";
import type { Topsoccer } from "@/types";
import { createCreditInvoice } from "@/utils/server/createInvoice";

export async function POST(request: Request) {
  const body = (await request.json()) as Topsoccer.VerifonePaymentData;

  if (body.eventType === "TxnSaleApproved") {
    const supabase = createServiceClient();

    const [type, payment_id] = body.content.merchant_reference.split("+");

    const cardSuffix = body.content.masked_card_number.slice(-4);

    if (type === "A") {
      const { data: payment } = await supabase
        .from("events_payments")
        .select()
        .eq("id", payment_id)
        .single<Topsoccer.Event.Payment>();

      if (!payment) throw new Error();

      if (
        payment.method === "Cash" ||
        payment.method === "Manual" ||
        payment.method === "Team" ||
        payment.status === "Waiting" ||
        payment.status === "Canceled"
      ) {
        const [{ data: event }, { data: user }] = await Promise.all([
          supabase.from("events").select().eq("id", payment.event_id).single(),
          supabase.from("users").select().eq("id", payment.user_id).single(),
        ]);

        const { doc_url: invoice_url } = await createCreditInvoice({
          client_name: user.display_name,
          email: user.email,
          description: event.title,
          price: parseInt(body.content.amount),
          card_number: cardSuffix,
          card_type: body.content.card_brand,
          confirmation_code: body.content.authorization_code,
        });

        await Promise.all([
          supabase.from("events_players").upsert(
            {
              event_id: payment.event_id,
              user_id: payment.user_id,
            },
            { ignoreDuplicates: true },
          ),
          supabase
            .from("events_payments")
            .update({
              status: "Completed",
              invoice_url,
              verifone: body,
              payme: null,
              grow: null,
            })
            .eq("id", payment_id),
        ]);
      }
    } else if (type === "U") {
      const { data: payment } = await supabase
        .from("events_ot_payments")
        .select()
        .eq("id", payment_id)
        .single<Topsoccer.Event.OTPayment>();

      if (!payment) throw new Error();

      if (payment.status === "Waiting") {
        const { data: event } = await supabase
          .from("events")
          .select()
          .eq("id", payment.event_id)
          .single();

        const { doc_url: invoice_url } = await createCreditInvoice({
          client_name: payment.full_name,
          email: payment.email,
          description: event.title,
          price: parseInt(body.content.amount),
          card_number: cardSuffix,
          card_type: body.content.card_brand,
          confirmation_code: body.content.authorization_code,
        });

        await supabase
          .from("events_ot_payments")
          .update({
            status: "Completed",
            invoice_url,
            verifone: body,
            payme: null,
            grow: null,
          })
          .eq("id", payment_id);
      }
    } else if (type === "T") {
      const { data: payment } = await supabase
        .from("tickets_payments")
        .select()
        .eq("id", payment_id)
        .single<Topsoccer.Ticket.Payment>();

      if (!payment) throw new Error();

      if (payment.status === "Waiting") {
        const { data: user } = await supabase
          .from("users")
          .select()
          .eq("id", payment.user_id)
          .single();

        const { doc_url: invoice_url } = await createCreditInvoice({
          client_name: user.display_name,
          email: user.email,
          description: `${payment.title} - ${payment.amount}`,
          price: parseInt(body.content.amount),
          card_number: cardSuffix,
          card_type: body.content.card_brand,
          confirmation_code: body.content.authorization_code,
        });

        await Promise.all([
          supabase
            .from("tickets_payments")
            .update({ status: "Completed", invoice_url, verifone: body })
            .eq("id", payment.id),
          supabase.rpc("z2_update_user_wallet", {
            user_id: payment.user_id,
            amount: payment.amount,
            mode: "add",
          }),
        ]);
      }
    }
  }

  return new Response("Payment updated successfully", { status: 200 });
}
