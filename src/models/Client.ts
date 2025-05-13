import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    affiliation: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliation' },
    email: { type: String },
    notes: { type: String },
    credit: { type: Number, default: 0 },
    debt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Client = mongoose.model('Client', clientSchema);
