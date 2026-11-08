import type { Species } from '@/lib/types'
import { IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD } from './sources'

/**
 * উভচর সম্প্রসারণ — ধাপ ৩ (উভচর ব্যাচ ৩, ২০২৬-১০-২৬): ১০টি ব্যাঙ
 *
 * লক্ষ্যভিত্তি: Rayan & Islam (2026)-এর ৯৬-প্রজাতির হালনাগাদ
 * চেকলিস্ট (EcoEvoRxiv)। এ ব্যাচে Dicroglossidae ৫,
 * Rhacophoridae ২, Ranidae ১, Megophryidae ১, Microhylidae ১।
 * প্রতিটি ছবির লেখক/লাইসেন্স Commons API (extmetadata) দিয়ে
 * যাচাই: ৪টি CC BY-SA 4.0, ২টি CC BY 4.0, ১টি CC BY-SA 2.0,
 * ১টি CC BY 3.0, ২টি CC0 (একটি PLoS ONE গবেষণাপত্র-চিত্র,
 * একটি ক্যালফোটো-CC0) — কোনো ঊনবিংশ শতকের বই-চিত্র বা
 * Unidentified-ক্যাটাগরির ফাইল নেওয়া হয়নি।
 *
 * বিশেষ সিদ্ধান্ত:
 *  - Polypedates bengalensis ২০১৯-এ বর্ণিত (পুরোনো নথি ২০১৪,
 *    Das et al. 2025 নামকরণ-রেফারেন্স); এখনো IUCN-মূল্যায়ন
 *    হয়নি (NE) — Commons-এর “valued” CC BY 4.0 জীবন্ত ছবি।
 *  - Fejervarya limnocharis-এর নাম-জট: sensu stricto ট্যাক্সন
 *    জাভা/দক্ষিণ-পূর্ব এশিয়ার; দক্ষিণ এশীয় ঐতিহাসিক রেকর্ডের
 *    বড় অংশ Minervarya agricola-তে স্থানান্তরিত। Rayan &
 *    Islam (2026) তবু বাংলাদেশ-চেকলিস্টে F. limnocharis
 *    রেখেছেন; ব্যবহৃত ছবিটি জাভার (টাইপ-অঞ্চল) নমুনা বলে
 *    স্বচ্ছভাবে উল্লিখিত।
 *  - Xenophrys major-এর ছবির ফাইলনাম পুরোনো Megophrys major;
 *    Nasutixalus jerdonii পূর্বে Frankixalus/Philautus jerdonii
 *    নামে পরিচিত ছিল — দ্বৈত-নাম otherNames-এ সংরক্ষিত।
 *  - লেগ্যাসি বীজ (extra-species/more-herps)-এ আগে থেকেই
 *    থাকায় পুনঃসংযোজন করা হয়নি: Euphlyctis cyanophlyctis,
 *    Microhyla ornata, Uperodon systoma, Duttaphrynus
 *    stomaticus, Kaloula pulchra, Minervarya teraiensis,
 *    Phrynoderma hexadactylum (= E. hexadactylus)।
 *
 * বর্জিত/মুলতবি প্রার্থী (নথিভুক্ত): Sphaerotheca breviceps
 * (কমন্সের ফাইলগুলোর নাম S. dobsonii কিন্তু ক্যাটাগরি
 * breviceps — পরিচয়-দ্বন্দ্ব, গ্রহণ করা হয়নি), Euphlyctis
 * adolfi ও Amolops indoburmanensis ও Chiromantis hansenae ও
 * Hylarana lacrima (শূন্য হিট), Fejervarya orissaensis (শুধু
 * IUCN SVG মানচিত্র), Limnonectes khasianus ও Hylarana
 * humeralis (শুধু ঊনবিংশ শতকের PD বই-চিত্র), Duttaphrynus
 * bengalensis (শুধু PDF, লাইভ ছবি নেই), Raorchestes
 * annandalii (অডিও + ১৯০৭ চিত্র, লাইভ ছবি নেই), Fejervarya
 * brama (প্রজাতি-নির্দিষ্ট লাইভ ছবি নেই)। পূর্ববর্তী
 * ব্যাচের বর্জন ও ৯ এন্ডেমিক/“presence uncertain” ট্যাক্সা
 * বহাল।
 */
const COMMONS = (file: string): { title: string; url: string; license: string } => ({
  title: 'ছবির মূল ফাইল — Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${file}`,
  license: 'Wikimedia Commons',
})

