# ডিপ্লয়মেন্ট গাইড — Vercel + Neon + Cloudflare R2

এই প্রজেক্টটি GitHub → Vercel দিয়ে লাইভ করা যায়। নিচের ধাপগুলো অনুসরণ করুন।

---

## ০) মার্জ করার পর লাইভ করতে — ১০টি ধাপ (এই অংশটি আগে পড়ুন)

1. **main-এ মার্জ** — PR মার্জ হলে GitHub Actions-এ `CI` (Vitest + চুক্তি-পরীক্ষা + tsc + lint + build) চলবে; সবুজ হলে এগোন।
2. **GitHub-এ Neon সিক্রেট** — রিপো → *Settings → Secrets and variables → Actions → New repository secret*
   → Name: `DATABASE_URL`, Value: Neon-এর pooled connection string।
3. **টেবিল তৈরি** — *Actions → “Migrate (Neon)” → Run workflow*।
   টিক দিন **Reseed** ও `site_url`-এ লাইভ ঠিকানা দিন (যেমন `https://ruposhibangla.org`)।
   এতে `db/schema.sql`-এর সব টেবিল (ও পুরোনো ডেটাবেজের জন্য হালনাগাদ কলাম) তৈরি হবে এবং ১৪৫১টি রেকর্ডের তথ্য বসবে।
   (সিড বাড়লে নতুন রেকর্ডগুলো অ্যাপ চালু হওয়ার সময় নিজে থেকেই যোগ হয় — দেখুন `docs/SEED-SYNC.md`)
   > এরপর থেকে `db/schema.sql` বদলালে `main`-এ পুশ করলেই মাইগ্রেশন আপনি-থেকেই চলে।
4. **Vercel-এ Environment Variables** —
   `DATABASE_URL` · `AUTH_SECRET` (`openssl rand -base64 32`) · `ADMIN_USERNAME` · `ADMIN_EMAIL` ·
   `ADMIN_PASSWORD` (প্রথম অ্যাডমিন তৈরিতে) · `NEXT_PUBLIC_SITE_URL`।
   ঐচ্ছিক: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — একাধিক সার্ভারলেস ইনস্ট্যান্সে
   রেট-লিমিট কেন্দ্রীয় করতে (না দিলে ইন-মেমোরি, যা একক ইনস্ট্যান্সে ঠিক আছে)।
5. **Redeploy** — Vercel → *Deployments → ⋯ → Redeploy* (env যোগের পরে অবশ্যই)।
6. **অ্যাডমিন লগইন** — `/login` → ব্যবহারনাম `admin` **অথবা** ইমেইল — দুটোতেই চলে।
   (প্রথম অ্যাডমিন `ADMIN_*` env থেকে স্বয়ংক্রিয়ভাবে তৈরি হয়; পাসওয়ার্ড scrypt-হ্যাশ করা থাকে।)
7. **সাথে সাথে পাসওয়ার্ড বদলুন** — `/admin/account` → নাম, ইমেইল ও পাসওয়ার্ড বদলানো যায়।
8. **R2 যুক্ত করুন** — `/admin/media` → *Cloudflare R2 সংযোগ* → Account ID, Bucket, Access Key, Secret
   বসিয়ে **“সংযোগ পরীক্ষা”** চাপুন। (Vercel env-এ `R2_*` দিলেও হয় — তখন env-ই কার্যকর থাকে।)
9. **লোগো ও সাইট পরিচয়** — `/admin/settings` → লোগো আপলোড (বর্গাকার PNG/SVG, ন্যূনতম ২৫৬×২৫৬),
   সাইটের নাম, ট্যাগলাইন, হেডার নোটিশ, সোশ্যাল লিংক।
10. **শেষ যাচাই** — `/admin` (ড্যাশবোর্ডের সংখ্যা সব ডেটাবেজ থেকে আসে) · `/admin/coverage` (কভারেজ) ·
    `/admin/users` (রূপসী বাংলা চ্যানেলে ব্লু টিক আছে কিনা) · `/sitemap.xml` · `/robots.txt`।

