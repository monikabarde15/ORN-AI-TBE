const fs = require('fs');
const { Client } = require('pg');

(async () => {
  const sql = fs.readFileSync('./drizzle/0025_add_city_and_arrays.sql', 'utf8');
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    console.error('DATABASE_URL not set');
    process.exit(2);
  }

  const client = new Client({ connectionString: conn });
  try {
    await client.connect();
    console.log('Connected, running migration...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    process.exit(1);
  } finally {
    await client.end();
  }
})();
