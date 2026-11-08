import type { Species } from '@/lib/types'
import { IUCN, IUCN_BD, GBIF, HERPS_BD, SNAKES_BD_2025, REPFOCUS } from './sources'

/**
 * সরীসৃপ সম্প্রসারণ — ধাপ ১০: ৭টি প্রজাতি (২০২৬-১০-২৬)
 *
 * এ ব্যাচের প্রার্থী-যাচাইয়ে RepFocus বাংলাদেশ চেকলিস্ট (Midtgaard 2023,
 * সংশ্লিষ্ট প্রাথমিক উদ্ধৃতিসহ), Haidar et al. (2025, Herpetozoa 38:
 * 253–269), IUCN Bangladesh (২০১৫) ও Freshwater Biodiversity Portal of
 * Bangladesh ব্যবহৃত হয়েছে। প্রতিটি ছবির লেখক/লাইসেন্স Commons API
 * (extmetadata) দিয়ে যাচাই করে `media-licenses.ts`-এ নিবন্ধিত
 * (২টি CC BY 4.0 — jerdoni, granulatus; ৫টি CC BY-SA 4.0 —
 * khasiensis, calamaria, dhongoka, trijuga, westermanni); কোনো
 * Unidentified-ক্যাটাগরি, পুরোনো বই-চিত্র বা প্রজাতি-অনিশ্চিত ফাইল
 * নেওয়া হয়নি।
 *
 * গোত্র: Agamidae ১, Lacertidae ১, Colubridae ২, Acrochordidae ১,
 * Geoemydidae ২। IUCN: ১টি CR, ১টি NT, ৫টি LC।
 *
 * বিশেষ সিদ্ধান্ত: Boiga westermanni (পুরোনো নাম Elachistodon
 * westermanni) ও Acrochordus granulatus-কে Haidar et al. (2025)
 * বাংলাদেশে আঞ্চলিকভাবে বিলুপ্ত (RE) ধরেছে; ঘড়িয়াল-মকর পদ্ধতি
 * অনুসরণে প্রজাতি দুটি স্পষ্ট RE-শব্দায়নসহ রেকর্ডে রাখা হলো।
 *
 * বাদ-পড়া প্রার্থী (BIODIVERSITY-AUDIT §১৭–১৮-এ নথিভুক্ত):
 * [ধাপ ১১-এ নিষ্পত্তি] Eublepharis hardwickii, Hemidactylus
 * aquilonius, Dendrelaphis proarchos ও Oligodon russelius —
 * রেফারেন্স-পুনর্যাচাইয়ে more-reptiles11.ts-এ review-ফ্ল্যাগসহ
 * যুক্ত হয়েছে (২০২৬-১০-২৬); Rhabdophis bindi-কে Haidar 2025-র
 * “Not in Bangladesh” রায়ে চূড়ান্ত বর্জন করা হয়েছে। বহাল-বর্জিত:
 * Protobothrops mucrosquamatus (Haidar 2025: “Not in Bangladesh”),
 * Calotes minor (RepFocus BD চেকলিস্টে অনুপস্থিত), Draco norvillii
 * (সব BD-রেকর্ড ঐতিহাসিকভাবে D. blanfordii নামে—শনাক্তকরণ-অনিশ্চয়তা),
 * Sphenomorphus indicus (BD-ভাউচার
 * E. macularia বলে ধাপ ৭-এ নিষ্পত্তি), Oligodon theobaldi (একক
 * দুর্বল উদ্ধৃতি), Herpetoreas xenura (কমন্সে প্রজাতি-ছবি নেই),
 * Cyrtodactylus ayeyarwadyensis ও C. tripuraensis (প্রাণিছবি নেই,
 * শুধু মানচিত্র/শূন্য হিট), Eutropis trivittata (শুধু ১৮৩৩
 * Hardwicke চিত্র), Trachischium guentheri/monticola/tenuiceps ও
 * Blythia reticulata (শুধু গণ-স্তরের ছবি/পুরোনো বই), Lycodon zawi,
 * Ablepharus sikkimensis, Riopa lineolata, Tropidophorus assamensis
 * (মুক্ত লাইভ ছবি অনুপলব্ধ), Fowlea schnurrenbergeri (Unidentified
 * Colubroidea ক্যাটাগরি), Ahaetulla sahyadrensis (নাম-সংঘাত)।
 */
const COMMONS = (file: string): { title: string; url: string; license: string } => ({
  title: 'ছবির মূল ফাইল — Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${file}`,
  license: 'Wikimedia Commons',
})

