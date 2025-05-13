export interface Payment {
  _id?: string; // Opcional para novos pagamentos
  client: string; // ID do cliente
  amount: number; // Valor do pagamento
  createdAt?: Date;
  updatedAt?: Date;
}
