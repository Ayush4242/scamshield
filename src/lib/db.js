import pg from "pg";
import fs from "fs";
import path from "path";

// Auto-detect DATABASE_URL from process.env or .env file
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match) {
        connectionString = match[1];
      }
    }
  } catch (e) {}
}

if (!connectionString) {
  connectionString = "postgresql://postgres:123456789@127.0.0.1:5432/scamshield";
}

const pool = new pg.Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle database client:", err);
});

let tablesInitialized = false;

/**
 * Ensures required database tables (users, analyses) exist
 */
export async function ensureTablesExist() {
  if (tablesInitialized) return;
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'USER' NOT NULL CHECK (role IN ('USER', 'ADMIN')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS analyses (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('URL', 'MESSAGE')),
        input TEXT NOT NULL,
        risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
        risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
        category TEXT NOT NULL,
        reasons JSONB NOT NULL,
        recommendation TEXT NOT NULL,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    tablesInitialized = true;
    console.log("ScamShield database tables verified/initialized.");
  } catch (err) {
    console.error("Failed to auto-initialize database tables:", err.message || err);
  }
}

/**
 * Execute parameterized query safely with auto table initialization
 * @param {string} text 
 * @param {any[]} params 
 */
export async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    // If table relation does not exist (PostgreSQL code 42P01), create schema and retry
    if (err.code === "42P01") {
      console.log("Database table missing. Auto-creating database schema...");
      await ensureTablesExist();
      return await pool.query(text, params);
    }
    throw err;
  }
}

export default pool;
