# 🌿 জীববৈচিত্র্য কভারেজ অডিট — বাংলাদেশ বনাম রূপসী বাংলা সাইট

> তারিখ: ২০২৬-১০-২৫ · সিড ডেটা (`data/seed`) থেকে স্বয়ংক্রিয় গণনা ও ম্যানুয়াল ক্রস-ম্যাচ ভিত্তিক
> পদ্ধতি: `npm run stats` + সাইটের পাখির বৈজ্ঞানিক নাম উইকিপিডিয়ার *List of birds of Bangladesh* (Clements 2022, ৮২৭ প্রজাতি) ও Avibase (৮২৫) তালিকার সাথে মিলিয়ে যাচাই।
> **একই দিনে অডিটে পাওয়া সমস্যাগুলো সংশোধন করা হয়েছে — বিবরণ §৬-এ। নিচের সংখ্যা সংশোধন-পরবর্তী; পুরোনো সংখ্যা বন্ধনীতে উল্লেখ করা।**

## ১. তথ্যসূত্র (বাংলাদেশের প্রামাণিক সংখ্যা)

| উৎস | যা দেয় |
|---|---|
| **IUCN Red List of Bangladesh 2015** | ৭টি প্রাণিগোষ্ঠীতে ১,৬১৯ প্রজাতি মূল্যায়ন: স্তন্যপায়ী ১৩৮, পাখি ৫৬৬ (মূল্যায়িত), সরীসৃপ ১৬৭, উভচর ৪৯, মিঠাপানির মাছ ২৫৩, ক্রাস্টেসিয়ান ১৪১, প্রজাপতি ৩০৫ |
| **উইকিপিডিয়া/Avibase (Clements 2022)** | বাংলাদেশের পাখি **৮২৭** (বিরল/ভ্রাম্যমাণসহ); Avibase ৮২৫; ফিল্ড গাইড ২০১৯: ৭০৫; বাংলাদেশ বার্ড ক্লাব জরিপ: ৭১৮ |
| **CVPB 2026 (Zenodo)** | ভাস্কুলার উদ্ভিদ **৪,৬২৯ প্রজাতি** (৪,৫২৫ সপুষ্পক, ২১ জিমনোস্পার্ম, ২০৮ ফার্ন) |
| **CBD ৪র্থ জাতীয় প্রতিবেদন / DoE 2015** | মাছ মোট ৬৫৩ (২৫১ মিঠাপানি + ৪০২ সামুদ্রিক/মোহনা); উদ্ভিদ ২,৭৬৪ |
| **Habib & Islam (2021), Bangladesh J. Fish. 32(2): 357–367** | বাংলাদেশের সামুদ্রিক মাছ **৭৪০ প্রজাতি** (৩৮৯ গণ, ১৪৫ পরিবার, ৩০ বর্গ; বৈজ্ঞানিক + ইংরেজি + বাংলা/স্থানীয় নাম + বৈশ্বিক IUCN; ৮১ কার্টিলেজ-মাছসহ) — সামুদ্রিক কর্মসূচির প্রামাণিক ভিত্তি (§৩৩–§৩৬) |
| **Banglapedia/Gaston et al.** | অমেরুদণ্ডী প্রাণি ~৪,৫০০; নথিভুক্ত পোকামাকড় ~২,৪৯৩; শৈবাল ~২,০০০; ছত্রাক কয়েকশ |

## ২. মাস্টার তুলনা — বাংলাদেশে যা আছে বনাম সাইটে যা আছে

### প্রাণিজগৎ (সাইটে মোট ১,৩৫৭ রেকর্ড; পূর্বে ১,৩৫১)

| গোষ্ঠী | বাংলাদেশে (প্রামাণিক) | সাইটে | কভারেজ | ঘাটতি/মন্তব্য |
|---|---:|---:|---:|---|
| পাখি | ৭০৫–৭১৮ (নিয়মিত); ৮২৭–৮৩৫ (ভ্রাম্যমাণসহ) | **৮৪৮** (পূর্বে ৮৫১) | সংখ্যায় ছাড়িয়ে গেছে | ✅ ৩ হুবহু ডুপ্লিকেট একীভূত; ✅ ২ ভুল-লেবেল সংশোধন; ✅ ২ সন্দেহজনক প্রজাতি `review`-তে |
| স্তন্যপায়ী | ১৩৮ | **১৩৯** | ~১০০% | ১৩৮ বন্যপ্রাণি + *Homo sapiens*; ✅ ৫টি আঞ্চলিকভাবে বিলুপ্ত (RE) প্রজাতিতে স্পষ্ট ফ্ল্যাগ |
| সরীসৃপ | ১৬৭ | **১৬৫** | ৯৯% | **২টি বাদ** (ধাপ ১–১১-এ ১২০টি যোগ হয়েছে, §৭–১৮ দ্রষ্টব্য) |
| উভচর | ৪৯ (Rayan & Islam 2026 চেকলিস্টে ৯৬) | **৫১** | ১০৪% (৪৯-লক্ষ্যে); ৯৬-লক্ষ্যে ৫৩% | **ধাপ ১–৪-এ ৩৮টি যোগ** (§১৬, §১৯–§২১ দ্রষ্টব্য); ১টি generic |
| মাছ (মিঠাপানি) | ২৫৩ | **১৭৪** | ৬৯% | **~৭৯টি বাদ** (§২২–§৩২ দ্রষ্টব্য); সামুদ্রিক মাছ: **৫৬টি** (§৩৩–§৩৬; Habib & Islam 2021-এর ৭৪০-চেকলিস্টভিত্তিক কর্মসূচি — ব্যাচ ১২–১৫-এ ১৪ করে), মোট মাছ-রেকর্ড **২৩০** |
| কীটপতঙ্গ | ~২,৪৯৩ নথিভুক্ত (একা প্রজাপতি ৩০৫) | **৬৪** | ২.৬% | Lepidoptera ২১টি = **১৭ প্রজাপতি + ৪ মথ**; ১৩টি রেকর্ড `spp.`-ভিত্তিক (প্রজাতি-স্তর নয়) |
| অন্যান্য অমেরুদণ্ডী | ক্রাস্টেসিয়ান একাই ১৪১; মোট অমেরুদণ্ডী ~৪,৫০০ | **১৩** | <১% (ক্রাস্টেসিয়ানে ~৯%) | ৪টি generic; মাকড়সা/মলাস্কা/ক্রাস্টেসিয়ানে বিশাল ফাঁক |

### উদ্ভিদ, ছত্রাক, অণুজীব (সাইটে মোট ১৯৩ রেকর্ড — অপরিবর্তিত)

| গোষ্ঠী | বাংলাদেশে (প্রামাণিক) | সাইটে | কভারেজ | মন্তব্য |
|---|---:|---:|---:|---|
| ভাস্কুলার উদ্ভিদ (উদ্ভিদ ও ফুল ৯৪ + গাছ ও বন ৮২) | ৪,৬২৯ (CVPB); পুরোনো হিসাবে ৩,৯৫৬–৪,১৪২ | **১৭৬** | **~৪%** | **~৩,৮০০–৪,৪৫০ প্রজাতি বাদ**; ২টি generic; ✅ Azolla এখন সঠিক বিভাগে |
| ছত্রাক ও শৈবাল | শৈবাল ~২,০০০ + ছত্রাক কয়েকশ | **৭** (পূর্বে ৮) | <১% | ৩টি generic |
| অণুজীব | জাতীয় চেকলিস্ট নেই | **১০** | — | শিক্ষামূলক নির্বাচন; ২টি generic |

### অন্যান্য কনটেন্ট
স্থান ৫০, সাহিত্য ৬ — এগুলো প্রজাতি-রেকর্ড নয়। **সর্বমোট রেকর্ড ১,৫৪৪** (পূর্বে ১,৪৫১; কাঁচা ১,৫৯২ → ৭২টি স্বয়ংক্রিয় একীভূতকরণ; বিস্তার-দলিল ৫৮৭)।
তথ্যের অবস্থা: যাচাইকৃত **১,৫১২**, পর্যালোচনাধীন **২৫**, পরিচয় অনিশ্চিত **৬**, সংশোধন-প্রয়োজন **১**।
ছবি: **১,৫৪১/১,৫৪৪** (লোকাল ৬৯১ + দূরবর্তী ৮৫০); বাকি ৩টি বাদুড়ের ফাঁক `image-gaps.ts`-এ নথিভুক্ত।

## ৩. পাখির গভীর যাচাই (৮৪৮ বনাম ৮২৭-তালিকা)

- **৮০০টি** বৈজ্ঞানিক নাম হুবহু মিলেছে; **৩৩টি** genus-পরিবর্তন/বানান-ভেদে একই প্রজাতি (যেমন *Turdoides striata* → *Argya striata*, *Bubo nipalensis* → *Ketupa nipalensis*, *Streptopelia* → *Spilopelia*)।
- **১৭টি** উইকি-৮২৭ তালিকার বাইরে — এর প্রায় সবই Avibase-স্বীকৃত বিরল/ভ্রাম্যমাণ প্রজাতি (Smew *Mergellus albellus*, Tiger Shrike, Eared Pitta, Blue-winged Pitta, Great Frigatebird ইত্যাদি) বা প্রজাতি-বিভাজন (split)।
- ✅ **২টি সত্যিকারের সন্দেহজনক প্রজাতি এখন `review`** (`UNVERIFIED_REASONS`-এ কারণসহ, প্রজাতির পাতায় ব্যানার দেখায়):
  - `dhusorchokh-bulbul` — Grey-eyed Bulbul *Iole propinqua* (মূলত থাইল্যান্ড/ইন্দোচীন; বাংলাদেশের সমতুল্য প্রজাতি *Iole cacharensis* আলাদা রেকর্ডে আছে)
  - `sadapet-katthokra` — White-bellied Woodpecker *Dryocopus javensis* (পশ্চিমঘাট/উত্তর-পূর্ব ভারত/SE এশিয়া; বাংলাদেশে নথিভুক্ত নয়)

### ডুপ্লিকেট — অডিট ফলাফল ও নিষ্পত্তি
| সাধারণ নাম | রেকর্ড দুটি | সমস্যা | নিষ্পত্তি |
|---|---|---|---|
| Jungle Babbler | `shatbhaya` (*T. striata*) / `jungle-satvai` (*A. striata*) | genus split — একই প্রজাতি | ✅ `shatbhaya`-তে একীভূত; বৈজ্ঞানিক নাম *Argya striata*; পুরোনো স্লাগ synonyms-এ, কমন্স ছবি প্রাইমারি, লোকাল ছবি গ্যালারিতে, ভিডিও সংরক্ষিত |
| House/Little Swift | `batashi` (*A. affinis*) / `ghor-suift` (*A. nipalensis*) | ভিন্ন প্রজাতি, ভুল লেবেল | ✅ মার্জ নয় — `batashi` = **Little Swift** হিসেবে সংশোধিত; `ghor-suift` = House Swift অক্ষত; মিথ্যা "বিরল" তথ্য সংশোধিত |
| Scops Owl | `hutum-pecha` (*O. bakkamoena*) / `collared-scopsowl` (*O. lettia*) | ভিন্ন প্রজাতি, ভুল লেবেল | ✅ মার্জ নয় — `hutum-pecha` = **Indian Scops Owl**; `collared-scopsowl` অক্ষত |
| Spot-bellied Eagle-Owl | `dagipet-hutompecha` / `spotbelly-eagleowl` | *Bubo* = *Ketupa nipalensis* — হুবহু ডুপ | ✅ `dagipet-hutompecha`-তে একীভূত; পুরোনো নাম/স্লাগ synonyms-এ |
| Greater Necklaced Laughingthrush | `boro-mala-hasidama` / `galarmala-hasidhupi` | *Garrulax* = *Pterorhinus pectoralis* — হুবহু ডুপ | ✅ `boro-mala-hasidama`-তে একীভূত; দ্বিতীয় কমন্স ছবি গ্যালারিতে |

> দুর্ঘটনা-সংশোধন: মুছে ফেলার সময় আলাদা বৈধ প্রজাতি `dusky-eagleowl` (*Bubo coromandus*, মেটে হুতুমপেঁচা) একবার মুছে গিয়েছিল; ব্যাকআপ থেকে সঙ্গে সঙ্গে পুনরুদ্ধার করা হয়েছে এবং টেস্টে নিশ্চিত করা হয়েছে।

অন্যান্য নাম-সংঘর্ষের নিষ্পত্তি: ✅ Firefly — `jonaki` = "Fireflies (Luciolinae subfamily)" (কবিতার poetViews অক্ষত), `jonaki-poka` = "Firefly (Luciola genus)"; ✅ Long Whiskered Catfish — `nuna-tengra`-র ইংরেজি নাম **Gulio Catfish** (পুরোনো নাম otherNames-এ), `air` অক্ষত; ✅ বাংলা "বাতাসি" — মাছের রেকর্ডের নাম **বাতাসি মাছ** ("বাতাসি" otherNames-এ অনুসন্ধানযোগ্য)। সংশোধনের পর ইংরেজি ও বাংলা নামে **শূন্য ডুপ্লিকেট** (স্বয়ংক্রিয় স্ক্যানে নিশ্চিত)।

## ৪. অন্যান্য তথ্য-মান যাচাই

- ✅ **slug-এ ডুপ্লিকেট নেই**; সব প্রজাতির ছবি ও অন্তত একটি তথ্যসূত্র আছে; ১,৪৮৮/১,৫২০ যাচাইকৃত।
- ⚠️ **২৫টি রেকর্ড প্রজাতি-স্তরের নয়** (`sp.`/`spp.`/গোত্রগত): কীটপতঙ্গে ১৩, অমেরুদণ্ডীতে ৪, ছত্রাক-শৈবালে ৩, অণুজীবে ২, উভচর/উদ্ভিদে ১+১।
- ✅ আঞ্চলিকভাবে বিলুপ্ত স্তন্যপায়ীদের `IUCN_VERIFIED_OVERRIDES`-এ স্পষ্ট দেশীয় অবস্থা যোগ করা হয়েছে (বৈশ্বিক IUCN কোড অক্ষুণ্ণ রেখে):
  - **RE (IUCN Bangladesh 2015, ৫টি):** `hyena` striped hyena, `sloth-bhalluk` sloth bear, `krishnosar` blackbuck, `buno-mohish` wild buffalo, `gonrar` nilgai
  - `gourh` gaur — ২০০০ তালিকায় RE ছিল; ২০১৫ পুনর্মূল্যায়নে স্থায়ী বন্য জনসংখ্যার নিশ্চিত প্রমাণ নেই (অনিশ্চিত হিসেবে চিহ্নিত)
- ✅ *Azolla pinnata* (জলজ ফার্ন, শ্রেণি Polypodiopsida) `chhatrak`/শৈবাল থেকে `udbhidful`/**জলজ উদ্ভিদ**-এ সরানো হয়েছে; বিস্তার-দলিল স্লাগ-ভিত্তিক বলে সংযুক্তই থাকল।
- ⚠️ স্তন্যপায়ীর ৬০টি রেকর্ডে "স্থানীয়/অন্য নাম" ফাঁকা (স্ট্যাটস রিপোর্ট অনুযায়ী)।

## ৫. অগ্রাধিকার সুপারিশ (অবশিষ্ট)

1. **পাখি:** ✅ ডুপ্লিকেট-সংকট নিষ্পন্ন (৮৫১ → ৮৪৮)। দুটি `review` প্রজাতি (*Iole propinqua*, *Dryocopus javensis*) বিশেষজ্ঞ-যাচাই সাপেক্ষে রাখা/বাদ দেওয়া হবে।
2. **সরীসৃপ (অবশিষ্ট ~৫০; ধাপ ১–৬-এ ৭২টি সম্পন্ন), উভচর (অবশিষ্ট ২৪; ধাপ ১-এ ১২টি সম্পন্ন), মিঠাপানির মাছ (১৭৬)** — IUCN ২০১৫ তালিকা অনুযায়ী দ্রুততম বড় সংগ্রহ-লক্ষ্য।
3. **প্রজাপতি:** ৩০৫ প্রজাতির তুলনায় সাইটে ১৭টি (Lepidoptera মোট ২১; ৪ মথসহ) — স্বতন্ত্র সাব-গ্রুপ হিসেবে অগ্রাধিকার দেওয়া যায়।
4. **উদ্ভিদ:** ১৭৬ → হাজার-স্কেলে নিতে CVPB চেকলিস্টকে মাস্টার-লিস্ট বানানো (§৫.২ ধাপ ১)।
5. **ক্রাস্টেসিয়ান (১৪১) ও শৈবাল (~২,০০০)** — "অন্যান্য অমেরুদণ্ডী" ও "ছত্রাক-শৈবাল" বিভাগে প্রায় শূন্য অবস্থা।
6. generic `spp.` রেকর্ডগুলো ধীরে ধীরে প্রজাতি-স্তরে ভাঙা।

## ৬. সংশোধন লগ (২০২৬-১০-২৫) — কোন ফাইলে কী বদলেছে

| # | ফাইল | পরিবর্তন |
|---|---|---|
| ১ | `data/seed/more-birds38.ts` | `jungle-satvai` রেকর্ড মুছে `shatbhaya`-তে একীভূত |
| ২ | `data/seed/more-birds21.ts` | `spotbelly-eagleowl` মুছে `dagipet-hutompecha`-তে একীভূত; `dusky-eagleowl` অক্ষত |
| ৩ | `data/seed/more-birds39.ts` | `galarmala-hasidhupi` মুছে `boro-mala-hasidama`-তে একীভূত |
| ৪ | `data/seed/more-animals.ts` | shatbhaya-র *Argya* সংশোধন + synonyms/otherNames/কমন্স ছবি; `batashi` → Little Swift; `hutum-pecha` → Indian Scops Owl; `batashi-machh` → বাতাসি মাছ |
| ৫ | `data/seed/more-birds11.ts`, `more-birds22.ts` | পুরোনো বৈজ্ঞানিক নাম ও স্লাগ synonyms-এ; *Pterorhinus* হালনাগাদ; গ্যালারি ছবি |
| ৬ | `data/seed/more-birds41.ts` | `ghor-suift`-এর মিথ্যা "বিরল" বিবরণ সংশোধন (স্থায়ী বাসিন্দা) |
| ৭ | `data/seed/verification.ts` | ২ নতুন `UNVERIFIED_REASONS` (review); batashi কারণ হালনাগাদ; ৬ স্তন্যপায়ীর `IUCN_VERIFIED_OVERRIDES` (RE/অনিশ্চিত) |
| ৮ | `data/seed/media-videos.ts`, `media-licenses.ts` | একীভূত স্লাগের ভিডিও/ক্রেডিট ক্যানোনিক্যাল স্লাগে স্থানান্তর (কোনো মিডিয়া বা ক্রেডিট মুছে ফেলা হয়নি) |
| ৯ | `data/seed/animals.ts`, `insects.ts`, `more-fish.ts` | Firefly দুই রেকর্ডের পৃথক ইংরেজি নাম; Gulio Catfish নামকরণ |
| ১০ | `data/seed/fungi-algae.ts` | Azolla → `udbhidful`/জলজ উদ্ভিদ |
| ১১ | `README.md`, `HANDOFF.md` | সব হালনাগাদ সংখ্যা (১,৪৪৮ / ১,১৯৯ / ৮৪৮ ইত্যাদি) |

**যাচাই:** `npm test` (২৬ ইউনিট + ৪ কন্ট্রাক্ট স্ক্রিপ্ট) পাস; `npm run lint` ও `npx tsc --noEmit` পাস; ৩৯-দফা স্বয়ংক্রিয় রিগ্রেশন স্ক্যানে শূন্য নাম-ডুপ্লিকেট ও সব মিডিয়া-ক্রেডিট সংযুক্ত।
**নীতি:** কাঁচা তথ্য/ছবি/ভিডিও/ক্রেডিট মুছে ফেলা হয়নি — প্রজাতি-স্লাগ synonyms-এ থাকায় পুরোনো লিংকের ছবি-রেজোলিউশন ও সার্চ কাজ করে; একীভূতকরণ রিপোজিটরির বিদ্যমান `dedupe()`/`UNVERIFIED_REASONS` প্যাটার্ন অনুসরণ করে।

## ৭. সরীসৃপ-সংযোজন ধাপ ১ (২০২৬-১০-২৫) — ১২টি সাপ

নতুন ফাইল `data/seed/more-reptiles.ts`; প্রতিটি রেকর্ড পূর্ণ বাংলা তথ্য, taxonomy, আবাস/বিস্তৃতি/`whereToSee`, IUCN অবস্থা ও Commons-যাচাইকৃত ছবি-লাইসেন্সসহ (`media-licenses.ts`)। সবগুলো বৈশ্বিক IUCN-এ LC এবং বাংলাদেশে প্রামাণিক (HERPS_BD ২০০৯; IUCN_BD ২০১৫)।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র |
|---|---|---|---|---|
| ১ | sunbeam-snake | রূপালি সাপ | *Xenopeltis unicolor* | Xenopeltidae |
| ২ | radiated-ratsnake | তামামাথা ইঁদুর সাপ | *Coelognathus radiatus* | Colubridae |
| ৩ | common-bronzeback | সাধারণ দারুশ সাপ | *Dendrelaphis tristis* | Colubridae |
| ৪ | painted-bronzeback | চিত্রা দারুশ সাপ | *Dendrelaphis pictus* | Colubridae |
| ৫ | common-cat-snake | সাধারণ বিড়াল সাপ | *Boiga trigonata* | Colubridae |
| ৬ | green-cat-snake | সবুজ বিড়াল সাপ | *Boiga cyanea* | Colubridae |
| ৭ | twinspotted-wolf-snake | জারা নেকড়ে সাপ | *Lycodon jara* | Colubridae |
| ৮ | cantors-kukri-snake | ক্যান্টর কুকরি সাপ | *Oligodon cyclurus* | Colubridae |
| ৯ | common-mock-viper | ছদ্ম ভাইপার সাপ | *Psammodynastes pulverulentus* | Pseudaspididae |
| ১০ | green-keelback | সবুজ কীলক সাপ | *Macropisthodon plumbicolor* | Colubridae |
| ১১ | sawscaled-viper | ফুরুস সাপ | *Echis carinatus* | Viperidae |
| ১২ | greater-black-krait | বড় কালো কেউটে | *Bungarus niger* | Elapidae |

**ফলাফল:** সরীসৃপ ৪৫ → **৫৭** (১৬৭-র ৩৪%); মোট রেকর্ড ১,৪৪৮ → **১,৪৬০**; নতুন ১২টি ছবিরই লেখক/লাইসেন্স Commons API (extmetadata) দিয়ে যাচাই করে নিবন্ধিত (২টি CC0, বাকি CC BY/CC BY-SA)। বিষাক্ত ফুরুস ও বড় কালো কেউটে-র রেকর্ডে শুধু দ্রুত হাসপাতাল/অ্যান্টিভেনম-পরামর্শ রাখা হয়েছে—কোনো ভিত্তিহীন ঘরোয়া চিকিৎসা নয়।
**পরের ধাপ:** ধাপ ২ — Colubridae অবশিষ্ট (*Dendrelaphis*/*Boiga*/*Lycodon*/*Oligodon*-এর বাকি প্রজাতি) ও সামুদ্রিক সাপ (*Hydrophis* গণ); প্রতি ধাপে ১২টি করে, অবশিষ্ট ~১১০টি শেষ হতে আরও ~৯ ধাপ।

## ৮. সরীসৃপ-সংযোজন ধাপ ২ (২০২৬-১০-২৫) — আরও ১২টি সাপ (Colubridae)

নতুন ফাইল `data/seed/more-reptiles2.ts`; ধাপ ১-এর মতোই পূর্ণ বাংলা তথ্য, taxonomy, আবাস/বিস্তৃতি/`whereToSee`, IUCN অবস্থা ও Commons-যাচাইকৃত ছবি-লাইসেন্সসহ। সবগুলো বৈশ্বিক IUCN-এ LC এবং বাংলাদেশে প্রামাণিক (HERPS_BD ২০০৯; IUCN_BD ২০১৫)।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | লাইসেন্স |
|---|---|---|---|---|
| ১ | indochinese-ratsnake | ধূসর ইঁদুর সাপ | *Ptyas korros* | CC BY 2.0 |
| ২ | keeled-ratsnake | খাঁজযুক্ত ইঁদুর সাপ | *Ptyas carinata* | CC BY 4.0 |
| ৩ | common-wolf-snake | সাধারণ নেকড়ে সাপ | *Lycodon capucinus* | CC BY 3.0 |
| ৪ | banded-wolf-snake | ডোরা নেকড়ে সাপ | *Lycodon fasciatus* | CC BY-SA 4.0 |
| ৫ | lightbarred-kukri | ফ্যাকাশে-ডোরা কুকরি সাপ | *Oligodon albocinctus* | CC BY 2.0 |
| ৬ | bengalese-kukri | বাংলা কুকরি সাপ | *Oligodon dorsalis* | Public domain (Hardwicke, ১৮৩৩–৩৪) |
| ৭ | tawny-cat-snake | মেটে বিড়াল সাপ | *Boiga ochracea* | CC BY-SA 4.0 |
| ৮ | gray-cat-snake | ধূসর বিড়াল সাপ | *Boiga siamensis* | CC BY-SA 4.0 |
| ৯ | walls-bronzeback | নীলাভ দারুশ সাপ | *Dendrelaphis cyanochloris* | CC BY-SA 4.0 |
| ১০ | painted-keelback | রঙিন কীলক সাপ | *Xenochrophis cerasogaster* | CC BY 3.0 |
| ১১ | olive-keelback | জলপাই কীলক সাপ | *Atretium schistosum* | CC BY-SA 4.0 |
| ১২ | black-headed-snake | তীর-মাথা সাপ | *Sibynophis sagittarius* | CC BY-SA 4.0 |

**ফলাফল:** সরীসৃপ ৫৭ → **৬৯** (১৬৭-র ৪১%); মোট রেকর্ড ১,৪৬০ → **১,৪৭২**; ১২টি ছবিরই লেখক/লাইসেন্স Commons API (extmetadata) দিয়ে যাচাই করে নিবন্ধিত (১টি পাবলিক ডোমেইন, বাকি CC BY/CC BY-SA)। *Boiga* দুটি হালকা বিষদাঁতের—রেকর্ডে দ্রুত হাসপাতাল-পরামর্শ রাখা হয়েছে, কোনো ভিত্তিহীন ঘরোয়া চিকিৎসা নয়।
**পরের ধাপ:** ধাপ ৩ — বঙ্গোপসাগরের সামুদ্রিক সাপ (*Hydrophis*/*Enhydrina* গণ) ও Natricinae জল-সাপ; অবশিষ্ট ~৯৮টি শেষ হতে আরও ~৮ ধাপ।

## ৯. সরীসৃপ-সংযোজন ধাপ ৩ (২০২৬-১০-২৫) — ১২টি জল-সাপ (সামুদ্রিক, মোহনা ও মিঠাজল)

নতুন ফাইল `data/seed/more-reptiles3.ts`; পূর্ববর্তী ধাপগুলোর মতোই পূর্ণ বাংলা তথ্য, taxonomy, আবাস/বিস্তৃতি/`whereToSee`, IUCN অবস্থা ও Commons-যাচাইকৃত ছবি-লাইসেন্সসহ। ৮টি সামনের-বিষদাঁতযুক্ত সামুদ্রিক সাপ (Elapidae/Hydrophiinae), ৩টি মোহনা-পাঁকের Homalopsidae (হালকা বিষদাঁত) এবং ১টি মিঠাজলের বিষহীন Natricidae। সবগুলো বৈশ্বিক IUCN-এ LC এবং বাংলাদেশে প্রামাণিক (HERPS_BD ২০০৯; IUCN_BD ২০১৫)।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | লাইসেন্স |
|---|---|---|---|---|---|
| ১ | beaked-sea-snake | খাঁড়িমুখো সামুদ্রিক সাপ | *Enhydrina schistosa* | Elapidae | CC BY 4.0 |
| ২ | annulated-sea-snake | বলয়িত সামুদ্রিক সাপ | *Hydrophis cyanocinctus* | Elapidae | Public domain (Fauna of British India) |
| ৩ | yellow-sea-snake | সর্পিল সামুদ্রিক সাপ | *Hydrophis spiralis* | Elapidae | Public domain (Wagler, ১৮২৮–৩৩) |
| ৪ | ornate-sea-snake | অলংকৃত প্রবাল সামুদ্রিক সাপ | *Hydrophis ornatus* | Elapidae | CC BY-SA 2.0 |
| ৫ | shaws-sea-snake | খাটো সামুদ্রিক সাপ | *Hydrophis curtus* | Elapidae | CC0 |
| ৬ | striped-sea-snake | ডোরা সামুদ্রিক সাপ | *Hydrophis fasciatus* | Elapidae | CC0 |
| ৭ | dwarf-sea-snake | বামন সামুদ্রিক সাপ | *Hydrophis caerulescens* | Elapidae | Public domain (Iconographia Zoologica) |
| ৮ | blackbanded-sea-snake | কালো-বলয় সামুদ্রিক সাপ | *Hydrophis nigrocinctus* | Elapidae | Public domain (হামবুর্গ গ্রন্থ, ১৮৫৬) |
| ৯ | yellowspotted-keelback | হলদে-ফোঁটা কীলক সাপ | *Fowlea flavipunctata* | Natricidae | CC BY 4.0 |
| ১০ | dogfaced-water-snake | কুকুর-মুখো মোহনা সাপ | *Cerberus rynchops* | Homalopsidae | CC BY-SA 4.0 |
| ১১ | glossy-marsh-snake | চকচকে পাঁক-সাপ | *Gerarda prevostiana* | Homalopsidae | CC BY-SA 4.0 |
| ১২ | crabeating-water-snake | সাদা-পেট কাঁকড়া-খেকো সাপ | *Fordonia leucobalia* | Homalopsidae | CC BY 4.0 |

**ফলাফল:** সরীসৃপ ৬৯ → **৮১** (১৬৭-র ৪৯%); মোট রেকর্ড ১,৪৭২ → **১,৪৮৪**; ১২টি ছবিরই লেখক/লাইসেন্স Commons API (extmetadata) দিয়ে যাচাই করে নিবন্ধিত (৪টি পাবলিক ডোমেইন, ২টি CC0, ৬টি CC BY/CC BY-SA)। আটটি সামুদ্রিক Elapidae-র রেকর্ডে শুধু দ্রুত হাসপাতাল/অ্যান্টিভেনম-পরামর্শ রাখা হয়েছে—কোনো ভিত্তিহীন ঘরোযা চিকিৎসা নয়।

**বিশেষ নোট:**
- *Hydrophis nigrocinctus* অত্যন্ত বিরল—১৮০৩-র পর প্রথম নিশ্চিত বাংলাদেশি নমুনা ২০১৫ সালের ফেব্রুয়ারিতে সুন্দরবনের দুবলার চরে মেলে (তৃতীয় বৈশ্বিক নমুনা, ২০২৪-এ বর্ণিত); রেকর্ডে বিরলতা ও সংরক্ষণ-গুরুত্ব উল্লেখ করা হয়েছে।
- *Hydrophis caerulescens*-এর কোনো আধুনিক মুক্ত-লাইসেন্স আলোকচিত্র কমন্সে নেই; পাবলিক-ডোমেইন ঐতিহাসিক মুদ্রণের (Iconographia Zoologica, PD-old-70) Commons থাম্ব JPG ব্যবহার করা হয়েছে।
- প্রাথমিক তালিকার *Hydrophis viperinus* (=*Praescutata viperina*) কমন্সে কোনো ব্যবহারযোগ্য মুক্ত ছবি না পাওয়ায় এই ধাপ থেকে প্রত্যাহার করে *Fowlea flavipunctata* দিয়ে প্রতিস্থাপিত হয়েছে; ভবিষ্যতে `image-gaps.ts` প্রার্থী হিসেবে বিবেচ্য।
- *Gerarda prevostiana*-র কাঁকড়া টুকরো করে খাওয়ার অনন্য আচরণ এবং *Fordonia leucobalia*-র কাঁকড়া-গর্ত শিকার-কৌশল রেকর্ডে নথিভুক্ত।

**পরের ধাপ:** ধাপ ৪ — স্থলজ সরীসৃপের পরবর্তী ব্যাচ (অবশিষ্ট Colubridae/Elapidae, গেকো-টিকটিকি ও স্কিঙ্ক গোষ্ঠী থেকে ১২টি); অবশিষ্ট ~৮৬টি শেষ হতে আরও ~৮ ধাপ।

## ১০. সরীসৃপ-সংযোজন ধাপ ৪ (২০২৬-১০-২৫) — ১২টি স্থলজ সরীসৃপ (টিকটিকি, গুইসাপ, কচ্ছপ)

নতুন ফাইল `data/seed/more-reptiles4.ts`; পূর্ববর্তী ধাপগুলোর মতোই পূর্ণ বাংলা তথ্য, taxonomy, আবাস/বিস্তৃতি/`whereToSee`, IUCN অবস্থা ও Commons-যাচাইকৃত ছবি-লাইসেন্সসহ। এই ধাপে সাপ নয়—অনুন্নোদিত টিকটিকি-গেকো-অঞ্জন (৬টি), গুইসাপ (১টি) ও কচ্ছপ-কাছিম (৫টি) যোগ হয়েছে। সংরক্ষণ-মর্যাদায় প্রথমবারের মতো LC-বহির্ভূত প্রজাতি রাখা হয়েছে (NT/CR/EN/VU)।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স |
|---|---|---|---|---|---|---|
| ১ | tokay-gecko | টোক্ক গেকো | *Gekko gecko* | Gekkonidae | LC | CC BY 2.0 |
| ২ | bark-gecko | বাকল গেকো | *Hemidactylus leschenaultii* | Gekkonidae | LC | CC BY-SA 4.0 |
| ৩ | khasi-benttoed-gecko | খাসি বাঁকা-আঙুল গেকো | *Cyrtodactylus khasiensis* | Gekkonidae | LC | CC BY-SA 4.0 |
| ৪ | common-sun-skink | বহু-ডোরা রোদ-অঞ্জন | *Eutropis multifasciata* | Scincidae | LC | CC BY-SA 4.0 |
| ৫ | spotted-forest-skink | ফোঁটা-দাগি বন-অঞ্জন | *Sphenomorphus maculatus* | Scincidae | LC | CC BY-SA 4.0 |
| ৬ | emma-forest-lizard | বন রক্তচোষা | *Calotes emma* | Agamidae | LC | CC BY 4.0 |
| ৭ | yellow-monitor | সোনালি গুইসাপ | *Varanus flavescens* | Varanidae | NT | CC BY-SA 4.0 |
| ৮ | black-softshell-turtle | বোস্তামি কালো কচ্ছপ | *Nilssonia nigricans* | Trionychidae | CR | CC BY 4.0 |
| ৯ | northern-river-terrapin | উত্তর নদ-কচ্ছপ | *Batagur baska* | Geoemydidae | CR | Public domain (PD-user) |
| ১০ | brown-roofed-turtle | বাদামি ছাদ-কাছিম | *Pangshura smithii* | Geoemydidae | NT | CC BY 4.0 |
| ১১ | southeast-asian-box-turtle | কব্জা বাক্স-কাছিম | *Cuora amboinensis* | Geoemydidae | EN | CC BY-SA 3.0 |
| ১২ | indian-star-tortoise | তারকা কাছিম | *Geochelone elegans* | Testudinidae | VU | CC BY-SA 4.0 |

**ফলাফল:** সরীসৃপ ৮১ → **৯৩** (১৬৭-র ৫৬%); মোট রেকর্ড ১,৪৮৪ → **১,৪৯৬**; ১২টি ছবিরই লেখক/লাইসেন্স Commons API (extmetadata) দিয়ে যাচাই করে নিবন্ধিত (১টি পাবলিক ডোমেইন, ১১টি CC BY/CC BY-SA)। কোনোটিই বিষধর নয়; গুইসাপ-কচ্ছপের রেকর্ডে না-ছোঁয়ার সাধারণ সতর্কতা রাখা হয়েছে।

**বিশেষ নোট:**
- প্রাথমিক প্রার্থী মেঘলা গুইসাপ (*Varanus nebulosus*) বাদ দেওয়া হয়েছে—Hasan et al. (২০২১)-এর বাংলাদেশ গুইসাপ-জরিপে দেশে মাত্র ৩টি প্রজাতি নিশ্চিত (*V. bengalensis*, *V. flavescens*, *V. salvator*); *nebulosus*-এর একমাত্র রেকর্ড ১৮৮৯-র অস্পষ্ট “Bengalen” নমুনা। ব্যবহারকারীর সিদ্ধান্তক্রমে বদলে *Geochelone elegans* নেওয়া হয়েছে (থামার-শর্ত খ: উপস্থিতি-সন্দেহ)।
- *Nilssonia nigricans*-এর চট্টগ্রাম বায়েজিদ বোস্তামি দরগাহ-পুকুর ও *Batagur baska*-র সুন্দরবন কারামজাল হ্যাচারি—দুটি CR প্রজাতির প্রধান বাংলাদেশি ঘাঁটি রেকর্ডে নথিভুক্ত।
- *Varanus flavescens* ও *Geochelone elegans* CITES অ্যাপেন্ডিক্স I এবং বন্যপ্রাণি (সংরক্ষণ ও নিরাপত্তা) আইন ২০১২-এর তফসিল-১ সংরক্ষিত—রেকর্ডে উল্লিখিত।
- সোনালি গুইসাপের ছবিটি বাংলাদেশে তোলা (Wiki Loves Earth ২০২৪, চট্টগ্রাম); কচ্ছপ-কাছিমের বেশ কয়েকটি ছবি ভারতীয় সীমান্ত-কাছের জনসংখ্যা থেকে নেওয়া (প্রজাতি-সমান, লাইসেন্স-বৈধ)।

**পরের ধাপ:** ধাপ ৫ — অবশিষ্ট সাপ (Oligodon/Lycodon/Boiga-র বাকি প্রজাতি, Rhabdophis/Hebius ইত্যাদি Natricidae) ও আরও টিকটিকি-কচ্ছপ মিলিয়ে ১২টি; অবশিষ্ট ~৭৪টি শেষ হতে আরও ~৭ ধাপ।

## ১১. সরীসৃপ-সংযোজন ধাপ ৫ (২০২৬-১০-২৫) — ৮ সাপ, ২ টিকটিকি, ২ কচ্ছপ

নতুন ফাইল `data/seed/more-reptiles5.ts`; পূর্ববর্তী ধাপগুলোর মতোই পূর্ণ বাংলা তথ্য, taxonomy, আবাস/বিস্তৃতি/`whereToSee`, IUCN অবস্থা ও Commons-যাচাইকৃত ছবি-লাইসেন্সসহ। ৮টি সাপ (Colubridae ৪, Natricidae ২, Elapidae ১, Viperidae ১), ২টি টিকটিকি ও ২টি EN-কচ্ছপ; ১০টি LC এবং ২টি EN।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স |
|---|---|---|---|---|---|---|
| ১ | streaked-kukri | ডোরা-কুকরি সাপ | *Oligodon taeniolatus* | Colubridae | LC | CC BY-SA 4.0 |
| ২ | dogtoothed-cat-snake | কুকুর-দাঁত বিড়াল সাপ | *Boiga cynodon* | Colubridae | LC | CC BY-SA 3.0 |
| ৩ | oriental-whip-snake | সবুজ লতা সাপ | *Ahaetulla prasina* | Colubridae | LC | CC BY-SA 4.0 |
| ৪ | trinket-snake | অলংকৃত ইঁদুর সাপ | *Coelognathus helena* | Colubridae | LC | CC BY 4.0 |
| ৫ | orange-collared-keelback | কমলা-গলা কীলক সাপ | *Rhabdophis himalayanus* | Natricidae | LC | CC BY 4.0 |
| ৬ | khasi-hills-keelback | খাসি কীলক সাপ | *Hebius khasiensis* | Natricidae | LC | CC BY-SA 2.0 |
| ৭ | mcclellands-coral-snake | ম্যাকক্লেল্যান্ড প্রবাল সাপ | *Sinomicrurus macclellandi* | Elapidae | LC | CC BY 4.0 |
| ৮ | jerdons-pit-viper | জার্ডন পাহাড়ি বোরা | *Protobothrops jerdonii* | Viperidae | LC | Public domain (PD-self) |
| ৯ | garnots-house-gecko | গার্নো গৃহ-গেকো | *Hemidactylus garnotii* | Gekkonidae | LC | CC0 |
| ১০ | common-snake-skink | ফোঁটা-দাগি সাপ-অঞ্জন | *Lygosoma punctata* | Scincidae | LC | CC BY-SA 4.0 |
| ১১ | peacock-softshell-turtle | ময়ূর-কণ্ঠী নরম-কচ্ছপ | *Nilssonia hurum* | Trionychidae | EN | CC BY 4.0 |
| ১২ | indian-eyed-turtle | চোখ-কাছিম | *Morenia petersi* | Geoemydidae | EN | Public domain (Berjeau, ১৮৭৮) |

**ফলাফল:** সরীসৃপ ৯৩ → **১০৫** (১৬৭-র ৬৩%); মোট রেকর্ড ১,৪৯৬ → **১,৫০৮**; ১২টি ছবিরই লেখক/লাইসেন্স Commons API (extmetadata) দিয়ে যাচাই করে নিবন্ধিত (২টি পাবলিক ডোমেইন, ১টি CC0, ৯টি CC BY/CC BY-SA)।

**বিশেষ নোট:**
- বিষ-নিরাপত্তা: Elapidae প্রবাল সাপ ও Viperidae জার্ডন বোরা-র রেকর্ডে শুধু দ্রুত হাসপাতাল/অ্যান্টিভেনম-পরামর্শ; rear-fanged *Boiga cynodon*, *Ahaetulla prasina* ও *Rhabdophis himalayanus*-এও কামড়ে দ্রুত হাসপাতাল-নির্দেশ—কোনো ঘরোয়া পদ্ধতি নেই।
- *Rhabdophis himalayanus*-এর ঘাড়-গ্রন্থিতে খাদ্য-উৎসারিত বিষ সঞ্চয় ও *Hemidactylus garnotii*-র পুরুষহীন ক্লোন প্রজনন (পার্থেনোজেনেসিস) রেকর্ডে নথিভুক্ত।
- *Morenia petersi*-র কোনো আধুনিক মুক্ত-লাইসেন্স আলোকচিত্র কমন্সে নেই; ১৮৭৮-র BHL পাবলিক-ডোমেইন চিত্র (Berjeau) ব্যবহৃত—ধাপ ৩-এর *H. caerulescens* ও ধাপ ৪-এর *B. baska*-র মতোই নথিভুক্ত পন্থা।
- কোনো প্রজাতি প্রত্যাহার/সংঘাত হয়নি; ১২ প্রার্থীরই বাংলাদেশ-উপস্থিতি HERPS_BD ২০০৯/IUCN_BD ২০১৫-তে প্রামাণিক এবং মুক্ত ছবি পাওয়া গেছে।

**পরের ধাপ:** ধাপ ৬ — অবশিষ্ট সাপ (বাকি *Lycodon*/*Oligodon*/*Boiga*, *Bungarus*/*Naja* প্রজাতি ও অন্যান্য), আরও গেকো-অঞ্জন-অগামা এবং বাকি কচ্ছপ-কুমির-ঘড়িয়াল-ঘাটতি মিলিয়ে ১২টি; অবশিষ্ট ~৬২টি শেষ হতে আরও ~৬ ধাপ।

## ১২. সরীসৃপ-সংযোজন ধাপ ৬ (২০২৬-১০-২৫) — ৮ সাপ, ২ গেকো, ২ কচ্ছপ

নতুন ফাইল `data/seed/more-reptiles6.ts`; পূর্ববর্তী ধাপগুলোর মতোই পূর্ণ বাংলা তথ্য, taxonomy, আবাস/বিস্তৃতি/`whereToSee`, IUCN অবস্থা ও Commons-যাচাইকৃত ছবি-লাইসেন্সসহ। ৮টি সাপ (Colubridae ৩, Elapidae ৩, Viperidae ১, Boidae ১), ২টি গেকো (Gekkonidae) ও ২টি কচ্ছপ (Geoemydidae); ১১টি LC এবং ১টি VU।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স |
|---|---|---|---|---|---|---|
| ১ | arrowback-tree-snake | তির-পিঠ বিড়াল সাপ | *Boiga gokool* | Colubridae | LC | Public domain (Hardwicke, ১৮৩৩–৩৪) |
| ২ | lesser-black-krait | ছোট কালো কেউটে | *Bungarus lividus* | Elapidae | LC | CC BY-SA 3.0 |
| ৩ | walls-krait | ওয়াল কেউটে | *Bungarus walli* | Elapidae | LC | CC BY-SA 4.0 |
| ৪ | slender-coral-snake | সরু প্রবাল সাপ | *Calliophis melanurus* | Elapidae | LC | Public domain (Iconographia, ১৭০০–১৮৮০) |
| ৫ | mangrove-pit-viper | ম্যানগ্রোভ বোরা | *Trimeresurus purpureomaculatus* | Viperidae | LC | CC BY-SA 3.0 |
| ৬ | ashy-kukri | ছাই-কুকরি সাপ | *Oligodon cinereus* | Colubridae | LC | CC BY-SA 3.0 |
| ৭ | common-sand-boa | ভারতীয় বালু-বোয়া | *Eryx conicus* | Boidae | LC | CC BY-SA 2.5 (VRT) |
| ৮ | green-rat-snake | সবুজ ইঁদুর সাপ | *Ptyas nigromarginata* | Colubridae | LC | CC BY-SA 4.0 |
| ৯ | stump-toed-gecko | খাটো-আঙুল গেকো | *Gehyra mutilata* | Gekkonidae | LC | CC BY 3.0 (ZooKeys) |
| ১০ | brookes-house-gecko | ব্রুক গৃহ-গেকো | *Hemidactylus brookii* | Gekkonidae | LC | CC BY-SA 4.0 |
| ১১ | brahminy-river-turtle | মুকুট কচ্ছপ | *Hardella thurjii* | Geoemydidae | VU | CC BY 4.0 |
| ১২ | indian-tent-turtle | তাঁবু কাছিম | *Pangshura tentoria* | Geoemydidae | LC | CC BY-SA 4.0 |

**ফলাফল:** সরীসৃপ ১০৫ → **১১৭** (১৬৭-র ৭০%); মোট রেকর্ড ১,৫০৮ → **১,৫২০**; ১২টি ছবিরই লেখক/লাইসেন্স Commons API (extmetadata) দিয়ে যাচাই করে নিবন্ধিত (২টি পাবলিক ডোমেইন, ১০টি CC BY/CC BY-SA — যার মধ্যে ১টি CC BY-SA 2.5 ও ১টি ZooKeys CC BY 3.0)।

**বিশেষ নোট:**
- প্রত্যাহার ও বদলি: প্রাথমিক প্রার্থী *Lycodon zawi* (Zaw’s wolf snake)-র কোনো প্রজাতি-ছবি কমন্সে না থাকায় (থামার-শর্ত ক) তা বাদ দিয়ে *Ptyas nigromarginata* নেওয়া হয়; বাংলাদেশ-উপস্থিতি ২০২৫-র পদ্ধতিগত সাপ-সমীক্ষা (প্রজাতি #৪৯, দক্ষিণ-পূর্ব মিশ্র চিরহরিৎ বন) ও Reptile Database-এ প্রামাণিক।
- *Calliophis melanurus*-এর একমাত্র মুক্ত মিডিয়া ১৭০০–১৮৮০ পাবলিক-ডোমেইন .tif মুদ্রণ; ব্রাউজার-রেন্ডারযোগ্য ৯৬০px থাম্ব JPG হিসেবে ব্যবহৃত—কাঁচা .tif নয়।
- *Eryx conicus*-এর ছবির লেখক-অনুমতি Wikimedia VRT টিকিট #2007032910011808-এ নথিভুক্ত (CC BY-SA 2.5)।
- বিষ-নিরাপত্তা: ৩টি Elapidae (২ কেউটে + প্রবাল সাপ) ও Viperidae ম্যানগ্রোভ বোরা-র কামড়ে শুধু দ্রুত হাসপাতাল/অ্যান্টিভেনম-পরামর্শ; rear-fanged *Boiga gokool*-এও কামড়ে দ্রুত হাসপাতাল-নির্দেশ—কোনো ঘরোয়া পদ্ধতি নেই।
- VU-প্রজাতি *Hardella thurjii*-র রেকর্ডে ডিম-মাংস সংগ্রহ, জালে ডুবে মৃত্যু ও বালি উত্তোলন-হুমকি এবং হ্যাচারি-পুনর্বাসন-কর্মকাণ্ড নথিভুক্ত।
- ১১৭-র মধ্যে কোনো স্লাগ/বৈজ্ঞানিক-নাম ডুপ নেই; ১২/১২ রেকর্ডে ৩০+ ফিল্ড ও যাচাইকৃত ক্রেডিট।

**পরের ধাপ:** ধাপ ৭ — অবশিষ্ট ~৫০টি সরীসৃপ (বাকি সাপ-গেকো-অঞ্জন-অগামা ও কচ্ছপ-কুমির-ঘড়িয়াল-ঘাটতি) থেকে ১২টি; ১৬৭-লক্ষ্যে আরও ~৪–৫ ধাপ।


## ১৩. সরীসৃপ-সংযোজন ধাপ ৭ (২০২৬-১০-২৫) — ১২ সাপ

নতুন ফাইল `data/seed/more-reptiles7.ts`; নতুন তথ্যসূত্র `SNAKES_BD_2025` (Haidar et al. 2025, *Herpetozoa* 38: 253–269, CC BY 4.0) `sources.ts`-এ যুক্ত। বারোটি প্রজাতিই ওই পদ্ধতিগত সমীক্ষার **নিশ্চিত ৮৯** তালিকাভুক্ত—কোনো ‘প্রত্যাশিত’ বা মুছে-ফেলা প্রজাতি নেওয়া হয়নি। গোত্র: Colubridae ৩, Homalopsidae ২, Natricidae ১, Viperidae ১, Pythonidae ১, Psammophiidae ১, Sibynophiidae ১, Pareidae ১, Pseudoxenodontidae ১। IUCN: ১১টি LC এবং ১টি VU।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | variable-vine-snake | রঙ-বদলে লতা সাপ | *Ahaetulla anomala* | Colubridae | LC | CC BY 4.0 (Ameet Mandavia) |
| ২ | condanarus-sand-snake | কোন্দানার বালু-সাপ | *Psammophis condanarus* | Psammophiidae | LC | CC0 (S.MORE) |
| ৩ | hellers-red-necked-keelback | হেলার লাল-গলা কীলক সাপ | *Rhabdophis helleri* | Natricidae | LC | CC BY 4.0 (Rejoice Gassah) |
| ৪ | collared-many-tooth-snake | কালো-মাথা বহুদন্ত সাপ | *Sibynophis collaris* | Sibynophiidae | LC | CC BY-SA 3.0 (L. Shyamal) |
| ৫ | burmese-python | বর্মী অজগর | *Python bivittatus* | Pythonidae | **VU A2acd** | CC BY-SA 4.0 (Cvmontuy) |
| ৬ | rainbow-water-snake | রামধনু পানি-সাপ | *Enhydris enhydris* | Homalopsidae | LC | CC BY 2.0 (Srikaanth Sekar) |
| ৭ | siebolds-mud-snake | জিবল্ডের কাদা-সাপ | *Ferania sieboldii* | Homalopsidae | LC | CC BY-SA 3.0 (Sp.herp) |
| ৮ | popes-pit-viper | পোপের সবুজ বোরা | *Trimeresurus popeiorum* | Viperidae | LC | CC BY 4.0 (Rejoice Gassah) |
| ৯ | many-spotted-cat-snake | ফোঁটকা বিড়াল সাপ | *Boiga multomaculata* | Colubridae | LC | CC BY-SA 2.0 (Rushen) |
| ১০ | common-slug-snake | পাহাড়ি শামুক সাপ | *Pareas monticola* | Pareidae | LC | CC BY-SA 4.0 (Mvshreeram) |
| ১১ | red-bamboo-snake | লাল বাঁশ ইঁদুর সাপ | *Oreocryptophis porphyraceus* | Colubridae | LC | CC BY 2.0 (Zyskowski & Bereshpolova) |
| ১২ | large-eyed-false-cobra | বড়-চোখ ভুয়া ফণা-সাপ | *Pseudoxenodon macrops* | Pseudoxenodontidae | LC | CC BY-SA 3.0 (Umeshsrinivasan) |

**ফলাফল:** সরীসৃপ ১১৭ → **১২৯** (১৬৭-র ৭৭%); মোট রেকর্ড ১,৫২০ → **১,৫৩২**; ১২/১২ ছবির লেখক/লাইসেন্স Commons API (extmetadata) দিয়ে নতুন করে যাচাই করে `media-licenses.ts`-এ নিবন্ধিত (১টি CC0, ১১টি CC BY/CC BY-SA—২.০ থেকে ৪.০)। ক্রেডিট-রেজিস্টার ১,৫০১ → **১,৫১৩** (যাচাইকৃত ৮৩২ → **৮৪৪**; বাকি ৬৬৯ অপরিবর্তিত)।

**বিশেষ নোট:**
- *Rhabdophis helleri* ২০২১-এ *R. subminiatus* থেকে পূর্ণ প্রজাতিতে উন্নীত (Liu et al.); rear-fanged কামড়ে রক্ত-জমাট-ব্যাঘাত (DIC) সম্ভব এবং ঘাড়-গ্রন্থিতে ব্যাঙ-উৎসারিত বিষ সঞ্চয় করে—২০২৫ সমীক্ষা অনুযায়ী দেশের একমাত্র ‘বিষধর ও বিষাক্ত’ উভয়-ধর্মী সাপ; রেকর্ডে শুধু দ্রুত-হাসপাতাল নির্দেশ, কোনো ঘরোয়া পদ্ধতি নেই।
- Viperidae *Trimeresurus popeiorum*-এর ২০২৩–২৪ পুনর্বিবেচনায় s.s. বিস্তৃতিতে বাংলাদেশ স্পষ্টভাবে অন্তর্ভুক্ত (*T. yingjiangensis* সমার্থক ঘোষিত)—উপস্থিতি নিশ্চিত; কামড়ে অ্যান্টিভেনমসহ দ্রুত হাসপাতাল।
- *Python bivittatus* একমাত্র VU (A2acd; CITES Appendix II)—চামড়া/পোষা চোরাচালান ও আবাস-ক্ষয় প্রধান হুমকি; বিষহীন constrictor।
- বর্জন ও কারণ: *Calotes mystaceus*—Wagner et al. (2021) ট্যাক্সন-বিভাজনে s.s. দক্ষিণ উপকূলীয় মায়ানমারে সীমাবদ্ধ, বাংলাদেশের CHT রিপোর্টের পরিচয় অনিশ্চিত (Mahony & Reza 2008-এর দুই নতুন রেকর্ড প্রকৃতপক্ষে *Lygosoma lineolatum* ও *Tropidophorus assamensis*); *Chamaeleo zeylanicus* ও *Sphenomorphus indicus*-এর BD রেকর্ড অপ্রামাণিক/ভুল-শনাক্ত (*Eutropis macularia*); *Fowlea schnurrenbergeri* নিশ্চিত প্রজাতি হলেও ব্যবহার্য মুক্ত-লাইসেন্স লাইভ ছবি অনুপলব্ধ (থামার-শর্ত ক); *Lycodon striatus* ও *Boiga quincunciata* নিশ্চিত-৮৯ তালিকার বাইরে; *Trimeresurus albolabris* ২০২৫ সমীক্ষায় মুছে-ফেলা।
- ১২৯-র মধ্যে কোনো স্লাগ/বৈজ্ঞানিক-নাম ডুপ নেই; ১২/১২ রেকর্ডে ৩০+ ফিল্ড ও যাচাইকৃত ক্রেডিট; `tsc --noEmit`, ২৬ ইউনিট-টেস্ট, চারটি চুক্তি-টেস্ট, eslint ও stats পাস।

**পরের ধাপ:** ধাপ ৮ — ১৬৭-লক্ষ্যে অবশিষ্ট ৩৮টি সরীসৃপ (বাকি সাপ, গেকো-অঞ্জন-অগামা, কচ্ছপ-কুমির) থেকে পরবর্তী ১২; আরও ~৩–৪ ধাপ।


## ১৪. সরীসৃপ-সংযোজন ধাপ ৮ (২০২৬-১০-২৬) — ৮ সাপ, ১ টিকটিকি, ৩ কাছিম

নতুন ফাইল `data/seed/more-reptiles8.ts`; index ও media-licenses সিঙ্ককৃত। ৮টি সাপ Haidar et al. (2025, Herpetozoa)-র নিশ্চিত ৮৯ তালিকার (Table 1 #১, #২, #৫, #৪৪, #৫০, #৮২, #৮৮, #৮৯)। তিন কাছিম ও এক টিকটিকি কবীর et al. (২০০৯), IUCN Bangladesh (২০১৫) এবং Rahman et al. (২০১৫)-সহ পিয়ার-রিভিউড বাংলাদেশ-রেকর্ডে নথিভুক্ত। ১২/১২ ছবির লেখক-লাইসেন্স Commons API (extmetadata) দিয়ে যাচাই করা (১টি CC0, ১টি CC BY 3.0, ৪টি CC BY 4.0, ৬টি CC BY-SA 4.0)।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | diards-blind-snake | ডিয়ার অন্ধ সাপ | *Argyrophis diardii* | Typhlopidae | LC | CC BY 4.0 (Nidhin Cyril Joseph) |
| ২ | white-headed-blind-snake | সাদা-মাথা অন্ধ সাপ | *Indotyphlops albiceps* | Typhlopidae | LC | CC BY 4.0 (Lawrence Hylton) |
| ৩ | slender-worm-snake | সরু কৃমি সাপ | *Indotyphlops porrectus* | Typhlopidae | LC | CC BY 4.0 (Ian Dugdale) |
| ৪ | coral-red-kukri | প্রবাল-লাল কুকরি সাপ | *Oligodon kheriensis* | Colubridae | LC | CC BY 4.0 (Kingshuk Mondal) |
| ৫ | collared-reed-snake | কলার-গলা নলখাগড়া সাপ | *Calamaria pavimentata* | Calamariidae | LC | CC BY 4.0 (Wich’yanan L) |
| ৬ | blue-lipped-sea-krait | নীল-ঠোঁট সমুদ্র-কেউটে | *Laticauda laticaudata* | Elapidae | LC | CC BY-SA 4.0 (Cheng Te Hsu) |
| ৭ | persian-gulf-sea-snake | পারস্য উপসাগরীয় সামুদ্রিক সাপ | *Hydrophis lapemoides* | Elapidae | LC | CC BY-SA 4.0 (purperlibel) |
| ৮ | graceful-small-headed-sea-snake | সরু-মাথা সামুদ্রিক সাপ | *Microcephalophis gracilis* | Elapidae | LC | CC0 (A. C. Tatarinov) |
| ৯ | tricarinate-hill-turtle | ত্রি-খিলা পাহাড়ি কাইট্টা | *Melanochelys tricarinata* | Geoemydidae | **EN** | CC BY-SA 4.0 (Deepak2929) |
| ১০ | jerdons-snake-eye | জের্ডন সাপ-চোখ টিকটিকি | *Ophisops jerdonii* | Lacertidae | LC | CC BY 3.0 (Biodocphoto) |
| ১১ | assam-leaf-turtle | আসাম পাতা কাছিম | *Cyclemys gemeli* | Geoemydidae | **NT** | CC BY-SA 4.0 (Vijay Anand Ismavel) |
| ১২ | assam-roofed-turtle | সিলেটি ছাদ-কাছিম | *Pangshura sylhetensis* | Geoemydidae | **CR** | CC BY-SA 4.0 (Tisha Mukherjee) |

**ফলাফল:** সরীসৃপ ১২৯ → **১৪১** (১৬৭-র ৮৪%); মোট রেকর্ড ১,৫৩২ → **১,৫৪৪**; ক্রেডিট-রেজিস্টার ১,৫১৩ → **১,৫২৫** (যাচাইকৃত ৮৪৪ → **৮৫৬**; বাকি ৬৬৯ অপরিবর্তিত); ছবি **১,৫৪১/১,৫৪৪** (৩টি বাদুড়ের নথিভুক্ত ফাঁক বহাল)। IUCN মিশ্রণ: ৯ LC, ১ NT, ১ EN, ১ CR। ডুপ স্লাগ/বৈজ্ঞানিক-নাম শূন্য; ১২/১২ রেকর্ডে ৩৪টি ফিল্ড; রানটাইমে সব verified।

**বিশেষ নোট:**
- *Pangshura sylhetensis*-এর টাইপ-লোকালিটি সিলেট নদী (Rahman et al. ২০১৫ অনুযায়ী বাংলাদেশে); IUCN ২০১৮ মূল্যায়নে CR A2cd+4cd—দেশে মাত্র দক্ষিণ-পূর্বের ~১৫ কিমি নদ-অংশে একটি জনতা; CITES Appendix II।
- *Melanochelys tricarinata* বিশ্ব IUCN ২০২০-এ EN (পুরোনো VU মূল্যায়ন বহাল নয়), CITES Appendix I ও বাংলাদেশ বন্যপ্রাণি আইন ১৯৭৪-এর তফসিল III; বাংলাদেশে বিরল।
- *Cyclemys gemeli* IUCN ২০২১-এ NT A4c, CITES Appendix II (Cyclemys spp.); সিলেট, পার্বত্য চট্টগ্রাম, কক্সবাজার-মহেশখালীতে নথিভুক্ত এবং IUCN Bangladesh ২০১৫ চেকলিস্টে আছে।
- *Oligodon kheriensis*-এর বাংলাদেশের প্রথম নিশ্চিত রেকর্ড ২০২১-এ পঞ্চগড় থেকে (তৃতীয় দেশ); rear-fanged—কামড়ে দ্রুত হাসপাতাল নির্দেশ।
- তিনটি Elapidae সামুদ্রিক সাপ (Laticauda, Hydrophis, Microcephalophis) প্রবল-বিষধর—কামড়ে শুধু দ্রুত হাসপাতাল/অ্যান্টিভেনম; কোনো ঘরোয়া পদ্ধতি নেই।
- *Indotyphlops porrectus*-এর সাম্প্রতিক গণ-বিন্যাস Pseudoindotyphlops (কমন্স ফাইলে সে নামই); বাংলাদেশ-জরিপের নাম Indotyphlops porrectus রাখা হলো, নতুন নাম otherNames-এ নথিভুক্ত।
- বর্জন: *Fowlea schnurrenbergeri*-র একমাত্র লাইভ কমন্স ফাইল “Unidentified Colubroidea”-ক্যাটাগরিভুক্ত (পরিচয় অযাচাই—ধাপ ৭ সিদ্ধান্ত বহাল); *Blythia reticulata*, *Herpetoreas xenura*, *Smithophis* দুই প্রজাতি, *Indotyphlops jerdoni*, তিনটি বাদ-যাওয়া সমুদ্র-সাপ (cantoris/obscurus/stricticollis)-এর মুক্ত লাইভ ছবি নেই; *Ahaetulla sahyadrensis* নাম-সংঘাত (একমাত্র ফাইল পুরোনো নামে); *Lycodon zawi* প্রজাতি-ছবিহীন; *Tropidophorus assamensis* ও *Lygosoma lineolatum* ছবিহীন; *Sitana ponticeriana*-র বিস্তৃতি-মানচিত্রে বাংলাদেশ নেই।

**পরের ধাপ:** ধাপ ৯ — ১৬৭-লক্ষ্যে অবশিষ্ট ২৬টি সরীসৃপ থেকে পরবর্তী ১২; আরও ~২–৩ ধাপ।


## ১৫. সরীসৃপ-সংযোজন ধাপ ৯ (২০২৬-১০-২৬) — ৬ কাছিম-কচ্ছপ, ৬ টিকটিকি

IUCN Bangladesh ২০১৫ চেকলিস্টের ১৬৭-লক্ষ্যে নবম ব্যাচ: ৪টি পার্বত্য চট্টগ্রামের স্থল/স্বাদুজল কাছিম-কচ্ছপ, ২টি সামুদ্রিক কাছিম এবং ৬টি টিকটিকি-গেকো-অঞ্জন। চার CHT কাছিমের বাংলাদেশ-উপস্থিতি Rahman et al. (২০১৫, Chelonian Conservation and Biology 14(2, doi 10.2744/CCB-1146.1)-এর নমুনা-ভিত্তিক জরিপে; দুই সামুদ্রিক কাছিম বাংলাদেশ-জলসীমার পাঁচ সামুদ্রিক প্রজাতির অন্তর্ভুক্ত (JoTT ২০২৪, Sonadia–সেন্টমার্টিন); টিকটিকিগুলো Mahony & Reza (২০০৮), Mahony et al. (২০০৯), Bhuiyan et al. (২০২০), Hakim et al. (২০২০) ও RepFocus বাংলাদেশ চেকলিস্টে নথিভুক্ত। ১২/১২ ছবির লেখক-লাইসেন্স কমন্স API (extmetadata) দিয়ে যাচাই: ৫টি CC BY 4.0, ২টি CC BY-SA 4.0, ১টি CC BY-SA 3.0, ২টি CC BY-SA 2.0, ২টি পাবলিক ডোমেইন। নতুন দুটি উৎস (`CHT_TURTLES_2015`, `JOTT_SEATURTLES`) `data/seed/sources.ts`-এ নিবন্ধিত।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | keeled-box-turtle | খাঁজকাটা বাক্স-কাছিম | *Cuora mouhotii* | Geoemydidae | **EN** | CC BY 4.0 (Rejoice Gassah) |
| ২ | arakan-forest-turtle | রাখাইন বন-কাছিম | *Heosemys depressa* | Geoemydidae | **CR** | Public domain (Eoghanacht, PD-user) |
| ৩ | asian-forest-tortoise | এশীয় চিলা কচ্ছপ | *Manouria emys* | Testudinidae | **CR** | CC BY-SA 4.0 (Rushenb) |
| ৪ | southeast-asian-softshell-turtle | পাহাড়ি তরুণাস্থি কাছিম | *Amyda ornata* | Trionychidae | VU | CC BY 4.0 (Wich’yanan L) |
| ৫ | loggerhead-sea-turtle | মুগুরমাথা সামুদ্রিক কাছিম | *Caretta caretta* | Cheloniidae | VU | CC BY-SA 3.0 (Strobilomyces) |
| ৬ | leatherback-sea-turtle | বড় সামুদ্রিক চামট কাছিম | *Dermochelys coriacea* | Dermochelyidae | VU | Public domain (NOAA) |
| ৭ | blanfords-flying-lizard | ব্ল্যানফোর্ড উড়ন্ত টিকটিকি | *Draco blanfordii* | Agamidae | LC | CC BY 4.0 (Wich’yanan L) |
| ৮ | green-fan-throated-lizard | সবুজ ভাঁজ-গলা টিকটিকি | *Ptyctolaemus gularis* | Agamidae | LC | CC BY 4.0 (Rejoice Gassah) |
| ৯ | smooth-backed-gliding-gecko | মসৃণ-পিঠ উড়ন্ত গেকো | *Gekko lionotum* | Gekkonidae | LC | CC BY-SA 2.0 (Rushen) |
| ১০ | bowrings-gecko | বাউরিং গেকো | *Hemidactylus bowringii* | Gekkonidae | LC | CC BY 4.0 (Sterling Sheehy) |
| ১১ | bowrings-supple-skink | বাউরিং নমনীয় অঞ্জন | *Subdoluseps bowringii* | Scincidae | LC | CC BY-SA 2.0 (Rushen) |
| ১২ | white-spotted-supple-skink | সাদা-চিতি নমনীয় অঞ্জন | *Riopa albopunctata* | Scincidae | LC | CC BY 4.0 (DudeApollo) |

**ফলাফল:** সরীসৃপ ১৪১ → **১৫৩** (১৬৭-র ৯২%); মোট রেকর্ড ১,৫৪৪ → **১,৫৫৬**; ক্রেডিট-রেজিস্টার ১,৫২৫ → **১,৫৩৭** (যাচাইকৃত ৮৫৬ → **৮৬৮**; বাকি ৬৬৯ অপরিবর্তিত); ছবি **১,৫৫৩/১,৫৫৬** (৩টি বাদুড়ের নথিভুক্ত ফাঁক বহাল; লোকাল ৬৯১ + কমন্স ৮৬২)। IUCN মিশ্রণ: ৬ LC, ৩ VU, ১ EN, ২ CR। ডুপ স্লাগ/বৈজ্ঞানিক-নাম শূন্য; ১২/১২ রেকর্ডে ৩১টি ফিল্ড (ধাপ ৬–৮ টেমপ্লেট-অভিন্ন); রানটাইমে সব verified। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · ৪/৪ চুক্তি-স্ক্রিপ্ট · eslint ০ error · `audit:images` ক্লিন।

**বিশেষ নোট:**
- *Cuora mouhotii*: প্রকাশিত IUCN Red List-কোড EN (২০০০, এখনও বলবৎ); TFTSG-র CR-সুপারিশ খসড়া-পর্যায়ের, তাই EN বসিয়ে খসড়ার কথা `conservationBn`-এ নথিভুক্ত; CITES Appendix II; Rahman et al. ২০১৫-তে বাংলাদেশের প্রথম নিশ্চিত রেকর্ড।
- *Heosemys depressa*: ১৯০৮-এর পর দীর্ঘ “বিলুপ্ত”-ধারণা ভেঙে ১৯৯০-এ পুনরাবিষ্কার; বাংলাদেশে ২০১৫-এ প্রথম নমুনা-রেকর্ড; ব্যবহৃত ছবিটি আপলোডার কর্তৃক PD-user হিসেবে উৎসর্গকৃত।
- *Manouria emys*: IUCN ২০১৯ CR A2cd+4cd; বাংলাদেশে Sangu-Matamuhuri বলয়ে দুটি বিচ্ছিন্ন জনতা; মা পাতা-স্তূপ-বাসা বানিয়ে ডিম পাহারা দেয়—কচ্ছপদের মধ্যে বিরল আচরণ।
- *Amyda ornata*: ২০১৪-এর গণ-বিন্যাসে *A. cartilaginea* সমষ্টি থেকে আলাদা প্রজাতি; IUCN VU (সমষ্টি-মূল্যায়ন ও ornata খসড়া উভয় অনুযায়ী সাময়িক VU)।
- *Caretta caretta* ও *Dermochelys coriacea*: উভয়ে VU, CITES Appendix I, বন্যপ্রাণি আইন ২০১২-এ সংরক্ষিত; বাংলাদেশে ডিম পাড়ে না—পাঁচ সামুদ্রিক প্রজাতির বিরল বিচরণকারী; লেদারব্যাকের ছবি মার্কিন NOAA-র সরকারি কর্ম হিসেবে পাবলিক ডোমেইন।
- *Gekko lionotum*: পুরোনো নাম *Ptychozoon lionotum* (otherNames-এ নথিভুক্ত); বাংলাদেশ-রেকর্ড Bhuiyan et al. ২০২০। *Subdoluseps bowringii* ও *Riopa albopunctata*-র পুরোনো গণ-নাম (*Lygosoma*) একইভাবে সংরক্ষিত।
- *Riopa albopunctata*-র প্রথম-নির্বাচিত কমন্স ফাইল “Unidentified lizards”-ক্যাটাগরিভুক্ত ছিল—ধাপ ৭-এর *Fowlea schnurrenbergeri*-নজির অনুসরণে বর্জন; বিকল্প হিসেবে DudeApollo-র CC BY 4.0 ফাইল (স্পষ্ট প্রজাতি-শিরোনাম, “Reptiles of West Bengal” ক্যাটাগরি) নেওয়া হয়।
- **নথিভুক্ত ফাঁক:** *Riopa lineolata*-য় কমন্সে শুধু ঊনবিংশ শতকের বই-চিত্র (লাইভ মুক্ত ছবি নেই); *Herpetoreas xenura*-য় শূন্য কমন্স হিট; *Ahaetulla sahyadrensis*-এর একমাত্র ফাইল ভুল-নামে (*pulverulenta*)—নাম-সংঘাত বহাল; *Fowlea schnurrenbergeri* “Unidentified” ক্যাটাগরিতে আটকে; *Batagur dhongoka* ও *Melanochelys trijuga*-র বাংলাদেশ-রেকর্ড দুর্বল—পরবর্তী যাচাই সাপেক্ষ। এরা কোনো SPECIES রেকর্ড নয়, তাই `image-gaps.ts`-এ নয় (চুক্তি-টেস্ট ফাঁক-স্লাগে বিদ্যমান প্রজাতি বাধ্যতামূলক করে)—এই অনুচ্ছেদ ও more-reptiles9.ts হেডারেই নথিভুক্ত।

**পরের ধাপ:** ধাপ ১০ — ১৬৭-লক্ষ্যে অবশিষ্ট ১৪টি সরীসৃপ (বাকি কাছিম, গেকো-অঞ্জন-অ্যাগামা; কুমির গোষ্ঠী পূর্ণ হলে গোষ্ঠী-সিদ্ধান্ত প্রয়োজন)। থামার শর্ত অপরিবর্তিত: মুক্ত ছবি অনুপলব্ধ / BD-উপস্থিতি সন্দেহজনক / নাম-ডুপ সংঘাত / গোষ্ঠী-সমাপ্তি।


## ১৬. উভচর-সংযোজন ধাপ ১ (২০২৬-১০-২৬) — ১২টি ব্যাঙ (Anura)

IUCN Bangladesh ২০১৫-এর ৪৯ প্রজাতির উভচর-লক্ষ্যে প্রথম উভচর ব্যাচ (পূর্বে সাইটে ১৩টি উভচর)। ১২ প্রজাতির বাংলাদেশ-উপস্থিতি IUCN Red List-এর দেশ-তালিকা, IUCN Bangladesh (২০১৫), হালনাগাদ চেকলিস্ট (*An Updated Checklist of the Amphibians of Bangladesh*, EcoEvoRxiv) এবং Hakim et al. (২০২১)-এর কেন্দ্রীয়/উত্তর-পশ্চিম আঞ্চলিক সমীক্ষায় নথিভুক্ত। ১২/১২ ছবির লেখক-লাইসেন্স Commons API (extmetadata) দিয়ে যাচাই: ২টি CC BY 4.0, ৭টি CC BY-SA 4.0, ১টি CC BY 3.0, ২টি CC BY 2.0 — কোনো পুরোনো বই-চিত্র/পাবলিক ডোমেইন নয়। নতুন উৎস `AMPHIBIANS_BD` `data/seed/sources.ts`-এ নিবন্ধিত।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | jerdons-bullfrog | জের্ডন বৃষ্টি ব্যাঙ | *Hoplobatrachus crassus* | Dicroglossidae | LC | CC BY 4.0 (Kingshuk Mondal) |
| ২ | greater-balloon-frog | বড় ফোলা ব্যাঙ | *Uperodon globulosus* | Microhylidae | LC (দেশে VU) | CC BY 3.0 (Sindhu Ramchandran) |
| ৩ | painted-balloon-frog | চিত্রা ফোলা ব্যাঙ | *Uperodon taprobanicus* | Microhylidae | LC (দেশে VU) | CC BY 2.0 (Rison Thumboor) |
| ৪ | red-narrow-mouthed-frog | লাল চিকন-মুখি ব্যাঙ | *Microhyla rubra* | Microhylidae | LC | CC BY-SA 4.0 (Anagha Devi) |
| ৫ | berdmoreis-narrow-mouthed-frog | বার্ডমোর চিকন-মুখি ব্যাঙ | *Microhyla berdmorei* | Microhylidae | LC | CC BY-SA 4.0 (Rushenb) |
| ৬ | tytlers-frog | টাইলার ডাঙা ব্যাঙ | *Hylarana tytleri* | Ranidae | LC | CC BY 4.0 (Kingshuk Mondal) |
| ৭ | indian-tree-frog | দাগি গেছো ব্যাঙ | *Polypedates maculatus* | Rhacophoridae | LC | CC BY-SA 4.0 (Dr. Raju Kasambe) |
| ৮ | twin-spotted-tree-frog | দুই-চিতি গাছ ব্যাঙ | *Rhacophorus bipunctatus* | Rhacophoridae | LC | CC BY-SA 4.0 (Rohit Naniwadekar) |
| ৯ | smiths-litter-frog | স্মিথ পাতা ব্যাঙ | *Leptobrachium smithi* | Megophryidae | LC | CC BY-SA 4.0 (Rushenb) |
| ১০ | beautiful-stream-frog | সুন্দর ঝরনা ব্যাঙ | *Amolops formosus* | Ranidae | LC | CC BY-SA 4.0 (Yathumon M A) |
| ১১ | assam-hills-frog | পাহাড়ি লম্বা-পা ব্যাঙ | *Clinotarsus alticola* | Ranidae | LC | CC BY-SA 4.0 (Psumuseum) |
| ১২ | green-puddle-frog | সবুজ ডোবা ব্যাঙ | *Occidozyga lima* | Dicroglossidae | LC | CC BY 2.0 (Thomas Brown) |

**ফলাফল:** উভচর ১৩ → **২৫** (৪৯-র ৫১%); মোট রেকর্ড ১,৫৫৬ → **১,৫৬৮**; ক্রেডিট-রেজিস্টার ১,৫৩৭ → **১,৫৪৯** (যাচাইকৃত ৮৬৮ → **৮৮০**; বাকি ৬৬৯ অপরিবর্তিত); ছবি **১,৫৬৫/১,৫৬৮** (৩টি বাদুড়ের নথিভুক্ত ফাঁক বহাল; লোকাল ৬৯১ + কমন্স ৮৭৪)। ১২/১২ বৈশ্বিক IUCN LC; দেশীয় কোডে *U. globulosus* ও *U. taprobanicus* VU (Hakim et al. ২০২১)। ডুপ স্লাগ/বৈজ্ঞানিক-নাম শূন্য; ১২/১২ রেকর্ডে ৩১টি ফিল্ড (সরীসৃপ-টেমপ্লেট-অভিন্ন); রানটাইমে সব verified। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · ৪/৪ চুক্তি-স্ক্রিপ্ট · eslint ০ error · `audit:images` ক্লিন।

**বিশেষ নোট:**
- *Leptobrachium smithi*: ২০২১-এ সিলেটের *L. sylheticum* নতুন প্রজাতি হিসেবে পৃথক হলেও হালনাগাদ চেকলিস্টে বাংলাদেশের স্বীকৃত প্রজাতি হিসেবে *L. smithi* বহাল; *L. rakhinense*-এর দেশে উপস্থিতি IUCN-চিহ্নিত অনিশ্চিত — জটিলতা otherNames/conservationBn-এ নথিভুক্ত।
- *Hylarana tytleri*: কিছু বৈশ্বিক গণ-বিন্যাসে *Sylvirana tytleri*; বাংলাদেশ-সাহিত্য ও IUCN-তালিকায় Hylarana নাম প্রচলিত বলে তাই রাখা হলো, বিকল্প নাম otherNames-এ। *Uperodon taprobanicus*-এর পুরোনো নাম *Kaloula taprobanica* একইভাবে সংরক্ষিত।
- *Polypedates maculatus*: বাংলাদেশে *P. leucomystax* কমপ্লেক্স-জনিত ঐতিহাসিক নাম-বিভ্রাট নথিভুক্ত; দেশ-তালিকায় P. maculatus স্বীকৃত।
- **বর্জন:** *Chiromantis simus*-এর একমাত্র লাইভ কমন্স ফাইল “Unidentified Anura”-ক্যাটাগরিভুক্ত (বাকিগুলো ১৯শ শতকের বই-PDF); *Boulenophrys parva* (= *Megophrys/Xenophrys parva*)-তে শুধু ১৯০৭ সালের অ্যানাটমি-চিত্র, লাইভ মুক্ত ছবি নেই — উভয়েই ছবি-ফাঁক হিসেবে এই অনুচ্ছেদে নথিভুক্ত (কোনো SPECIES রেকর্ড নয় বলে image-gaps.ts-এ নয়)।
- **পরের ব্যাচের প্রস্তুত:** *Raorchestes parvulus*-এ যাচাইকৃত CC BY-SA 4.0 লাইভ ছবি (Rushenb) পাওয়া গেছে; দেশীয় এন্ডেমিক (*Microhyla mymensinghensis*, *M. nilphamariensis*, *M. mukhlesuri*, *Minervarya asmati*, *Minervarya dhaka*, *Euphlyctis kalasgramensis*, *Hoplobatrachus litoralis*, *Leptobrachium sylheticum*, *Chikila fulleri*)-এর লাইভ মুক্ত ছবি অতি-দুর্লভ — যাচাই সাপেক্ষ।

**পরের ধাপ:** উভচর ধাপ ২ — অবশিষ্ট ২৪ প্রজাতি (৪৯-লক্ষ্য); থামার শর্ত অপরিবর্তিত: মুক্ত ছবি অনুপলব্ধ / BD-উপস্থিতি সন্দেহজনক / নাম-ডুপ সংঘাত।

## ১৭. সরীসৃপ-সংযোজন ধাপ ১০ (২০২৬-১০-২৬) — ২ টিকটিকি, ৩ সাপ, ২ কাছিম

IUCN Bangladesh ২০১৫-র ১৬৭-লক্ষ্যে RepFocus বাংলাদেশ চেকলিস্ট (Midtgaard ২০২৩; প্রাথমিক উদ্ধৃতি Das 1996, Khan 2004, Hakim et al. 2020 প্রমুখ), Haidar et al. (2025, Herpetozoa 38: 253–269), IUCN Red List ও Freshwater Biodiversity Portal of Bangladesh মিলিয়ে অবশিষ্ট-প্রার্থী পুনর্যাচাই। ৭ প্রজাতির কমন্স লাইভ মুক্ত-লাইসেন্স ছবি extmetadata-যাচাইসহ নেওয়া হলো (প্রকৃত মিশ্রণ: ২ CC BY 4.0 — jerdoni, granulatus; ৫ CC BY-SA 4.0 — khasiensis, calamaria, dhongoka, trijuga, westermanni); নতুন উৎস `REPFOCUS` `data/seed/sources.ts`-এ নিবন্ধিত।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | jerdons-forest-lizard | জার্ডন বন-গিরিগিটি | *Calotes jerdoni* | Agamidae | LC | CC BY 4.0 (Rejoice Gassah, iNat-যাচাই) |
| ২ | khasi-grass-lizard | খাসি ঘাস-টিকটিকি | *Takydromus khasiensis* | Lacertidae | LC | CC BY-SA 4.0 (Rohit Naniwadekar, NCF) |
| ৩ | lesser-ringneck-snake | ছোট বলয়-গলা সাপ | *Liopeltis calamaria* | Colubridae | LC | CC BY-SA 4.0 (Vishal Narayan) |
| ৪ | three-striped-roofed-turtle | রঙিলা ছাঁদ কাইট্টা | *Batagur dhongoka* | Geoemydidae | CR | CC BY-SA 4.0 (Hari arcw) |
| ৫ | indian-black-turtle | শামুকভুক কালী কাইট্টা | *Melanochelys trijuga* | Geoemydidae | NT | CC BY-SA 4.0 (Charles J. Sharp) |
| ৬ | indian-egg-eater | ভারতীয় ডিমখেকো সাপ | *Boiga westermanni* (=*Elachistodon westermanni*) | Colubridae | LC; দেশে RE | CC BY-SA 4.0 (Rushikesh Lohar) |
| ৭ | lesser-file-snake | ক্ষুদে ফাইল সাপ | *Acrochordus granulatus* | Acrochordidae | LC; দেশে RE | CC BY 4.0 (coenobita, iNat-যাচাই) |

**ফলাফল:** সরীসৃপ ১৫৩ → **১৬০**; মোট রেকর্ড ১,৫৬৮ → **১,৫৭৫**; ক্রেডিট-রেজিস্টার ১,৫৪৯ → **১,৫৫৬** (যাচাইকৃত ৮৮০ → **৮৮৭**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৫৬৫ → **১,৫৭২** (লোকাল ৬৯১ + দূরবর্তী ৮৮০; ৩ বাদুড়-ফাঁক বহাল)। ৭/৭ রেকর্ডে ৩১টি ফিল্ড, group `sarisrip`; ডুপ স্লাগ/বৈজ্ঞানিক-নাম শূন্য; dataStatus `partial` (ব্যাচ-রীতি)। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] · eslint ০ error · `audit:images` ক্লিন (১৫৭৫/১৫৭২) · stats-এ সরীসৃপ ১৬০।

**RE-শব্দায়ন:** *Boiga westermanni* (১৮৬৩ রংপুর হলোটাইপের পর কোনো নিশ্চিত দেশীয় রেকর্ড নেই) ও *Acrochordus granulatus* (পাঁচ দশকের দর্শন-শূন্যতা)—Haidar et al. (2025) তিনটি আঞ্চলিকভাবে-বিলুপ্ত সাপের দুটি; ঘড়িয়াল-পদ্ধতি অনুসরণে স্পষ্ট RE-নোটসহ রেকর্ডে রাখা হলো (মুছে ফেলা হয়নি)। rear-fanged *B. westermanni*-র কামড়ে শুধু দ্রুত হাসপাতাল-নির্দেশ; কোনো ঘরোয়া পদ্ধতি নয়।

**§১৫-খোলা আইটেমের সমাপন:** ধাপ ৯-এ “দুর্বল-রেকর্ড, পরবর্তী যাচাই সাপেক্ষ” বলে মুলতবি *Batagur dhongoka* (RepFocus: Das 1996, Khan 2004, King & Burke 1989, Rashid & Khan 2000; IUCN-মূল্যায়নে ১৯৯০-এর দশকে BD-তে “uncommon”) ও *Melanochelys trijuga* (RepFocus: Das & Bhupathy 2009 প্রমুখ; Freshwater Biodiversity Portal of Bangladesh; TFTSG) এ ধাপে নথিপত্র-ভিত্তিক নিশ্চিত হয়ে সংযোজিত হলো।

**ধাপ ১০-এর বর্জন-রেজিস্টার (§১৭):**
- **BD-উপস্থিতি অনিশ্চিত/প্রত্যাখ্যাত:** *Eublepharis hardwickii* (টাইপ-লোকালিটি চট্টগ্রাম হলেও RepFocus গণ-পাতা: “presence … needs confirmation”) — **[ধাপ ১১-এ নিষ্পত্তি]** Reptile Database-তে বাংলাদেশ-অন্তর্ভুক্তি ও চট্টগ্রাম type-locality-র ভিত্তিতে `review`-ফ্ল্যাগে more-reptiles11.ts-এ যুক্ত (§১৮); *Protobothrops mucrosquamatus* (Haidar 2025-র স্পষ্ট “Not in Bangladesh”; Reptile Database একই মত); *Calotes minor* (RepFocus BD চেকলিস্টে অনুপস্থিত; DD, মূলত ভারতীয় উপদ্বীপ); *Draco norvillii* (সব BD-উদ্ধৃতি ঐতিহাসিকভাবে *D. blanfordii* “[as blanfordii]”—স্বাধীন শনাক্তকরণ নেই); *Oligodon theobaldi* (একক দুর্বল উদ্ধৃতি Khan 2004)।
- **সাম্প্রতিক নাম-বিভাজনে দ্বৈত-গণনা-ঝুঁকিতে মুলতবি (বিদ্যমান রেকর্ড অপরিবর্তিত):** *Hemidactylus aquilonius* (জাতীয় চেকলিস্টে *bowringii* নাম বহাল; একই জনতা); *Dendrelaphis proarchos* (পুরোনো BD “pictus” রেকর্ডের বিভক্ত রূপ); *Oligodon russelius* (*arnensis* কমপ্লেক্স-বিভাজন); *Rhabdophis bindi* (পুরোনো “himalayanus” রেকর্ডের বিভক্ত রূপ)। **[ধাপ ১১-এ নিষ্পত্তি]** প্রথম তিনটি ও *Eublepharis hardwickii* রেফারেন্স-পুনর্যাচাইয়ে `review`-ফ্ল্যাগ ও `conflictingInfo` ক্রস-রেফারেন্সসহ more-reptiles11.ts-এ যুক্ত হয়েছে; *Rhabdophis bindi*-কে Haidar 2025-র স্পষ্ট “Not in Bangladesh” রায়ে চূড়ান্ত বর্জন করা হয়েছে (§১৮)। কোনো কাঁচা রেকর্ড মোছা হয়নি।
- **পূর্ব-নিষ্পত্তি বহাল:** *Sphenomorphus indicus* (ধাপ ৭: BD-ভাউচার প্রকৃত *Eutropis macularia*); *Fowlea schnurrenbergeri* (“Unidentified Colubroidea” ক্যাটাগরি); *Ahaetulla sahyadrensis* (নাম-সংঘাত)।
- **মুক্ত লাইভ ছবি অনুপলব্ধ (শুধু বই-PD/গণ-স্তর/মানচিত্র):** *Herpetoreas xenura* (কমন্সে শূন্য হিট); *Cyrtodactylus ayeyarwadyensis* (শুধু IUCN মানচিত্র/প্লেসহোল্ডার); *C. tripuraensis* (শূন্য হিট); *Eutropis trivittata* (শুধু ১৮৩৩ Hardwicke চিত্র); *Trachischium guentheri/monticola/tenuiceps* (গণ-স্তর “Trachischium sp.” বা *T. laeve*—প্রজাতি-নিশ্চিত নয়); *Blythia reticulata* (শুধু ১৯শ শতকের বই); *Lycodon zawi*, *Ablepharus sikkimensis*, *Riopa lineolata*, *Tropidophorus assamensis* (পূর্ব-ধাপের বর্জন বহাল); বিশ্বকোষ-বিভাগে *Homalopsis* spp., *Kerilia jerdoni*, *Hydrophis cantoris/obscurus/stricticollis*-ও একই কারণে বাদ (§১৫)।
- **পূর্বেই সঠিক নামে নথিভুক্ত:** *Cyclemys dentata/oldhami* নামে প্রচলিত বাংলাদেশের পাতা-কাছিম ধাপ ৮ থেকে *Cyclemys gemeli* (Assam Leaf Turtle) হিসেবে রেকর্ডে আছে—পুনঃসংযোজন নয়।

**১৬৭-লক্ষ্যের হিসাব (ধাপ ১০-সময়ে):** ১৬০ নথিভুক্ত; বাকি ৭-এর ব্যবধান মূলত (ক) ছবিহীন/প্রজাতি-অনিশ্চিত ট্যাক্সা ও (খ) নাম-বিভাজন-মুলতবি জনতা—থামার শর্ত (ক)–(গ) দ্বারা সীমাবদ্ধ; বৈধ নতুন মুক্ত-ছবি এলে পরবর্তী ধাপে পুনর্যাচাইযোগ্য। ধাপ ১১-এ এই মুলতবি তালিকার ৪টি প্রজাতি review-ফ্ল্যাগে যুক্ত হয়ে সরীসৃপ ১৬৫-তে উন্নীত হয়েছে (§১৮)।

## ১৮. সরীসৃপ-সংযোজন ধাপ ১১ (২০২৬-১০-২৬) — ১ সামুদ্রিক ক্রেট, ২ গেকো, ২ সাপ (সরীসৃপ গোষ্ঠী-সমাপ্তি ধাপ)

ব্যবহারকারীর নির্দেশে সরীসৃপ গোষ্ঠীর অবশিষ্ট প্রার্থী সমাপ্ত করতে RepFocus বাংলাদেশ চেকলিস্টের ৩৪ চাঙ্ক পুনঃস্ক্যান করে প্রতিটি অনুপস্থিত-প্রার্থী The Reptile Database ও Haidar et al. (2025, Herpetozoa 38: 253–269)-এর সঙ্গে মিলিয়ে যাচাই করা হয়। ৫ প্রজাতির কমন্স লাইভ মুক্ত-লাইসেন্স ছবি extmetadata-যাচাইসহ নেওয়া হলো (৩ CC BY 4.0, ২ CC BY-SA 4.0); কোনো Unidentified-ক্যাটাগরি, পুরোনো বই-চিত্র বা প্রজাতি-অনিশ্চিত ফাইল নেওয়া হয়নি। নতুন ফাইল `data/seed/more-reptiles11.ts` (৫×৩১-কী রেকর্ড), index.ts/media-licenses.ts/verification.ts সিঙ্ককৃত।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) | অবস্থা |
|---|---|---|---|---|---|---|---|
| ১ | yellow-lipped-sea-krait | হলদে-ঠোঁট সমুদ্র-কেউটে | *Laticauda colubrina* | Elapidae | LC | CC BY-SA 4.0 (Diego Delso, featured) | verified |
| ২ | northern-smooth-scaled-gecko | উত্তরীয় মসৃণ-আঁশ গেকো | *Hemidactylus aquilonius* | Gekkonidae | LC | CC BY 4.0 (Ankur Nandi, iNat-যাচাই) | review |
| ৩ | eastern-bronzeback | প্রাচ্য দারুশ সাপ | *Dendrelaphis proarchos* | Colubridae | NE | CC BY-SA 4.0 (Santulan Mahanta) | review |
| ৪ | russells-kukri-snake | রাসেলের কুকরি সাপ | *Oligodon russelius* | Colubridae | NE | CC BY 4.0 (Kingshuk Mondal) | review |
| ৫ | east-indian-leopard-gecko | পূর্ব-ভারতীয় চিতা গেকো | *Eublepharis hardwickii* | Eublepharidae | LC | CC BY 4.0 (Supriya Samanta) | review |

**ফলাফল:** সরীসৃপ ১৬০ → **১৬৫** (১৬৭-র ৯৯%); মোট রেকর্ড ১,৫৭৫ → **১,৫৮০**; ক্রেডিট-রেজিস্টার ১,৫৫৬ → **১,৫৬১** (যাচাইকৃত ৮৮৭ → **৮৯২**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৫৭২ → **১,৫৭৭** (লোকাল ৬৯১ + দূরবর্তী ৮৮৫; ৩ বাদুড়-ফাঁক বহাল)। dataStatus: verified ১,৫৪৩ → **১,৫৪৪**, review ২৫ → **২৯** (নতুন ৪টি split/uncertain)। ডুপ স্লাগ/বৈজ্ঞানিক-নাম শূন্য (১৬৫/১৬৫ স্বতন্ত্র); ৫/৫ রেকর্ডে ৩১টি ফিল্ড, group `sarisrip`। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] · eslint ০ error · `audit:images` ক্লিন (১৫৮০/১৫৭৭/৩ ফাঁক/০ missing) · stats-এ সরীসৃপ ১৬৫।

**বিশেষ নোট:**
- *Laticauda colubrina*: Haidar et al. (2025)-র Table 1 “confirmed snake species”-এ #৩৩ হিসেবে অন্তর্ভুক্ত—পূর্ণ `verified` রেকর্ড; প্রবল স্নায়ু-বিষ সত্ত্বেও শান্ত স্বভাব, রেকর্ডে শুধু দ্রুত হাসপাতাল/অ্যান্টিভেনম-নির্দেশ, কোনো ঘরোয়া পদ্ধতি নয়।
- ৩টি সাম্প্রতিক বিভাজন (*aquilonius*↔*bowringii*, *proarchos*↔*pictus*, *russelius*↔*arnensis*): বিদ্যমান জাতীয়-চেকলিস্ট রেকর্ড না মুছে নতুন নামে পৃথক রেকর্ড; জনতা-ওভারল্যাপের স্বচ্ছ ক্রস-রেফারেন্স `verification.ts`-এর UNVERIFIED_REASONS-এ (`review` + `conflictingInfo`)। *russelius*-এর BD-নিশ্চিতকরণ Barkat & Rabbe (2022); *proarchos*-এ Reptile DB-বিন্যাসে বাংলাদেশ স্পষ্ট অন্তর্ভুক্ত।
- *Eublepharis hardwickii*: type-locality চট্টগ্রাম ও Reptile DB-বিন্যাসে বাংলাদেশ থাকলেও RepFocus-এর “needs confirmation” সতর্কতা বহাল—`review`-ফ্ল্যাগে স্বচ্ছতা রক্ষা।
- **Haidar 2025-রায়ে চূড়ান্ত বর্জন (নতুন):** *Pareas macularius* ও *Rhabdophis bindi* — The Reptile Database স্পষ্টভাবে “Not in Bangladesh fide Al Haidar et al. 2025” উল্লেখ করে (যথাক্রমে দক্ষিণ-পূর্ব এশিয়া ও আসাম-মিজোরাম-ত্রিপুরা-সীমাবদ্ধ); RepFocus-এর পুরোনো Das 1996/Khan 2004 উদ্ধৃতি সেকেলে বলে গণ্য। থামার শর্ত (খ) প্রযোজ্য—রেকর্ড নয়, বর্জন-নথিভুক্ত।
- **পূর্বেই রেকর্ডভুক্ত (পুনঃসংযোজন নয়):** *Cuora mouhotii* (খাঁজকাটা বাক্স-কাছিম, EN) ও *Heosemys depressa* (রাখাইন বন-কাছিম, CR) ধাপ ৯ (more-reptiles9.ts)-এই ছিল—এ ধাপের পুনঃস্ক্যানে নিশ্চিত হওয়া গেল।

**১৬৭-লক্ষ্যের চূড়ান্ত হিসাব:** ১৬৫ নথিভুক্ত (৯৯%)। নামমাত্র ২-এর ব্যবধান প্রকৃত অনুপস্থিতি নয়—অবশিষ্ট RepFocus-প্রার্থীরা (ক) মুক্ত লাইভ ছবিহীন (*Homalopsis hardwickii*, *Microcephalophis cantoris*, *Lycodon zawi*, *Blythia reticulata*, *Trachischium* spp. প্রভৃতি), (খ) Haidar 2025-বর্জিত (*mucrosquamatus*, *albolabris*, *macularius*, *bindi*), (গ) শনাক্তকরণ/নাম-সংঘাতে পূর্ব-নিষ্পন্ন (*norvillii*, *minor*, *sahyadrensis*)। থামার শর্ত (ক)–(গ) অনুযায়ী এদের রেকর্ডকরণ সম্ভব নয়; বৈধ নতুন মুক্ত-ছবি বা নতুন ফিল্ড-প্রমাণ এলে পুনর্যাচাইযোগ্য। এ ধাপে সরীসৃপ গোষ্ঠীর কার্যকলাপ সমাপ্ত: চেকলিস্ট-সম্মত যোগ্য প্রতিটি প্রজাতি নথিভুক্ত, প্রতিটি বর্জনের কারণ §৭–১৮-এ নথিবদ্ধ।

## ১৯. উভচর-সংযোজন ধাপ ২ (২০২৬-১০-২৬) — ১০টি ব্যাঙ (Anura)

ব্যবহারকারীর সিদ্ধান্তে সরীসৃপ-পরবর্তী গোষ্ঠী হিসেবে উভচর ধাপ ২ নেওয়া হয়। লক্ষ্যভিত্তি হালনাগাদ করা হয় Rayan & Islam (2026)-এর ৯৬-প্রজাতির চেকলিস্টে (EcoEvoRxiv; পূর্বে IUCN Bangladesh 2015-র ৪৯, Rahman 2021-এ ৬২)। ১০ প্রজাতির কমন্স লাইভ/মুক্ত-লাইসেন্স মিডিয়া extmetadata-যাচাইসহ নেওয়া হলো: ৪ CC BY-SA 4.0, ২ CC BY-SA 2.0, ১ CC BY 4.0, ১ CC BY 3.0, ২ উন্মুক্ত-প্রবেশ জার্নাল-চিত্র (PeerJ CC BY-SA 4.0 ও ZooKeys CC BY 4.0)। কোনো ঊনবিংশ শতকের বই-চিত্র বা Unidentified-ক্যাটাগরির ফাইল নেওয়া হয়নি। নতুন ফাইল `data/seed/more-amphibians2.ts` (১০×৩১-কী); `AMPHIBIANS_BD` উৎস-ধ্রুবকের মৃত লিংক কার্যকরী PDF-ঠিকানায় সংশোধন করা হয়েছে।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | karin-bush-frog | ক্ষুদ্র বোপ ব্যাঙ | *Raorchestes parvulus* | Rhacophoridae | LC (আঞ্চলিক NT) | CC BY-SA 4.0 (Rushenb) |
| ২ | white-lipped-treefrog | পানা গেছে ব্যাঙ | *Zhangixalus smaragdinus* | Rhacophoridae | LC | CC BY 4.0 (Ashwin Viswanathan, iNat) |
| ৩ | dark-sided-frog | কালো-ডোরা ব্যাঙ | *Hylarana nigrovittata* | Ranidae | LC | CC BY-SA 2.0 (Bernard Dupont) |
| ৪ | green-cascade-frog | সবুজ ঝরনা ব্যাঙ | *Odorrana chloronota* | Ranidae | LC | CC BY-SA 2.0 (Rushen, featured) |
| ৫ | aishani-paddy-frog | আইশানী ধানক্ষেত ব্যাঙ | *Micryletta aishani* | Microhylidae | NE | CC BY-SA 4.0 (Das et al., PeerJ 2019 হলোটাইপ) |
| ৬ | rezakhan-bush-frog | রেজা খানের বোপ ব্যাঙ | *Raorchestes rezakhani* | Rhacophoridae | NE | CC BY 4.0 (Al-Razi et al., ZooKeys 2020 জীবন্ত-প্রকরণ) |
| ৭ | copes-assam-frog | মুরগি-ডাকা ব্যাঙ | *Hylarana leptoglossa* | Ranidae | LC | CC BY-SA 4.0 (Sourav jyoti pegu) |
| ৮ | terai-whipping-frog | তেরাই গেছে ব্যাঙ | *Polypedates teraiensis* | Rhacophoridae | LC | CC BY 4.0 (Rejoice Gassah, iNat) |
| ৯ | nepal-wart-frog | নেপালি ঝিংবি ব্যাঙ | *Minervarya nepalensis* | Dicroglossidae | LC | CC BY 3.0 (Karma Wangdi, JoTT) |
| ১০ | dorias-tree-frog | দরিয়ার ক্ষুদে গেছে ব্যাঙ | *Chirixalus doriae* | Rhacophoridae | LC (আঞ্চলিক EN) | CC BY-SA 4.0 (Rushenb) |

**ফলাফল:** উভচর ২৫ → **৩৫** (৪৯-লক্ষ্যের ৭১%; ৯৬-চেকলিস্টের ৩৬%); মোট রেকর্ড ১,৫৮০ → **১,৫৯০**; ক্রেডিট-রেজিস্টার ১,৫৬১ → **১,৫৭১** (যাচাইকৃত ৮৯২ → **৯০২**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৫৭৭ → **১,৫৮৭** (লোকাল ৬৯১ + দূরবর্তী ৮৯৫; ৩ বাদুড়-ফাঁক বহাল)। ১০/১০ রেকর্ডে ৩১টি ফিল্ড, class `Amphibia`; ডুপ স্লাগ/বৈজ্ঞানিক-নাম শূন্য (৩৫/৩৫ স্বতন্ত্র); রানটাইমে ৩২ verified (তিন পুরোনো identity_uncertain বহাল)। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] · eslint ০ error · `audit:images` ক্লিন (১৫৯০/১৫৮৭/৩ ফাঁক/০ missing)।

**বিশেষ নোট:**
- *Raorchestes rezakhani* বাংলাদেশ-এন্ডেমিক (Al-Razi, Maria & Muzaffar 2020, মৌলভীবাজার-সিলেট); *Micryletta aishani* 2019-প্রজাতি—দুটিরই এখনো IUCN-মূল্যায়ন নেই (NE); মিডিয়া মূল-বর্ণনা পত্রের CC-লাইসেন্সকৃত জীবন্ত/হলোটাইপ চিত্র (পুরোনো বই-প্লেট নয়), প্রজাতি-নিশ্চিত।
- *Chirixalus doriae*: বৈশ্বিক LC হলেও Rahman et al. (2021) বাংলাদেশে আঞ্চলিক EN দিয়েছেন—`conservationBn`-এ নথিভুক্ত; *R. parvulus*-এ আঞ্চলিক NT।
- গণ-নামের দ্বৈত-প্রচলন (Hylarana/Sylvirana, Chirixalus/Chiromantis, Minervarya/Fejervarya) otherNames ও বিবরণে সংরক্ষিত।
- **বর্জন (ছবি-ফাঁক):** *Theloderma baibungense* ও *Chiromantis cherrapunjiae* (কমন্সে শূন্য হিট); *Raorchestes andersoni* (শুধু ১৯০৭ PD বই-চিত্র); *Uperodon assamensis* (শুধু IUCN বিন্যাস-মানচিত্র)।
- **পরবর্তী ব্যাচের জন্য মুলতবি:** ৯৬-চেকলিস্টের অবশিষ্ট ~৬১ প্রজাতির অধিকাংশই (ক) বাংলাদেশ-এন্ডেমিক যাদের লাইভ মুক্ত ছবি দুর্লভ (*Microhyla mymensinghensis*, *M. nilphamariensis*, *M. mukhlesuri*, *Minervarya asmati*, *M. dhaka*, *Euphlyctis kalasgramensis*, *Hoplobatrachus litoralis*, *Leptobrachium sylheticum*, *Chikila fulleri*), (খ) IUCN “presence uncertain” ট্যাক্সা (*Hyla annectans*, *Xenophrys robusta*, *Amolops marmoratus*, *Polypedates taeniatus*, *Zhangixalus feae* প্রভৃতি)। ধাপ ১-এর বর্জন (*Chiromantis simus*, *Boulenophrys parva*) বহাল।

## ২০. উভচর-সংযোজন ধাপ ৩ (২০২৬-১০-২৬) — ১০টি ব্যাঙ (Anura)

ব্যবহারকারীর নির্দেশে উভচর সম্প্রসারণের তৃতীয় ব্যাচ নেওয়া হয়, লক্ষ্যভিত্তি একই Rayan & Islam (2026)-এর ৯৬-প্রজাতির চেকলিস্ট। ১০ প্রজাতির কমন্স লাইভ/মুক্ত-লাইসেন্স মিডিয়া extmetadata-যাচাইসহ নেওয়া হলো: ৪ CC BY-SA 4.0, ২ CC BY 4.0, ১ CC BY-SA 2.0, ১ CC BY 3.0, ২ CC0 (একটি PLoS ONE গবেষণাপত্র-চিত্র, একটি ক্যালফোটো-CC0)। কোনো ঊনবিংশ শতকের বই-চিত্র বা Unidentified-ক্যাটাগরির ফাইল নেওয়া হয়নি। নতুন ফাইল `data/seed/more-amphibians3.ts` (১০×৩১-কী)। লেগ্যাসি বীজে আগে থেকেই থাকায় *Euphlyctis cyanophlyctis*, *Microhyla ornata*, *Uperodon systoma*, *Duttaphrynus stomaticus*, *Kaloula pulchra*, *Minervarya teraiensis*, *Phrynoderma hexadactylum* পুনঃসংযোজন করা হয়নি।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | common-indian-cricket-frog | ধানক্ষেত্রর ব্যাঙ | *Minervarya agricola* | Dicroglossidae | LC | CC BY-SA 4.0 (Gihan Jayaweera) |
| ২ | long-legged-cricket-frog | সাইহাড্রা বীর্বি ব্যাঙ | *Minervarya syhadrensis* | Dicroglossidae | LC | CC BY-SA 4.0 (Jithin Vijayan) |
| ৩ | pierres-wart-frog | পিয়েরের বীবি ব্যাঙ | *Minervarya pierrei* | Dicroglossidae | LC | CC BY 3.0 (J. T. Wangyal, JoTT) |
| ৪ | green-mountain-frog | সবুজ ক্যাসকেড ব্যাঙ | *Odorrana livida* | Ranidae | LC | CC BY 4.0 (Ian Dugdale, iNat) |
| ৫ | jerdons-bubble-nest-frog | জার্ডনের বুদবুদ-বাসা ব্যাঙ | *Nasutixalus jerdonii* | Rhacophoridae | LC | CC0 (Biju et al. 2016, PLoS ONE) |
| ৬ | bengal-tree-frog | খয়েরি দাগ গেছে ব্যাঙ | *Polypedates bengalensis* | Rhacophoridae | **NE** | CC BY 4.0 (Kingshuk Mondal, valued) |
| ৭ | white-lipped-horned-toad | বৃহৎ শিংওয়ালা ব্যাঙ | *Xenophrys major* | Megophryidae | LC | CC BY-SA 4.0 (Rushenb) |
| ৮ | burmese-sticky-frog | সরকুখো ব্যাঙ | *Kalophrynus interlineatus* | Microhylidae | LC | CC BY-SA 2.0 (Rushen, featured) |
| ৯ | northern-dwarf-frog | উত্তরাঞ্চলীয় বন ব্যাঙ | *Ingerana borealis* | Dicroglossidae | LC | CC0 (Chintan Sheth) |
| ১০ | indian-cricket-frog | বীবি ব্যাঙ | *Fejervarya limnocharis* | Dicroglossidae | LC | CC BY-SA 4.0 (Garin, WLE) |

**ফলাফল:** উভচর ৩৫ → **৪৫** (৪৯-লক্ষ্যের ৯২%; ৯৬-চেকলিস্টের ৪৭%); মোট রেকর্ড ১,৫৯০ → **১,৬০০**; ক্রেডিট-রেজিস্টার ১,৫৭১ → **১,৫৮১** (যাচাইকৃত ৯০২ → **৯১২**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৫৮৭ → **১,৫৯৭** (লোকাল ৬৯১ + দূরবর্তী ৯০৫; ৩ বাদুড়-ফাঁক বহাল)। ১০/১০ রেকর্ডে ৩১টি ফিল্ড, class `Amphibia`; ডুপ স্লাগ/বৈজ্ঞানিক-নাম শূন্য (৪৫/৪৫ স্বতন্ত্র); রানটাইমে ৪২ verified (তিন পুরোনো identity_uncertain বহাল)। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] · eslint ০ error · `audit:images` ক্লিন (১৬০০/১৫৯৭/৩ ফাঁক/০ missing)।

**বিশেষ নোট:**
- *Polypedates bengalensis* ২০১৯-এ বর্ণিত (২০১৪-র পুরোনো নথি; Das et al. 2025 নামকরণ-রেফারেন্স) — এখনো IUCN-মূল্যায়ন নেই (NE); কমন্সের "valued" CC BY 4.0 জীবন্ত ছবি ব্যবহৃত।
- *Fejervarya limnocharis*-এর নাম-জট: sensu stricto ট্যাক্সন জাভা/দক্ষিণ-পূর্ব এশিয়ার; দক্ষিণ এশীয় ঐতিহাসিক রেকর্ডের বড় অংশ *Minervarya agricola*-তে স্থানান্তরিত। Rayan & Islam (2026) নামটি চেকলিস্টে রেখেছেন; ব্যবহৃত ছবি জাভার (টাইপ-অঞ্চল) নমুনা বলে স্বচ্ছতার জন্য নথিভুক্ত; মাঠ-শনাক্তে আণবিক/ডাক-যাচাই জরুরি।
- গণ-নামের দ্বৈত-প্রচলন (*Megophrys*→*Xenophrys*, *Frankixalus/Philautus*→*Nasutixalus*, *Fejervarya/Zakerana*→*Minervarya*) otherNames ও বিবরণে সংরক্ষিত।
- **বর্জন/মুলতবি (এ ব্যাচে নতুন):** *Sphaerotheca breviceps* (কমন্স-ফাইলগুলোর নাম *S. dobsonii* কিন্তু ক্যাটাগরি breviceps — পরিচয়-দ্বন্দ্বে গ্রহণ হয়নি), *Euphlyctis adolfi*/*Amolops indoburmanensis*/*Chiromantis hansenae*/*Hylarana lacrima* (শূন্য হিট), *Fejervarya orissaensis* (শুধু IUCN SVG মানচিত্র), *Limnonectes khasianus*/*Hylarana humeralis* (শুধু ঊনবিংশ শতকের PD বই-চিত্র), *Duttaphrynus bengalensis* (শুধু PDF, লাইভ ছবি নেই), *Raorchestes annandalii* (অডিও + ১৯০৭ চিত্র), *Fejervarya brama* (প্রজাতি-নির্দিষ্ট লাইভ ছবি নেই)।
- **পূর্ববর্তী মুলতবি বহাল:** ৯ BD-এন্ডেমিক (*M. mymensinghensis*, *M. nilphamariensis*, *M. mukhlesuri*, *Minervarya asmati*, *M. dhaka*, *Euphlyctis kalasgramensis*, *Hoplobatrachus litoralis*, *Leptobrachium sylheticum*, *Chikila fulleri*) ও "presence uncertain" ট্যাক্সা; ধাপ ১–২-এর বর্জন (*Chiromantis simus*, *Boulenophrys parva*, *Theloderma baibungense*, *Ch. cherrapunjiae*, *R. andersoni*, *Uperodon assamensis*) বহাল। ৯৬-চেকলিস্টে অবশিষ্ট ৫১ প্রজাতির অধিকাংশই এই দুই শ্রেণিতে।

## ২১. উভচর-সংযোজন ধাপ ৪ (২০২৬-১০-২৬) — ৬টি ব্যাঙ (মিডিয়া-সীমায় গোষ্ঠী-সমাপ্তি ব্যাচ)

ব্যবহারকারীর নির্দেশে উভচর সম্প্রসারণের চতুর্থ ও মিডিয়া-সীমায় সমাপ্তি-ব্যাচ নেওয়া হয়। Rayan & Islam (2026)-এর ৯৬-চেকলিস্টের অবশিষ্ট ১৬টি স্ক্রিনযোগ্য প্রার্থী Commons extmetadata API দিয়ে যাচাই করে মাত্র ৬টিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের লাইভ/প্রজাতি-নিশ্চিত মিডিয়া পাওয়া যায়। লাইসেন্স মিশ্রণ: ২ CC BY-SA 4.0, ২ CC BY 2.0, ১ CC BY-SA 2.0, ১ CC BY 4.0 (PeerJ মূল-বর্ণনা পত্রের জীবন্ত হলোটাইপ চিত্র)। নতুন ফাইল `data/seed/more-amphibians4.ts` (৬×৩১-কী)। কোনো ঊনবিংশ শতকের বই-চিত্র, Unidentified-ক্যাটাগরি বা দুর্বল-পরিচয়ের ফাইল নেওয়া হয়নি।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | swanborn-puddle-frog | সোয়ানবর্নের পুরুর ব্যাঙ | *Occidozyga swanbornorum* | Dicroglossidae | **NE** | CC BY 4.0 (Trageser et al. 2021, PeerJ) |
| ২ | moodies-crab-eating-frog | মুডির বীবি ব্যাঙ | *Fejervarya moodiei* | Dicroglossidae | LC | CC BY-SA 2.0 (Rushen, Thai National Parks) |
| ৩ | serchhip-horned-toad | আঁচিলযুক্ত শিংওয়ালা ব্যাঙ | *Xenophrys serchhipii* | Megophryidae | LC | CC BY-SA 4.0 (Shreeram M V) |
| ৪ | himalayan-toad | হিমালয়ী কুনো ব্যাঙ | *Duttaphrynus himalayanus* | Bufonidae | LC | CC BY-SA 4.0 (Tisha Mukherjee) |
| ৫ | taiwan-rice-frog | ফিসিপিস ক্ষুদ্র-মুখ ব্যাঙ | *Microhyla fissipes* | Microhylidae | LC | CC BY 2.0 (Thomas Brown, Flickr) |
| ৬ | taipei-grass-frog | তাইপেই ঘাস ব্যাঙ | *Hylarana taipehensis* | Ranidae | LC | CC BY 2.0 (Thomas Brown, Flickr) |

**ফলাফল:** উভচর ৩৫ → **৪৫ → ৫১** (৪৯-লক্ষ্যের **১০৪%**; ৯৬-চেকলিস্টের **৫৩%**); মোট রেকর্ড ১,৫৯০ → ১,৬০০ → **১,৬০৬**; ক্রেডিট-রেজিস্টার ১,৫৭১ → ১,৫৮১ → **১,৫৮৭** (যাচাইকৃত ৯০২ → ৯১২ → **৯১৮**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৫৮৭ → ১,৫৯৭ → **১,৬০৩** (লোকাল ৬৯১ + দূরবর্তী ৯১১; ৩ বাদুড়-ফাঁক বহাল)। ৬/৬ রেকর্ডে ৩১টি ফিল্ড, class `Amphibia`; ডুপ স্লগ/বৈজ্ঞানিক-নাম শূন্য (৫১/৫১ স্বতন্ত্র); রানটাইমে ৪৮ verified (তিন পুরোনো identity_uncertain বহাল)। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] · eslint ০ error · `audit:images` ক্লিন (১৬০৬/১৬০৩/৩ ফাঁক/০ missing)।

**বিশেষ নোট:**
- *Occidozyga swanbornorum* (Trageser et al. 2021, PeerJ) পার্বত্য চট্টগ্রাম থেকে নতুন-বর্ণিত, সংকীর্ণ জ্ঞাত বিন্যাস; এখনো IUCN-মূল্যায়ন নেই (NE)। কমন্স-ফাইলে Phrynoglossus/Hrynoglossus গণ-প্রতিশব্দ সংরক্ষিত; ছবি মূল-বর্ণনা পত্রের CC BY 4.0 জীবন্ত হলোটাইপ চিত্র।
- *Duttaphrynus himalayanus*, *Microhyla fissipes* ও *Hylarana taipehensis*-এর বাংলাদেশ-উপস্থিতি বিতর্কিত/IUCN “Presence Uncertain”; চেকলিস্ট ৯৬-তালিকায় রেখেছে বলে স্বচ্ছ আঞ্চলিক-অনিশ্চয়তা ফ্ল্যাগসহ (`conservationBn` + বিবরণ) অন্তর্ভুক্ত — পরিচয় নিশ্চিত, উপস্থিতি অংশত অনিশ্চিত।
- *Fejervarya moodiei*-তে “Unidentified Anura”-ক্যাটাগরির ফাইল বাদ দিয়ে শুধু সঠিক F. moodiei ক্যাটাগরির লাইভ ফিল্ড ছবি নেওয়া হয়েছে; cancrivora-জটের ২০১৯ সংশোধন (Yodthong et al., ZooKeys) বিবরণে নথিভুক্ত।

**বর্জন/মুলতবি (এ ব্যাচে, ১০ প্রার্থী):** *Kalophrynus orangensis* (প্রজাতি-নির্দিষ্ট ছবি নেই, শুধু অডিও/অন্য প্রজাতি), *Hylarana khare*/*Pterorana khare* (শুধু সাধারণ “Frogs”-ক্যাটাগরির দুর্বল-পরিচয় ফাইল), *Raorchestes garo*/*R. kempieae* (দুই বানানে)/ *R. mawsynramensis*/*R. longchuanensis*/*Amolops yunnaniensis*/*Pedostibes kempi*/*Ingerana occidentis* (কমন্সে শূন্য হিট), *Ichthyophis garoensis* (শুধু IUCN বিন্যাস-মানচিত্র ও PDF)।

**গোষ্ঠী-সমাপ্তি ঘোষণা:** ৯৬-চেকলিস্টে অবশিষ্ট ৪৫ প্রজাতির সবই এখন (ক) ৯ BD-এন্ডেমিক যাদের মুক্ত লাইভ ছবি দুর্লভ, (খ) “presence uncertain/বিতর্কিত” ট্যাক্সা, অথবা (গ) ধাপ ১–৪-এ নথিভুক্ত বর্জন/শূন্য-হিট/শুধু-বই-চিত্র-শ্রেণিতে — নতুন কমন্স আপলোড বা নতুন উপস্থিতি-প্রমাণ ছাড়া আর কোনো প্রজাতি যোগ করা সম্ভব নয়। উভচর গোষ্ঠী তাই **মিডিয়া-চুক্তির সীমায় কার্যত সমাপ্ত** (সরীসৃপ ১৬৫/১৬৭-এর মতোই); পূর্ণ রেজিস্টার §১৬, §১৯–§২১।

## ২২. মাছ-সংযোজন ব্যাচ ১ (২০২৬-১০-২৬) — ১১টি মিঠাপানির মাছ

ব্যবহারকারীর নির্দেশে মাছ সম্প্রসারণের প্রথম ব্যাচ নেওয়া হয়। লক্ষ্যভিত্তি: IUCN Red List of Bangladesh (2015)-এ মূল্যায়িত **২৫৩ মিঠাপানি-প্রজাতি** (৬৪ হুমকিগ্রস্ত: ৯ CR, ৩০ EN, ২৫ VU); Hossain et al. (2012)-তে ২৯৩, Rahman (2005)-এ ২৬৫, FishBase-এ ২৫৮ রিপোর্টেড। ব্যাচ-পূর্বে সাইটে মাছ ছিল ৭৭ (২৫৩-লক্ষ্যের ৩০%) — মেরুদণ্ডী গোষ্ঠীগুলোর মধ্যে সবচেয়ে বড় ফাঁক। ১৫টি প্রার্থী Commons extmetadata API দিয়ে যাচাই করে ১১টিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের লাইভ/প্রজাতি-নিশ্চিত মিডিয়া পাওয়া যায়; ৪টি বর্জিত (নিচে দ্রষ্টব্য)। লাইসেন্স মিশ্রণ: ৪ CC BY 3.0 (চারটিই FishBase-আপলোড), ২ CC BY 4.0 (iNaturalist), ২ CC BY-SA 3.0, ২ CC BY-SA 4.0, ১ CC BY 2.0 (Flickr)। নতুন ফাইল `data/seed/more-fish2.ts` (১১×৩১-কী)। কোনো ঊনবিংশ শতকের Day/Hamilton/Bloch বই-প্লেট, Unidentified-ক্যাটাগরি, রান্না-খাবার বা দুর্বল-পরিচয়ের ফাইল নেওয়া হয়নি।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | gangetic-leaffish | মেনদা/ভেদা | *Nandus nandus* | Nandidae (Anabantiformes) | LC | CC BY 4.0 (Rejoice Gassah, iNaturalist) |
| ২ | barred-spiny-eel | বামন বাইন/বারিল | *Macrognathus pancalus* | Mastacembelidae (Synbranchiformes) | LC | CC BY 4.0 (Sandipan Das, iNaturalist) |
| ৩ | badis-blue-perch | বদি/রটকফ | *Badis badis* | Badidae (Anabantiformes) | LC | CC BY-SA 3.0 (Tomolyka) |
| ৪ | freshwater-puffer | টেপা/কুটকুটি | *Leiodon cutcutia* | Tetraodontidae (Tetraodontiformes) | LC | CC BY 3.0 (S. Ratmuangkhwang, FishBase) |
| ৫ | trout-barb | বোরালি/বোলা | *Raiamas bola* | Cyprinidae (Cypriniformes) | LC | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ৬ | sucker-head-garra | গোটল/গারা | *Garra gotyla* | Cyprinidae (Cypriniformes) | LC | CC BY-SA 3.0 (BACbKA) |
| ৭ | flying-barb | নিত্তি/দারিক্ষি | *Esomus danricus* | Cyprinidae (Cypriniformes) | LC | CC BY-SA 4.0 (Dibyajyoti Dutta) |
| ৮ | cotio-carp | কোটি/গুরখা | *Osteobrama cotio* | Cyprinidae (Cypriniformes) | LC | CC BY 3.0 (H. B. Osmany, FishBase) |
| ৯ | barna-baril | বারনা/বারনি | *Barilius barna* | Cyprinidae (Cypriniformes) | LC | CC BY 3.0 (bakalial, FishBase) |
| ১০ | corsula-mullet | খালসা/করসুলা | *Rhinomugil corsula* | Mugilidae (Mugiliformes) | LC | CC BY 2.0 (Brian Gratwicke, Flickr) |
| ১১ | phulo-barb | ফুলশল/ফুলো | *Salmophasia phulo* | Cyprinidae (Cypriniformes) | LC | CC BY 3.0 (Md. R. Islam, FishBase) |

**ফলাফল:** মাছ ৭৭ → **৮৮** (২৫৩-লক্ষ্যের **৩৫%**; ১১/১১ প্রজাতি বৈশ্বিক LC, জাতীয়-হ্রাসের সতর্কতা `conservationBn`-এ নথিভুক্ত); মোট রেকর্ড ১,৬০৬ → **১,৬১৭** (প্রাণী ১,৩৫৭ → **১,৩৬৮**); ক্রেডিট-রেজিস্টার ১,৫৮৭ → **১,৫৯৮** (যাচাইকৃত ৯১৮ → **৯২৯**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬০৩ → **১,৬১৪** (লোকাল ৬৯১ + দূরবর্তী ৯২৩ stats / ৯২২ audit; ৩ বাদুড়-ফাঁক বহাল)। ১১/১১ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে পূর্ণ-মানের রেকর্ড রানটাইমে verified-এ পদোন্নত হয় (machh ৮৮/৮৮ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম শূন্য (৮৮/৮৮ স্বতন্ত্র); `licenseFor()` ১১/১১ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] · eslint ০ error · `audit:images` ক্লিন (১৬১৭/১৬১৪/৩ ফাঁক/০ missing) · `stats` ১৬১৭।

- গণ/নাম-দ্বৈত-প্রচলন `otherNames` ও বিবরণে সংরক্ষিত: *Leiodon cutcutia* ↔ *Tetraodon cutcutia*; *Raiamas bola* ↔ *Barilius bola*; *Salmophasia phulo* (প্রতিশব্দ *Salmostoma phulo*) ↔ *Chela phulo*।

**বর্জন/মুলতবি (এ ব্যাচে, ৪ প্রার্থী):** *Chaca chaca* (কমন্সে শুধু *C. bankanensis*-ফাইল ও ১৮৮৯ Day/Iconographia প্লেট), *Ailia coila* (শুধু ১৮৭৮/১৮৮৯ Day প্লেট + রান্না-খাবার “Kajli Machher Jhal” WLF-ফাইল), *Chagunius chagunio* (শুধু ১৮৭৮ Achilles/Day প্লেট), *Macrognathus aculeatus* (শুধু ১৭৯৬ Bloch/১৮১৯ Lacépède প্লেট + “Unidentified Actinopterygii”-ক্যাটাগরির Bain fish.jpg)। নতুন কমন্স আপলোড ছাড়া এদের গ্রহণযোগ্য লাইভ মিডিয়া নেই; ট্যাক্সাগুলো রেকর্ড হিসেবে যোগ হয়নি, বর্জন-কারণ এই অনুচ্ছেদেই নথিভুক্ত।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~১৬৫ প্রজাতি বাকি; পরের মাছ-ব্যাচে একই Commons extmetadata-চুক্তি ও ৩১-ফিল্ড টেমপ্লেট অব্যাহত থাকবে। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা `image-gaps.ts`/মুলতবি-নথিতে যায়, কাঁচা রেকর্ড হিসেবে নয়।

## ২৩. মাছ-সংযোজন ব্যাচ ২ (২০২৬-১০-২৬) — ১২টি মিঠাপানির মাছ

অটো-মোড নির্দেশে মাছ সম্প্রসারণের দ্বিতীয় ব্যাচ নেওয়া হয়। লক্ষ্যভিত্তি অপরিবর্তিত: IUCN Red List of Bangladesh (2015)-এর **২৫৩ মিঠাপানি-প্রজাতি** (৬৪ হুমকিগ্রস্ত); ব্যাচ-পূর্বে সাইটে মাছ ছিল ৮৮ (৩৫%)। ২৪টি প্রার্থী Commons extmetadata API (প্রজাতি-ক্যাটাগরি-ভিত্তিক compact categorymembers কোয়েরি) দিয়ে যাচাই করে ১২টিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের লাইভ/প্রজাতি-নিশ্চিত মিডিয়া পাওয়া যায়। লাইসেন্স মিশ্রণ: ৮ CC BY-SA 4.0, ২ CC BY 3.0 (দুটিই FishBase-আপলোড), ১ CC BY 4.0, ১ Public Domain (PD-self আধুনিক ফিল্ড ছবি — প্রজেক্ট-অ্যালোলিস্টে `public domain` গৃহীত, রেজিস্টারে ৪১টি পূর্ব-নজির; ঊনবিংশ-শতকের বই-প্লেট নয়)। নতুন ফাইল `data/seed/more-fish3.ts` (১২×৩১-কী)। কোনো Day/Hamilton/Bloch/Mintern/Achilles বই-প্লেট, Iconographia Zoologica-চিত্র, Unidentified-ক্যাটাগরি বা দুর্বল-পরিচয়ের ফাইল নেওয়া হয়নি।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | bengal-danio | বিন্দিরানি | *Devario devario* | Cyprinidae (Cypriniformes) | LC / LC | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ২ | rosy-barb | কাঞ্চন পুঁটি | *Pethia conchonius* | Cyprinidae (Cypriniformes) | LC / LC | CC BY-SA 4.0 (Marrabbio2) |
| ৩ | golden-dwarf-barb | জেলি পুঁটি | *Pethia gelius* | Cyprinidae (Cypriniformes) | LC / **NT** | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ৪ | striped-dwarf-catfish | ডোরা টেংরা | *Mystus vittatus* | Bagridae (Siluriformes) | LC / LC | CC BY 4.0 (Dmytro Oleksii) |
| ৫ | honey-gourami | চুনা খলশা | *Trichogaster chuna* | Osphronemidae (Anabantiformes) | LC / LC | CC BY-SA 4.0 (Sugeesh) |
| ৬ | copper-mahseer | ভোরখোল মহাশোল | *Neolissochilus hexagonolepis* | Cyprinidae (Cypriniformes) | **NT** / **EN** | CC BY 3.0 (Ben Laloo, FishBase) |
| ৭ | one-stripe-spiny-eel | তারা বাইম | *Macrognathus aral* | Mastacembelidae (Synbranchiformes) | LC / **DD** | Public Domain (Nilesh Heda, PD-self) |
| ৮ | gangetic-loach | রানি বৌমাছ | *Botia rostrata* | Botiidae (Cypriniformes) | LC / **DD** | CC BY 3.0 (H. B. Osmany, FishBase) |
| ৯ | silver-hatchet-chela | কেচি চেলা | *Chela cachius* | Cyprinidae (Cypriniformes) | LC / **VU** | CC BY-SA 4.0 (দিব্য দত্ত) |
| ১০ | ariza-carp | ভাঙনা | *Cirrhinus ariza* | Cyprinidae (Cypriniformes) | LC / **VU** | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ১১ | blue-panchax | বেচি | *Aplocheilus panchax* | Aplocheilidae (Cyprinodontiformes) | LC / LC | CC BY-SA 4.0 (Vengolis) |
| ১২ | crazy-fish | বাইলা | *Butis butis* | Butidae (Gobiiformes) | LC / LC | CC BY-SA 4.0 (Beta Mahatvaraj) |

**ফলাফল:** মাছ ৮৮ → **১০০** (২৫৩-লক্ষ্যের **৪০%**; ১১টি বৈশ্বিক LC, ১টি বৈশ্বিক NT—*N. hexagonolepis*; জাতীয় অবস্থা ৬ LC, ২ VU, ২ DD, ১ NT, ১ EN—প্রতিটি `conservationBn`-এ নথিভুক্ত); মোট রেকর্ড ১,৬১৭ → **১,৬২৯** (প্রাণী ১,৩৬৮ → **১,৩৮০**); ক্রেডিট-রেজিস্টার ১,৫৯৮ → **১,৬১০** (যাচাইকৃত ৯২৯ → **৯৪১**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬১৪ → **১,৬২৬** (লোকাল ৬৯১ + দূরবর্তী ৯৩৫ stats / ৯৩৪ audit; ৩ বাদুড়-ফাঁক বহাল)। ১২/১২ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`, `origin: 'native'`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১০০/১০০ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম শূন্য (১০০/১০০ স্বতন্ত্র); `licenseFor()` ১২/১২ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬১০/verified ৯৪১, অনিবন্ধিত প্লেসহোল্ডার ০) · eslint ০ error · `audit:images` ক্লিন (১৬২৯/১৬২৬/৩ ফাঁক/০ missing) · `stats` ১৬২৯।

- গণ/নাম-দ্বৈত-প্রচলন `otherNames` ও বিবরণে সংরক্ষিত: *Cirrhinus ariza* ↔ *Gymnostomus ariza* / *Labeo ariza*; বাংলা নাম-যাচাইয়ের সূত্র: FishBase Country ComNames, Freshwater Biodiversity Portal of Bangladesh, BdFISH (IUCN Bangladesh ২০১৫ তালিকাসহ)।
- **উপস্থিতি-বর্জন:** *Garra mullya* পেনিনসুলার ভারতে সীমাবদ্ধ (আসাম ও হিমালয় বাদ; FishBase/Seriously Fish); বাংলাদেশে উপস্থিতি প্রমাণিত নয়—মিডিয়া-সমস্যা নয়, প্রার্থী থেকে প্রত্যাহার।
- **লাইসেন্স-বর্জিত/মুলতবি (১২):** *Barilius bendelisis* (EN), *Crossocheilus latius* (EN), *Silonia silondia* (LC), *Hyporhamphus limbatus* (LC), *Tor tor* (CR; একমাত্র আধুনিক CC ফাইল পুকুর-দৃশ্য, মাছ-প্রতিকৃতি নয়), *Laubuca laubuca* (ক্যাটাগরি শূন্য), *Rasbora rasbora* (NT), *Hara jerdoni* (LC), *Securicula gora* (NT), *Pethia phutunio* (LC), *Mystus bleekeri* (LC), *Bengala elanga*/*Megarasbora elanga* (EN) — প্রতিটিতে শুধু ১৮৭৮/১৮৮৯ Day-Mintern-Achilles প্লেট বা Iconographia Zoologica-র ঐতিহাসিক চিত্র; নতুন কমন্স আপলোড ছাড়া গ্রহণযোগ্য লাইভ মিডিয়া নেই। বন্ধনীতে IUCN Bangladesh ২০১৫ জাতীয় অবস্থা—হুমকিগ্রস্ত প্রজাতিগুলো ছবি-ফাঁক হিসেবে অগ্রাধিকার তালিকায় থাকবে।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~১৫৩ প্রজাতি বাকি; মাছ ব্যাচ ৩-এ একই Commons extmetadata-চুক্তি, ৩১-ফিল্ড টেমপ্লেট ও জাতীয়-অবস্থা-নথি অব্যাহত থাকবে। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ২৪. মাছ-সংযোজন ব্যাচ ৩ (২০২৬-১০-২৭) — ১২টি মিঠাপানি/মোহনা-মাছ

অটো-মোড নির্দেশে মাছ সম্প্রসারণের তৃতীয় ব্যাচ। লক্ষ্যভিত্তি অপরিবর্তিত: IUCN Red List of Bangladesh (2015)-এর **২৫৩ মিঠাপানি-প্রজাতি** (৬৪ হুমকিগ্রস্ত: ৯ CR/৩০ EN/২৫ VU); ব্যাচ-পূর্বে সাইটে মাছ ছিল ১০০ (৪০%)। ২২টি প্রার্থী-প্রজাতির Commons ক্যাটাগরি extmetadata API (categorymembers + extmetadata compact কোয়েরি) দিয়ে যাচাই করে ১২টিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের লাইভ/প্রজাতি-নিশ্চিত আধুনিক আলোকচিত্র পাওয়া যায়। লাইসেন্স মিশ্রণ: ৫ CC BY-SA 4.0, ৪ CC BY 3.0 (FishBase/BOLD-আপলোড), ১ CC BY 4.0 (iNaturalist), ২ CC BY-SA 3.0। নতুন ফাইল `data/seed/more-fish4.ts` (১২×৩১-কী)। কোনো Day/Hamilton/Bloch/Mintern/Achilles বই-প্লেট, Iconographia Zoologica-চিত্র, Unidentified-ক্যাটাগরি, রান্না-খাদ্য-ছবি বা দুর্বল-পরিচয়ের ফাইল নেওয়া হয়নি। জাতীয় অবস্থা bdfish ২৫৩-তালিকা থেকে ক্রমিক-নম্বরসহ প্রত্যক্ষ-পঠিত; বাংলা নাম FishBase Country ComNames, BdFISH (হালদা-তালিকাসহ), Freshwater Biodiversity Portal of Bangladesh, Wikispecies ও Commons ফাইল-বিবরণ থেকে যাচাইকৃত।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | barca-snakehead | তিলা শোল | *Channa barca* | Channidae (Anabantiformes) | **DD** / **CR** | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ২ | moustached-danio | গোফি চেলা | *Danio dangila* | Danionidae (Cypriniformes) | LC / **VU** | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ৩ | spiketail-paradisefish | কই বান্দি | *Pseudosphromenus cupanus* | Osphronemidae (Anabantiformes) | LC / LC | CC BY 4.0 (renjus box, iNaturalist) |
| ৪ | croaking-gourami | বুনো খলিসা | *Trichopsis vittata* | Osphronemidae (Anabantiformes) | LC / LC | CC BY-SA 3.0 (Ahsan_al_hidayat) |
| ৫ | swamp-barb | চোলা পুঁটি | *Puntius chola* | Cyprinidae (Cypriniformes) | LC / LC | CC BY-SA 4.0 (Rumi Borah) |
| ৬ | onespot-barb | টেরি পুঁটি | *Puntius terio* | Cyprinidae (Cypriniformes) | LC / LC | CC BY 3.0 (Ratnabir Singha, FishBase) |
| ৭ | knight-goby | নাইট গুবি | *Stigmatogobius sadanundio* | Gobiidae (Gobiiformes) | LC / LC | CC BY 3.0 (Sahat Ratmuangkhwang, FishBase) |
| ৮ | wrestling-halfbeak | এক থুটা | *Dermogenys pusilla* | Zenarchopteridae (Beloniformes) | LC / LC | CC BY-SA 4.0 (Kacper Aleksander) |
| ৯ | chapila-river-shad | চাপিলা | *Gonialosa manmina* | Clupeidae (Clupeiformes) | LC / LC | CC BY-SA 3.0 (Hopeoflight) |
| ১০ | dusky-sleeper | ভূত বেলে | *Eleotris fusca* | Eleotridae (Gobiiformes) | LC / LC | CC BY-SA 4.0 (Wibowo Djatmiko) |
| ১১ | balitora-minnow | বালিচুরা | *Psilorhynchus balitora* | Psilorhynchidae (Cypriniformes) | LC / LC | CC BY 3.0 (Andrew Rao, FishBase) |
| ১২ | cosuatis-barb | কুসুয়াটি | *Oreichthys cosuatis* | Cyprinidae (Cypriniformes) | LC / **EN** | CC BY 3.0 (Rupert A. Collins, BOLD) |

**ফলাফল:** মাছ ১০০ → **১১২** (২৫৩-লক্ষ্যের **৪৪%**; ১১টি বৈশ্বিক LC, ১টি বৈশ্বিক DD—*C. barca*; জাতীয় অবস্থা ৯ LC, ১ VU—*D. dangila* (#71), ১ EN—*O. cosuatis* (#161), ১ CR—*C. barca* (#47), প্রতিটি `conservationBn`-এ তালিকা-ক্রমিকসহ নথিভুক্ত); মোট রেকর্ড ১,৬২৯ → **১,৬৪১** (প্রাণী ১,৩৮০ → **১,৩৯২**); ক্রেডিট-রেজিস্টার ১,৬১০ → **১,৬২২** (যাচাইকৃত ৯৪১ → **৯৫৩**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬২৬ → **১,৬৩৮** (লোকাল ৬৯১ + দূরবর্তী ৯৪৭ stats / ৯৪৬ audit; ৩ বাদুড়-ফাঁক বহাল)। ১২/১২ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`; `origin`: ১১টি `native`, ১টি `invasive` (*T. vittata*); seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১১২/১১২ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম শূন্য (১১২/১১২ স্বতন্ত্র); `licenseFor()` ১২/১২ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬২২/verified ৯৫৩, অনিবন্ধিত প্লেসহোল্ডার ০) · eslint ০ error · `audit:images` ক্লিন (১৬৪১/১৬৩৮/৩ ফাঁক/০ missing) · `stats` ১৬৪১।

- **পরাগত-প্রজাতি নথি:** *Trichopsis vittata* বাংলাদেশে প্রথম রেকর্ড ২০১২, অ্যাকুরিয়াম বাণিজ্য-উদ্ভূত ও দ্রুত বিস্তারশীল আক্রমণকারী (Akash & Hossain 2017; USGS ERSS) — `origin: 'invasive'`, বিবরণ ও `conservationBn`-এ সতর্কতা; প্রজেক্ট-শব্দভাণ্ডারে `invasive` একটি স্বীকৃত origin-মান।
- **উপস্থিতি-সতর্কতা:** *Pseudosphromenus cupanus*-এর বাংলাদেশি মূল রেকর্ড Zootaxa 3990 (2015)-পর্যালোচনায় দুর্বল (Rahman 1989 সম্ভবত Jayaram 1981-অনুসারী; কোনো মূল রেকর্ড পাওয়া যায়নি); তবে FishBase বাংলাদেশ চেকলিস্ট ও IUCN Bangladesh ২০১৫-এর ২৫৩-তালিকায় LC (#199) হিসেবে অন্তর্ভুক্ত থাকায় স্বচ্ছ উপস্থিতি-নোটসহ গৃহীত; রেকর্ডে নতুন জরিপ-প্রমাণের সুপারিশ নথিভুক্ত।
- **নাম-দ্বৈত-প্রচলন `otherNames`-এ সংরক্ষিত:** *Stigmatogobius sadanundio*-র স্থানীয় নাম “বাইলা” (BdFISH হালদা-তালিকা) — batch ২-এর *Butis butis*-ও বাইলা নামে পরিচিত; প্রাথমিক nameBn পৃথক রেখে “বাইলা” otherNames-এ রাখা হয়েছে। *Dermogenys pusilla*-র জাতীয় তালিকায় বানান *D. pusillus* (#74) — `conservationBn`-এ উল্লিখিত।

**বর্জন/মুলতবি (এ ব্যাচে, ১০ প্রার্থী — রেকর্ড নয়):**

| প্রার্থী ট্যাক্সন | জাতীয় IUCN (২০১৫) | বর্জন-কারণ |
|---|---|---|
| *Brachygobius nunus* | LC (#39) | Commons প্রজাতি-ক্যাটাগরি শূন্য — কোনো ফাইল নেই |
| *Salmostoma acinaces* | LC (#216) | Commons প্রজাতি-ক্যাটাগরি শূন্য |
| *Ctenops nobilis* | LC (#66) | শুধু Day প্লেট ও বিস্তার-মানচিত্র; কোনো লাইভ ফটো নেই |
| *Oryzias dancena* | DD (#163) | শুধু ট্রান্সজেনিক chgH-rfp ল্যাব GIF — প্রাকৃতিক প্রজাতি-চিত্র নয় |
| *Pseudambassis lala* | LC (#192) | Iconographia Zoologica tif + ১৯৩৬ Innes বই-পাতা মাত্র |
| *Labeo angra* | LC (#111) | Griesbach (1878) বই-প্লেট মাত্র |
| *Barilius shacra* | LC (#29) | Mintern বই-প্লেট মাত্র |
| *Gagata cenia* | LC (#86) | Iconographia Zoologica + Mintern প্লেট মাত্র |
| *Schistura savona* | NT (#223) | Day ১৫৫ বই-প্লেট মাত্র |
| *Amblypharyngodon microlepis* | LC (#8) | Day/FMIB প্লেট + রান্না-তরকারি খাদ্য-ছবি (খাদ্য-নিষিদ্ধ-শ্রেণি) |

নতুন কমন্স আপলোড ছাড়া এদের গ্রহণযোগ্য লাইভ মিডিয়া নেই; হুমকিগ্রস্ত *S. savona* (NT) ছবি-ফাঁক অগ্রাধিকার তালিকায় থাকবে।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~১৪১ প্রজাতি বাকি; মাছ ব্যাচ ৪-এ একই Commons extmetadata-চুক্তি, ৩১-ফিল্ড টেমপ্লেট ও জাতীয়-অবস্থা-নথি অব্যাহত থাকবে। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ২৫. মাছ-সংযোজন ব্যাচ ৪ (২০২৬-১০-২৭) — ১২টি মোহনা/মিঠাপানির মাছ

অটো-মোড নির্দেশে মাছ সম্প্রসারণের চতুর্থ ব্যাচ; প্রাধান্য দেওয়া হয় সুন্দরবন-মোহনা-উপকূলীয় গোষ্ঠীকে (৪ মাডস্কিপার/ওয়ার্ম-গবি)। লক্ষ্যভিত্তি অপরিবর্তিত: IUCN Red List of Bangladesh (2015)-এর **২৫৩ মিঠাপানি-প্রজাতি**; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১১২ (৪৪%)। ২২টি প্রার্থী-প্রজাতির Commons ক্যাটাগরি extmetadata API দিয়ে যাচাই করে ১২টিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের লাইভ/প্রজাতি-নিশ্চিত আধুনিক আলোকচিত্র পাওয়া যায়। লাইসেন্স মিশ্রণ: ৭ CC BY-SA 4.0, ৩ CC BY-SA 3.0, ১ CC BY 3.0, ১ CC BY-SA 2.0 de (জার্মান-পোর্টেড, অ্যালোলিস্টে `cc by-sa 2.0` গৃহীত)। নতুন ফাইল `data/seed/more-fish5.ts` (১২×৩১-কী)। বিশেষ ফাইল: *Polynemus paradiseus*-এর ছবিটি চট্টগ্রাম বিশ্ববিদ্যালয় ইনস্টিটিউট অব মেরিন সায়েন্সেস জাদুঘরের Wikimedia Bangladesh GLAM-আপলোড (২০২৬, লেখক JIBON)। কোনো Day/Hamilton/Bloch/Mintern/Achilles/Ford বই-প্লেট, Iconographia Zoologica-চিত্র, Unidentified-ক্যাটাগরি, রান্না-খাদ্য-ছবি বা দুর্বল-পরিচয়ের ফাইল নেওয়া হয়নি।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | blue-spotted-mudskipper | ডাহুক মাছ | *Boleophthalmus boddarti* | Oxudercidae (Gobiiformes) | LC / LC | CC BY-SA 3.0 (JJ Harrison) |
| ২ | giant-mudskipper | সাদা ফোঁটা ডাহুক | *Periophthalmodon schlosseri* | Oxudercidae (Gobiiformes) | LC / LC | CC BY-SA 2.0 de (Bernhard Luth) |
| ৩ | walking-mudskipper | ওয়াকিং গবি | *Scartelaos histophorus* | Oxudercidae (Gobiiformes) | LC / LC | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ৪ | bearded-worm-goby | চেউয়া মাছ | *Taenioides cirratus* | Oxudercidae (Gobiiformes) | LC / LC | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ৫ | gray-eel-catfish | কান মাগুর | *Plotosus canius* | Plotosidae (Siluriformes) | LC / **NT** | CC BY 3.0 (Vaikoovery) |
| ৬ | flathead-grey-mullet | খরুল বাটা | *Mugil cephalus* | Mugilidae (Mugiliformes) | LC / LC | CC BY-SA 3.0 (Izuzuki) |
| ৭ | slender-rasbora | পাতি ডারকিনা | *Rasbora daniconius* | Cyprinidae (Cypriniformes) | LC / LC | CC BY-SA 4.0 (AngryBurmese) |
| ৮ | paradise-threadfin | তাপসি মাছ | *Polynemus paradiseus* | Polynemidae (Carangiformes) | LC / LC | CC BY-SA 4.0 (JIBON, WMBD GLAM) |
| ৯ | bartail-flathead | চর বেলে | *Platycephalus indicus* | Platycephalidae (Perciformes) | LC / LC | CC BY-SA 4.0 (Micromesistius) |
| ১০ | berdmorei-loach | পুইয়া মাছ | *Lepidocephalichthys berdmorei* | Cobitidae (Cypriniformes) | LC / LC | CC BY-SA 3.0 (S. Ratmuangkhwang) |
| ১১ | cinnamon-loach | কলি পুঁইয়া | *Pangio pangia* | Cobitidae (Cypriniformes) | LC / LC | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ১২ | bengal-swamp-eel | বামুশ মাছ | *Ophisternon bengalense* | Synbranchidae (Synbranchiformes) | LC / **VU** | CC BY 4.0 (Rohit, iNaturalist) |

**ফলাফল:** মাছ ১১২ → **১২৪** (২৫৩-লক্ষ্যের **৪৯%**; ১২/১২ প্রজাতি বৈশ্বিক LC; জাতীয় অবস্থা ১০ LC, ১ NT—*P. canius* (#189), ১ VU—*O. bengalense* (#160), প্রতিটি `conservationBn`-এ তালিকা-ক্রমিকসহ); মোট রেকর্ড ১,৬৪১ → **১,৬৫৩** (প্রাণী ১,৩৯২ → **১,৪০৪**); ক্রেডিট-রেজিস্টার ১,৬২২ → **১,৬৩৪** (যাচাইকৃত ৯৫৩ → **৯৬৫**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬৩৮ → **১,৬৫০** (লোকাল ৬৯১ + দূরবর্তী ৯৫৯ stats / ৯৫৮ audit; ৩ বাদুড়-ফাঁক বহাল)। ১২/১২ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`, `origin: 'native'`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১২৪/১২৪ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম শূন্য (১২৪/১২৪ স্বতন্ত্র); `licenseFor()` ১২/১২ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬৩৪/verified ৯৬৫, অনিবন্ধিত প্লেসহোল্ডার ০) · eslint ০ error · `audit:images` ক্লিন (১৬৫৩/১৬৫০/৩ ফাঁক/০ missing) · `stats` ১৬৫৩।

- **নাম-দ্বৈত-প্রচলন `otherNames`-এ সংরক্ষিত:** “ডাহুক” একাধিক মাডস্কিপারের যৌথ নাম—*B. boddarti* (FishBase: Dahuk; অতিরিক্ত চিড়িং/মেনি মাছ), *S. histophorus* (FishBase: Dahuk; প্রাথমিক nameBn ইংরেজি-ভিত্তিক “ওয়াকিং গবি” রেখে ডাহুক otherNames-এ), *P. schlosseri* (Commons/roddure: সাদা ফোঁটা ডাহুক; বিকল্প বড় ডাহুক/বড় চিড়িং)। “পুইয়া” *L. berdmorei* ও *L. irrorata*-র যৌথ নাম—নথিভুক্ত। সূত্র: FishBase Country ComNames, Freshwater/Marine Biodiversity Portal of Bangladesh, BdFISH, roddure.com, Commons বাংলা লেবেল।
- **মুলতবি (গ্রহণযোগ্য মিডিয়া আছে, কোটার বাইরে):** *Coilia dussumieri* (LC #61; BEDO BY-SA 4.0, ২০১৫) ও *Anodontostoma chacunda* (LC #13; BEDO BY-SA 4.0, ২০১৫; বাংলা নাম কৈ পুটি) — ব্যাচ ৫-র অগ্রাধিকার তালিকায়।
- **বর্জিত ৮ (রেকর্ড নয়):** *Odontamblyopus rubicundus* (Ford 1878 + Iconographia), *Acanthocobitis botia* (Day 156 + Beavan 1877 ড্রয়িং মাত্র), *Pseudambassis baculis* (Day প্লেট মাত্র), *Johnius coitor* (Ford/Iconographia), *Nematalosa nasus* (1921/Achilles/Iconographia), *Pethia guganio* (Commons ক্যাটাগরি শূন্য), *Oryzias melastigma* (Day/Mintern প্লেট মাত্র), *Apocryptes bato* (Ford/Iconographia) — নতুন কমন্স আপলোড ছাড়া গ্রহণযোগ্য লাইভ মিডিয়া নেই; হুমকিগ্রস্ত কেউ নেই (সব LC) বলে অগ্রাধিকার-চাপ কম।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~১২৯ প্রজাতি বাকি; মাছ ব্যাচ ৫-এ একই Commons extmetadata-চুক্তি, ৩১-ফিল্ড টেমপ্লেট ও জাতীয়-অবস্থা-নথি অব্যাহত থাকবে; *C. dussumieri* ও *A. chacunda* প্রস্তুত-মুলতবি। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ২৬. মাছ-সংযোজন ব্যাচ ৫ (২০২৬-১০-২৭) — ১২টি মোহনা/উপকূলীয়/নদ-মাছ

অটো-মোড নির্দেশে মাছ সম্প্রসারণের পঞ্চম ব্যাচ; প্রাধান্য দেওয়া হয় মোহনা-উপকূলীয় গোষ্ঠীকে (অ্যাঙ্কোভি, শ্যাড, মালেট, ফ্ল্যাটফিশ, ঈল, পাফার)। লক্ষ্যভিত্তি অপরিবর্তিত: IUCN Red List of Bangladesh (2015)-এর **২৫৩ মিঠাপানি-প্রজাতি**; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১২৪ (৪৯%)। ব্যাচ ৪-শেষে মুলতবি রাখা *Coilia dussumieri* ও *Anodontostoma chacunda* এই ব্যাচে গৃহীত। ৩০+ প্রার্থী-প্রজাতির Commons ক্যাটাগরি extmetadata API (categorymembers + extmetadata compact কোয়েরি) দিয়ে যাচাই করে ১২টিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের লাইভ/প্রজাতি-নিশ্চিত আধুনিক আলোকচিত্র পাওয়া যায়। লাইসেন্স মিশ্রণ: ৯ CC BY-SA 4.0, ১ CC0 (*Barilius barila*—আধুনিক PD-self ফিল্ড ফটো, অ্যালোলিস্টে `cc0` গৃহীত), ১ CC BY 3.0 (*Chaca chaca*), ১ CC BY-SA 3.0 (*Osteogeneiosus militaris*)। নতুন ফাইল `data/seed/more-fish6.ts` (১২×৩১-কী)। বিশেষ ফাইল: *C. ramcarati* ও *S. panijus* চট্টগ্রাম বিশ্ববিদ্যালয় ইনস্টিটিউট অব মেরিন সায়েন্সেস জাদুঘরের Wikimedia Bangladesh GLAM-আপলোড (২০২৬, JIBON); *C. arel* কলকাতা ইন্ডিয়ান মিউজিয়াম-নমুনার আধুনিক আলোকচিত্র (Anup Sadi, Museums of South Asia)। কোনো Day/Hamilton/Bloch/Mintern/Achilles/Ford বই-প্লেট, Iconographia Zoologica-চিত্র, Bleeker/Herre ঐতিহাসিক স্ক্যান, Unidentified-ক্যাটাগরি, রান্না-খাদ্য-ছবি বা ভুল-চিহ্নিত ফাইল নেওয়া হয়নি।

**শৃঙ্খলা-সিদ্ধান্ত (২৫৩-তালিকা-শৃঙ্খলা):** *Toxotes chatareus*, *Scatophagus argus*, *Terapon jarbua* ও *Dichotomyctere fluviatilis* (=*Tetraodon fluviatilis*)-এর গ্রহণযোগ্য আধুনিক ছবি (এমনকি WMBD GLAM বাংলা-লেবেলযুক্ত ফাইল) থাকা সত্ত্বেও IUCN Bangladesh ২০১৫-র ২৫৩-তালিকায় অনুপস্থিতি নিশ্চিত হওয়ায় (S/T-বর্ণীয় ক্রমে নেই; জাতীয় মূল্যায়ন নেই) এদের বর্জন করা হয়—জাতীয় অবস্থার একমাত্র সূত্র হিসেবে bdfish ২৫৩-তালিকা ব্যবহারের প্রকল্প-নিয়ম বহাল। চারটিরই বাংলাদেশে উপস্থিতি FishBase চেকলিস্ট ও bdfish ২০১০ মোহনা-তালিকায় প্রমাণিত; ভবিষ্যতে সামুদ্রিক-খণ্ড-সম্প্রসারণে পুনর্বিবেচ্য।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | goldspotted-grenadier-anchovy | অলুয়া মাছ | *Coilia dussumieri* | Engraulidae (Clupeiformes) | LC / LC | CC BY-SA 4.0 (BEDO) |
| ২ | ramcarat-grenadier-anchovy | মেঘা অলুয়া | *Coilia ramcarati* | Engraulidae (Clupeiformes) | **DD** / LC | CC BY-SA 4.0 (JIBON, WMBD GLAM) |
| ৩ | chacunda-gizzard-shad | কৈ পুটি মাছ | *Anodontostoma chacunda* | Dorosomatidae (Clupeiformes) | LC / LC | CC BY-SA 4.0 (BEDO) |
| ৪ | barred-baril | বারালি মাছ | *Barilius barila* | Cyprinidae (Cypriniformes) | LC / **DD** | CC0 (Aronyo74) |
| ৫ | squarehead-catfish | চেকা মাছ | *Chaca chaca* | Chacidae (Siluriformes) | LC / **EN** | CC BY 3.0 (Dr. K. K. Jha) |
| ৬ | milkspotted-puffer | পটকা মাছ | *Chelonodon patoca* | Tetraodontidae (Tetraodontiformes) | LC / **DD** | CC BY-SA 4.0 (Totti) |
| ৭ | goldspot-mullet | পারশে বাটা | *Planiliza parsia* | Mugilidae (Mugiliformes) | **NE** / LC | CC BY-SA 4.0 (Yeamin S Riyadh) |
| ৮ | rice-paddy-eel | খারু মাছ | *Pisodonophis boro* | Ophichthidae (Anguilliformes) | LC / LC | CC BY-SA 4.0 (BEDO) |
| ৯ | scaly-hairfin-anchovy | তেলি ফাসা | *Setipinna taty* | Engraulidae (Clupeiformes) | LC / LC | CC BY-SA 4.0 (BEDO) |
| ১০ | gangetic-whiting | তুলার ডান্ডি মাছ | *Sillaginopsis panijus* | Sillaginidae (Perciformes) | **NE** / LC | CC BY-SA 4.0 (JIBON, WMBD GLAM) |
| ১১ | soldier-catfish | আপুইয়া মাছ | *Osteogeneiosus militaris* | Ariidae (Siluriformes) | LC / LC | CC BY-SA 3.0 (Staticd) |
| ১২ | largescale-tonguesole | কুকুরজিব মাছ | *Cynoglossus arel* | Cynoglossidae (Pleuronectiformes) | **DD** / LC | CC BY-SA 4.0 (Anup Sadi) |

**ফলাফল:** মাছ ১২৪ → **১৩৬** (২৫৩-লক্ষ্যের **৫৪%**; জাতীয় অবস্থা ৯ LC, ২ DD—*B. barila* (#26), *C. patoca* (#55), ১ EN—*C. chaca* (#44), প্রতিটি `conservationBn`-এ তালিকা-ক্রমিকসহ; বৈশ্বিক অবস্থা ৮ LC, ২ DD—*C. ramcarati*, *C. arel*, ২ NE—*P. parsia*, *S. panijus*, যাদের বৈশ্বিক IUCN মূল্যায়ন নেই); মোট রেকর্ড ১,৬৫৩ → **১,৬৬৫** (প্রাণী ১,৪০৪ → **১,৪১৬**); ক্রেডিট-রেজিস্টার ১,৬৩৪ → **১,৬৪৬** (যাচাইকৃত ৯৬৫ → **৯৭৭**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬৫০ → **১,৬৬২** (লোকাল ৬৯১ + দূরবর্তী ৯৭১ stats / ৯৭০ audit; ৩ বাদুড়-ফাঁক বহাল)। ১২/১২ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`, `origin: 'native'`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১৩৬/১৩৬ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম শূন্য (১৩৬/১৩৬ স্বতন্ত্র); `licenseFor()` ১২/১২ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬৪৬/verified ৯৭৭, অনিবন্ধিত প্লেসহোল্ডার ০) · eslint ০ error · `audit:images` ক্লিন (১৬৬৫/১৬৬২/৩ ফাঁক/০ missing) · `stats` ১৬৬৫।

- **নাম-দ্বৈত-প্রচলন `otherNames`-এ সংরক্ষিত:** “অলুয়া/ওলুয়া” *C. dussumieri* ও *C. ramcarati*-র যৌথ নাম (FishBase Country ComNames); “ফাসা/ফ্যাসা” *S. taty* (তেলি ফাসা) ও বিদ্যমান *S. phasa* (ফ্যাসা)-র মিল; “বামোশ” (*P. boro*) ধ্বনিগতভাবে বিদ্যমান বামুশ (*O. bengalense*)-র কাছাকাছি—ভিন্ন গণ-পরিবার; “বাটা” (*P. parsia*, পারশে বাটা) বিদ্যমান বাতা (*Labeo bata*)-র সাথে ধ্বনি-সাদৃশ্যপূর্ণ—ভিন্ন প্রজাতি; *C. patoca*-র “টেপা” নাম বিদ্যমান টেপা মাছ (*Leiodon cutcutia*)-র সাথে মিল—primary nameBn পটকা রাখা হয়েছে। সূত্র: BdFISH প্রজাতি-পাতা, Freshwater/Marine Biodiversity Portal of Bangladesh, FishBase Country ComNames, bn.bdfish.org, WMBD GLAM ফাইল-লেবেল।
- **বিষ-নিরাপত্তা নোট:** *Chelonodon patoca* (পটকা)-র ডিম-যকৃৎ-ত্বকে মারাত্মক টেট্রোডোটক্সিন—রেকর্ডের description ও conservationActions-এ খাদ্য-সতর্কতা স্পষ্টভাবে নথিভুক্ত; *O. militaris*-এর পৃষ্ঠ-বক্ষ-কাঁটা-আঘাত-সতর্কতাও লিপিবদ্ধ।
- **২৫৩-বহির্ভূত বর্জিত ৪ (ভালো মিডিয়া থাকা সত্ত্বেও, রেকর্ড নয়):** *Toxotes chatareus* (গুটি পুয়া; LC বৈশ্বিক), *Scatophagus argus* (বিশতারা/পায়রা চান্দা; LC), *Terapon jarbua* (বরগুনি/বারগুনি; LC), *Dichotomyctere fluviatilis* (পটকা/সবুজ পাফার; LC)—জাতীয় ২৫৩-মূল্যায়নে অনুপস্থিত; সামুদ্রিক-খণ্ডে পুনর্বিবেচ্য।
- **প্লেট/স্ক্যান-কারণে বর্জিত (রেকর্ড নয়):** *Ailia coila*, *Silonia silondia*, *Cirrhinus mrigala*, *Megarasbora elanga*, *Pethia phutunio*, *Mystus bleekeri*, *Canthophrys gongota*, *Hara hara*, *Hara jerdoni*, *Conta conta*, *Gagata gagata*, *Gogangra viridescens*, *Labeo boga*, *Crossocheilus latius*, *Ctenops nobilis*, *Hilsa kelee*, *Eutropiichthys murius*, *Macrognathus aculeatus* (শুধু Day/Mintern/Achilles/Iconographia প্লেট), *Laubuca laubuca* ও *Brachygobius nunus* (Commons ক্যাটাগরি শূন্য), *Amblypharyngodon microlepis* (Day প্লেট + রান্না-তরকারি-ছবি), *Pseudapocryptes elongatus* (Bloch 1801 BHL স্ক্যান—আধুনিক ফটো বলে ভুল-চিহ্নিত), *Channa stewartii* (Day/Ford PD প্লেট; ২৫৩-তালিকাতেও অনুপস্থিত), *Trypauchen vagina* (Herre 1927 PD স্ক্যান + বাজার-খাদ্য-ছবি; #250 LC)।
- **মুলতবি-নিষ্পত্তি:** ব্যাচ ৪-র দুই মুলতবি (*C. dussumieri* #61, *A. chacunda* #13) BEDO BY-SA 4.0 ফাইলসহ এই ব্যাচে গৃহীত—কোনো মুলতবি বহন করা হয়নি।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~১১৭ প্রজাতি বাকি; মাছ ব্যাচ ৬-এ একই Commons extmetadata-চুক্তি, ৩১-ফিল্ড টেমপ্লেট ও জাতীয়-অবস্থা-নথি অব্যাহত থাকবে। সম্ভাব্য অগ্রাধিকার: ২৫৩-তালিকার হুমকিগ্রস্ত অথচ মিডিয়া-অন্বেষণ-বাকি প্রজাতি (যেমন *Batasio* spp., *Schistura* spp., *Pseudolaguvia* spp.) ও মোহনা-গোষ্ঠীর অবশিষ্টাংশ। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ২৭. মাছ-সংযোজন ব্যাচ ৬ (২০২৬-১০-২৭) — ১২টি নদ/পাহাড়ি-স্রোত/মোহনা-মাছ

অটো-মোড নির্দেশে মাছ সম্প্রসারণের ষষ্ঠ ব্যাচ; প্রাধান্য দেওয়া হয় হুমকিগ্রস্ত পাহাড়ি-স্রোত-প্রজাতি (লোচ, সিসোরিড, মাউন্টেন-কার্প) ও মোহনা-গোষ্ঠীর (গোবি, মালেট, ফ্ল্যাটফিশ, ঈল, শ্যাড) সম্মিলনকে। লক্ষ্যভিত্তি অপরিবর্তিত: IUCN Red List of Bangladesh (2015)-এর **২৫৩ মিঠাপানি-প্রজাতি**; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১৩৬ (৫৪%)। ৮ স্ক্রিনিং-ঢেউয়ে ৪৫+ প্রার্থী-প্রজাতির Commons ক্যাটাগরি extmetadata API (categorymembers + imageinfo extmetadata) দিয়ে যাচাই করে ১২টিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের লাইভ/প্রজাতি-নিশ্চিত আধুনিক আলোকচিত্র পাওয়া যায়। নতুন ফাইল `data/seed/more-fish7.ts` (১২×৩১-কী)। লাইসেন্স মিশ্রণ: ৬ CC BY-SA 4.0, ৩ CC BY 3.0, ২ CC BY-SA 3.0, ১ CC BY-SA 2.0—কোনো ঐতিহাসিক প্লেট/স্ক্যান নয়। বিশেষ ফাইল: *C. cynoglossus* চট্টগ্রাম বিশ্ববিদ্যালয় ইনস্টিটিউট অব মেরিন সায়েন্সেস জাদুঘরের Wikimedia Bangladesh GLAM-আপলোড (২০২৬, JIBON); *P. bilineata*-র ছবি ভারতীয় সুন্দরবন-সংলগ্ন পশ্চিমবঙ্গে (GPS ২২.৮২, ৮৮.৩৬) ২০২৬-তে তোলা; *G. chuno* ৬০০০×৪০০০ hi-res।

**শৃঙ্খলা-সিদ্ধান্ত (উপস্থিতি-নিয়ম):** *Periophthalmus barbarus* (আটলান্টিক মাডস্কিপার)-ক্যাটাগরির আধুনিক ছবি থাকা সত্ত্বেও ট্যাক্সনটি প্রকৃতপক্ষে পশ্চিম-আফ্রিকার প্রজাতি—বাংলাদেশ-উপস্থিতি প্রমাণ নেই বলে (Garra mullya-পূর্ববর্তী নজির অনুসরণ) বর্জন; ২৫৩-তালিকার #১৭৯ নামকরণ ঐতিহাসিক ভুল-শনাক্তকরণ। তবে গোবি-গোষ্ঠীর *Awaous guamensis* (#19) ও *Gobiopterus chuno* (#96) বাংলাদেশ-উপস্থিতি-নিশ্চিত হওয়ায় গৃহীত।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | dwarf-zipper-loach | বালিচাটা | *Acanthocobitis zonalternans* (#2) | Nemacheilidae (Cypriniformes) | LC / LC | CC BY 3.0 (S. Kulabtong) |
| ২ | guam-river-goby | গুয়াম বেলে | *Awaous guamensis* (#19) | Oxudercidae (Gobiiformes) | LC / LC | CC BY-SA 4.0 (Its.masud) |
| ৩ | goonch-catfish | বাঘা আইড় | *Bagarius yarrelli* (#23) | Sisoridae (Siluriformes) | **VU** / **DD** | CC BY 3.0 (Derek Dsouza) |
| ৪ | reticulate-loach | বউ মাছ | *Botia lohachata* (#37) | Botiidae (Cypriniformes) | LC / **EN** | CC BY 3.0 (Hamid Badar Osmany) |
| ৫ | bengal-tongue-sole | কুকুর জিব মাছ | *Cynoglossus cynoglossus* (#68) | Cynoglossidae (Pleuronectiformes) | LC / LC | CC BY-SA 4.0 (JIBON, WMBD GLAM) |
| ৬ | glass-goby | চুনা বেলে | *Gobiopterus chuno* (#96) | Oxudercidae (Gobiiformes) | LC / LC | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ৭ | bigeye-ilisha | চৌখ্যা | *Ilisha megaloptera* (#108) | Pristigasteridae (Clupeiformes) | LC / LC | CC BY-SA 4.0 (BEDO) |
| ৮ | greenback-mullet | ভাঙ্গন বাটা | *Planiliza subviridis* (#129) | Mugilidae (Mugiliformes) | LC / LC | CC BY-SA 4.0 (Salil Kumar Mukherjee) |
| ৯ | doublelined-tonguesole | দুইরেখা কুকুর জিব | *Paraplagusia bilineata* (#175) | Cynoglossidae (Pleuronectiformes) | LC / LC | CC BY-SA 3.0 (Motu purkait) |
| ১০ | longfin-snake-eel | পাখনা কামিলা | *Pisodonophis cancrivorus* (#187) | Ophichthidae (Anguilliformes) | LC / LC | CC BY-SA 2.0 (Bernard Dupont) |
| ১১ | river-stone-carp | তিতারি | *Psilorhynchus sucatio* (#203) | Psilorhynchidae (Cypriniformes) | LC / **NT** | CC BY-SA 3.0 (Haplochromis/Alex Giltjes) |
| ১২ | toli-shad | চন্দনা ইলিশ | *Tenualosa toli* (#240) | Clupeidae (Clupeiformes) | **VU** / LC | CC BY-SA 4.0 (BEDO) |

**ফলাফল:** মাছ ১৩৬ → **১৪৮** (২৫৩-লক্ষ্যের **৫৮%**; জাতীয় অবস্থা ৯ LC, ১ DD—*B. yarrelli* (#23), ১ NT—*P. sucatio* (#203), ১ EN—*B. lohachata* (#37), প্রতিটি `conservationBn`-এ তালিকা-ক্রমিকসহ; বৈশ্বিক অবস্থা ১০ LC, ২ VU—*B. yarrelli* (A2d, ২০২২), *T. toli* (B2ab, ২০১৮); *G. chuno* ২০১০ DD থেকে ২০২৪-মূল্যায়নে LC-তে উন্নীত); মোট রেকর্ড ১,৬৬৫ → **১,৬৭৭** (প্রাণী ১,৪১৬ → **১,৪২৮**); ক্রেডিট-রেজিস্টার ১,৬৪৬ → **১,৬৫৮** (যাচাইকৃত ৯৭৭ → **৯৮৯**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬৬২ → **১,৬৭৪** (লোকাল ৬৯১ + দূরবর্তী ৯৮২ audit / ৯৮৩ stats; ৩ বাদুড়-ফাঁক বহাল)। ১২/১২ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`, `origin: 'native'`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১৪৮/১৪৮ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম শূন্য (১৪৮/১৪৮ স্বতন্ত্র); `licenseFor()` ১২/১২ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬৫৮/verified ৯৮৯, অনিবন্ধিত প্লেসহোল্ডার ০, speciesImageReferences ১৬৭৪) · eslint ০ error · `audit:images` ক্লিন (১৬৭৭/১৬৭৪/৩ ফাঁক/০ missing) · `stats` ১৬৭৭।

- **ডিডুপ-সংশোধন:** প্রথম-খসড়ায় *Botia lohachata*-র nameBn "রানি মাছ" রাখা হয়েছিল, যা বিদ্যমান *Botia dario*-র nameBn-এর সাথে `dedupe()`-এর name-mergeKey-তে ধাক্কা খেয়ে রেকর্ডটি বিলীন করে; BdFISH-সূত্রে (Bou, Rani, Beti) nameBn "বউ মাছ"-এ পরিবর্তন ও "রানি/রানি মাছ/বেটি" `otherNames`-এ স্থানান্তরে সংশোধিত—১২/১২ রেকর্ড রানটাইমে নিশ্চিত।
- **নাম-দ্বৈত-প্রচলন `otherNames`-এ সংরক্ষিত:** "কুকুর জিব" *C. cynoglossus* ও ব্যাচ ৫-এর *C. arel* (কুকুরজিব মাছ)-র যৌথ নাম; "পারশে/বাটা" *P. subviridis* (ভাঙ্গন বাটা) ও *P. parsia* (পারশে বাটা)-র মিল; "বেলে" *A. guamensis* (গুয়াম বেলে), বিদ্যমান *Glossogobius giuris* (বেলে) ও *G. chuno* (চুনা বেলে)-র গোত্র-মিল; "বাঘাইর" *B. bagarius* (বিদ্যমান) ও *B. yarrelli* (বাঘা আইড়)-র শ্রেণীবিন্যাস-দ্বৈততা (২০২১ গবেষণায় সমার্থক হওয়ার মত)। সূত্র: BdFISH প্রজাতি-পাতা, Freshwater/Marine Biodiversity Portal of Bangladesh, FishBase Country ComNames, bn.bdfish.org, bn.wikipedia, WMBD GLAM ফাইল-লেবেল।
- **নিরাপত্তা নোট:** *B. yarrelli*-র পৃষ্ঠ-কাঁটা গভীর-ক্ষত করতে পারে—রেকর্ডের description-এ সতর্কতা নথিভুক্ত; বিষধর নয়।
- **গুরুত্বপূর্ণ বর্জন-ঘটনা (রেকর্ড নয়):** *Batasio tengana* (#33 EN)-ক্যাটাগরির "Batasio tengana.jpg" প্রথম-দৃষ্টিতে আধুনিক মনে হলেও extmetadata-তে ১৭০০–১৮৮০-এর Iconographia Zoologica প্লেট (PD-old-70) প্রমাণিত—বর্জিত; *Bagarius yarrelli*-র দুটি PD ফাইল ১৮৯৭-এর *The Rod in India* বই-চিত্র—বাদ, ভারতের Derek Dsouza-র CC BY 3.0 আধুনিক ফটো গৃহীত; *Awaous guamensis*-র ১৮৭৬ Garrett ক্রপ-চিত্র বাদ দিয়ে বাংলাদেশি ২০২০-ফটো গৃহীত।
- **প্লেট/স্ক্যান-কারণে বর্জিত (রেকর্ড নয়):** *Batasio batasio*, *Schistura savona*, *Glyptothorax telchitta*, *Chagunius chagunio*, *Labeo pangusia*, *Barilius bendelisis*, *Gagata cenia*, *Amblyceps mangois*, *Barilius shacra*, *Securicula gora*, *Cynoglossus lingua*, *Mystus armatus*, *Hemibagrus menoda*, *Macrospinosa cuja*, *Taenioides buchanani*, *Thryssa purava*, *Pellona ditchela*, *Ilisha filigera*, *Paramugil parmatus*, *Rasbora rasbora* (শুধু Day/Mintern/Achilles/Ford/Iconographia/Haludar প্লেট)।
- **শূন্য-ক্যাটাগরি-কারণে বর্জিত:** *Schistura corica* (#222 CR), *Pseudolaguvia ribeiroi*, *Gagata youssoufi*, *Schistura scaturigina* (#224 EN), *Schistura sikmaiensis* (#225 EN), *Lepidocephalichthys irrorata*, *Salmostoma acinaces*, *Pseudambassis lala*, *Microphis deocata*, *Parapocryptes batoides*।
- **অনুপযুক্ত-মিডিয়া/উপস্থিতি-কারণে বর্জিত:** *Periophthalmus barbarus* (আটলান্টিক-প্রজাতি), *Oryzias dancena* (ট্রান্সজেনিক ল্যাব-GIF), *Anabas cobojius* (শুধু মানচিত্র-ক্যাপচার), *Trichogaster labiosa* (মানচিত্র/Ford প্লেট)।
- **মুলতবি:** *Sicamugil cascasia* (#229 VU)—BioTrek/Cal Poly-র CC BY-SA 2.5 ফাইল মাত্র ১৮০×১৩৪ পিকসেল হওয়ায় রেজোলিউশন-দুর্বলতায় স্থগিত; লাইসেন্স বৈধ, extmetadata-যাচাই সম্পন্ন—ব্যাচ ৭-এর প্রথম নিশ্চিত-প্রার্থী।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~১০৫ প্রজাতি বাকি; মাছ ব্যাচ ৭-এ একই Commons extmetadata-চুক্তি, ৩১-ফিল্ড টেমপ্লেট ও জাতীয়-অবস্থা-নথি অব্যাহত থাকবে। মুলতবি *S. cascasia* ছাড়াও সম্ভাব্য অগ্রাধিকার: হুমকিগ্রস্ত অথচ মিডিয়া-অন্বেষণ-বাকি *Batasio* spp. (ব্যাচ ৬-এ *B. tengana* শুধু-প্লেট প্রমাণিত), *Neoeucirrhichthys maydelli* (#151 CR), *Olyra longicaudata* (#156 EN), *Sisor rabdophorus* (#232 CR), *Pseudolaguvia* spp. ও মোহনা-গোষ্ঠীর অবশিষ্টাংশ। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ২৮. মাছ-সংযোজন ব্যাচ ৭ (২০২৬-১০-২৭) — ১২টি পাহাড়ি-ছড়া/নদ/মোহনা-মাছ

অটো-মোড নির্দেশে মাছ সম্প্রসারণের সপ্তম ব্যাচ; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১৪৮ (২৫৩-লক্ষ্যের ৫৮%)। প্রাধান্য পায় ব্যাচ-অগ্রাধিকার-তালিকার হুমকিগ্রস্ত প্রজাতি: *Sisor rabdophorus* (#232 CR), *Tor tor* (#244 CR), *Olyra longicaudata* (#156 EN), *Devario anomalus* (#76 EN)। ১৪ স্ক্রিনিং-ঢেউয়ে ~৭০টি প্রজাতি/গণ-ক্যাটাগরি Commons extmetadata API (categorymembers + imageinfo extmetadata) দিয়ে যাচাই করা হয়; প্রজাতি-ক্যাটাগরি শূন্য/শুধু-প্লেট হলে গণ-ক্যাটাগরি (genus-level) অনুসন্ধান করা হয়, যেভাবে *Pseudolaguvia shawi*-র hi-res ফাইল আবিষ্কৃত হয়। নতুন ফাইল `data/seed/more-fish8.ts` (১২×৩১-কী)। লাইসেন্স মিশ্রণ: ৮ CC BY-SA 4.0, ২ CC BY-SA 3.0, ১ CC BY 4.0, ১ CC0—কোনো ঐতিহাসিক প্লেট/স্ক্যান নয়।

**বিশেষ সিদ্ধান্ত ও বর্জন:** (১) *Devario anomalus*-এর একমাত্র মুক্ত-মাধ্যম PLOS ONE 2017 (Kullander et al.) গবেষণা-পত্রের সংরক্ষিত-নমুনা চিত্র—মূল .tif ব্রাউজার-অপাঠযোগ্য হওয়ায় Commons-প্রদত্ত ১২৮০px JPEG থাম্ব নিবন্ধিত (লাইসেন্স-রেকর্ড থাম্ব-ইউআরএলেই); (২) *Pseudambassis baculis* (#191 NT)-ক্যাটাগরির "Pseudambassis baculis.jpg" extmetadata-তে ১৮৭৮-এর Day/Ford Plate XV-পুনর্মুদ্রণ (PD-old-100) প্রমাণিত—বর্জিত; (৩) *Oryzias dancena*-র নতুন CC BY 2.5 ফাইল ওয়াটারমার্কযুক্ত—বর্জিত; (৪) *Labeo boga* (CR), *Glyptothorax telchitta*, *Chagunius chagunio* রি-চেকে শুধু Achilles/Griesbach/Mintern/Day প্লেট নিশ্চিত, নতুন আপলোড নেই; (৫) *Oxyurichthys microlepis*-এর CC0 ফাইল ফিলিপাইন মাছ-বাজারের তাজা-নমুনা (রান্না/প্রক্রিয়াজাত নয়), প্রজাতি-ক্যাটাগরি-নিশ্চিত; (৬) *Sicamugil cascasia* (#229 VU)-র ১৮০×১৩৪px BioTrek ফাইল মুলতবিই থাকল—এ ব্যাচেও বিকল্প মেলেনি।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | piali-jaya | পিয়ালি | *Aspidoparia jaya* (#16) | Danionidae (Cypriniformes) | LC / LC | CC BY-SA 4.0 (JIBON, WMBD GLAM CVASU) |
| ২ | grays-stone-loach | বালিতোরা | *Balitora brucei* (#24) | Balitoridae (Cypriniformes) | **NT** / **DD** | CC BY-SA 4.0 (AravindManoj) |
| ৩ | irregular-bar-devario | মঞ্জু | *Devario anomalus* (#76) | Cyprinidae (Cypriniformes) | **VU** / **EN** | CC BY 4.0 (Kullander et al., PLOS ONE) |
| ৪ | gangetic-erethistes | কাটাকুন্তি | *Erethistes pusillus* (#80) | Erethistidae (Siluriformes) | LC / LC | CC BY-SA 3.0 (Rowan Avery) |
| ৫ | crocodile-tooth-pipefish | কুনা কুমিরের খিল | *Microphis cuncalus* (#136) | Syngnathidae (Syngnathiformes) | LC / **VU** | CC BY-SA 4.0 (AravindManoj) |
| ৬ | longtail-catfish | বট শিঙ্গি | *Olyra longicaudata* (#156) | Olyridae (Siluriformes) | LC / **EN** | CC BY-SA 3.0 (F. M. Greco/FishBase) |
| ৭ | maned-goby | কেশর বাইলা | *Oxyurichthys microlepis* (#169) | Oxudercidae (Gobiiformes) | LC / LC | CC0 (Judgefloro) |
| ৮ | java-loach | পাঙ্গা | *Pangio oblonga* (#171) | Cobitidae (Cypriniformes) | LC / **DD** | CC BY-SA 4.0 (Marrabbio2) |
| ৯ | painted-catfish | কানি টেংরা | *Pseudolaguvia shawi* (#198) | Erethistidae (Siluriformes) | LC / **DD** | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ১০ | hovering-catfish | ফুটকী গুড়ি | *Rama chandramara* (#210) | Bagridae (Siluriformes) | LC / LC | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ১১ | sisor-catfish | চেনুয়া | *Sisor rabdophorus* (#232) | Sisoridae (Siluriformes) | LC / **CR** | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ১২ | tor-mahseer | মহাশুল | *Tor tor* (#244) | Cyprinidae (Cypriniformes) | **DD** / **CR** | CC BY-SA 4.0 (Schwiki) |

**ফলাফল:** মাছ ১৪৮ → **১৬০** (২৫৩-লক্ষ্যের **৬৩%**; জাতীয় অবস্থা ৪ LC—#16, #80, #169, #210; ৩ DD—#24, #171, #198; ১ VU—#136; ২ EN—#76, #156; ২ CR—#232, #244, প্রতিটি `conservationBn`-এ তালিকা-ক্রমিকসহ; বৈশ্বিক অবস্থা ৯ LC, ১ NT—*B. brucei*, ১ VU—*D. anomalus* (2010, A3d;D2), ১ DD—*Tor tor* (2018); জাতীয় CR দুই প্রজাতিই বৈশ্বিকভাবে যথাক্রমে LC ও DD, অর্থাৎ বাংলাদেশেই সংকট প্রকট); মোট রেকর্ড ১,৬৭৭ → **১,৬৮৯** (প্রাণী ১,৪২৮ → **১,৪৪০**); ক্রেডিট-রেজিস্টার ১,৬৫৮ → **১,৬৭০** (যাচাইকৃত ৯৮৯ → **১,০০১**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬৭৪ → **১,৬৮৬** (লোকাল ৬৯১ + দূরবর্তী ৯৯৪; ৩ বাদুড়-ফাঁক বহাল)। ১২/১২ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`, `origin: 'native'`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১৬০/১৬০ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম শূন্য (১৬০/১৬০ স্বতন্ত্র); `licenseFor()` ১২/১২ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬৭০/verified ১০০১, অনিবন্ধিত প্লেসহোল্ডার ০, speciesImageReferences ১৬৮৬) · eslint ০ error · `audit:images` ক্লিন (১৬৮৯/১৬৮৬/৩ ফাঁক/০ missing) · `stats` ১৬৮৯।

- **nameBn-সংঘর্ষ-এড়ানো:** *Tor tor*-এর bdfish-তালিকাভুক্ত নাম "মহাশোল" বিদ্যমান *Tor putitora*-র nameBn-এর সমান—dedupe name-mergeKey-সংঘর্ষ এড়াতে বিকল্প বানান "মহাশুল" গৃহীত (otherNames-এ মহাশোল সংরক্ষিত); *Microphis cuncalus*-এ "কুনা কুমিরের খিল" (শুধু "কুমিরের খিল" নয়—*M. deocata*-র সাথে নাম-ভাগাভাগির নথি); *Pangio oblonga*-র "পাঙ্গা" বিদ্যমান *Pangio pangia* (কলি পুঁইয়া) ও *Pangasius pangasius* (পাঙ্গাস) থেকে পৃথক—স্ক্যানে সংঘর্ষ শূন্য। বাংলা নাম-সূত্র: BdFISH প্রজাতি-পাতা, Freshwater/Marine Biodiversity Portal of Bangladesh, FishBase Country ComNames, WMBD GLAM ফাইল-লেবেল, bdfish Extinct Fishes-সংকলন।
- **বাংলাদেশ-এন্ডেমিক নজির:** *Devario anomalus* (মঞ্জু) ২০০৯ সালে কক্সবাজারের পাহাড়ি-ছড়া থেকে বর্ণিত, বিশ্বে কেবল বাংলাদেশেই নিশ্চিত—এ ব্যাচের একমাত্র এন্ডেমিক প্রজাতি; জাতীয় EN ও বৈশ্বিক VU উভয় ঝুঁকিই রেকর্ডে নথিভুক্ত।
- **পরিসংখ্যান-ভিত্তি:** বৈশ্বিক মূল্যায়ন-সাল যেখানে প্রাপ্য (Sisor/Erethistes/Rama/Pseudolaguvia/Aspidoparia ২০০৯; Microphis ২০১৬; Pangio ২০১৮; Devario ২০১০; Tor tor ২০১৮) `conservationBn`-এ লিপিবদ্ধ; জাতীয় অবস্থার একমাত্র সূত্র bdfish ২৫৩-তালিকা (IUCN Bangladesh ২০১৫)।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~৯৩ প্রজাতি বাকি; মাছ ব্যাচ ৮-এ একই Commons extmetadata-চুক্তি, ৩১-ফিল্ড টেমপ্লেট ও জাতীয়-অবস্থা-নথি অব্যাহত থাকবে। মুলতবি *Sicamugil cascasia* (#229 VU)-র উচ্চ-রেজোলিউশন বিকল্প-অন্বেষণ বহাল; সম্ভাব্য অগ্রাধিকার: *Neoeucirrhichthys maydelli* (#151 CR, শূন্য-মিডিয়া), *Schistura corica* (#222 CR), *Labeo boga* (#3 CR, শুধু-প্লেট), গণ-ক্যাটাগরি-অনুসন্ধান-যোগ্য *Glyptothorax*/*Schistura*/*Pseudolaguvia* অবশিষ্টাংশ ও DD-গোষ্ঠী। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ২৯. মাছ-সংযোজন ব্যাচ ৮ (২০২৬-১০-২৭) — ৭টি মোহনা/পাহাড়ি-স্রোত/ক্ষুদে-মাছ (সংক্ষিপ্ত ব্যাচ)

অটো-মোড নির্দেশে মাছ সম্প্রসারণের অষ্টম ব্যাচ; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১৬০ (২৫৩-লক্ষ্যের ৬৩%)। এ ব্যাচে প্রথমবারের মতো ২৫৩-তালিকার সম্পূর্ণ ঘাটতি-অংশ (পদ্ধতিগত ডিফে ১১৮ নাম; বানান-উপনাম সমন্বয়ে প্রকৃত অনুপস্থিত ~৯৩) categorymembers ও পূর্ণ-টেক্সট search API (srnamespace=6) — দুই পথেই যাচাই করা হয়; ১৫+ স্ক্রিনিং-ঢেউয়ের পর মাত্র ৭টি নতুন প্রজাতিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের আধুনিক আলোকচিত্র পাওয়া যায়। নতুন ফাইল `data/seed/more-fish9.ts` (৭×৩১-কী)। সংখ্যার জন্য দুর্বল-পরিচয়/ঐতিহাসিক ফাইল গ্রহণ না করায় ব্যাচ ১ (১১ রেকর্ড)-এর পর এটি দ্বিতীয় সংক্ষিপ্ত ব্যাচ। লাইসেন্স মিশ্রণ: ৩ CC BY-SA 4.0, ৩ CC BY 3.0, ১ CC0 — কোনো ঐতিহাসিক প্লেট/স্ক্যান নয়।

**পদ্ধতি-শিক্ষা ও বর্জন:** (১) চারটি স্ক্রিনিং-প্রার্থী (*Dermogenys pusilla*, *Devario aequipinnatus*, *Psilorhynchus balitora*, *Scartelaos histophorus*) ভিন্ন বাংলা নামে (এক থুটা, জায়ান্ট ডানিও, বালিচুরা, ওয়াকিং গবি) আগেই সাইটে আছে প্রমাণিত হয় — ডুপ-এড হয়নি; (২) *Neotropius atherinoides* (#153)-র একমাত্র নন-প্লেট ফাইল extmetadata-তে ১৮৭৭ Beavan অঙ্কন (PD-old-70) প্রমাণিত — বর্জিত; (৩) *Pethia guganio* (#183)-র CC0 ফাইল Commons-এ প্রজাতি-ক্যাটাগরিবিহীন; bn.wikipedia ও bn.bdfish-এ “মলা পুঁটি”=*Pethia guganio* নাম-মিল একাধিক স্বাধীন সূত্রে নিশ্চিত হওয়ায় স্বচ্ছ-নোটসহ গৃহীত; (৪) *Labeo boga* (#114 CR), *Schistura corica* (#222 CR), *Neoeucirrhichthys maydelli* (#151 CR)-এ কোনো আধুনিক মুক্ত-মাধ্যম নেই (শুধু Achilles/Griesbach/Mintern/Day প্লেট, জার্নাল-PDF বা শূন্য-হিট); (৫) search-উদ্ধারকৃত তিন ফাইল (*Amblyceps laticeps*, *Parapocryptes batoides*, *Salmostoma phulo*) প্রজাতি-ক্যাটাগরি শূন্য থাকলেও search API-য়ে পাওয়া যায় — প্রজাতি-ক্যাটাগরি-নির্ভরতার সীমাবদ্ধতা নথিভুক্ত।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | scalloped-perchlet | কাঁটা চান্দা | *Ambassis nalua* (#5) | Ambassidae (Mugiliformes) | LC / **DD** | CC BY-SA 4.0 (BEDO) |
| ২ | indian-torrent-catfish | ছোট্ট শিংগি | *Amblyceps laticeps* (#6) | Amblycipitidae (Siluriformes) | LC / **VU** | CC BY-SA 4.0 (Beta Mahatvaraj) |
| ৩ | morar-carplet | মোরারী | *Aspidoparia morar* (#17) | Danionidae (Cypriniformes) | LC / **VU** | CC BY 3.0 (H. B. Osmany/FishBase) |
| ৪ | hard-lipped-barb | থুইটা পুঁটি | *Osteochilus hasseltii* (#166) | Cyprinidae (Cypriniformes) | LC / **VU** | CC BY-SA 3.0 (W. Djatmiko) |
| ৫ | joli-cheowa-goby | জলি চেওয়া | *Parapocryptes batoides* (#176) | Oxudercidae (Gobiiformes) | LC / LC | CC BY-SA 4.0 (JIBON, WMBD GLAM) |
| ৬ | glass-barb | মলা পুঁটি | *Pethia guganio* (#183) | Cyprinidae (Cypriniformes) | LC / LC | CC0 (Swarno rudra) |
| ৭ | finescale-razorbelly-minnow | ফুলচেলা | *Salmostoma phulo* (#218) | Danionidae (Cypriniformes) | LC / **NT** | CC BY 3.0 (Md. R. Islam/FishBase) |

**ফলাফল:** মাছ ১৬০ → **১৬৭** (২৫৩-লক্ষ্যের **৬৬%**; জাতীয় অবস্থা LC ২—#176, #183; NT ১—#218; VU ৩—#6, #17, #166; DD ১—#5, প্রতিটি `conservationBn`-এ তালিকা-ক্রমিকসহ; বৈশ্বিক অবস্থা ৭/৭ LC); মোট রেকর্ড ১,৬৮৯ → **১,৬৯৬** (প্রাণী ১,৪৪০ → **১,৪৪৭**); ক্রেডিট-রেজিস্টার ১,৬৭০ → **১,৬৭৭** (যাচাইকৃত ১,০০১ → **১,০০৮**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬৮৬ → **১,৬৯৩** (লোকাল ৬৯১ + দূরবর্তী ১,০০০; ৩ বাদুড়-ফাঁক বহাল)। ৭/৭ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`, `origin: 'native'`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১৬৭/১৬৭ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম/nameBn শূন্য; `licenseFor()` ৭/৭ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬৭৭/verified ১০০৮, অনিবন্ধিত প্লেসহোল্ডার ০, speciesImageReferences ১৬৯৩) · eslint ০ error · `audit:images` ক্লিন (১৬৯৬/১৬৯৩/৩ ফাঁক/০ missing) · `stats` ১৬৯৬।

- **নাম-দ্বৈত-এড়ানো:** *Aspidoparia morar*-র পিওলী নাম ব্যাচ ৭-এর *A. jaya* (পিয়ালি)-র সাথে সাদৃশ্যপূর্ণ হওয়ায় প্রাথমিক nameBn “মোরারী” (otherNames-এ পিওলী সংরক্ষিত); *Parapocryptes batoides*-র নাম bn.wikipedia নিবন্ধ-শিরোনাম ও GLAM ফাইল-লেবল থেকে “জলি চেওয়া”। বাংলা নাম-সূত্র: BdFISH প্রজাতি-পাতা/Extinct Fishes-সংকলন, Freshwater/Marine Biodiversity Portal of Bangladesh, FishBase Country ComNames, bn.wikipedia, WMBD GLAM ফাইল-লেবেল।
- **ব্যাচ-আকারের সততা:** ২৫৩-তালিকার অবশিষ্ট ~৮৬ প্রজাতির মধ্যে সাইটে অনুপস্থিত ও অযাচাই প্রজাতিগুলো এখন পর্যন্ত প্রাপ্ত সব মুক্ত-মাধ্যমে ঐতিহাসিক প্লেট/স্ক্যান/মানচিত্র/ওয়াটারমার্ক/শূন্য-হিট প্রমাণিত; পরবর্তী ব্যাচের পূর্বে নতুন Commons আপলোড ছাড়া সংযোজন-সম্ভাবনা সীমিত — এটি আবাস-প্রতিনিধিত্বের তথ্য-ঘাটতি, পদ্ধতিগত ব্যর্থতা নয়।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~৮৬ প্রজাতি বাকি। *Sicamugil cascasia* (#229 VU, ১৮০px) মুলতবি বহাল; CR-ত্রয়ী (*maydelli* #151, *corica* #222, *boga* #114) নতুন আপলোডের অপেক্ষায়। বিকল্প পথ: WMBD GLAM/গবেষণা-পত্র (PLOS ONE/Zootaxa)-ভিত্তিক নতুন মুক্ত-মাধ্যম পরিবীক্ষণ ও সামুদ্রিক-মাছ (৪০২ প্রজাতি)-খণ্ডের সম্প্রসারণ-বিবেচনা। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ৩০. মাছ-সংযোজন ব্যাচ ৯ (২০২৬-১০-২৭) — ৬টি মোহনা/নদ/অ্যাকোয়ারিয়াম-মাছ (সংক্ষিপ্ত ব্যাচ)

অটো-মোড নির্দেশে মাছ সম্প্রসারণের নবম ব্যাচ; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১৬৭ (২৫৩-লক্ষ্যের ৬৬%)। ব্যাচ ৮-এর পদ্ধতিগত ডিফের ওপর ভিত্তি করে অবশিষ্ট অনুপস্থিত প্রজাতিগুলো আবার দুই পথে (categorymembers + পূর্ণ-টেক্সট search API) যাচাই করা হয়; GLAM at CVASU ক্যাটাগরির সম্পূর্ণ দুই পেজও পরীক্ষা করা হয় (নতুন ২৫৩-প্রজাতি পাওয়া যায়নি — শুধু পূর্ববর্তী ব্যাচের প্রজাতি, নৌকা, চিংড়ি-কাঁকড়া ও অ্যানাটমি-নমুনা)। ১৫+ স্ক্রিনিং-ঢেউয়ের পর মাত্র ৬টি নতুন প্রজাতিতে গ্রহণযোগ্য মুক্ত লাইসেন্স-মাধ্যম পাওয়া যায়। নতুন ফাইল `data/seed/more-fish10.ts` (৬×৩১-কী)। লাইসেন্স মিশ্রণ: ২ CC BY 4.0, ১ CC BY-SA 4.0, ২ CC BY 3.0, ১ CC BY-SA 3.0 — কোনো ঐতিহাসিক প্লেট/স্ক্যান নয়।

**পদ্ধতি-শিক্ষা ও বর্জন:** (১) তিন স্ক্রিনিং-প্রার্থী (*Acanthocobitis zonalternans*, *Ilisha megaloptera*, *Setipinna taty*) আধুনিক ফাইল পেলেও দেখা যায় লেগ্যাসি বীজে ভিন্ন স্লাগে (dwarf-zipper-loach, bigeye-ilisha, scaly-hairfin-anchovy) আগেই সাইটে আছে — ডুপ-এড হয়নি; (২) *Pseudapocryptes elongatus* (#193)-এর ভিয়েতনামি CC BY-SA 4.0 ফাইল রান্না-ক্যাটাগরি (“Fish in Viet cuisine”)-বদ্ধ ও প্রজাতি-ক্যাটাগরিবিহীন — বর্জিত; (৩) *Paraplagusia bilineata* (#175)-র ২০২৬-এর তিনটি CC BY-SA 3.0 ফাইলই শুধু মাথা/পেটের আংশিক-দৃশ্য, কোনো পূর্ণ-দেহ ছবি নেই — বর্জিত; (৪) *Chela laubuca*-র চিত্র ব্যাচ ৭-এর *Devario anomalus*-নজিরে Kullander et al. ZooKeys 2018 (doi:10.3897/zookeys.742.22510) পত্রের ঢাকা-নমুনাসংবলিত (NRM 67317) CC BY 4.0 বৈজ্ঞানিক চিত্র; (৫) nameBn-সংঘর্ষ এড়াতে *Hara hara*-তে কাটাকুন্তি (ব্যাচ ৭-এর *Erethistes pusillus* কর্তৃক গৃহীত)-র বদলে bdfish-তালিকাভুক্ত চাকামাকা নেওয়া হয়; *Trichogaster labiosus*-এর স্থানীয় নাম ঠোঁটমোটা খলিশা (Thontmota Khalisha, BSFMSTU etymology review 2017)।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | indian-glass-barb | লাউবুচা | *Chela laubuca* (#54) | Danionidae (Cypriniformes) | LC / LC | CC BY 4.0 (Kullander et al., ZooKeys) |
| ২ | kosi-hara | চাকামাকা | *Hara hara* (#100) | Erethistidae (Siluriformes) | LC / LC | CC BY 4.0 (R. Gassah/iNaturalist) |
| ৩ | indian-freshwater-pipefish | কুমিরের খিল | *Ichthyocampus carce* (#106) | Syngnathidae (Syngnathiformes) | LC / **NT** | CC BY-SA 4.0 (AravindManoj) |
| ৪ | cuja-bola | কুঁজো পোয়া | *Macrospinosa cuja* (#133) | Sciaenidae (Acanthuriformes) | **DD** / **NT** | CC BY 3.0 (M. R. Parvej/FishBase) |
| ৫ | thick-lipped-gourami | ঠোঁটমোটা খলিশা | *Trichogaster labiosus* (#247) | Osphronemidae (Anabantiformes) | LC / LC | CC BY-SA 3.0 (O. Gorski) |
| ৬ | burrowing-goby | সাদা চেউয়া | *Trypauchen vagina* (#250) | Oxudercidae (Gobiiformes) | LC / LC | CC BY 3.0 (H. B. Osmany/FishBase) |

**ফলাফল:** মাছ ১৬৭ → **১৭৩** (২৫৩-লক্ষ্যের **৬৮%**; জাতীয় অবস্থা LC ৪—#54, #100, #247, #250; NT ২—#106, #133, প্রতিটি `conservationBn`-এ তালিকা-ক্রমিকসহ; বৈশ্বিক অবস্থা LC ৫, DD ১—*M. cuja* IUCN 2020); মোট রেকর্ড ১,৬৯৬ → **১,৭০২** (প্রাণী ১,৪৪৭ → **১,৪৫৩**); ক্রেডিট-রেজিস্টার ১,৬৭৭ → **১,৬৮৩** (যাচাইকৃত ১,০০৮ → **১,০১৪**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬৯৩ → **১,৬৯৯** (লোকাল ৬৯১ + দূরবর্তী ১,০০৬; ৩ বাদুড়-ফাঁক বহাল)। ৬/৬ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`, `origin: 'native'`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১৭৩/১৭৩ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম/nameBn শূন্য; `licenseFor()` ৬/৬ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬৮৩/verified ১০১৪, অনিবন্ধিত প্লেসহোল্ডার ০, speciesImageReferences ১৬৯৯) · eslint ০ error · `audit:images` ক্লিন (১৭০২/১৬৯৯/৩ ফাঁক/০ missing) · `stats` ১৭০২।

- **বাংলা নাম-সূত্র:** BdFISH প্রজাতি-পাতা (Kosi hara, Freshwater pipefish, Bigeye ilisha, Scaly hairfin anchovy), Marine/Freshwater Biodiversity Portal of Bangladesh, FishBase Country ComNames (লাউবুচা/চেপ চেলা, সাদা চেউয়া), bn.wikipedia (বড় চোখা প্রকরণ), রোদ্দুর তালিকা (কুঁজো পোয়া), BSFMSTU etymology review 2017 (Thontmota Khalisha)।
- **ব্যাচ-আকারের সততা:** টানা দ্বিতীয় সংক্ষিপ্ত ব্যাচ (৭ ও ৬) প্রমাণ করে ২৫৩-তালিকার অবশিষ্ট ~৮০ প্রজাতির মুক্ত-আধুনিক মাধ্যম Commons-এ কার্যত নিঃশেষিত; পরবর্তী অগ্রগতি নতুন আপলোড (বিশেষত WMBD GLAM/গবেষণা-পত্র)-নির্ভর, অথবা সামুদ্রিক-মাছ (৪০২ প্রজাতি) খণ্ডে সম্প্রসারণ সাপেক্ষ।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~৮০ প্রজাতি বাকি। *Sicamugil cascasia* (#229 VU, ১৮০px) মুলতবি বহাল; CR-ত্রয়ী (*maydelli* #151, *corica* #222, *boga* #114) নতুন আপলোডের অপেক্ষায়। নতুন WMBD GLAM/iNaturalist/ZooKeys-PLOS ONE আপলোড পরিবীক্ষণ ও সামুদ্রিক-মাছ-খণ্ডের সম্প্রসারণ-বিবেচনা জোরদার। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ৩১. মাছ-সংযোজন ব্যাচ ১০ (২০২৬-১০-২৭) — ১টি মোহনা/ধানক্ষেত রাইসফিশ (তৃতীয় সংক্ষিপ্ত ব্যাচ)

অটো-মোড নির্দেশে মাছ সম্প্রসারণের দশম ব্যাচ; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১৭৩ (২৫৩-লক্ষ্যের ৬৮%)। ব্যাচ ৯-এর পদ্ধতিগত ডিফের ওপর ভিত্তি করে অবশিষ্ট অনুপস্থিত প্রজাতিগুলো আবার দুই পথে (পূর্ণ-টেক্সট search API + প্রতিশব্দ-নাম) যাচাই করা হয়; ৭টি স্ক্রিনিং-ঢেউয়ে ৪০+ নাম-অনুসন্ধানের পর মাত্র ১টি নতুন প্রজাতিতে গ্রহণযোগ্য মুক্ত লাইসেন্স-মাধ্যম পাওয়া যায়। নতুন ফাইল `data/seed/more-fish11.ts` (১×৩১-কী)। লাইসেন্স: ১ CC BY 2.5 — কোনো ঐতিহাসিক প্লেট/স্ক্যান নয়।

**পদ্ধতি-শিক্ষা ও বর্জন:** (১) *Gymnostomus ariza*-র ২০২২ সালের CC BY-SA 4.0 আধুনিক আলোকচিত্র (Beta Mahatvaraj) প্রথমে গৃহীত-প্রার্থী মনে হলেও দেখা যায় ব্যাচ ২-এর `more-fish3.ts`-এ slug `ariza-carp` (nameBn ভাঙনা মাছ, বৈজ্ঞানিক-নাম *Cirrhinus ariza*)-এ ঠিক একই ফাইলসহ প্রজাতিটি (#112 VU) আগেই সাইটে আছে — ডুপ-এড হয়নি (লেগ্যাসি-প্রতিশব্দ-শৃঙ্খল; ২৫৩-তালিকার Labeo ariza/Gymnostomus ariza/Cirrhinus ariza একই ট্যাক্সন); (২) *Oryzias dancena*-র দুটি নতুন CC BY 2.5 ফাইলের একটিতে (Adult male, pageid 177371020) Commons ক্যাটাগরি “Images with watermarks” থাকায় বর্জিত; অপর ফাইলটি (Illustration, pageid 177371019) ওয়াটারমার্ক-বিহীন এবং Takehana, Naruse, Sakaizumi ও Chen-এর medaka ফাইলোজিনি গবেষণাপত্রের আধুনিক বৈজ্ঞানিক-চিত্র — ব্যাচ ৭ (PLOS ONE *Devario*) ও ব্যাচ ৯ (ZooKeys *Chela*)-এর জার্নাল-চিত্র নজিরে গৃহীত; (৩) “Bain fish.jpg” (CC BY-SA 4.0, 2017) “Unidentified Actinopterygii”-ক্যাটাগরিভুক্ত ও প্রজাতি-নির্ণয়হীন — বর্জিত; (৪) *Ailia coila/punctata*, *Schistura savona*, *Gagata cenia*, *Nangra bucculenta/ornata*, *Salmostoma sardinella*, *Puntius puntio*, *Mystus armatus*, *Silonia silondia*, *Eutropiichthys murius*, *Pethia phutunio*, *Thryssa purava*, *Apocryptes bato*, *Taenioides buchanani*, *Chagunius chagunio*, *Crossocheilus latius*, *Megarasbora elanga*, *Macrognathus aculeatus*, *Nematalosa nasus*, *Rasbora rasbora*, *Odontamblyopus rubicundus*, *Canthophrys gongota*, *Pseudambassis lala*, *Securicula gora*, *Gogangra viridescens*, *Salmostoma acinaces*, *Cynoglossus lingua* প্রভৃতিতে শুধু Day/Mintern/Achilles/Ford/Suzini প্লেট, Iconographia Zoologica-স্ক্যান, ১৮০৭–১৯৩৬ বই-চিত্র বা জার্নাল-PDF; (৫) *Gagata youssoufi*, *Badis chittagongis*, *Danio annulosus*, *Pseudolaguvia inornata*, *Psilorhynchus rahmani*, *Lepidocephalichthys irrorata*, *Awaous grammepomus* — শূন্য-হিট; (৬) *Brachygobius nunus*, *Butis melanostigma*, *Oryzias melastigma*, *Hara jerdoni*, *Microphis deocata*, *Esomus lineatus*, *Oryzias carnaticus*, *Amblypharyngodon microlepis* — PDF/ভিন্ন-প্রজাতি/প্লেট; (৭) *Sicamugil cascasia* (#229 VU)-তে নতুন হাই-রেজ ফাইল আসেনি — ১৮০px BioTrek মুলতবি বহাল।

| # | স্লাগ | বাংলা নাম | বৈজ্ঞানিক নাম | গোত্র (বর্গ) | বৈশ্বিক/জাতীয় IUCN | লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | indian-ricefish | চক্কুনি | *Oryzias dancena* (#163) | Adrianichthyidae (Beloniformes) | LC / **DD** | CC BY 2.5 (Takehana, Naruse, Sakaizumi & Chen) |

**ফলাফল:** মাছ ১৭৩ → **১৭৪** (২৫৩-লক্ষ্যের **৬৯%**; জাতীয় অবস্থা DD ১—#163, `conservationBn`-এ তালিকা-ক্রমিকসহ; বৈশ্বিক LC ১—IUCN 2019, e.T172326A60603626); মোট রেকর্ড ১,৭০২ → **১,৭০৩** (প্রাণী ১,৪৫৩ → **১,৪৫৪**); ক্রেডিট-রেজিস্টার ১,৬৮৩ → **১,৬৮৪** (যাচাইকৃত ১,০১৪ → **১,০১৫**; বাকি ৬৬৯ অপরিবর্তিত); ছবি ১,৬৯৯ → **১,৭০০** (লোকাল ৬৯১ + দূরবর্তী ১,০০৭; ৩ বাদুড়-ফাঁক বহাল)। ১/১ রেকর্ডে ৩১টি ফিল্ড, group `machh`, class `Actinopterygii`, `origin: 'native'`; seed-চিহ্নিতকরণ `dataStatus: 'partial'` হলে `verifySpeciesRecord` পাইপলাইনে রানটাইমে verified-এ পদোন্নত হয় (machh ১৭৪/১৭৪ verified)। ডুপ স্লগ/বৈজ্ঞানিক-নাম/nameBn শূন্য; `licenseFor()` ১/১ স্লগে verified-মিল দেয়। দ্বার-ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি-স্ক্রিপ্ট problems=[] (ক্রেডিট ১৬৮৪/verified ১০১৫, অনিবন্ধিত প্লেসহোল্ডার ০, speciesImageReferences ১৭০০) · eslint ০ error · `audit:images` ক্লিন (১৭০৩/১৭০০/৩ ফাঁক/০ missing) · `stats` ১৭০৩।

- **বাংলা নাম-সূত্র:** Freshwater Biodiversity Portal of Bangladesh (Kanpona কানপোনা/Bechi বেচি/Chokkuni চক্কুনি), BdFISH ২৫৩-তালিকা (#163 DD), ETYFish (dancena = ভারতীয় স্থানীয় নাম Dhankhena-র ল্যাটিন রূপ), FishBase/GBIF প্রতিশব্দ-তালিকা।
- **নাম-সতর্কতা:** চক্কুনি/কানপোনা/বেচি স্থানীয় নামগুলো *Aplocheilus panchax* (ব্যাচ ২, slug blue-panchax, Aplocheilidae)-র সাথেও যৌথভাবে প্রচলিত — প্রজাতি দুটি ভিন্ন গণ-পরিবারের; nameBn হিসেবে পোর্টাল-বানান “চক্কুনি” নেওয়া হয়েছে (বিদ্যমান otherNames-বানান “চৌক্কুনি” থেকে পৃথক), বিকল্প নাম otherNames-এ সংরক্ষিত।
- **ব্যাচ-আকারের সততা:** টানা তৃতীয় সংক্ষিপ্ত ব্যাচ (৭, ৬, ১) প্রমাণ করে ২৫৩-তালিকার অবশিষ্ট ~৭৯ প্রজাতির মুক্ত-আধুনিক মাধ্যম Commons-ে কার্যত নিঃশেষিত; পরবর্তী অগ্রগতি নতুন আপলোড (বিশেষত WMBD GLAM/গবেষণা-পত্র)-নির্ভর, অথবা সামুদ্রিক-মাছ (৪০২ প্রজাতি) খণ্ডে সম্প্রসারণ সাপেক্ষ।

**পরবর্তী:** ২৫৩-লক্ষ্যে আরও ~৭৯ প্রজাতি বাকি। *Sicamugil cascasia* (#229 VU, ১৮০px) মুলতবি বহাল; CR-ত্রয়ী (*maydelli* #151, *corica* #222, *boga* #114) নতুন আপলোডের অপেক্ষায়। নতুন WMBD GLAM/iNaturalist/ZooKeys-PLOS ONE আপলোড পরিবীক্ষণ ও সামুদ্রিক-মাছ-খণ্ডের সম্প্রসারণ-বিবেচনা জোরদার। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকে।

## ৩২. মাছ-স্ক্রিনিং ব্যাচ ১১ (২০২৬-১০-২৮) — শূন্য-সংযোজন ব্যাচ (Commons মাধ্যম-সীমা পুনঃনিশ্চিত)

অটো-মোড নির্দেশে একাদশ ব্যাচ; ব্যাচ ১০-শেষে সাইটে মাছ ১৭৪ (২৫৩-লক্ষ্যের ৬৯%)। এবার প্রথমে bdfish ২৫৩-তালিকা (চার খণ্ড) পুনরুদ্ধার করে সাইটের ১৭৪ মাছ-রেকর্ডের বিপরীতে প্রতিশব্দ-সচেতন ডিফ নেওয়া হয়: লেগ্যাসি প্রতিশব্দ-শৃঙ্খল (Channa punctata/punctatus, Dermogenys pusilla/pusillus, Cirrhinus/Labeo/Gymnostomus ariza, Pseudeutropius/Neotropius atherinoides, Parambassis/Parambasis ranga, Polynemus/Polynemous paradiseus, Salmostoma/Salmophasia bacaila) বাদ দিয়ে **৯৯টি প্রজাতি প্রকৃত-অনুপস্থিত** নিশ্চিত হয় (১৫৪/২৫৩ আচ্ছাদিত; সাইটের অবশিষ্ট ২০ মাছ-রেকর্ড ২৫৩-তালিকার বাইরের মেরিন/অন্য প্রজাতি)। ৮টি স্ক্রিনিং-ঢেউয়ে ৪৭টি Commons পূর্ণ-টেক্সট অনুসন্ধান-আহ্বান (প্রতিশব্দ-নামসহ; কয়েকটি প্রজাতি একাধিক নামে পুনর্পর্যবীক্ষিত) চালানো হয়; **একটিও গ্রহণযোগ্য নতুন মুক্ত-লাইসেন্স মাধ্যম পাওয়া যায়নি** — তাই কোনো `more-fish12.ts`/ক্রেডিট-এন্ট্রি তৈরি হয়নি; সংখ্যা অপরিবর্তিত (১,৭০৩ রেকর্ড, মাছ ১৭৪, ছবি ১,৭০০, ক্রেডিট ১,৬৮৪/verified ১,০১৫)। দুর্বল ফাইল গ্রহণ নিষিদ্ধ বিধায় সৎ শূন্য-সংযোজন নথিই এ ব্যাচের ফসল।

**৯৯ প্রজাতির বর্জন-শ্রেণিবিন্যাস (ব্যাচ ৮–১১-এর সম্মিলিত স্ক্রিনিং-প্রমাণ):**

- **ক শ্রেণি — Commons-এ শূন্য-হিট (১৪):** #18 *Awaous grammepomus* (VU), #21 *Badis chittagongis*, #70 *Danio annulosus*, #83 *Eugnathogobius oligactis* (VU), #88 *Gagata youssoufi*, #127 *Lepidocephalichthys irrorata* (VU), #147 *Nangra bucculenta*, #149 *Nangra ornata*, #151 *Neoeucirrhichthys maydelli* (**CR**), #195 *Pseudolaguvia inornata*, #196 *P. muricata*, #197 *P. ribeiroi*, #202 *Psilorhynchus rahmani*, #225 *Schistura sikmaiensis* (EN)।
- **খ শ্রেণি — শুধু ঐতিহাসিক প্লেট/Iconographia/বই-স্ক্যান (৬০):** Day/Mintern/Achilles/Ford/Griesbach/Suzini/Beavan/Bloch/Haludar/Thomas (১৮৯৭)/EB1911/FMIB/BHL-উৎস; আধুনিক CC0/PD-self ফিল্ড ফটো বা CC BY জার্নাল-চিত্র নেই। এর মধ্যে #114 *Labeo boga* (**CR**; Griesbach/Achilles/Iconographia + Bloch-এর Oeconomische Naturgeschichte Flickr-হিউরিস্টিক), #222 *Schistura corica* (**CR**; Day 156), EN-প্রজাতি সাতটি — #28 *Barilius bendelisis*, #30 *B. tileo*, #31 *B. vagra*, #33 *Batasio tengana*, #65 *Crossocheilus latius*, #121 *Labeo pangusia*, #135 *Megarasbora elanga*; VU তিনটি — #45 *Chagunius chagunio*, #94 *Glyptothorax telchitta*, #115 *Labeo boggut*।
- **গ শ্রেণি — শুধু জার্নাল/বই-PDF, কোনো চিত্র-ফাইল নেই (১০):** #36 *Botia dayi* (EN), #39 *Brachygobius nunus*, #73 *Dermogenus brachynotopterus*, #79 *Eleotris lutea*, #89 *Garra annandalei* (EN), #93 *Glyptothorax indicus*, #124 *Lepidocephalichthys annadalei* (VU), #137 *Microphis deocata* (VU), #201 *Psilorhynchus gracilis*, #224 *Schistura scaturigina* (EN)।
- **ঘ শ্রেণি — বিশেষ-বর্জন (১৫):** #1 *Acanthocobitis botia* (“Acanthocobitis sp., possibly undescribed” অনিশ্চিত-পরিচয় ফাইল + Beavan 1877); #10 *Anabas cobojius* (মানচিত্র + Tennent 1861 স্কেচ); #32 *Batasio batasio* (কলকাতা বাজারের “Mystus fishes” CC BY-SA ফটো দুটি গণ-পর্যায়ের, প্রজাতি-ট্যাগবিহীন); #41 *Butis melanostigma* (শুধু *B. butis*-ফাইল); #66 *Ctenops nobilis* (Day/Ford + মানচিত্র); #82 *Esomus lineatus* (শুধু *E. danricus*-ফাইল); #104 *Hilsa kelee* (Achilles + Bloch + ইলিশ-বাজার ফটো); #123 *Laubuca brahmaputraensis* (শুধু *L. laubuca*-ফাইল); #130 *Macrognathus aculeatus* (“Bain fish.jpg” Unidentified Actinopterygii); #162 *Oryzias carnaticus* (ভুল-নামাঙ্কিত *Aplocheilus panchax* ফাইল); #174 *Paramugil parmatus* (সম্পর্কহীন Ford প্লেট); #179 *Periophthalmus barbarous* (আটলান্টিক-ভুল-লেবেল স্থায়ী বর্জন); #193 *Pseudapocryptes elongatus* (রান্না-ক্যাটাগরি-বদ্ধ, ব্যাচ ৯); #217 *Salmostoma argentea* (শুধু *S. acinaces*-প্রতিশব্দ প্লেট); #229 *Sicamugil cascasia* (VU; শুধু ১৮০px BioTrek CC BY-SA 2.5 — হাই-রেজ মুলতবি বহাল)।

**অগ্রাধিকার-প্রজাতি পুনর্পর্যবীক্ষণ:** CR-ত্রয়ী (#151 *maydelli*, #222 *corica*, #114 *boga*)-তে নতুন আপলোড নেই; #229 *cascasia*-র হাই-রেজ বিকল্প আসেনি; ব্যাচ ১০-এর গৃহীত *Oryzias dancena*-পথ (CC BY জার্নাল-চিত্র) ছাড়া অন্য কোনো প্রজাতিতে PLOS ONE/ZooKeys/PLOS-ধরনের উন্মুক্ত-প্রবেশ চিত্র পাওয়া যায়নি।

**একমাত্র বাকি প্রার্থীর extmetadata-নিষ্পত্তি:** ঢেউ ১/৫-এ পুনরাবিষ্কৃত `File:Batasio tengana.jpg` (Commons pageid 79780418, 807×605, “Macrones tengana”) লাইসেন্স-ট্যাগে Public domain হলেও extmetadata-তে ক্যাটাগরি `PD-old-70-expired`/`PD-Art`/`Iconographia Zoologica`/University of Amsterdam Special Collections (GWToolset ব্যাচ-আপলোড), তারিখ ১৭০০–১৮৮০, ক্রেডিট Iconographia Zoologica — অর্থাৎ আধুনিক PD-self ফিল্ড ফটো নয়, ঐতিহাসিক PD বই-প্লেট; স্থায়ী বিধি অনুযায়ী **বর্জিত** (#33 *Batasio tengana*, EN)। ফলে ব্যাচ ১১-এ গ্রহণযোগ্য মাধ্যম শূন্যই থাকল।

**৯৯ প্রজাতির IUCN বাংলাদেশ ২০১৫-স্ট্যাটাস বিন্যাস (bdfish তালিকা থেকে যন্ত্র-গণিত, ২৫৩-যোগফলের সাথে পূর্ণ মিল):** ৩ CR (#114 *Labeo boga*, #151 *Neoeucirrhichthys maydelli*, #222 *Schistura corica*) · ১১ EN · ৯ VU · ১১ NT · ২৯ DD · ৩৬ LC — হুমকিগ্রস্ত (CR+EN+VU) মোট ২৩। ২৫৩-প্রেক্ষাপটে সাইটে-থাকা ১৫৪ প্রজাতির বিন্যাস ঠিক এর পূরক: ৬ CR/১৯ EN/১৬ VU/১৬ NT/১১ DD/৮৬ LC (মোট ২৫৩: ৯/৩০/২৫/২৭/৪০/১২২)।

**সিদ্ধান্ত ও পরবর্তী কৌশল:** টানা চারটি ক্ষুদ্র/শূন্য ব্যাচ (৭ → ৬ → ১ → ০) প্রমাণ করে ২৫৩ মিঠাপানি-তালিকার অবশিষ্ট ৯৯ প্রজাতির মুক্ত-আধুনিক মাধ্যম Commons-ে কার্যত নিঃশেষিত; এদের অগ্রগতি এখন সম্পূর্ণ নতুন আপলোড (WMBD GLAM CVASU-পরবর্তী ব্যাচ, iNaturalist, নতুন জার্নাল-পত্র)-নির্ভর। কার্যকর বিকল্প পথ: (ক) সামুদ্রিক মাছ (প্রায় ৪০২ প্রজাতি) খণ্ডে নতুন সম্প্রসারণ-কর্মসূচি — যেখানে মুক্ত-মাধ্যমের প্রাচুর্য সম্ভাব্য বেশি; (খ) ৯৯-তালিকার নতুন-আপলোড পরিবীক্ষণ (বিশেষত ৩ CR, ১১ EN, ৯ VU)। ছবিহীন/প্রত্যাখ্যাত ট্যাক্সা কাঁচা রেকর্ড নয়, বর্জন-নথিতেই থাকবে।

**পরিশিষ্ট — ৯৯ প্রকৃত-অনুপস্থিত প্রজাতি (২৫৩-ক্রমিক):** 1 *Acanthocobitis botia*, 3 *Ailia coila*, 4 *A. punctata*, 7 *Amblyceps mangois*, 8 *Amblypharyngodon microlepis*, 10 *Anabas cobojius*, 18 *Awaous grammepomus*, 21 *Badis chittagongis*, 25 *Bangana dero*, 28 *Barilius bendelisis*, 29 *B. shacra*, 30 *B. tileo*, 31 *B. vagra*, 32 *Batasio batasio*, 33 *B. tengana*, 36 *Botia dayi*, 39 *Brachygobius nunus*, 41 *Butis melanostigma*, 42 *Canthophrys gongota*, 45 *Chagunius chagunio*, 63 *Conta conta*, 65 *Crossocheilus latius*, 66 *Ctenops nobilis*, 69 *Cynoglossus lingua*, 70 *Danio annulosus*, 73 *Dermogenus brachynotopterus*, 79 *Eleotris lutea*, 82 *Esomus lineatus*, 83 *Eugnathogobius oligactis*, 84 *Eutropiichthys murius*, 86 *Gagata cenia*, 87 *G. gagata*, 88 *G. youssoufi*, 89 *Garra annandalei*, 92 *Glyptothorax cavia*, 93 *G. indicus*, 94 *G. telchitta*, 95 *Gobiopsis macrostoma*, 97 *Gogangra viridescens*, 101 *Hara jerdoni*, 102 *Hemibagrus menoda*, 104 *Hilsa kelee*, 105 *Hyporhamphus limbatus*, 107 *Ilisha filigera*, 109 *I. melastoma*, 110 *Johnius coitor*, 111 *Labeo angra*, 114 *L. boga*, 115 *L. boggut*, 117 *L. dyocheilus*, 118 *L. fimbriatus*, 121 *L. pangusia*, 123 *Laubuca brahmaputraensis*, 124 *Lepidocephalichthys annadalei*, 127 *L. irrorata*, 130 *Macrognathus aculeatus*, 135 *Megarasbora elanga*, 137 *Microphis deocata*, 140 *Mystus armatus*, 141 *M. bleekeri*, 147 *Nangra bucculenta*, 148 *N. nangra*, 149 *N. ornata*, 150 *Nematalosa nasus*, 151 *Neoeucirrhichthys maydelli*, 155 *Odontamblyopus rubicundus*, 162 *Oryzias carnaticus*, 164 *O. melastigma*, 174 *Paramugil parmatus*, 177 *Pellona ditchela*, 179 *Periophthalmus barbarous*, 180 *P. koelreuteri*, 184 *Pethia phutunio*, 191 *Pseudambassis baculis*, 192 *P. lala*, 193 *Pseudapocryptes elongatus*, 194 *Pseudecheneis sulcata*, 195 *Pseudolaguvia inornata*, 196 *P. muricata*, 197 *P. ribeiroi*, 201 *Psilorhynchus gracilis*, 202 *P. rahmani*, 205 *Puntius puntio*, 209 *Raiamas guttatus*, 212 *Rasbora rasbora*, 216 *Salmostoma acinaces*, 217 *S. argentea*, 219 *S. sardinella*, 221 *Schistura beavani*, 222 *S. corica*, 223 *S. savona*, 224 *S. scaturigina*, 225 *S. sikmaiensis*, 226 *Securicula gora*, 229 *Sicamugil cascasia*, 231 *Silonia silondia*, 237 *Taenioides buchanani*, 242 *Thryssa purava*, 253 *Zenarchopterus ectuntio*।

**দ্বার-ফলাফল:** কোনো সিড/ক্রেডিট/কোড পরিবর্তন না হওয়ায় ব্যাচ ১০-এর সব দ্বার অপরিবর্তিত-সবুজ; এ ব্যাচে পুনর্চালিত ফলাফল: `tsc --noEmit` ০ error · ২৬/২৬ ইউনিট টেস্ট · চুক্তি problems=[] (ক্রেডিট ১,৬৮৪/verified ১,০১৫, speciesImageReferences ১,৭০০) · eslint ০ error · `audit:images` ১,৭০৩/১,৭০০/৩ নথিভুক্ত ফাঁক/০ missing · `stats` মোট ১,৭০৩ (মাছ ১৭৪/১৭৪ verified)।

## ৩৩. সামুদ্রিক মাছ সম্প্রসারণ ব্যাচ ১২ (২০২৬-১০-২৮) — ১৪টি সামুদ্রিক/মোহনা মাছ (কর্মসূচির সূচনা ব্যাচ)

**প্রেক্ষাপট:** ব্যাচ ১১ (§৩২)-এ মিঠাপানির ২৫৩-তালিকার অবশিষ্ট ৯৯ প্রজাতির Commons মুক্ত-মাধ্যম কার্যত নিঃশেষিত প্রমাণিত হলে ব্যবহারকারীর সিদ্ধান্তে (বিকল্প-ক) সামুদ্রিক মাছ কর্মসূচি শুরু। **প্রামাণিক ভিত্তি:** Habib & Islam (2021) *An updated checklist of Marine Fishes of Bangladesh*, Bangladesh J. Fish. 32(2): 357–367, DOI 10.52168/bjf.2020.32.40 — **৭৪০ প্রজাতি** (৩৮৯ গণ, ১৪৫ পরিবার, ৩০ বর্গ; ৮১ কার্টিলেজ-মাছ + ৬৫৯ অস্থিমাছ; বৈজ্ঞানিক/ইংরেজি/বাংলা নাম ও বৈশ্বিক IUCNসহ); পূর্বসূরি Rahman et al. (2009, EOFF)-এর ৪০২ প্রজাতি। বাংলাদেশ-উপস্থিতির দ্বৈত-প্রমাণ: BdFISH (2012) *Commonly harvested fishes in the coastal and marine environments* তালিকার স্থানীয় নাম + Habib & Islam চেকলিস্ট। নতুন সূত্র-ধ্রুবক `MARINE_FISH_BD` ও `BDFISH_HARVEST` (`data/seed/sources.ts`)।

**স্ক্রিনিং:** bdfish বাণিজ্যিক তালিকার ২৬ প্রজাতির মধ্যে ৮টি সাইটে আগে থেকেই ছিল (সঠিক-মিলনে যাচাইকৃত; *Stolephorus tri*-র মতো সাবস্ট্রিং-ভুল এড়ানো হয়েছে)। অবশিষ্ট ১৮ প্রার্থীর Commons পূর্ণ-টেক্সট অনুসন্ধান ৩ ঢেউয়ে; প্রতিটি গৃহীত ফাইলের extmetadata (LicenseShortName/Artist/Categories) পৃথকভাবে যাচাই। **গৃহীত ১৪; বর্জিত/মুলতবি ৪** — *Stolephorus tri* (কোনো চিত্র-ফাইল নেই, শুধু PDF), *Argyrosomus amoyensis* (শুধু Ford 45 ঐতিহাসিক প্লেট), *Strongylura leiura* (একমাত্র ফাইল ৬০০×১১৪ লো-রেজ স্ট্রিপ — হাই-রেজ মুলতবি, §৩২-এর cascasia-নজির), *Hilsa kelee* (§৩২-বর্জন বহাল)।

**১৪ গৃহীত প্রজাতি (৭ কার্টিলেজ-মাছ — ২ হাঙর + ৫ রে; ৭ অস্থিমাছ):**

| # | slug | বাংলা নাম | বৈজ্ঞানিক নাম | বর্গ/পরিবার | বৈশ্বিক IUCN | চিত্র-লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | milk-shark | কামোট হাঙর | *Rhizoprionodon acutus* | Carcharhiniformes/Carcharhinidae | **VU** (2020, A2bd; CITES II) | CC BY 2.0 (K. Rayker) |
| ২ | blackspotted-croaker | কালা পোয়া | *Protonibea diacanthus* | Acanthuriformes/Sciaenidae | **NT** (2018, A2b) | CC BY 3.0 (H.B. Osmany) |
| ৩ | kawakawa | বোম মাইট্টা | *Euthynnus affinis* | Scombriformes/Scombridae | **LC** | CC BY 3.0 (M.M. Khan) |
| ৪ | bluespotted-maskray | সাপলা পাতা | *Neotrygon kuhlii* | Myliobatiformes/Dasyatidae | **DD** (2017; প্রজাতি-কমপ্লেক্স) | CC BY 2.0 (R. Zerpe) |
| ৫ | longjaw-thryssa | লম্বা-থুতনি ফ্যাসা | *Thryssa setirostris* | Clupeiformes/Engraulidae | **LC** (2017) | CC BY-SA 4.0 (P.C. Bose) |
| ৬ | estuary-seahorse | সমুদ্র ঘোড়া | *Hippocampus kuda* | Syngnathiformes/Syngnathidae | **VU** (2012; CITES II) | CC BY-SA 3.0 (N. Hobgood) |
| ৭ | longtail-butterfly-ray | পদ্মমনি | *Gymnura poecilura* | Myliobatiformes/Gymnuridae | **VU** (2020, A2d) | CC BY 3.0 (H.B. Osmany) |
| ৮ | bennetts-stingray | হাউশ পাতা | *Hemitrygon bennettii* | Myliobatiformes/Dasyatidae | **VU** (2019) | CC BY 3.0 (A.B. Kumar) |
| ৯ | long-billed-halfbeak | একঠ্যুঁইয়া মাছ | *Rhynchorhamphus georgii* | Beloniformes/Hemiramphidae | **LC** | CC BY-SA 4.0 (JIBON, IMS Chittagong GLAM) |
| ১০ | banded-eagle-ray | শঙ্কাচিল | *Aetomylaeus nichofii* | Myliobatiformes/Myliobatidae | **VU** (2015, A2bd) | CC BY 4.0 (H.B. Osmany) |
| ১১ | live-sharksucker | হাঙর চ্যাট | *Echeneis naucrates* | Carangiformes/Echeneidae | **LC** (2012) | CC BY 4.0 (P. Asman/iNaturalist) |
| ১২ | winghead-shark | হাতুরি হাঙ্গর | *Eusphyra blochii* | Carcharhiniformes/Sphyrnidae | **CR** (2024, A2cd; পূর্বে EN 2016) | CC BY-SA 4.0 (JIBON, IMS Chittagong GLAM) |
| ১৩ | honeycomb-whipray | চিত্র হাউস | *Himantura uarnak* | Myliobatiformes/Dasyatidae | **EN** (2020, A2d; কমপ্লেক্স) | CC BY-SA 2.0 (A. Mikalauskas) |
| ১৪ | fringescale-sardinella | খয়রা | *Sardinella fimbriata* | Clupeiformes/Dorosomatidae | **LC** | CC BY 4.0 (Hata & Motomura, ZooKeys 2019) |

**মূল সিদ্ধান্ত:**
1. **জাতীয় মূল্যায়ন-শূন্যতা স্বচ্চ নথি:** Habib & Islam (2021) স্পষ্ট করেছেন সামুদ্রিক মাছের IUCN Bangladesh জাতীয় মূল্যায়ন নেই — প্রতিটি রেকর্ডের `conservationBn`-এ শুধু বৈশ্বিক শ্রেণি (মূল্যায়ন-সাল/মানদণ্ডসহ) এবং এই সীমাবদ্ধতা স্পষ্টভাবে লেখা; ২৫৩-তালিকার `#ক্রমিক`-রীতি এখানে প্রযোজ্য নয়। বিন্যাস: CR ১, EN ১, VU ৫, NT ১, DD ১, LC ৫ — হুমকিগ্রস্ত ৭ (৫০%)।
2. **GLAM আবিষ্কার:** চট্টগ্রাম বিশ্ববিদ্যালয় *Institute of Marine Sciences Museum*-এর WMBD-সমর্থিত GLAM ব্যাংক (২০২৬, CC BY-SA 4.0) বাংলাদেশি নমুনার হাই-রেজ চিত্র দেয়; ফাইল-শিরোনামেই বাংলা নাম (হাতুরি হাঙ্গর, একঠ্যুঁইয়া মাছ)। ক্যাটাগরিতে মাছ-ছাড়াও মলাস্ক/প্রবাল/ক্যাটলফিশ আছে — ভবিষ্যত-ব্যাচের ভাণ্ডার।
3. **শ্রেণিবিন্যাস-জটিলতা:** *Neotrygon kuhlii* (কমপ্লেক্স; বঙ্গোপসাগরীয় রূপ কোনো-কোনো গবেষণায় *N. caeruleopunctata*), *Himantura uarnak* (কমপ্লেক্স; গঙ্গা-মোহনা রেকর্ডসহ), *Eusphyra laticeps* পুনরুদ্ধার (2019), *Hemitrygon bennetti* বনাম *bennettii* বানান (WoRMS বনাম FishBase/Commons) — বাংলাদেশ-চেকলিস্টের নাম বহাল রেখে সব সতর্কতা `otherNames`/`description`-এ নথিভুক্ত।
4. **চিত্র-নিয়মাবলি:** ১৪/১৪ ফাইল অ্যালোলিস্ট-লাইসেন্সে extmetadata-যাচাইকৃত; কোনো ঐতিহাসিক প্লেট/স্ট্যাম্প/মানচিত্র/ওয়াটারমার্ক নেই। *Sardinella fimbriata*-তে বাজারজাত-শুটকি ফাইল (প্রক্রিয়াজাত-খাদ্য ক্যাটাগরি) বর্জন করে ZooKeys লেক্টোটাইপ জার্নাল-চিত্র গৃহীত (§২৯/§৩০/§৩১ নজির); বাজার/ঘাট-ফটো শুধু প্রজাতি-নির্দিষ্ট ডেডিকেটেড ফাইল হলেই গৃহীত (গণ-পর্যায়ের অনির্দিষ্ট বাজার-ছবি নয়)।
5. **বিষ-নিরাপত্তা:** স্টিংরে-কাঁটা (Neotrygon, Hemitrygon, Himantura, Gymnura)-র বিষ-সতর্কতা ব্যাচ ৫-নিয়মে নথিভুক্ত।
6. **নাম-সংঘর্ষ এড়ানো:** ফ্যাসা (সাইটে *Setipinna phasa* ও তেলি ফাসা বিদ্যমান) → “লম্বা-থুতনি ফ্যাসা”; শঙ্কু মাছ (Pastinachus) থেকে পৃথক করতে Hemitrygon-এ “হাউশ পাতা”; গাঙ হাঙ্গর (Glyphis) থেকে পৃথক “কামোট হাঙর”।

**ফলাফল:** মাছ ১৭৪ → **১৮৮** (মিঠাপানি ২৫৩-কভারেজ ৬৯% অপরিবর্তিত; নতুন ১৪ সামুদ্রিক খাতে); মোট রেকর্ড ১,৭০৩ → **১,৭১৭** (প্রাণী ১,৪৫৪ → **১,৪৬৮**); ছবি ১,৭০০ → **১,৭১৪** (কমন্স ১,০০৭ → **১,০২১**; লোকাল ৬৯১ ও ৩ বাদুড়-ফাঁক অপরিবর্তিত); ক্রেডিট-রেজিস্টার ১,৬৮৪ → **১,৬৯৮** (verified ১,০১৫ → **১,০২৯**; pending ৬৬৯ অপরিবর্তিত); verified রেকর্ড ১,৬৬৭ → **১,৬৮১**। ১৪/১৪ রেকর্ডে ৩১টি ফিল্ড, group `machh`, ১৪/১৪ `origin:'native'`, dataStatus `partial` (রানটাইমে ১৮৮/১৮৮ মাছ verified-এ পদোন্নত); স্লগ/বৈজ্ঞানিক নাম/nameBn ডুপ শূন্য; `licenseFor()` ১৪/১৪ verified-মিল। দ্বার-ফলাফল: `tsc --noEmit` ০ error · vitest ২৬/২৬ · চুক্তি problems=[] (ক্রেডিট ১,৬৯৮/verified ১,০২৯, speciesImageReferences ১,৭১৪) · eslint ০ error · `audit:images` ১,৭১৭/১,৭১৪/৩ ফাঁক/০ missing · `stats` মোট ১,৭১৭।

## ৩৪. সামুদ্রিক মাছ সম্প্রসারণ ব্যাচ ১৩ (২০২৬-১০-২৮) — ১৪টি সামুদ্রিক মাছ (প্রথম সম্পূর্ণ-GLAM মাধ্যম-ব্যাচ)

**প্রেক্ষাপট:** ব্যাচ ১২-এর সামুদ্রিক কর্মসূচির ধারাবাহিকতায় (Habib & Islam 2021-এর ৭৪০-চেকলিস্ট; অবশিষ্ট ~৭২৬)। এই ব্যাচের মাধ্যম-কৌশল ভিন্ন: ১৪/১৪ চিত্রই চট্টগ্রাম বিশ্ববিদ্যালয় *Institute of Marine Sciences (IMS) Museum*-এর Wikimedia Bangladesh GLAM ক্যাটাগরি (`Category:GLAM at Institute of Marine Sciences Museum, University of Chittagong`, ৫০০+ সদস্য, ২০২৬-আপলোড) থেকে — বাংলাদেশি জাদুঘর-নমুনা, ফাইল-শিরোনামেই বাংলা নাম, Commons ক্যাটাগরিতে “Fish of Bangladesh”/“Fauna of Bangladesh”; বহিঃ-ভূখণ্ডের ছবির উপর নির্ভরতা শূন্য।

**স্ক্রিনিং:** GLAM ক্যাটাগরির দুই API-পৃষ্ঠার (cmcontinue-সহ) সব ফাইল থেকে মাছ-এন্ট্রি পৃথকীকরণে ~৭৫টি মাছ-প্রজাতি শনাক্ত; পূর্ববর্তী ব্যাচে (৪/৬/১২) ইতিমধ্যে-গৃহীত ৮ GLAM প্রজাতি বাদ (*Polynemus paradiseus*, *Coilia ramcarati*, *Sillaginopsis panijus*, *Cynoglossus cynoglossus*, *Eusphyra blochii*, *Rhynchorhamphus georgii*, *Hippocampus kuda*সহ)। ১৪-প্রজাতির বাছাইয়ে বর্গ-বৈচিত্র্য (১০টি বর্গ, ১৪টি পৃথক পরিবার), বাণিজ্যিক-গুরুত্ব ও হুমকি-প্রতিনিধিত্ব অগ্রাধিকার পায়। প্রতিটি ফাইল extmetadata দিয়ে পৃথকভাবে যাচাই: একই লাইসেন্স **CC BY-SA 4.0**, Artist **JIBON**, Credit IMS Museum, রেজোলিউশন ২৬৪২–৫২৮৮ px (সব হাই-রেজ, কোনো লো-রেজ/স্ট্রিপ নয়); upload URL-গুলো Commons API imageinfo থেকে নেওয়া এবং স্বাধীন MD5-পথ-গণনায় (১৪/১৪) যাচাইকৃত। **বর্জিত/মুলতবি:** *Gymnothorax miliaris* ও *Stephanolepis diaspros* (আটলান্টিক/ভূমধ্যসাগরীয় নাম-সংশয় — বাংলাদেশি নমুনার পরিচয়-প্রমাণ সাপেক্ষে পুনর্বিবেচ্য), *Dactyloptena sp.* (শুধু গণ-পর্যায়, প্রজাতি-অনিশ্চিত)।

**১৪ গৃহীত প্রজাতি (৩ কার্টিলেজ-মাছ — ২ হাঙর + ১ বৈদ্যুতিক রে; ১১ অস্থিমাছ):**

| # | slug | বাংলা নাম | বৈজ্ঞানিক নাম | বর্গ/পরিবার | বৈশ্বিক IUCN | চিত্র-লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | indian-mackerel | আইলা মাছ | *Rastrelliger kanagurta* | Scombriformes/Scombridae | **LC** (2022) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ২ | torpedo-scad | কাউয়া মৌরি মাছ | *Megalaspis cordyla* | Carangiformes/Carangidae | **LC** (2016, errata 2017) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৩ | talang-queenfish | সুরমা মাছ | *Scomberoides commersonnianus* | Carangiformes/Carangidae | **LC** (2015) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৪ | whitecheek-shark | কাটা হাঙ্গর মাছ | *Carcharhinus dussumieri* | Carcharhiniformes/Carcharhinidae | **EN** (2019, A2bd; CITES II) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৫ | spadenose-shark | ঠুট্টি হাঙ্গর মাছ | *Scoliodon laticaudus* | Carcharhiniformes/Carcharhinidae | **NT** (2021; জাতীয় Schedule I; CITES II) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৬ | numbray | বিদ্যুৎ মাছ | *Narke dipterygia* | Torpediniformes/Narkidae | **VU** (পূর্বে DD 2009) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৭ | jarbua-terapon | বরগুনি মাছ | *Terapon jarbua* | Centrarchiformes/Terapontidae | **LC** (2017) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৮ | spotted-scat | বিশতারা মাছ | *Scatophagus argus* | Acanthuriformes/Scatophagidae | **LC** (2009; বিষাক্ত কাঁটা) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৯ | johns-snapper | রাঙ্গা চৌক্ষা মাছ | *Lutjanus johnii* | Acanthuriformes/Lutjanidae | **LC** (2016) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১০ | russells-lionfish | কুরা মাছ | *Pterois russelii* | Perciformes/Scorpaenidae | **LC** (2015; ১৩ বিষাক্ত ডরসাল-কাঁটা) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১১ | longnose-seahorse | তিন-ফোঁটা সিন্ধুঘোটক | *Hippocampus trimaculatus* | Syngnathiformes/Syngnathidae | **VU** (2012, A2bcd+4bcd; CITES II; বাংলাদেশে নতুন রেকর্ড) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১২ | starry-triggerfish | সাদা বেলি মাছ | *Abalistes stellatus* | Tetraodontiformes/Balistidae | **LC** (2015) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১৩ | shaggy-frogfish | ডোরা ব্যাং মাছ | *Antennarius hispidus* | Lophiiformes/Antennariidae | **LC** (2022) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১৪ | savalai-hairtail | ছুরি মাছ | *Lepturacanthus savala* | Scombriformes/Trichiuridae | **NE** (IUCN-মূল্যায়ন হয়নি) | CC BY-SA 4.0 (JIBON, IMS GLAM) |

**মূল সিদ্ধান্ত:**
1. **এক-উৎস মাধ্যম-স্বচ্ছতা:** ১৪/১৪ চিত্র একই GLAM ব্যাংকের হলেও প্রতিটি স্বতন্ত্র pageid-এ extmetadata-যাচাইকৃত (লাইসেন্স/আর্টিস্ট/ক্যাটাগরি/মাপ); ফাইল-শিরোনামের বাংলা নামই nameBn-এর ভিত্তি (প্রয়োজনে স্পষ্টীকরণ: *H. trimaculatus*-কে বিদ্যমান “সমুদ্র ঘোড়া” (*H. kuda*) থেকে পৃথক করতে “তিন-ফোঁটা সিন্ধুঘোটক”; *L. savala*-র GLAM-নাম “ছোট ছুরি মাছ” otherNames-এ রাখা)।
2. **NE-স্বচ্ছতা:** *Lepturacanthus savala* বৈশ্বিক IUCN Red List-এ এখনো Not Evaluated — Conservation টাইপের `'NE'` মান ব্যবহার করে কোনো বিপদ-শ্রেণি অনুমান করা হয়নি; জরুরি-মূল্যায়ন-সুপারিশ conservationActions-এ নথিভুক্ত।
3. **বিষ-নিরাপত্তা (ব্যাচ ৫-নিয়ম বহাল):** *Pterois russelii* (১৩টি বিষ-গ্রন্থি-যুক্ত ডরসাল-কাঁটা), *Scatophagus argus* (ডরসাল/অ্যানাল/পেলভিক বিষাক্ত কাঁটা), *Narke dipterygia* (বৈদ্যুতিক-অঙ্গের শক) — তিন রেকর্ডেই description-এ স্পষ্ট সতর্কতা।
4. **জাতীয়-বনাম-বৈশ্বিক সুরক্ষা পার্থক্য:** *Scoliodon laticaudus* বৈশ্বিক NT হলেও বাংলাদেশে বন্যপ্রাণী (সংরক্ষণ ও নিরাপত্তা) আইনের **Schedule I**-তে সর্বোচ্চ-সুরক্ষিত (Haque et al. 2021, PLOS ONE); দেশের অবতরণ-কেন্দ্রে সংখ্যায় শীর্ষ হাঙর (জরিপে ২৬,২৮০ নমুনা) হওয়ায় প্রয়োগ-ফাঁক conservationActions-এ উল্লিখিত। EN *Carcharhinus dussumieri*-তে তিন-প্রজন্মে ৫০–৭৯% হ্রাস ও CITES Appendix II (CoP19, ২০২৩) নথিভুক্ত।
5. **নতুন দেশ-রেকর্ড:** Commons-এর IMS-বিবরণী অনুযায়ী *Hippocampus trimaculatus* সেন্টমার্টিন দ্বীপ থেকে “New record in Bangladesh” — description ও conservationBn-এ স্পষ্ট নথি; পুরো *Hippocampus* গণ CITES Appendix II।
6. **শ্রেণিবিন্যাস-আধুনিকীকরণ:** FishBase-র বর্তমান বিন্যাস অনুসরণ — Terapontidae → Centrarchiformes, Lutjanidae/Scatophagidae → Acanthuriformes, Scorpaenidae → Perciformes (Scorpaenoidei); *Abalistes stellaris*-প্রতিশব্দ ও *Lutjanus johnii*-র সম্ভাব্য রূপ-কমপ্লেক্স-সংশয় otherNames/description-এ নথিভুক্ত, বাংলাদেশ-চেকলিস্টের নাম বহাল।

**ফলাফল:** মাছ ১৮৮ → **২০২** (মিঠাপানি ১৭৪ অপরিবর্তিত; সামুদ্রিক ১৪ → **২৮**); মোট রেকর্ড ১,৭১৭ → **১,৭৩১** (প্রাণী ১,৪৬৮ → **১,৪৮২**); ছবি ১,৭১৪ → **১,৭২৮** (কমন্স ১,০২১ → **১,০৩৫**; লোকাল ৬৯১ ও ৩ বাদুড়-ফাঁক অপরিবর্তিত); ক্রেডিট-রেজিস্টার ১,৬৯৮ → **১,৭১২** (verified ১,০২৯ → **১,০৪৩**; pending ৬৬৯ অপরিবর্তিত); verified রেকর্ড ১,৬৮১ → **১,৬৯৫**। ১৪/১৪ রেকর্ডে ৩১টি ফিল্ড, group `machh`, ১৪/১৪ `origin:'native'`, dataStatus `partial` (রানটাইমে ২০২/২০২ মাছ verified-এ পদোন্নত); স্লগ/বৈজ্ঞানিক নাম/nameBn ডুপ শূন্য; `licenseFor()` ১৪/১৪ verified-মিল। বৈশ্বিক IUCN বিন্যাস: EN ১, VU ২, NT ১, LC ৯, NE ১ — হুমকিগ্রস্ত ৩ (২১%)। দ্বার-ফলাফল: `tsc --noEmit` ০ error · vitest ২৬/২৬ · চুক্তি problems=[] (ক্রেডিট ১,৭১২/verified ১,০৪৩, speciesImageReferences ১,৭২৮) · eslint ০ error · `audit:images` ১,৭৩১/১,৭২৮/৩ ফাঁক/০ missing (--check-এর status ০ স্যান্ডবক্স-নেট-সীমা, ১৪ URL Commons API + MD5-পথে যাচাইকৃত) · `stats` মোট ১,৭৩১।

## ৩৫. সামুদ্রিক মাছ সম্প্রসারণ ব্যাচ ১৪ (২০২৬-১০-২৮) — ১৪টি সামুদ্রিক মাছ (দ্বিতীয় সম্পূর্ণ-GLAM মাধ্যম-ব্যাচ; ১৪টিই অস্থিমাছ)

**প্রেক্ষাপট:** ব্যাচ ১৩-এর ধারাবাহিকতায় (Habib & Islam 2021-এর ৭৪০-চেকলিস্ট; অবশিষ্ট ~৬৯৮)। মাধ্যম-কৌশল ব্যাচ ১৩-এর মতোই: ১৪/১৪ চিত্র চট্টগ্রাম বিশ্ববিদ্যালয় *Institute of Marine Sciences (IMS) Museum*-এর Wikimedia Bangladesh GLAM ক্যাটাগরি থেকে — বাংলাদেশি জাদুঘর-নমুনা, ফাইল-শিরোনামে বাংলা নাম, Commons ক্যাটাগরিতে “Fish of Bangladesh”/“Fauna of Bangladesh”; বহিঃ-ভূখণ্ডের ছবির উপর নির্ভরতা শূন্য।

**স্ক্রিনিং ও দুই-দফা ডুপ-প্রত্যাখ্যান:** GLAM ক্যাটাগরির categorymembers (cmcontinue-সহ ৪ চাঙ্ক) ও Commons সার্চ থেকে মাছ-প্রজাতি বাছাই; প্রতিটি ফাইল imageinfo extmetadata দিয়ে পৃথকভাবে যাচাই (লাইসেন্স **CC BY-SA 4.0**, Artist **JIBON**, Credit IMS Museum, DateTimeOriginal 2026-08-18, রেজোলিউশন ২৩৫৯–৬২৪৬ px — সব হাই-রেজ)। ব্যাচ-রচনার পর চুক্তি-যাচাইয়ে দুটি প্রার্থী পূর্ববর্তী ব্যাচের রেকর্ডের হুবহু ডুপ হিসেবে ধরা পড়ে এবং শূন্য-ডুপ নিয়মে বাতিল হয়: (ক) *Eleutheronema tetradactylum* — more-fish.ts-এর বিদ্যমান `koral` রেকর্ড (একই বৈজ্ঞানিক নাম; পারস্য উপসাগরীয় আঞ্চলিক EN-তথ্য সেখানে বিদ্যমান), স্থলে *Drepane longimana* (পান মাছ, pageid 199683041); (খ) *Chelonodontops patoca* — more-fish6.ts-এর `milkspotted-puffer` (*Chelonodon patoca*; টেট্রোডোটক্সিন-সতর্কতাসহ রেকর্ড বিদ্যমান), স্থলে *Abudefduf bengalensis* (পাথারী মাছ, pageid 199683426)। বাতিল প্রজাতি দুটির তথ্য-মাধ্যম আগের ব্যাচেই সংরক্ষিত, তথ্য-ক্ষতি হয়নি। বাছাই-চূড়ান্ত ১৪ প্রজাতি ৮ বর্গে ১৩টি পৃথক পরিবারের প্রতিনিধিত্ব করে (Acanthuriformes ৬, Perciformes ২, অবশিষ্ট ৬ বর্গে ১টি করে)।

**১৪ গৃহীত প্রজাতি (১৪টিই অস্থিমাছ — Actinopterygii):**

| # | slug | বাংলা নাম | বৈজ্ঞানিক নাম | বর্গ/পরিবার | বৈশ্বিক IUCN | চিত্র-লাইসেন্স (লেখক) |
|---|---|---|---|---|---|---|
| ১ | greater-lizardfish | সাদা আঁচিলা মাছ | *Saurida tumbil* | Aulopiformes/Synodontidae | **LC** (2015) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ২ | tripletail | সামুদ্রিক কৈ মাছ | *Lobotes surinamensis* | Acanthuriformes/Lobotidae | **LC** (2012) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৩ | red-cornetfish | বংশী মাছ | *Fistularia petimba* | Syngnathiformes/Fistulariidae | **LC** (2024) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৪ | sunrise-goatfish | সোনালি বাটা মাছ | *Upeneus sulphureus* | Mulliformes/Mullidae | **LC** (2015) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৫ | emperor-red-snapper | রাঙ্গা কৌরাল মাছ | *Lutjanus sebae* | Acanthuriformes/Lutjanidae | **LC** (2015) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৬ | longfin-grouper | বোল মাছ | *Epinephelus quoyanus* | Perciformes/Epinephelidae | **LC** (2016) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৭ | sin-croaker | ছোট কালো পোয়াল মাছ | *Johnius dussumieri* | Acanthuriformes/Sciaenidae | **LC** (2018) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৮ | toothed-ponyfish | দেঁতো চান্দা মাছ | *Gazza minuta* | Acanthuriformes/Leiognathidae | **LC** (2016) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ৯ | spotted-sicklefish | ফোঁটা পান মাছ | *Drepane punctata* | Acanthuriformes/Drepaneidae | **LC** (2023) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১০ | banded-sicklefish | পান মাছ | *Drepane longimana* | Acanthuriformes/Drepaneidae | **NE** (মূল্যায়ন হয়নি) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১১ | shortnose-tripodfish | বোঁচা শুকুরা মাছ | *Triacanthus biaculeatus* | Tetraodontiformes/Triacanthidae | **LC** (2023) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১২ | malayan-flounder | চ্যাপ্টা মাছ | *Pseudorhombus malayanus* | Pleuronectiformes/Paralichthyidae | **LC** (2021) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১৩ | longnosed-stargazer | ভুতুম মাছ | *Ichthyscopus lebeck* | Perciformes/Uranoscopidae | **NE** (মূল্যায়ন হয়নি) | CC BY-SA 4.0 (JIBON, IMS GLAM) |
| ১৪ | bengal-sergeant | পাথারী মাছ | *Abudefduf bengalensis* | Blenniiformes/Pomacentridae | **LC** (2010) | CC BY-SA 4.0 (JIBON, IMS GLAM) |

**মূল সিদ্ধান্ত:**
1. **NE-স্বচ্ছতা (ব্যাচ ১৩-নিয়ম বহাল):** *Drepane longimana* ও *Ichthyscopus lebeck* বৈশ্বিক IUCN Red List-এ এখনো Not Evaluated (FishBase Ref. 130435, Version 2025-2) — Conservation টাইপের `'NE'` মান ব্যবহার করে কোনো বিপদ-শ্রেণি অনুমান করা হয়নি; জরুরি-মূল্যায়ন-সুপারিশ conservationActions-এ নথিভুক্ত। বাকি ১২টি LC, যার তারিখ-ভিত্তি (২০১০–২০২৪) প্রতিটি conservationBn-এ উল্লিখিত।
2. **শ্রেণিবিন্যাস-স্বচ্ছতা:** Habib & Islam (2021) Supplementary Table-I row 716-এর বৈজ্ঞানিক নাম *Triacanthus biaculeatus*; Commons/GLAM ফাইলের শিরোনামে *T. brevirostris*, যা [WoRMS](https://www.marinespecies.org/aphia.php?p=taxdetails&id=283034)-এ *T. biaculeatus*-এর synonym (accepted status *T. biaculeatus*)। Seed-এ checklist-এর accepted নাম ব্যবহৃত; image filename-এর নাম alias/description-এ আলাদা করে চিহ্নিত। মাছ-১৪-রচনায় দুই GLAM ফাইল-নামের বাংলা বানান Commons imageinfo থেকে হুবহু সংশোধন করা হয়: “ভুতুম মাছ” (ভাঁড়াম নয়) ও “বোঁচা শুকুরা মাছ” (শিকারা নয়); ১৪/১৪ URL স্বাধীন MD5-পথ-গণনায় যাচাইকৃত।
3. **বিষ-নিরাপত্তা:** *Epinephelus quoyanus* ও *Lutjanus sebae*-র বড় নমুনা থেকে সিগুয়াটেরা বিষক্রিয়ার FishBase-নথি আছে — দুই রেকর্ডের conservationBn ও description-এ সতর্কতা। (টেট্রোডোটক্সিন-বাহক পটকা ডুপ-প্রত্যাখ্যানে বাদ; প্রজাতিটির সতর্কতা more-fish6 রেকর্ডে বিদ্যমান।)
4. **বাংলাদেশ-উপস্থিতির দ্বৈত-প্রমাণ:** ১৪/১৪ প্রজাতি Habib & Islam (2021) চেকলিস্ট-সদস্য এবং IMS জাদুঘরের বাংলাদেশি নমুনা-চিত্র; *Gazza minuta*-ফাইলের বিবরণীতে “Collected from Saint Martin Island” — সেন্টমার্টিন দ্বীপের সরাসরি নমুনা-প্রমাণ; *E. quoyanus*-র নাম-সংশয় (*E. macrospilos/hexagonatus*-ভ্রান্তি) otherNames-এ সতর্কতাসহ নথিভুক্ত।
5. **জীববৈচিত্র্য-উপাদান:** প্রোট্যান্ড্রাস উভলিঙ্গ থ্রেডফিন-ধাঁচের বদলি হিসেবে আসা ব্যান্ডেড সিকলফিশ, বালিতে পুঁতে-থাকা স্টারগেজার, আলো-অঙ্গবিশিষ্ট টুথপনি, পুরুষ-ডিম-পাহারাদার ড্যামসেলফিশ, দুই চোখ-একপাশে ফ্লাউন্ডার — ৮ বর্গ/১৩ পরিবারের পরিবেশগত-বৈচিত্র্য ৩১-ফিল্ড রেকর্ডে সংকলিত।

**ফলাফল:** মাছ ২০২ → **২১৬** (মিঠাপানি ১৭৪ অপরিবর্তিত; সামুদ্রিক ২৮ → **৪২**); মোট রেকর্ড ১,৭৩১ → **১,৭৪৫** (প্রাণী ১,৪৮২ → **১,৪৯৬**); ছবি ১,৭২৮ → **১,৭৪২** (কমন্স ১,০৩৫ → **১,০৪৯**; লোকাল ৬৯১ ও ৩ বাদুড়-ফাঁক অপরিবর্তিত); ক্রেডিট-রেজিস্টার ১,৭১২ → **১,৭২৬** (verified ১,০৪৩ → **১,০৫৭**; pending ৬৬৯ অপরিবর্তিত); verified রেকর্ড ১,৬৯৫ → **১,৭০৯**। ১৪/১৪ রেকর্ডে ৩১টি ফিল্ড, group `machh`, ১৪/১৪ `origin:'native'`, dataStatus `partial` (রানটাইমে ২১৬/২১৬ মাছ verified-এ পদোন্নত); স্লগ/বৈজ্ঞানিক নাম/nameBn/ছবি-URL ডুপ শূন্য (১,৭৩১ পূর্ব-রেকর্ডের বিরুদ্ধে স্বয়ংক্রিয় স্ক্যান); `licenseFor()` ১৪/১৪ verified-মিল। বৈশ্বিক IUCN বিন্যাস: LC ১২, NE ২ — হুমকিগ্রস্ত ০। দ্বার-ফলাফল: `tsc --noEmit` ০ error · vitest ২৬/২৬ · চুক্তি problems=[] (ক্রেডিট ১,৭২৬/verified ১,০৫৭, speciesImageReferences ১,৭৪২, unregistered placeholder ০) · eslint ০ error · `audit:images` ১,৭৪৫/১,৭৪২/৩ ফাঁক/০ missing (--check-এর status ০ স্যান্ডবক্স-নেট-সীমা, ১৪ URL Commons API imageinfo + MD5-পথে যাচাইকৃত) · `stats` মোট ১,৭৪৫।

## ৩৬) সামুদ্রিক মাছ ব্যাচ ১৫ — ১৪ রেকর্ডের checklist crosswalk ও পরবর্তী candidate

**মূল checklist:** Habib & Islam (2021), *An updated checklist of Marine Fishes of Bangladesh*, Bangladesh J. Fish. 32(2):357–367, DOI [10.52168/bjf.2020.32.40](https://doi.org/10.52168/bjf.2020.32.40), Supplementary Table-I (৭৪০টি entry)। [ResearchGate-এর পূর্ণ নিবন্ধ/PDF](https://www.researchgate.net/publication/353032253_An_updated_checklist_of_Marine_Fishes_of_Bangladesh) ও [author-uploaded PDF](https://www.researchgate.net/profile/Kazi-Habib-3/publication/353032253_An_updated_checklist_of_Marine_Fishes_of_Bangladesh/links/60e8538430e8e50c01f2e7f2/An-updated-checklist-of-Marine-Fishes-of-Bangladesh.pdf)-এর table text খুলে প্রতিটি scientific name ও row সরাসরি মিলিয়ে দেখা হয়েছে; search-index excerpt-কে একমাত্র প্রমাণ করা হয়নি। `MARINE_FISH_BD` citation উপস্থিতি একা checklist membership প্রমাণ করে না। BdFISH harvest citation-ও স্বতন্ত্র species occurrence evidence নয়।

### Batch 15: row-level ফলাফল

**১৪টির মধ্যে ৬টির row match হয়েছে; ৮টি সম্পূর্ণ Table-I-তে খুঁজেও পাওয়া যায়নি।** ৮টি অনুপস্থিত/অযাচাইকৃত রেকর্ড seed থেকে মুছিনি; এগুলোকে checklist member বা verified checklist progress-এ গণনা করা যাবে না। “Table-I-তে নেই” মানে এই checklist-এ নামের match নেই—অন্য উৎসে বাংলাদেশের উপস্থিতি অস্বীকার নয়।

| বৈজ্ঞানিক নাম | Table-I-তে যাচাই | মিলের row / family section |
|---|---|---|
| *Epinephelus faveatus* | নেই | Serranidae, rows 487–510-এ নেই |
| *Gazza rhombea* | নেই | Leiognathidae, rows 513–523-এ নেই |
| *Ellochelon vaigiensis* | আছে | **198** — Squaretail mullet; Bata; M/B/F/R; LC |
| *Equulites leuciscus* | নেই | Leiognathidae, rows 513–523-এ নেই; সেখানে *E. elongatus*, *E. lineolatus* আছে |
| *Siganus sutor* | নেই | Siganidae, rows 609–612-এ নেই |
| *Lophiodes naresi* | আছে | **710** — Goosefish; Samudra cheka; M; LC |
| *Nibea semifasciata* | নেই | Sciaenidae, rows 619–650-এ নেই |
| *Minous monodactylus* | আছে | **707** — Grey stingfish; Kata koral; M/S; LC |
| *Brachysomophis cirrocheilos* | নেই | Ophichthidae, rows 93–97-এ নেই |
| *Ostorhinchus angustatus* | নেই | Apogonidae, rows 291–302-এ নেই |
| *Pentaprion longimanus* | আছে | **466** — Longfin mojarra; Jagiri; M/B; LC |
| *Kurtus indicus* | আছে | **290** — Indian hump head; Choto phaisha; M/B/F/S; NE |
| *Pterygotrigla arabica* | আছে | **691** — Gurnard fish; Kumir machh; M; NE |
| *Moolgarda crenilabis* | নেই | Mugilidae, rows 211–219-এ নেই; *Crenimugil crenilabis* নামেও নেই |

Table-I-তে কিছু numbering/OCR formatting অসংগতি আছে; affirmative ছয়টি row-এর নাম ও row একই extracted table entry-তে মেলে। row 212-তে *Ellochelon vaigiensis* ও row 710-তে *Lophiodes naresi*-র ক্ষেত্রে extracted publication text-এর row number সংরক্ষণ করেছি।

### `Atropus atropos` — candidate review, checklist status নিশ্চিত

Habib & Islam Supplementary Table-I-তে **row 352**: Carangidae, *Atropus atropos* (Bloch & Schneider, 1801), Cleftbelly trevally, Bangada, M/S, LC। অতএব এটি checklist member এবং batch16 candidate (batch15 নয়)। বাংলাদেশের Marine Biodiversity Portal-এ coastal-water presence, specimen/lab codes, references, local names “গেন্দা মৌরি”/“টেক চান্দা” ও DNA barcode access আছে: [species page](https://marinebiodiversity.org.bd/species/atropus-atropos/).

**Taxonomy/name conflict-এর নিষ্পত্তি:** California Academy of Sciences-এর [Eschmeyer's Catalog](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=34511)-এ current valid name *Atropus atropos* এবং Carangidae: Caranginae; source note-তে মূল 1801 বর্ণনার plate-এ `atropus`, মূল text/index-এ `atropos`, এবং Paepke (1999)-এর first-reviser spelling selection উল্লেখ করে। [WoRMS accepted taxon](https://www.marinespecies.org/aphia.php?p=taxdetails&id=279823) *Atropus atropos*-কে accepted বলে; [WoRMS spelling record](https://www.marinespecies.org/aphia.php?p=taxdetails&id=401566)-এ *Atropus atropus* স্পষ্টতই “unaccepted (misspelling)”। ITIS-ও *Atropus atropos*-কে valid এবং *Atropus atropus* ও *Caranx atropus*-কে synonym list-এ রাখে; তার order `Perciformes` WoRMS-এর বর্তমান `Carangiformes` classification-এর সঙ্গে আলাদা। Record-এ accepted spelling *Atropus atropos*, family Carangidae, order Carangiformes ব্যবহার করা উচিত; `atropus`-কে accepted alternate species name হিসেবে উপস্থাপন করা যাবে না। *Brama atropos* original combination; `Caranx atropus` historical combination/misspelling।

**বাংলা নাম:** primary “গেন্দা মৌরি মাছ” ডুপ-মুক্ত প্রার্থী। Portal-এ থাকা “টেক চান্দা” বর্তমান *Gazza rhombea*-র বাংলা নামের সঙ্গে মেলে; আলাদা alias-dedup সিদ্ধান্ত ছাড়া নতুন রেকর্ডে alias হিসেবে যোগ নয়।

**ছবি:** [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:Atropus_atropos_-_Cleftbelly_trevally_(%E0%A6%9F%E0%A7%87%E0%A6%95_%E0%A6%9A%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A6%E0%A6%BE_%E0%A6%AE%E0%A6%BE%E0%A6%9B)_01.jpg) — JIBON, IMS Museum/University of Chittagong GLAM, 3540×5282, CC BY-SA 4.0। Filename normalized MD5 prefix `0af068002c6d08822436a1aee7d89b6a`; Commons path `0/0a`। Bangladesh occurrence ও free-license image source দুটোই পাওয়া; batch16 implementation-এ credit/license registration প্রয়োজন, শুধু এই নথিভুক্তি image record তৈরি করে না।

### Batch 16: সম্পন্ন — row, accepted taxonomy ও media audit

১৪টি রেকর্ডের প্রত্যেকটি মূল Supplementary Table-I-এর নির্দিষ্ট row-তে সরাসরি মেলে; indexed excerpt-কে প্রমাণ ধরা হয়নি। `MARINE_FISH_BD` source শুধু checklist citation; row number ও বৈজ্ঞানিক নামের crosswalk নিচের তালিকায় স্বতন্ত্রভাবে নথিভুক্ত। Habib & Islam-এর row-এ স্থানীয়-নাম-লিপ্যন্তর, habitat codes ও global LC আছে; অপ্রদত্ত species biology-কে অনুমান না করে রেকর্ড `dataStatus: 'partial'` রাখা হয়েছে। `origin: 'native'` Bangladesh checklist presence বোঝায়, endemicity নয়। বর্তমান জাতীয় IUCN মূল্যায়ন দাবি করা হয়নি (প্রকল্পের নিয়মে জাতীয় conservation status-এর একমাত্র অনুমোদিত উৎস BDFISH 253-তালিকা)।

| row | Table-I name | seed accepted name | Table-I local-name form; habitat | commons image credit; license |
|---:|---|---|---|---|
| 352 | *Atropus atropos* | *Atropus atropos* | Genda Mouri; M/S | JIBON, IMS/University of Chittagong; CC BY-SA 4.0 |
| 353 | *Atule mate* | *Atule mate* | Bom maittya; M/B/R | portioid/iNaturalist; CC BY-SA 4.0 |
| 354 | *Carangoides armatus* | *Atropus armatus* | Mouri; M/B/R/S | Kare Kare; CC BY-SA 3.0 |
| 355 | *Carangoides chrysophrys* | *Platycaranx chrysophrys* | Mouri; M/B/R | Mohammad Moazzam Khan; CC BY 3.0 |
| 356 | *Carangoides coeruleopinnatus* | *Turrum coeruleopinnatum* | Mouri; M/R | Kare Kare; CC BY-SA 3.0 |
| 357 | *Carangoides ferdau* | *Ferdauia ferdau* | Mouri; M/B/R | Dwayne Meadows/NOAA; Public domain (U.S. government work) |
| 358 | *Carangoides hedlandensis* | *Atropus hedlandensis* | Mouri; M/R/S | Kare Kare; CC BY-SA 3.0 |
| 359 | *Carangoides malabaricus* | *Platycaranx malabaricus* | Malabar moori; M/R/S | Kare Kare; CC BY-SA 3.0 |
| 360 | *Caranx heberi* | *Caranx heberi* | Mouri; M/B/R; row remark “Present study” | Raju Kasambe; CC BY-SA 4.0 |
| 362 | *Caranx ignobilis* | *Caranx ignobilis* | Nilambori; M/B/R/S | Rolf Lawrenz/iNaturalist; CC BY 4.0 |
| 363 | *Caranx melampygus* | *Caranx melampygus* | Nilambori; M/B/R | Dwayne Meadows/NOAA; Public domain (U.S. government work) |
| 364 | *Caranx sexfasciatus* | *Caranx sexfasciatus* | Boro choukka; M/B/F/R/S | Si Gam; CC BY-SA 4.0 |
| 366 | *Decapterus macrosoma* | *Decapterus macrosoma* | Lalamburi; M/R | U.S. FDA, J. Deeds; Public domain (U.S. government work) |
| 367 | *Decapterus maruadsi* | *Decapterus maruadsi* | Nilambori; M/R | re_nebel/iNaturalist; CC BY 4.0 |

Taxonomic updates for rows 354–359 were checked against WoRMS accepted records: [*Atropus armatus*](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218394), [*Platycaranx chrysophrys*](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218396), [*Turrum coeruleopinnatum*](https://www.marinespecies.org/aphia.php?p=taxdetails&id=276241), [*Ferdauia ferdau*](https://www.marinespecies.org/aphia.php?p=taxdetails&id=1802000), [*Atropus hedlandensis*](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218386), and [*Platycaranx malabaricus*](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218397). Seed `otherNames` retains the table's original combination where it differs; the accepted current name is used in taxonomy/scientificName. *Atropus atropos* spelling and the `atropus` misspelling review above also applies to this batch.

Each media record has a specific Commons file-page/author/license note in `data/seed/more-fish16.ts`, a matching central record via `MORE_FISH16_MEDIA`, and exact source/upload URL. License breakdown: CC BY-SA 3.0 (4), CC BY-SA 4.0 (4), CC BY 3.0 (1), CC BY 4.0 (2), Public domain (3). All are modern photographs; no historical PD plate. One low-resolution image (*Platycaranx chrysophrys*, 640×286) is retained because the higher-resolution Dubai alternative's file history initially labelled the fish unidentified. A 492×289 *Atropus hedlandensis* photograph is also low resolution; both limitations are explicitly documented. Commons normalized-filename MD5 directory segments independently match all 14 upload URLs. The contract checker verifies 14 row mappings, 14 unique records/images, 31 fields each, no conflicting seed aliases/keys, and 14 exact registered license records/MD5 paths.

**Explicit exclusions:** row 361 *Caranx hippos* has the paper's `#`/questionable treatment and is not counted; row 365 *Decapterus kurroides* remains excluded because the available Commons file's license review is unresolved. Their omission does not imply global absence from Bangladesh or the checklist. No extra taxa were added to keep the batch at 14.

**Batch16 result and checks:** rows 352–360, 362–364, 366–367 = 14 checklist-positive rows; all Table-I reports LC, which is the paper's global category, not a current national status claim. Batch15 separately has 6 positive rows and 8 absent after full-table search. Across these two audited batches, 20 positive row matches are newly verified; batches 12–14 still need row-by-row audit, so no cumulative verified coverage or remaining-to-712 figure is asserted. After integration, `npm test` passed (Vitest 26/26 and all contract checks including batches 15/16), `npx tsc --noEmit`, `npm run lint`, and `npm run stats` passed. `npm run audit:images` was not run for this batch; Commons file-page metadata and MD5 path were reviewed in the source data, and contract checks passed.

**Current actual counts (`npm run stats`):** 1,773 records, 1,524 animals, 244 fish; 1,770 image-bearing records (691 local + 1,079 remote references; 3 documented gaps); 1,754 media-credit records (1,085 verified, 669 pending); 1,737 verified, 29 review, 6 identity-uncertain, 1 needs-correction. These are database counts, not checklist-coverage counts.

## ৩৭. Batch12–14 direct checklist crosswalk; 712 stop-marker

ResearchGate-এর indexed excerpt নয়, Habib & Islam Supplementary Table-I-এর extracted মূল row-গুলো মিলিয়ে ৪২টি seed record-এর প্রত্যেকটিকে positive row অথবা non-match disposition দিয়েছি। সরাসরি row membership-এর তালিকা:

| batch | scientific name → Table-I row | সরাসরি row match |
|---|---|---:|
| 12 | *Rhizoprionodon acutus* 22; *Protonibea diacanthus* 647; *Euthynnus affinis* 412; *Thryssa setirostris* 137; *Hippocampus kuda* 279; *Gymnura poecilura* 70; *Hemitrygon bennettii* 53; *Rhynchorhamphus georgii* 230; *Aetomylaeus nichofii* 73; *Echeneis naucrates* 339; *Eusphyra blochii* 28; *Himantura uarnak* 56; *Sardinella fimbriata* 145 | 13/14 |
| 13 | *Rastrelliger kanagurta* 416; *Megalaspis cordyla* 371; *Scomberoides commersonnianus* 374; *Carcharhinus dussumieri* 12; *Scoliodon laticaudus* 23; *Narke dipterygia* 40; *Terapon jarbua* 485; *Scatophagus argus* 608; *Lutjanus johnii* 590; *Pterois russelii* 684; *Abalistes stellatus* 722; *Antennarius hispidus* 711; *Lepturacanthus savala* 407 | 13/14 |
| 14 | *Drepane longimana* 613; *Saurida tumbil* 183; *Lobotes surinamensis* 657; *Fistularia petimba* 278; *Upeneus sulphureus* 474; *Lutjanus sebae* 597; *Epinephelus quoyanus* 505; *Johnius dussumieri* 630; *Gazza minuta* 517; *Drepane punctata* 614; *Abudefduf bengalensis* 537; *Triacanthus biaculeatus* 716; *Pseudorhombus malayanus* 245; *Ichthyscopus lebeck* 437 | 14/14 |

**দুটি non-match (seed অক্ষত, checklist progress-এ গণনা নয়):**
- Batch12 *Neotrygon kuhlii*: Table-I row 60-তে *Neotrygon indica* আছে। [WoRMS-এ *N. kuhlii*](https://www.marinespecies.org/aphia.php?p=taxdetails&id=398330) ও [*N. indica*](https://www.marinespecies.org/aphia.php?id=1524223&p=taxdetails) দুটি পৃথক accepted species; 2018-র taxonomic split-এ পূর্বের *N. kuhlii* complex-এর ভারত মহাসাগরীয় lineage *N. indica* নামে বর্ণিত। তাই row 60-কে *N. kuhlii*-র synonym/member match ধরা হয়নি।
- Batch13 *Hippocampus trimaculatus*: Syngnathidae/Table-I rows 279–281-এ *Hippocampus kuda*, *Ichthyocampus carce* ও *Trachyrhamphus serratus* আছে; *H. trimaculatus* নেই। Commons-এ থাকা বাংলাদেশ-নতুন-রেকর্ড বিবরণী এই checklist-এ membership প্রমাণ করে না।

Batch14-এর *Triacanthus biaculeatus* row 716-এ হুবহু আছে। এখানে *Triacanthus brevirostris* paper-এর checklist-নাম নয়: সেটি Commons/GLAM filename; [WoRMS accepted record](https://www.marinespecies.org/aphia.php?p=taxdetails&id=283034)-এ *T. brevirostris* হলো *T. biaculeatus*-এর synonym। Seed ও media attribution-এ দুই নামের ভূমিকা এখন আলাদা করে লেখা।

**৭১২ stop-marker-এর প্রয়োগ:** row 712 নিজে *Halieutaea indica*। Batch12–14-তে ৪০টি row-match, কিন্তু row 716 (*Triacanthus biaculeatus*) ও 722 (*Abalistes stellatus*) ইতোমধ্যে আগের batch-এ ছিল বলে 712 cut-off-এর বাইরের ২টি; user-এর “record মুছবে না” নির্দেশে এন্ট্রি অক্ষত, কিন্তু 712-পর্যন্ত coverage-এ গণনা নয়। Batch12–14-তে 712-এর মধ্যে ৩৮টি positive row; batch15-এ ৬ ও batch16-এ ১৪টি — batch12–16 জুড়ে **৭১২-এর মধ্যে row-verified ৫৮টি**, plus ২টি historical seeded match beyond marker, plus ১০টি non-match/absent record. ৫৮ কেবল এই পাঁচ ব্যাচের vetted positive records-এর গণনা; ধারাবাহিকভাবে ১–৭১২ crosswalk সম্পন্ন হয়েছে বা “712/712” হয়েছে—এমন অর্থ নয়। পরবর্তী batch-এ 712-এর পরের row থেকে কোনো taxon যোগ করা হবে না; cutoff-এর নিচের পরবর্তী unseen rows থেকে ১৪টি করে এগোবে।

`npm test`-ийн contract gate-এ `scripts/check-marine-fish-crosswalk12-14.cjs` যোগ হয়েছে: ৪২ entry-র ৪০ direct row, ২ non-match, এবং stop-marker-এর বাইরে ইতোমধ্যে থাকা row716/722 regress না করার check করে।

## ৩৮. সামুদ্রিক মাছ ব্যাচ ১৭ — ১৪টি row match; row 712 cutoff বহাল

Habib & Islam (2021) Supplementary Table-I-তে এই ব্যাচের প্রত্যেকটি row নাম/section থেকে সরাসরি মেলানো হয়েছে; Table-I-তে **১৩টি নতুন seed** এবং **একটি আগের seed-এর crosswalk** (row 373) আছে। সব ১৪ row 712-এর মধ্যে। Row 386-এ checklist-এর *Ulua mentalis* নামটি বর্তমান WoRMS-accepted *Atropus mentalis* হিসেবে রাখা হয়েছে; *Ulua mentalis* `otherNames`-এ এবং [WoRMS taxon page](https://www.marinespecies.org/aphia.php?id=218447&p=taxdetails) source হিসেবে যুক্ত। `MARINE_FISH_BD` checklist citation; প্রতিটি রেকর্ডের row mapping, স্থানীয় নাম, habitat code ও paper-এ দেওয়া বৈশ্বিক conservation category এখানে নির্দিষ্ট। `origin:'native'` checklist-এ বাংলাদেশের উপস্থিতি বোঝায়, endemicity নয়। কোনো জাতীয় IUCN অবস্থার দাবি নেই (এ প্রকল্পে জাতীয় অবস্থার অনুমোদিত একমাত্র উৎস BDFISH 253 তালিকা); species-specific biology অপ্রদত্ত বলে রেকর্ড `dataStatus:'partial'`।

| Table-I row | Checklist scientific name → seed accepted name | Table-I local name; habitat code | বৈশ্বিক IUCN (paper) | চিত্র/লাইসেন্স |
|---:|---|---|---|---|
| 369 | *Elagatis bipinnulata* → *Elagatis bipinnulata* | Tota machh; M/R | LC | NOAA/NMFS/OPR, modern U.S. government field photo; Public domain |
| 370 | *Gnathanodon speciosus* → *Gnathanodon speciosus* | Ghora maittya; M/R | LC | portioid/iNaturalist, Indonesia 2024; CC BY-SA 4.0 |
| 372 | *Naucrates ductor* → *Naucrates ductor* | Pilot machh; M/R | LC | Christoph Hübner, Croatia 2007; CC BY 3.0 |
| 373 | *Parastromateus niger* → existing `kalo-rupchanda` | Kala chanda; M/B/R/S | LC | Existing record retained; no duplicate added |
| 375 | *Scomberoides lysan* → *Scomberoides lysan* | Chapa; M/B/R | LC | Randall Watanuki / U.S. NPS; modern U.S. government field photo, Public domain |
| 376 | *Scomberoides tala* → *Scomberoides tala* | Bom maittya; M/R | LC | Hamid Badar Osmany; CC BY 3.0 (Commons license review completed) |
| 378 | *Selar boops* → *Selar boops* | Shitap; M/R/S | LC | Si Gam, Aceh 2022; CC BY-SA 4.0 |
| 379 | *Selar crumenophthalmus* → *Selar crumenophthalmus* | Boro choukka; M/R/S | LC | Robert Aguilar / Smithsonian Environmental Research Center; CC BY 2.0 |
| 380 | *Selaroides leptolepis* → *Selaroides leptolepis* | Holde dora choukka; M/B/R | LC | J. Deeds / U.S. FDA, modern reference photo; Public domain |
| 381 | *Seriola rivoliana* → *Seriola rivoliana* | Mouri; M/R | LC | Julien Bidet, Maldives; CC BY-SA 4.0 |
| 382 | *Seriolina nigrofasciata* → *Seriolina nigrofasciata* | Kalo dora; M/B/R/S | LC | Kare Kare, Bali; CC BY-SA 3.0 |
| 383 | *Trachinotus baillonii* → *Trachinotus baillonii* | Anjupuli; M/B/R | LC | Guido and Carrara family, Seychelles 2023; CC BY 2.0 |
| 384 | *Trachinotus blochii* → *Trachinotus blochii* | Kata tikka; M/B/R | LC | David Burdick / NOAA Coral Kingdom, Guam; modern U.S. government field photo, Public domain |
| 385 | *Trachurus indicus* → *Trachurus indicus* | Mouri; M/R | **VU** | Hamid Badar Osmany; CC BY 3.0 (Commons license review completed) |
| 386 | *Ulua mentalis* → *Atropus mentalis* | Chanda; M/R/S | LC | Kare Kare, Port Douglas 2011; CC BY-SA 3.0 |

Habitat code legend from the paper: M marine, B brackish water, R reef-associated, S Sundarbans mangrove; the display expands each code as recorded in the seed. Table-I category count in this batch: LC 13, VU 1 (*Trachurus indicus*). This is the paper's stated global category, not Bangladesh's national assessment.

**Image checks and dispositions:** ১৪/১৪ registered files have file-page credit, exact source URL, explicit public-domain/CC license, verified status and upload.wikimedia.org MD5 directory path; all selected files are contemporary digital/field/reference images, not historical PD book plates. `scripts/check-marine-fish-batch17.cjs` enforces 14 records, direct row map, no cutoff overflow, 31-key uniformity, unique batch slug/scientificName/nameBn/image, no conflict with existing seed keys, per-image verified media credit, supported license, and exact Commons MD5 path. It is wired into `npm test`.

**Crosswalk exclusions / deduplication:**
- Row 368 *Decapterus russelli*: Commons searches returned cooked-fish imagery or images with a conflicting species identification; no eligible exact-taxon field photo was accepted.
- Row 373 *Parastromateus niger*: already present as `kalo-rupchanda` with the same accepted scientific name; existing record and attribution were retained, no duplicate seed added.
- Row 377 *Scomberoides tol*: the clearly attributable own-work image is 567×163; the higher-resolution candidate descriptions conflate it with *Seriphus politus*. Neither was added.
- Row 371 *Megalaspis cordyla* and 374 *Scomberoides commersonnianus* were already seeded in Batch13; no duplicate additions.

Thus Batch17 introduces **14 new species records**: rows 369, 370, 372, 375, 376, 378–386 (with row 373 separately documented as a direct match to a pre-existing record). Audited batch12–17 records now contain 72 distinct direct row matches at/before row 712; this is a count of audited batch candidates, not a claim that the entire checklist range 1–712 has been crosswalked. The previously documented rows 716 and 722 remain in the database but outside cutoff coverage. No record after row 712 was added. **Next unseen candidate row: 387.**

Batch17 validation completed: `node scripts/check-marine-fish-batch17.cjs`, `npm test` (Vitest 26/26 plus all contract checks), `npx tsc --noEmit`, `npm run lint`, `git diff --check`, and `npm run stats` all pass. Current actual stats: 1,787 records, 1,538 animals, 258 fish, 1,784 image-bearing records, 1,768 media credit records (1,099 verified; 669 pending). `audit:images` network probe was not run; Commons license/file pages and normalized filename MD5 paths were checked, and the batch contract passes.

## ৩৯. সামুদ্রিক মাছ ব্যাচ ১৮ — ১৪টি নতুন row match; row 712 cutoff বহাল

Habib & Islam (2021)-এর ৭৪০-প্রজাতির checklist, বিশেষত Supplementary Table-I-তে ১৪টি সরাসরি row match থেকে নতুন record যোগ করা হয়েছে। ভিত্তি-সূত্র: [মূল প্রবন্ধ/সাপ্লিমেন্টারি টেবিল](https://www.researchgate.net/publication/353032253_An_updated_checklist_of_Marine_Fishes_of_Bangladesh); accepted-name ও order/family mapping প্রতিটি record-এ সংশ্লিষ্ট [WoRMS taxon page](https://www.marinespecies.org/) দিয়ে নথিভুক্ত। Table-I-তে বাংলাদেশের সামুদ্রিক মাছ হিসেবে উপস্থিতিই বাংলাদেশে occurrence-এর প্রমাণ; কোনো species-কে endemic বলা হয়নি। National conservation status দাবি করা হয়নি—নির্দেশিত একমাত্র জাতীয়-অবস্থা সূত্র BDFISH-এর ২৫৩-তালিকা; এখানে শুধু paper-এ দেওয়া **global IUCN** category রাখা হয়েছে। Biology fields checklist row-তে না থাকলে partial/unknown বলা হয়েছে, অনুমান করা হয়নি।

| Table-I row | Checklist/accepted taxon | WoRMS order / family | Table-I local name; habitat codes | Paper-reported global IUCN | ছবি / ক্রেডিট / লাইসেন্স |
|---:|---|---|---|---|---|
| 388 | *Mene maculata* | Carangaria incertae sedis / Menidae | Chan chanda; M/B/R/S | NE | [*Pilok Mene maculata.jpg*](https://commons.wikimedia.org/wiki/File:Pilok_Mene_maculata.jpg), LonNyoe, Madura 2023; CC BY-SA 4.0; 3120×4160 |
| 389 | *Sphyraena barracuda* | Carangaria incertae sedis / Sphyraenidae | Dharkuta; M/B/R/S | LC | [*Banco de gran barracudas…DD 115.jpg*](https://commons.wikimedia.org/wiki/File:Banco_de_gran_barracudas_(Sphyraena_barracuda),_parque_nacional_Ras_Muhammad,_Egipto,_2022-03-27,_DD_115.jpg), Diego Delso, Egypt 2022; CC BY-SA 4.0; 4612×3075 |
| 390 | *Sphyraena chrysotaenia* | Carangaria incertae sedis / Sphyraenidae | Holde dora dharkuta; M/S | NE | [*Sphyraena chrysotaenia Japan.jpg*](https://commons.wikimedia.org/wiki/File:Sphyraena_chrysotaenia_Japan.jpg), re_nebel / iNaturalist, Japan 2021; CC BY 4.0; 1536×2048 |
| 391 | *Sphyraena forsteri* | Carangaria incertae sedis / Sphyraenidae | Dharkuta; M/R/S | NE | [*Sphyraena forsteri 511174059.jpg*](https://commons.wikimedia.org/wiki/File:Sphyraena_forsteri_511174059.jpg), Austen Novis / iNaturalist, Indonesia 2025; CC BY 4.0; 2048×1536 |
| 392 | *Sphyraena jello* | Carangaria incertae sedis / Sphyraenidae | Dharkuta; M/B/R/S | NE | [*Pickhandle barracuda…46722836461.jpg*](https://commons.wikimedia.org/wiki/File:Pickhandle_barracuda_(Sphyraena_jello)_(46722836461).jpg), Rickard Zerpe, Raja Ampat 2019; CC BY 2.0; 4518×3389 |
| 393 | *Sphyraena obtusata* | Carangaria incertae sedis / Sphyraenidae | Dharkuta; M/B/R | NE | [*Barracuda…DD 248.jpg*](https://commons.wikimedia.org/wiki/File:Barracuda_(Sphyraena_obtusata),_Anilao,_Filipinas,_2023-08-22,_DD_248.jpg), Diego Delso, Philippines 2023; CC BY-SA 4.0; 5079×3386 |
| 394 | *Sphyraena putnamae* | Carangaria incertae sedis / Sphyraenidae | Korat dati dharkuta; M/R | LC | [*Sphyraena putnamae 433812195.jpg*](https://commons.wikimedia.org/wiki/File:Sphyraena_putnamae_433812195.jpg), Ashwit Shetty / iNaturalist, India 2024; CC BY 4.0; 1152×2048 |
| 395 | *Sphyraena qenie* | Carangaria incertae sedis / Sphyraenidae | Dharkuta; M/R | NE | [*Sphyraena qenie 366610655.jpg*](https://commons.wikimedia.org/wiki/File:Sphyraena_qenie_366610655.jpg), Debra Baker / iNaturalist, Tuvalu 2024; CC BY 4.0; 1422×1238 |
| 396 | *Xiphias gladius* | Carangiformes / Xiphiidae | Talwar machh; M | LC | [*Espadon (Xiphias gladius)…Ifremer 00764-87622.jpg*](https://commons.wikimedia.org/wiki/File:Espadon_(Xiphias_gladius)_(Ifremer_00764-87622).jpg), Hugues Evano / IFREMER; CC BY 4.0; 3000×3452 |
| 397 | *Istiompax indica* | Carangiformes / Istiophoridae | Kalo talwar; M | DD | [*Istiompax indica 1.png*](https://commons.wikimedia.org/wiki/File:Istiompax_indica_1.png), Michael Janke, modern caught-fish photo; CC BY 3.0; 600×411 (low-resolution limitation noted) |
| 398 | *Istiophorus platypterus* | Carangiformes / Istiophoridae | Pal machh; M | LC | [*Istiophorus platypterus 101956558.jpg*](https://commons.wikimedia.org/wiki/File:Istiophorus_platypterus_101956558.jpg), Robert Webster / iNaturalist; CC BY-SA 4.0; 1536×2048 |
| 401 | *Callionymus margaretae* | Callionymiformes / Callionymidae | Dragonet machh; M | NE | [*Callionymus margaretae…01.jpg*](https://commons.wikimedia.org/wiki/File:Callionymus_margaretae_-_Margaret%27s_dragonet_(%E0%A6%B2%E0%A6%AE%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%B2%E0%A7%87%E0%A6%9C_%E0%A6%A1%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%97%E0%A6%A8_%E0%A6%AC%E0%A6%BE%E0%A6%87%E0%A6%B2%E0%A6%BE_%E0%A6%AE%E0%A6%BE%E0%A6%9B)_01.jpg), JIBON / IMS Museum, University of Chittagong; CC BY-SA 4.0; 3421×5217 |
| 404 | *Diplogrammus goramensis* | Callionymiformes / Callionymidae | Dragonet machh; M/R | NE | [*Goram Dragonet…32423239166.jpg*](https://commons.wikimedia.org/wiki/File:Goram_Dragonet_(Diplogrammus_goramensis)_(32423239166).jpg), Rickard Zerpe, Halmahera 2017; CC BY-SA 2.0; 4608×3456 |
| 409 | *Trichiurus lepturus* | Scombriformes / Trichiuridae | Churi machh; M/B/S | LC | [*Trichiurus lepturus by OpenCage.jpg*](https://commons.wikimedia.org/wiki/File:Trichiurus_lepturus_by_OpenCage.jpg), OpenCage, Osaka Aquarium Kaiyukan; CC BY-SA 2.5; 1000×1000 |

Habitat code: M marine, B brackish water, R reef-associated, S Sundarbans mangrove. Status count: **LC 6, NE 7, DD 1**. License count: CC BY 4.0 5; CC BY-SA 4.0 5; CC BY 2.0 1; CC BY 3.0 1; CC BY-SA 2.0 1; CC BY-SA 2.5 1. সকল ১৪টি Commons file page-এ attribution/license নথিভুক্ত, মিডিয়া registry-তে `verified: true`, unique URL এবং Commons MD5 path checker দিয়ে মিলেছে। Row 397-এর photo low-resolution হলেও exact-taxon/license যাচাই আছে; এই সীমাবদ্ধতা আড়াল করা হয়নি। Row 401-এর University of Chittagong museum file-এর CC BY-SA 4.0 terms file page-এ নিশ্চিত করে credit-সহ গৃহীত। Row 409-এর aquarium photo-টিও exact taxon ও CC BY-SA 2.5 file-page metadata অনুযায়ী credited।

**বিষ-নিরাপত্তা:** rows 389–395-এর Sphyraenidae-র সাত record-এ FDA Chapter 6 natural-toxins guidance যোগ করা হয়েছে: FDA barracudas/Sphyraenidae-কে ciguatera fish poisoning-এর সাথে যুক্ত তালিকাভুক্ত করে; বিষঝুঁকি অঞ্চলভিত্তিক এবং একই এলাকার মাছেও পরিমাণ ভিন্ন হতে পারে। এটি **Bangladesh-specific toxin finding নয়**, এবং সে রকম দাবি করা হয়নি। সূত্র: [U.S. FDA, Fish and Fishery Products Hazards and Controls Guidance, Chapter 6 (2019)](https://www.fda.gov/media/80235/download).

**বাদ/মুলতবি row:** 387 *Uraspis uraspis*—সেরা শনাক্ত করা exact-name own-work image 324×137; গ্রহণযোগ্য image নয়। 399 *Callionymus carebares*—শুধু ঐতিহাসিক plate; 400 *C. erythraeus* ও 402 *C. profundus*—exact species Commons photo পাওয়া যায়নি; 403 *C. sagitta*—ফল ঐতিহাসিক plate/scan। 405 *Neoepinnula orientalis*—exact-name photo মাত্র 640×181; বেশি-resolution NOAA image অন্য accepted species *N. americana*, তাই ভুল taxon ব্যবহার নয়। 406 *Eupleurogrammus muticus*—exact result ঐতিহাসিক Ford plate। 407 *Lepturacanthus savala* Batch13-তে আগেই আছে; duplicate নয়। 408 *Trichiurus gangeticus*—eligible exact-species photo মেলেনি। এই কারণে provisional ১৪টি row থেকে বাদ পড়েনি; row 387-কে low-res ছবি দিয়ে জোর করে পূরণ করা হয়নি।

`data/seed/more-fish18.ts` প্রতিটি row-তে checklist, WoRMS, Commons source, accepted taxonomy, Table-I habitat/local name এবং paper-reported global IUCN category নথিভুক্ত করে। `scripts/check-marine-fish-batch18.cjs` ১৪টি direct row, ৩১-key shape, duplicate key, existing seed conflict, WoRMS citation, taxonomy, paper-status, media credit/license, FDA family-level caution এবং Commons MD5 path contract-check করে; `npm test`-এ যুক্ত।

Batch18-এর পরে প্রকৃত সংখ্যা: **1,801 records, 1,552 animals, 272 fish, 1,798 image-bearing records, 1,782 media credits (1,113 verified; 669 pending)**। Audited batch12–18 candidate rows মিলিয়ে cutoff-এর মধ্যে **86 direct row matches**—এটি সম্পূর্ণ 1–712 crosswalk নয়। Rows 716/722 পুরোনো entries-ই রয়ে গেছে, cutoff coverage-এ ধরা হয়নি। কোনো নতুন record 712-এর পরে নয়। **পরবর্তী unseen candidate row 410**। `npm test` (Vitest 26/26 + সব contract), `npx tsc --noEmit`, `npm run lint`, `npm run stats`, `git diff --check` পাস; audit network probe চালানো হয়নি।

## ৪০. সামুদ্রিক মাছ ব্যাচ ১৯ — ১৪টি row crosswalk; ১১টি নতুন canonical record

[Habib & Islam (2021), Supplementary Table-I](https://www.researchgate.net/publication/353032253_An_updated_checklist_of_Marine_Fishes_of_Bangladesh)-এর row 410–419, 421, 423–425 সরাসরি মিলেছে। সব taxon WoRMS-এ accepted, order Scombriformes/family Scombridae। Row 420 ও 422-এর ফাঁক ইচ্ছাকৃত: যথাক্রমে *Scomberomorus guttatus* এবং *S. lineolatus*-এর জন্য Commons exact-name অনুসন্ধানে শুধু ঐতিহাসিক illustration/scan পাওয়া গেছে; মুক্ত-লাইসেন্স আধুনিক exact-taxon photo না থাকায় seed নয়। ১৪টি candidate-এর তিনটি আগের record-এর সাথে একীভূত হয়েছে—row 412 *Euthynnus affinis* (`kawakawa`, পুরোনো record), row 416 *Rastrelliger kanagurta* (`indian-mackerel`, Batch13), row 423 *Thunnus albacares* (`yellowfin-tuna`, legacy seed); তাই **১৪টি row match, কিন্তু মাত্র ১১টি নতুন canonical species**, duplicates নয়। Existing raw entries/media/credits সরানো হয়নি।

| Row | Checklist taxon | WoRMS AphiaID | Table-I common/local name; habitat | Paper global IUCN | Accepted modern image, credit, license |
|---:|---|---:|---|---|---|
| 410 | *Auxis rochei* | [127015](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127015) | Bullet tuna; Tuna machh; M/B/S | LC | [*Auxis rochei rochei in Greece.jpg*](https://commons.wikimedia.org/wiki/File:Auxis_rochei_rochei_in_Greece.jpg), Χρήστος Καραστέργιος; CC BY-SA 3.0; 960×720 |
| 411 | *Auxis thazard* | [127016](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127016) | Frigate tuna; Tuna machh; M | NE | [*Auxis thazard flank2.jpg*](https://commons.wikimedia.org/wiki/File:Auxis_thazard_flank2.jpg), karimhaddad / iNaturalist; CC BY 4.0; 1536×2048 |
| 412 | *Euthynnus affinis* | [219708](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219708) | Kawakawa; Kawa; M/S | LC | [*Euthynnus affinis Hawaii.jpg*](https://commons.wikimedia.org/wiki/File:Euthynnus_affinis_Hawaii.jpg), gonodactylus / iNaturalist; CC BY 4.0; 1536×2048; existing record retained, image registered |
| 413 | *Katsuwonus pelamis* | [127018](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127018) | Skipjack tuna; Tuna machh; M | LC | [*Katsuwonus pelamis Dominican Republic.jpg*](https://commons.wikimedia.org/wiki/File:Katsuwonus_pelamis_Dominican_Republic.jpg), cotterh / iNaturalist; CC BY 4.0; 2048×910 |
| 414 | *Rastrelliger brachysoma* | [273807](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273807) | Indian mackerel; Kauwa, Maitta; M/B/S | DD | [*Rastrel brachy 100812-6025 tdp.jpg*](https://commons.wikimedia.org/wiki/File:Rastrel_brachy_100812-6025_tdp.jpg), Wibowo Djatmiko; CC BY-SA 3.0; 1800×1200 |
| 415 | *Rastrelliger faughni* | [273808](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273808) | Island mackerel; Kauwa, Maitta; M/S | DD | [*Rastrelliger faughni 01.jpg*](https://commons.wikimedia.org/wiki/File:Rastrelliger_faughni_01.jpg), plains-wanderer / iNaturalist; CC BY 4.0; 2048×1536 |
| 416 | *Rastrelliger kanagurta* | [127020](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127020) | Indian mackerel; Kauwa, Maitta; M/S | DD | [*Rastrelliger kanagurta in Aceh.jpg*](https://commons.wikimedia.org/wiki/File:Rastrelliger_kanagurta_in_Aceh.jpg), Si Gam; CC BY-SA 4.0; 960×604; existing Batch13 record retained, candidate image registered in gallery |
| 417 | *Sarda orientalis* | [219713](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219713) | Striped bonito; Tuna; M/S | LC | [*Sarda orientalis…1321388758.jpg*](https://commons.wikimedia.org/wiki/File:Sarda_orientalis_(Temminck_%26_Schlegel,_1844)_1321388758.jpg), Smithsonian NMNH voucher record / GBIF; CC0; 9694×3072. Digital voucher-specimen reference, not a historic book plate |
| 418 | *Scomber australasicus* | [219715](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219715) | Blue mackerel; Maitta; M | LC | [*Scomber australasicus – IMG 9102.jpg*](https://commons.wikimedia.org/wiki/File:Scomber_australasicus_-_IMG_9102.jpg), Brian Gratwicke; CC BY 2.0; 4032×3024; Flickr review confirmed |
| 419 | *Scomberomorus commerson* | [127024](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127024) | Narrow-barred Spanish mackerel; Champa; M/S | NT | [*Scomberomorus commerson Philippines.jpg*](https://commons.wikimedia.org/wiki/File:Scomberomorus_commerson_Philippines.jpg), ppericard / iNaturalist; CC BY 4.0; 2048×1639 |
| 421 | *Scomberomorus koreanus* | [273813](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273813) | Korean seerfish; Maitta; M | LC | [*Scomberomorus koreanus.jpg*](https://commons.wikimedia.org/wiki/File:Scomberomorus_koreanus.jpg), ongzi / iNaturalist; CC BY-SA 4.0; 2048×1536 |
| 423 | *Thunnus albacares* | [127027](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127027) | Yellowfin tuna; Tuna machh; M/B | NT | [*Fish4499 – NOAA Photo Library.jpg*](https://commons.wikimedia.org/wiki/File:Fish4499_-_Flickr_-_NOAA_Photo_Library.jpg), NOAA/NMFS/SEFSC; CC BY 2.0 (also marked U.S. government PD); 2816×2112; existing legacy entry retained |
| 424 | *Thunnus obesus* | [127028](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127028) | Bigeye tuna; Tuna machh; M | VU | [*Thunnus obesus on sampling table.jpg*](https://commons.wikimedia.org/wiki/File:Thunnus_obesus_on_sampling_table.jpg), Allen Shimada / NOAA; Public domain; 1944×2592 |
| 425 | *Thunnus tonggol* | [219722](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219722) | Longtail tuna; Tuna; M | DD | [*Thunnus tonggol (USNM-445331).jpg*](https://commons.wikimedia.org/wiki/File:Thunnus_tonggol_(USNM-445331).jpg), U.S. FDA / Jeff Williams; Public domain; 6016×2260 |

Habitat codes: M marine, B brackish water, S Sundarbans mangrove. Paper category counts: **LC 7, DD 4, NT 2, NE 1, VU 1**; these are Habib & Islam's global/IUCN (2020) values, not Bangladesh national assessments. Row416's existing `conservation: LC` is retained from its prior global assessment; Table-I row416's DD is explicitly retained as the older paper-reported value/source rather than overwriting the existing category. `origin:'native'` means checklist presence, not endemism.

**Image/license and hazard checks:** ১৪টি exact-species Commons file pages and ১৪ distinct file URLs were checked; all media credits are registered `verified: true`, and the independent title-derived MD5 upload paths match. License breakdown: CC BY 4.0 ৫; CC BY-SA 4.0 ২; CC BY-SA 3.0 ২; CC BY 2.0 ২; CC0 ১; Public domain ২. The 248×150 NOAA skipjack thumbnail was rejected in favor of the 2048×910 iNaturalist field photo. The row417 CC0 item is a museum voucher image, not a historic printed plate. Rows 420 and 422 are documented as omitted, not silently filled with old plates.

**Food-safety note:** all ১৪ candidates are Scombridae; records cite [FDA Fish and Fishery Products Hazards and Controls Guidance, Chapter 7](https://www.fda.gov/media/80248/download) for possible scombrotoxin (histamine) formation under time/temperature abuse. The annotation describes a post-harvest handling hazard; it does not claim intrinsic poison or a Bangladesh-specific occurrence/risk.

`scripts/check-marine-fish-batch19.cjs` validates the ১৪ row crosswalk, candidate field shape, one canonical `SPECIES` entry per accepted taxon after dedupe, WoRMS order/family/citations, row-specific checklist citation retention, all ১৪ Commons credits/licenses and MD5 paths, FDA citation, category values and excluded rows. It runs in the `npm test` contract chain. The existing records for rows 412, 416 and 423 are preserved and enriched by the repo's central dedupe/merge behavior; no raw seed or old media entry was removed.

Batch19-এর পরে প্রকৃত সংখ্যা: **1,812 records, 1,563 animals, 283 fish, 1,809 image-bearing records, 1,796 media-credit records (1,127 verified; 669 pending)**. Audited batch12–19 candidates contain **100 distinct direct row matches within row 712**; this is not a full 1–712 crosswalk. Old rows 716/722 remain outside coverage. No record after row 712 was added. **Row426 is absent from Table-I; after row425 it jumps to duplicate-numbered row427. Next unseen checklist row: 427.** `npm test` (Vitest 26/26 + all contract checks), `npx tsc --noEmit`, `npm run lint`, `npm run stats`, `git diff --check` all pass.

## ৪১. সামুদ্রিক মাছ ব্যাচ ২০ — ১৪টি সরাসরি checklist row, ১৪টি নতুন canonical taxon

[Habib & Islam (2021), Supplementary Table-I](https://www.researchgate.net/publication/353032253_An_updated_checklist_of_Marine_Fishes_of_Bangladesh)-এর row 427, 428, 432, 439, 443–447, 449–453 সরাসরি মেলানো হয়েছে। **row426 নেই**; row425-এর পর row427 দুইটি ভিন্ন taxon-এ পুনর্ব্যবহৃত—*Cubiceps whiteleggii* এবং *Ariomma indicum*। দ্বিতীয়টির নাম WoRMS-এ unaccepted; accepted *Ariomma indica* (AphiaID [219752](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219752)) হিসেবে রাখা হয়েছে এবং checklist-এ মুদ্রিত নামটি `otherNames`-এ রক্ষিত। এই ১৪টিই আগের seed-এ অনুপস্থিত—১৪টি নতুন accepted-name canonical record, কোনো আগের raw record/media/credit অপসারণ নয়।

| Row | Accepted taxon (WoRMS AphiaID) | Table-I common/local name; habitat | Paper global IUCN | আধুনিক Commons ছবি; attribution/license |
|---:|---|---|---|---|
| 427 | *Ariomma indica* ([219752](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219752)); checklist name *A. indicum* | Indian driftfish; Makhon chanda; M | NE | [*Ariomma indicum Pakistan.png*](https://commons.wikimedia.org/wiki/File:Ariomma_indicum_Pakistan.png), Hamid Badar Osmany; CC BY 3.0; 600×410; 2014 digital FishBase photo, Pakistan |
| 428 | *Pampus argenteus* ([127075](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127075)) | Silver pomfret; Fali chanda; M/S | NE | [*Pampus argenteus at Nanfangao harbor.jpg*](https://commons.wikimedia.org/wiki/File:Pampus_argenteus_at_Nanfangao_harbor.jpg), Ch.Andrew; CC BY 3.0; 2,272×1,704; 2009 own-work digital field photo |
| 432 | *Parapercis clathrata* ([276987](https://www.marinespecies.org/aphia.php?p=taxdetails&id=276987)) | Latticed sandperch; Bailla machh; M/R | NE | [*Arenal (Parapercis clathrata)…DD 28.jpg*](https://commons.wikimedia.org/wiki/File:Arenal_(Parapercis_clathrata),_Anilao,_Filipinas,_2023-08-24,_DD_28.jpg), Diego Delso; CC BY-SA 4.0; 5,931×3,954; modern 2023 underwater photo |
| 439 | *Uranoscopus dollfusi* ([274036](https://www.marinespecies.org/aphia.php?p=taxdetails&id=274036)) | Dollfus' stargazer; Sagor bailla; M | LC | [*Dollfus' Stargazer – Uranoscopus dollfusi.jpg*](https://commons.wikimedia.org/wiki/File:Dollfus%27_Stargazer_-_Uranoscopus_dollfusi.jpg), Bernd; CC BY-SA 2.0; 4,000×3,000; 2009 Flickr field photograph |
| 443 | *Bodianus neilli* ([273537](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273537)) | Bay of Bengal hogfish; local name not stated; M/R | LC | [*Bodianus neilli 250504007.jpg*](https://commons.wikimedia.org/wiki/File:Bodianus_neilli_250504007.jpg), Donald Davesne / iNaturalist; CC BY 4.0; 1,977×1,145; field photo, Thailand 2022 |
| 444 | *Cheilinus chlorourus* ([218941](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218941)) | Floral wrasse; Kala sundori; M/R | LC | [*Lábrido floral (Cheilinus chlorourus)…DD 230.jpg*](https://commons.wikimedia.org/wiki/File:L%C3%A1brido_floral_(Cheilinus_chlorourus),_Anilao,_Filipinas,_2023-08-25,_DD_230.jpg), Diego Delso; CC BY-SA 4.0; 3,171×2,114; 2023 underwater photo |
| 445 | *Choerodon robustus* ([218950](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218950)) | Robust tuskfish; local name not stated; M/R | NE | [*Choerodon robustus.jpg*](https://commons.wikimedia.org/wiki/File:Choerodon_robustus.jpg), KANNAN K; CC BY 3.0; 2,830×1,313; 2013 digital photograph |
| 446 | *Coris aygula* ([218957](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218957)) | Clown coris; Kala clown; M/R | LC | [*Coris Napoleón de manchas rojas…DD 101.jpg*](https://commons.wikimedia.org/wiki/File:Coris_Napole%C3%B3n_de_manchas_rojas_(Coris_aygula),_mar_Rojo,_Egipto,_2023-04-17,_DD_101.jpg), Diego Delso; CC BY-SA 4.0; 6,348×4,232; 2023 field photo |
| 447 | *Coris gaimard* ([218960](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218960)) | African coris; local name not stated; M/R | LC | [*Lábrido (Coris gaimard)…DD 68.jpg*](https://commons.wikimedia.org/wiki/File:L%C3%A1brido_(Coris_gaimard),_Anilao,_Filipinas,_2023-08-23,_DD_68.jpg), Diego Delso; CC BY-SA 4.0; 6,471×4,314; 2023 underwater field/featured photo |
| 449 | *Halichoeres hortulanus* ([218985](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218985)) | Checkerboard wrasse; Shundori machh; M/R | LC | [*Lábrido tablero a cuadros…DD 43.jpg*](https://commons.wikimedia.org/wiki/File:L%C3%A1brido_tablero_a_cuadros_(Halichoeres_hortulanus),_mar_Rojo,_Egipto,_2023-04-19,_DD_43.jpg), Diego Delso; CC BY-SA 4.0; 6,011×4,007; 2023 field/featured photo |
| 450 | *Hemigymnus fasciatus* ([218999](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218999)) | Barred thicklip; local name not stated; M/R | LC | [*Lábrido (Hemigymnus fasciatus)…DD 222.jpg*](https://commons.wikimedia.org/wiki/File:L%C3%A1brido_(Hemigymnus_fasciatus),_Anilao,_Filipinas,_2023-08-25,_DD_222.jpg), Diego Delso; CC BY-SA 4.0; 5,792×5,792; 2023 underwater featured photo |
| 451 | *Labroides dimidiatus* ([219014](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219014)) | Bluestreak cleaner wrasse; Shundori machh; M | LC | [*Lábrido limpiador común…DD 54.jpg*](https://commons.wikimedia.org/wiki/File:L%C3%A1brido_limpiador_com%C3%BAn_(Labroides_dimidiatus),_islas_Ad_Dimaniyat,_Om%C3%A1n,_2024-08-15,_DD_54.jpg), Diego Delso; CC BY-SA 4.0; 5,221×3,481; 2024 underwater quality photo |
| 452 | *Thalassoma lunare* ([212209](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212209)) | Moon wrasse; Nihola; M/R | NE | [*Lábrido lunar (Thalassoma lunare)…DD 03.jpg*](https://commons.wikimedia.org/wiki/File:L%C3%A1brido_lunar_(Thalassoma_lunare),_Nosy_Tanikely,_Madagascar,_2025-09-20,_DD_03.jpg), Diego Delso; CC BY-SA 4.0; 5,192×2,424; 2025 underwater quality photo |
| 453 | *Bolbometopon muricatum* ([219074](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219074)) | Green humphead parrotfish; Sobuj kujomathatia machh; M/R | VU | [*Bumphead parrotfish (Bolbometopon muricatum)…49509140173.jpg*](https://commons.wikimedia.org/wiki/File:Bumphead_parrotfish_(Bolbometopon_muricatum)_(49509140173).jpg), Rickard Zerpe; CC BY 2.0; 5,184×3,888; 2020 underwater field photo, Raja Ampat |

Habitat codes: M marine, S Sundarbans mangrove, R reef-associated. Paper category counts: **LC 7, NE 6, VU 1**; these are the checklist's global IUCN categories, not a Bangladesh national assessment. Row427's accepted-name correction is documented, not a second checklist occurrence claim. WoRMS REST lookup accepted all 14 record names and their AphiaID/order/family as used in the seed.

**Presence, image and safety checks:** national presence is grounded only in each direct Habib & Islam row, as required; a foreign field-photo location is not presented as Bangladesh collection data. All 14 Commons file pages explicitly provide an author/credit and an allowed license, and each of the 14 verified media records is associated with its candidate. The independent Commons filename-derived MD5 upload subpaths passed the Batch20 checker. License counts: CC BY-SA 4.0 **8**, CC BY 3.0 **3**, CC BY 4.0 **1**, CC BY-SA 2.0 **1**, CC BY 2.0 **1**. The *Uranoscopus dollfusi* note warns about the strong spine while preserving VAPAGuide's uncertainty over venom in *Uranoscopus* outside *U. scaber*; it does not assert confirmed venom in this species and does not transfer an electric-organ claim from *Astroscopus*.

**Screened but not added:** row427 *Cubiceps whiteleggii* had no eligible exact-taxon modern image; row429 *Pampus chinensis* already exists as `rupchanda`; row430 *Champsodon capensis* search surfaced a 1898 historical plate; row431 *Parapercis alboguttata* candidate was only 140×93; row433 lacked an exact-taxon image; row434 *Trichonotus setiger* had a historical 1801 illustration; row436 *Astroscopus guttatus* has no reliable Bangladesh-occurrence evidence in the audited material; row437 *Ichthyscopus lebeck* already exists; row438 had no exact photo; rows440–441 had no eligible exact-taxon photo; row442 *Uranoscopus marmoratus* had a historical 1878 plate; row448 is absent; and row454 *Chlorurus japanensis* is explicitly marked questionable (`#`) by the checklist, so it is not treated as verified Bangladesh presence. Stop-marker 712 remains in force. **Next unflagged candidate row: 455**; it must independently pass presence, taxonomy, modern-photo and license checks before any record is created.

`scripts/check-marine-fish-batch20.cjs` checks the 14-row map, 31-key record shape, new canonical taxa, accepted WoRMS identity/order/family, direct row-specific presence citation, global paper-status counts, dedupe retention, all 14 verified Commons licenses and title-derived MD5 paths, Ariomma synonym mapping, and the scoped/qualified Uranoscopus handling note. It is added to `npm test`'s contract chain.

Batch20-এর পরে প্রকৃত সংখ্যা: **1,826 records, 1,577 animals, 297 fish, 1,823 image-bearing records, 1,810 media-credit records (1,141 verified; 669 pending)**। Batch12–20-এর audited candidate crosswalk-এ row712-এর মধ্যে **114টি distinct direct Table-I row match**; এটি row1–712-এর সম্পূর্ণ crosswalk নয়। Row716/722-এর পুরোনো entry অপরিবর্তিত এবং coverage-এ নয়; নতুন record 712-এর পর যোগ হয়নি। `npm test` (Vitest ২৬/২৬ + সব contract, Batch20 checker-সহ), `npx tsc --noEmit`, `npm run lint`, `npm run stats`, `git diff --check` পাস।


## ৪২. সামুদ্রিক মাছ ব্যাচ ২১ — ১৪টি সরাসরি checklist row, ১৪টি নতুন accepted taxon

Habib & Islam (2021) Supplementary Table-I-এর row 455–478 থেকে candidate বাছাই করা হয়েছে। Table-I-তে সরাসরি উপস্থিতি ও habitat/local-name/global-IUCN মান row ধরে যাচাই; taxonomy WoRMS REST-এ accepted status, AphiaID, order ও family ধরে যাচাই। Checklist-এর paper-global IUCN শ্রেণি বাংলাদেশের জাতীয় threat status নয়। Accepted-name WoRMS link এবং row-specific Bangladesh-presence citation প্রতিটি record-এ সংরক্ষিত। Row 471-এ checklist spelling *Parupeneus heptacanthus* WoRMS-এ “misspelling - incorrect subsequent spelling”; accepted *P. heptacantha* (AphiaID 1841078), checklist spelling `otherNames`-এ অক্ষত।

| Table-I row | WoRMS accepted name (AphiaID) | WoRMS order / family | Table-I local name; habitat | Paper global IUCN | Commons image / attribution; license |
|---:|---|---|---|---|---|
| 455 | *Chlorurus rhakoura* ([277510](https://www.marinespecies.org/aphia.php?p=taxdetails&id=277510)) | Labriformes / Labridae | Kala tia machh; M/B/R | LC | [iNaturalist Thailand 2023](https://commons.wikimedia.org/wiki/File:Chlorurus_rhakoura,_Thailand_imported_from_iNaturalist_photo_254172491.jpg), Pavel Borodin; 864×502; CC BY 4.0 |
| 456 | *Scarus ghobban* ([219127](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219127)) | Labriformes / Labridae | Nil tia machh; M/B/R | LC | [La Paz 2024](https://commons.wikimedia.org/wiki/File:Loro_barbazul_(Scarus_ghobban),_La_Paz,_Baja_California,_M%C3%A9xico,_2024-12-20,_DD_55.jpg), Diego Delso; 4,917×3,278; CC BY-SA 4.0 |
| 457 | *Scarus psittacus* ([219125](https://www.marinespecies.org/aphia.php?p=taxdetails&id=219125)) | Labriformes / Labridae | Tia Machh; M/R | LC | [Madagascar 2025](https://commons.wikimedia.org/wiki/File:Pez_loro_(Scarus_psittacus),_Nosy_Antanimora,_Madagascar,_2025-09-15,_DD_71.jpg), Diego Delso; 4,914×3,276; CC BY-SA 4.0 |
| 458 | *Scarus rivulatus* ([367210](https://www.marinespecies.org/aphia.php?p=taxdetails&id=367210)) | Labriformes / Labridae | Tia machh; M/R | LC | [iNaturalist, Aborek Island 2023](https://commons.wikimedia.org/wiki/File:Scarus_rivulatus,_Aborek_Island_imported_from_iNaturalist_photo_330177773.jpg), Libby Hepburn; 1,910×1,627; CC BY 4.0 |
| 463 | *Gerres filamentosus* ([218524](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218524)) | Gerreiformes / Gerreidae | Dom machh; M/B/F/S | LC | [Thailand 2015](https://commons.wikimedia.org/wiki/File:Gerres_filamentosus_(Cuvier,_1829).jpg), BEDO; 640×426; CC BY-SA 4.0 (modern photo; lower resolution explicitly noted) |
| 467 | *Acropoma japonicum* ([220048](https://www.marinespecies.org/aphia.php?p=taxdetails&id=220048)) | Pempheriformes / Acropomatidae | Samudrik punti mach; M | NE | [FishBase photo](https://commons.wikimedia.org/wiki/File:Acropoma_japonicum.png), Hamid Badar Osmany; 600×309; CC BY 3.0 |
| 469 | *Mulloidichthys vanicolensis* ([218648](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218648)) | Mulliformes / Mullidae | Chhagol machh; M/R | LC | [Zanzibar 2024](https://commons.wikimedia.org/wiki/File:Grupo_de_chivos_de_aleta_amarilla_(Mulloidichthys_vanicolensis),_Zanz%C3%ADbar,_Tanzania,_2024-05-31,_DD_72.jpg), Diego Delso; 6,037×4,025; CC BY-SA 4.0 |
| 470 | *Parupeneus forsskali* ([218669](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218669)) | Mulliformes / Mullidae | Chhagol machh; M/B/R/S | NE | [iNaturalist, Egypt 2021](https://commons.wikimedia.org/wiki/File:Parupeneus_forsskali,_Dibab,_Rode_Zee,_EG_imported_from_iNaturalist_photo_151388649.jpg), jeanpaulboerekamps; 2,048×962; CC0 1.0 |
| 471 | *Parupeneus heptacantha* ([1841078](https://www.marinespecies.org/aphia.php?p=taxdetails&id=1841078)) | Mulliformes / Mullidae | Chhagol machh; M/B/R/S | LC | [Halmahera 2017](https://commons.wikimedia.org/wiki/File:Cinnabar_goatfish_(Parupeneus_heptacanthus)_(38411454182).jpg), Rickard Zerpe; 4,608×3,456; CC BY 2.0 |
| 472 | *Upeneus japonicus* ([218694](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218694)) | Mulliformes / Mullidae | Chhagol machh; M/R | NE | [Himeji Aquarium 2007](https://commons.wikimedia.org/wiki/File:Upeneus_japonicus_by_OpenCage.jpg), OpenCage; 2,447×2,448; CC BY-SA 2.5 (photograph, not illustration) |
| 473 | *Upeneus moluccensis* ([126989](https://www.marinespecies.org/aphia.php?p=taxdetails&id=126989)) | Mulliformes / Mullidae | Sonalidagi chagol mach; M/B/R/S | LC | [iNaturalist, Davao 2018](https://commons.wikimedia.org/wiki/File:Upeneus_moluccensis_Davao.jpg), greg3ph; 1,536×2,048; CC BY 4.0 |
| 475 | *Upeneus sundaicus* ([273673](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273673)) | Mulliformes / Mullidae | Sonali bata; M/B | LC | [Lembeh 2018](https://commons.wikimedia.org/wiki/File:Ochrebanded_goatfish_(Upeneus_sundaicus)_(45259705962).jpg), Rickard Zerpe; 4,097×3,073; CC BY 2.0 |
| 477 | *Upeneus taeniopterus* ([218685](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218685)) | Mulliformes / Mullidae | Chhagol machh; M/R/S | LC | [FishBase photo](https://commons.wikimedia.org/wiki/File:Upeneus_taeniopterus.jpg), Roberto Pillon; 800×600; CC BY 3.0 |
| 478 | *Upeneus tragula* ([218689](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218689)) | Mulliformes / Mullidae | Sonali bata; M/B/R | LC | [Anilao 2023](https://commons.wikimedia.org/wiki/File:Salmonete_oriental_(Upeneus_tragula),_Anilao,_Filipinas,_2023-08-23,_DD_109.jpg), Diego Delso; 4,374×2,916; CC BY-SA 4.0 |

Habitat codes: M marine, B brackish, F freshwater, R reef-associated, S Sundarbans mangrove. Paper global-status totals: **LC 11, NE 3**. License totals: CC BY-SA 4.0 **5**, CC BY 4.0 **3**, CC BY 3.0 **2**, CC BY 2.0 **2**, CC BY-SA 2.5 **1**, CC0 **1**. All 14 Commons pages were reviewed for subject, author/credit, license and dimensions; all 14 records have verified credit entries. Commons MD5-derived upload paths are checked in the batch contract. Checklist membership alone supports Bangladesh presence; foreign photo locations are not asserted to be Bangladesh collection sites. Table-I does not provide the species-specific details omitted in the generated seed fields, and those details are marked unknown rather than inferred.

**Screened but omitted / next:** row454 *Chlorurus japanensis* remains explicitly questionable (`#`); row459 *Scarus zufar*, row461 *Gerres argyreus* and row464 *G. infasciatus* lacked eligible exact-name Commons photos; row462 *G. erythrourus* results were not an eligible modern exact-taxon photograph; row465 *G. oblongus* surfaced historical/low-resolution images; rows460 *Lates calcarifer*, 466 *Pentaprion longimanus* and 474 *Upeneus sulphureus* are already represented by existing seed records and were not duplicated; row468 *Synagrops japonicus* candidate was only 600×203; row476 *U. supravittatus* had no exact-name Commons file in the screen. A Cyprus *P. forsskali* candidate with a conflicting English caption was not used; the selected file is the separately reviewed, exact-name iNaturalist/CC0 image. Row479 *U. vittatus* is the next unreviewed candidate. No record beyond the row712 stop-marker was added.

`scripts/check-marine-fish-batch21.cjs` is in `npm test`'s contract chain and checks 14 row matches, all-new accepted names against fish batches 1–20, exact WoRMS AphiaIDs/order/family, checklist citations, 31-key record shape, category values, 14 registered verified open licenses, and all 14 Commons MD5 upload paths. The checker also preserves the checklist's row471 spelling as an alternate name. Verification passed: Vitest **26/26**, all contract checks including Batch21, `npx tsc --noEmit`, `npm run lint`, `npm run stats`, and `git diff --check`.

Batch21-এর পরে প্রকৃত সংখ্যা: **1,840 records, 1,591 animals, 311 fish, 1,837 image-bearing records, 1,824 media-credit records (1,155 verified; 669 pending)**। Batch12–21-এর audited candidate crosswalk-এ row712-এর মধ্যে **128টি distinct direct Table-I row match**; এটি row1–712-এর সম্পূর্ণ crosswalk নয়। Row716/722-এর পুরোনো entry অক্ষত এবং coverage-এ নয়। পরবর্তী candidate row479; stop-marker 712 বহাল।
## 43. সামুদ্রিক মাছ ব্যাচ ২২ — ১৪টি সরাসরি checklist row, ১৪টি নতুন accepted taxon

Habib & Islam (2021) Supplementary Table-I-এর row 479–497 সরাসরি PDF-এর extracted table text-এর সাথে মিলিয়ে স্ক্রিন করা হয়েছে। Table-I-তে বাংলাদেশের সামুদ্রিক মাছ হিসেবে উপস্থিতি Bangladesh-occurrence evidence; ছবির বিদেশি স্থানকে বাংলাদেশি collection locality বলা হয়নি। WoRMS REST-এর exact-name result-এ ১৪টি নির্বাচিত নামই `accepted`; প্রতিটি record-এ WoRMS AphiaID এবং order/family source রাখা হয়েছে। Paper-এর global IUCN শ্রেণি জাতীয় মূল্যায়ন নয়—প্রবন্ধ নিজেই বলে বাংলাদেশের local conservation status তখনও মূল্যায়িত হয়নি।

| Table-I row | WoRMS accepted name (AphiaID) | WoRMS order / family | Table-I local name; habitat | Paper global IUCN | Commons image / attribution; license |
|---:|---|---|---|---|---|
| 482 | *Kyphosus cinerascens* ([218708](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218708)) | Centrarchiformes / Kyphosidae | Kalafuni, Bida machh; M/R | LC | [Réunion 2021](https://commons.wikimedia.org/wiki/File:Kyphosus_cinerascens_R%C3%A9union_2.jpg), Philippe Bourjon; 1,200×857; CC BY-SA 4.0; Wikimedia VRT permission |
| 483 | *Kyphosus vaigiensis* ([218706](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218706)) | Centrarchiformes / Kyphosidae | Bida machh; M | LC | [Ad Dimaniyat, Oman 2024](https://commons.wikimedia.org/wiki/File:Chopa_(Kyphosus_vaigiensis),_islas_Ad_Dimaniyat,_Om%C3%A1n,_2024-08-13,_DD_115.jpg), Diego Delso; 5,821×3,881; CC BY-SA 4.0 |
| 484 | *Pelates quadrilineatus* ([127077](https://www.marinespecies.org/aphia.php?p=taxdetails&id=127077)) | Centrarchiformes / Terapontidae | Barguni; M/B/R | NE | [IMS Museum specimen photo](https://commons.wikimedia.org/wiki/File:Pelates_quadrilineatus_-_Fourlined_terapon_(বরগুনি_মাছ)_01.jpg), JIBON; 3,087×4,654; CC BY-SA 4.0 |
| 486 | *Terapon theraps* ([218349](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218349)) | Centrarchiformes / Terapontidae | Barguni; M/B/F/R/S | LC | [iNaturalist Thailand 2023](https://commons.wikimedia.org/wiki/File:Terapon_theraps_326862448.jpg), portioid; 1,747×1,439; CC BY-SA 4.0 |
| 487 | *Cephalopholis boenak* ([218182](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218182)) | Perciformes / Epinephelidae | Chitra bole; M/R | LC | [Madagascar 2025](https://commons.wikimedia.org/wiki/File:Serr%C3%A1nido_(Cephalopholis_boenak),_Nosy_Tanikely,_Madagascar,_2025-09-20,_DD_09.jpg), Diego Delso; 5,851×3,901; CC BY-SA 4.0; Quality image |
| 488 | *Cephalopholis formosa* ([218190](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218190)) | Perciformes / Epinephelidae | Neel Dagi Bole; M/R | LC | [iNaturalist Thailand 2023](https://commons.wikimedia.org/wiki/File:Cephalopholis_formosa_333914688.jpg), portioid; 2,048×1,651; CC BY-SA 4.0 |
| 489 | *Cephalopholis miniata* ([218184](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218184)) | Perciformes / Epinephelidae | Bole Machh; M/R/S | LC | [Zanzibar 2024](https://commons.wikimedia.org/wiki/File:Cierva_coral_(Cephalopholis_miniata),_Zanz%C3%ADbar,_Tanzania,_2024-05-30,_DD_14.jpg), Diego Delso; 6,059×4,039; CC BY-SA 4.0; Quality image |
| 490 | *Cephalopholis sonnerati* ([218183](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218183)) | Perciformes / Epinephelidae | Chatki; M/R | LC | [Mauritius](https://commons.wikimedia.org/wiki/File:Cephalopholis_sonnerati_in_Mauritius.jpg), Alain Feulvarch; 1,280×851; CC BY-SA 4.0 |
| 492 | *Cromileptes altivelis* ([218193](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218193)) | Perciformes / Epinephelidae | Kalophotshada bole; M/R | DD | [Lembeh, Indonesia 2018](https://commons.wikimedia.org/wiki/File:Humpback_grouper_(Cromileptes_altivelis)_(38933783460).jpg), Rickard Zerpe; 3,516×2,637; CC BY 2.0 |
| 493 | *Epinephelus bleekeri* ([273838](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273838)) | Perciformes / Epinephelidae | Bole macch; M | NT | [iNaturalist Indonesia 2024](https://commons.wikimedia.org/wiki/File:Epinephelus_bleekeri,_Indonesia_imported_from_iNaturalist_photo_361046125.jpg), portioid; 1,427×2,048; CC BY 4.0 |
| 494 | *Epinephelus chlorostigma* ([218199](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218199)) | Perciformes / Epinephelidae | Badami bole; M/R | LC | [New Caledonia 2009](https://commons.wikimedia.org/wiki/File:Epinephelus_chlorostigma_2.JPG), Jean-Lou Justine; 640×319; CC BY-SA 3.0 (modern photograph; modest resolution explicitly noted) |
| 495 | *Epinephelus coioides* ([218200](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218200)) | Perciformes / Epinephelidae | Futki bole; M/B/R/S | LC | [Philippines 2017](https://commons.wikimedia.org/wiki/File:Epinephelus_coioides_(Orange_spotted_grouper)_in_the_Philippines.jpg), Obsidian Soul; 1,817×654; CC BY-SA 4.0 |
| 496 | *Epinephelus erythrurus* ([273850](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273850)) | Perciformes / Epinephelidae | Chitra bole; M/B/R/S | LC | [iNaturalist Thailand 2023](https://commons.wikimedia.org/wiki/File:Epinephelus_erythrurus_340757330.jpg), portioid; 2,048×1,481; CC BY 4.0 |
| 497 | *Epinephelus fasciatus* ([218207](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218207)) | Perciformes / Epinephelidae | Lal bole; M/B/R/S | LC | [Madagascar 2025](https://commons.wikimedia.org/wiki/File:Mero_de_punta_negra_(Epinephelus_fasciatus),_Nosy_Kalakajoro,_Madagascar,_2025-09-14,_DD_37.jpg), Diego Delso; 4,865×3,243; CC BY-SA 4.0; Quality image candidate |

Habitat codes: M marine, B brackish, F freshwater, R reef-associated, S Sundarbans mangrove. Paper-global category totals: **LC 11, NE 1, DD 1, NT 1**. Verified license totals: CC BY-SA 4.0 **10**, CC BY 4.0 **2**, CC BY 2.0 **1**, CC BY-SA 3.0 **1**. প্রতিটি নির্বাচিত image page-এ taxon, author/credit, license এবং dimensions যাচাই; batch contract ১৪/১৪ media-credit এবং independently derived Commons MD5 path পরীক্ষা করে। Row482-তে একই দ্বীপের একটি কাছাকাছি filename-যুক্ত ফাইলের description-এ *K. vaigiensis* লেখা, তাই সেটি বাদ দিয়ে exact *K. cinerascens* description, depicts statement, category ও VRT-confirmed reuse-license-সহ `Réunion 2` ফাইল নেওয়া হয়েছে। Row494-এর 640×319 ছবি modest-resolution হলেও আধুনিক exact-taxon photograph; স্পষ্টভাবে নোট করে রাখা হয়েছে।

**বাদ / পরবর্তী screening:** row479-এর `Upeneus vittatus.JPG` caption/description আসলে *U. taeniopterus*—ভুল taxon; row480 *Pempheris molucca*-র জন্য ঐতিহাসিক/plate imagery ছাড়া উপযুক্ত আধুনিক Commons photo পাওয়া যায়নি; row481-এ `#` questionable; row485 *Terapon jarbua* seed-এ আগে থেকেই আছে; row491 *Chelidoperca margaritifera*-র exact-taxon মুক্ত-লাইসেন্স Commons ফাইল পাওয়া যায়নি। Batch22-তে ১৪টি নতুন accepted canonical record যোগ হয়েছে; raw seed/media/credit মুছে বা প্রতিস্থাপন করা হয়নি। `scripts/check-marine-fish-batch22.cjs`-এ row-map, 31-key shape, new accepted taxa বনাম fish batches 1–21, WoRMS order/family/AphiaID, source row, IUCN paper category, credit/license registration এবং Commons MD5-path gate আছে; `npm test` contract chain-এ যুক্ত। Row498 পরবর্তী unreviewed candidate; stop-marker 712 বহাল।

## §44 — সামুদ্রিক মাছ Batch 23 (Table-I rows 498–514; ১৪টি নতুন accepted record)

প্রাথমিক crosswalk [Habib & Islam (2021), ResearchGate article/PDF](https://www.researchgate.net/publication/353032253_An_updated_checklist_of_Marine_Fishes_of_Bangladesh)-এর Supplementary Table-I direct row text থেকে; বাংলাদেশে উপস্থিতির ভিত্তি শুধু এই checklist membership। নাম ও taxonomy WoRMS REST-এ accepted status, AphiaID, order ও family মিলিয়ে নেওয়া হয়েছে। Table-এর IUCN label প্রবন্ধের **global** category; বাংলাদেশের জাতীয় IUCN status নয়। Habitat codes: M marine, B brackish, F freshwater, R reef-associated, S Sundarbans mangrove.

| Row | Checklist local name; habitat | Accepted WoRMS taxon (AphiaID) | WoRMS order / family | Paper-global | Commons image — exact page credit, resolution, license |
|---:|---|---|---|---|---|
| 498 | Chitra bole; M/R | *Epinephelus hexagonatus* ([218232](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218232)) | Perciformes / Epinephelidae | LC | [IFREMER Mérou mélifère](https://commons.wikimedia.org/wiki/File:M%C3%A9rou_m%C3%A9lif%C3%A8re_(Epinephelus_hexagonatus)_(Ifremer_00756-86776).jpg), Jerome Huet; 3,872×2,592; CC BY 4.0 |
| 499 | Bol koral; M/B/R/S | *Epinephelus lanceolatus* ([218224](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218224)) | Perciformes / Epinephelidae | DD | [OpenCage](https://commons.wikimedia.org/wiki/File:Epinephelus_lanceolatus_by_OpenCage.jpg); 2,736×2,736; CC BY-SA 2.5; modern Suma Aqualife Park aquarium photo |
| 501 | Bole coral; M/B/R | *Epinephelus malabaricus* ([218206](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218206)) | Perciformes / Epinephelidae | LC | [UShaka Sea World](https://commons.wikimedia.org/wiki/File:Epinephelus_malabaricus_in_UShaka_Sea_World_1098.jpg), Amada44; 4,845×2,484; CC BY 3.0; modern aquarium photo |
| 502 | Guti bole; M/R | *Epinephelus merra* ([218228](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218228)) | Perciformes / Epinephelidae | LC | [IFREMER Mérou gâteau de cire](https://commons.wikimedia.org/wiki/File:M%C3%A9rou_g%C3%A2teau_de_cire_(Epinephelus_merra)_(Ifremer_00764-87556).jpg), Jerome Huet; 3,872×2,592; CC BY 4.0 |
| 503 | Bole coral; M/R | *Epinephelus morrhua* ([218201](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218201)) | Perciformes / Epinephelidae | LC | [IFREMER Mérou comète](https://commons.wikimedia.org/wiki/File:M%C3%A9rou_com%C3%A8te_(Epinephelus_morrhua)_(Ifremer_00764-87557).jpg), Jerome Huet; 4,608×3,456; CC BY 4.0 |
| 504 | Kalo bole; M/R | *Epinephelus polyphekadion* ([218197](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218197)) | Perciformes / Epinephelidae | VU | [Camouflage grouper](https://commons.wikimedia.org/wiki/File:Camouflage_grouper_Epinephelus_polyphekadion_(5816836758).jpg), Paul Asman and Jill Lenoble; 1,393×929; CC BY 2.0; Flickr license-review record |
| 506 | Bol Machh; M/R | *Epinephelus radiatus* ([218222](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218222)) | Perciformes / Epinephelidae | LC | [IFREMER Mérou zébré](https://commons.wikimedia.org/wiki/File:M%C3%A9rou_z%C3%A9br%C3%A9_(Epinephelus_radiatus)_(Ifremer_00764-87558).jpg), Jerome Huet; 4,608×3,456; CC BY 4.0 |
| 507 | Bole; M/R/S | *Epinephelus tauvina* ([218205](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218205)) | Perciformes / Epinephelidae | DD | [Greasy grouper](https://commons.wikimedia.org/wiki/File:Mero_crestado_gris_(Epinephelus_tauvina),_mar_Rojo,_Egipto,_2023-04-18,_DD_68.jpg), Diego Delso; 5,767×3,845; CC BY-SA 4.0 |
| 508 | Choydagi Perch; M/R | *Grammistes sexlineatus* ([211864](https://www.marinespecies.org/aphia.php?p=taxdetails&id=211864)) | Perciformes / Grammistidae | LC | [Goldenstriped soapfish](https://commons.wikimedia.org/wiki/File:Jabonero_de_seis_rayas_(Grammistes_sexlineatus),_Zanz%C3%ADbar,_Tanzania,_2024-06-01,_DD_131.jpg), Diego Delso; 4,429×2,953; CC BY-SA 4.0 |
| 509 | Chitra bole; M | *Plectropomus leopardus* ([218261](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218261)) | Perciformes / Epinephelidae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Plectropomus_leopardus_326868772.jpg), portioid; 2,048×1,395; CC BY-SA 4.0 |
| 510 | Lal koral bole; M | *Plectropomus pessuliferus* ([218265](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218265)) | Perciformes / Epinephelidae | LC | [Roving coral grouper](https://commons.wikimedia.org/wiki/File:Mero_(Plectropomus_pessuliferus),_parque_nacional_Ras_Muhammad,_Egipto,_2022-03-26,_DD_140.jpg), Diego Delso; 2,377×1,585; CC BY-SA 4.0 |
| 511 | Sokedi; M/B/S | *Lactarius lactarius* ([218381](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218381)) | Sphyraeniformes / Lactariidae | NE | [FalseTrevally original](https://commons.wikimedia.org/wiki/File:FalseTrevally.jpg), Ravi Yedavalli; 3,264×2,448; CC BY-SA 3.0; modern commercial catch photographed at Visakhapatnam landing center (2009), not a live field observation; species association cross-checked against the Commons file's use in the *L. lactarius* species article. This high-resolution original replaces an exact-name 640×363 FishBase rendition. |
| 512 | Akali chanda; M/B/F | *Monodactylus argenteus* ([218695](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218695)) | Eupercaria incertae sedis1 / Monodactylidae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Monodactylus_argenteus_173820575.jpg), Lek Khauv; 2,048×1,536; CC BY 4.0 |
| 514 | Tak chanda; M | *Equulites elongatus* ([398517](https://www.marinespecies.org/aphia.php?p=taxdetails&id=398517)) | Gerreiformes / Leiognathidae | NE | [Equulites elongatus](https://commons.wikimedia.org/wiki/File:Equulites_elongatus.jpg), BEDO (Thailand); 640×426; CC BY-SA 4.0; modern own-work photo, modest resolution explicitly noted |

Category counts: **LC 9, DD 2, VU 1, NE 2**. License counts: **CC BY 4.0 5; CC BY-SA 4.0 5; CC BY-SA 2.5 1; CC BY 3.0 1; CC BY 2.0 1; CC BY-SA 3.0 1**. All 14 Commons credits/licenses and upload MD5 directory prefixes are independently checked by `scripts/check-marine-fish-batch23.cjs`; all 14 records have a direct Table-I row citation and WoRMS accepted-taxon URL.

**Food-safety note:** for the 10 grouper records in Epinephelidae, a source-backed, carefully scoped ciguatera caution is included. The [U.S. FDA's 2019 Chapter 6](https://www.fda.gov/media/80235/download) lists grouper among fish associated with ciguatera (using its Serranidae grouping); the record text makes clear this is neither a species-specific toxin diagnosis nor a Bangladesh risk assessment, and says local harvest advisories should govern. No tetrodotoxin, venomous-spine or electric-organ claim is made for this batch.

**Exclusions / hold:** row500 *Epinephelus latifasciatus* — the exact-taxon Commons hit surfaced in this screen was an 1878 historical plate, excluded by the image rule. Row505 *E. quoyanus* is already in the seed. Row513 *Aurigequula fasciata* — the [Commons file](https://commons.wikimedia.org/wiki/File:Aurigequula_fasciata.jpg) title, description, category and caption identify that taxon, but its structured `depicts` item is *Gerres filamentosus*; set aside pending resolution rather than risk misidentification. Row514 is included as the fourteenth eligible record. Row515 is the next candidate; stop-marker 712 remains in force. No existing seed/media/credit entry was removed or overwritten.

## §45 — সামুদ্রিক মাছ Batch 24 (Table-I rows 515–533; ১৪টি নতুন accepted record)

প্রাথমিক row crosswalk [Habib & Islam (2021), ResearchGate article/PDF](https://www.researchgate.net/publication/353032253_An_updated_checklist_of_Marine_Fishes_of_Bangladesh)-এর Supplementary Table-I-তে সরাসরি মিলিয়ে করা। বাংলাদেশে উপস্থিতির ভিত্তি checklist membership; জাতীয় সংরক্ষণ-অবস্থা এই batch-এ নির্ধারণ করা হয়নি। Table-I-এর IUCN কোডগুলো **paper-reported global category**, বাংলাদেশের national IUCN status নয়। পরবর্তীতে কোনো national status যোগ হলে নির্ধারিত একমাত্র উৎস BdFISH-এর ২৫৩-তালিকা। WoRMS REST-এ accepted status, AphiaID, order ও family যাচাই করা হয়েছে। Habitat codes: M marine, B brackish, F freshwater, R reef-associated, S Sundarbans mangrove.

| Row | Table-I name / local name; habitat | Accepted WoRMS taxon (AphiaID) | WoRMS order / family | Paper-global | Commons image — credit, dimensions, license |
|---:|---|---|---|---|---|
| 515 | *Equulites lineolatus*; Tak chanda; M | *Equulites lineolatus* ([713341](https://www.marinespecies.org/aphia.php?p=taxdetails&id=713341)); Commons filename uses synonym *Leiognathus lineolatus* ([218457](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218457)) | Gerreiformes / Leiognathidae | NE | [Karachi photo](https://commons.wikimedia.org/wiki/File:Leiognathus_lineolatus_karachi.jpg), Hamid Badar Osmany; 708×364; CC BY 3.0; modern digital photograph, modest resolution noted |
| 516 | *Eubleekeria splendens*; Katali chanda; M/B | *Eubleekeria splendens* ([398527](https://www.marinespecies.org/aphia.php?p=taxdetails&id=398527)) | Gerreiformes / Leiognathidae | LC | [Eubleekeria splendens](https://commons.wikimedia.org/wiki/File:Eubleekeria_splendens.jpg), BEDO (Thailand); 640×426; CC BY-SA 4.0; modest resolution noted |
| 519 | *Leiognathus equula*; Tak chanda; M/B/F/S | *Leiognathus equula* ([303762](https://www.marinespecies.org/aphia.php?p=taxdetails&id=303762)) | Gerreiformes / Leiognathidae | LC | [Okinawa Churaumi Aquarium](https://commons.wikimedia.org/wiki/File:Leiognathus_equula_Churaumi.jpg), タウナギ; 6,000×4,000; CC0; modern aquarium photo, not a Bangladesh field observation |
| 521 | *Photopectoralis bindus*; komola chanda; M/B/S | *Photopectoralis bindus* ([398536](https://www.marinespecies.org/aphia.php?p=taxdetails&id=398536)) | Gerreiformes / Leiognathidae | NE | [Teknaf museum specimen](https://commons.wikimedia.org/wiki/File:Photopectoralis_bindus_-_Orangefin_ponyfish_(কমলা_চাঁন্দা_মাছ)_01.jpg), JIBON / Wikimedia Bangladesh GLAM; 2,313×4,075; CC BY-SA 4.0; Institute of Marine Sciences Museum, University of Chittagong; Commons description says collected from Teknaf |
| 523 | Table-I *Secutor ruconius*; Thutuni chanda; M/B/F/S | WoRMS treats *Secutor ruconius* ([218463](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218463)) as a superseded combination; accepted *Deveximentum ruconius* ([1805566](https://www.marinespecies.org/aphia.php?p=taxdetails&id=1805566)) | Gerreiformes / Leiognathidae | NE | [Pulau Santan, Banyuwangi](https://commons.wikimedia.org/wiki/File:Secutor_ruconius,_Pulau_Santan,_Banyuwangi,_Indonesia.jpg), D.G.R. Wiadnya; 3,648×2,736; CC BY 4.0; older combination in photo caption is cross-referenced, not used as canonical |
| 524 | *Chaetodon collare*; Lal Lezza projapati Machh; M/R | *Chaetodon collare* ([273330](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273330)) | Chaetodontiformes / Chaetodontidae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Chaetodon_collare_340437732.jpg), portioid; 1,996×1,649; CC BY-SA 4.0; Thailand, 2023 |
| 525 | *Chaetodon decussatus*; Projapati machh; M/R | *Chaetodon decussatus* ([273333](https://www.marinespecies.org/aphia.php?p=taxdetails&id=273333)) | Chaetodontiformes / Chaetodontidae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Chaetodon_decussatus_340634100.jpg), portioid; 2,048×1,586; CC BY 4.0; Thailand, 2023 |
| 526 | *Chaetodon melannotus*; Projapati machh; M/R | *Chaetodon melannotus* ([218743](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218743)) | Chaetodontiformes / Chaetodontidae | LC | [Blackback butterflyfish](https://commons.wikimedia.org/wiki/File:Blackback_Butterflyfish_imported_from_iNaturalist_photo_420769003_on_22_August_2024.jpg), source observer jeanpaulboerekamps; 1,163×1,088; CC0 1.0/no rights reserved |
| 527 | *Chaetodon octofasciatus*; Projapati machh; M/R | *Chaetodon octofasciatus* ([218746](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218746)) | Chaetodontiformes / Chaetodontidae | LC | [Anilao field photo](https://commons.wikimedia.org/wiki/File:Pez_mariposa_de_ocho_franjas_(Chaetodon_octofasciatus),_Anilao,_Filipinas,_2023-08-21,_DD_55.jpg), Diego Delso; 3,215×2,143; CC BY-SA 4.0. Table-I repeats the English label “Indian vagabond butterflyfish” used at row525; this source wording is retained and flagged, while the photo/taxon are explicitly *C. octofasciatus*. |
| 528 | *Chaetodon vagabundus*; Halud projapati machh; M/R | *Chaetodon vagabundus* ([218754](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218754)) | Chaetodontiformes / Chaetodontidae | LC | [Réunion lagoon photo](https://commons.wikimedia.org/wiki/File:Chaetodon_vagabundus_R%C3%A9union.JPG), Philippe Bourjon; 1,200×888; CC BY-SA 3.0; VRT permission ticket 2014091910006014 confirmed |
| 529 | *Heniochus acuminatus*; Dorakata projapati machh; M/B/R | *Heniochus acuminatus* ([218765](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218765)) | Chaetodontiformes / Chaetodontidae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Heniochus_acuminatus_325519380.jpg), portioid; 1,569×2,048; CC BY-SA 4.0; Thailand, 2023 |
| 530 | *Heniochus singularius*; Projapati machh; M/R | *Heniochus singularius* ([218766](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218766)) | Chaetodontiformes / Chaetodontidae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Heniochus_singularius_340761567.jpg), portioid; 1,882×2,048; CC BY-SA 4.0; Thailand, 2023 |
| 531 | *Parachaetodon ocellatus*; Dorakata projapati machh; M/R | *Parachaetodon ocellatus* ([282012](https://www.marinespecies.org/aphia.php?p=taxdetails&id=282012)) | Chaetodontiformes / Chaetodontidae | LC | [Reef Life Survey](https://commons.wikimedia.org/wiki/File:Parachaetodon_ocellatusRLS.jpg), Graham Edgar / Reef Life Survey; 1,100×733; CC BY 3.0; modern survey photo, Dampier Marine Park, Australia |
| 533 | *Pomacanthus annularis*; Dudhkomol; M/R | *Pomacanthus annularis* ([220004](https://www.marinespecies.org/aphia.php?p=taxdetails&id=220004)) | Chaetodontiformes / Pomacanthidae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Pomacanthus_annularis_189391634.jpg), luluchouette; 1,574×989; CC BY 4.0; Myanmar, 2021; regional image identity only, not Bangladesh occurrence evidence |

Global paper-category totals: **LC 11, NE 3**. Verified license totals: CC BY-SA 4.0 **6**, CC BY 4.0 **3**, CC BY 3.0 **2**, CC0 **2**, CC BY-SA 3.0 **1** (14 images total). Batch24 checker independently enforces 14 direct row citations, accepted-name taxonomy/AphiaIDs, 14 named image credits and licenses, and Commons MD5 upload paths. The record-level conservation field explicitly reports only the paper-global code, not a Bangladesh national status. No tetrodotoxin, venomous-spine or electric-organ hazard claim is made in this batch.

**Excluded / already represented:** row517 *Gazza minuta* already exists in prior seeds. Row518 *Leiognathus brevirostris* surfaced an exact-name 300×255 photo; row520 *Nuchequula gerreoides* surfaced a 300×225 photo; row522 *Secutor insidiator* has a surfaced exact-name CSIRO image only 567×377; row532 *Roa jayakari* candidates were 450×403 and 501×547. These lower-resolution options were left out in favor of stronger eligible later rows. Row533 was selected after row531 to complete 14 records without relaxing the photo-quality screen. Batch24 rows are **515, 516, 519, 521, 523–531, 533**; cumulative Batch12–24 direct Table-I row matches **170**. Row534 is next, and stop-marker712 remains in force. No earlier raw seed, media or credit entry was removed or overwritten.

## ৪৬) Marine fish batch 25 — Pomacanthidae/Pomacentridae (Table-I rows 534–548)

Habib & Islam (2021)-এর Supplementary Table-I থেকে rows **534–536, 538–548**-এর ১৪টি প্রার্থী যাচাই করে যোগ করা হয়েছে। Row537 *Abudefduf bengalensis* আগের seed-এ একবার আছে, তাই পুনরায় যোগ হয়নি। Table-এর স্থানীয় নাম, habitat code ও paper-global IUCN category হুবহু crosswalk করা হয়েছে; এগুলো বাংলাদেশের জাতীয় conservation status নয়। WoRMS accepted AphiaID/order/family সরাসরি যাচাই করা হয়েছে—Pomacanthidae-র order `Chaetodontiformes`, আর এই WoRMS records-এ Pomacentridae-র order `Ovalentaria incertae sedis`; দুই family-কে একই order-এ জোর করে এক করা হয়নি।

| Table-I row | Accepted taxon (WoRMS AphiaID) | Table-I local name; habitat | WoRMS order / family | Paper-global category | Reviewed image evidence; author; license |
|---:|---|---|---|---|---|
| 534 | *Pomacanthus imperator* ([220001](https://www.marinespecies.org/aphia.php?p=taxdetails&id=220001)) | Raja dudhkomol; M, R | Chaetodontiformes / Pomacanthidae | LC | [Ad Dimaniyat Islands, Oman (2024)](https://commons.wikimedia.org/wiki/File:Pez_%C3%A1ngel_emperador_(Pomacanthus_imperator),_islas_Ad_Dimaniyat,_Om%C3%A1n,_2024-08-14,_DD_47.jpg), Diego Delso; 3,834×2,556; CC BY-SA 4.0 |
| 535 | *Pomacanthus semicirculatus* ([220003](https://www.marinespecies.org/aphia.php?p=taxdetails&id=220003)) | Dudhkomol; M, R | Chaetodontiformes / Pomacanthidae | LC | [Underwater field photo](https://commons.wikimedia.org/wiki/File:Semicircle_angelfish_(Pomacanthus_semicirculatus)_(46982094644).jpg), Rickard Zerpe; 3,140×2,355; CC BY 2.0 |
| 536 | *Pomacanthus sexstriatus* ([276026](https://www.marinespecies.org/aphia.php?p=taxdetails&id=276026)) | Chhoi dagi dudhkomol; M, R | Chaetodontiformes / Pomacanthidae | LC | [Maratua, Indonesia field photo](https://commons.wikimedia.org/wiki/File:Maratua_Pomacanthus_sexstriatus_(33).jpg), Nanosanchez; 2,000×1,336; CC BY-SA 4.0. Paper labels this as “Present study” and includes it in the Saint Martin’s Island Fig. 3. |
| 538 | *Abudefduf septemfasciatus* ([212878](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212878)) | Pathari; M, R | Ovalentaria incertae sedis / Pomacentridae | LC | [Modern field photo](https://commons.wikimedia.org/wiki/File:Abudefduf_septemfasciatus_582210382.jpg), Susan Prior / iNaturalist; 1,500×1,500; CC BY 4.0 |
| 539 | *Abudefduf sexfasciatus* ([159289](https://www.marinespecies.org/aphia.php?p=taxdetails&id=159289)) | Pathari; M, R | Ovalentaria incertae sedis / Pomacentridae | NE | [Japan field photo](https://commons.wikimedia.org/wiki/File:Abudefduf_sexfasciatus_341062205.jpg), Hugo Innes / iNaturalist; 2,048×1,536; CC BY 4.0 |
| 540 | *Abudefduf sordidus* ([212888](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212888)) | Pathari; M, B, R | Ovalentaria incertae sedis / Pomacentridae | LC | [Blackspot Sergeant](https://commons.wikimedia.org/wiki/File:Blackspot_Sergeant_imported_from_iNaturalist_photo_420766459_on_23_August_2024.jpg), Jean-Paul Boerekamps / iNaturalist; 1,910×1,992; CC0/no rights reserved |
| 541 | *Abudefduf vaigiensis* ([212879](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212879)) | Pathari; M, R | Ovalentaria incertae sedis / Pomacentridae | LC | [Zanzibar, Tanzania underwater photo](https://commons.wikimedia.org/wiki/File:Sargento_mayor_del_Pac%C3%ADfico_(Abudefduf_vaigiensis),_Zanz%C3%ADbar,_Tanzania,_2024-05-31,_DD_84.jpg), Diego Delso; 3,452×2,301; CC BY-SA 4.0 |
| 542 | *Amphiprion ephippium* ([212782](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212782)) | Mudhah; M, R | Ovalentaria incertae sedis / Pomacentridae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Amphiprion_ephippium_341445553.jpg), portioid; 2,022×1,829; CC BY-SA 4.0 |
| 543 | *Amphiprion percula* ([278402](https://www.marinespecies.org/aphia.php?p=taxdetails&id=278402)) | Parri Mach; M, R | Ovalentaria incertae sedis / Pomacentridae | NE | [Sea Life Melbourne Aquarium](https://commons.wikimedia.org/wiki/File:Clown_anemonefish_(Amphiprion_percula)_at_Sea_Life_Melbourne_Aquarium.jpg), fir0002; 5,699×3,799; CC BY-SA 4.0; captive aquarium image, explicitly not a wild Bangladesh sighting |
| 544 | *Cheiloprion labiatus* ([280136](https://www.marinespecies.org/aphia.php?p=taxdetails&id=280136)) | Mudhah; M, R | Ovalentaria incertae sedis / Pomacentridae | NE | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Cheiloprion_labiatus_564517253.jpg), Debra Baker; 996×738; CC BY 4.0; modest resolution explicitly recorded |
| 545 | *Chromis cinerascens* ([212815](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212815)) | Pettoli; M, R | Ovalentaria incertae sedis / Pomacentridae | LC | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Chromis_cinerascens_329916637.jpg), portioid; 2,048×1,506; CC BY-SA 4.0. Table labels row “Present Study”; this species is also shown as a new Bangladesh record in Fig. 2. |
| 546 | *Chromis ternatensis* ([212810](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212810)) | Pettoli; M, R | Ovalentaria incertae sedis / Pomacentridae | NE | [iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Chromis_ternatensis_329666517.jpg), Donald Davesne; 2,048×1,536; CC BY 4.0 |
| 547 | *Chromis viridis* ([212811](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212811)) | Neelima; M, R | Ovalentaria incertae sedis / Pomacentridae | NE | [Kiribati field photo](https://commons.wikimedia.org/wiki/File:Blue-green_Chromis,_Kiribati_imported_from_iNaturalist_photo_345755248.jpg), Debra Baker / iNaturalist; 1,938×1,484; CC BY 4.0 |
| 548 | *Chrysiptera brownriggii* ([276827](https://www.marinespecies.org/aphia.php?p=taxdetails&id=276827)) | Pettoli; M, R | Ovalentaria incertae sedis / Pomacentridae | NE | [Réunion field photo](https://commons.wikimedia.org/wiki/File:Chrysiptera_brownriggii_R%C3%A9union.jpg), Philippe Bourjon; 1,200×984; CC BY-SA 4.0; Commons permission ticket 2014091910006014 |

Paper-global categories: **LC 8, NE 6**. Image licenses: CC BY-SA 4.0 **7**, CC BY 4.0 **5**, CC BY 2.0 **1**, CC0 **1** (14 images). Checker enforces exact rows 534–536/538–548, prior retention of row537, unique accepted taxa and Bengali display names, WoRMS AphiaID/order/family, paper-global status, verified image credit/license and all 14 Commons MD5 upload paths. No national IUCN claim was introduced. The aquarium setting for *A. percula* is disclosed; no venom, tetrodotoxin, spine-injury or electric-organ hazard claim is relevant to this batch.

**Next / boundary:** Batch25 adds 14 direct checklist matches, bringing the audited Batch12–25 cumulative total to **184**; row549 is the next candidate. Row712 remains the hard stop marker. No earlier raw seed, media, or credit record was deleted or overwritten.

## ৪৭) Marine fish batch 26 — Pomacentridae continued (Table-I rows 549–566)

Supplementary Table-I-এর rows **549–566** যাচাই করে ১৪টি record যোগ: **549–554, 556, 558–559, 561–564, 566**। Pomacentridae-র জন্য WoRMS-এর প্রতিটি accepted record-এ order `Ovalentaria incertae sedis` (কোনো একক universal order ধরে নেওয়া নয়)। Row564-এর checklist *Premnas biaculeatus* এখন WoRMS accepted *Amphiprion biaculeatus*; row566-এর *Stegastes fasciolatus* এখন accepted *Plectroglyphidodon fasciolatus*—দুই checklist form `otherNames` ও আলাদা WoRMS mapping source-এ অক্ষত।

| Row | Accepted taxon (WoRMS AphiaID) | Table-I local name; habitat | Paper-global | Commons identity/source; dimensions; credit; license |
|---:|---|---|---|---|
| 549 | *Chrysiptera unimaculata* ([218782](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218782)) | Pettoli; M | LC | [Réunion underwater photo](https://commons.wikimedia.org/wiki/File:Chrysiptera_unimaculata.JPG), Philippe Bourjon; 1,200×939; CC BY-SA 3.0; VRT ticket 2014091910006014 |
| 550 | *Dascyllus marginatus* ([212849](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212849)) | Pandua; M, R | NE | [Red Sea, Egypt (2023)](https://commons.wikimedia.org/wiki/File:Pomac%C3%A9ntrido_(Dascyllus_marginatus),_mar_Rojo,_Egipto,_2023-04-19,_DD_46.jpg), Diego Delso; 2,702×1,801; CC BY-SA 4.0 |
| 551 | *Dischistodus perspicillatus* ([280563](https://www.marinespecies.org/aphia.php?p=taxdetails&id=280563)) | Aphoo; M, B, R | NE | [Lembeh juvenile field photo](https://commons.wikimedia.org/wiki/File:White_damsel_(Dischistodus_perspicillatus)_(40321696762).jpg), Rickard Zerpe; 3,644×2,733; CC BY 2.0 |
| 552 | *Dischistodus prosopotaenia* ([280564](https://www.marinespecies.org/aphia.php?p=taxdetails&id=280564)) | Pettoli; M, B, R | NE | [Great Barrier Reef / Reef Life Survey](https://commons.wikimedia.org/wiki/File:DischistProsopotaenRLS.jpg), Graham Edgar / RLS; 1,309×873; CC BY 3.0 |
| 553 | *Neopomacentrus azysron* ([218837](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218837)) | Pettoli; M, R | NE | [Yellowtail demoiselle field photo](https://commons.wikimedia.org/wiki/File:Neopomacentrus_azysron_Yellowtail_Demoiselle.jpg), Paul Asman and Jill Lenoble; 2,323×1,549; CC BY 2.0 |
| 554 | *Neopomacentrus cyanomos* ([218839](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218839)) | Pettoli; M, R | VU | [Nosy Sakatia, Madagascar (2025)](https://commons.wikimedia.org/wiki/File:Pomac%C3%A9ntrido_(Neopomacentrus_cyanomos),_Nosy_Sakatia,_Madagascar,_2025-09-18,_DD_29.jpg), Diego Delso; 4,757×3,171; CC BY-SA 4.0 |
| 556 | *Pomacentrus adelus* ([277127](https://www.marinespecies.org/aphia.php?p=taxdetails&id=277127)) | Pettoli; M, R | NE | [Ba, Fiji field photo](https://commons.wikimedia.org/wiki/File:PomacentAdel3MarkRosenstein.jpg), Mark Rosenstein; 1,300×868; CC BY-SA 3.0 |
| 558 | *Pomacentrus caeruleus* ([212993](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212993)) | Pettoli; M, R | NE | [Mayotte underwater image](https://commons.wikimedia.org/wiki/File:Clowns_de_Mayotte.jpg), Frédéric Ducarme; 4,000×3,000; caption explicitly identifies *P. caeruleus* among the fish pictured; CC BY-SA 4.0 |
| 559 | *Pomacentrus coelestis* ([277145](https://www.marinespecies.org/aphia.php?p=taxdetails&id=277145)) | Pettoli; M, R | NE | [Anilao, Philippines (2023)](https://commons.wikimedia.org/wiki/File:Damisela_ne%C3%B3n_(Pomacentrus_coelestis),_Anilao,_Filipinas,_2023-08-23,_DD_45.jpg), Diego Delso; 2,282×1,521; CC BY-SA 4.0 |
| 561 | *Pomacentrus similis* ([277170](https://www.marinespecies.org/aphia.php?p=taxdetails&id=277170)) | Pettoli; M, R | NE | [Thailand iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Pomacentrus_similis_249635529.jpg), Donald Davesne; 1,293×903; CC BY 4.0; modest resolution explicitly noted |
| 562 | *Pomacentrus tripunctatus* ([212968](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212968)) | Aphoo; M, B, R | NE | [Thailand iNaturalist field photo](https://commons.wikimedia.org/wiki/File:Pomacentrus_tripunctatus_264306609.jpg), Sönke Bonde; 2,048×1,365; CC0 1.0 |
| 563 | *Pomacentrus vaiuli* ([277176](https://www.marinespecies.org/aphia.php?p=taxdetails&id=277176)) | Pettoli; M, R | NE | [Anilao, Philippines (2023)](https://commons.wikimedia.org/wiki/File:Damita_ocelada_(Pomacentrus_vaiuli),_Anilao,_Filipinas,_2023-08-22,_DD_20.jpg), Diego Delso; 4,913×3,275; CC BY-SA 4.0 |
| 564 | Table-I *Premnas biaculeatus*; accepted *Amphiprion biaculeatus* ([1605249](https://www.marinespecies.org/aphia.php?p=taxdetails&id=1605249)); checklist-name AphiaID [212768](https://www.marinespecies.org/aphia.php?p=taxdetails&id=212768) | Lal clown mach; M, R | NE | [Maroon clownfish](https://commons.wikimedia.org/wiki/File:Maroon_Clown_Fish444.jpg), Benjamint444; 1,067×800; CC BY-SA 3.0 |
| 566 | Table-I *Stegastes fasciolatus*; accepted *Plectroglyphidodon fasciolatus* ([1592381](https://www.marinespecies.org/aphia.php?p=taxdetails&id=1592381)); checklist-name AphiaID [218850](https://www.marinespecies.org/aphia.php?p=taxdetails&id=218850) | Pettoli; M, R | LC | [Norfolk Island iNaturalist photo](https://commons.wikimedia.org/wiki/File:Plectroglyphidodon_fasciolatus,_Emily_Bay,_Kingston_2899,_Norfolk_Island_imported_from_iNaturalist_photo_239784273.jpg); [iNaturalist observation](https://www.inaturalist.org/observations/140112794) identifies *Plectroglyphidodon fasciolatus*; Susan Prior; 1,500×1,500; CC BY 4.0 |

Paper-global categories: **LC 2, NE 11, VU 1**; no national IUCN status was added. Verified license counts: CC BY-SA 4.0 **5**, CC BY-SA 3.0 **3**, CC BY 4.0 **2**, CC BY 2.0 **2**, CC BY 3.0 **1**, CC0 **1**. Batch26 contract verifies 14 distinct Table-I rows and accepted taxa, unique Bengali names, WoRMS IDs/orders/families, catalog survival after dedupe, record-level global-status wording, 14 verified attribution/license entries and 14 Commons MD5 upload paths.

**Not added:** row555 *Neopomacentrus taeniurus* surfaced only historical plates; row557 *Pomacentrus bangladeshius* had no Commons exact-name image; row560 *Pomacentrus proteus* had no eligible exact-name Commons image. Row565 *Pristotis obtusirostris* surfaced an exact 600×449 market/fish photo, below the selected-photo quality floor. Row567 *Stegastes lividus* surfaced only historical plates or a `Copyrighted free use` image, which is not an approved free license; row568 *Stegastes obreptus* has a WoRMS accepted-name change to *Plectroglyphidodon obreptus* (AphiaID 1605254) but no eligible Commons image surfaced. The taxonomy/candidates were recorded without adding those taxa.

Batch26 adds 14 direct Table-I matches; Batch12–26 cumulative audited matches **198**. Next checklist candidate is row565; stop-marker712 remains mandatory. No earlier raw seed, media or credit record was deleted or overwritten.
