# HANDOFF — রূপসী বাংলা (Ruposhi Bangla)

> **পরের সেশনের AI এজেন্টের জন্য নির্দেশাবলি।** প্রথমে এই ফাইল, তারপর `git log --oneline -20` ও `MASTER-PROMPT.md` দেখুন।
> প্রতিটি সেশনের **নিজস্ব ফিক্সড শাখা** থাকে (গত সেশন: `arena/261cc675-ruposhibangla`) — অন্য শাখায় কাজ করবেন না,
> শুধু `git push origin <নিজের শাখা>`, PR সেই শাখা থেকে `main`-এ। **কখনো `git push --force` বা `git reset --hard` নয়।**

---

## ০) এক লাইনে বর্তমান অবস্থা

জ্ঞানভান্ডারে **৫৮৯টি প্রজাতি — ছবি ৫৮৯/৫৮৯ (১০০%, ০ ভাঙা), বিস্তারিত তথ্য ৫৮৯/৫৮৯ (১০০%)** ·
ভিডিও **০** · অ্যাডমিন-ইমেইল লগইন, প্রোফাইল কভার-অবতার আপলোড, প্রোফাইলে সেটিংস, অ্যাডমিনে প্রজাতি যোগ/এডিট+ছবি-আপলোড সব চালু ও পরীক্ষিত।

---

## ১) গত সেশনে যা হয়েছে (সব লোকালে পরীক্ষিত, tsc ক্লিন)

| কাজ | কোথায় | অবস্থা |
|---|---|---|
| ৫০৮/৫০৮ ডিটেইলস-এন্ট্রি লেখা+রেজিস্টার | `data/seed/details/*` (৪০+ ফাইল), `index.ts`-এ `mergeDetails` ফিল্ড-মার্জ **রাখতে হবে** | ✅ অডিট ০ ঘাটতি (কঠোর ও মূল নিয়ম দুটোতেই) |
| ছবি ৩০০টি আমদানি | `scripts/import-images.py` → `media-images.ts` (৫৫৪ স্লাগ), সব `verified:false` + `লাইসেন্স যাচাই বাকি` | ✅ ৫৮৯/৫৮৯ |
| রেজিস্টারে ইমেইল বাধ্যতামূলক (ফরম্যাট+ইউনিক) | `components/AuthForm.tsx`, `app/api/auth/register/route.ts` | ✅ ডুপ্লিকেট ৪০৯, ভুল ৪০০ |
| লগইন ইমেইল বা ইউজারনেম | `app/api/auth/login/route.ts` + AuthForm UI “ইমেইল বা ব্যবহারনাম” | ✅ **প্রথম `role==='admin'` অ্যাকাউন্ট = অ্যাডমিন** (সিডে admin নেই — বর্তমানে ০ জন, ইউজার প্রথম রেজিস্টার করলেই অ্যাডমিন) |
| প্রোফাইলে কভার+অবতার আপলোড (FB-স্টাইল) | `components/ProfileControls.tsx` → `/u/[username]` (কভার img + “কভার যোগ করুন/বদলান”, অবতার-ক্যামেরা, ⚙️ সেটিংস) | ✅ নিজ প্রোফাইলে কার্নার, অন্যদের নয় |
| সেটিংস এখন প্রোফাইলের ভেতরে | BottomNav ও হেডার-মেনু থেকে সেটিংস সরানো → প্রোফাইলের ⚙️ | ✅ |
| পোস্টে “ক্যামেরা দিয়ে সোজে তুলুন” | `components/ShareForm.tsx` (`capture="environment"`) + প্রোফাইলে “নতুন পোস্ট” | ✅ |
| অ্যাডমিন প্রজাতি-ফর্ম: বিস্তারিত বৈশিষ্ট্য কার্ড | `SpeciesForm.tsx` (physical/behavior/ecologicalRole — আগে ফর্মে ছিল না), `UploadField`-এ প্রিভিউ+✕ সরান | ✅ POST/PUT/DELETE CRUD লাইভ টেস্ট |
| এডিট-পাতায় “সাইটে দেখুন ↗” | `app/admin/species/[slug]/page.tsx` (পাবলিক পাথ = `/${s.type}/${s.slug}`) | ✅ |

