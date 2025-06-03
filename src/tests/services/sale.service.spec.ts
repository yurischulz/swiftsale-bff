import { createSale, getSalesByCustomer } from '~/services/sale.service';
import { Sale } from '~/models/Sale';
import { Customer } from '~/models/Customer';

jest.mock('~/models/Sale', () => {
  const mockSave = jest.fn();
  const Sale = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave,
  }));
  (Sale as any).find = jest.fn();
  return { Sale, __esModule: true };
});
jest.mock('~/models/Customer', () => ({
  Customer: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('sale.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSale', () => {
    it('deve criar uma venda e atualizar o cliente', async () => {
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (Sale as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));
      (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: 'c1',
        debt: 100,
      });

      const data = {
        customer: 'c1',
        products: [{ product: 'p1', qty: 2 }],
        total: 100,
      };
      const result = await createSale(data as any);

      expect(Sale).toHaveBeenCalledWith({
        customer: 'c1',
        products: [{ product: 'p1', qty: 2 }],
        total: 100,
      });
      expect(mockSave).toHaveBeenCalled();
      expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith('c1', {
        $inc: { debt: 100 },
      });
      expect(result).toEqual({ _id: 'c1', debt: 100 });
    });

    it('deve lançar erro se save da venda falhar', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('save error'));
      (Sale as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));

      const data = { customer: 'c1', products: [], total: 50 };
      await expect(createSale(data as any)).rejects.toThrow('save error');
      expect(mockSave).toHaveBeenCalled();
    });

    it('deve lançar erro se update do cliente falhar', async () => {
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (Sale as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));
      (Customer.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error('update error')
      );

      const data = { customer: 'c1', products: [], total: 50 };
      await expect(createSale(data as any)).rejects.toThrow('update error');
      expect(mockSave).toHaveBeenCalled();
      expect(Customer.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('deve passar os dados corretos para o Sale e Customer', async () => {
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (Sale as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));
      (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: 'c2',
        debt: 200,
      });

      const data = {
        customer: 'c2',
        products: [{ product: 'p2', qty: 1 }],
        total: 200,
      };
      await createSale(data as any);

      expect(Sale).toHaveBeenCalledWith({
        customer: 'c2',
        products: [{ product: 'p2', qty: 1 }],
        total: 200,
      });
      expect(Customer.findByIdAndUpdate).toHaveBeenCalledWith('c2', {
        $inc: { debt: 200 },
      });
    });
  });

  describe('getSalesByCustomer', () => {
    it('deve retornar vendas do cliente com populate', async () => {
      const mockPopulate = jest
        .fn()
        .mockResolvedValue([{ _id: 's1' }, { _id: 's2' }]);
      (Sale.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const req = { params: { id: 'c1' } };
      const res = {};
      const result = await getSalesByCustomer(req as any, res as any);

      expect(Sale.find).toHaveBeenCalledWith({ customer: 'c1' });
      expect(mockPopulate).toHaveBeenCalledWith('products.product');
      expect(result).toEqual([{ _id: 's1' }, { _id: 's2' }]);
    });

    it('deve retornar lista vazia se não houver vendas', async () => {
      const mockPopulate = jest.fn().mockResolvedValue([]);
      (Sale.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const req = { params: { id: 'c2' } };
      const res = {};
      const result = await getSalesByCustomer(req as any, res as any);

      expect(Sale.find).toHaveBeenCalledWith({ customer: 'c2' });
      expect(mockPopulate).toHaveBeenCalledWith('products.product');
      expect(result).toEqual([]);
    });

    it('deve lançar erro se Sale.find falhar', async () => {
      (Sale.find as jest.Mock).mockImplementation(() => {
        throw new Error('find error');
      });

      const req = { params: { id: 'c3' } };
      const res = {};
      await expect(getSalesByCustomer(req as any, res as any)).rejects.toThrow(
        'find error'
      );
      expect(Sale.find).toHaveBeenCalledWith({ customer: 'c3' });
    });

    it('deve lançar erro se populate falhar', async () => {
      const mockPopulate = jest
        .fn()
        .mockRejectedValue(new Error('populate error'));
      (Sale.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const req = { params: { id: 'c4' } };
      const res = {};
      await expect(getSalesByCustomer(req as any, res as any)).rejects.toThrow(
        'populate error'
      );
      expect(Sale.find).toHaveBeenCalledWith({ customer: 'c4' });
      expect(mockPopulate).toHaveBeenCalledWith('products.product');
    });

    it('deve passar o id correto do cliente para Sale.find', async () => {
      const mockPopulate = jest.fn().mockResolvedValue([{ _id: 's3' }]);
      (Sale.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const req = { params: { id: 'c5' } };
      const res = {};
      await getSalesByCustomer(req as any, res as any);

      expect(Sale.find).toHaveBeenCalledWith({ customer: 'c5' });
      expect(mockPopulate).toHaveBeenCalledWith('products.product');
    });
  });
});
