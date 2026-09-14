export type CurrencyCode = "USD" | "ARS";

const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  USD: "es-MX",
  ARS: "es-AR",
};

export function toISODate(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode = "USD",
): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(value);
}

export function currencySymbol(currency: CurrencyCode): string {
  return currency === "USD" ? "US$" : "AR$";
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
