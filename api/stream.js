// Public: returns the live stream link the couple set in /admin (empty until the day).
import { readConfig } from "./_store.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=20, stale-while-revalidate=40");
  try {
    const c = await readConfig("stream");
    res.status(200).json({ ok: true, url: c.url || "" });
  } catch (e) {
    res.status(200).json({ ok: true, url: "" });
  }
}
