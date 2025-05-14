import { customer } from '../customer';

export interface CreatePaymentRequest {
  customer: customer;
  amount: number;
}
