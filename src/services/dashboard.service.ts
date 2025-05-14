import { Payment } from '../models/Payment';
import { Sale } from '../models/Sale';
import { Customer } from '../models/Customer';
import { Affiliation } from '../models/Affiliation';

export async function getDashboardSummary() {
  const customers = await Customer.find().populate('affiliation');
  const topCustomers = [...customers]
    .sort((a, b) => b.debt - a.debt)
    .slice(0, 5);

  const affiliationMap = new Map<string, number>();
  customers.forEach((c) => {
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
    topCustomers,
    topAffiliations,
    totalCustomers: await Customer.countDocuments(),
    totalPayments: await Payment.countDocuments(),
    totalSales: await Sale.countDocuments(),
  };
}
