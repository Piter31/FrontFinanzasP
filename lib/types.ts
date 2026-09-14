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
