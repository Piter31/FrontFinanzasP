"use client";

import { Suspense, useEffect, useState} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound, MailCheck, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:placeholder:text-zinc-500";

const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Recuperación de contraseña en dos pasos:
 * 1) "email": pide el correo y dispara el envío del código de 6 dígitos.
 * 2) "reset": valida el código y guarda la nueva contraseña.
 */
function RecoverPasswordForm() {
  const { forgotPassword, resetPassword } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  // El paso inicial es "email", salvo que llegue ?step=reset con el correo en la URL.
  const [step, setStep] = useState<"email" | "reset">(
    params.get("step") === "reset" ? "reset" : "email",
  );
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cuenta regresiva del botón de reenvío de código.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  /** Paso 1: envía el código de recuperación al correo ingresado. */
  const handleSendCode = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      // El backend responde igual exista o no la cuenta: avisamos de forma genérica
      // y pasamos al paso 2 igualmente (si el correo no existe, el código no validará).
      setNotice(
        "Si el correo corresponde a una cuenta, te enviamos un código de 6 dígitos.",
      );
      setStep("reset");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Ocurrió un error. Inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /** Paso 2: valida el código y guarda la nueva contraseña. */
  const handleReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) {
      return setError("El código debe tener 6 dígitos.");
    }
    if (newPassword.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }
    setSubmitting(true);
    try {
      await resetPassword(email.trim(), code, newPassword);
      router.replace("/login?recuperada=1");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Ocurrió un error. Inténtalo de nuevo.",
      );
      setSubmitting(false);
    }
  };

  /** Reenvía el código respetando el cooldown del backend (60 s). */
  const handleResend = async () => {
    setError("");
    setNotice("");
    setResending(true);
    try {
      await forgotPassword(email.trim());
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

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <Wallet className="size-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">FinanzasP</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {step === "email"
              ? "Recupera el acceso a tu cuenta"
              : "Elige tu nueva contraseña"}
          </p>
        </div>

        {step === "email" ? (
          <form
            onSubmit={handleSendCode}
            className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Ingresa el correo de tu cuenta y te enviaremos un código para
                restablecer tu contraseña.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Correo electrónico
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </label>

              {error && <p className="text-sm text-rose-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Enviando…" : "Enviar código"}
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleReset}
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
                  Código de recuperación
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

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Nueva contraseña
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Repetir contraseña
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  autoComplete="new-password"
                  className={inputClass}
                />
              </label>

              {error && <p className="text-sm text-rose-500">{error}</p>}
              {notice && <p className="text-sm text-emerald-500">{notice}</p>}

              <button
                type="submit"
                disabled={submitting || code.length !== 6}
                className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Guardando…" : "Restablecer contraseña"}
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
        )}

        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          ¿Ya la recordaste?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-500 hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RecuperarPage() {
  return (
    <Suspense>
      <RecoverPasswordForm />
    </Suspense>
  );
}
