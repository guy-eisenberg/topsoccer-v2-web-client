import { showLoading } from "@/app/components/common/Loader/Loader";
import type { Topsoccer } from "@/types";
import toast from "@/utils/toast";
import { cn } from "@heroui/theme";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signout as _signout } from "../actions";

export default function UserMenu({
  user,
  ...rest
}: React.HTMLAttributes<HTMLMenuElement> & { user: Topsoccer.User.Auth }) {
  const router = useRouter();

  return (
    <menu
      {...rest}
      className={cn(
        "overflow-hidden bg-theme-foreground text-center transition-all",
        rest.className,
      )}
    >
      <div className="flex flex-col gap-2 p-3">
        <div className="rounded-xl border border-transparent bg-theme-green/10 px-3 py-2 font-medium text-theme-green">
          {user.wallet} ניקובים
        </div>
        {(user.role === "admin" || user.role === "worker") && (
          <Link href="/manage">
            <button className="w-full rounded-xl border border-transparent px-3 py-2 font-medium hover:border-theme-green">
              איזור ניהול
            </button>
          </Link>
        )}
        <Link href={`/player/${user.id}`}>
          <button className="w-full rounded-xl border border-transparent px-3 py-2 font-medium hover:border-theme-green">
            הסטטיסטיקות שלי
          </button>
        </Link>
        <Link href="/my-teams">
          <button className="w-full rounded-xl border border-transparent px-3 py-2 font-medium hover:border-theme-green">
            הקבוצות שלי
          </button>
        </Link>
        <Link href="/profile">
          <button className="w-full rounded-xl border border-transparent px-3 py-2 font-medium hover:border-theme-green">
            הפרופיל שלי
          </button>
        </Link>
        <button
          className="w-full rounded-xl border border-transparent px-3 py-2 font-medium text-danger hover:border-danger"
          onClick={signout}
        >
          התנתק
        </button>
      </div>
    </menu>
  );

  async function signout() {
    toast.loading();
    const hideLoading = showLoading();

    try {
      await _signout();

      router.replace("/?status=signout_success");
    } catch (err) {
      console.log(err);
      toast.error();

      hideLoading();

      return Promise.reject(err);
    }
  }
}