> ⚠️ Vercel-এর সার্ভারলেস পরিবেশে ফাইল-সিস্টেমে লেখা যায় না — প্রোডাকশনে **Neon ও R2 ব্যবহার করবেনই**।

---

## ১) রিপোজিটরি

```bash
git clone <আপনার-রিপো-লিংক>
cd ruposhibangla
npm install
npm run dev   # http://localhost:3000 — লোকাল JSON দিয়েই চলবে
```

GitHub-এ পুশ করুন:

```bash
git add -A
git commit -m "রূপসী বাংলা — প্রথম সংস্করণ"
git push origin main
```

---

## ২) Neon ডেটাবেজ (এডমিন প্যানেলের ডেটা)

1. https://neon.tech → নতুন প্রজেক্ট → **Connection string** কপি করুন (Pooled connection)
2. Vercel প্রজেক্ট → **Settings → Environment Variables** → যোগ করুন:

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.region.aws.neon.tech/ruposhibangla?sslmode=require` |
| `AUTH_SECRET` | লম্বা র‍্যান্ডম স্ট্রিং (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | `https://আপনার-ডোমেইন` |

3. টেবিল তৈরির **দুটি উপায়** — যেকোনো একটি:
   - **GitHub Workflow (সুপারিশকৃত):** রিপো → *Settings → Secrets → Actions* → `DATABASE_URL` যোগ করুন,
     তারপর *Actions → Migrate (Neon) → Run workflow*। স্কিমার উৎস `db/schema.sql` (১৬টি টেবিল)।
   - **অ্যাডমিন প্যানেল:** `/admin` → **“টেবিল তৈরি”** → এরপর **“প্রজাতির তথ্য বসানো”**।
4. লোকালে/টার্মিনালে: `DATABASE_URL="..." node scripts/migrate.mjs` (যোগ করতে পারেন `--reseed`)

> চাইলে `db/schema.sql` ফাইলটি সরাসরি Neon SQL Editor-এ রান করতেও পারেন।

---

## ৩) Cloudflare R2 (ছবি ও ভিডিও স্টোরেজ)

1. Cloudflare Dashboard → **R2 → Create bucket** (যেমন: `ruposhibangla`)
2. বাকেটে **Public access** চালু করুন (r2.dev URL) অথবা কাস্টম ডোমেইন যুক্ত করুন
3. **Manage R2 API Tokens → Create API token** (Object Read & Write)
4. Vercel Environment Variables:

| Key | Value |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare অ্যাকাউন্ট আইডি |
| `R2_ACCESS_KEY_ID` | R2 Access Key |
| `R2_SECRET_ACCESS_KEY` | R2 Secret Key |
| `R2_BUCKET_NAME` | `ruposhibangla` |
| `R2_PUBLIC_URL` | `https://pub-xxxx.r2.dev` |

এগুলো সেট থাকলে প্রতিটি আপলোড সরাসরি R2-তে যাবে; লিঙ্কও R2-এরই তৈরি হবে।
সেট না থাকলে অ্যাপটি `public/uploads`-এ জমা করে (শুধু লোকাল/ডেমোর জন্য)।

**R2 CORS (দরকার হলে):**

```json
[
  {
    "AllowedOrigins": ["https://আপনার-ডোমেইন", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```

---

## ৪) Vercel-এ ডিপ্লয়

1. https://vercel.com → **Add New → Project** → GitHub রিপো ইম্পোর্ট
2. Framework: **Next.js** (অটো ডিটেক্ট)
3. Environment Variables বসান (উপরের টেবিল)
4. **Deploy**

Vercel-এর সার্ভারলেস পরিবেশে ফাইল-সিস্টেম লেখা যায় না — তাই প্রোডাকশনে **অবশ্যই** Neon ও R2 ব্যবহার করুন।

---

## ৫) (ঐচ্ছিক) উন্নত এআই মডেল যুক্ত করা

