import { DashboardMock } from "./dashboard-mock";
import { Badge, CtaButton, Reveal } from "./ui";

export function Hero() {
  return (
    <section id="inicio" className="relative scroll-mt-24 overflow-hidden">
      {/* Fondo decorativo: gradiente emerald muy tenue */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.08),transparent_75%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_75%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-24">
        <Reveal>
          <Badge tone="emerald">Gratis para empezar · Sin tarjeta</Badge>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-100">
            Tomá el control de tus{" "}
            <span className="text-emerald-500">finanzas personales</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 sm:text-xl dark:text-zinc-400">
            Registrá tus ingresos y gastos, entendé en qué se va tu dinero y
            empezá a tomar mejores decisiones. Simple, claro y sin planillas
            complicadas.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton href="/registro" size="lg">
              Empezar gratis
            </CtaButton>
            <CtaButton href="#planes" variant="secondary" size="lg">
              Ver planes
            </CtaButton>
          </div>
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
            Gratis para siempre · Sin tarjeta · Listo en 2 minutos
          </p>
        </Reveal>

        {/* Mock del dashboard: protagonista visual */}
        <Reveal delay={300} className="relative mt-14 sm:mx-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 top-10 -bottom-6 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15"
          />
          <div className="relative">
            <DashboardMock />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