**পরীক্ষা-লগ:** রেজিস্টার(ইমেইল)→admin ✅ · ইমেইল-লগইন ✅ · `/admin` ২০০ ✅ · আপলোড (local storage) ✅ ·
avatar/cover PATCH ✅ · স্পিসিস CRUD ✅ · টেস্ট-ইউজার ও টেস্ট-ফাইল মুছে **০ অ্যাডমিন** অবস্থায় ফেরত ✅

---

## ২) পরিবেশ ভেরিয়েবল (Vercel / `.env.local`)

```
DATABASE_URL            Neon pooled connection string — GitHub secret-এও দিন (Workflow-এর জন্য)
AUTH_SECRET             লম্বা র‍্যান্ডম স্ট্রিং (openssl rand -base64 32)
ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD   প্রথম অ্যাডমিন bootstrap-এ (env থাকলে)
NEXT_PUBLIC_SITE_URL    https://আপনার-ডোমেইন
R2_*                    ঐচ্ছিক — /admin/media থেকে বসানো যায়
AI_PROVIDER / AI_API_KEY   ঐচ্ছিক — না দিলে লোকাল RAG
```
> ⚠️ পাসওয়ার্ড/ক্রেডেনশিয়াল রিপোজিটরিতে কমিট **কখনো নয়**। `.env.local` gitignored।

---

## ৩) পরের সেশনে যা করতে হবে (অগ্রাধিকার অনুযায়ী)

> ইউজারের স্থায়ী নির্দেশ (গত সেশনে প্রশ্নের উত্তরে দেওয়া সংখ্যা-হিসাব মেনে):
> **সাইটে ৫৮৯ যা আছে; দেশে প্রকৃত আনুমান — পাখি ~৭০০–৮২৮, স্তন্যপায়ী ১৩৮, সরীসৃপ ~১৬০–১৬৭,
> উভচর ~৪৯–৫৬, মিষ্টিজল মাছ ~২৫৩–২৯৩ (+সমুদ্রী শত শত), প্রজাপতি ~৩০৫, সস্যবীজী উদ্ভিদ ~৩,৮১০–৫,১৩১,
> বাকি পোকা-অণুজীব অগণিত → বাকি ~৫,০০০–৬,৪০০+।** ইউজার **গোষ্ঠী/সীমা ঠিক করে দিলে তবেই নতুন প্রজাতি এড** —
> না বলা পর্যন্ত অপেক্ষা; প্রথমে তার সিদ্ধান্ত নিন।

### A. ভিডিও (সবচেয়ে বড় বাকি কাজ)
`components/SpeciesVideoEmbed.tsx` প্রস্তুত; `Species.media[]`-এ `{kind:'video', url, credit, license, sourceUrl}` বসালেই
স্পিসিস পেজে এমবেড (YouTube/Commons iframe বা সরাসরি webm/mp4 `<video>`) — **ডাউনলোড/আপলোড নয়, উৎস থেকে স্ট্রিম**।
নতুন ফাইল বানাতে হবে (`data/seed/media-videos.ts` + `data/seed/index.ts`-এ `withSeedVideos` — `withSeedImages`-এর পাশে)।
উৎস: Wikimedia Commons (লাইসেন্স API থেকে যাচাই, ক্রেডিট ছাড়া কখনো নয়), Pexels-স্টাইল হটলিংক। লক্ষ্য ~২০–৩০ চিত্রণযোগ্য প্রজাতি।

