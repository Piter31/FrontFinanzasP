"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Section: contenedor de sección con ancla y ancho máximo
// ---------------------------------------------------------------------------

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SectionHeading: eyebrow + título + descripción
// ---------------------------------------------------------------------------

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CtaButton: link estilado como botón
// ---------------------------------------------------------------------------

const ctaBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors";

const ctaVariants = {
  primary:
    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600",
  secondary:
    "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800/60",
  ghost: "text-zinc-600 hover:text-emerald-500 dark:text-zinc-300",
} as const;

const ctaSizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
} as const;

export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof ctaVariants;
  size?: keyof typeof ctaSizes;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${ctaBase} ${ctaVariants[variant]} ${ctaSizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Reveal: anima la entrada al hacer scroll (una sola vez)
// ---------------------------------------------------------------------------

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge: pill chico de estado / etiqueta
// ---------------------------------------------------------------------------

const badgeTones = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  zinc: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400",
} as const;

export function Badge({
  children,
  tone = "emerald",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}
