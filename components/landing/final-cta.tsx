import { CtaButton, Reveal, Section } from "./ui";

export function FinalCta() {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent px-6 py-16 text-center sm:px-16 dark:from-emerald-500/15">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-emerald-500/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -bottom-20 size-64 rounded-full bg-emerald-500/10 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Empezá a ordenar tus finanzas hoy.
            </h2>
            <p className="mt-4 text-zinc-500 sm:text-lg dark:text-zinc-400">
              Creá tu cuenta gratis y empezá a tener una visión más clara de tu
              dinero.
            </p>
            <div className="mt-8">
              <CtaButton href="/registro" size="lg">
                Empezar gratis
              </CtaButton>
            </div>
            <p className="mt-4 text-xs text-zinc-400">
              Gratis para siempre · Sin tarjeta
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
