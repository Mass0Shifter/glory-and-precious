// Private data for the admin page. Needs the ADMIN_PASSWORD set in Vercel → Settings → Environment Variables.
import crypto from "node:crypto";
import { sql, ensureTables } from "./_db.js";

function allowed(req) {
  const want = process.env.ADMIN_PASSWORD || "";
  const got = String((req.headers && req.headers["x-admin-key"]) || "");
  if (!want || !got) return false;
  const a = crypto.createHash("sha256").update(want).digest();
  const b = crypto.createHash("sha256").update(got).digest();
  return crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ ok: false, error: "Admin password is not set yet. Add ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy." });
  if (!allowed(req)) { await new Promise(r => setTimeout(r, 600)); return res.status(401).json({ ok: false, error: "Wrong password" }); }
  try {
    await ensureTables();
    const [rsvps, gifts, visitTotals, visitDays, visitSources] = await Promise.all([
      sql`SELECT id, created_at, name, phone, attending, guests, note, sent_to FROM rsvps ORDER BY created_at DESC LIMIT 5000`,
      sql`SELECT id, created_at, action, name, amount, currency, item, method, account, message FROM gifts ORDER BY created_at DESC LIMIT 5000`,
      sql`SELECT count(*)::int AS visits, count(DISTINCT session)::int AS visitors FROM visits`,
      sql`SELECT to_char(created_at AT TIME ZONE 'Africa/Lagos', 'YYYY-MM-DD') AS day, count(*)::int AS visits
          FROM visits WHERE created_at > now() - interval '30 days' GROUP BY 1 ORDER BY 1`,
      sql`SELECT COALESCE(NULLIF(referrer,''),'Direct / WhatsApp app') AS source, count(*)::int AS visits
          FROM visits GROUP BY 1 ORDER BY 2 DESC LIMIT 8`
    ]);
    res.status(200).json({ ok: true, rsvps, gifts, visits: { ...visitTotals[0], byDay: visitDays, sources: visitSources } });
  } catch (e) {
    console.error("admin", e);
    res.status(500).json({ ok: false, error: e.message || "Could not load data" });
  }
}
