# HANDOFF — রূপসী বাংলা (Ruposhi Bangla)

> **পরের সেশনের AI এজেন্টের জন্য নির্দেশাবলি।**
> আগে এই ফাইলটি পড়ুন, তারপর `git log --oneline -20` ও `MASTER-PROMPT.md` দেখুন।
> শাখা: `arena/3c48228f-ruposhibangla` (সেশন-ফিক্সড — অন্য শাখায় কাজ করবেন না)।
> কাজ শেষে কমিট করলেই সেভ হয়; পুশ: `git push origin arena/3c48228f-ruposhibangla`।

---

## ০) এক লাইনে বর্তমান অবস্থা

জ্ঞানভান্ডারে **৫৮৯টি প্রজাতি** (২৯৬টিতে ছবি বাকি)। প্ল্যাটফর্মের প্রায় সব ফিচারের কাঠামো তৈরি।
এই সেশনে যোগ হয়েছে: **Neon মাইগ্রেশন (GitHub Workflow), প্রথম-অ্যাডমিন bootstrap, অ্যাডমিন প্যানেল থেকে R2 সংযোগ, ও ইমেইল/পাসওয়ার্ড বদল**।

---

## ১) এই সেশনে যা করা হয়েছে (সব লোকালে পরীক্ষিত)

| কাজ | কোথায় | অবস্থা |
|---|---|---|
| Neon টেবিলের স্কিমা আলাদা ফাইলে | `db/schema.sql` (১৬টি টেবিল) | ✅ একমাত্র উৎস |
| মাইগ্রেশন স্ক্রিপ্ট | `scripts/migrate.mjs` | ✅ `node scripts/migrate.mjs [--reseed]` |
| GitHub Workflow | `.github/workflows/migrate.yml` | ✅ `workflow_dispatch` + `db/schema.sql` বদললে `main`-এ স্বয়ংক্রিয় |
| স্কিমা লোডার | `lib/db/client.ts` → `getSchemaSql()` / `schemaStatements()` | ✅ `/api/admin/setup`-এ ব্যবহৃত |
| গোপন কী (R2) ডেটাবেজে | `Repo.getSecret/setSecret` (json + neon) | ✅ `secret:` প্রিফিক্স; **পাবলিক `/api/settings`-এ আসে না** |
| R2 অ্যাডমিন প্যানেল থেকে | `/admin/media` → `StorageSettingsForm`, API `app/api/admin/storage/route.ts` | ✅ সেভ + সংযোগ-পরীক্ষা + মুছুন; মান মাস্ক করা |
| প্রথম অ্যাডমিন তৈরি (bootstrap) | `lib/bootstrap.ts` → `ensureAdminUser()` | ✅ env-এ `ADMIN_PASSWORD` থাকলে |
| Neon ফাঁকা থাকলে স্বয়ংক্রিয় সিড | `lib/repo/neon-repo.ts` → `seedIfEmptyNeon()` | ✅ species ও posts দুটোই খালি হলে কেবল |
| সব `getRepo()` কলে init() চালু | `lib/repo/index.ts` → `getRepo()` → `void getReadyRepo()` | ✅ |
| `init()` কখনো ডাকা হতো না — ঠিক | `lib/repo/index.ts` → `getReadyRepo()` | ✅ লগইন/রেজিস্টার/অ্যাডমিন/সেটআপ-এ |
| লগইন ইমেইল দিয়েও | `app/api/auth/login/route.ts` | ✅ ব্যবহারনাম **বা** ইমেইল |
| অ্যাকাউন্ট সম্পাদনা | `/admin/account` + `app/api/admin/account/route.ts` | ✅ নাম/ইমেইল/পাসওয়ার্ড (বর্তমান পাসওয়ার্ড চায়) + অডিট লগ |
| লোগো অ্যাডমিন প্যানেল থেকে | `/admin/settings` → `UploadField` (logoUrl) | ✅ আগেই ছিল, এন্ড-টু-এন্ড পরীক্ষিত |
| নেভিগেশনে “আমার অ্যাকাউন্ট” | `components/admin/AdminNav.tsx` | ✅ |

**পরীক্ষা:** `admin` ও `admin@ruposhibangla.org` — দুটোতেই লগইন ✅ · `/admin`, `/admin/account`, `/admin/media`,
`/admin/settings` → ২০০ ✅ · R2 সেভ/মাস্ক/মুছা ✅ · পাসওয়ার্ড বদল → নতুন পাসওয়ার্ডে লগইন ✅ ·
পাবলিক `/api/settings`-এ কোনো R2 কী লিক হয়নি ✅ · লোগো আপলোড → হেডারে দেখা গেছে ✅ · `npx tsc --noEmit` ক্লিন ✅

---

## ২) পরিবেশ ভেরিয়েবল (Vercel / `.env.local`)

