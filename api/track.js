// Records visits and gift attempts (button taps and gift notes).
import { sql, ensureTables, clip, num, body, onlyPost } from "./_db.js";

const GIFT_ACTIONS = new Set(["pay_click", "quick_pay_click", "gift_it_all", "contribute", "note_sent"]);

function device(ua = "") {
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "Phone";
  return ua ? "Computer" : null;
}

export default async function handler(req, res) {
  if (!onlyPost(req, res)) return;
  const b = body(req);
  try {
    await ensureTables();
    if (b.type === "visit") {
      const h = req.headers || {};
      const city = h["x-vercel-ip-city"] ? decodeURIComponent(h["x-vercel-ip-city"]) : null;
      await sql`INSERT INTO visits (session, referrer, device, country, city)
                VALUES (${clip(b.session, 64)}, ${clip(b.referrer, 300)}, ${device(h["user-agent"])}, ${clip(h["x-vercel-ip-country"], 8)}, ${clip(city, 80)})`;
    } else if (b.type === "gift" && GIFT_ACTIONS.has(b.action)) {
      await sql`INSERT INTO gifts (action, name, amount, currency, item, method, account, message, session)
                VALUES (${b.action}, ${clip(b.name, 120)}, ${num(b.amount)}, ${b.currency === "USD" ? "USD" : "NGN"},
                        ${clip(b.item, 80)}, ${clip(b.method, 20)}, ${clip(b.account, 120)}, ${clip(b.message, 1000)}, ${clip(b.session, 64)})`;
    } else {
      return res.status(400).json({ ok: false, error: "Unknown event" });
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("track", e);
    res.status(500).json({ ok: false, error: "Could not save" });
  }
}
