"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { Card } from "./card";
import { useAuth } from "@/lib/auth-context";
import { getMySubscription, type MySubscription } from "@/lib/payments";
import { effectiveStatus, PLAN_LABELS, trialDaysLeft } from "@/lib/plans";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Panel "Mi suscripción": plan, estado, próximo cobro y medio de pago. */
export function SubscriptionCard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<MySubscription | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getMySubscription(token)
      .then(setData)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar tu suscripción.",
        ),
      );
  }, [token]);

  if (!user) return null;

  const status = effectiveStatus(user);
  const trial = trialDaysLeft(user);
  const statusText: Record<string, string> = {
    TRIALING: `Prueba gratis${trial != null ? ` · quedan ${trial} días` : ""}`,
    ACTIVE: "Activa",
    PAST_DUE: "Pago rechazado · Mercado Pago lo reintenta",
    CANCELED: "Cancelada · tenés acceso hasta el fin del período pago",
    EXPIRED: "Vencida",
  };
  const proximoCobro =
    data?.mercadoPago?.nextPaymentDate ?? user.currentPeriodEnd;
  const showBilling = status === "ACTIVE" || status === "PAST_DUE";

  return (
    <Card className="divide-y divide-zinc-200 dark:divide-zinc-800">
      <div className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium">Mi suscripción</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Plan {PLAN_LABELS[user.plan]} · {statusText[status]}
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
                : "Atención"}
        </span>
      </div>

      {showBilling && (
        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-medium">Próximo cobro</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(proximoCobro)}
              {data?.mercadoPago?.amount != null &&
                ` · AR$ ${data.mercadoPago.amount.toLocaleString("es-AR")}`}
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

      <div className="p-5">
        <Link
          href="/#planes"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          {status === "ACTIVE" ? "Ver planes" : "Elegir un plan"}
        </Link>
        {status === "ACTIVE" && (
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            El cambio de plan y la cancelación online llegan próximamente.
          </p>
        )}
      </div>
    </Card>
  );
}
