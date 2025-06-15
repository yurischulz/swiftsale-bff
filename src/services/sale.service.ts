import { CreateSaleRequest } from '~/interfaces/Sale';

import { Customer } from '~/models/Customer';
import { Sale } from '~/models/Sale';

export async function createSale(data: CreateSaleRequest) {
  const { customer, products, total } = data;
  const sale = new Sale({ customer, products, total });
  const saleResponse = await sale.save();
  await Customer.findByIdAndUpdate(customer, {
    $inc: { debt: total },
  });
  return saleResponse;
}

export async function getSalesByCustomer(id: string) {
  return await Sale.find({ customer: id }).populate('products.product');
}
