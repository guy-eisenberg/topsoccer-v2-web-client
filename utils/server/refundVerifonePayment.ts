import { verifone } from "@/clients/verifone";

export async function refundVerifonePayment({
  transactionId,
}: {
  transactionId: string;
}) {
  const {
    data: { transaction_status, amount },
  } = await verifone.get<{ transaction_status: string; amount: string }>(
    `/api/v2/transaction/${transactionId}`,
  );

  if (transaction_status === "SETTLED") {
    await verifone.post<{ status: string }>(
      `/api/v2/transactions/${transactionId}/refund`,
      { amount },
    );
  } else {
    await verifone.post<{ status: string }>(
      `/api/v2/transactions/${transactionId}/void_capture`,
    );
  }
}
