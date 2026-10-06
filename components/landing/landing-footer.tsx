import { Github, Instagram, Linkedin, Wallet } from "lucide-react";
import Link from "next/link";
import { landingNavLinks } from "@/lib/landing/data";
import { Badge } from "./ui";

const socialIcons = [
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
  { label: "GitHub", icon: Github },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="#inicio" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <Wallet className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">FinanzasP</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Organizá tus finanzas personales con claridad.
            </p>
            <p className="text-xs text-zinc-400">Hecho en Argentina</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Secciones</h3>
            <ul className="space-y-2.5">
              {landingNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2.5">
              {["Términos y condiciones", "Política de privacidad"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {item}
                  </span>
                  <Badge tone="zinc">Próximamente</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Contacto</h3>
            <a
              href="mailto:contacto@finanzasp.com"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              contacto@finanzasp.com
            </a>
            <div className="mt-4 flex gap-2">
              {socialIcons.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  title="Próximamente"
                  aria-label={`${label} (próximamente)`}
                  className="grid size-9 place-items-center rounded-xl border border-zinc-200 text-zinc-400 dark:border-zinc-800"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          © {new Date().getFullYear()} FinanzasP — Organizá tus finanzas
          personales.
        </div>
      </div>
    </footer>
  );
}
