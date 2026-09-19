"use client";

import { useState } from "react";
import { Check, LogOut, Pencil, Trash2, X } from "lucide-react";
import { Card } from "@/components/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { CATEGORIAS_GASTO } from "@/lib/data";
import { useBudgets } from "@/lib/use-budgets";
import { useCurrency } from "@/lib/use-currency";
import { useShowCharts } from "@/lib/use-show-charts";

const MONEDAS = [
  { code: "USD", label: "US$ Dólar" },
  { code: "ARS", label: "AR$ Peso arg." },
] as const;

export default function ConfiguracionesPage() {
  const { user, logout, setCurrency } = useAuth();
  const { showCharts, setShowCharts } = useShowCharts();
  const currency = user?.currency ?? "USD";
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [currencyError, setCurrencyError] = useState("");
  const { presupuestos, saveLimite, removeLimite } = useBudgets();
  const { format } = useCurrency();
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");
  const [editando, setEditando] = useState<string | null>(null);
  const [montoEdicion, setMontoEdicion] = useState("");
  const [savingCategoria, setSavingCategoria] = useState<string | null>(null);
  const [budgetError, setBudgetError] = useState("");

  // Categorías de gasto que todavía no tienen límite configurado
  const disponibles = CATEGORIAS_GASTO.filter(
    (c) => !presupuestos.some((p) => p.categoria === c),
  );
  const lista = [...presupuestos].sort((a, b) =>
    a.categoria.localeCompare(b.categoria, "es"),
  );

  const montoValido = (valor: string) => {
    const n = Number(valor);
    return valor.trim() !== "" && Number.isFinite(n) && n > 0;
  };

  const guardar = async (categoria: string, valor: number) => {
    if (savingCategoria) return false;
    setBudgetError("");
    setSavingCategoria(categoria);
    try {
      await saveLimite(categoria, valor);
      return true;
    } catch (err) {
      setBudgetError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el presupuesto.",
      );
      return false;
    } finally {
      setSavingCategoria(null);
    }
  };

  const handleAgregar = async () => {
    if (!nuevaCategoria || !montoValido(nuevoMonto)) return;
    const ok = await guardar(nuevaCategoria, Number(nuevoMonto));
    if (ok) {
      setNuevaCategoria("");
      setNuevoMonto("");
    }
  };

  const handleGuardarEdicion = async (categoria: string) => {
    if (!montoValido(montoEdicion)) return;
    const ok = await guardar(categoria, Number(montoEdicion));
    if (ok) setEditando(null);
  };

  const handleRemoveLimite = async (categoria: string) => {
    if (savingCategoria) return;
    setBudgetError("");
    setSavingCategoria(categoria);
    try {
      await removeLimite(categoria);
    } catch (err) {
      setBudgetError(
        err instanceof Error
          ? err.message
          : "No se pudo quitar el presupuesto.",
      );
    } finally {
      setSavingCategoria(null);
    }
  };

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
            <p className="text-sm font-medium">Gráficos</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Mostrar los gráficos del dashboard
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={showCharts}
            aria-label="Mostrar los gráficos del dashboard"
            onClick={() => setShowCharts(!showCharts)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              showCharts ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform ${
                showCharts ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
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

      <Card className="divide-y divide-zinc-200 dark:divide-zinc-800">
        <div className="p-5">
          <p className="text-sm font-medium">Presupuestos por categoría</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Te notificaremos  cuando alcances o superes el 80% del límite mensual
          </p>
          {budgetError && (
            <p className="mt-1 text-xs text-rose-500">{budgetError}</p>
          )}
        </div>

        <div className="p-5">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void handleAgregar();
            }}
          >
            <select
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              aria-label="Seleccionar la categoría"
              className="flex-1 rounded-xl border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700"
            >
              <option value="">Seleccionar la categoría</option>
              {disponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="Ingresar monto"
              aria-label="Ingresar monto"
              value={nuevoMonto}
              onChange={(e) => setNuevoMonto(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={
                !nuevaCategoria ||
                !montoValido(nuevoMonto) ||
                savingCategoria != null
              }
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar
            </button>
          </form>
          {disponibles.length === 0 && (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Ya asignaste un límite a todas las categorías.
            </p>
          )}
        </div>

        {lista.length > 0 && (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {lista.map((p) => {
              const guardando = savingCategoria === p.categoria;
              return (
                <li
                  key={p.categoria}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  {editando === p.categoria ? (
                    <>
                      <p className="text-sm font-medium">{p.categoria}</p>
                      <div className="flex shrink-0 items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          autoFocus
                          aria-label={`Nuevo límite de ${p.categoria}`}
                          value={montoEdicion}
                          onChange={(e) => setMontoEdicion(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void handleGuardarEdicion(p.categoria);
                            } else if (e.key === "Escape") {
                              setEditando(null);
                            }
                          }}
                          className="w-28 rounded-xl border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700"
                        />
                        <button
                          type="button"
                          onClick={() => void handleGuardarEdicion(p.categoria)}
                          disabled={
                            !montoValido(montoEdicion) || savingCategoria != null
                          }
                          title="Guardar monto"
                          aria-label={`Guardar límite de ${p.categoria}`}
                          className="rounded-xl bg-emerald-500 p-2 text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditando(null)}
                          title="Cancelar"
                          aria-label="Cancelar edición"
                          className="rounded-xl border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">{p.categoria}</p>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {guardando ? "..." : `${format(p.limite)} / mes`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditando(p.categoria);
                            setMontoEdicion(String(p.limite));
                          }}
                          disabled={savingCategoria != null}
                          title={`Editar límite de ${p.categoria}`}
                          aria-label={`Editar límite de ${p.categoria}`}
                          className="rounded-xl border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleRemoveLimite(p.categoria)}
                          disabled={savingCategoria != null}
                          title={`Quitar límite de ${p.categoria}`}
                          aria-label={`Quitar límite de ${p.categoria}`}
                          className="rounded-xl border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
