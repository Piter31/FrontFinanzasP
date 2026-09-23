"use client";

import { Menu, Wallet, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { landingNavLinks } from "@/lib/landing/data";
import { CtaButton } from "./ui";

const linkClass =
  "text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="#inicio" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
            <Wallet className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">FinanzasP</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {landingNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <CtaButton href="/login" variant="ghost">
            Iniciar sesión
          </CtaButton>
          <CtaButton href="/registro">Empezar gratis</CtaButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-9 place-items-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur md:hidden dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-4 sm:px-6">
            {landingNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 ${linkClass}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <CtaButton href="/login" variant="ghost" className="w-full">
                Iniciar sesión
              </CtaButton>
              <CtaButton href="/registro" className="w-full">
                Empezar gratis
              </CtaButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
