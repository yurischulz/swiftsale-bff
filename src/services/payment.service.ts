import { Client } from '../models/Client';
import { Payment } from '../models/Payment';

export async function createPayment(data: any) {
  const { client, amount } = data;
  const payment = new Payment({ client, amount });
  await payment.save();

  return await Client.findByIdAndUpdate(client, {
    $inc: { debt: -amount, credit: amount },
  });
}

export async function getPaymentsByClient(id: string) {
  return await Payment.find({ client: id });
}
