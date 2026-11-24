import { api } from "./api";
import type { Plan } from "./plans";

export type BillingPeriod = "monthly" | "yearly";

export interface CheckoutResponse {
  initPoint: string;
  preapprovalId: string;
  amountUsd: number;
  amountArs: number;
  reused: boolean;
  /** Fecha del primer cobro si se difirió (volver a suscribirse con días pagos). */
  startsAt: string | null;
}

export interface MySubscription {
  plan: Plan;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
  /** Período facturado en Mercado Pago (null sin suscripción vinculada). */
  period: BillingPeriod | null;
  /** true si hay una suscripción autorizada: habilita cambio de plan y baja. */
  canManage: boolean;
  mercadoPago: {
    status: string | null;
    nextPaymentDate: string | null;
    paymentMethodId: string | null;
    amount: number | null;
  } | null;
}

/**
 * Crea la suscripción en Mercado Pago y redirige al checkout hosted de MP.
 * La activación la confirma el webhook; al volver, el usuario cae en
 * /suscripcion/resultado (back_url configurada en el backend).
 */
export async function startCheckout(
  plan: Plan,
  period: BillingPeriod,
  token: string,
): Promise<void> {
  const res = await api<CheckoutResponse>("/payments/checkout", {
    method: "POST",
    body: JSON.stringify({ plan, period }),
    token,
  });
  window.location.href = res.initPoint;
}

/** Estado de la suscripción y del cobro en MP para la pantalla Mi suscripción. */
export function getMySubscription(token: string): Promise<MySubscription> {
  return api<MySubscription>("/payments/me", { token });
}

interface ChangePlanBase {
  plan: Plan;
  period: BillingPeriod;
  amountUsd: number;
  amountArs: number;
  previousAmountArs: number | null;
  /** Fecha del próximo cobro, desde la que rige el monto nuevo. */
  effectiveFrom: string | null;
}

/**
 * Mismo período: el cambio ya quedó aplicado. Cambio de período (mensual ↔
 * anual): hay que autorizar una suscripción nueva en Mercado Pago
 * (initPoint); el primer cobro es en effectiveFrom y, al autorizarla, se da
 * de baja la anterior.
 */
export type ChangePlanResponse =
  | (ChangePlanBase & { requiresCheckout: false })
  | (ChangePlanBase & {
      requiresCheckout: true;
      initPoint: string;
      preapprovalId: string;
      reused: boolean;
    });

/**
 * Cambia el plan de la suscripción vigente. Con el mismo período el acceso
 * al plan nuevo es inmediato y el monto nuevo se cobra desde el próximo
 * período; con otro período devuelve el checkout de MP a autorizar.
 */
export function changePlan(
  plan: Plan,
  period: BillingPeriod,
  token: string,
): Promise<ChangePlanResponse> {
  return api<ChangePlanResponse>("/payments/change-plan", {
    method: "POST",
    body: JSON.stringify({ plan, period }),
    token,
  });
}

/** Da de baja la suscripción: el acceso sigue hasta el fin del período pago. */
export function cancelSubscription(
  token: string,
): Promise<{ subscriptionStatus: string; accessUntil: string | null }> {
  return api("/payments/cancel", { method: "POST", token });
}
