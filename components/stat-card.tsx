"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "./card";
import { useCurrency } from "@/lib/use-currency";

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

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  caption,
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: Tone;
  caption?: ReactNode;
  href?: string;
}) {
  const { format } = useCurrency();
  const card = (
    <Card
      className={`p-5 ${
        href
          ? "transition hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-700"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl ${toneIcon[tone]}`}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p
        className={`mt-3 text-2xl font-bold tabular-nums sm:text-3xl ${toneValue[tone]}`}
      >
        {format(value)}
      </p>
      {caption != null && <div className="mt-1 text-xs">{caption}</div>}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block cursor-pointer">
        {card}
      </Link>
    );
  }
  return card;
}
