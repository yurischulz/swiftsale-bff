import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer',
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        createdBy: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Sale = mongoose.model('Sale', saleSchema);
