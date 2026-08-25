import pg from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/scamshield";

const pool = new pg.Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle database client:", err);
});

/**
 * Execute parameterized query safely
 * @param {string} text 
 * @param {any[]} params 
 */
export async function query(text, params) {
  return await pool.query(text, params);
}

export default pool;
