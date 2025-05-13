import { Client } from '../models/Client';

export async function getAllClients() {
  return await Client.find();
}

export async function createClient(data: any) {
  const client = new Client(data);
  return await client.save();
}

export async function updateClient(id: string, data: any) {
  return await Client.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteClient(id: string) {
  return await Client.findByIdAndDelete(id);
}