export const MORE_AMPHIBIANS3: Species[] = [
  {
    slug: 'common-indian-cricket-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'ধানক্ষেত্রর ব্যাঙ', nameEn: 'Common Indian Cricket Frog', scientificName: 'Minervarya agricola',
    otherNames: ['সাধারণ ক্রিকেট ব্যাঙ', 'Indian Cricket Frog', 'Fejervarya agricola (পুরোনো নাম)', 'Minervarya agricola (Jerdon, 1853)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Dicroglossidae', genus: 'Minervarya', species: 'Minervarya agricola' },
    summary: 'ধানক্ষেত-ভেজা মাঠের সর্বত্র-দেখা ক্ষুদে দানাদার-চামড়ার ব্যাঙ; লম্বা ডিগে লাফ দেয়; দক্ষিণ এশিয়াজুড়ে বিস্তৃত; বৈশ্বিক LC।',
    description:
      'ধানক্ষেত্রর ব্যাঙ ক্ষুদে-মাঝারি ক্রিকেট ব্যাঙ; পিঠ বাদামি-জলপাই with গাঢ় ভাঁজ-দাগ ও ছোট আঁচিল, পেট ফ্যাকাশে সাদা, থুতনি সূঁচালো-গোল, পেছনের পা লম্বা-মাংসল। ভেজা মাঠ-ধানক্ষেত-ডোবা-নালার ধারে পোকা-শাবক শিকার করে; বিপদে অনেক দূর লাফ দিয়ে ঘাস-ফাটলে লুকোয়। দীর্ঘদিন Fejervarya limnocharis জটের অংশ ধরা হতো; আণবিক গবেষণায় Minervarya agricola স্বতন্ত্র প্রজাতি হিসেবে স্বীকৃত। Rayan & Islam (2026)-এর ৯৬-প্রজাতির চেকলিস্টে বাংলাদেশে নথিভুক্ত; বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৩–৪ সেমি; দানাদার পিঠ, গাঢ় ভাঁজ-দাগ, লম্বা পেছনের পা।',
    identification: 'ধানক্ষেতের ক্ষুদে বাদামি ব্যাঙ; ধারাবাহিক কর্কশ ডাক; M. syhadrensis-অপেক্ষকৃত স্থূলকায়।',
    diet: 'পোকা-শাবক, পিঁপড়া, মাকড়সা, কেঁচো ও ক্ষুদে অমেরুদণ্ডী।',
    behavior: 'বর্ষায় সক্রিয়; ভেজা আইল-ঘাসে ঘোরে; রাতে ও ভোরে ডাকে।',
    reproduction: 'অস্থায়ী ডোবা-ধানক্ষেতের জলে ডিম; ট্যাডপোল অল্প জলে দ্রুত বাড়ে।',
    habitat: 'ধানক্ষেত, ভেজা তৃণভূমি, অগভীর ডোবা-নালা-প্রান্ত, গ্রামীণ জমি।',
    distribution: 'বাংলাদেশজুড়ে নিম্নভূমি; ভারত-শ্রীলঙ্কা-নেপাল-ভুটানে বিস্তৃত।',
    whereToSee: 'বর্ষাকালে যেকোনো ধানক্ষেত-ডোবার পাড়ে সন্ধ্যায় সহজেই দেখা যায়।',
    season: 'প্রজনন বর্ষাকালে (এপ্রিল–সেপ্টেম্বর); সারাবছর সক্রিয়।',
    sizeOrHeight: '৩–৪ সেন্টিমিটার',
    ecologicalRole: 'কৃষি-পতঙ্গ-নিয়ন্ত্রক; সাপ-পাখি-ছোট স্তন্যপায়ীর খাদ্য।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বিস্তৃত বিন্যাস ও সাধারণ প্রজাতি।',
    threats: 'কীটনাশক, ধানক্ষেত-ভরাট, অতি-সেচ, আবাস-টুকরোকরণ।',
    conservationActions: 'ধানক্ষেত-জলাশয় সংরক্ষণ; কীটনাশক-নিয়ন্ত্রণ; limnocharis-জটে ডাক-আণবিক জরিপ।',
    colorTags: ['#7d6f52', '#4a4030', '#d8d0ba'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Minervarya_agricola.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Minervarya_agricola.jpg')],
  },
  {
    slug: 'long-legged-cricket-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'সাইহাড্রা বীর্বি ব্যাঙ', nameEn: 'Long-legged Cricket Frog', scientificName: 'Minervarya syhadrensis',
    otherNames: ['দক্ষিণি ক্রিকেট ব্যাঙ', 'Southern Cricket Frog', 'Fejervarya syhadrensis (পুরোনো নাম)', 'Minervarya syhadrensis (Annandale, 1919)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Dicroglossidae', genus: 'Minervarya', species: 'Minervarya syhadrensis' },
    summary: 'অতি-লম্বা পাওয়ালা ক্ষুদে ক্রিকেট ব্যাঙ; বর্ষার ডোবা-ধানক্ষেতে জোরে ডাকে; দক্ষিণ এশিয়ার বিস্তৃত প্রজাতি; বৈশ্বিক LC।',
    description:
      'সাইহাড্রা বীর্বি ব্যাঙ ক্ষুদে-হালকা-গড়নের ক্রিকেট ব্যাঙ; পিঠ ধূসর-বাদামি with গাঢ় ত্রিভুজাকার দাগ ও সূক্ষ্ম আঁচিল, পেছনের পা শরীরের তুলনায় অসাধারণ লম্বা, পেট সাদা। স্থির জলাশয়-ধানক্ষেত-ঘাস-জমিতে পোকা শিকার করে; লম্বা লাফে দ্রুত সরে যায়। Minervarya গণের রূপগত-জটে থাকলেও ডাক-আণবিক বৈশিষ্ট্যে স্বতন্ত্র। Rayan & Islam (2026) চেকলিস্টে বাংলাদেশে নথিভুক্ত; বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ২.৫–৩.৫ সেমি; অতি-লম্বা পেছনের পা, ধূসর-বাদামি দাগি পিঠ।',
    identification: 'ক্ষুদে লম্বা-পা ব্যাঙ; বর্ষার দ্রুত ছন্দের ডাক; agricola-অপেক্ষকৃত ছোট ও হালকা।',
    diet: 'ছোট পতঙ্গ, পিঁপড়া, মশা-লার্ভা, মাকড়সা।',
    behavior: 'বর্ষায় দিন-রাত সক্রিয়; ডোবা-পাড়ে বসে ডাকে; ভয়ে লম্বা লাফ দেয়।',
    reproduction: 'বৃষ্টির ডোবা-ধানক্ষেতে ডিম; ট্যাডপোল দ্রুত রূপান্তরিত হয়।',
    habitat: 'ধানক্ষেত, অস্থায়ী বর্ষার জলাশয়, ভেজা তৃণভূমি, নদ-প্রান্ত।',
    distribution: 'বাংলাদেশের নিম্নভূমি; ভারত-নেপাল-পাকিস্তান-শ্রীলঙ্কা বিন্যাস।',
    whereToSee: 'বর্ষাকালে গ্রামীণ ডোবা-ধানক্ষেতের পাড়ে ডাক শোনা ও দেখা যায়।',
    season: 'প্রজনন বর্ষাকালে (মে–সেপ্টেম্বর)।',
    sizeOrHeight: '২.৫–৩.৫ সেন্টিমিটার',
    ecologicalRole: 'কৃষি-পতঙ্গ-নিয়ন্ত্রক; জলচর-স্থলচর শিকারিদের খাদ্য।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); গণ-জটে আঞ্চলিক জনতা-তথ্য কম।',
    threats: 'কীটনাশক, ডোবা-ভরাট, শুষ্ককরণ, আবাস-টুকরোকরণ।',
    conservationActions: 'বর্ষার ডোবা-ধানক্ষেত রক্ষা; কীটনাশক-নিয়ন্ত্রণ; ডাক-আণবিক জরিপ।',
    colorTags: ['#8a7d63', '#4f4636', '#ddd6c2'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Minervarya_syhadrensis.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Minervarya_syhadrensis.jpg')],
  },
  {
    slug: 'pierres-wart-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'পিয়েরের বীবি ব্যাঙ', nameEn: "Pierre's Wart Frog", scientificName: 'Minervarya pierrei',
    otherNames: ['পিয়েরের ক্রিকেট ব্যাঙ', "Pierre's Cricket Frog", 'Fejervarya pierrei (পুরোনো নাম)', 'Zakerana pierrei (পুরোনো নাম)', 'Minervarya pierrei (Dubois, 1975)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Dicroglossidae', genus: 'Minervarya', species: 'Minervarya pierrei' },
    summary: 'তেরাই-পাদদেশের দানাদার-চামড়ার ক্ষুদে ব্যাঙ; ভুটান-নেপাল-উত্তর-পূর্ব ভারত-বাংলাদেশ বিন্যাস; বৈশ্বিক LC।',
    description:
      'পিয়েরের বীবি ব্যাঙ ক্ষুদে দানাদার-আঁচিল-আচ্ছন্ন ক্রিকেট ব্যাঙ; পিঠ বাদামি-জলপাই with গাঢ় ভাঁজ-দাগ, পেছনের পায়ে ডোরা-কাটা, পেট ফ্যাকাশে, মাথা খাটো-চওড়া। পাহাড়ি-পাদদেশের ভেজা মাঠ-ডোবা-ধানক্ষেতে পোকা-শাবক খায়; বর্ষায় কর্কশ ধারাবাহিক ডাক দেয়। দীর্ঘদিন Fejervarya/Zakerana নামে ছিল; বর্তমানে Minervarya গণে। Rayan & Islam (2026) চেকলিস্টে বাংলাদেশের উত্তর-পূর্ব সীমান্তে নথিভুক্ত; বৈশ্বিক IUCN কোড LC। ব্যবহৃত ছবিটি ভুটানের JoTT-জার্নাল-প্রকাশিত জীবন্ত আলোকচিত্র।',
    physical: 'দৈর্ঘ্য ৩–৪ সেমি; আঁচিল-আচ্ছন্ন পিঠ, পায়ে ডোরা, খাটো-চওড়া মাথা।',
    identification: 'পাদদেশ-ভূমির ক্ষুদে দানাদার ব্যাঙ; nepalensis-সদৃশ—ডাক-আণবিক পার্থক্যে।',
    diet: 'পোকা-শাবক, পিঁপড়া, মাকড়সা, কেঁচো।',
    behavior: 'বর্ষায় সক্রিয়; ভেজা মাঠ-নালায় ঘোরে; লুকিয়ে থাকা স্বভাব।',
    reproduction: 'অস্থায়ী ডোবা-ধানক্ষেতে ডিম; ট্যাডপোল অল্প জলে বাড়ে।',
    habitat: 'পাদদেশীয় ধানক্ষেত, ভেজা তৃণভূমি, ডোবা-নালা-প্রান্ত।',
    distribution: 'বাংলাদেশের উত্তর-উত্তর-পূর্ব সীমান্ত; নেপাল-ভুটান-উত্তর-পূর্ব ভারত বিন্যাস।',
    whereToSee: 'উত্তর-পূর্ব সীমান্তের পাদদেশীয় ধানক্ষেতে বর্ষার সন্ধ্যায় (ডাক শোনা যায়)।',
    season: 'প্রজনন বর্ষাকালে (মে–সেপ্টেম্বর)।',
    sizeOrHeight: '৩–৪ সেন্টিমিটার',
    ecologicalRole: 'কৃষি-পতঙ্গ-নিয়ন্ত্রক; সাপ-পাখির খাদ্য।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); গণ-জটে আঞ্চলিক তথ্য-ঘাটতি।',
    threats: 'কীটনাশক, ধানক্ষেত-ভরাট, পাদদেশ-আবাস টুকরোকরণ।',
    conservationActions: 'পাদদেশ-জলাশয় রক্ষা; কীটনাশক-নিয়ন্ত্রণ; ডাক-আণবিক জরিপ।',
    colorTags: ['#76684f', '#463c2c', '#d6cfba'],
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Fejervarya_pierrei%2C_Tshangkha%2C_Dagana%2C_Bhutan.jpg",
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Fejervarya_pierrei%2C_Tshangkha%2C_Dagana%2C_Bhutan.jpg')],
  },
  {
    slug: 'green-mountain-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'সবুজ ক্যাসকেড ব্যাঙ', nameEn: 'Green Mountain Frog', scientificName: 'Odorrana livida',
    otherNames: ['সবুজ পাহাড়ি ব্যাঙ', 'Green Cascade Frog', 'Rana livida (পুরোনো নাম)', 'Odorrana livida (Blyth, 1856)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Ranidae', genus: 'Odorrana', species: 'Odorrana livida' },
    summary: 'পাহাড়ি স্রোতের বড় চকচকে-সবুজ ব্যাঙ; পাথর-শ্যাওলায় বসে থাকে; O. chloronota-র নিকট-আত্মীয়; বৈশ্বিক LC।',
    description:
      'সবুজ ক্যাসকেড ব্যাঙ মাঝারি-বড় সরু-মসৃণ স্রোত-ব্যাঙ; পিঠ উজ্জ্বল সবুজ-জলপাই, ত্বক চকচকে, পেট সাদা, পেছনের পা লম্বা ও আঙুলে চওড়া জালি, কান-ঢাকনা গাঢ়। অক্সিজেন-সমৃদ্ধ পাহাড়ি ঝরনা-ছড়ার পাথরে পোকা-ছোট কাঁকড়া শিকার করে; ভয়ে স্রোতে ডুব দিয়ে পাথর-নিচে লুকোয়। ঐতিহাসিকভাবে Rana livida নামে ছিল; O. chloronota-র সঙ্গে রূপগত মিল থাকায় মাঠ-শনাক্তে সতর্কতা জরুরি। Rayan & Islam (2026) চেকলিস্টে সিলেট-পার্বত্য চট্টগ্রামে নথিভুক্ত; বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৭–১০ সেমি; চকচকে সবুজ মসৃণ পিঠ, চওড়া জালি-পা, সাদা পেট।',
    identification: 'ঝরনা-পাথরের বড় উজ্জ্বল-সবুজ ব্যাঙ; chloronota-অপেক্ষকৃত সরু ও বেশি চকচকে।',
    diet: 'পোকা-শাবক, মাকড়সা, ছোট কাঁকড়া-চিংড়ি, কেঁচো।',
    behavior: 'নিশাচর; স্রোত-পাথরে স্থির বসে থাকে; ভয়ে দ্রুত ডুব দেয়।',
    reproduction: 'স্রোতের পাথর-নিচে ডিম; ট্যাডপোল স্রোতে আঁকড়ে বাড়ে (তথ্য-স্বল্প)।',
    habitat: 'পাহাড়ি ঝরনা-ছড়া, জলপ্রপাত-কূল, অক্সিজেন-সমৃদ্ধ স্বচ্ছ স্রোত।',
    distribution: 'সিলেট-পার্বত্য চট্টগ্রামের পাহাড়ি বন; মিয়ানমার-থাইল্যান্ড-চীন-ইন্দোচীন বিন্যাস।',
    whereToSee: 'সাতছড়ি-লাউয়াছড়া-বান্দরবানের ঝরনা-পাথরে রাতে টর্চ-হাঁটায়।',
    season: 'সারাবছর; বর্ষায় প্রজনন-সক্রিয়।',
    sizeOrHeight: '৭–১০ সেন্টিমিটার',
    ecologicalRole: 'স্রোত-বাস্তুতন্ত্রের শীর্ষ পতঙ্গভুক; স্বচ্ছ-পানির মান-সূচক।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে স্বচ্ছ পাহাড়ি স্রোতে সীমাবদ্ধ।',
    threats: 'ঝরনা-দখল-দূষণ, বালু-পাথর উত্তোলন, পাহাড়ি বন উজাড়।',
    conservationActions: 'স্রোত-জলাধার সংরক্ষণ; দখল-উত্তোলন বন্ধ; পানি-মান পরিবীক্ষণ।',
    colorTags: ['#4f7a44', '#2f4a2c', '#e4e8da'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Odorrana_livida_in_Thailand_543801832.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Odorrana_livida_in_Thailand_543801832.jpg')],
  },
  {
    slug: 'jerdons-bubble-nest-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'জার্ডনের বুদবুদ-বাসা ব্যাঙ', nameEn: "Jerdon's Bubble-nest Frog", scientificName: 'Nasutixalus jerdonii',
    otherNames: ['জার্ডনের গাছ-কোটর ব্যাঙ', "Jerdon's Tree-hole Frog", 'Frankixalus jerdonii (পুরোনো নাম)', 'Philautus jerdonii (পুরোনো নাম)', 'Nasutixalus jerdonii (Günther, 1876)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Rhacophoridae', genus: 'Nasutixalus', species: 'Nasutixalus jerdonii' },
    summary: 'গাছ-কোটরে প্রজনন করা বিরল বৃক্ষবাসী ব্যাঙ; ট্যাডপোল ডিম-খাদক; দীর্ঘদিন “হারানো” প্রজাতি ছিল; বৈশ্বিক LC।',
    description:
      'জার্ডনের বুদবুদ-বাসা ব্যাঙ মাঝারি বৃক্ষবাসী ব্যাঙ; পিঠ বাদামি-ধূসর with গাঢা দাগ, চোখ বড়, থুতনি সামান্য সূঁচালো, আঙুলে চোষা-থালি। গাছ-কোটরের পানিতে ফেনিল বাসা বানায়; স্ত্রী অনিষিক্ত ডিম পাড়ে যা ট্যাডপোলেরা খায় (ওওফ্যাজি)—এ অসাধারণ প্রজনন-কৌশল Biju et al. (2016, PLoS ONE)-এ নথিভুক্ত, যাঁরা প্রজাতিটিকে ১৩০ বছর পর পুনরাবিষ্কার করেন। দীর্ঘদিন Philautus-পরে Frankixalus-এ ছিল; বর্তমানে Nasutixalus। Rayan & Islam (2026) চেকলিস্টে বাংলাদেশের পূর্ব-পাহাড়ি বনে নথিভুক্ত; বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৪–৬ সেমি; বাদামি-ধূসর দাগি পিঠ, বড় চোখ, চোষা-আঙুল।',
    identification: 'গাছ-কোটর-বাসী ব্যাঙ; সূঁচালো থুতনি ও বড় চোখ; ফেনিল কোটর-বাসা।',
    diet: 'পোকা-মথ-মশা; ট্যাডপোল মায়ের দেওয়া অনিষিক্ত ডিম খায়।',
    behavior: 'নিশাচর-বৃক্ষবাসী; উঁচু গাছ-কোটরে লুকোয়; বিরল ও কম-পর্যবেক্ষিত।',
    reproduction: 'গাছ-কোটরের পানিতে ফেনিল বাসা; ট্যাডপোল ডিম-খাদক (ওওফ্যাজি)।',
    habitat: 'চিরসবুজ পাহাড়ি বনের পুরোনো গাছ-কোটর ও বন-চ্ছাদ।',
    distribution: 'বাংলাদেশের পূর্ব-পাহাড়ি বন; উত্তর-পূর্ব ভারত-নেপাল-মিয়ানমার-চীন বিন্যাস।',
    whereToSee: 'লাউয়াছড়া-সাতছড়ির প্রাচীন গাছ-কোটরে বর্ষার রাতে (অতি-বিরল)।',
    season: 'প্রজনন বর্ষাকালে (মে–আগস্ট); তথ্য-স্বল্প।',
    sizeOrHeight: '৪–৬ সেন্টিমিটার',
    ecologicalRole: 'বৃক্ষস্তর পতঙ্গ-নিয়ন্ত্রক; গাছ-কোটর-বাস্তুতন্ত্রের বিশেষ সূচক প্রজাতি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে বিরল, প্রাচীন-গাছ-নির্ভর জনতা ভঙ্গুর।',
    threats: 'পুরোনো গাছ কাটা, পাহাড়ি বন উজাড়, কোটর-আবাস বিনাশ।',
    conservationActions: 'প্রাচীন-বৃক্ষ সংরক্ষণ; লক্ষ্যভিত্তিক জরিপ; গবেষণাপত্র-ভিত্তিক জনতা-মানচিত্র।',
    colorTags: ['#8a7a62', '#4d4232', '#d8d0bc'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Nasutixalus_jerdonii_%28adult_male%29.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Nasutixalus_jerdonii_%28adult_male%29.jpg')],
  },
  {
    slug: 'bengal-tree-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'খয়েরি দাগ গেছে ব্যাঙ', nameEn: 'Brown Blotched Bengal Tree Frog', scientificName: 'Polypedates bengalensis',
    otherNames: ['বাংলা গাছ ব্যাঙ', 'Bengal Tree Frog', 'Polypedates bengalensis Purkayastha et al., 2019'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Rhacophoridae', genus: 'Polypedates', species: 'Polypedates bengalensis' },
    summary: 'পশ্চিমবঙ্গ-বাংলাদেশে ২০১৯-এ স্বীকৃত নতুন গাছ-ব্যাঙ; পিঠে খয়েরি-কালো ফোঁটা-দাগ; ফেনিল বুদবুদ-বাসা বানায়; IUCN-মূল্যায়ন এখনো হয়নি (NE)।',
    description:
      'খয়েরি দাগ গেছে ব্যাঙ মাঝারি বৃক্ষবাসী ব্যাঙ; পিঠ হলদেটে-খয়েরি with একধারি কালো-খয়েরি গোল ফোঁটা-দাগ, পেট ফ্যাকাশে, আঙুলে চোষা-থালি ও জালি। ২০১৪-র পুরোনো আলোকচিত্রের ভিত্তিতে Purkayastha et al. (2019) পশ্চিমবঙ্গ থেকে নতুন প্রজাতি হিসেবে বর্ণনা করেন; Rayan & Islam (2026) চেকলিস্ট Das et al. (2025)-র নামকরণ-রেফারেন্সে বাংলাদেশে অন্তর্ভুক্ত করেছে। P. maculatus-জটের নিকট-আত্মীয়; গাছ-দেয়াল-ঝোপে পোকা শিকার করে ও পানির ওপরে ফেনিল বুদবুদ-বাসা বানায়। নতুন-বর্ণিত বলে IUCN Red List-এ এখনো পৃথক মূল্যায়ন নেই (NE)।',
    physical: 'দৈর্ঘ্য ৫–৭ সেমি; হলদেটে-খয়েরি পিঠে গোল কালো-খয়েরি ফোঁটা, চোষা-আঙুল।',
    identification: 'পিঠের একধারি গোল ফোঁটা-দাগ; maculatus-সদৃশ—দাগ-বিন্যাস ও ডাকে আলাদা।',
    diet: 'মথ, ঝিঁঝিঁ, মশা-পোকা, মাকড়সা।',
    behavior: 'নিশাচর-বৃক্ষবাসী; বাতি-কাছে পোকা ধরে; বর্ষায় উচ্চস্বরে ডাকে।',
    reproduction: 'স্থির পানির ওপরে ডাল-দেয়ালে ফেনিল বুদবুদ-বাসা; ট্যাডপোল পানিতে নেমে বাড়ে।',
    habitat: 'বন-প্রান্ত, গ্রামীণ গাছ-বাগান, পুকুর-ভবন-সংলগ্ন ঝোপ।',
    distribution: 'বাংলাদেশ ও পশ্চিমবঙ্গ (ভারত); বিস্তৃতি-মানচিত্র এখনো গবেষণাধীন।',
    whereToSee: 'বর্ষার রাতে গ্রামীণ গাছ-দেয়াল-পুকুর-ধারে (maculatus-সঙ্গে সতর্ক শনাক্তকরণ)।',
    season: 'প্রজনন বর্ষাকালে (মে–সেপ্টেম্বর)।',
    sizeOrHeight: '৫–৭ সেন্টিমিটার',
    ecologicalRole: 'বৃক্ষস্তর পতঙ্গ-নিয়ন্ত্রক; বুদবুদ-বাসার ট্যাডপোল জলজ খাদ্যচক্রে যোগ দেয়।',
    origin: 'native', conservation: 'NE', conservationBn: '২০১৯-এ বর্ণিত নতুন প্রজাতি; IUCN Red List-এ এখনো পৃথক মূল্যায়ন হয়নি (NE) — জনতা-পরিসর অজানা।',
    threats: 'গাছ-কাটা, পুকুর-ভরাট, কীটনাশক, maculatus-সঙ্গে বিভ্রান্তিতে তথ্য-ঘাটতি।',
    conservationActions: 'লক্ষ্যভিত্তিক জনতা-জরিপ; গ্রামীণ গাছ-জলাশয় রক্ষা; দ্রুত IUCN-মূল্যায়নে তথ্য-সরবরাহ।',
    colorTags: ['#a08a5e', '#5a4630', '#e2d8be'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Brown_blotched_Bengal_tree_frog_%28Polypedates_bengalensis%29_from_Khordanahala%2C_WB%2C_IN_06.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Brown_blotched_Bengal_tree_frog_%28Polypedates_bengalensis%29_from_Khordanahala%2C_WB%2C_IN_06.jpg')],
  },
  {
    slug: 'white-lipped-horned-toad', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'বৃহৎ শিংওয়ালা ব্যাঙ', nameEn: 'White-lipped Horned Toad', scientificName: 'Xenophrys major',
    otherNames: ['বড় শিং-ব্যাঙ', 'Great Horned Toad', 'Megophrys major (পুরোনো নাম)', 'Xenophrys major (Boulenger, 1908)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Megophryidae', genus: 'Xenophrys', species: 'Xenophrys major' },
    summary: 'পাহাড়ি বনের পাতা-স্তরের বড় ছদ্মবেশী ব্যাঙ; চোখের ওপরে শিং-সদৃশ ভাঁজ; পোকা শিকারে অতর্কিত হামলা চালায়; বৈশ্বিক LC।',
    description:
      'বৃহৎ শিংওয়ালা ব্যাঙ বড়-স্থূলকায় পাতা-ব্যাঙ; পিঠ বাদামি-জলপাই with পাতা-শিরা-সদৃশ দাগ, চোখের ওপরে ত্রিভুজাকার চামড়া-ভাঁজ (শিং), ঠোঁট হালকা-সাদাটে, পেট ফ্যাকাশে। বনের পাতা-আবরণে পুরোপুরি ছদ্মবেশে বসে থেকে পোকা-মাকড়-কেঁচো অতর্কিতে গিলে ফেলে; ডাক উঁচু-ধাতব সুরের। দীর্ঘদিন Megophrys major নামে ছিল; বর্তমানে Xenophrys গণ। Rayan & Islam (2026) চেকলিস্টে সিলেট-পার্বত্য চট্টগ্রামের চিরসবুজ বনে নথিভুক্ত; বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৭–১১ সেমি; বড় স্থূল দেহ, চোখে শিং-ভাঁজ, পাতা-ছদ্মবেশী পিঠ।',
    identification: 'পাতা-স্তরের বড় বাদামি ব্যাঙ; চোখের শিং-ভাঁজ ও হালকা ঠোঁট-রেখা।',
    diet: 'পোকা-শাবক, মাকড়সা, কেঁচো, শামুক, কদাচিৎ ছোট মেরুদণ্ডী।',
    behavior: 'নিশাচর; পাতা-মেঝে স্থির বসে শিকারের অপেক্ষা করে; চলন ধীর-গোপন।',
    reproduction: 'ঝরনা-কূলের পানিতে ডিম; ট্যাডপোল পাতলা-ফানেল-মুখী, স্রোতে ভাসমান কণা খায়।',
    habitat: 'চিরসবুজ-অর্ধচিরসবুজ পাহাড়ি বনের আর্দ্র পাতা-স্তর, ছড়া-প্রান্ত।',
    distribution: 'সিলেট-পার্বত্য চট্টগ্রামের পাহাড়ি বন; ভুটান-উত্তর-পূর্ব ভারত-মিয়ানমার-চীন-ইন্দোচীন বিন্যাস।',
    whereToSee: 'লাউয়াছড়া-সাতছড়ির আর্দ্র পাতা-স্তরে বর্ষার রাতে টর্চ-হাঁটায়।',
    season: 'সারাবছর; বর্ষায় ডাক-প্রজনন বেশি।',
    sizeOrHeight: '৭–১১ সেন্টিমিটার',
    ecologicalRole: 'বন-মেঝের অতর্কিত-শিকারি; পতঙ্গ-নিয়ন্ত্রক ও সাপ-বিড়াল-শিকার।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে অবিচ্ছিন্ন আর্দ্র পাহাড়ি বনে সীমাবদ্ধ।',
    threats: 'পাহাড়ি বন উজাড়, পাতা-স্তর বিনাশ, ছড়া-দখল, আবাস-টুকরোকরণ।',
    conservationActions: 'আর্দ্র বন-মেঝে সংরক্ষণ; আবাস-জরিপ; বন-ভেতরের জলধারা রক্ষা।',
    colorTags: ['#7a5f42', '#46341f', '#d3c6ab'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Megophrys_major.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Megophrys_major.jpg')],
  },
  {
    slug: 'burmese-sticky-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'সরকুখো ব্যাঙ', nameEn: 'Burmese Sticky Frog', scientificName: 'Kalophrynus interlineatus',
    otherNames: ['ডোরা-আঠালো ব্যাঙ', 'Striped Sticky Frog', 'Kalophrynus interlineatus (Blyth, 1855)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Microhylidae', genus: 'Kalophrynus', species: 'Kalophrynus interlineatus' },
    summary: 'ডোরা-দাগি আঠালো-চামড়ার সরু-মুখ ব্যাঙ; বিপদে আঠালো ক্ষরণ নিঃসরণ করে; পূর্ব-পাহাড়ি বন-তৃণভূমিতে; বৈশ্বিক LC।',
    description:
      'সরকুখো ব্যাঙ মাঝারি-স্থূলকায় সরু-মুখ ব্যাঙ; পিঠ লালচে-বাদামি with গাঢা লম্বা ডোরা-দাগ, ত্বক মসৃণ-আঠালো, পেট ফ্যাকাশে, মাথা খাটো-চওড়া। পিঁপড়া-উইপোকা-ছোট পোকা শিকার করে; বিরক্ত হলে ত্বক থেকে আঠালো-দুর্গন্ধযুক্ত ক্ষরণ নিঃসরণ করে প্রতিরক্ষা গড়ে। পাতা-মেঝে-ঘাস-বন-প্রান্তে লুকিয়ে থাকে; বর্ষার অস্থায়ী ডোবায় ডিম দেয়। Rayan & Islam (2026) চেকলিস্টে বাংলাদেশের পূর্ব-পাহাড়ি অঞ্চলে নথিভুক্ত; বৈশ্বিক IUCN কোড LC। ব্যবহৃত ছবিটি কমন্সের “featured” জীবন্ত আলোকচিত্র।',
    physical: 'দৈর্ঘ্য ৫–৭ সেমি; লালচে-বাদামি ডোরা-দাগি পিঠ, আঠালো ত্বক, খাটো-চওড়া মাথা।',
    identification: 'ডোরা-দাগি সরু-মুখ ব্যাঙ; আঠালো ক্ষরণ-স্বভাব; K. orangensis-সদৃশ—ডোরা-বিন্যাসে আলাদা।',
    diet: 'পিঁপড়া, উইপোকা, ছোট পতঙ্গ ও মাকড়সা।',
    behavior: 'নিশাচর-গোপন স্বভাব; পাতা-মেঝে-ঘাসে লুকোয়; বিপদে আঠালো ক্ষরণ ছাড়ে।',
    reproduction: 'বর্ষার অস্থায়ী ডোবা-বন-জলাশয়ে ডিম; ট্যাডপোল অল্প জলে বাড়ে।',
    habitat: 'বন-প্রান্ত, ঝোপ-তৃণভূমি, আর্দ্র পাতা-মেঝে, গ্রামীণ বাগান।',
    distribution: 'বাংলাদেশের পূর্ব-পাহাড়ি অঞ্চল; ভারত-মিয়ানমার-থাইল্যান্ড-চীন-ইন্দোচীন বিন্যাস।',
    whereToSee: 'সাতছড়ি-লাউয়াছড়ার বন-প্রান্ত-ঝোপে বর্ষার রাতে টর্চ-হাঁটায়।',
    season: 'প্রজনন বর্ষাকালে (মে–সেপ্টেম্বর)।',
    sizeOrHeight: '৫–৭ সেন্টিমিটার',
    ecologicalRole: 'পিঁপড়া-উইপোকা-নিয়ন্ত্রক; রাসায়নিক-প্রতিরক্ষী শিকার হিসেবে খাদ্যচক্রে ভূমিকা।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে খণ্ডিত পূর্ব-পাহাড়ি বিন্যাস।',
    threats: 'বন উজাড়, ঝোপ-তৃণভূমি ভরাট, কীটনাশক, আবাস-টুকরোকরণ।',
    conservationActions: 'বন-প্রান্ত-ঝোপ রক্ষা; আবাস-জরিপ; কীটনাশক-নিয়ন্ত্রণ।',
    colorTags: ['#8a5a3c', '#4d2f1e', '#dccbb4'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Kalophrynus_interlineatus%2C_Striped_sticky_frog_-_Khao_Khitchakut_District_%2833500345788%29.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Kalophrynus_interlineatus%2C_Striped_sticky_frog_-_Khao_Khitchakut_District_%2833500345788%29.jpg')],
  },
  {
    slug: 'northern-dwarf-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'উত্তরাঞ্চলীয় বন ব্যাঙ', nameEn: 'Northern Dwarf Frog', scientificName: 'Ingerana borealis',
    otherNames: ['উত্তর বামন ব্যাঙ', 'Northern Trickle Frog', 'Rana borealis (পুরোনো নাম)', 'Ingerana borealis (Boulenger, 1908)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Dicroglossidae', genus: 'Ingerana', species: 'Ingerana borealis' },
    summary: 'পাহাড়ি ছড়া-কূলের ক্ষুদে বামন ব্যাঙ; পাথর-ফাটলে লুকোয়; উত্তর-পূর্ব ভারত-বাংলাদেশ-দক্ষিণ-পূর্ব এশিয়া বিন্যাস; বৈশ্বিক LC।',
    description:
      'উত্তরাঞ্চলীয় বন ব্যাঙ ক্ষুদে-স্থূলকায় বামন ব্যাঙ; পিঠ বাদামি-জলপাই with গাঢা দাগ-ছোপ, ত্বক সামান্য দানাদার, পেট ফ্যাকাশে, মাথা চওড়া-খাটো, আঙুলে সরু জালি। পাহাড়ি ছড়া-ঝরনা-কূলের আর্দ্র পাথর-পাতা-মেঝে থাকে; পোকা-পিঁপড়া-মাকড়সা শিকার করে, ভয়ে পাথর-ফাটলে সরে যায়। ডিম ছড়া-কূলে দেয় বলে জানা যায়; প্রজনন-জীবনবৃত্তান্ত তথ্য-স্বল্প। দীর্ঘদিন Rana গণে ছিল; বর্তমানে Ingerana। Rayan & Islam (2026) চেকলিস্টে বাংলাদেশের পূর্ব-পাহাড়ি বনে নথিভুক্ত; বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৩–৪.৫ সেমি; ক্ষুদে স্থূল দেহ, দানাদার দাগি পিঠ, চওড়া-খাটো মাথা।',
    identification: 'ছড়া-কূলের ক্ষুদে বাদামি ব্যাঙ; পাথর-ফাটল-আশ্রয়; বামন গড়ন।',
    diet: 'ছোট পতঙ্গ, পিঁপড়া, মাকড়সা, কেঁচো।',
    behavior: 'নিশাচর; আর্দ্র পাথর-পাতায় ঘোরে; ভয়ে ফাটল-নিচে লুকোয়।',
    reproduction: 'ছড়া-কূলে ডিম; বিস্তারিত জীবনবৃত্তান্ত তথ্য-স্বল্প।',
    habitat: 'পাহাড়ি ছড়া-ঝরনা-কূল, আর্দ্র পাতা-মেঝে, পাথর-ফাটল।',
    distribution: 'বাংলাদেশের পূর্ব-পাহাড়ি বন; ভুটান-উত্তর-পূর্ব ভারত-মিয়ানমার-থাইল্যান্ড-চীন বিন্যাস।',
    whereToSee: 'লাউয়াছড়া-খাদিমনগরের ছড়া-পাথরে বর্ষার সন্ধ্যায় টর্চ-হাঁটায়।',
    season: 'সারাবছর; বর্ষায় বেশি সক্রিয়।',
    sizeOrHeight: '৩–৪.৫ সেন্টিমিটার',
    ecologicalRole: 'ছড়া-কূলের ক্ষুদে পতঙ্গ-নিয়ন্ত্রক; সাপ-পাখির খাদ্য।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে স্বচ্ছ পাহাড়ি ছড়া-আবাসে সীমাবদ্ধ।',
    threats: 'ছড়া-দখল-দূষণ, পাথর উত্তোলন, পাহাড়ি বন উজাড়।',
    conservationActions: 'ছড়া-জলধারা সংরক্ষণ; উত্তোলন বন্ধ; লক্ষ্যভিত্তিক জীবনবৃত্তান্ত-জরিপ।',
    colorTags: ['#7d6b50', '#483b2a', '#d8d0bc'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Ingerana_borealis.jpeg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Ingerana_borealis.jpeg')],
  },
  {
    slug: 'indian-cricket-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'বীবি ব্যাঙ', nameEn: 'Indian Cricket Frog', scientificName: 'Fejervarya limnocharis',
    otherNames: ['ভারতীয় ক্রিকেট ব্যাঙ', 'Rice Field Frog', 'Limnonectes limnocharis (পুরোনো নাম)', 'Fejervarya limnocharis (Gravenhorst, 1829)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Dicroglossidae', genus: 'Fejervarya', species: 'Fejervarya limnocharis' },
    summary: 'ধানক্ষেত-জলাভূমির পরিচিত ক্রিকেট ব্যাঙ; নাম-জট সত্ত্বেও ২০২৬ চেকলিস্টে বাংলাদেশে নথিভুক্ত; বর্ষায় জোরে ডাকে; বৈশ্বিক LC।',
    description:
      'বীবি ব্যাঙ ক্ষুদে-মাঝারি ক্রিকেট ব্যাঙ; পিঠ বাদামি-জলপাই with গাঢা ভাঁজ-দাগ, পেট ফ্যাকাশে, পেছনের পা লম্বা-ডোরা-কাটা, চোখ ফোলা-ফোলা। ধানক্ষেত-ডোবা-ভেজা মাঠে পোকা-শাবক শিকার করে; বর্ষায় ধারাবাহিক কর্কশ ডাক দেয় ও দ্রুত লাফায়। গুরুত্বপূর্ণ শ্রেণিবিন্যাস-সতর্কতা: sensu stricto F. limnocharis জাভা/দক্ষিণ-পূর্ব এশিয়ার ট্যাক্সন; দক্ষিণ এশিয়ার ঐতিহাসিক “limnocharis” রেকর্ডের বড় অংশ Minervarya agricola-তে স্থানান্তরিত—Rayan & Islam (2026) তবু বাংলাদেশ-চেকলিস্টে নামটি রেখেছেন, তাই দ্বৈত-নাম সংরক্ষিত ও মাঠ-শনাক্তে আণবিক-ডাক-যাচাই জরুরি। ব্যবহৃত ছবিটি জাভার (টাইপ-অঞ্চল) নমুনা। বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৪–৬ সেমি; বাদামি ভাঁজ-দাগি পিঠ, লম্বা ডোরা-কাটা পা।',
    identification: 'ধানক্ষেতের কর্কশ-ডাক ব্যাঙ; agricola-সদৃশ—নাম-জটে আণবিক/ডাক-যাচাই আবশ্যক।',
    diet: 'পোকা-শাবক, পিঁপড়া, মাকড়সা, কেঁচো।',
    behavior: 'বর্ষায় দিন-রাত সক্রিয়; ডোবা-ধানক্ষেত-পাড়ে ডাকে; দ্রুত লাফায়।',
    reproduction: 'অস্থায়ী ডোবা-ধানক্ষেতে ডিম; ট্যাডপোল অল্প জলে দ্রুত বাড়ে।',
    habitat: 'ধানক্ষেত, ভেজা তৃণভূমি, ডোবা-নালা-প্রান্ত, নিম্নভূমি জলাভূমি।',
    distribution: 'বাংলাদেশের নিম্নভূমি (চেকলিস্ট-নথিভুক্ত); বৈশ্বিক বিন্যাস দক্ষিণ-পূর্ব এশিয়া-জাভা-চীন-জাপান পর্যন্ত।',
    whereToSee: 'বর্ষাকালে ধানক্ষেত-ডোবার পাড়ে (Minervarya প্রজাতির সঙ্গে সতর্ক শনাক্তকরণ)।',
    season: 'প্রজনন বর্ষাকালে (এপ্রিল–সেপ্টেম্বর)।',
    sizeOrHeight: '৪–৬ সেন্টিমিটার',
    ecologicalRole: 'কৃষি-পতঙ্গ-নিয়ন্ত্রক; সাপ-পাখি-ছোট স্তন্যপায়ীর খাদ্য।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশ-রেকর্ডে নাম-জট থাকায় স্থানীয় জনতা-পরিসর অনিশ্চিত।',
    threats: 'কীটনাশক, ধানক্ষেত-ভরাট, নাম-বিভ্রান্তিতে তথ্য-ঘাটতি।',
    conservationActions: 'আণবিক-ডাক-ভিত্তিক জরিপে প্রকৃত বিন্যাস-নিরূপণ; ধানক্ষেত-জলাশয় রক্ষা।',
    colorTags: ['#83735a', '#4c4232', '#dbd3bf'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Fejervarya_limnocharis.png',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Fejervarya_limnocharis.png')],
  },
]
