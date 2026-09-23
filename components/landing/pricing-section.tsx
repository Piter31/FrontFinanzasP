"use client";

import { useState } from "react";
import { Check, Clock } from "lucide-react";
import {
  checkoutHref,
  formatPlanPrice,
  pricingPlans,
  type BillingPeriod,
  type PricingPlan,
} from "@/lib/landing/data";
import {
  Badge,
  CtaButton,
  Reveal,
  Section,
  SectionHeading,
} from "@/components/landing/ui";

function BillingToggle({
  period,
  onChange,
}: {
  period: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}) {
  const base = "rounded-lg px-4 py-2 text-sm font-semibold transition-colors";
  return (
    <div className="mt-8 flex justify-center">
      <div className="inline-flex rounded-xl border border-zinc-200 p-1 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          aria-pressed={period === "monthly"}
          className={`${base} ${
            period === "monthly"
              ? "bg-emerald-500 text-white"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Mensual
        </button>
        <button
          type="button"
          onClick={() => onChange("yearly")}
          aria-pressed={period === "yearly"}
          className={`${base} flex items-center gap-2 ${
            period === "yearly"
              ? "bg-emerald-500 text-white"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Anual
          <Badge tone={period === "yearly" ? "zinc" : "emerald"}>
            2 meses gratis
          </Badge>
        </button>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  period,
}: {
  plan: PricingPlan;
  period: BillingPeriod;
}) {
  const isFree = plan.id === "free";
  const price = plan.price[period];
  const suffix = isFree || period === "monthly" ? "/mes" : "/año";

  return (
    <article
      className={`relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ${
        plan.highlighted
          ? "border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500 lg:scale-[1.03]"
          : ""
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold whitespace-nowrap text-white">
          {plan.badge}
        </span>
      )}

      <h3 className="text-lg font-bold">{plan.name}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {plan.tagline}
      </p>

      <p className="mt-4">
        <span className="text-4xl font-bold tracking-tight">
          {formatPlanPrice(price)}
        </span>
        <span className="ml-1 text-sm text-zinc-500 dark:text-zinc-400">
          {suffix}
        </span>
      </p>
      {period === "yearly" && price > 0 && (
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
          equivale a {formatPlanPrice(plan.price.yearly / 12)}/mes
        </p>
      )}

      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2">
            {feature.availability === "available" ? (
              <>
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{feature.label}</span>
              </>
            ) : (
              <>
                <Clock className="mt-0.5 size-4 shrink-0 text-zinc-400" />
                <span className="text-zinc-400">{feature.label}</span>
                <Badge tone="amber">Próximamente</Badge>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <CtaButton
          href={checkoutHref(plan.id, period)}
          variant={plan.highlighted ? "primary" : "secondary"}
          className="w-full"
        >
          {plan.ctaLabel}
        </CtaButton>
      </div>
    </article>
  );
}

export function PricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <Section id="planes">
      <Reveal>
        <SectionHeading
          eyebrow="Planes"
          title="Elegí el plan que mejor se adapte a vos"
          description="Empezá gratis y actualizá cuando quieras más control y análisis. Sin permanencia."
        />
      </Reveal>

      <Reveal delay={100}>
        <BillingToggle period={period} onChange={setPeriod} />
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <Reveal key={plan.id} delay={index * 120} className="h-full">
            <PlanCard plan={plan} period={period} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-zinc-400 dark:text-zinc-500">
          Los pagos online se habilitan próximamente. Creá tu cuenta gratis hoy
          y vas a poder actualizar tu plan cuando estén disponibles.
        </p>
      </Reveal>
    </Section>
  );
}
