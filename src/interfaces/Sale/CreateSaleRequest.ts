export interface CreateSaleRequest {
  customer: string;
  products: {
    product: string;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
}
