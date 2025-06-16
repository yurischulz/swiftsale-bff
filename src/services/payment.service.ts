import { CreatePaymentRequest } from '~/interfaces/Payment';
import { Payment } from '~/models/Payment';
import { Customer } from '~/models/Customer';

export async function createPayment(
  data: CreatePaymentRequest,
  createdBy: string
) {
  const { customer, amount } = data;

  const payment = new Payment({ customer, amount, createdBy });
  const paymentResponse = await payment.save();

  const customerDoc = await Customer.findOne({ _id: customer, createdBy });
  if (customerDoc) {
    const currentDebt = customerDoc.debt || 0;
    const currentCredit = customerDoc.credit || 0;
    let newDebt = currentDebt - amount;
    let newCredit = currentCredit;
    if (newDebt < 0) {
      newCredit += Math.abs(newDebt);
      newDebt = 0;
    }
    await Customer.findByIdAndUpdate(customer, {
      debt: newDebt,
      credit: newCredit,
    });
  }

  return paymentResponse;
}

export async function getPaymentsByCustomer(id: string, createdBy: string) {
  const customerExists = await Customer.exists({ _id: id, createdBy });
  if (!customerExists) return null;
  return await Payment.find({ customer: id, createdBy });
}
