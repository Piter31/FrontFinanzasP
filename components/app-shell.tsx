"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangle, Hourglass, Wallet } from "lucide-react";
import { AuthProvider, useAuth, type AuthUser } from "@/lib/auth-context";
import { effectiveStatus } from "@/lib/plans";
import { TransactionsProvider } from "@/lib/transactions-context";
import { TransactionModalProvider } from "@/components/transaction-modal";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const AUTH_ROUTES = ["/login", "/registro", "/verificar", "/recuperar"];
const PUBLIC_ROUTES = ["/", ...AUTH_ROUTES];

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

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });
}

/**
 * Aviso fijo en la app para estados que requieren atención pero todavía
 * dan acceso: cobro rechazado (MP reintenta) o suscripción cancelada.
 */
function SubscriptionBanner({ user }: { user: AuthUser }) {
  const status = effectiveStatus(user);
  if (status !== "PAST_DUE" && status !== "CANCELED") return null;
  const until = formatDate(user.currentPeriodEnd);
  return (
    <div className="flex items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-700 dark:text-amber-400">
      <AlertTriangle className="size-4 shrink-0" />
      <p className="min-w-0 flex-1">
        {status === "PAST_DUE"
          ? `No pudimos cobrar tu suscripción. Mercado Pago lo reintenta; revisá tu medio de pago${until ? ` (acceso hasta el ${until})` : ""}.`
          : `Cancelaste tu suscripción: tenés acceso${until ? ` hasta el ${until}` : " hasta el fin del período pago"}.`}
      </p>
      <Link
        href="/configuraciones"
        className="shrink-0 font-semibold underline underline-offset-2"
      >
        {status === "PAST_DUE" ? "Ver detalle" : "Volver a suscribirme"}
      </Link>
    </div>
  );
}

/** Se muestra cuando el trial o el período pago ya vencieron. */
function SubscriptionExpired({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void;
}) {
  const copy =
    user.subscriptionStatus === "TRIALING"
      ? {
          title: "Tu período de prueba terminó",
          body: "Los días gratis llegaron a su fin. Elegí un plan para seguir usando FinanzasP: el plan Básico continúa por US$2,90/mes.",
        }
      : user.subscriptionStatus === "PAST_DUE"
        ? {
            title: "No pudimos cobrar tu suscripción",
            body: "Mercado Pago no logró acreditar el pago después de varios intentos. Suscribite de nuevo con otro medio de pago para recuperar el acceso: tus datos siguen guardados.",
          }
        : {
            title: "Tu suscripción terminó",
            body: "El período pago llegó a su fin. Elegí un plan para seguir usando FinanzasP: tus datos siguen guardados.",
          };
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-500">
          <Hourglass className="size-6" />
        </span>
        <h1 className="mt-4 text-xl font-bold tracking-tight">{copy.title}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {copy.body}
        </p>
        <Link
          href="/#planes"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          Ver planes
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Sin sesión y ruta no pública → /login; con sesión en una auth route → /dashboard.
  // La landing (/) es pública para todos: también la puede ver un usuario con
  // sesión (necesario para consultar planes y futuros upgrades).
  useEffect(() => {
    if (loading) return;
    if (!user && !isPublicRoute) router.replace("/login");
    else if (user && isAuthRoute) router.replace("/dashboard");
  }, [user, loading, isPublicRoute, isAuthRoute, router]);

  if (loading) return <Splash />;
  if (!user) {
    // Landing pública y pantallas de auth: sin sidebar ni providers de app
    if (isPublicRoute) return <>{children}</>;
    return <Splash />;
  }
  if (isAuthRoute) return <Splash />;
  if (pathname === "/") return <>{children}</>;

  // Suscripción vencida → pantalla de renovación (el rol ADMIN nunca se bloquea).
  // Excepción: /suscripcion/resultado debe ser visible porque es la vuelta
  // del checkout de Mercado Pago (justo lo que reactiva la suscripción).
  if (
    user.role !== "ADMIN" &&
    effectiveStatus(user) === "EXPIRED" &&
    pathname !== "/suscripcion/resultado"
  ) {
    return <SubscriptionExpired user={user} onLogout={logout} />;
  }

  return (
    <TransactionsProvider>
      <TransactionModalProvider>
        <div className="md:flex">
          <Sidebar />
          <div className="min-w-0 flex-1">
            {/* Barra superior móvil */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 md:hidden">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
                  <Wallet className="size-4" />
                </span>
                <span className="font-bold">FinanzasP</span>
              </Link>
              <ThemeToggle />
            </header>
            {user.role !== "ADMIN" && <SubscriptionBanner user={user} />}
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
