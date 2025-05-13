import { Payment } from '../models/Payment';
import { Sale } from '../models/Sale';
import { Client } from '../models/Client';
import { Affiliation } from '../models/Affiliation';

export async function getDashboardSummary() {
  const clients = await Client.find().populate('affiliation');
  const topClients = [...clients].sort((a, b) => b.debt - a.debt).slice(0, 5);

  const affiliationMap = new Map<string, number>();
  clients.forEach((c) => {
    const id = c.affiliation?._id?.toString();
    if (id) {
      affiliationMap.set(id, (affiliationMap.get(id) || 0) + c.debt);
    }
  });

  const affiliations = await Affiliation.find();
  const topAffiliations = affiliations
    .map((aff) => ({
      ...aff.toObject(),
      totalDebt: affiliationMap.get(aff._id.toString()) || 0,
    }))
    .sort((a, b) => b.totalDebt - a.totalDebt)
    .slice(0, 5);

  return {
    topClients,
    topAffiliations,
    totalClients: await Client.countDocuments(),
    totalPayments: await Payment.countDocuments(),
    totalSales: await Sale.countDocuments(),
  };
}
