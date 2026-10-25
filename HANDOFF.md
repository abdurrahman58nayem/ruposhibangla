# HANDOFF — রূপসী বাংলা (Ruposhi Bangla)

> **পরের সেশনের AI এজেন্টের জন্য নির্দেশাবলি।** প্রথমে এই ফাইল, তারপর `git log --oneline -20` ও `MASTER-PROMPT.md` দেখুন।
> প্রতিটি সেশনের **নিজস্ব ফিক্সড শাখা** থাকে (শেষ সেশন: `arena/5081f420-ruposhibangla`) — অন্য শাখায় কাজ করবেন না,
> শুধু `git push origin <নিজের শাখা>`, PR সেই শাখা থেকে `main`-এ। **কখনো `git push --force` বা `git reset --hard` নয়।**

---

## ০) এক লাইনে বর্তমান অবস্থা

জ্ঞানভান্ডারে **১৪৫১টি রেকর্ড** (প্রাণী ১২০২ — পাখি ৮৫১, স্তন্যপায়ী ১৩৯, মাছ ৭৭, কীটপতঙ্গ ৬৪, সরীসৃপ ৪৫, উভচর ১৩, অন্যান্য অমেরুদণ্ডী ১৩;
উদ্ভিদ/ছত্রাক/অনুজীব ১৯৩, স্থান ৫০, সাহিত্য ৬) · **ছবি ১৪৪৮/১৪৫১** (লোকাল ৬৯২ + কমন্স ৭৫৬, ৩টি নথিভুক্ত ফাঁক) ·
**ভিডিও-এন্ট্রি ১৯৩** (১৫৬ কমন্স সিড + ৩৭ ওয়েব) · তথ্যের অবস্থা: **১৪২১ verified**, ২৩ review, ৬ identity_uncertain, ১ needs_correction ·
মিডিয়া-ক্রেডিট **১৪২৯** (৭৬০ যাচাইকৃত, ৬৬৯ বাকি) · অ্যাডমিন-ইমেইল লগইন, প্রোফাইল কভার-অবতার, সেটিংস, প্রজাতি CRUD+ছবি-আপলোড সব চালু।

> সংখ্যা হাতে লিখবেন না — `npm run stats` চালালেই কোড থেকে প্রকৃত হিসাব আসে (মার্কডাউন টেবিল)।
> `/api/coverage`-এ `rows`-এর সাথে `totals` আছে; **`pranijogot` ছাতা-রো** (সব প্রাণীর সমষ্টি) মোটে গোনা হয় না।

---

## ০.১) ছবি ও ভিডিও — রক্ষণাবেক্ষণ

**অবস্থা: ১৪৪৮/১৪৫১-এ ছবি আছে।** বাকি **৩টি** বাদুড়ের কোনো মুক্ত-লাইসেন্স ছবি নেই (শুধু বিস্তার-মানচিত্র) —
`data/seed/image-gaps.ts`-এ কারণসহ নথিভুক্ত, প্রজাতির পাতায় স্পষ্ট বার্তা দেখায়।

| কাজ | কোথায় | কীভাবে |
|---|---|---|
| ছবি নেই এমন প্রজাতিতে কমন্সের ছবি লিংক | `scripts/link-commons-images.py` (ROWS) → `data/seed/media-images.ts` + `data/seed/media-licenses.ts` | `python3 scripts/link-commons-images.py --titles` → কমন্স API → `--apply` |
| লেখক/লাইসেন্স যাচাই | কমন্স API `extmetadata` (`Artist` + `LicenseShortName`) | `verified: true` + `licenseUrl`; না পেলে `verified: false` (“যাচাই বাকি”) — **কখনোই কল্পিত ক্রেডিট নয়** |
| ছবি আদৌ দেখা যাচ্ছে কিনা | `scripts/audit-species-images.cjs` | `npm run audit:images` · `-- --check` (দূরবর্তী লিংক, ইন্টারনেট দরকার) |
| নিজস্ব সাধারণ চিত্রণ | `public/illustrations/landscapes/` + `data/seed/media-illustrations.ts` | **verified:true**, ক্রেডিট “প্রকল্পের নিজস্ব চিত্রণ” — এগুলো কোনো নির্দিষ্ট স্থানের বাস্তব ছবি নয় |
| নথিভুক্ত ফাঁক | `data/seed/image-gaps.ts` | তালিকার বাইরে কোনো প্রজাতি ছবিহীন থাকলে **`npm test` ব্যর্থ হয়** |

