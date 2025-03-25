import Logo from "@/app/components/common/assets/Logo";
import { isMaintenance } from "@/utils/isMaintenance";
import { redirect } from "next/navigation";

export default async function MaintenancePage() {
  const maintenance = await isMaintenance();
  if (!maintenance) redirect("/");

  return (
    <main className="flex h-full w-full flex-col items-center justify-center px-4 py-2 font-semibold md:p-0">
      <Logo className="absolute top-12 w-64 animate-bounce" />
      <h1 className="mb-4 text-4xl">אנחנו כרגע בשיפוצים, נחזור בהקדם :)</h1>
      <pre className="rounded-xl border border-theme-green bg-theme-green/10 px-3 py-2 text-center">
        חמים לקבוע משחק אבל לא רוצים להמתין?
        <pre /> דברו איתנו בווטסאפ: 0549733105
      </pre>
    </main>
  );
}
