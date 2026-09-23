import { roadmapItems } from "@/lib/landing/data";
import { Badge, Reveal, Section, SectionHeading } from "./ui";

export function RoadmapSection() {
  return (
    <Section id="roadmap">
      <Reveal>
        <SectionHeading
          eyebrow="Roadmap"
          title="Esto recién empieza"
          description="FinanzasP sigue creciendo: estas son algunas de las herramientas que estamos incorporando."
        />
      </Reveal>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roadmapItems.map((item, index) => (
          <Reveal
            key={item.title}
            delay={(index % 3) * 75}
            className="h-full"
          >
            <div className="flex h-full items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-zinc-500/10 text-zinc-500 dark:text-zinc-400">
                <item.icon className="size-4" />
              </span>
              <h3 className="text-sm font-medium">{item.title}</h3>
              <span className="ml-auto shrink-0">
                <Badge tone="amber">Próximamente</Badge>
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150}>
        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          ¿Tenés una sugerencia? Contanos desde el buzón de sugerencias dentro
          de la app.
        </p>
      </Reveal>
    </Section>
  );
}
