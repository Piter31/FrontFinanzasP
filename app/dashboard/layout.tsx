import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinanzasP — Dashboard",
  description: "Resumen de tus finanzas personales",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
