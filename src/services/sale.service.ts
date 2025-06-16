import { CreateSaleRequest } from '~/interfaces/Sale';

import { Customer } from '~/models/Customer';
import { Sale } from '~/models/Sale';

export async function createSale(data: CreateSaleRequest, createdBy: string) {
  const { customer, products, total } = data;

  const productsWithCreatedBy = products.map((p) => ({
    ...p,
    createdBy,
  }));

  const sale = new Sale({
    customer,
    products: productsWithCreatedBy,
    total,
    createdBy,
  });
  const saleResponse = await sale.save();

  const customerDoc = await Customer.findOne({ _id: customer, createdBy });

  if (customerDoc) {
    let remainingTotal = total;
    let updatedCredit = customerDoc.credit || 0;
    let updatedDebt = customerDoc.debt || 0;

    if (updatedCredit > 0) {
      if (updatedCredit >= remainingTotal) {
        updatedCredit -= remainingTotal;
        remainingTotal = 0;
      } else {
        remainingTotal -= updatedCredit;
        updatedCredit = 0;
      }
    }

    if (remainingTotal > 0) {
      updatedDebt += remainingTotal;
    }

    await Customer.updateOne(
      { _id: customer, createdBy },
      { $set: { credit: updatedCredit, debt: updatedDebt } }
    );
  }

  return saleResponse;
}

export async function getSalesByCustomer(id: string, createdBy: string) {
  return await Sale.find({ customer: id, createdBy }).populate(
    'products.product'
  );
}
