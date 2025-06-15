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

// Atualmente o método não está exposto na API, mas é utilizado internamente
// para atualizar uma afiliação, então não há necessidade de validação de ID
// pois o ID já foi validado no controller.
// Se for necessário expor esse método, remover comentário abaixo.
// istanbul ignore next
export async function getAffiliationById(id: string) {
  const affiliation = await Affiliation.findById(id);
  if (!affiliation) return null;
  return affiliation;
}

export async function createAffiliation(data: CreateAffiliationRequest) {
  const affiliation = new Affiliation(data);
  return await affiliation.save();
}

export async function updateAffiliation(
  id: string,
  data: CreateAffiliationRequest
) {
  const updated = await Affiliation.findByIdAndUpdate(id, data, { new: true });
  if (!updated) return null;
  return updated;
}

export async function deleteAffiliation(id: string) {
  const deleted = await Affiliation.findByIdAndDelete(id);
  if (!deleted) return null;
  return deleted;
}
