import { Request, Response } from 'express';
import { CreateSaleRequest } from '~/interfaces/Sale';

import { Customer } from '~/models/Customer';
import { Sale } from '~/models/Sale';

export async function createSale(data: CreateSaleRequest) {
  const { customer, products, total } = data;
  const sale = new Sale({ customer, products, total });
  await sale.save();
  return await Customer.findByIdAndUpdate(customer, {
    $inc: { debt: total },
  });
}

export async function getSalesByCustomer(req: Request, res: Response) {
  return await Sale.find({ customer: req.params.id }).populate(
    'products.product'
  );
}
