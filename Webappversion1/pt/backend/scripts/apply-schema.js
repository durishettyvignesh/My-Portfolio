const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function parseMysqlUrl(mysqlUrl) {
  const u = new URL(mysqlUrl);
  const host = u.hostname;
  const port = u.port ? Number(u.port) : 3306;
  const user = decodeURIComponent(u.username);
  const password = decodeURIComponent(u.password);
  const database = u.pathname && u.pathname !== '/' ? u.pathname.slice(1) : undefined;
  return { host, port, user, password, database };
}

async function main() {
  const sqlPath = path.join(__dirname, '..', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const cfg = parseMysqlUrl(process.env.DATABASE_URL);
  // Connect WITHOUT database first so we can CREATE DATABASE and USE it
  const connection = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    multipleStatements: true,
  });

  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await connection.query(stmt);
  }
  await connection.end();
  console.log('Schema applied.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


