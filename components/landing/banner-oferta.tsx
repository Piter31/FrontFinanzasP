"use client";

import { Clock, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { launchOffer } from "@/lib/landing/data";

// ---------------------------------------------------------------------------
// Cuenta regresiva (solo en cliente para evitar diferencias de hidratación)
// ---------------------------------------------------------------------------

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getRemaining(target: number): CountdownParts {
  const totalSeconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function useCountdown(endsAt: string): CountdownParts | null {
  const target = new Date(endsAt).getTime();
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    setParts(getRemaining(target));
    const id = setInterval(() => setParts(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}

const pad = (n: number) => String(n).padStart(2, "0");

// ---------------------------------------------------------------------------
// Piezas visuales compartidas
// ---------------------------------------------------------------------------

/** Barrido de brillo que cruza la barra cada pocos segundos. */
function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-1/4 animate-[banner-shine_3.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"
    />
  );
}

/** Versión compacta: "60d 23:59:59". */
function CountdownCompact() {
  const parts = useCountdown(launchOffer.endsAt);
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/15 px-2.5 py-0.5 font-semibold tabular-nums">
      <Clock className="size-3.5" aria-hidden />
      {parts === null
        ? "--d --:--:--"
        : `${parts.days}d ${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`}
    </span>
  );
}

/** Versión grande: tarjetas días / hs / min / seg. */
function CountdownLarge() {
  const parts = useCountdown(launchOffer.endsAt);
  const units = [
    { value: parts?.days ?? null, label: "días" },
    { value: parts?.hours ?? null, label: "hs" },
    { value: parts?.minutes ?? null, label: "min" },
    { value: parts?.seconds ?? null, label: "seg" },
  ];
  return (
    <div className="flex items-center gap-1.5" aria-label="Tiempo restante de la oferta">
      {units.map((unit, index) => (
        <span key={unit.label} className="flex items-center gap-1.5">
          <span className="flex min-w-12 flex-col items-center rounded-lg bg-white/15 px-2 py-1">
            <span className="text-lg leading-none font-bold tabular-nums">
              {unit.value === null ? "--" : pad(unit.value)}
            </span>
            <span className="mt-0.5 text-[10px] tracking-wide text-emerald-100 uppercase">
              {unit.label}
            </span>
          </span>
          {index < units.length - 1 && (
            <span className="font-bold text-emerald-100">:</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BannerOferta: barra delgada fija en la parte superior de la pantalla
// ---------------------------------------------------------------------------

export function BannerOferta() {
  return (
    <div className="sticky top-0 z-50 overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white">
      <Shine />
      <div className="relative mx-auto flex h-10 max-w-6xl items-center justify-center gap-x-3 px-4 text-xs font-medium sm:text-sm">
        <Rocket className="size-4 shrink-0" aria-hidden />
        <p className="hidden sm:block">
          <strong className="font-bold">Oferta de lanzamiento:</strong> el
          precio actual estará disponible por única vez
        </p>
        <p className="font-bold sm:hidden">Oferta de lanzamiento</p>
        <CountdownCompact />
        <Link
          href={launchOffer.ctaHref}
          className="shrink-0 rounded-full bg-white/15 px-2.5 py-0.5 font-semibold transition-colors hover:bg-white/25"
        >
          Aprovechar
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BannerOfertaInline: versión expandida para insertar entre secciones
// ---------------------------------------------------------------------------

export function BannerOfertaInline() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 px-6 py-5 text-white shadow-lg shadow-emerald-500/25">
        <Shine />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase sm:justify-start">
              <Rocket className="size-4" aria-hidden />
              Oferta de lanzamiento
            </p>
            <p className="mt-1 text-sm text-emerald-50">
              El precio actual está disponible por única vez y solo por 2
              meses. Cuando termine el contador, aumenta y no vuelve.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <CountdownLarge />
            <Link
              href={launchOffer.ctaHref}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Aprovechar oferta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
