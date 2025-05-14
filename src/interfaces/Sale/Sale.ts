export interface Sale {
  _id?: string; // Opcional para novas vendas
  customer: string; // ID do customer
  products: {
    product: string; // ID do produto
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}
