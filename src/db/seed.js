import { query } from "../lib/db.js";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Starting database seed...");

  try {
    // 1. Create tables if they do not exist
    console.log("Ensuring tables are initialized...");
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'USER' NOT NULL CHECK (role IN ('USER', 'ADMIN')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    await query(`
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

    // 2. Insert Demo User
    const demoEmail = "demo@scamshield.com";
    const demoPassword = "password123";
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(demoPassword, salt);
    const demoUserId = "demo-user-uuid-12345";

    // Clean existing seed data
    await query("DELETE FROM users WHERE email = $1", [demoEmail]);

    await query(
      "INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)",
      [demoUserId, "Demo User", demoEmail, passwordHash, "USER"]
    );
    console.log(`Demo user created: ${demoEmail} / ${demoPassword}`);

    // 3. Insert mock analyses
    const mockAnalyses = [
      {
        id: crypto.randomUUID(),
        type: "MESSAGE",
        input: "URGENT: Your account has been locked due to suspicious activity. Verify immediately at: https://secure-chase-update.net/login",
        risk_score: 95,
        risk_level: "HIGH",
        category: "Phishing",
        reasons: [
          "Creates high urgency and fear",
          "Attempts to impersonate Chase Bank branding",
          "Contains a suspicious unsecure link"
        ],
        recommendation: "Do NOT click the link. Block the sender and report the message.",
        note: "Simulated smishing attempt received on mobile phone."
      },
      {
        id: crypto.randomUUID(),
        type: "URL",
        input: "http://192.168.4.12/verify-identity",
        risk_score: 80,
        risk_level: "HIGH",
        category: "Credential Theft",
        reasons: [
          "Uses raw IP address instead of a domain name",
          "Does not use secure HTTPS protocol",
          "Contains suspicious login/verification keyword"
        ],
        recommendation: "Do NOT navigate to this IP address. Phishing sites frequently use raw IPs to bypass domain reputation checks.",
        note: "Found in a spam email attachment link."
      },
      {
        id: crypto.randomUUID(),
        type: "MESSAGE",
        input: "Hey Jane, are we still on for dinner tonight at 7 PM? Let me know!",
        risk_score: 10,
        risk_level: "LOW",
        category: "Safe",
        reasons: [
          "Normal conversational text",
          "No urgent calls-to-action",
          "No credential requests"
        ],
        recommendation: "Safe to read and reply.",
        note: "Legitimate personal SMS."
      },
      {
        id: crypto.randomUUID(),
        type: "URL",
        input: "https://www.wikipedia.org",
        risk_score: 5,
        risk_level: "LOW",
        category: "Safe",
        reasons: [
          "Uses secure HTTPS",
          "Trusted top-level domain (.org)",
          "No suspicious character patterns"
        ],
        recommendation: "Safe to visit.",
        note: "Reference lookup link."
      }
    ];

    for (const item of mockAnalyses) {
      await query(
        `INSERT INTO analyses (
          id, user_id, type, input, risk_score, risk_level, category, reasons, recommendation, note
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          item.id,
          demoUserId,
          item.type,
          item.input,
          item.risk_score,
          item.risk_level,
          item.category,
          JSON.stringify(item.reasons),
          item.recommendation,
          item.note
        ]
      );
    }

    console.log("Successfully seeded mock scam analysis items.");
    console.log("Database seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("Database seeding failed:", err);
    process.exit(1);
  }
}

seed();