**নিয়ম (§12):** বিস্তার/রেঞ্জ-মানচিত্র, ডায়াগ্রাম, স্ট্যাম্প বা অন্য প্রজাতির ছবি কখনোই “প্রজাতির ছবি”
হিসেবে বসানো যাবে না — এমনকি উইকিপিডিয়ার lead image হলেও না। নতুন ছবি যোগ করার সময়
`subject`/`credit`/`source`/`license` অবশ্যই পূরণ করতে হবে।
`npm test`-এর `check-seed-media.cjs` এখন **প্রতিটি প্রজাতির ছবির ক্রেডিট-রেকর্ড বাধ্যতামূলক** করে (অনুপস্থিত = test fail)।

---

## ১) গত সেশনে যা হয়েছে (সব লোকালে পরীক্ষিত, tsc + lint + test ক্লিন)

| কাজ | কোথায় | অবস্থা |
|---|---|---|
| **কভারেজ ডাবল-কাউন্ট বাগ ঠিক** — `/admin/coverage`-এ মোট ২৬৫৩ দেখাচ্ছিল, প্রকৃত ১৪৫১ | `lib/coverage.ts` (নতুন, একক হিসাব), `lib/repo/json.ts`, `lib/repo/neon-repo.ts`, `app/admin/coverage/page.tsx`, `app/api/coverage/route.ts` | ✅ ছাতা-রো সাবটোটাল, content-রো `—`, `totals` যোগ |
| **Neon-এ সাইলেন্ট ডেটা-লস ঠিক** — `users.cover`, `users.deletion_requested`, `species.stub_archive`, `news.kind/publisher/source_url/published_at`, `jeno.kind` কলাম ছিলই না | `db/schema.sql`-এ `alter table … add column if not exists` + `neon-repo.ts` mapping/insert/update | ✅ প্রোফাইল কভার, মুছার অনুরোধ, সংবাদ-উৎস, জেনো-ধরন, স্টাব-আর্কাইভ এখন সংরক্ষিত |
| **অনুসরণ-সংখ্যা হালনাগাদ** (`following` কখনো বাড়ত না) | `lib/repo/json.ts`, `lib/repo/neon-repo.ts` (`toggleFollow`) | ✅ দুই স্টোরেই |
| **অ্যাডমিনের দেওয়া `dataStatus` হারিয়ে যেত** — রিড-টাইম `verifySpeciesRecord` সব রেকর্ডকে আবার `verified` বানাত | `lib/types.ts` (`statusLockedAt`), `data/seed/verification.ts`, `app/api/species/*`, `db/schema.sql` (`status_locked_at`) | ✅ অ্যাডমিন-এডিট লক থাকে; টেস্টে আটকানো |
| **নিচের নেভি §৪ অনুযায়ী ৬ আইটেম** (সেটিংস ফিরল) | `components/BottomNav.tsx` | ✅ `grid-cols-6`, ছোট পর্দায় ৯.৫px লেবেল |
| **মিডিয়া-ক্রেডিটে ৩৭টি অনিবন্ধিত নিজস্ব চিত্রণ** | `data/seed/media-illustrations.ts` + `media-licenses.ts` + `check-seed-media.cjs` | ✅ ০ অনিবন্ধিত; টেস্টে বাধ্যতামূলক |
| **উৎপত্তি ফাঁকা ৮টি দেশীয় প্রাণী** | `data/seed/verification.ts` → `ORIGIN_OVERRIDES` | ✅ `origin: 'native'` |
| **রেট লিমিট এখন কেন্দ্রীয় করা যায়** (ঐচ্ছিক Upstash REST, ব্যর্থ হলে মেমোরি ফলব্যাক) | `lib/rate-limit.ts` + ৯টি API রুট `await rateGuard(...)` | ✅ `UPSTASH_REDIS_REST_*` |
| **JSON স্টোর লেখা** — ১৮MB ইন্ডেন্টেড, প্রতিবার পুরো ফাইল, ক্র্যাশে নষ্ট হওয়ার ঝুঁকি | `lib/repo/json.ts` `write()` | ✅ কম্প্যাক্ট + টেম্প-ফাইল `rename` (অ্যাটমিক) |
| **টেস্ট-রানার নেই** | `vitest.config.ts`, `tests/unit/*` (২৬টি টেস্ট), `npm run test:unit` | ✅ CI-তে যোগ |
| **`next lint` ইন্টারঅ্যাকটিভ প্রম্পটে আটকে যেত** | `eslint.config.mjs`, `npm run lint` = `eslint .`, CI থেকে `continue-on-error` সরানো | ✅ ০ error |
| **`npm run stats`** — ডকের সংখ্যা কোড থেকেই | `scripts/site-stats.mjs` | ✅ |
| ডক হালনাগাদ (পুরোনো ৬৬১/“০ verified”) | `README.md`, `HANDOFF.md`, `docs/SECURITY.md`, `docs/TESTING.md`, `docs/GITHUB-WORKFLOW.md` | ✅ |

