"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError } from "./api";
import { useAuth } from "./auth-context";
import type { Transaction } from "./types";

interface TransactionsContextValue {
  transactions: Transaction[];
  loading: boolean;
  /** Se incrementa con cada mutación para que los cálculos se recarguen */
  dataVersion: number;
  addTransaction: (t: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | null>(
  null,
);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    if (!token) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api<Transaction[]>("/transactions", { token })
      .then((list) => {
        if (!cancelled) setTransactions(list);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) logout();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const addTransaction = useCallback(
    async (t: Omit<Transaction, "id">) => {
      if (!token) return;
      try {
        const created = await api<Transaction>("/transactions", {
          method: "POST",
          body: JSON.stringify(t),
          token,
        });
        setTransactions((prev) => [created, ...prev]);
        setDataVersion((v) => v + 1);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) logout();
        throw err;
      }
    },
    [token, logout],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!token) return;
      try {
        await api<void>(`/transactions/${id}`, { method: "DELETE", token });
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        setDataVersion((v) => v + 1);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) logout();
        throw err;
      }
    },
    [token, logout],
  );

  const value = useMemo(
    () => ({
      transactions,
      loading,
      dataVersion,
      addTransaction,
      deleteTransaction,
    }),
    [transactions, loading, dataVersion, addTransaction, deleteTransaction],
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error(
      "useTransactions debe usarse dentro de TransactionsProvider",
    );
  }
  return ctx;
}
