# Glory & Precious — Wedding Website

**Live site: https://glory-and-precious.vercel.app/**

The wedding website for the Holy Matrimony of **Glory Uchechukwu Ngene & Precious Ebubechukwu Chikezie**,
Sunday 25 October 2026, 5:00 pm, Treasure Spring Auditorium, opposite The Federal Polytechnic, Bida, Niger State.

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
| Wishlist | Mini Solar Setup ₦1,500,000 · Starlink Gen 3 ₦600,000 · Washing Machine ₦450,000 · Water Dispenser ₦250,000 · Power Blender ₦200,000 · Gas Cooker/Oven ₦200,000 · Microwave ₦150,000 · Air Fryer ₦80,000 · Rice Cooker ₦40,000 · Electric Kettle ₦40,000 · Kitchen support (any) · New home support (any) · Any amount |
| Account 1 | Opay · 9034435770 · Ngene Glory Uche |
| Account 2 | Access Bank · 1596611810 · Ngene Glory Uche |
| Account 3 | GTBank (Naira) · 0208897487 · Chikezie Precious Ebubechukwu |
| Account 4 | GTBank (USD / dollar) · 0650125288 · Chikezie Precious Ebubechukwu |
| RSVP deadline | 18 October 2026 |
| Hashtag | #GloryAndPrecious26 (placeholder, not confirmed) |

## Hosting on Vercel (one-time setup)

1. Vercel → **Add New… → Project**.
2. Import the `glory-and-precious` GitHub repository.
3. Framework preset: **Other**. Leave the build command and output directory **empty**.
4. Click **Deploy**. Every change pushed to GitHub goes live automatically.

RSVPs and gift notes arrive on WhatsApp (Glory and Precious). Online gifts are recorded in the Paystack dashboard.

## Guest list, gift activity and visits (database)

The site saves a copy of every RSVP, every gift attempt and every visit in a **Neon Postgres** database connected in Vercel → Storage.
Tables (`rsvps`, `gifts`, `visits`) are created automatically on first use.

- **Admin page:** https://glory-and-precious.vercel.app/admin — password protected. Shows totals, the guest list, gift activity and visits, with "Download spreadsheet" buttons.
- **Password:** stored only in Vercel → Settings → Environment Variables as `ADMIN_PASSWORD` (never in this repository). To change it, edit that variable and redeploy.
- **Gift activity = attempts**, not confirmed payments: "Opened Paystack", "Chose Gift it all", "Chose Contribute", "Sent gift note". Confirm money in Paystack and the bank apps.
- **Visits:** simple counts in the admin page; full detail in Vercel → Analytics (Web Analytics enabled).

| File | What it does |
|---|---|
| `api/rsvp.js` | Saves an RSVP |
| `api/track.js` | Saves visits and gift attempts |
| `api/admin.js` | Returns the data to the admin page (checks the password) |
| `api/_db.js` | Database connection and table setup |
| `admin.html` | The admin page |
| `package.json` | Lists the database library Vercel installs |

## For Claude (or a developer) making changes

The editable source is in `_build/`: `wedding.src.html` (the page, with the `CONFIG` block) and `build.py`.
Run `python3 _build/build.py` from the folder *above* this repo with the photos beside it, or simply edit `index.html` directly — both work.

## Change log

- **2026-10-08** — Site built: e-invite, events, livestream section, WhatsApp RSVP, Paystack + bank gifts, FAQ. Real photos added. Prepared for Netlify with Netlify Forms.
- **2026-10-08** — Pushed to GitHub for Netlify. Wishlist replaced with real items (Power Blender ₦200,000, Mini Solar Setup ₦1,000,000, Any amount); each can be gifted in full or contributed to. RSVPs & gift notes now go to Glory and Precious on WhatsApp; the earlier two numbers are now wedding-day/directions contacts.
- **2026-10-08** — Switched hosting from Netlify to Vercel (removed Netlify Forms and netlify.toml, added vercel.json).
- **2026-10-08** — Live at https://glory-and-precious.vercel.app/. Added link-preview tags so WhatsApp shows the photo and title.
- **2026-10-08** — Venue corrected to *opposite* The Federal Polytechnic, Bida. Directions button now opens the exact Google Maps pin: https://maps.app.goo.gl/5nxTS4azkkPo9rVM6
- **2026-10-08** — Added Kitchen support and New home support to the wishlist (any amount). Wishlist now shows two per row with the general "Any amount" card full width.
- **2026-10-08** — Gift form now asks "Online with Paystack" or "Bank transfer". Online opens Paystack with the chosen amount and the guest's name already filled in (Paystack `amount`, `first_name`, `last_name` link options). Added GTBank Naira and USD accounts for Precious.
- **2026-10-08** — Added 7 appliances to the wishlist with rounded mid-range Nigerian prices (Jumia/Jiji/Zit, Oct 2026): Washing Machine ₦450k, Water Dispenser ₦250k, Gas Cooker/Oven ₦200k, Microwave ₦150k, Air Fryer ₦80k, Rice Cooker ₦40k, Electric Kettle ₦40k. Wishlist sorted from highest to lowest price.
- **2026-10-08** — Mini Solar Setup price changed to ₦1,500,000.
- **2026-10-09** — Added Starlink Gen 3 (Standard Kit) to the wishlist at ₦600,000 (Jumia listing ₦579,999–₦690,000, Oct 2026).
- **2026-10-09** — Added database records (Neon via Vercel): RSVPs, gift attempts and visits, plus a password-protected admin page at /admin. Enabled Vercel Web Analytics on the page.
