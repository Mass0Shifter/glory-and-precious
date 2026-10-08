# Glory & Precious — Wedding Website

**Live site: https://glory-and-precious.vercel.app/**

The wedding website for the Holy Matrimony of **Glory Uchechukwu Ngene & Precious Ebubechukwu Chikezie**,
Sunday 25 October 2026, 5:00 pm, Treasure Spring Auditorium, The Federal Polytechnic, Bida, Niger State.

Colours: navy blue, champagne gold and white.

## What the site does

- **E-invite**: families, names, date, venue and a live countdown to the Holy Matrimony.
- **For your prayers**: Court wedding (Tue 20 Oct, Abuja) and Traditional wedding (Sat 24 Oct, Abuja) are shown as information only, not invitations.
- **Watch live**: a section that shows a "Join the live stream" button once a stream link is added.
- **RSVP**: guests choose "In Bida", "Watching online" or "Can't make it", then send their reply on WhatsApp to Glory or Precious.
- **Gifts**: a "Gift online now" button (Paystack), two bank accounts with copy buttons, a wishlist (each item can be gifted in full or contributed to), and a thank-you note form sent on WhatsApp to Glory or Precious.
- No mention of catering anywhere on the site.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole website |
| `images/hero.jpg` | Main invitation photo (navy suit) |
| `images/trad_full.jpg` | Tall gallery photo (red traditional, full length) |
| `images/trad_sq.jpg` | Gallery photo (red traditional, close) |
| `images/couple.jpg` | Gallery photo (evening event) |
| `vercel.json` | Settings for Vercel (no build needed) |

To swap a photo, upload a new picture to the `images` folder on GitHub with **exactly the same file name**. Vercel updates the site automatically.

## Changing details (names, links, numbers, accounts)

Every detail lives in one block near the bottom of `index.html`, starting with `const CONFIG = {`.
The easiest way: ask Claude, e.g. *"Update the wedding site: the live stream link is …"*.

Current settings:

| Setting | Value |
|---|---|
| Paystack link (`payLink`) | https://paystack.shop/pay/kabodsquare (**was still in test mode on 8 Oct 2026 — must be switched to Live**) |
| Live stream (`streamUrl`) | *empty — add on the day* |
| RSVPs & gift notes go to (WhatsApp) | Glory +234 903 443 5770 · Precious +234 811 285 3404 |
| Wedding-day help & directions | +234 806 545 2494, +234 703 105 1140 |
| Wishlist | Power Blender ₦200,000 · Mini Solar Setup ₦1,000,000 · Any amount (more items to come) |
| Account 1 | Opay · 9034435770 · Ngene Glory Uche |
| Account 2 | Access Bank · 1596611810 · Ngene Glory Uche |
| RSVP deadline | 18 October 2026 |
| Hashtag | #GloryAndPrecious26 (placeholder, not confirmed) |

## Hosting on Vercel (one-time setup)

1. Vercel → **Add New… → Project**.
2. Import the `glory-and-precious` GitHub repository.
3. Framework preset: **Other**. Leave the build command and output directory **empty**.
4. Click **Deploy**. Every change pushed to GitHub goes live automatically.

RSVPs and gift notes arrive on WhatsApp (Glory and Precious). Online gifts are recorded in the Paystack dashboard.

## For Claude (or a developer) making changes

The editable source is in `_build/`: `wedding.src.html` (the page, with the `CONFIG` block) and `build.py`.
Run `python3 _build/build.py` from the folder *above* this repo with the photos beside it, or simply edit `index.html` directly — both work.

## Change log

- **2026-10-08** — Site built: e-invite, events, livestream section, WhatsApp RSVP, Paystack + bank gifts, FAQ. Real photos added. Prepared for Netlify with Netlify Forms.
- **2026-10-08** — Pushed to GitHub for Netlify. Wishlist replaced with real items (Power Blender ₦200,000, Mini Solar Setup ₦1,000,000, Any amount); each can be gifted in full or contributed to. RSVPs & gift notes now go to Glory and Precious on WhatsApp; the earlier two numbers are now wedding-day/directions contacts.
- **2026-10-08** — Switched hosting from Netlify to Vercel (removed Netlify Forms and netlify.toml, added vercel.json).
- **2026-10-08** — Live at https://glory-and-precious.vercel.app/. Added link-preview tags so WhatsApp shows the photo and title.
