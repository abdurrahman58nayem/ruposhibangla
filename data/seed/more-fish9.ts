import type { Species } from '@/lib/types'
import { IUCN, IUCN_BD, GBIF, FISH_BD } from './sources'

/**
 * মাছ সম্প্রসারণ — ব্যাচ ৮ (২০২৬-১০-২৭): ৭টি মোহনা/পাহাড়ি-স্রোত/ক্ষুদে-মাছ
 *
 * লক্ষ্যভিত্তি: IUCN Red List of Bangladesh (2015)-এর ২৫৩ মিঠাপানি-
 * প্রজাতি; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১৬০ (২৫৩-লক্ষ্যের ৬৩%)।
 * Commons categorymembers ও পূর্ণ-টেক্সট search API (srnamespace=6)
 * দিয়ে ১৫+ স্ক্রিনিং-ঢেউয়ে ২৫৩-তালিকার সম্পূর্ণ ঘাটতি-অংশ (১১৮
 * নাম; বানান-উপনাম সমন্বয়ে প্রকৃত অনুপস্থিত ~৯৩) যাচাই করা হয়।
 * এ ব্যাচে মাত্র ৭টি নতুন প্রজাতিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের
 * লাইভ/প্রজাতি-নিশ্চিত আধুনিক আলোকচিত্র পাওয়া যায় — ব্যাচ ১-এর
 * ১১-রেকর্ডের নজিরের পর এটি দ্বিতীয় সংক্ষিপ্ত ব্যাচ; সংখ্যার জন্য
 * দুর্বল-পরিচয়/ঐতিহাসিক ফাইল গ্রহণ করা হয়নি।
 *
 * লাইসেন্স মিশ্রণ (৭ ফাইল): ৩ CC BY-SA 4.0 (Ambassis nalua — BEDO,
 * Amblyceps laticeps — Beta Mahatvaraj, Parapocryptes batoides —
 * JIBON/WMBD GLAM CVASU), ৩ CC BY 3.0 (Aspidoparia morar —
 * H. B. Osmany/FishBase, Salmostoma phulo — Md. R. Islam/FishBase,
 * Osteochilus hasseltii — Wibowo Djatmiko), ১ CC0 (Pethia guganio —
 * Swarno rudra)। কোনো Day/Hamilton/Mintern/Achilles/Ford/Griesbach/
 * Beavan বই-প্লেট, Iconographia Zoologica-চিত্র, Bloch/Herre স্ক্যান,
 * মানচিত্র-ক্যাপচার, ওয়াটারমার্কযুক্ত বা দুর্বল-পরিচয়ের ফাইল নেওয়া হয়নি।
 *
 * গুরুত্বপূর্ণ বর্জন-ঘটনা: (১) Neotropius atherinoides (#153)-
 * ক্যাটাগরির একমাত্র নন-প্লেট ফাইল "Neotropius atherinoides.jpg"
 * extmetadata-তে ১৮৭৭-এর Reginald Beavan অঙ্কন (PD-old-70) প্রমাণিত —
 * বর্জিত; (২) Pethia guganio (#183)-র Commons-ফাইল প্রজাতি-ক্যাটাগরি-
 * বিহীন (কেবল CC0/Self-published), তবে bn.wikipedia ও bn.bdfish-এ
 * "মলা পুঁটি" = Pethia guganio নাম-মিল একাধিক স্বাধীন সূত্রে নিশ্চিত
 * হওয়ায় স্বচ্ছ-নোটসহ গৃহীত; (৩) চারটি প্রার্থী প্রজাতি (Dermogenys
 * pusilla, Devario aequipinnatus, Psilorhynchus balitora, Scartelaos
 * histophorus) স্ক্রিনিং-পর্বে প্রার্থী হলেও দেখা যায় এরা ভিন্ন বাংলা
 * নামে (এক থুটা, জায়ান্ট ডানিও, বালিচুরা, ওয়াকিং গবি) আগেই সাইটে
 * আছে — ডুপ-এড হয়নি; (৪) Labeo boga (#114 CR), Schistura corica
 * (#222 CR), Neoeucirrhichthys maydelli (#151 CR)-এ কোনো আধুনিক
 * মুক্ত-মাধ্যম নেই (শুধু প্লেট/PDF/শূন্য-হিট)।
 *
 * জাতীয় অবস্থা IUCN Bangladesh 2015 (bdfish ২৫৩-তালিকা থেকে
 * ক্রমিক-নম্বরসহ): ৩ LC (#176, #183, #218 NT-সহ নয়; LC তিনটি
 * #176, #183 ও #74-সম্পর্কিত নয়—নিচে বিস্তারিত), ৩ VU (#6, #17,
 * #166), ১ DD (#5), ১ NT (#218)। বৈশ্বিক: ৭/৭ LC। বাংলা নাম-সূত্র:
 * BdFISH প্রজাতি-পাতা ও Extinct Fishes-সংকলন, Freshwater/Marine
 * Biodiversity Portal of Bangladesh, FishBase Country ComNames,
 * bn.wikipedia, WMBD GLAM ফাইল-লেবেল।
 *
 * মুলতবি বহাল: Sicamugil cascasia (#229 VU)-র ১৮০×১৩৪px BioTrek
 * CC BY-SA 2.5 ফাইল — ব্যাচ ৮-এও কোনো উচ্চ-রেজোলিউশন বিকল্প মেলেনি।
 */
