import { createCustomerRequest } from '~/interfaces/customer';
import { Customer } from '~/models/Customer';

export async function getAllCustomers(createdBy: string) {
  return await Customer.find({ createdBy });
}

export async function createCustomer(
  data: createCustomerRequest,
  createdBy: string
) {
  const customer = new Customer({ ...data, createdBy });
  return await customer.save();
}

export async function updateCustomer(
  id: string,
  data: createCustomerRequest,
  createdBy: string
) {
  const updated = await Customer.findByIdAndUpdate(
    { _id: id, createdBy },
    data,
    { new: true }
  );
  if (!updated) return null;
  return updated;
}

export async function deleteCustomer(id: string, createdBy: string) {
  const deleted = await Customer.findByIdAndDelete({ _id: id, createdBy });
  if (!deleted) return null;
  return deleted;
}
