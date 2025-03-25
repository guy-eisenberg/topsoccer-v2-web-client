import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import SignupForm from "./SignupForm";

export default async function SignupPage() {
  const user = await fetchAuth();
  if (user) redirect("/");

  return (
    <main className="flex w-full flex-1 items-center justify-center">
      <SignupForm />
    </main>
  );
}
