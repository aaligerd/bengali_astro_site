import { Pool } from "pg";

let pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  // Prevent multiple pool instances during Next.js hot reloads in development
  if (!global.postgresPool) {
    global.postgresPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = global.postgresPool;
}

export async function query(text, params) {
  return pool.query(text, params);
}

export default pool;
