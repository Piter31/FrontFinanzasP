import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "FinanzasP — Dashboard",
  description: "Resumen de tus finanzas personales",
};

// Aplica el tema guardado antes del primer paint para evitar parpadeos.
// Por defecto la app arranca en modo oscuro (como el diseño original).
const themeScript = `try{var t=localStorage.getItem("finanzasp:theme");if(t==="light"){document.documentElement.classList.remove("dark")}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
