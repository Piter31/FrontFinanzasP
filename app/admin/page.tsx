"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  Check,
  Lightbulb,
  Loader2,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/card";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalSuggestions: number;
  unreadSuggestions: number;
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  lastSeenAt: string | null;
  transactionCount: number;
}

interface AdminSuggestion {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  user: { email: string; name: string | null };
}

type Tab = "resumen" | "usuarios" | "sugerencias";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "usuarios", label: "Usuarios" },
  { id: "sugerencias", label: "Sugerencias" },
];

/** Un usuario se considera activo si su lastSeenAt está dentro de los últimos 15 minutos. */
const ACTIVE_WINDOW_MS = 15 * 60 * 1000;

function isActive(lastSeenAt: string | null): boolean {
  return (
    lastSeenAt != null &&
    Date.now() - new Date(lastSeenAt).getTime() < ACTIVE_WINDOW_MS
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRelative(iso: string | null): string {
  if (!iso) return "nunca";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "ahora";
  if (diff < 60_000) return "ahora";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} d`;
  return formatDateTime(iso);
}

function useAdminData<T>(path: string, token: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api<T>(path, { token })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudieron cargar los datos.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path, token]);

  return { data, setData, loading, error };
}

function StatsSkeleton() {
  const block =
    "animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60";
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`h-32 ${block}`} />
      ))}
    </section>
  );
}

function ListSkeleton() {
  return (
    <Card>
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
            <div className="size-9 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-2.5 w-1/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card className="p-8 text-center">
      <p role="alert" className="text-sm text-rose-500">
        {message}
      </p>
    </Card>
  );
}

function AdminStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums sm:text-3xl">
        {value.toLocaleString("es-ES")}
      </p>
    </Card>
  );
}

function ResumenTab({ token }: { token: string | null }) {
  const { data: stats, loading, error } = useAdminData<AdminStats>(
    "/admin/stats",
    token,
  );

  if (loading) return <StatsSkeleton />;
  if (error || !stats)
    return <ErrorState message={error ?? "No se pudieron cargar las estadísticas."} />;

  const items: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Usuarios totales", value: stats.totalUsers, icon: Users },
    {
      label: "Usuarios activos (últimos 15 min)",
      value: stats.activeUsers,
      icon: UserCheck,
    },
    {
      label: "Transacciones totales",
      value: stats.totalTransactions,
      icon: ArrowLeftRight,
    },
    {
      label: "Sugerencias recibidas",
      value: stats.totalSuggestions,
      icon: Lightbulb,
    },
    {
      label: "Sugerencias sin leer",
      value: stats.unreadSuggestions,
      icon: MessageSquare,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ label, value, icon }) => (
        <AdminStatCard key={label} label={label} value={value} icon={icon} />
      ))}
    </section>
  );
}

function UsuariosTab({ token }: { token: string | null }) {
  const { data: users, loading, error } = useAdminData<AdminUser[]>(
    "/admin/users",
    token,
  );

  if (loading) return <ListSkeleton />;
  if (error || !users)
    return <ErrorState message={error ?? "No se pudieron cargar los usuarios."} />;
  if (users.length === 0)
    return (
      <Card className="p-10 text-center text-sm text-zinc-500">
        Aún no hay usuarios registrados.
      </Card>
    );

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="px-5 py-3 font-medium">Usuario</th>
              <th className="px-5 py-3 font-medium">Registro</th>
              <th className="px-5 py-3 font-medium">Última actividad</th>
              <th className="px-5 py-3 text-right font-medium">Transacciones</th>
              <th className="px-5 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3.5">
                  <p className="font-medium">{u.name?.trim() || "—"}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {u.email}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">
                  {formatDateTime(u.createdAt)}
                </td>
                <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">
                  {formatRelative(u.lastSeenAt)}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums">
                  {u.transactionCount}
                </td>
                <td className="px-5 py-3.5">
                  {isActive(u.lastSeenAt) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Activo
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SugerenciasTab({ token }: { token: string | null }) {
  const {
    data: suggestions,
    setData: setSuggestions,
    loading,
    error,
  } = useAdminData<AdminSuggestion[]>("/admin/suggestions", token);
  const [marking, setMarking] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const markAsRead = async (id: string) => {
    if (!token || marking) return;
    setMarking(id);
    setActionError(null);
    try {
      await api<AdminSuggestion>(`/admin/suggestions/${id}/read`, {
        method: "PATCH",
        token,
      });
      setSuggestions(
        (prev) =>
          prev?.map((s) => (s.id === id ? { ...s, read: true } : s)) ?? null,
      );
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : "No se pudo marcar la sugerencia como leída.",
      );
    } finally {
      setMarking(null);
    }
  };

  if (loading) return <ListSkeleton />;
  if (error || !suggestions)
    return (
      <ErrorState message={error ?? "No se pudieron cargar las sugerencias."} />
    );
  if (suggestions.length === 0)
    return (
      <Card className="p-10 text-center text-sm text-zinc-500">
        Aún no hay sugerencias de los usuarios.
      </Card>
    );

  return (
    <>
      {actionError && (
        <p role="alert" className="text-sm text-rose-500">
          {actionError}
        </p>
      )}
      <Card>
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {suggestions.map((s) => (
            <li key={s.id} className="px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-sm font-medium">
                  {s.user.name?.trim() || s.user.email}
                </p>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {s.user.email}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  · {formatDateTime(s.createdAt)}
                </span>
                {!s.read && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Nuevo
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">
                {s.message}
              </p>
              {!s.read && (
                <button
                  type="button"
                  onClick={() => void markAsRead(s.id)}
                  disabled={marking !== null}
                  className="mt-3 flex items-center gap-1.5 rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/10 disabled:opacity-60 dark:text-emerald-400"
                >
                  {marking === s.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Marcar como leído
                </button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

export default function AdminPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("resumen");

  if (authLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
        <StatsSkeleton />
      </div>
    );
  }

  // Sin sesión, AppShell ya se encarga de redirigir a /login
  if (!user) return null;

  if (user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-xl p-4 sm:p-6 lg:p-8">
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
            <ShieldAlert className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Acceso denegado</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Esta sección es solo para administradores.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            Volver al panel
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administración</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Panel interno del dueño de la app
          </p>
        </div>
      </header>

      <div className="flex gap-1 rounded-2xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "resumen" && <ResumenTab token={token} />}
      {tab === "usuarios" && <UsuariosTab token={token} />}
      {tab === "sugerencias" && <SugerenciasTab token={token} />}
    </div>
  );
}
