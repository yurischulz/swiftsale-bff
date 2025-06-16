import { CreateProductRequest } from '~/interfaces/Product';
import { Product } from '~/models/Product';

export async function getAllProducts(createdBy: string) {
  return await Product.find({ createdBy });
}

export async function createProduct(
  data: CreateProductRequest,
  createdBy: string
) {
  const product = new Product({ ...data, createdBy });
  return await product.save();
}

export async function updateProduct(
  id: string,
  data: CreateProductRequest,
  createdBy: string
) {
  return await Product.findByIdAndUpdate({ _id: id, createdBy }, data, {
    new: true,
  });
}

export async function deleteProduct(id: string, createdBy: string) {
  return await Product.findByIdAndDelete({ _id: id, createdBy });
}
