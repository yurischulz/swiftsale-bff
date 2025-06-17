import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer',
      required: true,
    },
    amount: { type: Number, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
