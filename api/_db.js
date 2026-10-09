// Shared database helper for the wedding site (Neon Postgres via Vercel Storage).
// Tables are created automatically the first time any endpoint runs.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
export const sql = url ? neon(url) : null;

let ready = null;
export function ensureTables() {
  if (!sql) throw new Error("Database is not connected. In Vercel: Storage → connect a Neon Postgres database to this project.");
  if (!ready) {
    ready = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        name TEXT NOT NULL,
        phone TEXT,
        attending TEXT NOT NULL,
        guests INT NOT NULL DEFAULT 0,
        note TEXT,
        sent_to TEXT
      )`;
      await sql`CREATE TABLE IF NOT EXISTS gifts (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        action TEXT NOT NULL,
        name TEXT,
        amount NUMERIC,
        currency TEXT,
        item TEXT,
        method TEXT,
        account TEXT,
        message TEXT,
        session TEXT
      )`;
      await sql`CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        session TEXT,
        referrer TEXT,
        device TEXT,
        country TEXT,
        city TEXT
      )`;
    })().catch(e => { ready = null; throw e; });
  }
  return ready;
}

// Trim and cap text so nobody can stuff huge values into the database.
export const clip = (v, n = 200) => (v == null ? null : String(v).trim().slice(0, n) || null);
export const num = v => { const x = Number(v); return Number.isFinite(x) && x >= 0 && x < 1e12 ? x : null; };

export function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch { return {}; }
}

export function onlyPost(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); res.status(405).json({ ok: false, error: "Use POST" }); return false; }
  return true;
}