**পরীক্ষা-লগ:** `npm run test:unit` ২৬/২৬ ✅ · `npm run test:contract` ৪/৪ ✅ · `tsc --noEmit` ০ error ✅ ·
`npm run lint` ০ error (২টি স্টাইল-সতর্কতা config-ফাইলে) ✅ · `npm run build` সফল (৮০+ রুট) ✅ ·
প্রোডাকশন সার্ভারে `/`, `/gyan`, `/prani/bagh`, `/feed`, `/reels`, `/ai`, `/admin`, `/songrokkhon`, `/categories` — সব ২০০ ✅

---

## ২) পরিবেশ ভেরিয়েবল (Vercel / `.env.local`)

```
DATABASE_URL            Neon pooled connection string — GitHub secret-এও দিন (Workflow-এর জন্য)
AUTH_SECRET             লম্বা র‍্যান্ডম স্ট্রিং (openssl rand -base64 32)
ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD   প্রথম অ্যাডমিন bootstrap-এ (env থাকলে)
NEXT_PUBLIC_SITE_URL    https://আপনার-ডোমেইন
R2_*                    ঐচ্ছিক — /admin/media থেকে বসানো যায়
UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN   ঐচ্ছিক — কেন্দ্রীয় রেট লিমিট
AI_PROVIDER / AI_API_KEY   ঐচ্ছিক — না দিলে লোকাল RAG
```
> ⚠️ পাসওয়ার্ড/ক্রেডেনশিয়াল রিপোজিটরিতে কমিট **কখনো নয়**। `.env.local` gitignored।

**Neon আপডেট:** নতুন কলামগুলো (`db/schema.sql`-এর শেষ অংশ: `species.stub_archive`, `species.status_locked_at`,
`users.cover`, `users.deletion_requested`, `news.kind/publisher/source_url/published_at`, `jeno.kind`) বসাতে `migrate.yml` → Run workflow
অথবা `DATABASE_URL="…" node scripts/migrate.mjs` চালান। `add column if not exists` — বারবার চালানো নিরাপদ।

---

## ৩) পরের সেশনে যা করতে হবে (অগ্রাধিকার অনুযায়ী)

