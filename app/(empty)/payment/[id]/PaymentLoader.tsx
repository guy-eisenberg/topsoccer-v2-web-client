import { Button } from "@/app/components/core/Button";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import CheckmarkAnimation from "./CheckmarkAnimation";
import MoneyAnimation from "./MoneyAnimation";

export default async function PaymentLoader({
  type,
  id,
}: {
  type: string;
  id: string;
}) {
  const payment = await waitForPayment({ type, id });

  if (!payment) return redirect("/");

  if (type === "authenticated")
    return redirect(
      `/event/${payment.event_id}?status=enroll_success`,
    );
  else if (type === "unauthenticated")
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center"
        dir="rtl"
      >
        <CheckmarkAnimation />
        <p className="text-4xl font-medium">התשלום בוצע בהצלחה!</p>
        <p className="text-theme-gray">צור קשר עם המנהל לבירורים.</p>
        <div className="mt-4 flex gap-4">
          <Link href={payment.invoice_url}>
            <Button color="secondary">להורדת החשבונית</Button>
          </Link>
          <Link href="/">
            <Button color="primary">לחזרה לאתר</Button>
          </Link>
        </div>
      </div>
    );
  else if (type === "ticket")
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center"
        dir="rtl"
      >
        <MoneyAnimation />
        <p className="text-4xl font-medium">התשלום בוצע בהצלחה!</p>
        <p className="font-medium text-theme-green">
          {payment.amount} ניקובים נוספו לחשבון שלך.
        </p>
        <div className="mt-4 flex gap-4">
          <Link href={payment.invoice_url}>
            <Button color="secondary">להורדת החשבונית</Button>
          </Link>
          <Link href="/">
            <Button color="primary">לחזרה לאתר</Button>
          </Link>
        </div>
      </div>
    );
}

async function waitForPayment({ type, id }: { type: string; id: string }) {
  let payment: any | null = null;

  do {
    const { signal } = new AbortController();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_KEY as string,
      {
        global: {
          fetch: (input, init) => {
            return fetch(input, { ...init, cache: "no-store", signal });
          },
        },
      },
    );

    if (type === "authenticated") {
      const { data, error } = await supabase
        .from("events_payments")
        .select()
        .eq("id", id)
        .maybeSingle();

      if (error) return null;

      payment = data;
    } else if (type === "unauthenticated") {
      const [{ data, error }] = await Promise.all([
        supabase.from("events_ot_payments").select().eq("id", id).maybeSingle(),
        supabase
          .from("events_ot_payments")
          .update({ page_shown: true })
          .eq("id", id),
      ]);

      if (error) return null;

      payment = data as any;
    } else if (type === "ticket") {
      const { data, error } = await supabase
        .from("tickets_payments")
        .select()
        .eq("id", id)
        .maybeSingle();

      if (error) return null;

      payment = data as any;
    }

    if (!payment) return null;

    if (payment.status === "Waiting" || payment.status === "Canceled")
      await new Promise((res) => setTimeout(res, 1000));
  } while (payment.status === "Waiting" || payment.status === "Canceled");

  return payment;
}
