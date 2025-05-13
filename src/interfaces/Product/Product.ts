export interface Product {
  _id?: string; // Opcional para novos produtos
  name: string;
  unitPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
