import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  ArrowRightLeft,
  Bell,
  CalendarClock,
  ChartColumn,
  ChartLine,
  ChartPie,
  Coins,
  EyeOff,
  FileDown,
  Files,
  FileUp,
  Flag,
  Hourglass,
  Landmark,
  Layers,
  Lightbulb,
  ListChecks,
  Paperclip,
  PiggyBank,
  Repeat,
  ScanSearch,
  ShieldCheck,
  Tags,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tipos base
// ---------------------------------------------------------------------------

export type PlanId = "free" | "plus" | "pro";
export type BillingPeriod = "monthly" | "yearly";
export type Availability = "available" | "coming-soon";

export interface PlanFeature {
  label: string;
  availability: Availability;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  badge?: string;
  highlighted?: boolean;
  /** yearly = precio total del año */
  price: Record<BillingPeriod, number>;
  ctaLabel: string;
  features: PlanFeature[];
}

// ---------------------------------------------------------------------------
// Planes y precios
// ---------------------------------------------------------------------------

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Gratis",
    tagline: "Todo lo esencial para empezar a ordenar tus finanzas.",
    price: { monthly: 0, yearly: 0 },
    ctaLabel: "Empezar gratis",
    features: [
      { label: "Registro y acceso a tu cuenta", availability: "available" },
      { label: "Dashboard con balance total", availability: "available" },
      { label: "Ingresos y gastos del mes", availability: "available" },
      { label: "Comparación con el mes anterior", availability: "available" },
      { label: "Registro de transacciones", availability: "available" },
      { label: "Historial de movimientos", availability: "available" },
      { label: "Filtro de transacciones por tipo", availability: "available" },
      { label: "Moneda USD / ARS", availability: "available" },
      { label: "Tema claro y oscuro", availability: "available" },
      { label: "Configuración de tu cuenta", availability: "available" },
      { label: "Acceso desde móvil y escritorio", availability: "available" },
    ],
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "Más control, análisis y herramientas para mejorar tus finanzas.",
    badge: "MÁS ELEGIDO",
    highlighted: true,
    price: { monthly: 4.99, yearly: 49.9 },
    ctaLabel: "Elegir Plus",
    features: [
      { label: "Todo lo incluido en Gratis", availability: "available" },
      { label: "Gráfico de ingresos vs gastos", availability: "available" },
      { label: "Gráfico de gastos por categoría", availability: "available" },
      { label: "Meta de ahorro", availability: "available" },
      { label: "Presupuestos por categoría", availability: "available" },
      { label: "Alertas de presupuesto", availability: "available" },
      { label: "Análisis visual de tus finanzas", availability: "available" },
      {
        label: "Nuevas herramientas premium a medida que se incorporen",
        availability: "available",
      },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline:
      "Para quienes quieren llevar el control financiero al siguiente nivel.",
    price: { monthly: 7.99, yearly: 79.9 },
    ctaLabel: "Elegir Pro",
    features: [
      { label: "Todo lo incluido en Plus", availability: "available" },
      { label: "Reportes avanzados", availability: "coming-soon" },
      { label: "Exportación CSV / Excel", availability: "coming-soon" },
      { label: "Importación de Excel", availability: "coming-soon" },
      { label: "Múltiples cuentas y billeteras", availability: "coming-soon" },
      { label: "Transacciones recurrentes", availability: "coming-soon" },
      { label: "Recordatorios y notificaciones", availability: "coming-soon" },
      { label: "Categorías personalizadas", availability: "coming-soon" },
      { label: "Adjuntar comprobantes", availability: "coming-soon" },
      { label: "Búsqueda y filtros avanzados", availability: "coming-soon" },
      { label: "Conversión real USD / ARS", availability: "coming-soon" },
      { label: "Nuevas funcionalidades Pro", availability: "coming-soon" },
    ],
  },
];

