// Private data for the admin page. Needs ADMIN_PASSWORD (Vercel → Settings → Environment Variables).
import crypto from "node:crypto";
import { storeReady, readRecords, listAll, parseVisit } from "./_store.js";

function allowed(req) {
  const want = process.env.ADMIN_PASSWORD || "";
  const got = String((req.headers && req.headers["x-admin-key"]) || "");
  if (!want || !got) return false;
  const a = crypto.createHash("sha256").update(want).digest();
  const b = crypto.createHash("sha256").update(got).digest();
  return crypto.timingSafeEqual(a, b);
}

const lagosDay = iso => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" }); // YYYY-MM-DD

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ ok: false, error: "Admin password is not set yet. Add ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy." });
  if (!allowed(req)) { await new Promise(r => setTimeout(r, 600)); return res.status(401).json({ ok: false, error: "Wrong password" }); }
  try {
    storeReady();
    const [rsvps, gifts, visitBlobs] = await Promise.all([readRecords("rsvps/"), readRecords("gifts/"), listAll("visits/")]);
    const visits = visitBlobs.map(b => parseVisit(b.pathname));
    const since = Date.now() - 30 * 864e5;
    const byDayMap = {}, srcMap = {};
    for (const v of visits) {
      if (Date.parse(v.ts) >= since) { const d = lagosDay(v.ts); byDayMap[d] = (byDayMap[d] || 0) + 1; }
      const s = v.referrer || "Direct / WhatsApp app"; srcMap[s] = (srcMap[s] || 0) + 1;
    }
    res.status(200).json({
      ok: true, rsvps, gifts,
      visits: {
        visits: visits.length,
        visitors: new Set(visits.map(v => v.session).filter(s => s && s !== "-")).size,
        byDay: Object.entries(byDayMap).sort().map(([day, n]) => ({ day, visits: n })),
        sources: Object.entries(srcMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, n]) => ({ source, visits: n }))
      }
    });
  } catch (e) {
    console.error("admin", e);
    res.status(500).json({ ok: false, error: e.message || "Could not load data" });
  }
}
