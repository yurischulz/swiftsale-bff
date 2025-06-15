export interface Payment {
  _id?: string;
  customer: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
