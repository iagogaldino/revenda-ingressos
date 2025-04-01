
import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

async function runMigration() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../migrations/init.sql'), 'utf8');
    await pool.query(sql);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
