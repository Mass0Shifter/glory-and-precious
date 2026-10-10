// Saves an RSVP. Guests still send their reply on WhatsApp; this keeps a copy for the couple.
import { saveRecord, clip, body, onlyPost } from "./_store.js";

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
    await saveRecord("rsvps", { name, phone: clip(b.phone, 40), attending, guests, note: clip(b.note, 1000) });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("rsvp", e);
    res.status(500).json({ ok: false, error: "Could not save" });
  }
}
