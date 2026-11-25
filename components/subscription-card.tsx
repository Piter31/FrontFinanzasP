"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CreditCard, LoaderCircle } from "lucide-react";
import { Card } from "./card";
import { useAuth } from "@/lib/auth-context";
import {
  cancelSubscription,
  changePlan,
  getMySubscription,
  type BillingPeriod,
  type MySubscription,
} from "@/lib/payments";
import { formatPlanPrice, pricingPlans } from "@/lib/landing/data";
import {
  effectiveStatus,
  PLAN_LABELS,
  PLAN_ORDER,
  trialDaysLeft,
  type Plan,
} from "@/lib/plans";

/** Precio pago en USD de cada plan, tomado de la landing (Básico = precio post-trial). */
const PLAN_PRICES_USD = Object.fromEntries(
  pricingPlans.map((p) => [
    p.id.toUpperCase(),
    p.priceAfterTrial ?? p.price,
  ]),
) as Record<Plan, Record<BillingPeriod, number>>;

const ALL_PLANS: Plan[] = ["FREE", "PLUS", "PRO"];

/** Planes todavía no disponibles: el botón se ve pero no hace nada. */
const COMING_SOON_PLANS = new Set(
  pricingPlans.filter((p) => p.comingSoon).map((p) => p.id.toUpperCase() as Plan),
);

const COMING_SOON_CLASS =
  "rounded-xl border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-400 cursor-not-allowed dark:border-zinc-700 dark:text-zinc-500";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function planButtonClass(selected: boolean): string {
  return `rounded-xl border px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
    selected
      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800/60"
  }`;
}

function formatArs(amount: number): string {
  return `AR$ ${amount.toLocaleString("es-AR")}`;
}

type Pending =
  | { kind: "change"; plan: Plan; period: BillingPeriod }
  | { kind: "cancel" }
  | null;

const PERIOD_UNIT: Record<BillingPeriod, string> = { monthly: "mes", yearly: "año" };

/**
 * Panel "Mi suscripción": plan, estado, próximo cobro, medio de pago,
 * cambio de plan y baja de la suscripción de Mercado Pago.
 */
