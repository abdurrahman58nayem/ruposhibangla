# ডিপ্লয়মেন্ট গাইড — Vercel + Neon + Cloudflare R2

এই প্রজেক্টটি GitHub → Vercel দিয়ে লাইভ করা যায়। নিচের ধাপগুলো অনুসরণ করুন।

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
git commit -m "প্রকৃতি বাংলা — প্রথম সংস্করণ"
git push origin main
```

---

## ২) Neon ডেটাবেজ (এডমিন প্যানেলের ডেটা)

1. https://neon.tech → নতুন প্রজেক্ট → **Connection string** কপি করুন (Pooled connection)
2. Vercel প্রজেক্ট → **Settings → Environment Variables** → যোগ করুন:

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.region.aws.neon.tech/prakriti_bangla?sslmode=require` |
| `AUTH_SECRET` | লম্বা র‍্যান্ডম স্ট্রিং (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | `https://আপনার-ডোমেইন` |

3. ডিপ্লয়ের পর সাইটে প্রথম অ্যাকাউন্ট খুলুন (প্রথমজনই অ্যাডমিন) → `/admin` → **ড্যাশবোর্ড**
4. সেখানে **“টেবিল তৈরি”** ক্লিক করুন (Neon-এ ১০টি টেবিল তৈরি হবে)
5. এরপর **“প্রজাতির তথ্য বসানো”** ক্লিক করুন — বাংলাদেশের সব প্রজাতি, রূপসী বাংলা চ্যানেল, সিড পোস্ট ও খবর ডেটাবেজে চলে যাবে

> চাইলে `db/schema.sql` ফাইলটি সরাসরি Neon SQL Editor-এ রান করতেও পারেন।

---

## ৩) Cloudflare R2 (ছবি ও ভিডিও স্টোরেজ)

1. Cloudflare Dashboard → **R2 → Create bucket** (যেমন: `prakriti-bangla`)
2. বাকেটে **Public access** চালু করুন (r2.dev URL) অথবা কাস্টম ডোমেইন যুক্ত করুন
3. **Manage R2 API Tokens → Create API token** (Object Read & Write)
4. Vercel Environment Variables:

| Key | Value |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare অ্যাকাউন্ট আইডি |
| `R2_ACCESS_KEY_ID` | R2 Access Key |
| `R2_SECRET_ACCESS_KEY` | R2 Secret Key |
| `R2_BUCKET_NAME` | `prakriti-bangla` |
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

- ডোমেইন যুক্ত করুন: `prakritibangla.org` / `.com` / `.bd`
- `NEXT_PUBLIC_SITE_URL` সঠিকভাবে সেট করুন (sitemap ও canonical লিংক এর ওপর নির্ভরশীল)
- `/sitemap.xml` ও `/robots.txt` অটোমেটিক তৈরি হয়
- Google Search Console-এ sitemap সাবমিট করুন
- প্রতি প্রজাতির পাতায় JSON-LD (`Animal`/`Plant`) স্ট্রাকচার্ড ডেটা আছে

---

## ৭) ডিপ্লয়ের পর প্রথম কাজ

1. `/register` → অ্যাকাউন্ট (প্রথমটি অ্যাডমিন)
2. `/admin/settings` → সাইটের নাম, লোগো, হেডার নোটিশ, সোশ্যাল লিংক
3. `/admin/users` → রূপসী বাংলা চ্যানেলে ব্লু টিক নিশ্চিত করুন
4. `/admin/media` → নিজেদের ছবি আপলোড (R2)
5. `/admin/species` → নতুন প্রজাতি যোগ / বিদ্যমান তথ্য হালনাগাদ
6. `/admin/news` → প্রথম খবর প্রকাশ

---

## সমস্যা সমাধান

| সমস্যা | সমাধান |
|---|---|
| “DATABASE_URL সেট করা নেই” বার্তা | Neon সংযোগ স্ট্রিং সঠিক কিনা দেখুন; Vercel-এ env যোগের পর Redeploy করুন |
| আপলোড লোকালে জমা হচ্ছে | R2-এর ৫টি env-এর সবগুলো পূরণ হয়েছে কিনা দেখুন |
| অ্যাডমিন প্যানেলে ঢুকতে পারছি না | প্রথম অ্যাকাউন্টটি অ্যাডমিন; দ্বিতীয়জন হলে `/admin/users` থেকে role বদলান |
| ফন্ট/লেআউট এলোমেলো | ব্রাউজার ক্যাশ ক্লিয়ার করে আবার লোড করুন (Hind Siliguri Google Fonts থেকে লোড হয়) |
