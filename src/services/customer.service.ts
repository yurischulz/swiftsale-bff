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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new mongoose.Error.CastError('ObjectId', id, 'id');
  }
  const updated = await Customer.findByIdAndUpdate(id, data, { new: true });
  console.log('Updated customer:', updated);
  if (!updated) return null;
  return updated;
}

export async function deleteCustomer(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new mongoose.Error.CastError('ObjectId', id, 'id');
  }
  const deleted = await Customer.findByIdAndDelete(id);
  if (!deleted) return null;
  return deleted;
}
