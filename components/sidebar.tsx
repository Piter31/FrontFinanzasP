"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacciones", label: "Transacciones", icon: ArrowLeftRight },
  { href: "/configuraciones", label: "Configuraciones", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const email = user?.email ?? "";
  const displayName = user?.name?.trim() || email;
  const initial = (displayName.charAt(0) || "U").toUpperCase();

  return (
    <>
      {/* Sidebar de escritorio */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 md:flex">
        <Link href="/" className="flex items-center gap-3 px-5 pt-6">
          <span className="grid size-10 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <Wallet className="size-5" />
          </span>
          <span className="text-xl font-bold tracking-tight">FinanzasP</span>
        </Link>

        <nav className="mt-10 flex flex-col gap-1 px-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-500">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-zinc-500">{email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Navegación inferior en móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-zinc-200 bg-white/95 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95 md:hidden">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-[11px] font-medium ${
                active
                  ? "text-emerald-500"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={logout}
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400"
        >
          <LogOut className="size-5" />
          Salir
        </button>
      </nav>
    </>
  );
}
