import crypto from "crypto";
import { cookies } from "next/headers";

const ALGORITHM = "aes-256-cbc";
const SECRET = process.env.SESSION_SECRET || "a-very-long-secret-key-of-at-least-32-chars-for-aes";

// Generate a 32-byte key deterministically using scrypt
const KEY = crypto.scryptSync(SECRET, "scamshield-salt", 32);

/**
 * Encrypts a session object into an AES token
 * @param {object} sessionObj 
 * @returns {string}
 */
export function encryptSession(sessionObj) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(JSON.stringify(sessionObj), "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts an AES token back into a session object
 * @param {string} sessionToken 
 * @returns {object|null}
 */
export function decryptSession(sessionToken) {
  try {
    const parts = sessionToken.split(":");
    const ivHex = parts[0];
    const encryptedHex = parts[1];
    
    if (!ivHex || !encryptedHex) return null;
    
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return JSON.parse(decrypted);
  } catch (err) {
    return null;
  }
}

/**
 * Gets the current active session from HTTP-only cookies
 * @returns {Promise<object|null>}
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;

  const session = decryptSession(sessionToken);
  if (!session) return null;

  // Check expiration
  if (new Date(session.expiresAt) < new Date()) {
    return null;
  }

  return session;
}

/**
 * Sets an HTTP-only session cookie for the user
 * @param {object} user 
 */
export async function setSession(user) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
  const sessionObj = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "USER",
    expiresAt,
  };

  const token = encryptSession(sessionObj);
  const cookieStore = await cookies();
  
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Destroys the current active session (logs out)
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
