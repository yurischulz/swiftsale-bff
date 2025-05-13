import mongoose from 'mongoose';

const affiliationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const Affiliation = mongoose.model('Affiliation', affiliationSchema);
