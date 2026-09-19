export type TransactionType = "ingreso" | "gasto";

export interface Transaction {
  id: string;
  tipo: TransactionType;
  monto: number;
  categoria: string;
  /** Fecha local en formato ISO: yyyy-mm-dd */
  fecha: string;
  descripcion?: string;
}

export interface BudgetStatus {
  categoria: string;
  limite: number;
  gastado: number;
  porcentaje: number;
  estado: "ok" | "alerta" | "excedido";
}
