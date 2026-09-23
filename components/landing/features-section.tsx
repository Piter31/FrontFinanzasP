import { featureCards } from "@/lib/landing/data";
import { Badge, Reveal, Section, SectionHeading } from "./ui";

export function FeaturesSection() {
  return (
    <Section id="caracteristicas">
      <Reveal>
        <SectionHeading
          eyebrow="Características"
          title="Todo lo que necesitás para organizar tus finanzas, en un solo lugar."
          description="Desde registrar un gasto hasta planificar tu ahorro: cada herramienta está pensada para darte claridad."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featureCards.map((feature, index) => (
          <Reveal key={feature.title} delay={(index % 4) * 75}>
            <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {feature.description}
              </p>
              <div className="mt-4 pt-1">
                <Badge tone={feature.planLabel === "Plus" ? "emerald" : "zinc"}>
                  {feature.planLabel}
                </Badge>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150}>
        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Las funciones marcadas Plus se incluyen en el plan Plus y superiores.
        </p>
      </Reveal>
    </Section>
  );
}
