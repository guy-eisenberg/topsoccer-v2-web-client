import Logo from "@/app/components/common/assets/Logo";
import { isMaintenance } from "@/utils/isMaintenance";
import { redirect } from "next/navigation";

export default async function MaintenancePage() {
  const maintenance = await isMaintenance();
  if (!maintenance) redirect("/");

  return (
    <main className="flex h-full w-full flex-col items-center justify-center px-4 py-2 text-4xl font-semibold md:p-0">
      <Logo className="absolute top-12 w-64 animate-bounce" />
      <h1>אנחנו כרגע בשיפוצים, נחזור בהקדם :)</h1>
    </main>
  );
}
