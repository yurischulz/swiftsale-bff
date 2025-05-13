export interface Client {
  _id?: string; // Opcional para novos clientes
  name: string;
  phone: string;
  address: string;
  debt?: number; // Dívida do cliente
  credit?: number; // Crédito do cliente
  affiliation?: string; // ID da afiliação
  createdAt?: Date;
  updatedAt?: Date;
}
