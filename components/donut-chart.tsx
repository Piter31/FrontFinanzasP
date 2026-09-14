"use client";

import { Card } from "./card";
import { useCurrency } from "@/lib/use-currency";

export interface CategoryTotal {
  categoria: string;
  total: number;
}

const PALETTE = [
  "#10b981",
  "#38bdf8",
  "#a78bfa",
  "#fbbf24",
  "#fb7185",
  "#94a3b8",
  "#f472b6",
  "#34d399",
];

export function DonutChart({ data }: { data: CategoryTotal[] }) {
  const { format } = useCurrency();
  const total = data.reduce((sum, d) => sum + d.total, 0);

  if (total <= 0) {
    return (
      <Card className="p-5">
        <h3 className="font-semibold">Gastos por categoría</h3>
        <div className="grid h-56 place-items-center text-sm text-zinc-500">
          Sin gastos registrados este mes
        </div>
      </Card>
    );
  }

  const R = 70;
  const STROKE = 24;
  const CIRC = 2 * Math.PI * R;

  let acc = 0;
  const segments = data.map((d, i) => {
    const len = (d.total / total) * CIRC;
    const segment = {
      ...d,
      color: PALETTE[i % PALETTE.length],
      dasharray: `${len} ${CIRC - len}`,
      dashoffset: -acc,
    };
    acc += len;
    return segment;
  });

  return (
    <Card className="p-5">
      <h3 className="font-semibold">Gastos por categoría</h3>
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <svg viewBox="0 0 200 200" className="size-44 shrink-0">
          <g transform="rotate(-90 100 100)">
            <circle
              cx={100}
              cy={100}
              r={R}
              fill="none"
              strokeWidth={STROKE}
              className="stroke-zinc-200 dark:stroke-zinc-800"
            />
            {segments.map((s) => (
              <circle
                key={s.categoria}
                cx={100}
                cy={100}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDasharray={s.dasharray}
                strokeDashoffset={s.dashoffset}
              >
                <title>{`${s.categoria}: ${format(s.total)}`}</title>
              </circle>
            ))}
          </g>
          <text
            x={100}
            y={94}
            textAnchor="middle"
            className="fill-zinc-500 text-[10px] uppercase tracking-wide dark:fill-zinc-400"
          >
            Total mes
          </text>
          <text
            x={100}
            y={114}
            textAnchor="middle"
            className="fill-zinc-900 text-[13px] font-semibold dark:fill-zinc-100"
          >
            {format(total)}
          </text>
        </svg>

        <ul className="w-full min-w-0 space-y-2 text-sm">
          {segments.map((s) => (
            <li key={s.categoria} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="truncate">{s.categoria}</span>
              <span className="ml-auto tabular-nums text-zinc-500 dark:text-zinc-400">
                {format(s.total)}
              </span>
              <span className="w-10 text-right tabular-nums text-zinc-400 dark:text-zinc-500">
                {((s.total / total) * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
