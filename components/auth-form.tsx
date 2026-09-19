"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:placeholder:text-zinc-500";

export function AuthForm({ mode }: { mode: "login" | "registro" }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isLogin && name.trim().length < 2) {
      return setError("Ingresa tu nombre.");
    }
    if (password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }
    setSubmitting(true);
    try {
      if (isLogin) await login(email.trim(), password);
      else await register(name.trim(), email.trim(), password);
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

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <Wallet className="size-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">FinanzasP</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isLogin
              ? "Inicia sesión para ver tu panel de finanzas personales"
              : "Crea tu cuenta para empezar"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="text-lg font-semibold">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          <div className="mt-5 space-y-4">
            {!isLogin && (
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Nombre
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  maxLength={80}
                  className={inputClass}
                />
              </label>
            )}

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

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Contraseña
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
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

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Un momento…"
                : isLogin
                  ? "Entrar"
                  : "Registrarme"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{" "}
              <Link
                href="/registro"
                className="font-medium text-emerald-500 hover:underline"
              >
                Crea una aquí
              </Link>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-500 hover:underline"
              >
                Inicia sesión
              </Link>
            </>
          )}
        </p>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {isLogin
              ? "Versión Beta 0.1"
              : "Versión Beta 0.1"}
          </p>
      </div>
    </div>
  );
}
