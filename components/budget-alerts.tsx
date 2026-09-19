"use client";

import { TriangleAlert } from "lucide-react";
import { useBudgets } from "@/lib/use-budgets";
import { useCurrency } from "@/lib/use-currency";

/**
 * Avisos automáticos del dashboard: muestra una alerta por cada presupuesto
 * que llegó al 80% del límite ("alerta") o que ya se superó ("excedido").
 * Si no hay ninguna, no renderiza nada.
 */
export function BudgetAlerts() {
  const { presupuestos } = useBudgets();
  const { format } = useCurrency();

  const alertas = presupuestos.filter((p) => p.estado !== "ok");
  if (alertas.length === 0) return null;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-semibold">Alertas de presupuesto</h2>
      <ul className="space-y-2">
        {alertas.map((p) => {
          const excedido = p.estado === "excedido";
          return (
            <li
              key={p.categoria}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                excedido
                  ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                  : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
              }`}
            >
              <TriangleAlert className="size-4 shrink-0" />
              <span>
                {excedido
                  ? `Superaste el presupuesto de ${p.categoria} (${p.porcentaje}% usado)`
                  : `Llevas gastado el ${p.porcentaje}% de tu presupuesto de ${p.categoria} (${format(p.gastado)} de ${format(p.limite)})`}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