### B. লোগো ও og-cover
- `public/brand/og-cover.jpg`-তে **Dreamstime ওয়াটারমার্ক + পুরনো লোগো** আছে — বদলাতে হবে। নিজস্ব `public/seed/village/nouka.jpg`
  (নৌকা-মানুষ-নদী) ১২০০×৬৩০ করে নতুন কভার বানান (PIL) + বর্তমান লোগো।
- `logo-mark.svg` ও `logo-mark.png` **আলাদা ডিজাইন** (SVG দুর্বল, PNG ভালো) — এক করতে হবে; ইউজারের চাহিদা:
  দেশের রং (পতাকা সবুজ `#006A4E` + লাল `#F42A41`), মানুষ (নৌকা), প্রকৃতি, ঐতিহ্য (কাঁথা-বিন্দু)।
  রেন্ডার: `npm i --no-save sharp` → `sharp('public/brand/logo-mark.svg').resize(512,512).png()`; এরপর favicon-32/64, apple-touch-icon ওগুলো থেকেই।
- রঙ/ফন্ট পাস কোড-অডিটে ক্লিন (০ gray, ০ font-sans ওভাররাইড; হেরিটেজ-প্যালেট `--rb-*`; আইকনসেট `components/icons/` সম্পন্ন) —
  শুধু একবার চোখে-দেখা বাকি। ফ্ল্যাগ-রং এখনো প্যালেটে যোগ হয়নি (লোগোর সাথে যোগ করুন)।

### C. অবকাঠামো
- কোনো টেস্ট-রানার নেই — Vitest/Playwright যোগ করুন; CI শুধু tsc+lint+build।
- `app/admin/ai/page.tsx` পাতলা — ৭-স্তর রিভিউ UI।
- Neon seeding ৫৮৯× `upsertSpecies` — ব্যাচ-ইনসার্টে বদলান।
- `dataStatus` বেশিরভাগ `partial/review` — দ্বিতীয় সূত্র যাচাই চলতে পারে (ইউজার না বলা পর্যন্ত নতুন প্রজাতি নয়)।

### D. নীতিমালা (কখনো ভাঙবেন নয়)
কোনো ডেমো/নকল ব্যবহারকারী-ফলোয়ার-এনগেজমেন্ট · ব্লু-টিক শুধু আমরা দেব · AI কখনো যাচাইহীন তথ্য জ্ঞানভান্ডারে লিখবে না ·
কপিরাইট-মুক্ত মিডিয়া ছাড়া নয়, ভিডিও ডাউনলোড/রি-আপলোড নয় · পূর্ণ সাহিত্য-পাঠ্য নয় · লাইসেন্স অজানা হলে `verified:false` + `যাচাই বাকি` ·
`media-images.ts` শুধু স্ক্রিপ্ট দিয়ে (import-images.py/add-images.py) · লিটারেল hex (`.replace()` হ্যাক নয়) · কমিট `git commit -F /tmp/msg.txt` (backtick নয়)।

---

## ৪) দরকারি কমান্ড

```bash
cd /home/user/ruposhibangla
npm install --no-audit --no-fund        # node_modules স্ন্যাপশটে থাকে না (ওয়ার্কস্পেস রিসেট হলেও)
./node_modules/.bin/tsc --noEmit         # npx tsc চালাবেন নয় — ভুল tsc@2.0.4 ইনস্টল করে
npm run dev                             # 0.0.0.0:3000
# রিসিড: সার্ভার বন্ধ → rm -f .data/db.json → start → warm: curl "/api/species?limit=1" (db.json স্টার্টআপে লেখা হয়)
# অডিট: .data/db.json-এ species[] — fields physical,behavior,diet,reproduction,season,whereToSee
#   মূল নিয়ম: ফাঁকা/'absent' = ঘাটতি, '—' = আছে  ·  কঠোর নিয়ম: '—'ও ঘাটতি (দুটোতে ০ আছে এখন)
```
রুট: `/prani/<slug>` · `/udbhid/<slug>` · `/sthan/<slug>` · `/sahitto/<slug>` · `/gyan?group=<g>` (এমবেডড ৪০৪ নয়)।
`/api/species`-এ `limit` সর্বোচ্চ ৩০০। সিড-কী: লগইন-তথ্য সিডে `SEED_USERS` (২টি partner, admin নয়)।

