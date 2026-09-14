"use client";

import { Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/card";
import { useTransactionModal } from "@/components/transaction-modal";
import { useTransactions } from "@/lib/transactions-context";
import { useCurrency } from "@/lib/use-currency";
import { formatDate } from "@/lib/format";

export default function TransaccionesPage() {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const { openModal } = useTransactionModal();
  const { format } = useCurrency();

  const sorted = [...transactions].sort((a, b) =>
    a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0,
  );

  const handleDelete = (id: string) => {
    deleteTransaction(id).catch(() => {
      // los 401 ya redirigen a /login; otros errores se ignoran en la UI
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transacciones</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Historial de todos tus movimientos
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          <Plus className="size-4" />
          Nueva transacción
        </button>
      </header>

      <Card>
        {loading ? (
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
        ) : sorted.length === 0 ? (
          <p className="p-10 text-center text-sm text-zinc-500">
            Aún no hay transacciones. Agrega la primera con el botón de arriba.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {sorted.map((t) => (
              <li key={t.id} className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                    t.tipo === "ingreso"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {t.tipo === "ingreso" ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.categoria}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {t.descripcion ? `${t.descripcion} · ` : ""}
                    {formatDate(t.fecha)}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold tabular-nums ${
                    t.tipo === "ingreso" ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {t.tipo === "ingreso" ? "+" : "-"}
                  {format(t.monto)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  aria-label="Eliminar transacción"
                  title="Eliminar"
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
