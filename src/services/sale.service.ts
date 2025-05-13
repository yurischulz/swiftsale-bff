import { Request, Response } from 'express';

import { Client } from '~/models/Client';
import { Sale } from '~/models/Sale';

export async function createSale(data: any) {
  const { client, products, total } = data;
  const sale = new Sale({ client, products, total });
  await sale.save();
  return await Client.findByIdAndUpdate(client, {
    $inc: { debt: total },
  });
}

export async function getSalesByClient(req: Request, res: Response) {
  return await Sale.find({ client: req.params.id }).populate(
    'products.product'
  );
}
