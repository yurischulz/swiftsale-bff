import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    affiliation: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliation' },
    email: { type: String },
    notes: { type: String },
    credit: { type: Number, default: 0 },
    debt: { type: Number, default: 0 },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Customer =
  mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