/** Formatea el precio de un plan: US$0 para el gratis, US$4,99 para el resto. */
export function formatPlanPrice(value: number): string {
  if (value === 0) return "US$0";
  return `US$${value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// PUNTO DE INTEGRACIÓN FUTURA DE PAGOS
// Hoy: el alta de planes pagos todavía no cobra; el flujo es crear la cuenta primero.
// FUTURO: aquí se crea la sesión de checkout del proveedor de pagos (Stripe/MercadoPago)
// y se redirige al checkout; soportar upgrade/downgrade/cancelación.
export function checkoutHref(plan: PlanId, period: BillingPeriod): string {
  if (plan === "free") return "/registro";
  const params = new URLSearchParams({ plan, periodo: period });
  return `/registro?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Tabla comparativa de planes
// ---------------------------------------------------------------------------

export type CellValue = "yes" | "no" | "coming-soon";

export interface ComparisonRow {
  feature: string;
  free: CellValue;
  plus: CellValue;
  pro: CellValue;
}

export const comparisonRows: ComparisonRow[] = [
  { feature: "Registro y acceso", free: "yes", plus: "yes", pro: "yes" },
  {
    feature: "Dashboard con balance, ingresos y gastos",
    free: "yes",
    plus: "yes",
    pro: "yes",
  },
  {
    feature: "Comparación con el mes anterior",
    free: "yes",
    plus: "yes",
    pro: "yes",
  },
  {
    feature: "Historial de transacciones con filtro",
    free: "yes",
    plus: "yes",
    pro: "yes",
  },
  { feature: "Moneda USD / ARS", free: "yes", plus: "yes", pro: "yes" },
  { feature: "Tema claro y oscuro", free: "yes", plus: "yes", pro: "yes" },
  {
    feature: "Gráfico de ingresos vs gastos",
    free: "no",
    plus: "yes",
    pro: "yes",
  },
  {
    feature: "Gráfico de gastos por categoría",
    free: "no",
    plus: "yes",
    pro: "yes",
  },
  { feature: "Meta de ahorro", free: "no", plus: "yes", pro: "yes" },
  {
    feature: "Presupuestos por categoría con alertas",
    free: "no",
    plus: "yes",
    pro: "yes",
  },
  {
    feature: "Reportes avanzados",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Exportación CSV / Excel",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Importación de Excel",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Múltiples cuentas y billeteras",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Transacciones recurrentes",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Recordatorios y notificaciones",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Categorías personalizadas",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Adjuntar comprobantes",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Búsqueda y filtros avanzados",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
  {
    feature: "Conversión real USD / ARS",
    free: "no",
    plus: "no",
    pro: "coming-soon",
  },
];

// ---------------------------------------------------------------------------
// Sección Interés: tarjetas de funcionalidades
// ---------------------------------------------------------------------------

export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
  planLabel: string;
  availability: Availability;
}

export const featureCards: FeatureCard[] = [
  {
    icon: Wallet,
    title: "Balance total",
    description:
      "Tu situación completa en un número, actualizado con cada movimiento.",
    planLabel: "Gratis",
    availability: "available",
  },
  {
    icon: TrendingUp,
    title: "Ingresos",
    description: "Registrá y seguí todo lo que entra en el mes.",
    planLabel: "Gratis",
    availability: "available",
  },
  {
    icon: TrendingDown,
    title: "Gastos",
    description: "Cada gasto registrado y categorizado, sin que se te pase nada.",
    planLabel: "Gratis",
    availability: "available",
  },
  {
    icon: ArrowLeftRight,
    title: "Transacciones",
    description: "Historial completo de movimientos con filtro por tipo.",
    planLabel: "Gratis",
    availability: "available",
  },
  {
    icon: CalendarClock,
    title: "Comparación mensual",
    description: "Variación porcentual de tus ingresos y gastos vs el mes anterior.",
    planLabel: "Gratis",
    availability: "available",
  },
  {
    icon: ChartColumn,
    title: "Gráficos",
    description: "Ingresos vs gastos y distribución por categoría, de un vistazo.",
    planLabel: "Plus",
    availability: "available",
  },
  {
    icon: Target,
    title: "Presupuestos",
    description: "Límites por categoría con alertas al 80% y al superarlos.",
    planLabel: "Plus",
    availability: "available",
  },
  {
    icon: PiggyBank,
    title: "Meta de ahorro",
    description: "Objetivo editable con barra de progreso según tu balance.",
    planLabel: "Plus",
    availability: "available",
  },
];

// ---------------------------------------------------------------------------
// Sección Problema
// ---------------------------------------------------------------------------

export interface ProblemItem {
  icon: LucideIcon;
  text: string;
}

export const problemItems: ProblemItem[] = [
  {
    icon: Coins,
    text: "Gastos chicos que se acumulan sin que te des cuenta",
  },
  {
    icon: EyeOff,
    text: "No saber cuánto gastaste realmente durante el mes",
  },
  {
    icon: Hourglass,
    text: "No tener claro cuánto podés ahorrar",
  },
  {
    icon: Tags,
    text: "Perder el control de los gastos por categoría",
  },
  {
    icon: Files,
    text: "Tu información financiera dispersa en notas, planillas y apps",
  },
];

// ---------------------------------------------------------------------------
// Sección Deseo: beneficios
// ---------------------------------------------------------------------------

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const benefitItems: BenefitItem[] = [
  {
    icon: Lightbulb,
    title: "Más claridad",
    description: "Ves tu situación completa en segundos, sin armar cuentas a mano.",
  },
  {
    icon: ListChecks,
    title: "Más control",
    description: "Cada ingreso y gasto queda registrado y siempre a mano.",
  },
  {
    icon: Layers,
    title: "Mejor organización",
    description: "Tus movimientos ordenados por tipo y categoría, en un solo lugar.",
  },
  {
    icon: Flag,
    title: "Objetivos definidos",
    description: "Definí una meta de ahorro y seguí tu progreso mes a mes.",
  },
  {
    icon: ShieldCheck,
    title: "Menos incertidumbre",
    description: "Dejás de adivinar: sabés en qué se te va la plata.",
  },
  {
    icon: ChartPie,
    title: "Mejor seguimiento de gastos",
    description: "Detectá en qué categorías gastás más y ajustá tus hábitos.",
  },
];

// ---------------------------------------------------------------------------
// Sección "Esto recién empieza": roadmap
// ---------------------------------------------------------------------------

export interface RoadmapItem {
  icon: LucideIcon;
  title: string;
}

export const roadmapItems: RoadmapItem[] = [
  { icon: ChartLine, title: "Reportes avanzados" },
  { icon: FileDown, title: "Exportación de datos (CSV/Excel)" },
  { icon: FileUp, title: "Importación de Excel" },
  { icon: Landmark, title: "Múltiples cuentas y billeteras" },
  { icon: Repeat, title: "Transacciones recurrentes" },
  { icon: Bell, title: "Recordatorios y notificaciones" },
  { icon: Tags, title: "Categorías personalizadas" },
  { icon: Paperclip, title: "Adjuntar comprobantes" },
  { icon: ScanSearch, title: "Búsqueda y filtros avanzados" },
  { icon: ArrowRightLeft, title: "Conversión real USD / ARS" },
];

// ---------------------------------------------------------------------------
// Testimonios (placeholders — NO inventar testimonios reales)
// ---------------------------------------------------------------------------

export interface TestimonialSlot {
  id: number;
  plan: string;
  comment: string;
}

export const testimonialSlots: TestimonialSlot[] = [
  {
    id: 1,
    plan: "Plan Gratis",
    comment:
      "Tu opinión puede aparecer acá. Probá FinanzasP y contanos tu experiencia.",
  },
  {
    id: 2,
    plan: "Plan Plus",
    comment:
      "Tu opinión puede aparecer acá. Probá FinanzasP y contanos tu experiencia.",
  },
  {
    id: 3,
    plan: "Plan Pro",
    comment:
      "Tu opinión puede aparecer acá. Probá FinanzasP y contanos tu experiencia.",
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "¿Qué es FinanzasP?",
    answer:
      "FinanzasP es una app de finanzas personales para registrar tus ingresos y gastos, ver tu balance, comparar meses, usar gráficos, presupuestos por categoría y una meta de ahorro.",
  },
  {
    question: "¿El plan Gratis tiene costo?",
    answer:
      "No. El plan Gratis es gratis para siempre y no te pedimos tarjeta para crear tu cuenta.",
  },
  {
    question: "¿Puedo cambiar de plan?",
    answer:
      "Los planes pagos se habilitan próximamente. Cuando estén disponibles, vas a poder subir o bajar de plan en cualquier momento desde tu cuenta.",
  },
  {
    question: "¿Puedo cancelar mi suscripción?",
    answer:
      "Cuando las suscripciones estén disponibles, vas a poder cancelar en cualquier momento, sin permanencia mínima.",
  },
  {
    question: "¿Puedo utilizar FinanzasP desde el celular?",
    answer:
      "Sí. FinanzasP funciona desde el navegador del celular y de la computadora, con una navegación adaptada a cada pantalla.",
  },
  {
    question: "¿Mis datos están protegidos?",
    answer:
      "Tu contraseña se guarda cifrada y el acceso a tu cuenta está protegido con autenticación segura. Solo vos podés ver tus movimientos.",
  },
  {
    question: "¿Puedo registrar ingresos y gastos en distintas monedas?",
    answer:
      "Podés ver todos tus montos en USD o ARS: el selector cambia el símbolo y el formato de los números. La conversión con tipo de cambio real es una funcionalidad Pro y llega próximamente.",
  },
  {
    question: "¿Qué diferencia hay entre Plus y Pro?",
    answer:
      "Plus suma análisis visual y planificación: gráficos, presupuestos por categoría y meta de ahorro. Pro apunta a herramientas avanzadas como reportes, exportación e importación de datos, múltiples cuentas y más; varias están en desarrollo y se marcan como “Próximamente”.",
  },
  {
    question: "¿Se pueden exportar mis datos?",
    answer:
      "Todavía no. La exportación a CSV/Excel está en el roadmap del plan Pro.",
  },
];

// ---------------------------------------------------------------------------
// Navegación de la landing
// ---------------------------------------------------------------------------

export const landingNavLinks: { label: string; href: string }[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Planes", href: "#planes" },
  { label: "FAQ", href: "#faq" },
];

// ---------------------------------------------------------------------------
// Datos mock del dashboard (para la visual de la landing)
// ---------------------------------------------------------------------------

export const dashboardMock = {
  balance: 4820.75,
  netoMes: 615.4,
  ingresosMes: 1850,
  gastosMes: 1234.6,
  pctIngresos: 12.4,
  pctGastos: -3.2,
  series: [
    { label: "mar", ingresos: 1620, gastos: 1410 },
    { label: "abr", ingresos: 1580, gastos: 1350 },
    { label: "may", ingresos: 1700, gastos: 1290 },
    { label: "jun", ingresos: 1650, gastos: 1380 },
    { label: "jul", ingresos: 1780, gastos: 1260 },
    { label: "ago", ingresos: 1850, gastos: 1234.6 },
  ],
  categorias: [
    { categoria: "Comida", total: 420 },
    { categoria: "Hogar", total: 310 },
    { categoria: "Transporte", total: 180 },
    { categoria: "Ocio", total: 150 },
    { categoria: "Salud", total: 95 },
    { categoria: "Otros", total: 79.6 },
  ],
  meta: 6000,
};