> ইউজারের স্থায়ী নির্দেশ: **সাইটে ১৪৫১ যা আছে; দেশে প্রকৃত আনুমান — পাখি ~৭০০–৮২৮, স্তন্যপায়ী ১৩৮, সরীসৃপ ~১৬০–১৬৭,
> উভচর ~৪৯–৫৬, মিষ্টিজল মাছ ~২৫৩–২৯৩ (+সমুদ্রী শত শত), প্রজাপতি ~৩০৫, সস্যবীজী উদ্ভিদ ~৩,৮১০–৫,১৩১,
> বাকি পোকা-অণুজীব অগণিত → বাকি ~৫,০০০–৬,৪০০+।** ইউজার **গোষ্ঠী/সীমা ঠিক করে দিলে তবেই নতুন প্রজাতি এড** —
> না বলা পর্যন্ত অপেক্ষা; প্রথমে তার সিদ্ধান্ত নিন।

### A. বাকি তথ্য-ফাঁক (অনুমান ছাড়া)
- **৬৬টি “অন্য/স্থানীয় নাম” নেই** (৬০টি স্তন্যপায়ী + ৪ মাছ + ১ পোকা + ১ অণুজীব) — নির্ভরযোগ্য সূত্র থেকে নাম যোগ করুন, অনুমান নয়।
- **৩৭টি পাহাড়/বন রেকর্ডে উচ্চতা/আয়তন নেই** — সরকারি/বন বিভাগের সূত্র থেকে।
- **৬৬৯টি ছবির ক্রেডিট যাচাই** — কমন্স API (`extmetadata`) দিয়ে; ইন্টারনেট দরকার।
- `/admin/coverage`-এ “ক্ষেত্র-ভিত্তিক পূর্ণতা” টেবিল থেকেই অগ্রাধিকার ঠিক করুন।

### B. ভিডিও
`components/SpeciesVideoEmbed.tsx` প্রস্তুত; `Species.media[]`-এ `{kind:'video', url, credit, license, sourceUrl}` বসালেই
স্পিসিস পেজে এমবেড (YouTube/Commons iframe বা সরাসরি webm/mp4 `<video>`) — **ডাউনলোড/আপলোড নয়, উৎস থেকে স্ট্রিম**।
বর্তমান ১৯৩টি এন্ট্রি (`data/seed/media-videos.ts` ১৫৬ + `media-web-videos.ts` ৩৭)। লক্ষ্য ~২০–৩০ বেশি চিত্রণযোগ্য প্রজাতি।

### C. লোগো ও og-cover
- `public/brand/og-cover.jpg`-তে **Dreamstime ওয়াটারমার্ক + পুরনো লোগো** আছে — বদলাতে হবে। নিজস্ব `public/seed/village/nouka.jpg`
  (নৌকা-মানুষ-নদী) ১২০০×৬৩০ করে নতুন কভার বানান (PIL) + বর্তমান লোগো।
- `logo-mark.svg` ও `logo-mark.png` **আলাদা ডিজাইন** — এক করতে হবে; ইউজারের চাহিদা:
  দেশের রং (পতাকা সবুজ `#006A4E` + লাল `#F42A41`), মানুষ (নৌকা), প্রকৃতি, ঐতিহ্য (কাঁথা-বিন্দু)।
  রেন্ডার: `npm i --no-save sharp` → `sharp('public/brand/logo-mark.svg').resize(512,512).png()`; এরপর favicon-32/64, apple-touch-icon।
- ফ্ল্যাগ-রং প্যালেটে যোগ করা বাকি (`--rb-*` / tailwind)।

### D. অবকাঠামো
- **e2e (Playwright)** যোগ করা — এখন শুধু Vitest + চুক্তি-পরীক্ষা আছে।
- `app/api/admin/setup`-এর `syncSpecies()` এখনো ১৪৫১× upsert — Neon-এ ব্যাচ-ইনসার্টে বদলানো যায় (৮টি করে সমান্তরাল চালে)।
- `dataStatus`-এ ৩০টি রেকর্ড verified নয় — কারণ `UNVERIFIED_REASONS`-এ; দ্বিতীয় সূত্রে যাচাই হলে সরান।
- ইন-মেমোরি রেট লিমিট শুধু `UPSTASH_*` না থাকলে — প্রোডাকশনে সেট করা ভালো।