export function SubscriptionCard() {
  const { user, token, refreshUser } = useAuth();
  const [data, setData] = useState<MySubscription | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Pending>(null);
  const [working, setWorking] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setData(await getMySubscription(token));
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar tu suscripción.",
      );
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user) return null;

  const status = effectiveStatus(user);
  const trial = trialDaysLeft(user);
  const statusText: Record<string, string> = {
    TRIALING: `Prueba gratis${trial != null ? ` · quedan ${trial} días` : ""}`,
    ACTIVE: "Activa",
    PAST_DUE: "Pago rechazado · Mercado Pago lo reintenta",
    CANCELED: `Cancelada · acceso hasta el ${formatDate(user.currentPeriodEnd)}`,
    EXPIRED: "Vencida",
  };
  const proximoCobro =
    data?.mercadoPago?.nextPaymentDate ?? user.currentPeriodEnd;
  const showBilling = status === "ACTIVE" || status === "PAST_DUE";
  const canManage = !!data?.canManage && showBilling;
  const period = data?.period ?? "monthly";
  const periodLabel = PERIOD_UNIT[period];
  const otherPeriod: BillingPeriod = period === "monthly" ? "yearly" : "monthly";
  const pendingPeriodChange =
    pending?.kind === "change" && pending.period !== period;

  const confirm = async () => {
    if (!token || !pending || working) return;
    setWorking(true);
    setActionError("");
    try {
      if (pending.kind === "change") {
        const res = await changePlan(pending.plan, pending.period, token);
        if (res.requiresCheckout) {
          // Cambio de período: se autoriza la suscripción nueva en MP y al
          // volver la página de resultado confirma el cambio.
          window.location.href = res.initPoint;
          return;
        }
        setNotice(
          `¡Listo! Ya tenés el plan ${PLAN_LABELS[res.plan]}. ` +
            `Desde el próximo cobro${res.effectiveFrom ? ` (${formatDate(res.effectiveFrom)})` : ""} ` +
            `vas a pagar ${formatArs(res.amountArs)} por ${periodLabel}.`,
        );
      } else {
        const res = await cancelSubscription(token);
        setNotice(
          `Cancelaste tu suscripción. Mercado Pago no te va a cobrar más y ` +
            `seguís teniendo acceso hasta el ${formatDate(res.accessUntil)}.`,
        );
      }
      setPending(null);
      await Promise.all([refreshUser(), load()]);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "No se pudo completar la operación.",
      );
    } finally {
      setWorking(false);
    }
  };

  return (
    <Card className="divide-y divide-zinc-200 dark:divide-zinc-800">
      <div className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium">Mi suscripción</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Plan {PLAN_LABELS[user.plan]}
            {data?.period && ` ${data.period === "monthly" ? "mensual" : "anual"}`}{" "}
            · {statusText[status]}
          </p>
          {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-500"
              : status === "TRIALING"
                ? "bg-sky-500/10 text-sky-500"
                : "bg-amber-500/10 text-amber-500"
          }`}
        >
          {status === "ACTIVE"
            ? "Activa"
            : status === "TRIALING"
              ? "En prueba"
              : status === "EXPIRED"
                ? "Vencida"
                : status === "CANCELED"
                  ? "Cancelada"
                  : "Pago rechazado"}
        </span>
      </div>

      {status === "PAST_DUE" && (
        <div className="flex gap-3 bg-amber-500/5 p-5 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4 shrink-0" />
          <p>
            No pudimos cobrar tu última cuota. Mercado Pago la reintenta
            automáticamente hasta 4 veces en los próximos 10 días: revisá que
            tu medio de pago tenga fondos o actualizalo desde tu cuenta de
            Mercado Pago. Mantenés el acceso hasta el{" "}
            {formatDate(user.currentPeriodEnd)}.
          </p>
        </div>
      )}

      {status === "CANCELED" && (
        <div className="p-5 text-xs text-zinc-500 dark:text-zinc-400">
          Tu suscripción no se renueva: no se te va a cobrar nada más. Podés
          seguir usando FinanzasP hasta el {formatDate(user.currentPeriodEnd)}.
          Si te suscribís de nuevo, el plan elegido se activa en el momento y
          el primer cobro recién se hace el{" "}
          {formatDate(user.currentPeriodEnd)}: no perdés los días que ya
          pagaste.
        </div>
      )}

      {showBilling && (
        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-medium">Próximo cobro</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(proximoCobro)}
              {data?.mercadoPago?.amount != null &&
                ` · ${formatArs(data.mercadoPago.amount)}`}
            </p>
          </div>
          {data?.mercadoPago?.paymentMethodId && (
            <span className="flex shrink-0 items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <CreditCard className="size-4" />
              {data.mercadoPago.paymentMethodId}
            </span>
          )}
        </div>
      )}

      {canManage && (
        <div className="space-y-3 p-5">
          <div>
            <p className="text-sm font-medium">Cambiar de plan</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              El plan nuevo se activa en el momento; el precio nuevo se cobra
              desde el próximo período.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_PLANS.filter((p) => p !== user.plan).map((p) => (
              <button
                key={p}
                type="button"
                disabled={working}
                aria-disabled={COMING_SOON_PLANS.has(p) || undefined}
                onClick={() => {
                  if (COMING_SOON_PLANS.has(p)) return;
                  setActionError("");
                  setNotice("");
                  setPending({ kind: "change", plan: p, period });
                }}
                className={
                  COMING_SOON_PLANS.has(p)
                    ? COMING_SOON_CLASS
                    : planButtonClass(
                        pending?.kind === "change" &&
                          pending.plan === p &&
                          pending.period === period,
                      )
                }
              >
                {PLAN_ORDER[p] > PLAN_ORDER[user.plan] ? "Subir a" : "Bajar a"}{" "}
                {PLAN_LABELS[p]} · {formatPlanPrice(PLAN_PRICES_USD[p][period])}/
                {periodLabel}
                {COMING_SOON_PLANS.has(p) && " (Muy pronto)"}
              </button>
            ))}
          </div>
          <div className="pt-2">
            <p className="text-sm font-medium">
              Pasar a facturación {otherPeriod === "yearly" ? "anual" : "mensual"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Autorizás una suscripción nueva en Mercado Pago. No se cobra nada
              hasta que termine lo que ya pagaste
              {proximoCobro ? ` (${formatDate(proximoCobro)})` : ""}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_PLANS.map((p) => (
              <button
                key={p}
                type="button"
                disabled={working}
                aria-disabled={COMING_SOON_PLANS.has(p) || undefined}
                onClick={() => {
                  if (COMING_SOON_PLANS.has(p)) return;
                  setActionError("");
                  setNotice("");
                  setPending({ kind: "change", plan: p, period: otherPeriod });
                }}
                className={
                  COMING_SOON_PLANS.has(p)
                    ? COMING_SOON_CLASS
                    : planButtonClass(
                        pending?.kind === "change" &&
                          pending.plan === p &&
                          pending.period === otherPeriod,
                      )
                }
              >
                {PLAN_LABELS[p]} {otherPeriod === "yearly" ? "anual" : "mensual"} ·{" "}
                {formatPlanPrice(PLAN_PRICES_USD[p][otherPeriod])}/
                {PERIOD_UNIT[otherPeriod]}
                {COMING_SOON_PLANS.has(p) && " (Muy pronto)"}
              </button>
            ))}
          </div>
        </div>
      )}

      {pending && (
        <div className="space-y-3 bg-zinc-50 p-5 dark:bg-zinc-900/60">
          {pending.kind === "change" && pendingPeriodChange ? (
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Vas a pasar al plan <strong>{PLAN_LABELS[pending.plan]}</strong>{" "}
              con facturación{" "}
              <strong>{pending.period === "yearly" ? "anual" : "mensual"}</strong>
              . Te llevamos a Mercado Pago para autorizar la suscripción nueva:
              el primer cobro de{" "}
              {formatPlanPrice(PLAN_PRICES_USD[pending.plan][pending.period])} por{" "}
              {PERIOD_UNIT[pending.period]} (en pesos al tipo de cambio del día)
              se hace el {formatDate(proximoCobro)}, cuando termina lo que ya
              pagaste. Al autorizarla se da de baja tu suscripción actual y el
              plan nuevo se activa en el momento. Si no completás el pago en
              Mercado Pago, todo sigue como está.
            </p>
          ) : pending.kind === "change" ? (
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Vas a pasar del plan <strong>{PLAN_LABELS[user.plan]}</strong> al{" "}
              <strong>{PLAN_LABELS[pending.plan]}</strong>. El cambio es
              inmediato
              {PLAN_ORDER[pending.plan] < PLAN_ORDER[user.plan] &&
                " (perdés en el momento las funciones del plan actual que el nuevo no incluye)"}
              . Desde el próximo cobro ({formatDate(proximoCobro)}) vas a pagar{" "}
              {formatPlanPrice(PLAN_PRICES_USD[pending.plan][period])} por{" "}
              {periodLabel}, convertidos a pesos al tipo de cambio del día. Lo
              ya pagado de este período no se reintegra ni se cobra diferencia.
            </p>
          ) : (
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              ¿Seguro que querés cancelar? Mercado Pago deja de cobrarte y
              conservás el acceso hasta el {formatDate(proximoCobro)}. Lo ya
              pagado no se reintegra. La cancelación no se puede deshacer:
              para volver vas a tener que suscribirte de nuevo.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void confirm()}
              disabled={working}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-60 ${
                pending.kind === "cancel"
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {working && <LoaderCircle className="size-4 animate-spin" />}
              {pending.kind === "cancel"
                ? "Sí, cancelar suscripción"
                : pendingPeriodChange
                  ? "Ir a Mercado Pago"
                  : `Confirmar cambio a ${PLAN_LABELS[pending.plan]}`}
            </button>
            <button
              type="button"
              onClick={() => setPending(null)}
              disabled={working}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              Volver
            </button>
          </div>
          {actionError && (
            <p className="text-xs text-rose-500">{actionError}</p>
          )}
        </div>
      )}

      {notice && (
        <div className="p-5 text-xs text-emerald-600 dark:text-emerald-400">
          {notice}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 p-5">
        <Link
          href="/#planes"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          {status === "ACTIVE" || status === "PAST_DUE"
            ? "Ver planes"
            : status === "CANCELED"
              ? "Volver a suscribirme"
              : "Elegir un plan"}
        </Link>
        {canManage && !pending && (
          <button
            type="button"
            onClick={() => {
              setActionError("");
              setNotice("");
              setPending({ kind: "cancel" });
            }}
            className="text-sm font-medium text-rose-500 hover:text-rose-600"
          >
            Cancelar suscripción
          </button>
        )}
      </div>
    </Card>
  );
}
