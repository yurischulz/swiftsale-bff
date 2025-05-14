export interface customer {
  _id?: string; // Opcional para novos customers
  name: string;
  phone: string;
  address: string;
  debt?: number; // Dívida do customer
  credit?: number; // Crédito do customer
  affiliation?: string; // ID da afiliação
  createdAt?: Date;
  updatedAt?: Date;
}
