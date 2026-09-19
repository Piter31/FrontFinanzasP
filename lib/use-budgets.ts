"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { useAuth } from "./auth-context";
import { useTransactions } from "./transactions-context";
import type { BudgetStatus } from "./types";

/**
 * Presupuestos mensuales por categoría: pide el estado al backend y se
 * recarga automáticamente cada vez que cambian las transacciones.
 */
export function useBudgets() {
  const { token, logout } = useAuth();
  const { dataVersion } = useTransactions();
  const [presupuestos, setPresupuestos] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    if (!token) return;
    setLoading(true);
    api<{ presupuestos: BudgetStatus[] }>("/budgets/status", { token })
      .then((res) => setPresupuestos(res.presupuestos))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) logout();
      })
      .finally(() => setLoading(false));
  }, [token, logout]);

  useEffect(() => {
    reload();
  }, [reload, dataVersion]);

  const saveLimite = useCallback(
    async (categoria: string, limite: number) => {
      if (!token) return;
      try {
        await api("/budgets", {
          method: "PUT",
          body: JSON.stringify({ categoria, limite }),
          token,
        });
        // Re-fetchea para traer gastado/porcentaje actualizados
        reload();
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) logout();
        throw err;
      }
    },
    [token, logout, reload],
  );

  const removeLimite = useCallback(
    async (categoria: string) => {
      if (!token) return;
      try {
        await api<void>(`/budgets/${encodeURIComponent(categoria)}`, {
          method: "DELETE",
          token,
        });
        setPresupuestos((prev) =>
          prev.filter((p) => p.categoria !== categoria),
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) logout();
        throw err;
      }
    },
    [token, logout],
  );

  return { presupuestos, loading, saveLimite, removeLimite };
}
