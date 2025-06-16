import { Customer } from '~/models/Customer';
import { Affiliation } from '~/models/Affiliation';
import { CreateAffiliationRequest } from '~/interfaces/Affiliation';

export async function getAllAffiliations(createdBy: string): Promise<any[]> {
  const affiliations = (await Affiliation.find()) || [];
  return await Promise.all(
    affiliations.map(async (aff) => {
      const customers =
        (await Customer.find({ affiliation: aff._id, createdBy })) || [];
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
export async function getAffiliationById(id: string, createdBy: string) {
  const affiliation = await Affiliation.findById({ _id: id, createdBy });
  if (!affiliation) return null;
  return affiliation;
}

export async function createAffiliation(
  data: CreateAffiliationRequest,
  createdBy: string
) {
  const affiliation = new Affiliation({ ...data, createdBy });
  return await affiliation.save();
}

export async function updateAffiliation(
  id: string,
  data: CreateAffiliationRequest,
  createdBy: string
) {
  const updated = await Affiliation.findByIdAndUpdate(
    { _id: id, createdBy },
    data,
    { new: true }
  );
  if (!updated) return null;
  return updated;
}

export async function deleteAffiliation(id: string, createdBy: string) {
  const deleted = await Affiliation.findByIdAndDelete({ _id: id, createdBy });
  if (!deleted) return null;
  return deleted;
}
