import { getDashboardSummary } from '~/services/dashboard.service';
import { Customer } from '~/models/Customer';
import { Affiliation } from '~/models/Affiliation';
import { Payment } from '~/models/Payment';
import { Sale } from '~/models/Sale';

jest.mock('../../models/Customer', () => ({
  Customer: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));
jest.mock('../../models/Affiliation', () => ({
  Affiliation: {
    find: jest.fn(),
  },
}));
jest.mock('../../models/Payment', () => ({
  Payment: {
    countDocuments: jest.fn(),
  },
}));
jest.mock('../../models/Sale', () => ({
  Sale: {
    countDocuments: jest.fn(),
  },
}));

describe('dashboard.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardSummary', () => {
    it('deve retornar o resumo correto com dados válidos', async () => {
      const mockCustomers = [
        {
          _id: 'c1',
          debt: 100,
          affiliation: { _id: 'a1', toString: () => 'a1' },
        },
        {
          _id: 'c2',
          debt: 200,
          affiliation: { _id: 'a2', toString: () => 'a2' },
        },
        {
          _id: 'c3',
          debt: 50,
          affiliation: { _id: 'a1', toString: () => 'a1' },
        },
        {
          _id: 'c4',
          debt: 300,
          affiliation: { _id: 'a3', toString: () => 'a3' },
        },
        { _id: 'c5', debt: 10, affiliation: null },
        {
          _id: 'c6',
          debt: 400,
          affiliation: { _id: 'a2', toString: () => 'a2' },
        },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(mockCustomers);
      (Customer.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const mockAffiliations = [
        {
          _id: { toString: () => 'a1' },
          toObject: () => ({ _id: 'a1', name: 'Aff1' }),
        },
        {
          _id: { toString: () => 'a2' },
          toObject: () => ({ _id: 'a2', name: 'Aff2' }),
        },
        {
          _id: { toString: () => 'a3' },
          toObject: () => ({ _id: 'a3', name: 'Aff3' }),
        },
      ];
      (Affiliation.find as jest.Mock).mockResolvedValue(mockAffiliations);

      (Customer.countDocuments as jest.Mock).mockResolvedValue(6);
      (Payment.countDocuments as jest.Mock).mockResolvedValue(20);
      (Sale.countDocuments as jest.Mock).mockResolvedValue(15);

      const result = await getDashboardSummary();

      expect(Customer.find).toHaveBeenCalled();
      expect(Affiliation.find).toHaveBeenCalled();
      expect(Customer.countDocuments).toHaveBeenCalled();
      expect(Payment.countDocuments).toHaveBeenCalled();
      expect(Sale.countDocuments).toHaveBeenCalled();

      // Top customers by debt (descending)
      expect(result.topCustomers.map((c: any) => c._id)).toEqual([
        'c6',
        'c4',
        'c2',
        'c1',
        'c3',
      ]);

      // Top affiliations by totalDebt
      expect(result.topAffiliations[0].name).toBe('Aff2');
      expect(result.topAffiliations[0].totalDebt).toBe(600); // c2 (200) + c6 (400)
      expect(result.topAffiliations[1].name).toBe('Aff3');
      expect(result.topAffiliations[1].totalDebt).toBe(300); // c4 (300)
      expect(result.topAffiliations[2].name).toBe('Aff1');
      expect(result.topAffiliations[2].totalDebt).toBe(150); // c1 (100) + c3 (50)

      expect(result.totalCustomers).toBe(6);
      expect(result.totalPayments).toBe(20);
      expect(result.totalSales).toBe(15);
    });

    it('deve retornar listas vazias e totais zero se não houver dados', async () => {
      const mockPopulate = jest.fn().mockResolvedValue([]);
      (Customer.find as jest.Mock).mockReturnValue({ populate: mockPopulate });
      (Affiliation.find as jest.Mock).mockResolvedValue([]);
      (Customer.countDocuments as jest.Mock).mockResolvedValue(0);
      (Payment.countDocuments as jest.Mock).mockResolvedValue(0);
      (Sale.countDocuments as jest.Mock).mockResolvedValue(0);

      const result = await getDashboardSummary();

      expect(result.topCustomers).toEqual([]);
      expect(result.topAffiliations).toEqual([]);
      expect(result.totalCustomers).toBe(0);
      expect(result.totalPayments).toBe(0);
      expect(result.totalSales).toBe(0);
    });

    it('deve lançar erro se Customer.find falhar', async () => {
      (Customer.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockRejectedValue(new Error('DB error')),
      }));

      await expect(getDashboardSummary()).rejects.toThrow('DB error');
    });

    it('deve lançar erro se Affiliation.find falhar', async () => {
      const mockPopulate = jest.fn().mockResolvedValue([]);
      (Customer.find as jest.Mock).mockReturnValue({ populate: mockPopulate });
      (Affiliation.find as jest.Mock).mockRejectedValue(new Error('Aff error'));

      await expect(getDashboardSummary()).rejects.toThrow('Aff error');
    });

    it('deve lançar erro se Customer.countDocuments falhar', async () => {
      const mockPopulate = jest.fn().mockResolvedValue([]);
      (Customer.find as jest.Mock).mockReturnValue({ populate: mockPopulate });
      (Affiliation.find as jest.Mock).mockResolvedValue([]);
      (Customer.countDocuments as jest.Mock).mockRejectedValue(
        new Error('Count error')
      );

      await expect(getDashboardSummary()).rejects.toThrow('Count error');
    });

    it('deve calcular corretamente o totalDebt das topAffiliations mesmo com clientes sem affiliation', async () => {
      const mockCustomers = [
        {
          _id: 'c1',
          debt: 100,
          affiliation: { _id: 'a1', toString: () => 'a1' },
        },
        {
          _id: 'c2',
          debt: 200,
          affiliation: { _id: 'a2', toString: () => 'a2' },
        },
        { _id: 'c3', debt: 50, affiliation: null },
        {
          _id: 'c4',
          debt: 300,
          affiliation: { _id: 'a1', toString: () => 'a1' },
        },
        { _id: 'c5', debt: 10, affiliation: undefined },
        {
          _id: 'c6',
          debt: 400,
          affiliation: { _id: 'a2', toString: () => 'a2' },
        },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(mockCustomers);
      (Customer.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const mockAffiliations = [
        {
          _id: { toString: () => 'a1' },
          toObject: () => ({ _id: 'a1', name: 'Aff1' }),
        },
        {
          _id: { toString: () => 'a2' },
          toObject: () => ({ _id: 'a2', name: 'Aff2' }),
        },
        {
          _id: { toString: () => 'a3' },
          toObject: () => ({ _id: 'a3', name: 'Aff3' }),
        },
      ];
      (Affiliation.find as jest.Mock).mockResolvedValue(mockAffiliations);

      (Customer.countDocuments as jest.Mock).mockResolvedValue(6);
      (Payment.countDocuments as jest.Mock).mockResolvedValue(20);
      (Sale.countDocuments as jest.Mock).mockResolvedValue(15);

      const result = await getDashboardSummary();

      // Aff1: c1 (100) + c4 (300) = 400
      // Aff2: c2 (200) + c6 (400) = 600
      // Aff3: 0
      expect(result.topAffiliations).toEqual([
        expect.objectContaining({ name: 'Aff2', totalDebt: 600 }),
        expect.objectContaining({ name: 'Aff1', totalDebt: 400 }),
        expect.objectContaining({ name: 'Aff3', totalDebt: 0 }),
      ]);
    });

    it('deve retornar totalDebt 0 para affiliations sem clientes associados', async () => {
      const mockCustomers = [
        {
          _id: 'c1',
          debt: 100,
          affiliation: { _id: 'a1', toString: () => 'a1' },
        },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(mockCustomers);
      (Customer.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const mockAffiliations = [
        {
          _id: { toString: () => 'a1' },
          toObject: () => ({ _id: 'a1', name: 'Aff1' }),
        },
        {
          _id: { toString: () => 'a2' },
          toObject: () => ({ _id: 'a2', name: 'Aff2' }),
        },
      ];
      (Affiliation.find as jest.Mock).mockResolvedValue(mockAffiliations);

      (Customer.countDocuments as jest.Mock).mockResolvedValue(1);
      (Payment.countDocuments as jest.Mock).mockResolvedValue(2);
      (Sale.countDocuments as jest.Mock).mockResolvedValue(3);

      const result = await getDashboardSummary();

      expect(result.topAffiliations).toEqual([
        expect.objectContaining({ name: 'Aff1', totalDebt: 100 }),
        expect.objectContaining({ name: 'Aff2', totalDebt: 0 }),
      ]);
    });

    it('deve ordenar topAffiliations por totalDebt decrescente', async () => {
      const mockCustomers = [
        {
          _id: 'c1',
          debt: 10,
          affiliation: { _id: 'a1', toString: () => 'a1' },
        },
        {
          _id: 'c2',
          debt: 50,
          affiliation: { _id: 'a2', toString: () => 'a2' },
        },
        {
          _id: 'c3',
          debt: 30,
          affiliation: { _id: 'a1', toString: () => 'a1' },
        },
        {
          _id: 'c4',
          debt: 70,
          affiliation: { _id: 'a3', toString: () => 'a3' },
        },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(mockCustomers);
      (Customer.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const mockAffiliations = [
        {
          _id: { toString: () => 'a1' },
          toObject: () => ({ _id: 'a1', name: 'Aff1' }),
        },
        {
          _id: { toString: () => 'a2' },
          toObject: () => ({ _id: 'a2', name: 'Aff2' }),
        },
        {
          _id: { toString: () => 'a3' },
          toObject: () => ({ _id: 'a3', name: 'Aff3' }),
        },
      ];
      (Affiliation.find as jest.Mock).mockResolvedValue(mockAffiliations);

      (Customer.countDocuments as jest.Mock).mockResolvedValue(4);
      (Payment.countDocuments as jest.Mock).mockResolvedValue(5);
      (Sale.countDocuments as jest.Mock).mockResolvedValue(6);

      const result = await getDashboardSummary();

      // Aff3: 70, Aff1: 40, Aff2: 50
      expect(result.topAffiliations.map((a: any) => a.name)).toEqual([
        'Aff3',
        'Aff2',
        'Aff1',
      ]);
      expect(result.topAffiliations.map((a: any) => a.totalDebt)).toEqual([
        70, 50, 40,
      ]);
    });

    it('deve limitar topAffiliations a 5 itens', async () => {
      const mockCustomers = [
        {
          _id: 'c1',
          debt: 10,
          affiliation: { _id: 'a1', toString: () => 'a1' },
        },
        {
          _id: 'c2',
          debt: 20,
          affiliation: { _id: 'a2', toString: () => 'a2' },
        },
        {
          _id: 'c3',
          debt: 30,
          affiliation: { _id: 'a3', toString: () => 'a3' },
        },
        {
          _id: 'c4',
          debt: 40,
          affiliation: { _id: 'a4', toString: () => 'a4' },
        },
        {
          _id: 'c5',
          debt: 50,
          affiliation: { _id: 'a5', toString: () => 'a5' },
        },
        {
          _id: 'c6',
          debt: 60,
          affiliation: { _id: 'a6', toString: () => 'a6' },
        },
      ];
      const mockPopulate = jest.fn().mockResolvedValue(mockCustomers);
      (Customer.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const mockAffiliations = [
        {
          _id: { toString: () => 'a1' },
          toObject: () => ({ _id: 'a1', name: 'Aff1' }),
        },
        {
          _id: { toString: () => 'a2' },
          toObject: () => ({ _id: 'a2', name: 'Aff2' }),
        },
        {
          _id: { toString: () => 'a3' },
          toObject: () => ({ _id: 'a3', name: 'Aff3' }),
        },
        {
          _id: { toString: () => 'a4' },
          toObject: () => ({ _id: 'a4', name: 'Aff4' }),
        },
        {
          _id: { toString: () => 'a5' },
          toObject: () => ({ _id: 'a5', name: 'Aff5' }),
        },
        {
          _id: { toString: () => 'a6' },
          toObject: () => ({ _id: 'a6', name: 'Aff6' }),
        },
      ];
      (Affiliation.find as jest.Mock).mockResolvedValue(mockAffiliations);

      (Customer.countDocuments as jest.Mock).mockResolvedValue(6);
      (Payment.countDocuments as jest.Mock).mockResolvedValue(7);
      (Sale.countDocuments as jest.Mock).mockResolvedValue(8);

      const result = await getDashboardSummary();

      expect(result.topAffiliations.length).toBe(5);
      // Deve conter as 5 maiores dívidas
      const debts = result.topAffiliations.map((a: any) => a.totalDebt);
      expect(debts).toEqual([60, 50, 40, 30, 20]);
    });
  });
});
