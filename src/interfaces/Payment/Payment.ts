export interface Payment {
  _id?: string; // Opcional para novos pagamentos
  customer: string; // ID do customer
  amount: number; // Valor do pagamento
  createdAt?: Date;
  updatedAt?: Date;
}
