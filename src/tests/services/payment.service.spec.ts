import {
  createPayment,
  getPaymentsByCustomer,
} from '~/services/payment.service';
import { Payment } from '../../models/Payment';
import { Customer } from '../../models/Customer';

jest.mock('../../models/Payment', () => {
  const mockSave = jest.fn();
  const Payment = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave,
  }));
  (Payment as any).find = jest.fn();
  return { Payment, __esModule: true };
});
jest.mock('../../models/Customer', () => ({
  Customer: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('payment.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('deve criar um pagamento e atualizar o cliente', async () => {
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (Payment as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));
      (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: 'c1',
        debt: 0,
        credit: 100,
      });

      // customer agora é um objeto conforme a interface
      const data = {
        customer: { _id: 'c1', name: 'John', phone: '999', address: 'Rua X' },
        amount: 100,
      };
      const result = await createPayment(data);

      expect(Payment).toHaveBeenCalledWith({
        customer: data.customer,
        amount: 100,
      });
      expect(mockSave).toHaveBeenCalled();
      expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith(data.customer, {
        $inc: { debt: -100, credit: 100 },
      });
      expect(result).toEqual({ _id: 'c1', debt: 0, credit: 100 });
    });

    it('deve lançar erro se o save do pagamento falhar', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('save error'));
      (Payment as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));

      const data = {
        customer: { _id: 'c1', name: 'John', phone: '999', address: 'Rua X' },
        amount: 100,
      };
      await expect(createPayment(data)).rejects.toThrow('save error');
      expect(mockSave).toHaveBeenCalled();
    });

    it('deve lançar erro se o update do cliente falhar', async () => {
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (Payment as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));
      (Customer.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error('update error')
      );

      const data = {
        customer: { _id: 'c1', name: 'John', phone: '999', address: 'Rua X' },
        amount: 100,
      };
      await expect(createPayment(data)).rejects.toThrow('update error');
      expect(mockSave).toHaveBeenCalled();
      expect(Customer.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('getPaymentsByCustomer', () => {
    it('deve retornar pagamentos do cliente', async () => {
      const mockPayments = [{ _id: 'p1' }, { _id: 'p2' }];
      (Payment.find as jest.Mock).mockResolvedValue(mockPayments);

      const result = await getPaymentsByCustomer('c1');
      expect(Payment.find).toHaveBeenCalledWith({ customer: 'c1' });
      expect(result).toBe(mockPayments);
    });

    it('deve retornar lista vazia se não houver pagamentos', async () => {
      (Payment.find as jest.Mock).mockResolvedValue([]);

      const result = await getPaymentsByCustomer('c2');
      expect(Payment.find).toHaveBeenCalledWith({ customer: 'c2' });
      expect(result).toEqual([]);
    });

    it('deve lançar erro se Payment.find falhar', async () => {
      (Payment.find as jest.Mock).mockRejectedValue(new Error('find error'));

      await expect(getPaymentsByCustomer('c3')).rejects.toThrow('find error');
      expect(Payment.find).toHaveBeenCalledWith({ customer: 'c3' });
    });
  });
});
