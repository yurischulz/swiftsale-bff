import { Affiliation } from '../Affiliation';
import { customer } from '../customer';

export interface DashboardSummary {
  topcustomers: customer[];
  topAffiliations: Affiliation[];
  totalcustomers: number;
  totalPayments: number;
  totalSales: number;
}
