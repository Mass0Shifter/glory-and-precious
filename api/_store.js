// Records storage for the wedding site, using the private Vercel Blob store
// "glory-precious-records" (connected to this project; token in BLOB_READ_WRITE_TOKEN).
// Every RSVP, gift attempt and visit is saved as its own small private file.
import { put, list, get } from "@vercel/blob";

export function storeReady() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Storage is not connected. In Vercel: Storage → connect the glory-precious-records Blob store to this project.");
}

const safe = (v, n = 40) => String(v ?? "").replace(/[^A-Za-z0-9.-]+/g, "_").slice(0, n) || "-";

// Save one record (RSVP or gift attempt) as a private JSON file.
export async function saveRecord(folder, record) {
  storeReady();
  const created_at = new Date().toISOString();
  await put(`${folder}/${created_at}.json`, JSON.stringify({ created_at, ...record }), {
    access: "private", addRandomSuffix: true, contentType: "application/json"
  });
}

// Visits keep their details in the file name so the admin page can count them without opening each file.
export async function saveVisit({ session, referrer, device, country }) {
  storeReady();
  const ts = new Date().toISOString();
  const name = [ts, safe(device, 12), safe(country, 4), safe(referrer, 60), safe(session, 40)].join("~");
  await put(`visits/${name}.txt`, "1", { access: "private", addRandomSuffix: true, contentType: "text/plain" });
}

export async function listAll(prefix) {
  const out = []; let cursor;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    out.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

export async function readRecords(prefix) {
  const blobs = await listAll(prefix);
  const rows = [];
  for (let i = 0; i < blobs.length; i += 25) {
    const batch = await Promise.all(blobs.slice(i, i + 25).map(async b => {
      try {
        const r = await get(b.pathname, { access: "private" });
        if (!r || r.statusCode !== 200 || !r.stream) return null;
        return { id: b.pathname, ...JSON.parse(await new Response(r.stream).text()) };
      } catch { return null; }
    }));
    rows.push(...batch.filter(Boolean));
  }
  return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export function parseVisit(pathname) {
  const base = pathname.replace(/^visits\//, "").replace(/\.txt$/, "");
  const [ts, device, country, referrer, session] = base.split("~");
  return { ts, device, country, referrer: referrer === "-" ? "" : referrer, session: (session || "").replace(/-[A-Za-z0-9]+$/, "") };
}

// Trim and cap text so nobody can stuff huge values into storage.
export const clip = (v, n = 200) => (v == null ? null : String(v).trim().slice(0, n) || null);
export const num = v => { const x = Number(v); return v !== null && v !== "" && Number.isFinite(x) && x >= 0 && x < 1e12 ? x : null; };

export function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch { return {}; }
}

export function onlyPost(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); res.status(405).json({ ok: false, error: "Use POST" }); return false; }
  return true;
}
