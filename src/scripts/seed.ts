import dotenv from 'dotenv';
dotenv.config();
import { connectDatabase } from '../config/database';
import { Product } from '../models/Product';
import { Client } from '../models/Client';
import { Affiliation } from '../models/Affiliation';

(async () => {
  await connectDatabase();

  const aff = await Affiliation.create({
    name: 'Instituição Padrão',
    address: 'Rua Central, 123',
    phone: '999999999',
  });

  const client = await Client.create({
    name: 'Cliente Exemplo',
    phone: '888888888',
    address: 'Rua 1',
    affiliation: aff._id,
  });

  await Product.insertMany([
    { name: 'Camisa Básica', unitPrice: 30 },
    { name: 'Calça Jeans', unitPrice: 90 },
    { name: 'Vestido Florido', unitPrice: 120 },
  ]);

  console.log('✅ Dados inseridos com sucesso');
  process.exit();
})();
