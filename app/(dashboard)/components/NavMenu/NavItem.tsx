"use client";

import { cn } from "@heroui/theme";
import { type Icon, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children, isValidElement, useMemo, useState } from "react";

export default function NavItem({
  label,
  href,
  Icon,
  children,
}: {
  label: string;
  href?: string;
  Icon?: Icon;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();

  const childrenPaths = useMemo(() => {
    const paths: string[] = [];

    Children.forEach(children, (element) => {
      if (!isValidElement<{ href?: string }>(element)) return;

      const {
        props: { href },
      } = element;

      if (href) paths.push(href);
    });

    return paths;
  }, [children]);

  const [subMenuOpen, setSubMenuOpen] = useState(
    childrenPaths.includes(pathname),
  );

  const isSelected = pathname === href;

  return href ? (
    <li className="relative">
      <Link href={href}>
        <button
          className={cn(
            "w-full rounded-xl border px-4 py-3 hover:border-theme-green",
            isSelected
              ? "border-theme-green bg-theme-green/10 text-theme-green"
              : "border-transparent",
          )}
        >
          <div className="flex gap-2">
            {Icon && <Icon width={24} height={24} />}
            <span>{label}</span>
          </div>
        </button>
      </Link>
    </li>
  ) : (
    <li className="relative">
      <button
        className="flex w-full justify-between gap-2 rounded-xl border border-transparent px-4 py-3 hover:border-theme-green"
        onClick={() => setSubMenuOpen(!subMenuOpen)}
      >
        <div className="flex gap-2">
          {Icon && <Icon width={24} height={24} />}
          <span>{label}</span>
        </div>
        <IconChevronDown
          className={cn("transition", subMenuOpen ? "rotate-180" : "rotate-0")}
          width={24}
          height={24}
        />
      </button>
      <ul
        className="overflow-hidden transition-all"
        style={{
          maxHeight: subMenuOpen
            ? Children.count(children) * 50 +
              (Children.count(children) - 1) * 8 +
              16
            : 0,
        }}
      >
        <div className="flex flex-col gap-2 px-4 py-2">{children}</div>
      </ul>
    </li>
  );
}
