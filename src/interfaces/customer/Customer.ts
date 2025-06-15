export interface customer {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  debt?: number;
  credit?: number;
  affiliation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
