"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Card } from "@/components/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";

const MONEDAS = [
  { code: "USD", label: "US$ Dólar" },
  { code: "ARS", label: "AR$ Peso arg." },
] as const;

export default function ConfiguracionesPage() {
  const { user, logout, setCurrency } = useAuth();
  const currency = user?.currency ?? "USD";
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [currencyError, setCurrencyError] = useState("");

  const handleCurrency = async (code: "USD" | "ARS") => {
    if (code === currency || savingCurrency) return;
    setCurrencyError("");
    setSavingCurrency(true);
    try {
      await setCurrency(code);
    } catch (err) {
      setCurrencyError(
        err instanceof Error
          ? err.message
          : "No se pudo cambiar la moneda.",
      );
    } finally {
      setSavingCurrency(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Configuraciones</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Personaliza tu experiencia en FinanzasP
        </p>
      </header>

      <Card className="divide-y divide-zinc-200 dark:divide-zinc-800">
        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-medium">Tema de la interfaz</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Cambia entre modo claro y oscuro
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-medium">Moneda</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              En qué moneda ves tus montos (no convierte valores)
            </p>
            {currencyError && (
              <p className="mt-1 text-xs text-rose-500">{currencyError}</p>
            )}
          </div>
          <div className="flex shrink-0 rounded-xl border border-zinc-200 p-1 dark:border-zinc-800">
            {MONEDAS.map((m) => (
              <button
                key={m.code}
                type="button"
                onClick={() => void handleCurrency(m.code)}
                disabled={savingCurrency}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                  currency === m.code
                    ? "bg-emerald-500 text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="text-sm font-medium">Cuenta</p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user?.name ? `${user.name} · ` : ""}
              {user?.email}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
            Sesión activa
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-medium">Cerrar sesión</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Sal de tu cuenta en este dispositivo
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium transition-colors hover:bg-rose-500/10 hover:text-rose-500 dark:border-zinc-800"
          >
            <LogOut className="size-4" />
            Salir
          </button>
        </div>
      </Card>
    </div>
  );
}
