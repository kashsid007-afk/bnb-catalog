# BNB Wholesale Catalog

Premium wholesale mobile accessories catalog — replaces WhatsApp broadcasting with a professional digital storefront.

---

## Deploy in 15 minutes

### Step 1 — Supabase (5 min)

1. Go to [supabase.com](https://supabase.com) → New project
2. SQL Editor → paste the entire contents of `supabase-setup.sql` → Run
3. Authentication → Add User → enter your admin email and password
4. Settings → API → copy Project URL and anon key

### Step 2 — Vercel (5 min)

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your anon key
4. Deploy → done ✓

Your site is live at `your-project.vercel.app`

### Step 3 — First login (2 min)

1. Go to `your-project.vercel.app/admin/login`
2. Sign in with the email/password you created in Supabase
3. Go to Settings → update your WhatsApp number
4. Add New Lot → fill details → publish

Share `your-project.vercel.app` on WhatsApp instead of broadcasting images.

---

## Daily workflow

Every day when new stock arrives:
1. Open `yoursite.vercel.app/admin/dashboard` on your phone
2. Tap **Add New Lot**
3. Upload photos + video (drag and drop)
4. Paste your WhatsApp broadcast text into Smart Paste → auto-detects models
5. Tap **Publish** — live in seconds
6. Share the catalog link on WhatsApp once: "Today's new stock → yoursite.vercel.app"

---

## Project structure

```
app/
  (catalog)/       → Customer-facing pages
    page.tsx       → Homepage with catalog
    products/[slug] → Product detail
  admin/           → Password-protected admin
    dashboard/     → Stats + quick actions
    products/new   → Add new lot (3-step wizard)
    settings/      → WhatsApp number, announcement
components/
  catalog/         → ProductCard
  admin/           → BulkUpload, ModelSelector
  shared/          → BottomNav, TrayDrawer, AnnouncementBanner
lib/
  supabase/        → Client + server Supabase instances
  hooks/           → useTray (localStorage), useSettings
  whatsapp.ts      → URL builder for single + tray inquiry
  models-db.ts     → 300+ phone models + broadcast parser
  utils.ts         → cn, slugify, timeAgo, totalModels
```

---

## Key features

- **Inquiry Tray** — customers collect multiple lots, send one WhatsApp message
- **Smart Paste** — paste broadcast text, auto-detects all brands and models
- **Media gallery** — multiple photos + video per lot
- **Model search** — searching "Pixel 9A" finds all lots that contain that model
- **Today's arrivals** — dedicated section for same-day uploads
- **Announcement banner** — editable from Settings, shown site-wide
- **No prices** — inquiry-based, keeps pricing conversations private
- **PWA-ready** — feels like a native app on mobile

---

## Costs

| Service | Free tier | When to upgrade |
|---------|-----------|-----------------|
| Vercel | Free forever for this use case | Never (unless >100GB bandwidth) |
| Supabase | 500MB DB, 1GB storage, 50K users | ~$25/mo when you exceed 1GB images |

Custom domain: buy from GoDaddy/Namecheap (~₹800/year), connect in Vercel in 2 clicks.
