export interface Sale {
  _id?: string; // Opcional para novas vendas
  client: string; // ID do cliente
  products: {
    product: string; // ID do produto
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}
