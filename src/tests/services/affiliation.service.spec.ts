import {
  getAllAffiliations,
  createAffiliation,
  updateAffiliation,
  deleteAffiliation,
} from '~/services/affiliation.service';
import { Affiliation } from '~/models/Affiliation';
import { Customer } from '~/models/Customer';

jest.mock('~/models/Affiliation', () => {
  const mockSave = jest.fn();
  const mockFind = jest.fn();
  const mockFindByIdAndUpdate = jest.fn();
  const mockFindByIdAndDelete = jest.fn();

  const Affiliation = jest.fn().mockImplementation(() => ({
    save: mockSave,
  })) as unknown as {
    find: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };

  Affiliation.find = mockFind;
  Affiliation.findByIdAndUpdate = mockFindByIdAndUpdate;
  Affiliation.findByIdAndDelete = mockFindByIdAndDelete;

  return { Affiliation };
});

jest.mock('~/models/Customer', () => ({
  Customer: {
    find: jest.fn(),
  },
}));

describe('Affiliation Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAffiliations', () => {
    it('should return all affiliations with total debt', async () => {
      const mockAffiliations = [
        {
          _id: '1',
          toObject: jest
            .fn()
            .mockReturnValue({ _id: '1', name: 'Affiliation 1' }),
        },
        {
          _id: '2',
          toObject: jest
            .fn()
            .mockReturnValue({ _id: '2', name: 'Affiliation 2' }),
        },
      ];
      const mockCustomers = [{ debt: 100 }, { debt: 200 }];

      (Affiliation.find as jest.Mock).mockResolvedValue(mockAffiliations);
      (Customer.find as jest.Mock).mockResolvedValue(mockCustomers);

      const result = await getAllAffiliations();

      expect(Affiliation.find).toHaveBeenCalledTimes(1);
      expect(Customer.find).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        { _id: '1', name: 'Affiliation 1', totalDebt: 300 },
        { _id: '2', name: 'Affiliation 2', totalDebt: 300 },
      ]);
    });

    it('should handle empty affiliations', async () => {
      (Affiliation.find as jest.Mock).mockResolvedValue([]);
      const result = await getAllAffiliations();

      expect(Affiliation.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('createAffiliation', () => {
    it('should create a new affiliation', async () => {
      const mockData = {
        name: 'New Affiliation',
        address: '123 Street',
        phone: '123456789',
      };
      const mockAffiliation = { save: jest.fn().mockResolvedValue(mockData) };

      (Affiliation as any).mockImplementation(() => mockAffiliation);

      const result = await createAffiliation(mockData);

      expect(Affiliation).toHaveBeenCalledWith(mockData);
      expect(mockAffiliation.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when creating an affiliation', async () => {
      const mockData = {
        name: 'New Affiliation',
        address: '123 Street',
        phone: '123456789',
      };

      (Affiliation as any).mockImplementation(() => ({
        save: jest
          .fn()
          .mockRejectedValue(new Error('Failed to save affiliation')),
      }));

      await expect(createAffiliation(mockData)).rejects.toThrow(
        'Failed to save affiliation'
      );
    });
  });

  describe('updateAffiliation', () => {
    it('should update an existing affiliation', async () => {
      const mockId = '1';
      const mockData = {
        name: 'Updated Affiliation',
        address: '123 Street',
        phone: '123456789',
      };
      const mockUpdatedAffiliation = { _id: '1', ...mockData };

      (Affiliation.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        mockUpdatedAffiliation
      );

      const result = await updateAffiliation(mockId, mockData);

      expect(Affiliation.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        mockData,
        { new: true }
      );
      expect(result).toEqual(mockUpdatedAffiliation);
    });

    it('should handle errors when updating an affiliation', async () => {
      const mockId = '1';
      const mockData = {
        name: 'Updated Affiliation',
        address: '123 Street',
        phone: '123456789',
      };

      (Affiliation.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Failed to update affiliation')
      );

      await expect(updateAffiliation(mockId, mockData)).rejects.toThrow(
        'Failed to update affiliation'
      );
    });
  });

  describe('deleteAffiliation', () => {
    it('should delete an affiliation', async () => {
      const mockId = '1';
      const mockDeletedAffiliation = { _id: '1', name: 'Deleted Affiliation' };

      (Affiliation.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockDeletedAffiliation
      );

      const result = await deleteAffiliation(mockId);

      expect(Affiliation.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockDeletedAffiliation);
    });

    it('should handle errors when deleting an affiliation', async () => {
      const mockId = '1';

      (Affiliation.findByIdAndDelete as jest.Mock).mockRejectedValue(
        new Error('Failed to delete affiliation')
      );

      await expect(deleteAffiliation(mockId)).rejects.toThrow(
        'Failed to delete affiliation'
      );
    });
  });
});
