import { fetchAuth } from "@/utils/server/fetchAuth";
import { redirect } from "next/navigation";
import SignInForm from "./SignInForm";

export default async function SigninPage() {
  const user = await fetchAuth();
  if (user) redirect("/");

  return (
    <main className="flex w-full flex-1 items-center justify-center">
      <SignInForm />
    </main>
  );
}
