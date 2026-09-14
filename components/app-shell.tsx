"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Wallet } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { TransactionsProvider } from "@/lib/transactions-context";
import { TransactionModalProvider } from "@/components/transaction-modal";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const AUTH_ROUTES = ["/login", "/registro"];

function Splash() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3 text-zinc-500 dark:text-zinc-400">
        <span className="grid size-12 animate-pulse place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
          <Wallet className="size-6" />
        </span>
        <p className="text-sm">Cargando FinanzasP…</p>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Protección del dashboard: sin sesión → /login; con sesión en /login → /
  useEffect(() => {
    if (loading) return;
    if (!user && !isAuthRoute) router.replace("/login");
    else if (user && isAuthRoute) router.replace("/");
  }, [user, loading, isAuthRoute, router]);

  if (loading) return <Splash />;
  if (isAuthRoute) return user ? <Splash /> : <>{children}</>;
  if (!user) return <Splash />;

  return (
    <TransactionsProvider>
      <TransactionModalProvider>
        <div className="md:flex">
          <Sidebar />
          <div className="min-w-0 flex-1">
            {/* Barra superior móvil */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 md:hidden">
              <Link href="/" className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
                  <Wallet className="size-4" />
                </span>
                <span className="font-bold">FinanzasP</span>
              </Link>
              <ThemeToggle />
            </header>
            <main className="pb-24 md:pb-0">{children}</main>
          </div>
        </div>
      </TransactionModalProvider>
    </TransactionsProvider>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}
