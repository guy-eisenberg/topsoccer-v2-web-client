import { Button } from "@/app/components/core/Button";
import { createClient } from "@/clients/supabase/server";
import type { Topsoccer } from "@/types";
import { fetchAuth } from "@/utils/server/fetchAuth";
import { IconExclamationCircle } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PaymentLoader from "./PaymentLoader";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type: string; error_code?: string }>;
}) {
  const { id } = await params;
  const { type, error_code } = await searchParams;

  const user = await fetchAuth();

  const supabase = await createClient();
  if (type === "authenticated") {
    if (!user) redirect("/");

    const { data: payment } = await supabase
      .from("events_payments")
      .select()
      .eq("id", id)
      .maybeSingle<Topsoccer.Event.Payment>();
    if (!payment || user.id !== payment.user_id) redirect("/");
  } else if (type === "ticket") {
    if (!user) redirect("/");

    const { data: payment } = await supabase
      .from("tickets_payments")
      .select()
      .eq("id", id)
      .maybeSingle<Topsoccer.Ticket.Payment>();

    if (!payment || user.id !== payment.user_id) redirect("/");
  } else if (type === "unauthenticated") {
    const { data: payment } = await supabase
      .from("events_ot_payments")
      .select()
      .eq("id", id)
      .maybeSingle<Topsoccer.Event.OTPayment>();

    if (!payment || payment.page_shown) redirect("/");
  }

  return (
    <main className="h-full w-full bg-theme-bg">
      {error_code ? (
        <ErrorFallback />
      ) : (
        <Suspense fallback={<LoaderFallback />}>
          <PaymentLoader type={type} id={id} />
        </Suspense>
      )}
    </main>
  );
}

function LoaderFallback() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4"
      dir="rtl"
    >
      <div role="status">
        <svg
          aria-hidden="true"
          className="h-20 w-20 animate-spin fill-theme-green text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
      <p className="text-3xl font-semibold">מוודא תשלום...</p>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-8"
      dir="rtl"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <IconExclamationCircle className="size-20 text-danger" />
        <p className="text-3xl font-semibold text-danger">תשלום נכשל :(</p>
      </div>
      <Link href="/">
        <Button color="secondary">חזרה לדף הבית</Button>
      </Link>
    </div>
  );
}
