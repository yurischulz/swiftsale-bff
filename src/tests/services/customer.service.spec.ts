import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../services/customer.service';
import { Customer } from '../../models/Customer';

// Mock manual seguindo o padrão do projeto
jest.mock('../../models/Customer', () => {
  const mockSave = jest.fn();
  const mockFind = jest.fn();
  const mockFindByIdAndUpdate = jest.fn();
  const mockFindByIdAndDelete = jest.fn();

  // Suporte a métodos estáticos e instância
  const Customer = jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));

  return {
    // Métodos estáticos expostos diretamente
    // Isso garante que o import { Customer } ... funcione para métodos estáticos
    // e para new Customer()
    Customer: Object.assign(Customer, {
      find: mockFind,
      findByIdAndUpdate: mockFindByIdAndUpdate,
      findByIdAndDelete: mockFindByIdAndDelete,
    }),
  };
});

describe('Customer Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      const mockCustomers = [{ name: 'John' }, { name: 'Jane' }];
      (Customer.find as jest.Mock).mockResolvedValue(mockCustomers);

      const result = await getAllCustomers();

      expect(Customer.find).toHaveBeenCalled();
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('createCustomer', () => {
    it('should create and return a new customer', async () => {
      const data = { name: 'Alice' };
      const mockSave = jest.fn().mockResolvedValue({ _id: '1', ...data });
      (Customer as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await createCustomer(data as any);

      expect(Customer).toHaveBeenCalledWith(data);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({ _id: '1', ...data });
    });
  });

  describe('updateCustomer', () => {
    it('should update and return the customer', async () => {
      const id = '123';
      const data = { name: 'Bob' };
      const updatedCustomer = { _id: id, ...data };
      (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedCustomer
      );

      const result = await updateCustomer(id, data as any);

      expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith(id, data, {
        new: true,
      });
      expect(result).toEqual(updatedCustomer);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete and return the customer', async () => {
      const id = '456';
      const deletedCustomer = { _id: id, name: 'Carol' };
      (Customer.findByIdAndDelete as jest.Mock).mockResolvedValue(
        deletedCustomer
      );

      const result = await deleteCustomer(id);

      expect(Customer.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedCustomer);
    });
  });
});