```
DATABASE_URL            Neon pooled connection string — GitHub secret-এও দিন (Workflow-এর জন্য)
AUTH_SECRET             লম্বা র‍্যান্ডম স্ট্রিং (openssl rand -base64 32)
ADMIN_USERNAME          admin
ADMIN_EMAIL             admin@ruposhibangla.org
ADMIN_PASSWORD          প্রথম অ্যাডমিন তৈরিতে ব্যবহৃত — পরে /admin/account থেকে বদলাবেন
NEXT_PUBLIC_SITE_URL    https://আপনার-ডোমেইন
R2_*                    ঐচ্ছিক — /admin/media থেকে বসানো যায় (env থাকলে env-ই কার্যকর)
AI_PROVIDER / AI_API_KEY   ঐচ্ছিক — না দিলে লোকাল RAG চলবে
```

> ⚠️ **নিরাপত্তা:** কোনো পাসওয়ার্ড/ক্রেডেনশিয়াল কখনো রিপোজিটরিতে কমিট করবেন না।
> `.env.local` `.gitignore`-এ আছে। সিক্রেট শুধু Vercel Environment Variables বা GitHub Secrets-এ।

---

## ৩) পরের সেশনে যা করতে হবে — অগ্রাধিকার অনুযায়ী

> ব্যবহারকারীর স্থায়ী নির্দেশ: **“যতক্ষণ না সব পাখি-প্রাণী-উদ্ভিদ সাইটে আসছে, ততক্ষণ এড করতে থাকো —
> যতগুলো প্রাণী ও উদ্ভিদ পাওয়া যায় সব।”** তাই **প্রথম কাজ সবসময় তথ্য**। ছবি/পলিশ কেবল ফাঁকা সময়ে।

### A. প্রজাতি যোগ করা (সবচেয়ে জরুরি)
লক্ষ্য বনাম বর্তমান: পাখি ৭০০+/১১৮ · মাছ ৪০০+/৭৬ · সরীসৃপ ১৩০+/৪৫ · স্তন্যপায়ী ১১০+/৪৮ ·
উভচর ৬০+/১৩ · কীট হাজার+/৬৪ · সংবাহী উদ্ভিদ ৫,০০০+/১৭৫ · অমেরুদণ্ডী ১৩ · অণুজীব ১০ · ছত্রাক ৮।

**প্রতি ব্যাচের নিয়ম (আগের ভুল থেকে শেখা):**
1. নতুন সিড ফাইল → `data/seed/more-<group><n>.ts`, `export const MORE_X: Species[]`
2. **`.replace()` দিয়ে hex রং বানাবেন না** — সবসময় লিটারেল `'#aabbcc'` (৬ বার ভুল হয়েছে)
3. `Taxonomy`-তে শুধু `{kingdom, phylum, class, order, family, genus, species}` — `clade`/`subfamily` নেই (TS2353)
4. গাছের ক্লেড (Angiosperms/Tracheophytes) → `phylum`-এ
5. প্রজাতি-স্তরে নিশ্চিত না হলে `Genus spp.` + `NEEDS_CHECK` সোর্স
6. কমিটের আগে: `grep -c "replace(" <file>` → ০, `grep -c "slug:" <file>` → প্রত্যাশিত সংখ্যা
7. স্লাগ/`nameBn`/বাইনোমিয়াল আগের সব রেকর্ডের সাথে মিলিয়ে দেখুন — `dedupe()` `name:<type>:<nameBn>` ও `sci:<binomial>`-এ মার্জ করে
8. `data/seed/index.ts`-এ `import` + `...MORE_X,` যোগ → `npx tsc --noEmit`
9. সার্ভার বন্ধ → `rm -f .data/db.json` → সার্ভার চালু → `python3 /tmp/count.py`
10. **প্রতিটি নতুন `/prani/<slug>` বা `/udbhid/<slug>` কার্ল করে ৪০৪ খুঁজুন** — ৪০৪ মানে সাইলেন্ট মার্জ
11. বাংলায় কমিট মেসেজ (`git commit -F /tmp/msg.txt`, backtick নয়)

### B. ছবি — ২৯৬টি রেকর্ডে নেই
`scripts/import-images.py` ব্যবহার করে `M` অ্যারেতে সারি যোগ করুন; **`media-images.ts` হাতে সম্পাদনা করবেন না**।
ছবি আনার নিয়ম: `site:commons.wikimedia.org <binomial>` সবচেয়ে নির্ভরযোগ্য; বাইনোমিয়াল শিরোনামে বা `source_url`-এ
থাকতে হবে; Brave thumbnail (`-1.jpg`) প্রায়ই ১২০px — **ব্যবহারের আগে `identify` করবেন**;
`en.bdfish.org`, `bdspecies.org`, `indiabiodiversity.org` কাজ করে; Pexels প্রাণীর জন্য নির্ভরযোগ্য নয়।

