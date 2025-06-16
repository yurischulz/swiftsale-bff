import { Payment } from '~/models/Payment';
import { Sale } from '~/models/Sale';
import { Customer } from '~/models/Customer';
import { Affiliation } from '~/models/Affiliation';

export async function getDashboardSummary(createdBy: string) {
  const customers = await Customer.find({ createdBy }).populate('affiliation');
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

  const affiliations = await Affiliation.find({ createdBy });
  const topAffiliations = affiliations
    .map((aff) => ({
      ...aff.toObject(),
      totalDebt: affiliationMap.get(aff._id.toString()) || 0,
    }))
    .sort((a, b) => b.totalDebt - a.totalDebt)
    .slice(0, 5);

  const totalPaymentsValue = await Payment.aggregate([
    { $match: { createdBy } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalSalesValue = await Sale.aggregate([
    { $match: { createdBy } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  return {
    topCustomers,
    topAffiliations,
    totalCustomers: await Customer.countDocuments({ createdBy }),
    totalPayments: await Payment.countDocuments({ createdBy }),
    totalSales: await Sale.countDocuments({ createdBy }),
    totalPaymentsAmount: totalPaymentsValue[0]?.total || 0,
    totalSalesAmount: totalSalesValue[0]?.total || 0,
  };
}