const COMMONS = (file: string): { title: string; url: string; license: string } => ({
  title: 'ছবির মূল ফাইল — Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
  license: 'Wikimedia Commons',
})

export const MORE_FISH9: Species[] = [
  {
    slug: 'scalloped-perchlet', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'কাঁটা চান্দা', nameEn: 'Scalloped Perchlet', scientificName: 'Ambassis nalua',
    otherNames: ['নলুয়া চাঁন্দা', 'লাটা চান্দা', 'Scalloped glassfish', 'Chanda nalua'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Mugiliformes', family: 'Ambassidae', genus: 'Ambassis', species: 'Ambassis nalua' },
    summary: 'মোহনা-ম্যানগ্রোভ খালের স্বচ্ছ-রুপালি ক্ষুদে পার্চলেট; বাংলাদেশে কাঁটা চান্দা; বৈশ্বিক LC, জাতীয় DD (#5)।',
    description:
      'কাঁটা চান্দার দেহ চাপা-স্বচ্ছ-রুপালি, কাঁটা-বিন্যাসে পৃষ্ঠ-রেখা খানিক খিলান-করা; মাথা ছোট, চোখ তুলনামূলক-বড়, মুখ তির্যক-ফেটা; দুই পৃষ্ঠ-পাখনা পৃথক, পার্শ্ব-রেখা স্পষ্ট ও আঁশ বড়-ঝিলিকময়; স্বচ্ছতার জন্য ভেতরের কঙ্কাল-ছায়া অস্পষ্টভাবে দেখা যায়। উপকূলীয় মোহনা, ম্যানগ্রোভ-খাল, জোয়ার-নদ ও লবণাক্ত-মিঠা-জলের মিশ্র-বাস্তুতন্ত্রে ঝাঁক বেঁধে থাকে; রাতে ক্রাস্টেসিয়ান, মাছ-পোনা ও জলজ পোকা শিকার করে। বাংলাদেশে সুন্দরবন-সংলগ্ন খাল ও উপকূলীয় মোহনায় প্রাপ্ত; বৈশ্বিক বিস্তৃতি ভারত মহাসাগর থেকে অস্ট্রেলিয়া-নিউ গিনি পর্যন্ত। জাতীয় ২৫৩-মূল্যায়নে তথ্য-ঘাটতি (DD) থাকলেও বৈশ্বিক IUCN ২০২০-মূল্যায়নে LC (#5)।',
    physical: 'দৈর্ঘ্য সাধারণত ৬–১০ সেমি (সর্বোচ্চ ১২.৫ সেমি TL); স্বচ্ছ-রুপালি চাপা দেহ, বড় চোখ, ঝিলিক-আঁশ।',
    identification: 'স্বচ্ছ-রুপালি দেহ ও খিলান-করা পৃষ্ঠ-রেখা; Chanda nama-র চেয়ে দেহ খাটো-গভীর ও আঁশ বৃহত্তর।',
    diet: 'ক্ষুদে ক্রাস্টেসিয়ান, মাছ-পোনা, জলজ পোকা-লার্ভা, প্ল্যাঙ্কটন।',
    behavior: 'ঝাঁকবদ্ধ-রাত্রি-সক্রিয়; আগাছা-ঘেরা শান্ত-জলে আশ্রয়; জোয়ার-ভাটার সাথে চলাচল।',
    reproduction: 'মোহনা-অগভীরে ডিম ছাড়ে; বিস্তারিত প্রজনন-জীবনী আংশিক-নথিভুক্ত।',
    habitat: 'মোহনা, ম্যানগ্রোভ-খাল, জোয়ার-নদ, লবণাক্ত-মিঠা-মিশ্র অগভীর জল।',
    distribution: 'বাংলাদেশ (সুন্দরবন-উপকূল); ইন্দো-পশ্চিম-প্রশান্ত মহাসাগরীয় বেল্ট (ভারত–অস্ট্রেলিয়া–নিউ গিনি)।',
    whereToSee: 'সুন্দরবন-সংলগ্ন খাল, বরগুনা-পটুয়াখালীর মোহনা ও ক্ষুদে-মাছের হাটে; মোহনা-জরিপ-নমুনায়।',
    season: 'সারাবছর; বর্ষা-জোয়ারে নদ-মুখে বেশি দেখা যায়।',
    sizeOrHeight: '৬–১০ সেন্টিমিটার (সর্বোচ্চ ১২.৫ সেমি TL)',
    ecologicalRole: 'মোহনা-খাদ্য-জালের মধ্য-স্তরের ক্ষুদে-শিকারী ও বৃহৎ মাছ-পাখির শিকার; ম্যানগ্রোভ-স্বাস্থ্য-সূচক।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC, ২০২০); IUCN Bangladesh ২০১৫: তথ্য-ঘাটতি (DD, #5) — দেশে জনসংখ্যা-জরিপ অপ্রতুল।',
    threats: 'ম্যানগ্রোভ-উজাড়, মোহনা-ভরাট, শিল্প-লবণ-দূষণ, জোয়ার-প্রবাহ-বাধা, অতি-সূক্ষ্ম-জাল-আহরণ।',
    conservationActions: 'ম্যানগ্রোভ-সংরক্ষণ, মোহনা-দূষণ-নিয়ন্ত্রণ, জাতীয়-জনসংখ্যা-জরিপ, সূক্ষ্ম-জাল-নিয়ন্ত্রণ।',
    colorTags: ['#cfd6d2', '#8fa39c', '#eef2f0'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Ambassis_nalua_%28Hamilton%2C_1822%29.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Ambassis nalua (Hamilton, 1822).jpg')],
  },
  {
    slug: 'indian-torrent-catfish', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'ছোট্ট শিংগি', nameEn: 'Indian Torrent Catfish', scientificName: 'Amblyceps laticeps',
    otherNames: ['Chotta Shinghi', 'Indian torrent catfish', 'Olyra laticeps'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Siluriformes', family: 'Amblycipitidae', genus: 'Amblyceps', species: 'Amblyceps laticeps' },
    summary: 'খাসিয়া-পাহাড়ি-ছড়ার ভোঁতা-মাথা স্রোত-ক্যাটফিশ; বাংলাদেশে ছোট্ট শিংগি; বৈশ্বিক LC, জাতীয় VU (#6)।',
    description:
      'ছোট্ট শিংগির দেহ লম্বা-নলাকার, মাথা ভোঁতা-চ্যাপ্টা ও সামান্য চাপা, চোখ ক্ষুদে-উপরে-স্থিত; চার জোড়া শুঁড়ি, পৃষ্ঠ-কাঁটা মসৃণ-খাটো, পার্শ্ব-পাখনার কাঁটা শক্ত; পুচ্ছ-পাখনা গোলাকার-কাঁটাচামচ, ত্বক রুক্ষ-আঁশবিহীন; রঙ ফিকে-বাদামি-হলদে with পিঠ গাঢ় ও পেট ফ্যাকাশে, কখনো অস্পষ্ট-ফোঁটা। গঙ্গা-ব্রহ্মপুত্র অববাহিকার পাহাড়ি-ছড়া ও দ্রুত-স্রোতের পাথর-বালি-তলে বাস করে; স্রোতের বিপরীতে পাথর-আঁকড়ে থেকে ক্ষুদে পোকা-লার্ভা ও ক্রাস্টেসিয়ান শিকার করে। বাংলাদেশে মূলত সিলেট-নেত্রকোনা-পঞ্চগড়ের সীমান্ত-ছড়ায় রেকর্ড; ভারত, নেপালেও প্রাপ্ত। বৈশ্বিক IUCN ২০০৯-মূল্যায়নে LC; জাতীয় IUCN Bangladesh ২০১৫-তে VU (#6)।',
    physical: 'দৈর্ঘ্য সাধারণত ৬–৯ সেমি; ভোঁতা-চ্যাপ্টা মাথা, রুক্ষ-আঁশবিহীন ত্বক, ফিকে-বাদামি দেহ।',
    identification: 'ভোঁতা-থুতনি ও মসৃণ-খাটো পৃষ্ঠ-কাঁটা; Olyra longicaudata-র চেয়ে লেজ খাটো ও মাথা চওড়া-ভোঁতা।',
    diet: 'জলজ পোকা-লার্ভা, ক্ষুদে ক্রাস্টেসিয়ান, কৃমি, ডেট্রিটাস।',
    behavior: 'নিশাচর-তল-বাসী; দ্রুত-স্রোতে পাথর-নিচে আশ্রয়; বিপদে কাঁটা ফাঁক করে।',
    reproduction: 'স্রোত-জলে ডিম পাড়ে; বিস্তারিত প্রজনন-তথ্য সীমিত।',
    habitat: 'পাহাড়ি-ছড়ার পাথর-বালি-তল, দ্রুত-স্বচ্ছ-ঠান্ডা স্রোত।',
    distribution: 'বাংলাদেশ (উত্তর-পূর্ব সীমান্ত-ছড়া); ভারত (খাসিয়া-গারো পাহাড়, গঙ্গা-ব্রহ্মপুত্র), নেপাল।',
    whereToSee: 'সিলেট-মৌলভীবাজার-নেত্রকোনা-পঞ্চগড়ের পাহাড়ি-ছড়ায়; বিশেষ জরিপ-নমুনায়।',
    season: 'সারাবছর স্রোত-জলে; বর্ষায় নিচু-প্রস্থানে নামতে পারে।',
    sizeOrHeight: '৬–৯ সেন্টিমিটার',
    ecologicalRole: 'তল-স্তরের ক্ষুদে-শিকারী ও স্রোত-মান-নির্দেশক; বৃহৎ মাছের শিকার।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC, ২০০৯); IUCN Bangladesh ২০১৫: ঝুঁকিপূর্ণ (VU, #6) — দেশে আবাস-সংকোচনে জনসংখ্যা হ্রাস পাচ্ছে।',
    threats: 'পাহাড়ি-ছড়া-দখল, বালি-পাথর উত্তোলন, বন-উজাড়-জনিত পলি-পড়া, কীটনাশক-প্রবাহ, প্রবাহ-হ্রাস।',
    conservationActions: 'ছড়া-প্রবাহ-সংরক্ষণ, উত্তোলন-নিষেধাজ্ঞা, বাফার-বনায়ন, জাতীয়-জনসংখ্যা-জরিপ।',
    colorTags: ['#a89a82', '#6b5f4c', '#ddd5c4'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Amblyceps_laticeps.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Amblyceps laticeps.jpg')],
  },
  {
    slug: 'morar-carplet', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'মোরারী', nameEn: 'Morari Carplet', scientificName: 'Aspidoparia morar',
    otherNames: ['মোরার', 'পিওলী', 'Morar', 'Pioly', 'Cabdio morar', 'Cyprinus morar'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Cypriniformes', family: 'Danionidae', genus: 'Aspidoparia', species: 'Aspidoparia morar' },
    summary: 'উত্তর-পূর্বের হাওর-নদের রুপালি-সরু কার্পলেট; বাংলাদেশে মোরারী/পিওলী; বৈশ্বিক LC, জাতীয় VU (#17)।',
    description:
      'মোরারীর দেহ লম্বা-চাপা-রুপালি, পিঠ ফিকে-ধূসর-সবজে ও পার্শ্ব-পেট চকচকে-রুপালি; মুখ ছোট-ফেটা, শুঁড়ি নেই, চোখ মাঝারি, পার্শ্বরেখা স্পষ্ট, পুচ্ছ-পাখনা গভীর-কাঁটাচামচ; পৃষ্ঠ-পাখনা খাটো। নদ-হাওর-প্লাবনভূমির মুক্ত-জলে ঝাঁক বেঁধে থাকে; প্ল্যাঙ্কটন, শৈবাল-কণা ও ভাসমান ডেট্রিটাস খায়। বাংলাদেশের উত্তর-পূর্বাঞ্চলের হাওর-নদে প্রাপ্ত; বিস্তৃতি ইরান থেকে দক্ষিণ এশিয়া-মিয়ানমার পর্যন্ত। আধুনিক শ্রেণীবিন্যাসে Cabdio morar নামও প্রচলিত; ২৫৩-তালিকা Aspidoparia morar অনুসরণ করা হয়েছে। বৈশ্বিক IUCN: LC; জাতীয় IUCN Bangladesh ২০১৫: VU (#17)।',
    physical: 'দৈর্ঘ্য সাধারণত ১০–১৫ সেমি (সর্বোচ্চ ~২০ সেমি); রুপালি-সরু-চাপা দেহ, গভীর-কাঁটাচামচ পুচ্ছ।',
    identification: 'সরু-লম্বা রুপালি দেহ ও শুঁড়িহীন-ফেটা-মুখ; Aspidoparia jaya-র চেয়ে দেহ বৃহত্তর ও চোখ তুলনামূলক-ছোট।',
    diet: 'প্ল্যাঙ্কটন, শৈবাল-কণা, ভাসমান ডেট্রিটাস, ক্ষুদে জলজ-অমেরুদণ্ডী।',
    behavior: 'ঝাঁকবদ্ধ-মুক্ত-জলের (pelagic) মাছ; স্রোত-কুলে সমান্তরালে সাঁতার কাটে।',
    reproduction: 'বর্ষাকালে প্লাবনভূমি-নদে ডিম ছাড়ে; বিস্তারিত আংশিক-নথিভুক্ত।',
    habitat: 'নদ-হাওর-প্লাবনভূমির মুক্ত-জল, মাঝারি-স্রোত ও স্থির-প্রান্ত।',
    distribution: 'বাংলাদেশ (সুনামগঞ্জ-হাওর অঞ্চল, উত্তর-পূর্ব নদ); ভারত, নেপাল, পাকিস্তান, মিয়ানমার।',
    whereToSee: 'সুনামগঞ্জ-হবিগঞ্জ হাওর-নদ ও ক্ষুদে-মাছের হাটে; মৎস্য-জরিপ-নমুনায়।',
    season: 'প্রজনন বর্ষাকালে (জুন–সেপ্টেম্বর); সারাবছর নদে পাওয়া যায়।',
    sizeOrHeight: '১০–১৫ সেন্টিমিটার (সর্বোচ্চ ~২০ সেমি)',
    ecologicalRole: 'মধ্য-জলস্তরের প্ল্যাঙ্কটনভোজী ও বৃহৎ শিকারীদের প্রধান ক্ষুদে-শিকার; খাদ্য-জাল-কড়ি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); IUCN Bangladesh ২০১৫: ঝুঁকিপূর্ণ (VU, #17) — হাওর-আবাস-ক্ষয়ে জাতীয় জনসংখ্যা চাপে।',
    threats: 'হাওর-ভরাট, পানি-দূষণ, সূক্ষ্ম-জাল-নিধন, প্রবাহ-পরিবর্তন, কৃষি-কীটনাশক।',
    conservationActions: 'হাওর-জলাভূমি-সংরক্ষণ, মৌসুমি-আহরণ-নিয়ম, জাতীয়-জনসংখ্যা-মনিটরিং।',
    colorTags: ['#d6dbe0', '#93a9b8', '#f1f4f6'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Cabdio_morar.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Cabdio morar.jpg')],
  },
  {
    slug: 'hard-lipped-barb', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'থুইটা পুঁটি', nameEn: 'Hard-lipped Barb', scientificName: 'Osteochilus hasseltii',
    otherNames: ['থুইতা পুঁটি', 'Bonylip barb', 'Silver sharkminnow', 'Nilem carp', 'Osteochilus vittatus'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Cypriniformes', family: 'Cyprinidae', genus: 'Osteochilus', species: 'Osteochilus hasseltii' },
    summary: 'শক্ত-ঠোঁটের রুপালি-বড় পুঁটি; বাংলাদেশে থুইটা পুঁটি; বৈশ্বিক LC, জাতীয় VU (#166)।',
    description:
      'থুইটা পুঁটির দেহ লম্বা-চাপা-রুপালি-হলদে, পিঠ ফিকে-ধূসর-সবজে; মুখ-প্রান্তে শক্ত-শৃঙ্গাকার-ঠোঁট (hard lip) ও ছোট শুঁড়ি-যুগল, পৃষ্ঠ-পাখনা লম্বা-ভিত্তি-বিশিষ্ট; পুচ্ছ-গোড়ায় ক্ষুদে-কালো-দাগ ও পার্শ্বে কমলা-ফোঁটার সারি চোখে পড়ে; আঁশ বড়-ঝিলিকময়। ধীর-স্রোতের নদ-খাল-হ্রদের নরম-তল ও প্লাবনভূমিতে বাস করে; শৈবাল, পাতা-পচ্যাংশ, পোকা ও জৈবকণা খায়; বর্ষায় প্লাবিত-এলাকায় অভিবাসন করে। বাংলাদেশে নোয়াখালী-ফেনী অঞ্চলের সীমিত জলাশয়ে রেকর্ড; বিস্তৃতি মিয়ানমার থেকে ইন্দোনেশিয়া পর্যন্ত। কতিপয় শ্রেণীবিন্যাসে O. vittatus-র প্রতিশব্দরূপে গণ্য। বৈশ্বিক IUCN: LC; জাতীয় IUCN Bangladesh ২০১৫: VU (#166)।',
    physical: 'দৈর্ঘ্য সাধারণত ১২–২০ সেমি (সর্বোচ্চ ৩২ সেমি); রুপালি-হলদে দেহ, শক্ত-ঠোঁট, পুচ্ছ-গোড়ার কালো-দাগ।',
    identification: 'শৃঙ্গাকার-শক্ত-ঠোঁট ও পুচ্ছ-গোড়ার কালো-ফোঁটা; সাধারণ পুঁটি-জাতের চেয়ে দেহ লম্বা ও পৃষ্ঠ-পাখনা দীর্ঘ।',
    diet: 'শৈবাল, পচা-পাতা-ডেট্রিটাস, জলজ পোকা, ক্ষুদে ক্রাস্টেসিয়ান।',
    behavior: 'তল-মধ্য-স্তরের ঝাঁক-মাছ; বর্ষায় প্লাবনভূমি-অভিবাসী; শান্ত-স্বভাব।',
    reproduction: 'বর্ষা-শুরুতে প্লাবিত-বনাঞ্চলে ডিম ছাড়ে; প্রজনন-অভিবাসন প্রবাহ-নির্ভর।',
    habitat: 'ধীর-স্রোতের নদ-হ্রদ-খাল, নরম-তল, প্লাবনভূমি।',
    distribution: 'বাংলাদেশ (নোয়াখালী-ফেনী-সংলগ্ন সীমিত এলাকা); মিয়ানমার–ইন্দোচীন–মালয়–ইন্দোনেশিয়া।',
    whereToSee: 'বৃহত্তর নোয়াখালী অঞ্চলের নদ-খালে; বিশেষ জরিপ-নমুনা ও স্থানীয় মাছ-হাটে।',
    season: 'প্রজনন বর্ষাকালে; সারাবছর নদ-হ্রদে থাকে।',
    sizeOrHeight: '১২–২০ সেন্টিমিটার (সর্বোচ্চ ৩২ সেমি)',
    ecologicalRole: 'তল-শৈবাল-ডেট্রিটাস-ভক্ষক ও পচন-সহায়ক; বৃহৎ মাছের শিকার; অভিবাসী-খাদ্য-জাল-কড়ি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); IUCN Bangladesh ২০১৫: ঝুঁকিপূর্ণ (VU, #166) — দেশে অতি-সংকীর্ণ বিস্তৃতি (বৃহত্তর নোয়াখালীর ৮ উপজেলা-রেকর্ড)।',
    threats: 'আবাস-ভরাট, প্রবাহ-বাধা, অতি-আহরণ, কৃষি-দূষণ, প্রজনন-প্লাবনভূমি-ক্ষয়।',
    conservationActions: 'স্থানীয়-জনসংখ্যা-জরিপ, প্রজনন-অভিবাসন-পথ-সুরক্ষা, প্লাবনভূমি-সংরক্ষণ, টেকসই-আহরণ-নীতি।',
    colorTags: ['#c9b48e', '#7d6a48', '#ece2cd'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Osteoc_hassel_120127-22853_tsm.JPG',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Osteoc hassel 120127-22853 tsm.JPG')],
  },
  {
    slug: 'joli-cheowa-goby', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'জলি চেওয়া', nameEn: 'Joli Cheowa Goby', scientificName: 'Parapocryptes batoides',
    otherNames: ['Goby', 'Mudskipper goby', 'Apocryptes batoides'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Gobiiformes', family: 'Oxudercidae', genus: 'Parapocryptes', species: 'Parapocryptes batoides' },
    summary: 'মোহনা-কাদা-তলের সরু-গোবি; বাংলাদেশে জলি চেওয়া; WMBD GLAM-চট্টগ্রাম ফাইল; বৈশ্বিক ও জাতীয় LC (#176)।',
    description:
      'জলি চেওয়ার দেহ লম্বা-বেলনাকার-সামান্য চাপা, মাথা ভোঁতা-খাটো, চোখ উপরে-সন্নিকট; দুটি পৃষ্ঠ-পাখনা, পার্শ্ব-পাখনা প্রায়-কাপ-আকারের, পুচ্ছ গোলাকার; রঙ ফিকে-বাদামি-হলদে with পার্শ্বে অসংখ্য ক্ষুদে-গাঢ়-ফোঁটা ও ছদ্মবেশী-ডোরা, কাদার সাথে মিশে যায়। মোহনা-জোয়ার-নদের নরম-কাদা-তলে গর্ত করে বাস করে; কাদা-মিশ্রিত ডেট্রিটাস, শৈবাল-ফিল্ম ও ক্ষুদে অমেরুদণ্ডী খায়। বাংলাদেশ ও মিয়ানমারের উত্তর বঙ্গোপসাগর-তীরে সীমাবদ্ধ; Apocryptes bato-প্রজাতি-জটের অংশ বলে শ্রেণীবিন্যাস-গবেষণা চলমান। বৈশ্বিক ও জাতীয় IUCN — উভয়ই LC (#176)।',
    physical: 'দৈর্ঘ্য সাধারণত ৮–১২ সেমি; বেলনাকার-কাদা-ছদ্মবেশ দেহ, উপরে-ফোলা ঘনিষ্ঠ-চোখ।',
    identification: 'গর্ত-বাসী লম্বা-গোবি গঠন ও কাদা-ফোঁটা-ছদ্মবেশ; Apocryptes bato-র সাথে মিল—প্রজাতি-জট নথিভুক্ত।',
    diet: 'কাদা-ডেট্রিটাস, শৈবাল-ফিল্ম, ক্ষুদে ক্রাস্টেসিয়ান, পলি-কৃমি।',
    behavior: 'তল-বাসী-গর্ত-খননকারী; জোয়ারে সক্রিয়, ভাটায় গর্তে আশ্রয়।',
    reproduction: 'মোহনা-কাদা-তলে ডিম পাড়ে; বিস্তারিত প্রজনন-তথ্য অপ্রতুল (প্রজাতি-জট-কারণে)।',
    habitat: 'মোহনা-জোয়ার-নদের নরম-কাদা-তল, ম্যানগ্রোভ-প্রান্ত।',
    distribution: 'বাংলাদেশ (চট্টগ্রাম-উপকূল, মোহনা); মিয়ানমার; উত্তর বঙ্গোপসাগর-বেল্ট।',
    whereToSee: 'চট্টগ্রাম-কক্সবাজার-পটুয়াখালীর মোহনা-কাদা-চরে; GLAM-জরিপ-নমুনা ও মাছ-বাজারে।',
    season: 'সারাবছর; বর্ষা-জোয়ারে উপকূল-কুলে বেশি দেখা যায়।',
    sizeOrHeight: '৮–১২ সেন্টিমিটার',
    ecologicalRole: 'কাদা-তলের ডেট্রিটাস-ভক্ষক-পুনর্চক্রণকারী; বড় মাছ-পাখির শিকার; মোহনা-সূচক-প্রজাতি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); IUCN Bangladesh ২০১৫-তেও LC (#176)। Apocryptes bato-প্রজাতি-জটের কারণে জনসংখ্যা-উপাত্ত পুনর্মূল্যায়ন-প্রয়োজন।',
    threats: 'মোহনা-ভরাট, কাদা-দূষণ, প্লাস্টিক-জমা, জোয়ার-প্রবাহ-বাধা, তীর-প্রতিরক্ষা-নির্মাণ।',
    conservationActions: 'মোহনা-কাদা-চর-সংরক্ষণ, প্রজাতি-জট-গবেষণা, দূষণ-নিয়ন্ত্রণ, জরিপ-মনিটরিং।',
    colorTags: ['#b3a384', '#6e6048', '#ded6c2'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Parapocryptes_batoides_%28%E0%A6%9C%E0%A6%B2%E0%A6%BF_%E0%A6%9A%E0%A7%87%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A6%BE%29_-_DSC02489.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Parapocryptes batoides (জলি চেওয়া) - DSC02489.jpg')],
  },
  {
    slug: 'glass-barb', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'মলা পুঁটি', nameEn: 'Glass Barb', scientificName: 'Pethia guganio',
    otherNames: ['Glass barb', 'Puntius guganio', 'Cyprinus guganio'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Cypriniformes', family: 'Cyprinidae', genus: 'Pethia', species: 'Pethia guganio' },
    summary: 'স্বচ্ছ-কাচের মতো দেহের ক্ষুদে পুঁটি; বাংলাদেশে মলা পুঁটি; বৈশ্বিক ও জাতীয় LC (#183)।',
    description:
      'মলা পুঁটির দেহ ছোট-চাপা-প্রায়-স্বচ্ছ, বাদামি-রুপালি লম্বা-ডোরা দেহের দুই পার্শ্বে; পৃষ্ঠ-পাখনার গোড়ার সামান্য-সামনে একটি ক্ষুদে-কালো-দাগ এবং পুচ্ছ-গোড়ায় তিলের মতো ছোট-কালো-ফোঁটা; পাখনা স্বচ্ছ, চোখ তুলনামূলক-বড়। গঙ্গা-ব্রহ্মপুত্র অববাহিকার নদ-খাল-বিলের শান্ত-উদ্ভিদ-ঘেরা জলে ঝাঁক বেঁধে থাকে; প্ল্যাঙ্কটন, শৈবাল ও ক্ষুদে জৈবকণা খায়। বাংলাদেশে একসময় সাধারণ হলেও সাম্প্রতিক দশকে দুর্লভ হয়ে পড়ছে; বিস্তৃতি ভারত, নেপাল পর্যন্ত। অ্যাকোয়ারিয়াম-শখে সীমিত-বাণিজ্য রয়েছে। বৈশ্বিক IUCN ২০১০ ও জাতীয় IUCN Bangladesh ২০১৫ — উভয়ই LC (#183)।',
    physical: 'দৈর্ঘ্য সাধারণত ৪–৬ সেমি (সর্বোচ্চ ~৮ সেমি); স্বচ্ছ-রুপালি দেহ, পৃষ্ঠ-পাখনা-গোড়া ও পুচ্ছ-গোড়ার কালো-ফোঁটা।',
    identification: 'স্বচ্ছ-কাচ-দেহ ও দুই কালো-ফোঁটা-বিন্যাস; অন্যান্য Pethia-র চেয়ে দেহ অনেক বেশি স্বচ্ছ।',
    diet: 'প্ল্যাঙ্কটন, শৈবাল-কণা, ক্ষুদে জলজ-পোকা, ডেট্রিটাস।',
    behavior: 'শান্ত-ঝাঁকপ্রিয়-মধ্য-জলের মাছ; উদ্ভিদ-ঘেরা প্রান্তে অবস্থান।',
    reproduction: 'বর্ষাকালে উদ্ভিদ-ঘেরা শান্ত-জলে ডিম ছাড়ে; বিস্তারিত আংশিক-নথিভুক্ত।',
    habitat: 'নদ-খাল-বিলের শান্ত-স্বচ্ছ-জল, জলজ-উদ্ভিদ-প্রচুর প্রান্ত।',
    distribution: 'বাংলাদেশ (গঙ্গা-ব্রহ্মপুত্র-অববাহিকা); ভারত, নেপাল।',
    whereToSee: 'দেশীয় ক্ষুদে-মাছের হাট ও অ্যাকোয়ারিয়াম-দোকানে; বিল-খাল-জরিপ-নমুনায়।',
    season: 'সারাবছর; বর্ষায় প্রজনন-সক্রিয়তা বাড়ে।',
    sizeOrHeight: '৪–৬ সেন্টিমিটার (সর্বোচ্চ ~৮ সেমি)',
    ecologicalRole: 'মধ্য-স্তরের ক্ষুদে-প্ল্যাঙ্কটনভোজী ও বৃহৎ শিকারীদের খাদ্য; স্বচ্ছ-জল-সূচক।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC, ২০১০); IUCN Bangladesh ২০১৫-তেও LC (#183) — তবে সাম্প্রতিক দুর্লভতা-প্রতিবেদন মনিটরিং-দাবি রাখে।',
    threats: 'বিল-খাল-ভরাট, কীটনাশক-দূষণ, সূক্ষ্ম-জাল-নিধন, আগাছা-নিধন, আবাস-খণ্ডীকরণ।',
    conservationActions: 'বিল-জলাভূমি-সংরক্ষণ, দূষণ-হ্রাস, ক্ষুদে-জাল-নিয়ন্ত্রণ, জনসংখ্যা-প্রবণতা-জরিপ।',
    colorTags: ['#d8dcd4', '#97a493', '#f2f4ee'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/37/%E0%A6%AE%E0%A6%B2%E0%A6%BE_%E0%A6%AA%E0%A7%81%E0%A6%81%E0%A6%9F%E0%A6%BF.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('মলা পুঁটি.jpg')],
  },
  {
    slug: 'finescale-razorbelly-minnow', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'ফুলচেলা', nameEn: 'Finescale Razorbelly Minnow', scientificName: 'Salmostoma phulo',
    otherNames: ['ফুলো চেলা', 'প্রেম চেলা', 'চেলা', 'Phoolchela', 'Ful chela', 'Salmophasia phulo', 'Chela phulo'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Cypriniformes', family: 'Danionidae', genus: 'Salmostoma', species: 'Salmostoma phulo' },
    summary: 'চকচকে-ধারালো-পেটের ক্ষুদে রেজারবেলি মিনো; বাংলাদেশে ফুলচেলা; বৈশ্বিক LC, জাতীয় NT (#218)।',
    description:
      'ফুলচেলার দেহ অত্যন্ত চাপা-ফলক-সদৃশ-রুপালি, পেট-রেখা ধারালো-খাঁজ-করা (razorbelly), মুখ ঊর্ধ্ব-মুখী, চোখ বড়, পার্শ্বরেখা নিচু-বক্র; পৃষ্ঠ-পাখনা খাটো ও পুচ্ছ-পাখনা গভীর-কাঁটাচামচ; আঁশ ক্ষুদে-ঘন-চকচকে। নদ-খাল-হাওরের উপরি-মুক্ত-জলে ঝাঁক বেঁধে সাঁতার কাটে; পতঙ্গ, প্ল্যাঙ্কটন ও ভাসমান জৈবকণা খায়। বাংলাদেশ ও ভারতজুড়ে মিঠা-জলে বিস্তৃত; ক্ষুদে-প্রজাতি হিসেবে বৃহৎ মাছের প্রধান শিকার-ভিত্তি। বৈশ্বিক IUCN: LC; জাতীয় IUCN Bangladesh ২০১৫: NT (#218)।',
    physical: 'দৈর্ঘ্য সাধারণত ৭–১০ সেমি (সর্বোচ্চ ~১২ সেমি); ফলক-চাপা রুপালি দেহ, ধারালো-পেট-রেখা।',
    identification: 'ঊর্ধ্ব-মুখী-মুখ ও ধারালো-পেট-খাঁজ; Chela cachius-র চেয়ে আঁশ ক্ষুদ্রতর ও দেহ রুপালি-ফিকে।',
    diet: 'পতঙ্গ, প্ল্যাঙ্কটন, ভাসমান জৈবকণা, ক্ষুদে-পোকা-লার্ভা।',
    behavior: 'উপরি-জলের ঝাঁকবদ্ধ-দ্রুত-সাঁতারু; আলো-আকর্ষী; সহজে সূক্ষ্ম-জালে ধরা পড়ে।',
    reproduction: 'বর্ষাকালে প্লাবনভূমি-কুলে ডিম ছাড়ে; বিস্তারিত আংশিক-নথিভুক্ত।',
    habitat: 'নদ-খাল-হাওর-বিলের মুক্ত-উপরি-জল, মাঝারি-স্রোত।',
    distribution: 'বাংলাদেশ (নদ-হাওর-বিস্তৃত); ভারত (গঙ্গা-ব্রহ্মপুত্র-অববাহিকা)।',
    whereToSee: 'হাওর-নদ-কুল ও ক্ষুদে-মাছের হাটে; জল-ভরা মৌসুমে প্লাবনভূমিতে।',
    season: 'প্রজনন বর্ষাকালে (জুন–সেপ্টেম্বর); সারাবছর পাওয়া যায়।',
    sizeOrHeight: '৭–১০ সেন্টিমিটার (সর্বোচ্চ ~১২ সেমি)',
    ecologicalRole: 'উপরি-জলের পতঙ্গভোজী ও বৃহৎ মাছ-পাখির প্রধান ক্ষুদে-শিকার; খাদ্য-জাল-ভিত্তি-কড়ি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); IUCN Bangladesh ২০১৫: প্রায়-বিপদগ্রস্ত (NT, #218) — সূক্ষ্ম-জাল-চাপে জাতীয় জনসংখ্যা হ্রাসমান।',
    threats: 'সূক্ষ্ম-জাল-নিধন, নদ-দূষণ, প্রবাহ-হ্রাস, প্লাবনভূমি-ভরাট, কৃষি-কীটনাশক।',
    conservationActions: 'ক্ষুদে-জাল-নিয়ন্ত্রণ, প্লাবনভূমি-সংরক্ষণ, মজুদ-জরিপ, সংরক্ষণ-সচেতনতা।',
    colorTags: ['#d4dae0', '#8fa2b0', '#f2f5f7'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Saphu_u2.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Saphu u2.jpg')],
  },
]
