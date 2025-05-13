import { Affiliation } from '../Affiliation';
import { Client } from '../customer';

export interface DashboardSummary {
  topClients: Client[]; // Lista dos principais clientes
  topAffiliations: Affiliation[]; // Lista das principais afiliações
  totalClients: number; // Total de clientes
  totalPayments: number; // Total de pagamentos
  totalSales: number; // Total de vendas
}
