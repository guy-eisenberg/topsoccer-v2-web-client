import payme from "@/clients/payme";

export async function refundPaymePayment(payme_sale_id: string) {
  const { data: refundResponse } = await payme.post("/refund-sale", {
    payme_sale_id,
  });

  return refundResponse.status_code;
}
