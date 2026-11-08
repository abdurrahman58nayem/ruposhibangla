import type { Species } from '@/lib/types'
import { IUCN, IUCN_BD, GBIF, HERPS_BD, SNAKES_BD_2025, REPFOCUS } from './sources'

/**
 * সরীসৃপ সম্প্রসারণ — ধাপ ১১: ৫টি প্রজাতি (২০২৬-১০-২৬)
 *
 * RepFocus বাংলাদেশ চেকলিস্টের ৩৪ চাঙ্ক পুনঃস্ক্যান করে এবং The Reptile
 * Database ও Haidar et al. (2025, Herpetozoa 38: 253–269)-এর সঙ্গে
 * মিলিয়ে যাচাই করা হয়েছে। প্রতিটি ছবির লেখক/লাইসেন্স Commons API
 * (extmetadata) দিয়ে যাচাই করে `media-licenses.ts`-এ নিবন্ধিত
 * (৩টি CC BY 4.0, ২টি CC BY-SA 4.0); কোনো Unidentified-ক্যাটাগরি,
 * পুরোনো বই-চিত্র বা প্রজাতি-অনিশ্চিত ফাইল নেওয়া হয়নি।
 *
 * গোত্র: Elapidae ১, Gekkonidae ১, Eublepharidae ১, Colubridae ২।
 * IUCN: ৩টি LC, ২টি NE (সাম্প্রতিক বিভাজন—এখনো পৃথক মূল্যায়ন হয়নি)।
 *
 * বিশেষ সিদ্ধান্ত:
 *  - Laticauda colubrina Haidar et al. (2025)-এর Table 1-এ #৩৩
 *    নিশ্চিত প্রজাতি হিসেবে অন্তর্ভুক্ত — পূর্ণ verified রেকর্ড।
 *  - aquilonius/proarchos/russelius সাম্প্রতিক প্রজাতি-বিভাজন;
 *    বিদ্যমান bowringii/pictus/arnensis রেকর্ডের সঙ্গে জনতা-ওভারল্যাপ
 *    থাকায় `review` ফ্ল্যাগ ও conflictingInfo-তে স্পষ্ট ক্রস-রেফারেন্স
 *    (verification.ts → UNVERIFIED_REASONS)।
 *  - Eublepharis hardwickii: RepFocus গণ-পাতা “needs confirmation”
 *    সতর্কতা বনাম Reptile DB-তে Chittagong type-locality ও বাংলাদেশ-
 *    অন্তর্ভুক্তি — স্বচ্ছতার জন্য `review`।
 *
 * বাদ-পড়া প্রার্থী (BIODIVERSITY-AUDIT §১৮-এ নথিভুক্ত): Pareas
 * macularius ও Rhabdophis bindi — Reptile DB স্পষ্টভাবে “Not in
 * Bangladesh fide Al Haidar et al. 2025” উল্লেখ করে (যথাক্রমে দক্ষিণ-
 * পূর্ব এশিয়া ও আসাম-ত্রিপুরা-সীমাবদ্ধ); Cuora mouhotii ও Heosemys
 * depressa ধাপ ৯-এর পূর্বেই রেকর্ডভুক্ত ছিল। ছবি-অনুপলব্ধ প্রার্থী
 * (Homalopsis hardwickii, Microcephalophis cantoris, Lycodon zawi,
 * Blythia reticulata প্রভৃতি) ও Haidar-বর্জিত mucrosquamatus/
 * albolabris পূর্ববর্তী ধাপের সিদ্ধান্তেই বহাল।
 */
const COMMONS = (file: string): { title: string; url: string; license: string } => ({
  title: 'ছবির মূল ফাইল — Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${file}`,
  license: 'Wikimedia Commons',
})

