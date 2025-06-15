import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as productService from '~/services/product.service';

// Obtém todos os produtos
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  }
);

// Cria um novo produto
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  }
);

// Atualiza um produto existente
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(updatedProduct);
  }
);

// Exclui um produto
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(204).send();
  }
);
