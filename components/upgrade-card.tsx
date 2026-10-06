import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card } from "./card";
import { PLAN_LABELS, type Plan } from "@/lib/plans";

/** Aviso de upsell: la funcionalidad pertenece a un plan superior. */
export function UpgradeCard({
  title,
  description,
  requiredPlan,
}: {
  title: string;
  description: string;
  requiredPlan: Plan;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 border-dashed p-6 text-center">
      <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
        <Sparkles className="size-5" />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <Link
        href="/#planes"
        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
      >
        Ver plan {PLAN_LABELS[requiredPlan]}
      </Link>
    </Card>
  );
}
