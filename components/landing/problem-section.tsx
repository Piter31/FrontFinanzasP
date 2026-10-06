import { ArrowDown } from "lucide-react";
import { problemItems } from "@/lib/landing/data";
import { Reveal, Section, SectionHeading } from "./ui";

export function ProblemSection() {
  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow="El problema"
          title="¿Sabés realmente a dónde se va tu dinero?"
          description="A fin de mes la plata desaparece y no queda claro en qué. No es falta de voluntad: es falta de visibilidad."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {problemItems.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === problemItems.length - 1;
          return (
            <Reveal
              key={item.text}
              delay={index * 80}
              className={`h-full ${isLast ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="flex h-full items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-500/10 text-zinc-500 dark:text-zinc-400">
                  <Icon className="size-4" />
                </span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {item.text}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={200} className="mt-12 text-center">
        <p className="text-base text-zinc-500 sm:text-lg dark:text-zinc-400">
          Si te suena familiar, no estás solo.{" "}
          <span className="font-semibold text-emerald-500">
            Y tiene solución.
          </span>
        </p>
        <ArrowDown
          aria-hidden
          className="mx-auto mt-4 size-5 text-zinc-300 dark:text-zinc-600"
        />
      </Reveal>
    </Section>
  );
}
