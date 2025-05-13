import { Client } from '../models/Customer';
import { Affiliation } from '../models/Affiliation';

export async function getAllAffiliations(): Promise<any[]> {
  const affiliations = await Affiliation.find();
  return await Promise.all(
    affiliations.map(async (aff) => {
      const clients = await Client.find({ affiliation: aff._id });
      const totalDebt = clients.reduce((sum, c) => sum + c.debt, 0);
      return { ...aff.toObject(), totalDebt };
    })
  );
}

export async function createAffiliation(data: any) {
  const affiliation = new Affiliation(data);
  return await affiliation.save();
}

export async function updateAffiliation(id: string, data: any) {
  return await Affiliation.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteAffiliation(id: string) {
  return await Affiliation.findByIdAndDelete(id);
}
