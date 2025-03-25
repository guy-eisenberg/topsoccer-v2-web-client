import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default async function ForgotPasswordPage() {
  const user = await fetchAuth();
  if (user) redirect("/");

  return (
    <main className="flex w-full flex-1 items-center justify-center">
      <ForgotPasswordForm />
    </main>
  );
}
