export interface CreateSaleRequest {
  client: string;
  products: {
    product: string;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
}