---

## ৫) যা যা ভুল হয়েছে — আবার করবেন না

- **এক ব্লকে একই ফাইলে একাধিক `edit_file` = রেস, শেষটি জিতে** (আগেরটি মুছে যায়)। ক্রমিক করুন: edit → grep → edit → `tsc`।
- **`edit_file`-এর `old_text`-এ `য়` (U+09DF) থাকলে ম্যাচ হয় না** (Unicode ডিকম্পোজিশন পার্থক্য) — ASCII অ্যাঙ্কর বা python দিয়ে এডিট করুন।
- পাইপের পর `echo $?` → head-এর ০; tsc-শব্দ কেবল stderr থেকে পড়ুন।
- Object spread কল-আর্গুমেন্টে অবৈধ (TS2488) — rest-param + সাধারণ আইডেন্টিফায়ার।
- **`mergeDetails` (details/index.ts) মুছবেন না** — নতুন এন্ট্রি পুরনো ফিল্ড মুছে ফেলে (doyel-এর ঘটনা)।
- **ওয়ার্কস্পেস রিসেট ৩ দেখা** — node_modules/`.data`/pip/`/tmp` মুছে যায়, গিট-ফাইল থাকে। রিসেট: npm install → সার্ভার → রিসিড → অডিট।
  PIL না থাকলে `pip install --break-system-packages pillow`। sharp লাগলে `npm i --no-save sharp`।
- db.json সার্ভার **স্টার্টআপে** লেখে; চালু-সার্ভারে ফাইল এডিট ক্যাশে হারায় — স্টপ→এডিট→স্টার্ট।
- `UID` bash-এ readonly — ভ্যারিয়েবলে নাম বদলান।
- ইনলাইন `python3 -c` লম্বা স্ক্রিপ্ট → SyntaxError; heredoc ফাইলে লিখুন।
- `git commit -m`-এ backtick → মেসেজ নষ্ট; `-F /tmp/msg.txt`। **`git push --force`/`git reset --hard` কখনো নয়।**
- প্রজাতি-স্লাগ-কী ডিবি-এর সাথে হুবহু মিলতে হবে (`tanguar-haor`, `hakaluki-haor`, `khude-badur`…) — না মিললে সাইলেন্ট মিস।
- ছবি সার্চে ব্যর্থ প্যাটার্ন: commons `site:`+বাইনোমিয়াল ভুল প্রজাতি, ১২০–৩০০px থাম্ব, dreamstime/istock/kiddle/reddit,
  মিউজিয়াম-স্পেসিমেন, ডিস্ট্রিবিউশন-ম্যাপ। কাজ করে: `Category:<binomial>`, সাধারণ কোয়েরি, en.wikipedia infobox File:, flickr-গবেষক।
- **শটস্ক্রিন-পুনরাবৃত্তি-অভিযোগ বন্ধ** — কারণ ছিল এজেন্ট-রেসপন্স গ্লিচ, সাইটের ডেটা নয়; বড় রাইট-ফাইল ১০–১২ স্পিসিসে ভাগ করুন, কখনো প্যাড করবেন না।

---

## ৬) সেশনের শেষ কাজ

```bash
cd /home/user/ruposhibangla
git status                      # পরিবর্তন দেখুন
git add -A
git commit -F /tmp/msg.txt      # বাংলা মেসেজ, backtick ছাড়া
git push origin <এই সেশনের শাখা>
gh pr create --base main --head <শাখা> --title "…" --body "…"
gh pr merge <নম্বর> --merge     # মার্জ কমান্ড চেইনের শেষটি হতে হবে
```
