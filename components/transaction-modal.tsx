"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ChevronDown, X } from "lucide-react";
import { CATEGORIAS_GASTO, CATEGORIAS_INGRESO } from "@/lib/data";
import { toISODate } from "@/lib/format";
import { useCurrency } from "@/lib/use-currency";
import { useTransactions } from "@/lib/transactions-context";
import type { TransactionType } from "@/lib/types";

const ModalContext = createContext<{ openModal: () => void } | null>(null);

export function useTransactionModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error(
      "useTransactionModal debe usarse dentro de TransactionModalProvider",
    );
  }
  return ctx;
}

export function TransactionModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ openModal: () => setOpen(true) }}>
      {children}
      {open && <TransactionModal onClose={() => setOpen(false)} />}
    </ModalContext.Provider>
  );
}

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:placeholder:text-zinc-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function TransactionModal({ onClose }: { onClose: () => void }) {
  const { addTransaction } = useTransactions();
  const { symbol } = useCurrency();
  const [tipo, setTipo] = useState<TransactionType>("gasto");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(() => toISODate(new Date()));
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const categorias = tipo === "gasto" ? CATEGORIAS_GASTO : CATEGORIAS_INGRESO;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const valor = Number(monto);
    if (!Number.isFinite(valor) || valor <= 0) {
      return setError("Ingresa un monto válido mayor a 0.");
    }
    if (!categoria) return setError("Selecciona una categoría.");
    if (!fecha) return setError("Selecciona una fecha.");
    setError("");
    setSaving(true);
    try {
      await addTransaction({
        tipo,
        monto: valor,
        categoria,
        fecha,
        descripcion: descripcion.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar. Inténtalo de nuevo.",
      );
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nueva transacción"
        className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-center text-xl font-semibold">
          Nueva transacción
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <Field label="Tipo">
            <div className="relative">
              <select
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value as TransactionType);
                  setCategoria("");
                }}
                className={`${inputClass} appearance-none pr-9`}
              >
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </Field>

          <Field label="Monto">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                {symbol}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                autoFocus
                className={`${inputClass} pl-10`}
              />
            </div>
          </Field>

          <Field label="Categoría">
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={`${inputClass} appearance-none pr-9 ${
                  categoria ? "" : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                {categorias.map((c) => (
                  <option
                    key={c}
                    value={c}
                    className="text-zinc-900 dark:text-zinc-100"
                  >
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </Field>

          <Field label="Fecha">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Descripción">
              <input
                type="text"
                placeholder="opcional"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={80}
                className={inputClass}
              />
            </Field>
          </div>

          {error && (
            <p className="text-sm text-rose-500 sm:col-span-2">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar transacción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
