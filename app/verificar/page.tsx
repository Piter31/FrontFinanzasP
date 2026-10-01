"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:placeholder:text-zinc-500";

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailForm() {
  const { verifyEmail, resendCode } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) {
      return setError("El código debe tener 6 dígitos.");
    }
    setSubmitting(true);
    try {
      await verifyEmail(email, code);
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Ocurrió un error. Inténtalo de nuevo.",
      );
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    setResending(true);
    try {
      await resendCode(email);
      setNotice("Te enviamos un nuevo código. Revisa tu bandeja de entrada.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Ocurrió un error. Inténtalo de nuevo.",
      );
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="grid min-h-screen place-items-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Falta el correo a verificar. Regístrate nuevamente para recibir un
            código.
          </p>
          <Link
            href="/registro"
            className="mt-4 inline-block font-medium text-emerald-500 hover:underline"
          >
            Ir al registro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <Wallet className="size-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">FinanzasP</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Verifica tu correo para terminar de crear tu cuenta
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start gap-3">
            <MailCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enviamos un código de 6 dígitos a{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {email}
              </span>
              . Vence en 10 minutos.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Código de verificación
              </span>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className={`${inputClass} text-center text-lg tracking-[0.5em]`}
              />
            </label>

            {error && <p className="text-sm text-rose-500">{error}</p>}
            {notice && <p className="text-sm text-emerald-500">{notice}</p>}

            <button
              type="submit"
              disabled={submitting || code.length !== 6}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Verificando…" : "Verificar y crear cuenta"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="w-full text-sm font-medium text-emerald-500 transition-colors hover:underline disabled:cursor-not-allowed disabled:text-zinc-400 disabled:no-underline"
            >
              {cooldown > 0
                ? `Reenviar código (${cooldown}s)`
                : resending
                  ? "Enviando…"
                  : "Reenviar código"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          ¿Te equivocaste de correo?{" "}
          <Link
            href="/registro"
            className="font-medium text-emerald-500 hover:underline"
          >
            Volver al registro
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerificarPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
