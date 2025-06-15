import { CreatePaymentRequest } from '~/interfaces/Payment';
import { Payment } from '~/models/Payment';
import { Customer } from '~/models/Customer';

export async function createPayment(data: CreatePaymentRequest) {
  const { customer, amount } = data;

  const payment = new Payment({ customer, amount });
  const paymentResponse = await payment.save();

  await Customer.findByIdAndUpdate(customer, {
    $inc: { debt: -amount, credit: amount },
  });

  return paymentResponse;
}

export async function getPaymentsByCustomer(id: string) {
  const customerExists = await Customer.exists({ _id: id });
  if (!customerExists) return null;
  return await Payment.find({ customer: id });
}
