"use client";

import { useAuth } from "./auth-context";
import { currencySymbol, formatCurrency, type CurrencyCode } from "./format";

/**
 * Moneda activa del usuario (guardada en su perfil) con helpers de formato.
 * Cae en USD cuando no hay sesión cargada.
 */
export function useCurrency() {
  const { user } = useAuth();
  const currency: CurrencyCode = user?.currency ?? "USD";
  return {
    currency,
    symbol: currencySymbol(currency),
    format: (value: number) => formatCurrency(value, currency),
  };
}
