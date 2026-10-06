"use client";

/**
 * Espejo mínimo del sistema de planes del backend (backend/src/plans).
 * Sirve para mostrar/ocultar UI según el plan del usuario sin esperar
 * una respuesta del servidor; la autorización real la hace el backend.
 */

export type Plan = "FREE" | "PLUS" | "PRO";

export type SubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED";

export const PLAN_ORDER: Record<Plan, number> = { FREE: 0, PLUS: 1, PRO: 2 };

export const PLAN_LABELS: Record<Plan, string> = {
  FREE: "Gratis",
  PLUS: "Plus",
  PRO: "Pro",
};

export function planMeets(plan: Plan, required: Plan): boolean {
  return PLAN_ORDER[plan] >= PLAN_ORDER[required];
}

interface SubscriptionDates {
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

/** Misma regla que PlansService.getEffectiveStatus del backend. */
export function effectiveStatus(user: SubscriptionDates): SubscriptionStatus {
  const now = Date.now();
  switch (user.subscriptionStatus) {
    case "TRIALING":
      return user.trialEndsAt && new Date(user.trialEndsAt).getTime() > now
        ? "TRIALING"
        : "EXPIRED";
    case "ACTIVE":
    case "PAST_DUE":
    case "CANCELED":
      return !user.currentPeriodEnd ||
        new Date(user.currentPeriodEnd).getTime() > now
        ? user.subscriptionStatus
        : "EXPIRED";
    default:
      return "EXPIRED";
  }
}

export function trialDaysLeft(user: SubscriptionDates): number | null {
  if (user.subscriptionStatus !== "TRIALING" || !user.trialEndsAt) return null;
  const ms = new Date(user.trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
