"use client";

import { Card } from "./card";
import { useCurrency } from "@/lib/use-currency";

export interface MonthlyPoint {
  label: string;
  ingresos: number;
  gastos: number;
}

export function BarChart({ data }: { data: MonthlyPoint[] }) {
  const { format } = useCurrency();
  const max = Math.max(1, ...data.flatMap((d) => [d.ingresos, d.gastos]));
  const W = 560;
  const H = 224;
  const PAD_BOTTOM = 26;
  const PAD_TOP = 8;
  const chartH = H - PAD_BOTTOM - PAD_TOP;
  const groupW = W / data.length;
  const barW = Math.min(16, (groupW - 24) / 2.5);
  const gap = 6;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">Ingresos vs Gastos</h3>
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            Ingresos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500" />
            Gastos
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-56 w-full">
        <line
          x1={0}
          x2={W}
          y1={H - PAD_BOTTOM}
          y2={H - PAD_BOTTOM}
          strokeWidth={1}
          className="stroke-zinc-200 dark:stroke-zinc-800"
        />
        {data.map((d, i) => {
          const cx = i * groupW + groupW / 2;
          const hI = (d.ingresos / max) * chartH;
          const hG = (d.gastos / max) * chartH;
          return (
            <g key={`${d.label}-${i}`}>
              <rect
                x={cx - barW - gap / 2}
                y={H - PAD_BOTTOM - hI}
                width={barW}
                height={hI}
                rx={4}
                className="fill-emerald-500"
              >
                <title>{`Ingresos: ${format(d.ingresos)}`}</title>
              </rect>
              <rect
                x={cx + gap / 2}
                y={H - PAD_BOTTOM - hG}
                width={barW}
                height={hG}
                rx={4}
                className="fill-rose-500"
              >
                <title>{`Gastos: ${format(d.gastos)}`}</title>
              </rect>
              <text
                x={cx}
                y={H - 8}
                textAnchor="middle"
                className="fill-zinc-500 text-[11px] capitalize dark:fill-zinc-400"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}
