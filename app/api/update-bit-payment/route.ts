import { grow } from "@/clients/grow";
import { createServiceClient } from "@/clients/supabase/service";
import { createCreditInvoice } from "@/utils/server/createInvoice";

export async function POST(request: Request) {
  const params = new URLSearchParams(new URL(request.url).search);
  const type = params.get("type") as string;
  const payment_id = params.get("payment_id") as string;

  const data: { [key: string]: string } = {};
  const formData = await request.formData();

  for (const [key, value] of formData.entries()) {
    data[key] = value.toString();
  }

  const finalData = {
    err: data.err,
    status: data.status,
    data: {
      pageCode: process.env.GROW_BIT_PAGE_CODE as string,
      transactionId: data["data[transactionId]"],
      transactionToken: data["data[transactionToken]"],
      transactionTypeId: data["data[transactionTypeId]"],
      paymentType: data["data[paymentType]"],
      sum: data["data[sum]"],
      firstPaymentSum: data["data[firstPaymentSum]"],
      periodicalPaymentSum: data["data[periodicalPaymentSum]"],
      paymentsNum: data["data[paymentsNum]"],
      allPaymentsNum: data["data[allPaymentsNum]"],
      paymentDate: data["data[paymentDate]"],
      asmachta: data["data[asmachta]"],
      description: data["data[description]"],
      fullName: data["data[fullName]"],
      payerPhone: data["data[payerPhone]"],
      payerEmail: data["data[payerEmail]"],
      cardSuffix: data["data[cardSuffix]"],
      cardType: data["data[cardType]"],
      cardTypeCode: data["data[cardTypeCode]"],
      cardBrand: data["data[cardBrand]"],
      cardBrandCode: data["data[cardBrandCode]"],
      cardExp: data["data[cardExp]"],
      processId: data["data[processId]"],
      processToken: data["data[processToken]"],
    },
  };

  if (Object.keys(data).length > 0) {
    if (data.status === "1") {
      const supabase = createServiceClient();

      const approveData = new FormData();
      Object.entries(finalData.data).forEach(([key, value]) => {
        approveData.append(key, value);
      });
      await grow.post("/approveTransaction/", approveData);

      const { doc_url: invoice_url } = await createCreditInvoice({
        client_name: finalData.data.fullName,
        email: finalData.data.payerEmail,
        description: finalData.data.description,
        price: parseInt(finalData.data.sum),
        card_number: finalData.data.cardSuffix,
        card_type: finalData.data.cardBrand,
        confirmation_code: finalData.data.asmachta,
      });

      if (type === "authenticated") {
        const { data: payment } = await supabase
          .from("events_payments")
          .update({
            status: "Completed",
            method: "Bit",
            invoice_url,
            grow: finalData,
            payme: null,
            verifone: null,
          })
          .eq("id", payment_id)
          .select()
          .single();

        await supabase.from("events_players").upsert(
          {
            event_id: payment.event_id,
            user_id: payment.user_id,
          },
          { ignoreDuplicates: true },
        );
      } else if (type === "unauthenticated") {
        await supabase
          .from("events_ot_payments")
          .update({
            status: "Completed",
            invoice_url,
            grow: finalData,
          })
          .eq("id", payment_id);
      } else if (type === "ticket") {
        const { data: payment } = await supabase
          .from("tickets_payments")
          .update({
            status: "Completed",
            invoice_url,
            grow: finalData,
          })
          .eq("id", payment_id)
          .select()
          .single();

        await supabase.rpc("z2_update_user_wallet", {
          user_id: payment.user_id,
          amount: payment.amount,
          mode: "add",
        });
      }

      return new Response("Payment updated successfully", { status: 200 });
    }
  }
}
