import { benefitItems } from "@/lib/landing/data";
import { Reveal, Section, SectionHeading } from "./ui";

export function BenefitsSection() {
  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow="El cambio"
          title="Pasá de simplemente registrar tus gastos a entender tus finanzas."
          description="FinanzasP no promete hacerte rico: te da la visibilidad y el orden para tomar mejores decisiones, mes a mes."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefitItems.map((item, index) => (
          <Reveal
            key={item.title}
            delay={(index % 3) * 75}
            className="h-full"
          >
            <article className="h-full rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {item.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
