import type { LucideIcon } from "lucide-react";
import { ChartColumn, PiggyBank, Wallet } from "lucide-react";
import { DashboardMock } from "./dashboard-mock";
import { CtaButton, Reveal, Section, SectionHeading } from "./ui";

const highlights: { icon: LucideIcon; label: string; text: string }[] = [
  {
    icon: Wallet,
    label: "Balance siempre actualizado",
    text: "Cada movimiento que registrás se refleja al instante en tu balance total.",
  },
  {
    icon: ChartColumn,
    label: "Comparación mes a mes",
    text: "Ves la variación de tus ingresos y gastos respecto al mes anterior.",
  },
  {
    icon: PiggyBank,
    label: "Gráficos de tus gastos por categoría",
    text: "Detectá en qué se te va la plata con gráficos claros y simples.",
  },
];

export function DashboardPreview() {
  return (
    <Section id="producto">
      <Reveal>
        <SectionHeading
          eyebrow="El producto"
          title="Entendé tus finanzas de un vistazo."
          description="Balance total, ingresos y gastos del mes, comparación con el mes anterior y gráficos: apenas entrás, ya sabés cómo estás parado."
        />
      </Reveal>

      <Reveal delay={100} className="mx-auto mt-12 max-w-5xl">
        <DashboardMock />
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
        {highlights.map((item, index) => (
          <Reveal key={item.label} delay={index * 75}>
            <div className="flex h-full items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <item.icon className="size-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{item.label}</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {item.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150}>
        <div className="mt-10 text-center">
          <CtaButton href="/registro" variant="primary" size="lg">
            Probalo gratis
          </CtaButton>
        </div>
      </Reveal>
    </Section>
  );
}
