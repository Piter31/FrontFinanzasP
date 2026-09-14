"use client";

import { useState } from "react";
import { Check, Pencil, Target, X } from "lucide-react";
import { Card } from "./card";
import { useCurrency } from "@/lib/use-currency";

export interface MetaAhorro {
  objetivo: number;
  ahorro: number;
  porcentaje: number;
}

export function SavingsGoal({
  meta,
  onSave,
}: {
  meta: MetaAhorro;
  onSave: (objetivo: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const { format, symbol } = useCurrency();

  const startEdit = () => {
    setValue(String(meta.objetivo));
    setEditing(true);
  };

  const save = async () => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return;
    setSaving(true);
    try {
      await onSave(n);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Target className="size-4" />
          </span>
          <div>
            <h3 className="font-semibold">Meta de ahorro</h3>
            {editing ? (
              <div className="mt-1 flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void save();
                      if (e.key === "Escape") setEditing(false);
                    }}
                    autoFocus
                    className="w-32 rounded-lg border border-zinc-300 bg-transparent py-1 pl-6 pr-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void save()}
                  disabled={saving}
                  aria-label="Guardar meta"
                  className="grid size-7 place-items-center rounded-lg bg-emerald-500 text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
                >
                  <Check className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  aria-label="Cancelar"
                  className="grid size-7 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Llevas {format(meta.ahorro)} de {format(meta.objetivo)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!editing && (
            <button
              type="button"
              onClick={startEdit}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <Pencil className="size-3.5" />
              Editar meta
            </button>
          )}
          <span className="text-lg font-bold tabular-nums text-emerald-500">
            {meta.porcentaje.toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${meta.porcentaje}%` }}
        />
      </div>
    </Card>
  );
}
