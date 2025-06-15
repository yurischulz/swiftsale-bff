export interface Sale {
  _id?: string;
  customer: string;
  products: {
    product: string;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}
