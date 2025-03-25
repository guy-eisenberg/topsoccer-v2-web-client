import { grow } from "@/clients/grow";

export async function refundGrowPayment({
  transactionId,
  transactionToken,
  refundSum,
}: {
  transactionId: number;
  transactionToken: string;
  refundSum: number;
}) {
  const formData = new FormData();
  formData.append("transactionId", transactionId.toString());
  formData.append("transactionToken", transactionToken);
  formData.append("refundSum", refundSum as any);

  const {
    data: { status },
  } = await grow.post<{ status: number }>("/refundTransaction/", formData);

  return status;
}
