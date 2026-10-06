import { Check } from "lucide-react";
import { comparisonRows, type CellValue } from "@/lib/landing/data";
import { Badge, Reveal, Section } from "@/components/landing/ui";

function PlanCell({ value }: { value: CellValue }) {
  if (value === "yes") {
    return <Check className="inline size-4 text-emerald-500" />;
  }
  if (value === "coming-soon") {
    return <Badge tone="amber">Próximamente</Badge>;
  }
  return <span className="text-zinc-300 dark:text-zinc-600">—</span>;
}

export function ComparisonTable() {
  return (
    <Section>
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Compará los planes en detalle
          </h3>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
            Todas las funcionalidades, plan por plan.
          </p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400"
                  >
                    Funcionalidad
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">
                    Gratis
                  </th>
                  <th
                    scope="col"
                    className="bg-emerald-500/5 px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400"
                  >
                    Plus
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-t border-zinc-100 dark:border-zinc-800/60"
                  >
                    <td className="px-4 py-3 text-left font-medium">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PlanCell value={row.free} />
                    </td>
                    <td className="bg-emerald-500/5 px-4 py-3 text-center">
                      <PlanCell value={row.plus} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PlanCell value={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
