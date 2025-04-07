import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// const configDB = {
//   host: process.env.DB_HOST || '0.0.0.0',
//   database: process.env.DB_NAME || 'postgres',
//   user: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'admin',
//   port: parseInt(process.env.DB_PORT || '5432'),
//   ssl: {
//     rejectUnauthorized: false  // Necessário para conexões externas seguras no Render
//   }
// };
const configDB = {
  connectionString: process.env.INTERNAL_DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false  // Necessário para conexões externas no Render
  // }
};

// console.log(configDB);

export const pool = new Pool(configDB);
