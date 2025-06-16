import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
