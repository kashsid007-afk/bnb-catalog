# BNB Catalog — Complete Setup Guide

## Step 1: Supabase Setup (~10 mins)

1. Go to **supabase.com** → Create account → New project
2. Name it `bnb-catalog`, choose a region close to India (Singapore)
3. Wait for project to spin up (~2 mins)
4. Go to **SQL Editor** → paste the entire contents of `supabase-schema.sql` → Run
5. Go to **Storage** → New bucket → name it `product-media` → make it **Public**
6. In Storage, go to **Policies** → Add policy for `product-media`:
   - Select policy: "Allow public reads" → enable
   - Add another: "Allow authenticated uploads" → enable for INSERT
7. Go to **Project Settings → API** → copy:
   - `URL` → goes into `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
8. Go to **Authentication → Users** → Add User → enter your email + password
   (This is your admin login — keep it safe)

---

## Step 2: Local Development

```bash
# 1. Clone or create the project
cd bnb-catalog

# 2. Install dependencies
npm install

# 3. Copy env file and fill in your Supabase values
cp .env.local.example .env.local
# Edit .env.local with your actual Supabase URL and keys

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
# Admin panel: http://localhost:3000/admin/login
```

---

## Step 3: Deploy to Vercel (~5 mins)

1. Push your code to GitHub (create a new private repo)
   ```bash
   git init
   git add .
   git commit -m "Initial BNB catalog"
   git remote add origin https://github.com/YOUR_USERNAME/bnb-catalog.git
   git push -u origin main
   ```
2. Go to **vercel.com** → Import Project → select your GitHub repo
3. In Vercel project settings → **Environment Variables** → add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (e.g. `https://bnb-catalog.vercel.app`)
4. Click Deploy → done in ~2 mins
5. Your site is live at `https://bnb-catalog.vercel.app`

---

## Step 4: Add Your First Lot

1. Go to `your-site.vercel.app/admin/login`
2. Sign in with the email/password you created in Supabase
3. Click **Add Lot**
4. Fill in basics (lot code, name, features, upload photos/video)
5. In the Models step — paste your WhatsApp broadcast text → click "Auto-detect"
6. Review and Publish

**Upload time: ~2 minutes per lot**

---

## Step 5: Share With Customers

Send this one link on WhatsApp instead of broadcasting images:
```
Check out our latest collection: https://bnb-catalog.vercel.app
```

For daily new arrivals, set the announcement banner from Admin → Settings.

---

## Future Custom Domain

When ready for a custom domain (e.g. `bnbwholesale.in`):
1. Buy domain from GoDaddy or Namecheap (~₹800/year)
2. In Vercel → Domains → Add your domain
3. Update DNS records as Vercel instructs (2 minutes)
4. SSL is automatic

---

## Costs Summary

| Service  | Plan  | Cost         |
|----------|-------|--------------|
| Vercel   | Free  | ₹0/month     |
| Supabase | Free  | ₹0/month     |
| Domain   | —     | ~₹800/year (optional) |
| **Total**|       | **₹0/month** |

Free tier limits (more than enough to start):
- Supabase: 500MB DB, 1GB storage, 50K users/month
- Vercel: Unlimited deployments, 100GB bandwidth/month

---

## Troubleshooting

**Images not showing?**
→ Check Supabase Storage bucket is set to Public
→ Check storage policies allow public reads

**Admin login not working?**
→ Check the user exists in Supabase → Authentication → Users
→ Make sure env variables are correctly set in Vercel

**WhatsApp button not working?**
→ Go to Admin → Settings → check WhatsApp number has country code (91XXXXXXXXXX)

**Deployment failing?**
→ Check all 3 env variables are set in Vercel project settings
→ Check no TypeScript errors with `npm run build` locally