export const MORE_REPTILES10: Species[] = [
  {
    slug: 'jerdons-forest-lizard', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'জার্ডন বন-গিরিগিটি', nameEn: "Jerdon's Forest Lizard", scientificName: 'Calotes jerdoni',
    otherNames: ['জার্ডন ক্যালোটস', 'Eastern Green Tree Agama', 'Calotes jerdoni Günther, 1870'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Agamidae', genus: 'Calotes', species: 'Calotes jerdoni' },
    summary: 'পূর্ব হিমালয়-পূর্ব ভারত-পার্বত্য চট্টগ্রামের আর্দ্র বনের সবুজাভ গিরিগিটি; Das (1996) ও Khan (2004)-এ বাংলাদেশে নথিভুক্ত; বিশ্বে LC।',
    description:
      'জার্ডন বন-গিরিগিটি মাঝারি আকারের পাতলা দেহি বৃক্ষবাসী টিকটিকি; প্রজনন-মৌসুমে পুরুষের দেহ উজ্জ্বল সবুজ-হলদেটে, পিঠে ফ্যাকাশে দাগ-ছোপ ও লম্বা সরু লেজ থাকে, স্কেল কিছুটা রুক্ষ। সাধারণ গিরিগিটি (Calotes versicolor)-র মতো খোলা জায়গার বদলে এটি ঘন পাহাড়ি বনের ঝোপ-গাছের ডালে থাকে; পোকামাকড় শিকার করে, দ্রুত ডাল বদলে লুকোয়। RepFocus বাংলাদেশ চেকলিস্ট Das (1996) ও Khan (2004)-এর উদ্ধৃতিতে প্রজাতিটি তালিকাভুক্ত করে; বাংলাদেশের একমাত্র নিশ্চিত আবাস পার্বত্য চট্টগ্রামের আর্দ্র পাহাড়ি বনাঞ্চল। বিশ্ব IUCN: ন্যূনতম-বিপদগ্রস্ত (LC); বন উজাড়ই প্রধান আঞ্চলিক হুমকি।',
    physical: 'মোট দৈর্ঘ্য ০.২৫–০.৪০ মিটার; সরু লেজ দেহের দ্বিগুণ; পুরুষ প্রজননে উজ্জ্বল সবুজ-হলদেটে।',
    identification: 'ঘন বনের সবুজাভ ক্যালোটস; মাথা তুলনামূলক খাটো-চওড়া; পিঠে সূক্ষ্ম দাগ; খোলা এলাকার C. versicolor থেকে আলাদা।',
    diet: 'পিঁপড়া, ঝিঁঝিঁ, গুবরে-পোকা ও অন্যান্য ক্ষুদে অমেরুদণ্ডী।',
    behavior: 'দিনচর বৃক্ষবাসী; ডাল-পাতায় রোদ পোহায়; ভয় পেলে দ্রুত ঝোপের ভেতর অদৃশ্য হয়।',
    reproduction: 'ডিম পাড়ে; মাটি-পাতার গর্তে কয়েকটি ডিম (তথ্য-স্বল্প)।',
    habitat: 'আর্দ্র চিরহরিৎ-মিশ্র পাহাড়ি বন, বন-প্রান্তের ঝোপ ও নিম্ন শাখা।',
    distribution: 'বাংলাদেশে পার্বত্য চট্টগ্রাম; বৈশ্বিকভাবে পূর্ব ভারত, নেপাল, ভুটান, মিয়ানমার পর্যন্ত।',
    whereToSee: 'পার্বত্য চট্টগ্রামের সংরক্ষিত বনে গবেষণা-টহলে (সাধারণ দর্শন বিরল)।',
    season: 'সারাবছর; বর্ষায় বেশি সক্রিয়, প্রজননে পুরুষের রঙ উজ্জ্বল।',
    sizeOrHeight: 'মোট দৈর্ঘ্য ০.২৫–০.৪০ মিটার',
    ecologicalRole: 'বনের পোকা-শিকারী; খাদ্যশৃঙ্খলে পোকা-নিয়ন্ত্রক ও পাখি-সাপের শিকার।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম-বিপদগ্রস্ত (LC); বাংলাদেশে বনাঞ্চল-সীমিত বিরল প্রজাতি।',
    threats: 'পাহাড়ি বন উজাড়, আবাস-খণ্ডায়ন, ঝোপ-পরিষ্কার।',
    conservationActions: 'পার্বত্য বন-সংরক্ষণ; আবাস-জরিপ ও জনতা-নথিকরণ; বনজ-সচেতনতা।',
    colorTags: ['#4e7a3a', '#8aa856', '#d8c46a'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Calotes_jerdoni_77948804.jpg',
    dataStatus: 'partial',
    sources: [HERPS_BD, IUCN, IUCN_BD, GBIF, REPFOCUS, COMMONS('Calotes_jerdoni_77948804.jpg')],
  },
  {
    slug: 'khasi-grass-lizard', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'খাসি ঘাস-টিকটিকি', nameEn: 'Khasi Hills Grass Lizard', scientificName: 'Takydromus khasiensis',
    otherNames: ['খাসিয়া ঘাস-টিকটিকি', 'Khasi Grass Lizard', 'Takydromus khasiensis Boulenger, 1917'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Lacertidae', genus: 'Takydromus', species: 'Takydromus khasiensis' },
    summary: 'অতি-সরু লম্বা-লেজি ঘাস-টিকটিকি; Hakim et al. (2020) বাংলাদেশে নথিভুক্ত করেন; পূর্ব-সীমান্তের ঘাস-ঝোপে বিরল; বিশ্বে LC।',
    description:
      'খাসি ঘাস-টিকটিকি অত্যন্ত সরু-চিকণ দেহ ও দেহের চেয়ে কয়েক গুণ লম্বা সূচালো লেজের জন্য ঘাসের ডগা থেকে সহজে চেনা যায়; পিঠ হালকা বাদামি-জলপাই, পাশে ফ্যাকাশে ডোরা, পেট সবুজাভ-সাদা। লম্বা পায়ের আঁকড়ে ঘাস-গাছের ডগায় দ্রুত ছোটে; পোকামাকড় ধরে, শিকারি এলে ঘাসের স্তূপে মিশে যায়। প্রজাতিটি মেঘালয়ের খাসি পাহাড়ের নামে নামাঙ্কিত; বাংলাদেশে Hakim, Trageser, Ghose, Das, Rashid & Rahman (2020)-এর সমীক্ষা RepFocus চেকলিস্টে উদ্ধৃত—পূর্ব-উত্তর সীমান্তের পাহাড়ি ঘাসভূমি-ঝোপই এর নথিভুক্ত আবাস। বিশ্ব IUCN: ন্যূনতম-বিপদগ্রস্ত (LC)।',
    physical: 'মোট দৈর্ঘ্য ০.১৬–০.২২ মিটার; লেজ দেহের ৩–৪ গুণ; সরু চিকণ সবুজাভ-বাদামি দেহ।',
    identification: 'ঘাসের ডগায় থাকা অতি-সরু সরীসৃপ; অসমান-লম্বা লেজ ও পার্শ্ব-ডোরা; অন্য টিকটিকির সঙ্গে সহজে গুলিয়ে যায় না।',
    diet: 'ঝিঁঝিঁ, পিঁপড়া, মাছি-মশা ও ক্ষুদে পোকা।',
    behavior: 'দিনচর; ঘাস-ডগায় রোদ পোহায় ও শিকার করে; দ্রুতগামী, ভয়ে ঘাসে লুকোয়।',
    reproduction: 'ডিম পাড়ে (সাধারণত ২–৪টি; আঞ্চলিক তথ্য-স্বল্প)।',
    habitat: 'পাহাড়ি ঘাসভূমি, বন-প্রান্তের ঝোপ, চা-বাগান-ঘেঁষা উঁচু তৃণভূমি।',
    distribution: 'বাংলাদেশে উত্তর-পূর্ব সীমান্তের পাহাড়ি এলাকা; ভারতের খাসি-গারো-নাগা পাহাড়, মিয়ানমার।',
    whereToSee: 'সিলেট-পার্বত্য চট্টগ্রাম সীমান্তের ঘাস-ঝোপে গবেষণা-নমুনায় (সাধারণ দর্শন বিরল)।',
    season: 'সারাবছর; রোদ-উজ্জ্বল দিনে সবচেয়ে সক্রিয়।',
    sizeOrHeight: 'মোট দৈর্ঘ্য ০.১৬–০.২২ মিটার',
    ecologicalRole: 'তৃণভূমির পোকা-নিয়ন্ত্রক; সাপ-পাখির খাদ্য হিসেবে খাদ্যশৃঙ্খলে ভূমিকা।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম-বিপদগ্রস্ত (LC); বাংলাদেশে অতি-বিরল ও সাম্প্রতিক-নথিভুক্ত।',
    threats: 'ঘাসভূমি-ঝোপ সাফ, পাহাড়ি কৃষি-বিস্তার, আবাস-খণ্ডায়ন।',
    conservationActions: 'সীমান্ত-পাহাড়ি তৃণভূমি সংরক্ষণ; লক্ষ্যভুক্ত জরিপ; প্রজাতির আঞ্চলিক বাস্তুতন্ত্র-গবেষণা।',
    colorTags: ['#7a8c4a', '#b4b878', '#e2e6c8'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Takydromus_khasiensis_032.jpg',
    dataStatus: 'partial',
    sources: [HERPS_BD, IUCN, IUCN_BD, GBIF, REPFOCUS, COMMONS('Takydromus_khasiensis_032.jpg')],
  },
  {
    slug: 'lesser-ringneck-snake', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'ছোট বলয়-গলা সাপ', nameEn: 'Lesser Ringneck Snake', scientificName: 'Liopeltis calamaria',
    otherNames: ['কালামারিয়া রিড সাপ', 'Calamaria Reed Snake', 'Ablabes calamarius (পুরোনো নাম)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Colubridae', genus: 'Liopeltis', species: 'Liopeltis calamaria' },
    summary: 'ছোট সরু নির্বিষ সাপ; গলায় হালকা বলয়-দাগ; Das (1996) ও Khan (2004)-এ বাংলাদেশে নথিভুক্ত; বিশ্বে LC।',
    description:
      'ছোট বলয়-গলা সাপ সরু-চিকণ ক্ষুদে সাপ, পিঠ ধূসর-বাদামি-জলপাই, পেট ফ্যাকাশে-হলদেটে এবং ঘাড়ে হালকা গাঢ় বলয়ের মতো দাগ থাকে; মাথা ছোট, চোখ গোল, আঁশ মসৃণ। ঝোপ-পাতা-স্তূপে লুকিয়ে পোকা-কেঁচো-ক্ষুদে টিকটিকি খায়; মানুষের প্রতি অহিংস, কামড়ালেও বিষ নেই। RepFocus বাংলাদেশ চেকলিস্ট Das (1996) ও Khan (2004)-এর উদ্ধৃতিতে প্রজাতিটি রাখে; বাংলাদেশের নথি পূর্ব-উত্তর ও পার্বত্য অঞ্চলের আর্দ্র বন-প্রান্তে। বিশ্ব IUCN: ন্যূনতম-বিপদগ্রস্ত (LC); দক্ষিণ এশিয়া জুড়ে বিচরণ হলেও স্থানীয়ভাবে বিরল ও কম-পরিচিত।',
    physical: 'দৈর্ঘ্য ০.৩–০.৪৫ মিটার; সরু মসৃণ-আঁশ দেহ; ঘাড়ে হালকা বলয়-দাগ, ফ্যাকাশে পেট।',
    identification: 'ছোট সরু নির্বিষ সাপ; গলার বলয়-দাগ ও চকচকে মসৃণ আঁশ; ঘন-দাগি কুকরি সাপ থেকে আলাদা।',
    diet: 'পোকা-লার্ভা, কেঁচো, ক্ষুদে টিকটিকি ও ব্যাঙের ছানা।',
    behavior: 'দিনচর; পাতা-স্তূপ-ঝোপে ঘোরে; ভয়ে মাটির গর্তে লুকোয়; নির্বিষ, কামড়ানোর প্রবণতা কম।',
    reproduction: 'ডিম পাড়ে; পাতা-মাটির আর্দ্র গর্তে অল্প ডিম (তথ্য-স্বল্প)।',
    habitat: 'আর্দ্র বন-প্রান্ত, ঝোপঝাড়, পাতা-স্তূপ, বাগান-ঘেঁষা ভূমি।',
    distribution: 'বাংলাদেশে পূর্ব-উত্তর/পার্বত্য বনাঞ্চল; ভারত, শ্রীলঙ্কা, নেপাল, মিয়ানমার।',
    whereToSee: 'পার্বত্য চট্টগ্রাম-সিলেটের আর্দ্র ঝোপে বিরল দর্শন; গবেষণা-নমুনাই প্রধান উৎস।',
    season: 'সারাবছর; বর্ষায় পাতা-স্তূপে বেশি দেখা যায়।',
    sizeOrHeight: 'দৈর্ঘ্য ০.৩–০.৪৫ মিটার',
    ecologicalRole: 'পাতা-স্তরের পোকা-কেঁচো-নিয়ন্ত্রক; বন-পাখি ও বড় সাপের শিকার।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম-বিপদগ্রস্ত (LC); নির্বিষ; বাংলাদেশে বিরল ও কম-নথিভুক্ত।',
    threats: 'বন-ঝোপ সাফ, পাতা-স্তর ধ্বংস, কীটনাশক, অজ্ঞতায় নির্বিচারে হত্যা।',
    conservationActions: 'আর্দ্র বন-প্রান্ত সংরক্ষণ; নির্বিষ সাপ হিসেবে সচেতনতা; আবাস-জরিপ।',
    colorTags: ['#6b6a4e', '#9a9672', '#e4ddc0'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Lesser_Striped_Necked_Snake_%28_Calamaria_Reed_Snake_%29.jpg',
    dataStatus: 'partial',
    sources: [HERPS_BD, IUCN, IUCN_BD, GBIF, REPFOCUS, COMMONS('Lesser_Striped_Necked_Snake_%28_Calamaria_Reed_Snake_%29.jpg')],
  },
  {
    slug: 'three-striped-roofed-turtle', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'রঙিলা ছাঁদ কাইট্টা', nameEn: 'Three-striped Roofed Turtle', scientificName: 'Batagur dhongoka',
    otherNames: ['ধোঙাক কাছিম', 'Dhongoka', 'Three-striped Roof Turtle', 'Kachuga dhongoka (পুরোনো নাম)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Testudines', family: 'Geoemydidae', genus: 'Batagur', species: 'Batagur dhongoka' },
    summary: 'গঙ্গা-ব্রহ্মপুত্র অববাহিকার বড় মিঠাপানির ছাঁদ-কাছিম; ১৯৯০-এর দশকে বাংলাদেশে “অপেক্ষাকৃত অপ্রচলিত” ছিল; বিশ্বে মারাত্মক-বিপদগ্রস্ত (CR)।',
    description:
      'রঙিলা ছাঁদ কাইট্টা বড় নদ-নির্ভর কাছিম; খোলস মসৃণ-চ্যাপ্টা, পৃষ্ঠে তিনটি অস্পষ্ট খিল ও অল্প বয়সে ফ্যাকাশে-রঙিলা ডোরা, মাথা ছোট-খাটো, পা-ঝিল্লি শক্তিশালী সাঁতারের জন্য গড়া। গভীর নদ-চর-শাখানদে মাছ-শামুক-জলজ উদ্ভিদ খেয়ে বড় হয়; বালির চরে ডিম পাড়ে। RepFocus বাংলাদেশ চেকলিস্ট Das (1996), Khan (2004), King & Burke (1989) ও Rashid & Khan (2000)-এর উদ্ধৃতি দেয়; IUCN-মূল্যায়নে Rashid & Khan (2000)-এর বরাতে ১৯৯০-এর দশকে বাংলাদেশে প্রজাতিটি “অপেক্ষাকৃত অপ্রচলিত (uncommon)” বলা হয়েছে। সাম্প্রতিক দশকে সমগ্র বিস্তৃতিতে ৮০%+ জনতা-পতনে বিশ্ব IUCN: মারাত্মক-বিপদগ্রস্ত (CR); CITES Appendix II; বাংলাদেশ বন্যপ্রাণি আইনে সংরক্ষিত।',
    physical: 'খোলস ০.৩৫–০.৪৮ মিটার (বড় নমুনা আরও বড়); চ্যাপ্টা মসৃণ পৃষ্ঠ, অল্পবয়সে রঙিলা ডোরা, জালি-পা।',
    identification: 'নদ-কাছিম; তিন খিল-যুক্ত চ্যাপ্টা খোলস; অন্যান্য Batagur/Pangshura থেকে বড় গড়ন ও মসৃণ মাথা-ত্বকে আলাদা।',
    diet: 'জলজ উদ্ভিদ-শৈবাল, মাছ, শামুক-ঝিনুক, পচা জৈবপদার্থ (সর্বভুক)।',
    behavior: 'জলচর; রোদ পোহাতে চর-ডাঙায় ওঠে; ভয়ে গভীর পানিতে ডুব দেয়; প্রজননে চরে বাসা করে।',
    reproduction: 'ডিম পাড়ে; বালির চরে গর্ত খুঁড়ে ১৬–৩৫টি ডিম, উষ্ণতা-নির্ভর সময়ে ফোটে।',
    habitat: 'বড় নদ-উপনদের গভীর খাত, বালির চর, মোহনা-ঘেঁষা মিঠাপানি।',
    distribution: 'গঙ্গা-ব্রহ্মপুত্র অববাহিকা (ভারত, বাংলাদেশ, নেপাল সম্ভাব্য); বাংলাদেশে অতি-বিরল।',
    whereToSee: 'বাংলাদেশে সাম্প্রতিক নিশ্চিত বন্য দর্শন অতি-বিরল; ভারতের চম্বল অভয়ারণ্যে সংরক্ষণ-কর্মসূচির প্রধান কেন্দ্র।',
    season: 'সারাবছর; শুষ্ক-মৌসুমে (মার্চ–মে) চরে ডিম পাড়ে।',
    sizeOrHeight: 'খোলস ০.৩৫–০.৪৮ মিটার',
    ecologicalRole: 'নদ-বাস্তুতন্ত্রের সর্বভুক; শামুক-উদ্ভিদ নিয়ন্ত্রণ ও পুষ্টি-চক্র; সংরক্ষণ-ফ্ল্যাগশিপ।',
    origin: 'native', conservation: 'CR', conservationBn: 'বৈশ্বিক IUCN: মারাত্মক-বিপদগ্রস্ত (CR); CITES Appendix II; বাংলাদেশ বন্যপ্রাণি আইনে সংরক্ষিত; দেশে অতি-বিরল।',
    threats: 'নদ-বাঁধ ও বালি উত্তোলন (চর-বাসা নষ্ট), জালে আটকা, ডিম-মাংস সংগ্রহ, দূষণ।',
    conservationActions: 'CITES-প্রয়োগ ও চোরাচালান-রোধ; চর-বাসা সুরক্ষা; হ্যাচারি-পুনর্বাসন (চম্বল মডেল); নদ-অববাহিকা জরিপ।',
    colorTags: ['#7a6a4a', '#a89468', '#d8c8a0'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Batagur_dhongoka_Hatchling_in_National_Chambal_Sanctuary%2C_India.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, REPFOCUS, COMMONS('Batagur_dhongoka_Hatchling_in_National_Chambal_Sanctuary%2C_India.jpg')],
  },
  {
    slug: 'indian-black-turtle', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'শামুকভুক কালী কাইট্টা', nameEn: 'Indian Black Turtle', scientificName: 'Melanochelys trijuga',
    otherNames: ['কালী কচ্ছপ', 'Snail-eating Turtle', 'Indian Pond Terrapin', 'Melanochelys trijuga coronata (উপ-প্রজাতি)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Testudines', family: 'Geoemydidae', genus: 'Melanochelys', species: 'Melanochelys trijuga' },
    summary: 'স্থির-পানির জলাশয়ের মাঝারি কালো কাছিম; Das & Bhupathy (2009) সহ একাধিক সূত্রে বাংলাদেশে নথিভুক্ত; বিশ্বে প্রায়-বিপদগ্রস্ত (NT)।',
    description:
      'শামুকভুক কালী কাইট্টা মাঝারি আকারের মূলত স্থির-পানির কাছিম; খোলস গাঢ়-বাদামি-কালচে, ডিম্বাকার ও অল্প খিল-যুক্ত, মাথা-ঘাড়ে হালকা দাগ-ছোপ, পা জালি-যুক্ত। পুকুর-বিল-ঝিল-মন্দির-দিঘির ধারে থাকে; শক্ত চোয়ালে শামুক-ঝিনুক গুঁড়ো করে খায়, পাশাপাশি জলজ উদ্ভিদ-পোকা-ক্ষুদে মেরুদণ্ডীও নেয়। RepFocus বাংলাদেশ চেকলিস্ট Das (1996), Das & Bhupathy (2009), Khan (2004), King & Burke (1989)-এর উদ্ধৃতি দেয়; Freshwater Biodiversity Portal of Bangladesh-ও প্রজাতিটির দেশীয় পাতা রাখে। বিশ্ব IUCN: প্রায়-বিপদগ্রস্ত (NT); জলাভূমি ভরাট ও অপরিকল্পিত আহরণ প্রধান হুমকি।',
    physical: 'খোলস ০.২৫–০.৩৮ মিটার; গাঢ় কালচে-বাদামি ডিম্বাকার খোলস, হালকা-দাগি মাথা, জালি-পা।',
    identification: 'স্থির-পানির কালচে কাছিম; ত্রি-খিল পাহাড়ি কাছিম (M. tricarinata) থেকে চ্যাপ্টা-মসৃণ পৃষ্ঠে আলাদা।',
    diet: 'শামুক-ঝিনুক (প্রধান), জলজ পোকা, কেঁচো, উদ্ভিদ-ফল, ক্ষুদে মেরুদণ্ডী।',
    behavior: 'অর্ধ-জলচর; দিনে পানি-ধারে রোদ পোহায়; রাতে সক্রিয়ভাবে খোঁজাখুঁজি করে; ভয়ে পানিতে ডুব দেয়।',
    reproduction: 'ডিম পাড়ে; পানি-ধারের মাটি-পাতার গর্তে ৬–১৬টি ডিম, ৬০–৮০ দিনে ফোটে।',
    habitat: 'পুকুর-বিল-ঝিল, মন্দির-দিঘি, ধীর-প্রবাহী খাল, জলাভূমি-প্রান্ত।',
    distribution: 'বাংলাদেশের উত্তর-উত্তর-পূর্ব জলাভূমি; ভারত, নেপাল, শ্রীলঙ্কা, মিয়ানমার, থাইল্যান্ড।',
    whereToSee: 'গ্রামীণ পুকুর-বিল ও সংরক্ষিত জলাভূমিতে বিরল দর্শন; প্রকাশিত জরিপ-নমুনাই প্রধান উৎস।',
    season: 'সারাবছর; বর্ষা-শেষে ও শীতে বেশি সক্রিয়, শুষ্ক-মৌসুমে প্রজনন।',
    sizeOrHeight: 'খোলস ০.২৫–০.৩৮ মিটার',
    ecologicalRole: 'শামুক-ঝিনুক-নিয়ন্ত্রক; জলাভূমির পুষ্টি-চক্র; বড় শিকারির খাদ্য।',
    origin: 'native', conservation: 'NT', conservationBn: 'বৈশ্বিক IUCN: প্রায়-বিপদগ্রস্ত (NT); বাংলাদেশে বিরল ও জলাভূমি-সংকোচনে ক্ষতিগ্রস্ত।',
    threats: 'জলাভূমি ভরাট, দূষণ, মাংস-পোষা-আহরণ, কীটনাশক, আক্রমণাত্মক মাছ।',
    conservationActions: 'জলাভূমি সংরক্ষণ; আহরণ-নিয়ন্ত্রণ; উদ্ধার-পুনর্বাসন; জনতা-জরিপ ও সচেতনতা।',
    colorTags: ['#3a342c', '#6a5e4c', '#b0a48c'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Cochin_black_turtle_%28Melanochelys_trijuga_coronata%29.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, REPFOCUS, COMMONS('Cochin_black_turtle_%28Melanochelys_trijuga_coronata%29.jpg')],
  },
  {
    slug: 'indian-egg-eater', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'ভারতীয় ডিমখেকো সাপ', nameEn: 'Indian Egg-eating Snake', scientificName: 'Boiga westermanni',
    otherNames: ['এলাচিস্টোডন ওয়েস্টারম্যানি', 'Elachistodon westermanni (পুরোনো নাম)', 'Indian Egg Eater'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Colubridae', genus: 'Boiga', species: 'Boiga westermanni' },
    summary: 'পাখির ডিমে বিশেষীকৃত rear-fanged সাপ; ১৮৬৩-এ রংপুরে হলোটাইপ সংগৃহীত, তারপর বাংলাদেশে কোনো নিশ্চিত রেকর্ড নেই—Haidar et al. (2025) আঞ্চলিকভাবে বিলুপ্ত (RE) ধরেছে।',
    description:
      'ভারতীয় ডিমখেকো সাপ সরু-মাঝারি দেহের রাতচর সাপ; পিঠ চকচকে কালচে-বাদামি-অপ্রকাশ্য ডোরা-যুক্ত, পেট ফ্যাকাশে, মাথা সামান্য চওড়া। চোয়ালের হাড় ও গলার কশেরুকা বিশেষভাবে গড়া—পুরো পাখির ডিম গিলে খোলস ভেঙে খায়; এশিয়ার কয়েকটি ডিম-বিশেষজ্ঞ সাপের অন্যতম। ১৮৬৩-এ “Rungpore, Bengal” (অধুনা রংপুর, বাংলাদেশ) থেকে হলোটাইপ সংগৃহীত হয়ে Elachistodon westermanni নামে বর্ণিত হয়; পরবর্তী আণবিক গবেষণায় এটি Boiga গণে স্থানান্তরিত হয়। Haidar et al. (2025)-এর পদ্ধতিগত সমীক্ষা বলে ওই একমাত্র ১৮৬৩ রেকর্ডের পর বাংলাদেশে কোনো নিশ্চিত দর্শন নেই এবং প্রজাতিটিকে তিনটি আঞ্চলিকভাবে-বিলুপ্ত সাপের একটি ধরা হয়েছে; বর্তমান নিশ্চিত জনতা মূলত ভারতে। কামড় বিরল ও rear-fanged—কামড়ালে দ্রুত হাসপাতালে যেতে হবে, কোনো ঘরোয়া পদ্ধতি নয়। বিশ্ব IUCN: ন্যূনতম-বিপদগ্রস্ত (LC)।',
    physical: 'দৈর্ঘ্য ০.৫৫–০.৮ মিটার; চকচকে কালচে-বাদামি সরু দেহ, ফ্যাকাশে পেট, ডিম গেলার উপযোগী প্রসার্য চোয়াল।',
    identification: 'রাতচর সরু সাপ; অপ্রকাশ্য পৃষ্ঠ-ডোরা; ডিম-বিশেষজ্ঞ খাদ্যাভ্যাস; অন্য Boiga থেকে ঐতিহাসিক-নাম ও গঠনে আলাদা।',
    diet: 'প্রধানত পাখির ডিম (গিলে খোলস ভাঙা); কদাচিৎ ক্ষুদে মেরুদণ্ডী।',
    behavior: 'রাতচর বৃক্ষ-ঝোপবাসী; পাখির বাসা খোঁজে; লাজুক, মানুষ এড়িয়ে চলে; rear-fanged।',
    reproduction: 'ডিম পাড়ে (ক্লাচ-তথ্য অপ্রতুল)।',
    habitat: 'শুষ্ক-পাতাঝরা বন, বন-প্রান্ত, ঝোপ-বাগান, গ্রাম্য গাছপালা।',
    distribution: 'ঐতিহাসিকভাবে রংপুর (বাংলাদেশ, ১৮৬৩ হলোটাইপ); বর্তমান নিশ্চিত জনতা ভারতের বিভিন্ন রাজ্যে; বাংলাদেশে আঞ্চলিকভাবে বিলুপ্ত বলে বিবেচিত।',
    whereToSee: 'বাংলাদেশে কোনো সাম্প্রতিক নিশ্চিত দর্শন নেই; জাদুঘর-হলোটাইপ ও ভারতীয় রেকর্ডই ভিত্তি।',
    season: 'সারাবছর (প্রজনন-মৌসুমের আঞ্চলিক তথ্য নেই)।',
    sizeOrHeight: 'দৈর্ঘ্য ০.৫৫–০.৮ মিটার',
    ecologicalRole: 'ডিম-শিকারি বিশেষজ্ঞ; পাখি-জনতা নিয়ন্ত্রণে সীমিত ভূমিকা; বিরল বিবর্তনীয় বংশ।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম-বিপদগ্রস্ত (LC); Haidar et al. (2025): বাংলাদেশে আঞ্চলিকভাবে বিলুপ্ত (RE)—১৮৬৩-এর রংপুর হলোটাইপই একমাত্র দেশীয় রেকর্ড।',
    threats: 'ঐতিহাসিক বন-উজাড় ও আবাস-পরিবর্তন; rear-fanged বলে অজ্ঞতায় হত্যা; দেশে পুনঃআবিষ্কার-গবেষণার অভাব।',
    conservationActions: 'লক্ষ্যভুক্ত অনুসন্ধান-জরিপ; সংগ্রহালয়-নমুনা যাচাই; rear-fanged সাপ হিসেবে হাসপাতাল-পরামর্শ-ভিত্তিক সচেতনতা।',
    colorTags: ['#4a3f32', '#74644c', '#cfc4ac'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Indian_egg-eater.jpg',
    dataStatus: 'partial',
    sources: [IUCN, GBIF, SNAKES_BD_2025, REPFOCUS, COMMONS('Indian_egg-eater.jpg')],
  },
  {
    slug: 'lesser-file-snake', type: 'prani', group: 'sarisrip', category: 'সরীসৃপ',
    nameBn: 'ক্ষুদে ফাইল সাপ', nameEn: 'Lesser File Snake', scientificName: 'Acrochordus granulatus',
    otherNames: ['দানাদার-চামড়া সাপ', 'Marine File Snake', 'Little Wart Snake', 'Acrochordus granulatus (Schneider, 1799)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Reptilia', order: 'Squamata', family: 'Acrochordidae', genus: 'Acrochordus', species: 'Acrochordus granulatus' },
    summary: 'ঢিলেঢালা দানাদার চামড়ার জল-সাপ; Das (1996) ও Khan (2004)-এ বাংলাদেশে তালিকাভুক্ত, কিন্তু Haidar et al. (2025) পাঁচ দশকের দর্শন-শূন্যতায় আঞ্চলিকভাবে বিলুপ্ত (RE) ধরেছে।',
    description:
      'ক্ষুদে ফাইল সাপ সম্পূর্ণ জলচর সাপ; দেহ ঢিলেঢালা-বস্তাবন্দি, চামড়া ছোট ছোট দানা-আঁশে রুক্ষ—ফাইল (রেত্তি)-র মতো, তাই নাম; রঙ ধূসর-বাদামি with গাঢ় বলয়-দাগ, পুচ্ছ চ্যাপ্টা-সাঁতারুর মতো, পেট-আঁশ চওড়া না হওয়ায় স্থলে প্রায় চলতে পারে না। অগভীর সমুদ্র-মোহনা-ম্যানগ্রোভ-এ মাছ-চিংড়ি ধরে; রুক্ষ চামড়া পিচ্ছিল শিকার আঁকড়ে ধরে। RepFocus বাংলাদেশ চেকলিস্ট Das (1996) ও Khan (2004)-এর উদ্ধৃতি দেয়; কিন্তু Haidar et al. (2025)-এর সমীক্ষা গত পাঁচ দশকে বাংলাদেশে কোনো নথিভুক্ত দর্শন পায়নি এবং প্রজাতিটিকে তিনটি আঞ্চলিকভাবে-বিলুপ্ত সরীসৃপের একটি ঘোষণা করে (Acrochordus granulatus, Boiga westermanni, Dieurostus dussumieri)। নির্বিষ ও অহিংস; বিশ্ব IUCN: ন্যূনতম-বিপদগ্রস্ত (LC)।',
    physical: 'দৈর্ঘ্য ০.৬–১.০ মিটার; ঢিলেঢালা দানা-আঁশের রুক্ষ চামড়া, চ্যাপ্টা সাঁতারু-পুচ্ছ, পার্শ্ব-চাপা দেহ।',
    identification: 'সম্পূর্ণ জলচর; রুক্ষ ফাইল-সদৃশ চামড়া ও গাঢ় বলয়; স্থলে চলতে অক্ষম—অন্য কোনো সাপের সঙ্গে গুলিয়ে যায় না।',
    diet: 'মাছ, চিংড়ি-কাঁকড়া, ক্ষুদে জলজ প্রাণী; অ্যামবুশ শিকারি।',
    behavior: 'রাতচর; অগভীর পানিতে ডুবে থেকে শিকার ধরে; নির্বিষ, কামড়ায় না প্রায়; স্থলে অসহায়।',
    reproduction: 'সরীসৃপে বিরল জরায়ুজ-প্রবণ; পানিতেই ৮–১২টি বাচ্চা দেয় (ডিম পাড়ে না)।',
    habitat: 'অগভীর সামুদ্রিক তলদেশ, মোহনা, ম্যানগ্রোভ-খাঁড়ি, লোনা-এলাকা।',
    distribution: 'ভারত-প্রশান্ত মহাসাগরের উপকূল জুড়ে; বাংলাদেশে ঐতিহাসিকভাবে সুন্দরবন-উপকূলে নথিভুক্ত, বর্তমানে RE-বিবেচিত।',
    whereToSee: 'বাংলাদেশে সাম্প্রতিক নিশ্চিত দর্শন নেই; দক্ষিণ-পূর্ব এশিয়া-অস্ট্রেলিয়ার উপকূলে প্রজাতিটি টিকে আছে।',
    season: 'সারাবছর; জোয়ার-ভাটা-নির্ভর রাত্রিচর।',
    sizeOrHeight: 'দৈর্ঘ্য ০.৬–১.০ মিটার',
    ecologicalRole: 'উপকূলীয় জল-খাদ্যশৃঙ্খলের মাছ-শিকারি; নির্বিষ; ম্যানগ্রোভ-বাস্তুতন্ত্রের নির্দেশক প্রজাতি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম-বিপদগ্রস্ত (LC); Haidar et al. (2025): বাংলাদেশে আঞ্চলিকভাবে বিলুপ্ত (RE)—পাঁচ দশকের দর্শন-শূন্যতা।',
    threats: 'ম্যানগ্রোভ ধ্বংস, ট্রল-জালে bycatch, উপকূল-দূষণ, লোনাপানি-আবাস সংকোচন।',
    conservationActions: 'সুন্দরবন-উপকূলে লক্ষ্যভুক্ত পুনঃঅনুসন্ধান; bycatch-হ্রাস; ম্যানগ্রোভ সংরক্ষণ; জরিপ-নথিকরণ।',
    colorTags: ['#6e6a5e', '#9a9484', '#d2ccbc'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Acrochordus_granulatus_14797406.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, SNAKES_BD_2025, REPFOCUS, COMMONS('Acrochordus_granulatus_14797406.jpg')],
  },
]