ডিফল্টভাবে এআই “লোকাল/অফলাইন” মোডে চলে — কোনো API খরচ ছাড়াই সাইটের তথ্য থেকে উত্তর দেয়।
আরও প্রাঞ্জল উত্তর চাইলে যোগ করুন:

| Key | Value |
|---|---|
| `AI_PROVIDER` | `openai` / `openrouter` / `gemini` |
| `AI_API_KEY` | সংশ্লিষ্ট API কী |
| `AI_MODEL` | যেমন `gpt-4o-mini` |
| `AI_VISION_MODEL` | ছবি বিশ্লেষণের মডেল |

এআই কখনোই সাইটের তথ্যের বাইরে যাবে না — প্রসঙ্গ না থাকলে সে “জানি না” বলবে।

---

## ৬) ডোমেইন ও SEO

- ডোমেইন যুক্ত করুন: `ruposhibangla.org` / `.com` / `.bd`
- `NEXT_PUBLIC_SITE_URL` সঠিকভাবে সেট করুন (sitemap ও canonical লিংক এর ওপর নির্ভরশীল)
- `/sitemap.xml` ও `/robots.txt` অটোমেটিক তৈরি হয়
- Google Search Console-এ sitemap সাবমিট করুন
- প্রতি প্রজাতির পাতায় JSON-LD (`Animal`/`Plant`) স্ট্রাকচার্ড ডেটা আছে

---

## ৭) ডিপ্লয়ের পর প্রথম কাজ

1. `/login` → অ্যাডমিন (`ADMIN_USERNAME`/`ADMIN_EMAIL` + `ADMIN_PASSWORD`) — প্রথম অ্যাডমিন env থেকে তৈরি হয়
2. `/admin/account` → **পাসওয়ার্ড বদলুন**
3. `/admin/media` → R2 সংযোগ যুক্ত করুন (Account ID, Bucket, Access/Secret Key → “সংযোগ পরীক্ষা”)
4. `/admin/settings` → সাইটের নাম, **লোগো আপলোড**, হেডার নোটিশ, সোশ্যাল লিংক
5. `/admin/users` → রূপসী বাংলা চ্যানেলে ব্লু টিক নিশ্চিত করুন
6. `/admin/species` → নতুন প্রজাতি যোগ / বিদ্যমান তথ্য হালনাগাদ (CSV/JSON আমদানি-রপ্তানিও আছে)
7. `/admin/news` → প্রথম খবর প্রকাশ

---

## সমস্যা সমাধান

| সমস্যা | সমাধান |
|---|---|
| “DATABASE_URL সেট করা নেই” বার্তা | Neon সংযোগ স্ট্রিং সঠিক কিনা দেখুন; Vercel-এ env যোগের পর Redeploy করুন |
| আপলোড লোকালে জমা হচ্ছে | R2-এর ৫টি env-এর সবগুলো পূরণ হয়েছে কিনা দেখুন |
| অ্যাডমিন প্যানেলে ঢুকতে পারছি না | প্রথম অ্যাকাউন্টটি অ্যাডমিন; দ্বিতীয়জন হলে `/admin/users` থেকে role বদলান |
| ফন্ট/লেআউট এলোমেলো | ব্রাউজার ক্যাশ ক্লিয়ার করে আবার লোড করুন (Hind Siliguri Google Fonts থেকে লোড হয়) |
| Workflow-এ “DATABASE_URL সিক্রেট সেট করা নেই” | রিপো → *Settings → Secrets and variables → Actions* → `DATABASE_URL` যোগ করুন |
| `/admin` “অ্যাডমিন অনুমতি নেই” | `ADMIN_USERNAME`/`ADMIN_EMAIL`/`ADMIN_PASSWORD` env ঠিক আছে কিনা দেখুন ও Redeploy করুন; অ্যাডমিন থাকলে bootstrap কাজ করে না |
| লোগো বদলালেও দেখাচ্ছে না | `/admin/settings`-এ “সংরক্ষিত” বার্তা এসেছে কিনা দেখুন; ব্রাউজার হার্ড-রিফ্রেশ (Ctrl+Shift+R) করুন |
