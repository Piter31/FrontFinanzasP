import { api } from "./api";
import type { Plan } from "./plans";

export type BillingPeriod = "monthly" | "yearly";

export interface CheckoutResponse {
  initPoint: string;
  preapprovalId: string;
  amountUsd: number;
  amountArs: number;
  reused: boolean;
}

export interface MySubscription {
  plan: Plan;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
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
