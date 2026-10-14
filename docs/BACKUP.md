# 💾 ব্যাকআপ ও পুনরুদ্ধার — রূপসী বাংলা

## ১. কী ব্যাকআপ নিতে হবে

| উপাদান | কোথায় | কেন |
|---|---|---|
| **Postgres (Neon)** | Neon প্রজেক্ট | সব রেকর্ড — প্রজাতি, পোস্ট, ব্যবহারকারী, এআই প্রশ্ন |
| **মিডিয়া (R2)** | Cloudflare R2 বাকেট | আপলোড করা ছবি/ভিডিও — ডেটাবেজে শুধু URL থাকে |
| **লোকাল JSON** (ডেভ) | `.data/db.json` | `DATABASE_URL` না থাকলে এটিই ডেটাবেজ |
| **লোকাল আপলোড** | `public/uploads` | R2 কনফিগার না থাকলে আপলোড এখানে জমা হয় |

## ২. Neon ব্যাকআপ

Neon স্বয়ংক্রিয়ভাবে Point-in-Time Restore (PITR) রাখে (প্ল্যানভেদে ৭–৩০ দিন)। নিয়মিত ম্যানুয়াল স্ন্যাপশটও নিন:

```bash
# স্কিমা + ডেটা (নিজের মেশিনে, pg_dump থাকতে হবে)
pg_dump "$DATABASE_URL" --format=custom --no-owner --no-acl \
  --file="ruposhibangla-$(date +%F).dump"

# পুনরুদ্ধার
pg_restore --clean --no-owner --dbname="$DATABASE_URL" ruposhibangla-2026-10-14.dump
```

Neon-এর ব্রাঞ্চ ব্যবহার করলে: `main` ব্রাঞ্চ থেকে `backup/YYYY-MM-DD` ব্রাঞ্চ তৈরি করেই একটি দ্রুত স্ন্যাপশট পাওয়া যায়।

## ৩. R2 ব্যাকআপ

```bash
# rclone কনফিগার করে (S3-compatible)
rclone sync r2:ruposhibangla ./backups/r2/$(date +%F) --progress

# নির্দিষ্ট তারিখ থেকে পুনরুদ্ধার
rclone sync ./backups/r2/2026-10-14 r2:ruposhibangla --progress
```

`rclone.conf` উদাহরণ:

```ini
[r2]
type = s3
provider = Cloudflare
access_key_id = <R2_ACCESS_KEY_ID>
secret_access_key = <R2_SECRET_ACCESS_KEY>
endpoint = https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com
acl = private
```

## ৪. অ্যাপ্লিকেশন-স্তরের রপ্তানি (নির্ভরতাহীন)

জ্ঞানভান্ডার CSV/JSON-এ রপ্তানি করা যায় — অ্যাডমিন/এডিটর লগইন করে:

```bash
curl -b cookies.txt "https://ruposhibangla.org/api/admin/species/export?format=csv" -o species-$(date +%F).csv
curl -b cookies.txt "https://ruposhibangla.org/api/admin/species/export?format=json" -o species-$(date +%F).json
```

পুনরুদ্ধার: `/admin/species` → **আমদানি** → ফাইল নির্বাচন → “বিদ্যমান রেকর্ড হালনাগাদের অনুমতি” দিন।

## ৫. সময়সূচি (প্রস্তাবিত)

| কাজ | কম্পাঙ্ক | ধরে রাখা |
|---|---|---|
| Neon স্বয়ংক্রিয় PITR | নিরবচ্ছিন্ন | প্ল্যান অনুযায়ী |
| `pg_dump` স্ন্যাপশট | দৈনিক | ৩০ দিন |
| R2 sync | সাপ্তাহিক | ১২ সপ্তাহ |
| জ্ঞানভান্ডার CSV রপ্তানি | মাসিক | ১২ মাস |
| পুনরুদ্ধার মহড়া | ত্রৈমাসিক | — |

## ৬. পুনরুদ্ধার মহড়ার ধাপ

1. নতুন Neon ব্রাঞ্চ/প্রজেক্ট তৈরি করুন।
2. সবচেয়ে সাম্প্রতিক `.dump` ফাইল `pg_restore` করুন।
3. `DATABASE_URL` সাময়িকভাবে সেই ব্রাঞ্চের দিকে পয়েন্ট করুন (Vercel Preview ডিপ্লয়)।
4. যাচাই করুন: `/admin` → ড্যাশবোর্ডের সংখ্যা, `/api/coverage`, কয়েকটি প্রজাতির পাতা, কয়েকটি আপলোড করা ছবির URL।
5. ঠিক থাকলে প্রোডাকশনে `DATABASE_URL` বদলান; R2 থেকেও প্রয়োজনে মিডিয়া সিঙ্ক করুন।

## ৭. গোপনীয়তা

- ব্যাকআপে ব্যক্তিগত তথ্য (নাম, ইমেইল, পাসওয়ার্ড হ্যাশ) থাকে — **এনক্রিপ্ট করে রাখুন**, সর্বজনীন বাকেটে রাখবেন না।
- অ্যাকাউন্ট মুছার অনুরোধ এলে সংশ্লিষ্ট রেকর্ড ব্যাকআপ থেকেও মুছতে হবে (অথবা ব্যাকআপের রিটেনশন শেষ হওয়ার সময়সীমা নথিভুক্ত করুন)।
