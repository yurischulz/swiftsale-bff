import { Request, Response } from 'express';
import { asyncHandler } from '~/utils/asyncHandler';
import * as productService from '~/services/product.service';

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await productService.getAllProducts(req.user.uid);
    res.status(200).json(products);
  }
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body, req.user.uid);
    res.status(201).json(product);
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user.uid
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(updatedProduct);
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const deletedProduct = await productService.deleteProduct(
      req.params.id,
      req.user.uid
    );
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(204).send();
  }
);
