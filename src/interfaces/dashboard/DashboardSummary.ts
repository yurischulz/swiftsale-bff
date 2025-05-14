import { Affiliation } from '../Affiliation';
import { customer } from '../customer';

export interface DashboardSummary {
  topcustomers: customer[]; // Lista dos principais customers
  topAffiliations: Affiliation[]; // Lista das principais afiliações
  totalcustomers: number; // Total de customers
  totalPayments: number; // Total de pagamentos
  totalSales: number; // Total de vendas
}
