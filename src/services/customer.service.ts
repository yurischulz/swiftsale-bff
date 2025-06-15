import { createCustomerRequest } from '~/interfaces/customer';
import { Customer } from '~/models/Customer';

export async function getAllCustomers() {
  return await Customer.find();
}

export async function createCustomer(data: createCustomerRequest) {
  const customer = new Customer(data);
  return await customer.save();
}

export async function updateCustomer(id: string, data: createCustomerRequest) {
  const updated = await Customer.findByIdAndUpdate(id, data, { new: true });
  if (!updated) return null;
  return updated;
}

export async function deleteCustomer(id: string) {
  const deleted = await Customer.findByIdAndDelete(id);
  if (!deleted) return null;
  return deleted;
}
