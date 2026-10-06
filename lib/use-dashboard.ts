"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { useAuth } from "./auth-context";
import { useTransactions } from "./transactions-context";

export interface DashboardData {
  balance: number;
  ingresosMes: number;
  gastosMes: number;
  ingresosMesAnterior: number;
  gastosMesAnterior: number;
  /** null en planes sin acceso a gráficos (FREE). */
  series: { label: string; ingresos: number; gastos: number }[] | null;
  /** null en planes sin acceso a gráficos (FREE). */
  categorias: { categoria: string; total: number }[] | null;
  /** null en planes sin meta de ahorro (FREE). */
  meta: { objetivo: number; ahorro: number; porcentaje: number } | null;
}

/**
 * Cálculos financieros en tiempo real: pide el resumen al backend y se
 * recarga automáticamente cada vez que cambian las transacciones.
 */
export function useDashboard() {
  const { token, logout } = useAuth();
  const { dataVersion } = useTransactions();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    if (!token) return;
    setLoading(true);
    api<DashboardData>("/finance/dashboard", { token })
      .then(setData)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) logout();
      })
      .finally(() => setLoading(false));
  }, [token, logout]);

  useEffect(() => {
    reload();
  }, [reload, dataVersion]);

  const updateGoal = useCallback(
    async (objetivo: number) => {
      if (!token) return;
      await api("/finance/savings-goal", {
        method: "PUT",
        body: JSON.stringify({ objetivo }),
        token,
      });
      reload();
    },
    [token, reload],
  );

  return { data, loading, updateGoal, reload };
}
