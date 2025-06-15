import mongoose from 'mongoose';

import { Customer } from '~/models/Customer';
import { Affiliation } from '~/models/Affiliation';
import { CreateAffiliationRequest } from '~/interfaces/Affiliation';

export async function getAllAffiliations(): Promise<any[]> {
  const affiliations = (await Affiliation.find()) || [];
  return await Promise.all(
    affiliations.map(async (aff) => {
      const customers = (await Customer.find({ affiliation: aff._id })) || [];
      const totalDebt = customers.reduce((sum, c) => sum + (c.debt || 0), 0);
      return { ...aff.toObject(), totalDebt };
    })
  );
}

export async function getAffiliationById(id: string) {
  // Atualmente o método não está exposto na API, mas é utilizado internamente
  // para atualizar uma afiliação, então não há necessidade de validação de ID
  // pois o ID já foi validado no controller.
  // Se for necessário expor esse método, remover comentário abaixo.
  // istanbul ignore next
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new mongoose.Error.CastError('ObjectId', id, 'id');
  }
  const affiliation = await Affiliation.findById(id);
  if (!affiliation) return null;
  return affiliation;
}

export async function createAffiliation(data: CreateAffiliationRequest) {
  if (!data || !data.name || !data.address || !data.phone) {
    throw new Error('Dados obrigatórios ausentes para criar afiliação');
  }
  const affiliation = new Affiliation(data);
  console.log('Creating affiliation:', affiliation);
  return await affiliation.save();
}

export async function updateAffiliation(
  id: string,
  data: CreateAffiliationRequest
) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new mongoose.Error.CastError('ObjectId', id, 'id');
  }
  const updated = await Affiliation.findByIdAndUpdate(id, data, { new: true });
  if (!updated) return null;
  return updated;
}

export async function deleteAffiliation(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new mongoose.Error.CastError('ObjectId', id, 'id');
  }
  const deleted = await Affiliation.findByIdAndDelete(id);
  if (!deleted) return null;
  return deleted;
}
