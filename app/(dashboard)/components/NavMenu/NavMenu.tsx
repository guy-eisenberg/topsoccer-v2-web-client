"use client";

import { useMounted } from "@/hooks/useMounted";
import type { Topsoccer } from "@/types";
import { cn } from "@heroui/theme";
import {
  IconGraph,
  IconHelp,
  IconHome,
  IconShoppingBag,
  IconSoccerField,
  IconTicket,
} from "@tabler/icons-react";
import NavItem from "./NavItem";
import ThemeSwitch from "./ThemeSwitch";

export default function NavMenu({
  user,
  ...rest
}: React.HTMLAttributes<HTMLUListElement> & {
  user: Topsoccer.User.Auth | null;
}) {
  const mounted = useMounted();

  return (
    <ul
      {...rest}
      className={cn("flex flex-1 flex-col gap-2 pb-2", rest.className)}
    >
      <NavItem label="דף הבית" href="/" Icon={IconHome} />
      <NavItem label="חנות" href="/store" Icon={IconShoppingBag} />
      <NavItem label="כרטיסיות" href="/tickets" Icon={IconTicket} />
      <NavItem label="אירועים" Icon={IconSoccerField}>
        <NavItem label="אירועים קרובים" href="/future-events" />
        <NavItem label="אירועים שהתקיימו" href="/past-events" />
        {user && <NavItem label="האירועים שלי" href="/my-events" />}
      </NavItem>
      <NavItem label="סטטיסטיקות" Icon={IconGraph}>
        <NavItem label="שחקנים" href="/players-stats" />
      </NavItem>
      <NavItem label="שונות" Icon={IconHelp}>
        <NavItem label="תקנון" href="/terms-of-use" />
        <NavItem label="הצהרת ביטוח" href="/insurance-statement" />
      </NavItem>
      {mounted && <ThemeSwitch />}
    </ul>
  );
}
