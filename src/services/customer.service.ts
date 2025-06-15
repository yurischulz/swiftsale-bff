import mongoose from 'mongoose';

import { createCustomerRequest } from '~/interfaces/customer';
import { Customer } from '~/models/Customer';

export async function getAllCustomers() {
  return await Customer.find();
}

export async function getCustomerById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new mongoose.Error.CastError('ObjectId', id, 'id');
  }
  return await Customer.findById(id);
}

export async function createCustomer(data: createCustomerRequest) {
  const customer = new Customer(data);
  return await customer.save();
}

export async function updateCustomer(id: string, data: createCustomerRequest) {
  return await Customer.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteCustomer(id: string) {
  return await Customer.findByIdAndDelete(id);
}