### E. নীতিমালা (কখনো ভাঙবেন নয়)
কোনো ডেমো/নকল ব্যবহারকারী-ফলোয়ার-এনগেজমেন্ট · ব্লু-টিক শুধু আমরা দেব · AI কখনো যাচাইহীন তথ্য জ্ঞানভান্ডারে লিখবে না ·
কপিরাইট-মুক্ত মিডিয়া ছাড়া নয়, ভিডিও ডাউনলোড/রি-আপলোড নয় · পূর্ণ সাহিত্য-পাঠ্য নয় · লাইসেন্স অজানা হলে `verified:false` + `যাচাই বাকি` ·
`media-images.ts` শুধু স্ক্রিপ্ট দিয়ে (import-images.py/add-images.py) · লিটারেল hex (`.replace()` হ্যাক নয়) · কমিট `git commit -F /tmp/msg.txt` (backtick নয়)।

---

## ৪) দরকারি কমান্ড

```bash
cd /home/user/ruposhibangla
npm install --no-audit --no-fund        # node_modules স্ন্যাপশটে থাকে না (ওয়ার্কস্পেস রিসেট হলেও)
./node_modules/.bin/tsc --noEmit         # npx tsc চালাবেন নয় — ভুল tsc@2.0.4 ইনস্টল করে
npm run lint                            # ESLint CLI (Next 15.5-এ `next lint` অবচিত + ইন্টারঅ্যাকটিভ)
npm run test:unit                       # Vitest
npm test                                # Vitest + ৪টি চুক্তি-পরীক্ষা
npm run stats                           # প্রকৃত সংখ্যা (ডকের জন্য)
npm run dev                             # 0.0.0.0:3000
# রিসিড: সার্ভার বন্ধ → rm -f .data/db.json → start → warm: curl "/api/species?limit=1"
# কভারেজ যাচাই: curl -s localhost:3000/api/coverage | python3 -m json.tool | head -40
#   → totals.records = 1451 (rows-এর প্রাণীজগৎ ছাতা-রো বাদ দিয়ে)
```
রুট: `/prani/<slug>` · `/udbhid/<slug>` · `/sthan/<slug>` · `/sahitto/<slug>` · `/gyan?group=<g>` (এমবেডড ৪০৪ নয়)।
`/api/species`-এ `limit` সর্বোচ্চ ৩০০ (পাবলিক); অ্যাডমিন/অভ্যন্তরীণ কোডে ৫০০০ পর্যন্ত।

---

## ৫) যা যা ভুল হয়েছে — আবার করবেন না

- **কভারেজে ছাতা-ক্যাটাগরি গুনবেন না** — `pranijogot` = সব প্রাণীর সমষ্টি; মোটে গুনলে ১৪৫১-এর জায়গায় ২৬৫৩ দেখাবে।
  হিসাবের একমাত্র জায়গা `lib/coverage.ts`; UI-তে `summarizeCoverage(rows)` ব্যবহার করুন।
- **`create table if not exists` নতুন কলাম যোগ করে না** — নতুন ফিল্ডের জন্য `db/schema.sql`-এ
  `alter table … add column if not exists` + `neon-repo.ts`-এর mapping/insert/update তিনটিই বদলাতে হবে,
  নইলে Neon-এ ডেটা সাইলেন্টলি হারায় (কভার/মুছার-অনুরোধ/সংবাদ-উৎসের মতো)।
