// Records visits and gift attempts (button taps and gift notes).
import { saveRecord, saveVisit, clip, num, body, onlyPost } from "./_store.js";

const GIFT_ACTIONS = new Set(["pay_click", "quick_pay_click", "gift_it_all", "contribute", "note_sent"]);

function device(ua = "") {
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "Phone";
  return ua ? "Computer" : "Unknown";
}
function host(ref) {
  try { return ref ? new URL(ref).hostname.replace(/^www\./, "") : ""; } catch { return ""; }
}

export default async function handler(req, res) {
  if (!onlyPost(req, res)) return;
  const b = body(req);
  try {
    if (b.type === "visit") {
      const h = req.headers || {};
      await saveVisit({ session: clip(b.session, 40), referrer: host(b.referrer), device: device(h["user-agent"]), country: h["x-vercel-ip-country"] || "" });
    } else if (b.type === "gift" && GIFT_ACTIONS.has(b.action)) {
      await saveRecord("gifts", {
        action: b.action, name: clip(b.name, 120), amount: num(b.amount), currency: b.currency === "USD" ? "USD" : "NGN",
        item: clip(b.item, 80), method: clip(b.method, 20), account: clip(b.account, 120), message: clip(b.message, 1000)
      });
    } else {
      return res.status(400).json({ ok: false, error: "Unknown event" });
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("track", e);
    res.status(500).json({ ok: false, error: "Could not save" });
  }
}
