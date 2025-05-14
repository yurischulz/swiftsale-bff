import { CreateProductRequest } from '~/interfaces/Product';
import { Product } from '~/models/Product';

export async function getAllProducts() {
  return await Product.find();
}

export async function createProduct(data: CreateProductRequest) {
  const product = new Product(data);
  return await product.save();
}

export async function updateProduct(id: string, data: CreateProductRequest) {
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProduct(id: string) {
  return await Product.findByIdAndDelete(id);
}