### C. বিবরণ ও যাচাই
`physical` ১৯৩/৫৮৯ · `behavior` ১৪১ · `reproduction` ২০৭ · `season`/`whereToSee` ১৬২ · `diet` ৩৯১ · `ecologicalRole` ৪৭০।
`dataStatus`: verified ১ · review ১৯৭ · partial ৩৮৫ → দ্বিতীয় সূত্র যাচাই বাকি।

### D. ভিডিও (§১২)
সিডে **একটিও ভিডিও নেই** — `components/SpeciesVideoEmbed.tsx` প্রস্তুত; কয়েকটি লাইসেন্সকৃত ভিডিও যোগ করতে হবে।

### E. অবকাঠামো
- **Automated test** — কোনো টেস্ট-রানার নেই; CI শুধু tsc + lint + build। Vitest/Jest + Playwright যোগ করুন।
- **§২৫-এর ২৭টি গ্রহণযোগ্যতা পরীক্ষা** একবার পুরোটা চালিয়ে দেখুন।
- `app/admin/ai/page.tsx` খুব পাতলা — AI প্রশ্নের ৭-স্তর রিভিউ UI সম্পূর্ণ করুন।
- **Neon-এর `init()`-এর সিডিংয়ের গতি** — বর্তমানে ৫৮৯টি `upsertSpecies` আলাদা কল; বড় হলে ব্যাচ-ইনসার্টে বদলান।
- AI ভিশন (ছবি-প্রশ্ন) `AI_API_KEY` দিলেই চালু হওয়া উচিত — যাচাই করুন।

### F. নীতিমালা (কখনো ভাঙবেন না)
কোনো ডেমো/নকল ব্যবহারকারী-ফলোয়ার-এনগেজমেন্ট নয় · ব্লু-টিক শুধু আমরা দেব · AI কখনো যাচাইহীন তথ্য
জ্ঞানভান্ডারে লিখবে না · অসম্পূর্ণ রেকর্ড চিহ্নিত থাকবে · কপিরাইট-মুক্ত মিডিয়া ছাড়া নয় · পূর্ণ সাহিত্য-পাঠ্য নয়।

---

## ৪) দরকারি কমান্ড

```bash
cd /home/user/ruposhibangla
npm install --no-audit --no-fund     # node_modules স্ন্যাপশটে থাকে না
npx tsc --noEmit                     # টাইপ যাচাই
npm run dev                          # 0.0.0.0:3000 (প্রিভিউ হোস্টের জন্য জরুরি)
python3 /tmp/count.py                # গ্রুপভিত্তিক সংখ্যা + ফিল্ড-ফিল + কারো ছবি নেই
rm -f .data/db.json                  # রিসিড করতে — সার্ভার **বন্ধ** থাকতে হবে
node scripts/migrate.mjs             # Neon-এ টেবিল (DATABASE_URL দরকার)
```

রুট: প্রাণী → `/prani/<slug>` · উদ্ভিদ → `/udbhid/<slug>` · `/gyan/<group>` ৪০৪ — ব্যবহার করুন `/gyan?group=<g>`।
`/api/species`-এ `limit` সর্বোচ্চ ৩০০।

---

## ৫) যা যা ভুল হয়েছে — আবার করবেন না

- **ভুল `nameBn` দিয়ে দুই প্রজাতি মার্জ হয়ে গিয়েছিল** (`চন্দ্রবোড়া`)। প্রতি রিসিডের পর নতুন সব ডিটেইল পেজ কার্ল করুন।
- `.replace()` হ্যাক ৬ বার এসেছে — সবসময় লিটারেল hex।
- `clade:` কী নেই → ৩৬× TS2353।
- `pkill -f next` দিয়ে DB ক্লিয়ার হয় না → `stop_process` → `rm -f .data/db.json` → `start_process`।
- `git push` রিজেক্ট (non-fast-forward) → `git fetch origin <branch>` + `git reset --soft FETCH_HEAD`।
  **কখনো `git push --force` বা `git reset --hard` করবেন না।**
- `git commit -m` এ backtick → মেসেজ নষ্ট। `-F /tmp/msg.txt` ব্যবহার করুন।
- ইনলাইন `python3 -c` দিয়ে লম্বা স্ক্রিপ্ট → SyntaxError। ফাইলে লিখুন।
- অব্যবহৃত import (`IUCN`, `EOFF`) tsc-এ ধরা পড়ে না — কসমেটিক, ব্লকার নয়।

---

## ৬) সেশনের শেষ কাজ

```bash
cd /home/user/ruposhibangla
git add -A
git commit -F /tmp/msg.txt
git push origin arena/3c48228f-ruposhibangla
```

এই `HANDOFF.md` ও `DEPLOYMENT.md`-এর লাইভ-চেকলিস্ট কমিটে থাকতে হবে।
`.env.local` **কমিট হবে না** — অ্যাডমিন পাসওয়ার্ড ব্যবহারকারীকে চ্যাটে দেওয়া হয়েছে।
