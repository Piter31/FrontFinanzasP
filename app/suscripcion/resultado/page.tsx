"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CircleCheck, Clock, LoaderCircle, LogIn } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PLAN_LABELS, type Plan, type SubscriptionStatus } from "@/lib/plans";

const MAX_INTENTOS = 6;
const INTERVALO_MS = 2500;

interface SubscriptionSnapshot {
  plan: Plan;
  effectiveStatus: SubscriptionStatus;
}

type ViewState = "confirmando" | "activa" | "pendiente";

/**
 * Página de retorno del checkout de Mercado Pago (back_url).
 * La activación real la confirma el webhook de MP, no esta pantalla: por eso
 * se consulta /subscription/me algunas veces hasta que el estado efectivo
 * pase a ACTIVE.
 */
export default function SuscripcionResultadoPage() {
  const { user, token, loading } = useAuth();
  const [state, setState] = useState<ViewState>("confirmando");
  const [plan, setPlan] = useState<Plan | null>(null);
  const intentos = useRef(0);

  useEffect(() => {
    if (loading || !token) return;
    let cancelado = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      intentos.current += 1;
      try {
        const me = await api<SubscriptionSnapshot>("/subscription/me", {
          token,
        });
        if (cancelado) return;
        if (me.effectiveStatus === "ACTIVE") {
          setPlan(me.plan);
          setState("activa");
          return;
        }
      } catch {
        // Un fallo puntual no corta los reintentos.
      }
      if (!cancelado) {
        if (intentos.current < MAX_INTENTOS) {
          timer = setTimeout(() => void poll(), INTERVALO_MS);
        } else {
          setState("pendiente");
        }
      }
    };

    void poll();
    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [loading, token]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center p-4">
        <LoaderCircle className="size-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <LogIn className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight">
            Volviste de Mercado Pago
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Iniciá sesión para ver el estado de tu suscripción.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        {state === "confirmando" && (
          <>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
              <LoaderCircle className="size-6 animate-spin" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight">
              Confirmando tu pago…
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Estamos esperando la confirmación de Mercado Pago. Suele tardar
              unos segundos.
            </p>
          </>
        )}

        {state === "activa" && (
          <>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
              <CircleCheck className="size-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight">
              ¡Suscripción activada!
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Tu plan{plan ? ` ${PLAN_LABELS[plan]}` : ""} ya está activo.
              Gracias por suscribirte a FinanzasP.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Ir al dashboard
            </Link>
          </>
        )}

        {state === "pendiente" && (
          <>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-500">
              <Clock className="size-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight">
              Pago en proceso de confirmación
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Mercado Pago todavía está procesando tu pago. Cuando se
              acredite, tu acceso se activa automáticamente: no necesitás
              hacer nada más.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Reintentar
            </button>
            <Link
              href="/"
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
