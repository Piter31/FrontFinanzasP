"use client";

import type { LucideIcon } from "lucide-react";
import { Lock, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { BarChart } from "@/components/bar-chart";
import { Card } from "@/components/card";
import { DonutChart } from "@/components/donut-chart";
import { dashboardMock } from "@/lib/landing/data";

// Los valores del mock se formatean fijos en USD (es-AR) para no depender
// del contexto de sesión: la landing es pública.
const fmtMoney = (value: number) =>
  `US$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtPct = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;

type Tone = "neutral" | "ingreso" | "gasto";

const toneValue: Record<Tone, string> = {
  neutral: "text-zinc-900 dark:text-zinc-50",
  ingreso: "text-emerald-500",
  gasto: "text-rose-500",
};

const toneIcon: Record<Tone, string> = {
  neutral: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400",
  ingreso: "bg-emerald-500/10 text-emerald-500",
  gasto: "bg-rose-500/10 text-rose-500",
};

// Réplica del markup de StatCard con valores ya formateados (sin useCurrency).
function MockStatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  caption,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: Tone;
  caption: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
          {label}
        </p>
        <span
          className={`grid size-8 shrink-0 place-items-center rounded-xl ${toneIcon[tone]}`}
        >
          <Icon className="size-3.5" />
        </span>
      </div>
      <p
        className={`mt-2 text-xl font-bold tabular-nums sm:text-2xl ${toneValue[tone]}`}
      >
        {value}
      </p>
      <div className="mt-1 text-[11px] sm:text-xs">
        <span className="text-emerald-500">{caption}</span>
      </div>
    </Card>
  );
}

export function DashboardMock({ compact = false }: { compact?: boolean }) {
  const goalProgress = Math.min(
    100,
    Math.round((dashboardMock.balance / dashboardMock.meta) * 100),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
      {/* Barra del navegador */}
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="flex shrink-0 gap-1.5">
          <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <Lock className="size-3 shrink-0" />
            <span className="truncate">finanzasp.com/dashboard</span>
          </span>
        </div>
        <div className="w-10 shrink-0" aria-hidden />
      </div>

      {/* Contenido del dashboard */}
      <div
        className={
          compact
            ? "space-y-3 p-3 sm:space-y-4 sm:p-4"
            : "space-y-4 p-4 sm:space-y-5 sm:p-6"
        }
      >
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MockStatCard
            label="Balance total"
            value={fmtMoney(dashboardMock.balance)}
            icon={Wallet}
            caption={`+${fmtMoney(dashboardMock.netoMes)} este mes`}
          />
          <MockStatCard
            label="Ingresos del mes"
            value={fmtMoney(dashboardMock.ingresosMes)}
            icon={TrendingUp}
            tone="ingreso"
            caption={`${fmtPct(dashboardMock.pctIngresos)} vs mes anterior`}
          />
          <MockStatCard
            label="Gastos del mes"
            value={fmtMoney(dashboardMock.gastosMes)}
            icon={TrendingDown}
            tone="gasto"
            caption={`${fmtPct(dashboardMock.pctGastos)} vs mes anterior`}
          />
        </section>

        <section
          className={`grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 ${
            compact ? "hidden sm:grid" : ""
          }`}
        >
          <BarChart data={dashboardMock.series} />
          <DonutChart data={dashboardMock.categorias} />
        </section>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Meta de ahorro</p>
            <span className="text-xs font-semibold text-emerald-500">
              {goalProgress}%
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {fmtMoney(dashboardMock.balance)} de {fmtMoney(dashboardMock.meta)}
          </p>
        </Card>
      </div>
    </div>
  );
}
