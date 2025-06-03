import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '~/services/product.service';
import { Product } from '~/models/Product';

jest.mock('~/models/Product', () => {
  const mockSave = jest.fn();
  const Product = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave,
  }));
  (Product as any).find = jest.fn();
  (Product as any).findByIdAndUpdate = jest.fn();
  (Product as any).findByIdAndDelete = jest.fn();
  return { Product, __esModule: true };
});

describe('product.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('deve retornar todos os produtos', async () => {
      const mockProducts = [{ _id: 'p1' }, { _id: 'p2' }];
      (Product.find as jest.Mock).mockResolvedValue(mockProducts);

      const result = await getAllProducts();

      expect(Product.find).toHaveBeenCalled();
      expect(result).toBe(mockProducts);
    });

    it('deve lançar erro se Product.find falhar', async () => {
      (Product.find as jest.Mock).mockRejectedValue(new Error('find error'));

      await expect(getAllProducts()).rejects.toThrow('find error');
      expect(Product.find).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('deve criar e salvar um novo produto', async () => {
      const mockSave = jest
        .fn()
        .mockResolvedValue({ _id: 'p1', name: 'Produto' });
      (Product as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));

      const data = { name: 'Produto', price: 10 };
      const result = await createProduct(data as any);

      expect(Product).toHaveBeenCalledWith(data);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({ _id: 'p1', name: 'Produto' });
    });

    it('deve lançar erro se save falhar', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('save error'));
      (Product as unknown as jest.Mock).mockImplementation((data) => ({
        ...data,
        save: mockSave,
      }));

      const data = { name: 'Produto', price: 10 };
      await expect(createProduct(data as any)).rejects.toThrow('save error');
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar e retornar o produto atualizado', async () => {
      const updated = { _id: 'p1', name: 'Novo Produto' };
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

      const result = await updateProduct('p1', {
        name: 'Novo Produto',
        price: 20,
      } as any);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        'p1',
        { name: 'Novo Produto', price: 20 },
        { new: true }
      );
      expect(result).toBe(updated);
    });

    it('deve lançar erro se update falhar', async () => {
      (Product.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error('update error')
      );

      await expect(
        updateProduct('p1', { name: 'Novo Produto', price: 20 } as any)
      ).rejects.toThrow('update error');
      expect(Product.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('deve passar os dados corretos para update', async () => {
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: 'p2',
        name: 'Produto 2',
      });

      const data = { name: 'Produto 2', price: 30 };
      await updateProduct('p2', data as any);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('p2', data, {
        new: true,
      });
    });
  });

  describe('deleteProduct', () => {
    it('deve deletar e retornar o produto deletado', async () => {
      const deleted = { _id: 'p1', name: 'Produto' };
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(deleted);

      const result = await deleteProduct('p1');

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('p1');
      expect(result).toBe(deleted);
    });

    it('deve lançar erro se delete falhar', async () => {
      (Product.findByIdAndDelete as jest.Mock).mockRejectedValue(
        new Error('delete error')
      );

      await expect(deleteProduct('p1')).rejects.toThrow('delete error');
      expect(Product.findByIdAndDelete).toHaveBeenCalled();
    });

    it('deve retornar null se produto não existir', async () => {
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await deleteProduct('notfound');

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('notfound');
      expect(result).toBeNull();
    });
  });
});
