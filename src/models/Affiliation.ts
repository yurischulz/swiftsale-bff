import mongoose from 'mongoose';

const AffiliationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const Affiliation =
  mongoose.models.Affiliation ||
  mongoose.model('Affiliation', AffiliationSchema);
