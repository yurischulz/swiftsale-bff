import { Customer } from '../models/Customer';
import { Affiliation } from '../models/Affiliation';
import { CreateAffiliationRequest } from '~/interfaces/Affiliation';

export async function getAllAffiliations(): Promise<any[]> {
  const affiliations = await Affiliation.find();
  return await Promise.all(
    affiliations.map(async (aff) => {
      const customers = await Customer.find({ affiliation: aff._id });
      const totalDebt = customers.reduce((sum, c) => sum + c.debt, 0);
      return { ...aff.toObject(), totalDebt };
    })
  );
}

export async function getAffiliationById(id: string) {
  return await Affiliation.findById(id);
}

export async function createAffiliation(data: CreateAffiliationRequest) {
  const affiliation = new Affiliation(data);
  return await affiliation.save();
}

export async function updateAffiliation(
  id: string,
  data: CreateAffiliationRequest
) {
  return await Affiliation.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteAffiliation(id: string) {
  return await Affiliation.findByIdAndDelete(id);
}
