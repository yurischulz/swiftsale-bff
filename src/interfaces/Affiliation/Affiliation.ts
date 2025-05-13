export interface Affiliation {
  _id?: string; // Opcional para novas afiliações
  name: string;
  address: string;
  phone: string;
  totalDebt?: number; // Total de dívidas associadas à afiliação
  createdAt?: Date;
  updatedAt?: Date;
}
