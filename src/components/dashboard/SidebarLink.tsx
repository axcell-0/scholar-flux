"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarLinkProps = {
  href: string;
  icon: string;
  label: string;
  onClick?: () => void;
};

export function SidebarLink({ href, icon, label, onClick }: SidebarLinkProps) {
  const pathname = usePathname();

  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const baseClasses =
    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const activeClasses = "bg-[#3525cd]/10 text-[#3525cd]";
  const inactiveClasses =
    "text-[#777587] hover:text-[#eaf1ff] hover:bg-surface-container";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}