- **এক ব্লকে একই ফাইলে একাধিক `edit_file` = রেস, শেষটি জিতে** (আগেরটি মুছে যায়)। ক্রমিক করুন: edit → grep → edit → `tsc`।
- **`edit_file`-এর `old_text`-এ `য়` (U+09DF) থাকলে ম্যাচ হয় না** (Unicode ডিকম্পোজিশন পার্থক্য) — ASCII অ্যাঙ্কর বা python দিয়ে এডিট করুন।
- পাইপের পর `echo $?` → head-এর ০; tsc-শব্দ কেবল stderr থেকে পড়ুন।
- Object spread কল-আর্গুমেন্টে অবৈধ (TS2488) — rest-param + সাধারণ আইডেন্টিফায়ার।
- **`mergeDetails` (details/index.ts) মুছবেন না** — নতুন এন্ট্রি পুরনো ফিল্ড মুছে ফেলে (doyel-এর ঘটনা)।
- **ওয়ার্কস্পেস রিসেট ৩ দেখা** — node_modules/`.data`/pip/`/tmp` মুছে যায়, গিট-ফাইল থাকে। রিসেট: npm install → সার্ভার → রিসিড → অডিট।
  PIL না থাকলে `pip install --break-system-packages pillow`। sharp লাগলে `npm i --no-save sharp`।
- `.data/db.json` সার্ভার **স্টার্টআপে** লেখে; চালু-সার্ভারে ফাইল এডিট ক্যাশে হারায় — স্টপ→এডিট→স্টার্ট।
  এখন ফাইল কম্প্যাক্ট ও অ্যাটমিকভাবে লেখা হয় (`write()`), তাই হাতে সুন্দর করে সাজানো থাকবে না — `npm run stats`/`/api/coverage` দেখুন।
- `UID` bash-এ readonly — ভ্যারিয়েবলে নাম বদলান।
- ইনলাইন `python3 -c` লম্বা স্ক্রিপ্ট → SyntaxError; heredoc ফাইলে লিখুন।
- `git commit -m`-এ backtick → মেসেজ নষ্ট; `-F /tmp/msg.txt`। **`git push --force`/`git reset --hard` কখনো নয়।**
- প্রজাতি-স্লাগ-কী ডিবি-এর সাথে হুবহু মিলতে হবে (`tanguar-haor`, `hakaluki-haor`, `khude-badur`…) — না মিললে সাইলেন্ট মিস।
- ছবি সার্চে ব্যর্থ প্যাটার্ন: commons `site:`+বাইনোমিয়াল ভুল প্রজাতি, ১২০–৩০০px থাম্ব, dreamstime/istock/kiddle/reddit,
  মিউজিয়াম-স্পেসিমেন, ডিস্ট্রিবিউশন-ম্যাপ। কাজ করে: `Category:<binomial>`, সাধারণ কোয়েরি, en.wikipedia infobox File:, flickr-গবেষক।
- **সেটিংস নিচের নেভিতে ৬ষ্ঠ আইটেম** — স্পেক §৪; প্রোফাইলের ⚙️ আলাদা সুবিধা, নেভি বদলাবেন না।
- **শটস্ক্রিন-পুনরাবৃত্তি-অভিযোগ বন্ধ** — কারণ ছিল এজেন্ট-রেসপন্স গ্লিচ, সাইটের ডেটা নয়; বড় রাইট-ফাইল ১০–১২ স্পিসিসে ভাগ করুন, কখনো প্যাড করবেন না।

---

## ৬) সেশনের শেষ কাজ

```bash
cd /home/user/ruposhibangla
npm run test:unit && npm run test:contract && npm run lint
./node_modules/.bin/tsc --noEmit
npm run build
git status                      # পরিবর্তন দেখুন
git add -A
git commit -F /tmp/msg.txt      # বাংলা মেসেজ, backtick ছাড়া
git push origin <এই সেশনের শাখা>
gh pr create --base main --head <শাখা> --title "…" --body "…"
gh pr merge <নম্বর> --merge     # মার্জ কমান্ড চেইনের শেষটি হতে হবে
```