export const MORE_REPTILES11: Species[] = [
  {
    slug: 'yellow-lipped-sea-krait', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'হলদে-ঠোঁট সমুদ্র-কেউটে', nameEn: 'Yellow-lipped Sea Krait', scientificName: 'Laticauda colubrina',
    otherNames: ['ইয়েলো-লিপড সি ক্রেইট', 'হলদে-ঠোঁট সামুদ্রিক ক্রেট', 'Laticauda colubrina (Schneider, 1799)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Elapidae', genus: 'Laticauda', species: 'Laticauda colubrina' },
    summary: 'কালো ব্যান্ড-দাগ প্রবল-বিষধর সামুদ্রিক ক্রেট; হলদে ঠোঁট ও চ্যাপ্টা পাখনা-লেজ; ডিম পাড়তে ডাঙায় আসে; Haidar et al. (2025)-এ নিশ্চিত (#৩৩)।',
    description:
      'হলদে-ঠোঁট সমুদ্র-কেউটে বঙ্গোপসাগর-সহ গোটি ইন্দো-প্রশান্ত মহাসাগরীয় অঞ্চলের অর্ধ-সামুদ্রিক বিষধর সাপ; দেহ নলাকার, পিঠ নীলচে-ধূসরে অসংখ্য চওড়া কালো ব্যান্ড, উপরের ঠোঁট স্পষ্ট হলদে, লেজ চ্যাপ্টা-পাখনা-সদৃশ, নাক পাশ-দিকে অবস্থিত। পানির নিচে ঢেল-মাছ শিকার করে, কিন্তু হজম-বিশ্রাম-ডিম-পাড়ার জন্য ডাঙার পাথর-বালিতে ফেরে; স্বভাবে অত্যন্ত শান্ত ও সহনশীল, তবু Elapidae-র স্নায়ু-বিষ অত্যন্ত শক্তিশালী—কখনো ছোঁয়া বা ধরা উচিত নয়; কামড়ালে লক্ষণ দেরিতে দেখা দিলেও দেরি না করে দ্রুত অ্যান্টিভেনমসহ হাসপাতালে যেতে হবে। Das (1996) ও Khan (2004)-এ বাংলাদেশে নথিভুক্ত, এবং Haidar et al. (2025)-র নিশ্চিত ৮৯ সাপের তালিকায় (#৩৩) স্থান পেয়েছে; সেন্টমার্টিন-টেকনাফ উপকূলেই সম্ভাব্য প্রধান ঘাঁটি। বিশ্ব IUCN: ন্যূনতম বিপদগ্রস্ত (LC)।',
    physical: 'দৈর্ঘ্য পুরুষে গড়ে ০.৮৮ মিটার, স্ত্রীতে ১.৪ মিটার পর্যন্ত; নীলচে-ধূসর দেহে কালো ব্যান্ড, হলদে ঠোঁট, চ্যাপ্টা পাখনা-লেজ।',
    identification: 'নীলচে-ধূসর দেহে চওড়া কালো ব্যান্ড ও স্পষ্ট হলদে উপর-ঠোঁট; নীল-ঠোঁট ক্রেট (L. laticaudata)-র কালচে ঠোঁট থেকে আলাদা।',
    diet: 'প্রধানত ব্যাঙ্গাড়-ইল ও পানির ঢেল-মাছ; কদাচিৎ ছোট মাছ-কাঁকড়া।',
    behavior: 'অর্ধ-সামুদ্রিক; দলবদ্ধভাবে ডাঙায় বিশ্রাম; রাতে পানির নিচে শিকার; কামড় অত্যন্ত বিরল।',
    reproduction: 'ডিম পাড়ে (ওভিপারাস); ডাঙার পাথর-গুহা-বালিতে ডিম দেয়।',
    habitat: 'প্রবাল-প্রাচীর, অগভীর উপকূলীয় জল, মোহনা ও ডাঙার পাথুরে-বালির তীর।',
    distribution: 'দক্ষিণ-পূর্ব বঙ্গোপসাগরীয় উপকূল (কক্সবাজার-সেন্টমার্টিন); বিরল দর্শন; বৈশ্বিক বিন্যাস বঙ্গোপসাগর থেকে পশ্চিম প্রশান্ত মহাসাগর পর্যন্ত।',
    whereToSee: 'সেন্টমার্টিন-টেকনাফের অগভীর জলে জেলে-জালে ধরা পড়া নমুনা (নিরাপদ দূরত্বে); সাধারণ দর্শন নেই।',
    season: 'সারাবছর; উষ্ণ মৌসুমে উপকূলে বেশি।',
    sizeOrHeight: '০.৮৮–১.৪ মিটার',
    ecologicalRole: 'ঢেল-মাছ-নিয়ন্ত্রক শীর্ষ সামুদ্রিক শিকারি; প্রবাল-বাস্তুতন্ত্রের সূচক প্রজাতি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বিশ্ব IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে বিরল ও বিক্ষিপ্ত উপকূলীয় রেকর্ড।',
    threats: 'ট্রল-জালে বাইক্যাচ, উপকূল দূষণ, প্রবাল-ক্ষয়, অজ্ঞতায় হত্যা।',
    conservationActions: 'বিষধর-সচেতনতা (না ছোঁয়া, কামড়ে দ্রুত হাসপাতাল-অ্যান্টিভেনম); বাইক্যাচ-হ্রাস; প্রবাল-উপকূল রক্ষা।',
    colorTags: ['#33414f', '#15181d', '#e4d27a'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Serpiente_marina_de_hocico_ancho_%28Laticauda_colubrina%29%2C_Anilao%2C_Filipinas%2C_2023-08-23%2C_DD_04.jpg',
    dataStatus: 'partial',
    sources: [HERPS_BD, IUCN, IUCN_BD, GBIF, SNAKES_BD_2025, REPFOCUS, COMMONS('Serpiente_marina_de_hocico_ancho_%28Laticauda_colubrina%29%2C_Anilao%2C_Filipinas%2C_2023-08-23%2C_DD_04.jpg')],
  },
  {
    slug: 'northern-smooth-scaled-gecko', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'উত্তরীয় মসৃণ-আঁশ গেকো', nameEn: 'Northern Smooth-scaled Gecko', scientificName: 'Hemidactylus aquilonius',
    otherNames: ['অ্যাকুইলোনিয়াস হেমিড্যাকটাইলাস', 'Kachin Smooth Gecko', 'Hemidactylus aquilonius McMahan & Zug, 2007'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Gekkonidae', genus: 'Hemidactylus', species: 'Hemidactylus aquilonius' },
    summary: 'বাউরিং গেকো-জট থেকে ২০০৭-এ আলাদা করা ছোট মসৃণ-আঁশ গেকো; পূর্বাঞ্চলের ঘর-বাগান-বনপ্রান্তে; RepFocus বাংলাদেশ চেকলিস্টে Rabbe et al. (2022) রেফে নথিভুক্ত; বিশ্বে LC।',
    description:
      'উত্তরীয় মসৃণ-আঁশ গেকো ছোট পাতলা দেহি নিশাচর গেকো; দেহ ফ্যাকাশে-ধূসর-বাদামি, পৃষ্ঠ-আঁশ তুলনামূলক মসৃণ ও সূক্ষ্ম গাঢ়-ছোপ-যুক্ত, পায়ের চোষা-পাতে দেয়াল-গাছ আঁকড়ে ধরে, রাতে পোকা শিকারে বের হয়। McMahan & Zug (2007) মিয়ানমারের নমুনা থেকে H. bowringii জটের অংশ হিসেবে এটি নতুন প্রজাতি হিসেবে বর্ণনা করেন; Purkayastha et al. (2010) দক্ষিণ এশিয়ার জাতীয় তালিকা হালনাগাদ করেন। RepFocus বাংলাদেশ চেকলিস্ট Bauer et al. (2010), Mahony (2011), Rabbe (2017) ও Rabbe et al. (2022)-এর উদ্ধৃতিতে একে অন্তর্ভুক্ত করেছে। গুরুত্বপূর্ণ: বাংলাদেশের জাতীয় চেকলিস্ট ও বিদ্যমান “বাউরিং গেকো” (bowrings-gecko) রেকর্ডে ঐতিহাসিকভাবে একই জনতা bowringii নামে লিপিবদ্ধ—দুটি রেকর্ডের আংশিক ওভারল্যাপ থাকায় এ রেকর্ডটি review-ফ্ল্যাগে রাখা হলো; নমুনাভিত্তিক চূড়ান্ত নাম-নিষ্পত্তি বাকি। বিশ্ব IUCN: ন্যূনতম বিপদগ্রস্ত (LC, Bauer et al. 2018)।',
    physical: 'দৈর্ঘ্য ০.১–০.১২ মিটার; পাতলা ফ্যাকাশে-ধূসর দেহ, মসৃণ পৃষ্ঠ-আঁশ, সূক্ষ্ম ছোপ, চোষা-পা।',
    identification: 'বাউরিং গেকোর অনুরূপ ছোট মসৃণ গেকো; আণবিক/নমুনা-পরীক্ষা ছাড়া মাঠে দুটি নিশ্চিত আলাদা করা কঠিন।',
    diet: 'মশা-মথ-ছোট পোকা, মাকড়সা।',
    behavior: 'নিশাচর; বাতি-কাছে পোকা ধরে; দেয়াল-ছাদ-গাছে চোষা-পায়ে চলে; চিক-চিক ডাক দেয়।',
    reproduction: 'ডিম পাড়ে; সাধারণত ২টি করে ডিম দেয়াল-ফাটল-গাছ-কোটরে।',
    habitat: 'গৃহ-দেয়াল, বাগান-গাছ, গ্রামীণ-নগর কাঠামো, বন-প্রান্ত।',
    distribution: 'বাংলাদেশের পূর্ব-উত্তর-পূর্বাঞ্চল (যমুনার পূর্বদিকে); বৈশ্বিক বিন্যাস উত্তর মিয়ানমার, দক্ষিণ চীন, ভুটান ও উত্তর-পূর্ব ভারত।',
    whereToSee: 'সিলেট-চট্টগ্রাম-ঢাকার ঘর-বাগানের দেয়ালে রাতে (বাউরিং গেকো নামে চেনা নমুনাগুলোর অন্তর্ভুক্ত হতে পারে)।',
    season: 'সারাবছর; উষ্ণ-বর্ষায় বেশি সক্রিয়।',
    sizeOrHeight: '০.১–০.১২ মিটার',
    ecologicalRole: 'ঘর-পরিবেশের পতঙ্গ-নিয়ন্ত্রক; নিশাচর খাদ্যচক্রের অংশ।',
    origin: 'native', conservation: 'LC', conservationBn: 'বিশ্ব IUCN: ন্যূনতম বিপদগ্রস্ত (LC, ২০১৮); বাংলাদেশে bowringii/aquilonius নাম-বিভাজনের চূড়ান্ত নমুনা-নিষ্পত্তি বাকি।',
    threats: 'কীটনাশক, পুরোনো-দেয়াল ভাঙা, অজ্ঞতায় হত্যা, নাম-বিভাজনজনিত তথ্য-অস্পষ্টতা।',
    conservationActions: 'নিরীহ-গেকো সচেতনতা; কীটনাশক কমানো; আবাস-বৈচিত্র্য রক্ষা; নমুনাভিত্তিক শ্রেণিবিন্যাস-জরিপ।',
    colorTags: ['#9a8e78', '#5e5444', '#d4ccbc'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Hemidactylus_aquilonius.jpg',
    dataStatus: 'partial',
    sources: [IUCN, GBIF, REPFOCUS, COMMONS('Hemidactylus_aquilonius.jpg')],
  },
  {
    slug: 'eastern-bronzeback', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'প্রাচ্য দারুশ সাপ', nameEn: 'Eastern Bronzeback', scientificName: 'Dendrelaphis proarchos',
    otherNames: ['নর্দার্ন পেইন্টেড ব্রোঞ্জব্যাক', 'Dendrophis proarchos (পুরোনো নাম)', 'Dendrelaphis proarchos (Wall, 1909)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Colubridae', genus: 'Dendrelaphis', species: 'Dendrelaphis proarchos' },
    summary: 'চিত্রা দারুশ-জট থেকে পুনঃপ্রতিষ্ঠিত সবুজাভ-তামাটে বৃক্ষচর সাপ; পূর্ব-পূর্বাঞ্চলের চিরসবুজ বনে; Reptile DB-তে বাংলাদেশ স্পষ্ট অন্তর্ভুক্ত; IUCN-এ এখনো পৃথক মূল্যায়ন হয়নি (NE)।',
    description:
      'প্রাচ্য দারুশ সাপ সরু, লম্বা-লেজযুক্ত দ্রুতগামী বৃক্ষচর সাপ; পিঠ তামাটে-ব্রোঞ্জ থেকে সবুজাভ-বাদামি, পেট হালকা সবুজ-হলদে, চোখের পেছন থেকে কালো টেম্পোরাল ডোরা ঘাড় পর্যন্ত বিস্তৃত, তার নিচে উজ্জ্বল হালকা ভেন্ট্রোল্যাটারাল ডোরা; পৃষ্ঠকীয় আঁশ বিবর্ধিত। Wall (1909) কর্তৃক বর্ণিত, দীর্ঘদিন D. pictus-এর সমার্থক থাকার পর Vogel & van Rooijen (2011) প্রজাতিটি পুনঃপ্রতিষ্ঠা করেন—উত্তর-পূর্ব ভারত, মিয়ানমার, দক্ষিণ চীন, ইন্দোচীনের জনতাই proarchos। The Reptile Database-র বিন্যাসে বাংলাদেশ স্পষ্টভাবে অন্তর্ভুক্ত এবং Haidar et al. (2025)-ও রেফারেন্সে ব্যবহৃত; RepFocus চেকলিস্ট Rahman & Hossain (2021), Biakzuala et al. (2022) উদ্ধৃত করে। সম্পূর্ণ বিষহীন; টিকটিকি-গিরগিটি শিকার করে। গুরুত্বপূর্ণ: বিদ্যমান “চিত্রা দারুশ সাপ” (painted-bronzeback, D. pictus) রেকর্ডের সঙ্গে বাংলাদেশের জনতার ঐতিহাসিক ওভারল্যাপ থাকায় এ রেকর্ডটি review-ফ্ল্যাগে রাখা হলো। IUCN-এ এখনো পৃথক মূল্যায়ন নেই (NE)।',
    physical: 'সর্বোচ্চ দৈর্ঘ্য ১.২১ মিটার; সরু দেহ, লম্বা লেজ, তামাটে-সবুজাভ পিঠ, কালো টেম্পোরাল ডোরা ও হালকা পাশ-ডোরা।',
    identification: 'চোখ-পেছানো কালো ডোরা ঘাড় পর্যন্ত; বিবর্ধিত পৃষ্ঠকীয় আঁশ; D. pictus থেকে আলাদা করা মাঠে কঠিন—অঞ্চল ও আঁশ-গণনা দরকার।',
    diet: 'টিকটিকি, গিরগিটি, ছোট ব্যাঙ ও পোকা।',
    behavior: 'দিবাচর, প্রায় সম্পূর্ণ বৃক্ষচর; ডালে দ্রুত চলে; ভয় পেলে পাতার আড়ালে স্থির হয়।',
    reproduction: 'ডিম পাড়ে; গাছের কোটর বা পাতার স্তূপে ডিম (তথ্য-স্বল্প)।',
    habitat: 'চিরসবুজ-মিশ্র পাহাড়ি বন, বাঁশঝাড়, বন-প্রান্তের গাছ।',
    distribution: 'সিলেট ও পার্বত্য চট্টগ্রামের পাহাড়ি বন; বৈশ্বিক বিন্যাস উত্তর-পূর্ব ভারত, ভুটান, বাংলাদেশ, মিয়ানমার, দক্ষিণ চীন, উত্তর লাওস-ভিয়েতনাম।',
    whereToSee: 'লাউয়াছড়া-সাতছড়ি-পার্বত্য চট্টগ্রামের বনপথে ডালে-ডালে (চিত্রা দারুশ নামে দেখা নমুনার অন্তর্ভুক্ত হতে পারে)।',
    season: 'সারাবছর; গ্রীষ্ম-বর্ষায় (এপ্রিল–সেপ্টেম্বর) বেশি দেখা যায়।',
    sizeOrHeight: '১.০–১.২১ মিটার',
    ecologicalRole: 'বন-বাগানে টিকটিকি ও পোকার সংখ্যা নিয়ন্ত্রণ করে; বৃক্ষস্তর খাদ্যচক্রের অংশ।',
    origin: 'native', conservation: 'NE', conservationBn: 'IUCN Red List-এ এখনো পৃথকভাবে মূল্যায়িত হয়নি (NE); ঘনিষ্ঠ D. pictus সংবেদী LC; বাংলাদেশে pictus/proarchos নাম-বিভাজনের চূড়ান্ত নিষ্পত্তি বাকি।',
    threats: 'পাহাড়ি বন উজাড়, বিষাক্ত ভেবে হত্যা, গাছ কাটায় আবাস সংকোচন, শ্রেণিবিন্যাস-অস্পষ্টতা।',
    conservationActions: 'পাহাড়ি বন-বাগান রক্ষা; বিষহীন দারুশ বলে সচেতনতা; নমুনাভিত্তিক শ্রেণিবিন্যাস-জরিপ।',
    colorTags: ['#7a8c4f', '#9c7a3f', '#e6dd9a'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Eastern_bronzeback._Dendrelaphis_proarchos_1.jpg',
    dataStatus: 'partial',
    sources: [IUCN, GBIF, SNAKES_BD_2025, REPFOCUS, COMMONS('Eastern_bronzeback._Dendrelaphis_proarchos_1.jpg')],
  },
  {
    slug: 'russells-kukri-snake', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'রাসেলের কুকরি সাপ', nameEn: "Russell's Kukri Snake", scientificName: 'Oligodon russelius',
    otherNames: ['রাসেল কুকরি', 'Oligodon arnensis (ঐতিহাসিক বিস্তৃত অর্থে)', 'Oligodon russelius (Daudin, 1803)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Colubridae', genus: 'Oligodon', species: 'Oligodon russelius' },
    summary: 'সাধারণ কুকরি সাপ-জট থেকে ২০২২-এ আলাদা করা ছোট বিষহীন সাপ; কুকরি-ছুরির মতো দাঁতে ডিম কাটে; বাংলাদেশে Barkat & Rabbe (2022)-এর নিশ্চিত রেকর্ড; IUCN-এ পৃথক মূল্যায়ন হয়নি (NE)।',
    description:
      'রাসেলের কুকরি সাপ ছোট, লাজুক ও সম্পূর্ণ বিষহীন স্থলচর সাপ; দেহ জলপাই-বাদামি যাতে ৩০–৪৫টি ফ্যাকাশে-প্রান্ত-কালো আড়াআড়ি ডোরা, মাথায় আন্তঃচক্ষু ও প্যারাইটাল অংশে দুটি V-আকৃতির কালো দাগ এবং ঘাড়ে উল্টানো Y-দাগ, আঁশ মসৃণ, লেজ ছোট-সূচালো। পিছনের দাঁত কুকরি ছুরির মতো বাঁকানো—দিয়ে সরীসৃপ-পোকার ডিম কাটে। Bandara et al. (2022) O. arnensis জটের শ্রেণিবিন্যাস-সংশোধন করে ঐতিহাসিক ভারতীয় জনতাকে O. russelius নামে পুনঃপ্রতিষ্ঠা করেন; RepFocus-এর “সাম্প্রতিক হালনাগাদ” Barkat & Rabbe (2022)-এর “A confirmed record of Russell’s kukri from Bangladesh” উদ্ধৃত করে। গুরুত্বপূর্ণ: বিদ্যমান “কুকরি সাপ” (kukri-sap, O. arnensis) রেকর্ডের সঙ্গে বাংলাদেশের জনতার ঐতিহাসিক ওভারল্যাপ এবং The Reptile Database-র বিন্যাস-বিবরণে বাংলাদেশ এখনো যুক্ত না হওয়ায় এ রেকর্ডটি review-ফ্ল্যাগে রাখা হলো। IUCN-এ পৃথক মূল্যায়ন নেই (NE)।',
    physical: 'সর্বোচ্চ SVL ০.৬৫ মিটার; জলপাই-বাদামি দেহে ৩০–৪৫ কালো ডোরা, মাথায় V/VY-দাগ, মসৃণ আঁশ।',
    identification: 'O. arnensis থেকে অপেক্ষাকৃত বেশি-সংখ্যক পটি ও নমুনা-আঁশ-গণনায় আলাদা; মাঠে দুই রূপ একই চেহারার।',
    diet: 'পোকা ও সরীসৃপের ডিম (প্রধান), ক্ষুদে ব্যাঙ, পোকা, কেঁচো।',
    behavior: 'দিনে ও গোধূলিতে সক্রিয়; বেশিরভাগ সময় মাটির নিচে বা পাতার স্তূপে লুকিয়ে থাকে; লাজুক।',
    reproduction: 'ডিম পাড়ে (ওভিপারাস); মাটি-পাতার গর্তে ডিম (তথ্য-স্বল্প)।',
    habitat: 'মাটির নিচের আশ্রয়, পাতার স্তূপ, বাগান, ধানখেতের আইল, গ্রামের ঝোপ, বন-প্রান্ত।',
    distribution: 'বাংলাদেশে ২০২২-এর নিশ্চিত রেকর্ড (অঞ্চল-বিস্তারি জরিপ বাকি); বৈশ্বিক বিন্যাস উত্তর ভারত, নেপাল, উত্তর-পূর্ব পাকিস্তান।',
    whereToSee: 'গ্রামীণ বাগান-পাতার স্তূপ-ধানখেতের আইলে বিরল দর্শন; প্রকাশিত ২০২২ রেকর্ডই প্রধান ভিত্তি।',
    season: 'সারাবছর; উষ্ণ-বর্ষায় বেশি সক্রিয়।',
    sizeOrHeight: '০.২৫–০.৬৫ মিটার',
    ecologicalRole: 'পোকা ও সরীসৃপের ডিম খেয়ে সংখ্যা নিয়ন্ত্রণ করে; মাটির বাস্তুতন্ত্রের অংশ।',
    origin: 'native', conservation: 'NE', conservationBn: 'IUCN Red List-এ এখনো পৃথকভাবে মূল্যায়িত হয়নি (NE); ঐতিহাসিক arnensis জট LC মূল্যায়িত; বাংলাদেশে arnensis/russelius নাম-নিষ্পত্তি বাকি।',
    threats: 'ভয়ে মেরে ফেলা, কীটনাশক, আবাস ধ্বংস, রাস্তায় চাপা পড়া, শ্রেণিবিন্যাস-অস্পষ্টতা।',
    conservationActions: 'বিষহীন কুকরি সচেতনতা; কীটনাশক কমানো; মাটির আবাস রক্ষা; নমুনাভিত্তিক জরিপ।',
    colorTags: ['#8a7454', '#4a3d2c', '#c9b78e'],
    image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Russell%27s_kukri_%28Oligodon_russelius%29_flickering_its_toungue.jpg",
    dataStatus: 'partial',
    sources: [IUCN, GBIF, SNAKES_BD_2025, REPFOCUS, COMMONS("Russell%27s_kukri_%28Oligodon_russelius%29_flickering_its_toungue.jpg")],
  },
  {
    slug: 'east-indian-leopard-gecko', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'পূর্ব-ভারতীয় চিতা গেকো', nameEn: 'East Indian Leopard Gecko', scientificName: 'Eublepharis hardwickii',
    otherNames: ['হার্ডউইক চিতা-গেকো', 'Hardwicke’s Leopard Gecko', 'Eublepharis hardwickii Gray, 1827'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Eublepharidae', genus: 'Eublepharis', species: 'Eublepharis hardwickii' },
    summary: 'চলমান চোখের-পাতা-যুক্ত স্থলচর চিতা গেকো; type-locality চট্টগ্রাম; RepFocus উপস্থিতি-নিশ্চিতকরণ বাকি বলে সতর্ক; বিশ্বে LC।',
    description:
      'পূর্ব-ভারতীয় চিতা গেকো নিশাচর স্থলচর টিকটিকি; চলমান চোখের পাতা ও উল্লম্ব-পুতুল চোখ, পায়ে চোষা-পাত নেই—পাতলা নখ-পা, দেহে ছোট আঁশের সঙ্গে বড় গুটিকা-আঁশ (টিউবার্কল), পিঠে চিতা-চিতা গাঢ় ব্যান্ড-ছোপ, মোটা চর্বি-লেজে খণ্ড-ব্যান্ড। দিনে মাটির গর্ত-পাতার নিচে লুকিয়ে থেকে রাতে পোকা-শাবক শিকার করে; বিপদে লেজ খসিয়ে পালাতে পারে ও পরে পুনর্জন্ম হয়। Gray (1827)-এর মূল বর্ণনার type-locality “Chittagong, Penang”—অর্থাৎ চট্টগ্রামে ঐতিহাসিক নমুনা-ভিত্তি রয়েছে; The Reptile Database-র বিন্যাসে বাংলাদেশ অন্তর্ভুক্ত। তবে RepFocus-এর Eublepharis গণ-পাতা সাম্প্রতিক বাংলাদেশ নমুনার অভাবে উপস্থিতি “নিশ্চিতকরণ বাকি” বলে সতর্কতা দেয়—এই দুই সূত্রের দ্বন্দ্ব স্বচ্ছভাবে রাখতে রেকর্ডটি review-ফ্ল্যাগে রাখা হলো। বিশ্ব IUCN: ন্যূনতম বিপদগ্রস্ত (LC)।',
    physical: 'দৈর্ঘ্য ০.২–০.২৩ মিটার; হলদেটে-বাদামি দেহে চিতা-ব্যান্ড, গুটিকা-আঁশ, চলমান চোখের পাতা, মোটা চর্বি-লেজ।',
    identification: 'চলমান চোখের পাতা ও চোষা-পাতবিহীন নখ-পা—সাধারণ দেয়াল-গেকো থেকে স্পষ্ট আলাদা; স্থলচর, উল্লম্ব পুতুল।',
    diet: 'ঝিঁঝিঁ, গুবরে-পোকা, মাকড়সা ও অন্যান্য স্থল পতঙ্গ-শাবক।',
    behavior: 'নিশাচর ও স্থলচর; দিনে গর্ত-পাতা-পাথরের নিচে; ভয়ে লেজ খসায়; ধীর-সহনশীল।',
    reproduction: 'ডিম পাড়ে; মাটির গর্ত-আশ্রয়ে ডিম (ওভিপারাস)।',
    habitat: 'শুষ্ক-পাতাঝরা বন, পাথুরে-ঝোপঝাড় এলাকা, বন-প্রান্তের মাটি-পত্র-স্তর, গ্রামীণ উচ্চভূমি।',
    distribution: 'বাংলাদেশে চট্টগ্রাম type-locality-ভিত্তিক ঐতিহাসিক উপস্থিতি (সাম্প্রতিক নিশ্চিত নমুনা বাকি); মূল বিন্যাস পূর্ব-মধ্য ভারত।',
    whereToSee: 'পার্বত্য চট্টগ্রামের পাথুরে-বনপ্রান্তে রাতের টর্চ-হাঁটায় বিরল দর্শন; চিড়িয়াখানা-প্রজনন কেন্দ্রেও দেখা যায়।',
    season: 'সারাবছর; উষ্ণ-বর্ষায় বেশি সক্রিয়, শীতে কম সক্রিয়।',
    sizeOrHeight: '০.২–০.২৩ মিটার',
    ecologicalRole: 'স্থল-পতঙ্গ-নিয়ন্ত্রক; নিশাচর খাদ্যচক্রে পোকাভুক মাঝারি শিকারি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বিশ্ব IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে চট্টগ্রাম type-locality থাকলেও সাম্প্রতিক নমুনা-প্রমাণের অপেক্ষায় উপস্থিতি অনিশ্চিত—review।',
    threats: 'পাহাড়ি-শুষ্ক বন উজাড়, পোষা-সংগ্রহ, কীটনাশক, অজ্ঞতায় হত্যা।',
    conservationActions: 'পার্বত্য আবাস রক্ষা; লক্ষ্যভিত্তিক নিশাচর-জরিপ; বন্য নমুনা সংগ্রহ-রোধ; সচেতনতা।',
    colorTags: ['#b08d57', '#5c4630', '#e8d9b0'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Eublepharis_hardwickii_juvenile.jpg',
    dataStatus: 'partial',
    sources: [IUCN, GBIF, HERPS_BD, REPFOCUS, COMMONS('Eublepharis_hardwickii_juvenile.jpg')],
  },
]
