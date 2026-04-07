"use client";

import { useMounted } from "@/hooks/useMounted";
import type { Topsoccer } from "@/types";
import { cn } from "@heroui/react";
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
      <NavItem label="חולצות כדורגל לקנייה" href="/store" Icon={IconShoppingBag} />
      <NavItem label="כרטיסיות לרכישה" href="/tickets" Icon={IconTicket} />
      <NavItem label="משחקים קרובים להרשמה" href="/future-events" Icon={IconSoccerField} />
      {user ? (
        <NavItem label="משחקים" Icon={IconSoccerField}>
          <NavItem label="המשחקים שלי" href="/my-events" />
          <NavItem label="משחקים קודמים" href="/past-events" />
        </NavItem>
      ) : (
        <NavItem label="משחקים קודמים" href="/past-events" Icon={IconSoccerField} />
      )}
      {user ? (
        <NavItem label="סטטיסטיקות" Icon={IconGraph}>
          <NavItem label="הסטטיסטיקות שלי" href={`/player/${user.id}`} />
          <NavItem label="סטטיסטיקות שחקנים" href="/players-stats" />
        </NavItem>
      ) : (
        <NavItem label="סטטיסטיקות שחקנים" href="/players-stats" Icon={IconGraph} />
      )}
      <NavItem label="תקנון והצהרות" Icon={IconHelp}>
        <NavItem label="תקנון" href="/terms-of-use" />
        <NavItem label="הצהרת ביטוח" href="/insurance-statement" />
      </NavItem>
      {mounted && <ThemeSwitch />}
    </ul>
  );
}
