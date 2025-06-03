import { CreatePaymentRequest } from '~/interfaces/Payment';
import { Payment } from '../models/Payment';
import { Customer } from '../models/Customer'; // Certifique-se de importar o modelo correto

export async function createPayment(data: CreatePaymentRequest) {
  const { customer, amount } = data;

  // Cria o pagamento
  const payment = new Payment({ customer, amount });
  const paymentResponse = await payment.save();

  // Atualiza o cliente no banco de dados
  await Customer.findByIdAndUpdate(customer, {
    $inc: { debt: -amount, credit: amount },
  });

  return paymentResponse;
}

export async function getPaymentsByCustomer(id: string) {
  return await Payment.find({ customer: id });
}
