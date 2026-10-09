// Saves an RSVP. Guests still send their reply on WhatsApp; this keeps a copy for the couple.
import { sql, ensureTables, clip, body, onlyPost } from "./_db.js";

const ATTENDING = new Set(["In Bida", "Watching online", "Can't make it"]);

export default async function handler(req, res) {
  if (!onlyPost(req, res)) return;
  const b = body(req);
  if (b.website) return res.status(200).json({ ok: true }); // spam trap
  const name = clip(b.name, 120);
  const attending = ATTENDING.has(b.attending) ? b.attending : null;
  if (!name || !attending) return res.status(400).json({ ok: false, error: "Name and attendance are required." });
  const guests = attending === "In Bida" ? Math.min(Math.max(parseInt(b.guests, 10) || 1, 1), 10) : 0;
  try {
    await ensureTables();
    await sql`INSERT INTO rsvps (name, phone, attending, guests, note, sent_to)
              VALUES (${name}, ${clip(b.phone, 40)}, ${attending}, ${guests}, ${clip(b.note, 1000)}, ${clip(b.sent_to, 40)})`;
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("rsvp", e);
    res.status(500).json({ ok: false, error: "Could not save" });
  }
}
