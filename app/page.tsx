"use client";

import { LogOut, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { BarChart } from "@/components/bar-chart";
import { DonutChart } from "@/components/donut-chart";
import { SavingsGoal } from "@/components/savings-goal";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTransactionModal } from "@/components/transaction-modal";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/use-currency";
import { useDashboard } from "@/lib/use-dashboard";
import { useShowCharts } from "@/lib/use-show-charts";

function DashboardSkeleton() {
  const { showCharts } = useShowCharts();
  const block =
    "animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60";
  return (
    <>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-32 ${block}`} />
        ))}
      </section>
      {showCharts && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className={`h-72 ${block}`} />
          ))}
        </section>
      )}
      <div className={`h-28 ${block}`} />
    </>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { openModal } = useTransactionModal();
  const { data, loading, updateGoal } = useDashboard();
  const { format } = useCurrency();
  const { showCharts } = useShowCharts();

  const pct = (curr: number, prev: number) =>
    prev === 0 ? null : ((curr - prev) / prev) * 100;
  const pctIngresos = data ? pct(data.ingresosMes, data.ingresosMesAnterior) : null;
  const pctGastos = data ? pct(data.gastosMes, data.gastosMesAnterior) : null;
  const netoMes = data ? data.ingresosMes - data.gastosMes : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h1 className="text-2xl font-bold tracking-tight">Panel de Control</h1>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                de: {user?.name}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Resumen de tus finanzas personales
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            {/* <ThemeToggle /> */}
            <button
              type="button"
              onClick={logout}
              title="Cerrar sesión"
              className="hidden items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 md:flex dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              <LogOut className="size-4" />
              Salir
            </button>
          </div>
          <button
            type="button"
            onClick={openModal}
            aria-label="Nueva transacción"
            title="Nueva transacción"
            className="grid size-12 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 hover:bg-emerald-600"
          >
            <Plus className="size-6" />
          </button>
        </div>
      </header>

      {loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Balance total"
              value={data.balance}
              icon={Wallet}
              caption={
                <span
                  className={netoMes >= 0 ? "text-emerald-500" : "text-rose-500"}
                >
                  {netoMes >= 0 ? "+" : ""}
                  {format(netoMes)} este mes
                </span>
              }
            />
            <StatCard
              label="Ingresos del mes"
              value={data.ingresosMes}
              icon={TrendingUp}
              tone="ingreso"
              href="/transacciones?tipo=ingreso"
              caption={
                pctIngresos == null ? (
                  <span className="text-zinc-500">
                    Sin datos del mes anterior
                  </span>
                ) : (
                  <span
                    className={
                      pctIngresos >= 0 ? "text-emerald-500" : "text-rose-500"
                    }
                  >
                    {pctIngresos >= 0 ? "+" : ""}
                    {pctIngresos.toFixed(1)}% vs mes anterior
                  </span>
                )
              }
            />
            <StatCard
              label="Gastos del mes"
              value={data.gastosMes}
              icon={TrendingDown}
              tone="gasto"
              href="/transacciones?tipo=gasto"
              caption={
                pctGastos == null ? (
                  <span className="text-zinc-500">
                    Sin datos del mes anterior
                  </span>
                ) : (
                  <span
                    className={
                      pctGastos <= 0 ? "text-emerald-500" : "text-rose-500"
                    }
                  >
                    {pctGastos >= 0 ? "+" : ""}
                    {pctGastos.toFixed(1)}% vs mes anterior
                  </span>
                )
              }
            />
          </section>

          {showCharts && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Gráficos</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <BarChart data={data.series} />
                <DonutChart data={data.categorias} />
              </div>
            </section>
          )}

          <SavingsGoal meta={data.meta} onSave={updateGoal} />
        </>
      )}
    </div>
  );
}
