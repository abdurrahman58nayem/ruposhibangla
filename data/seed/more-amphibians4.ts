import type { Species } from '@/lib/types'
import { IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD } from './sources'

/**
 * উভচর সম্প্রসারণ — ধাপ ৪ (উভচর ব্যাচ ৪, ২০২৬-১০-২৬): ৬টি ব্যাঙ
 *
 * এটি উভচর গোষ্ঠীর মিডিয়া-সীমায় সমাপ্তি-ব্যাচ: Rayan & Islam
 * (2026)-এর ৯৬-চেকলিস্টের অবশিষ্ট স্ক্রিনযোগ্য ১৬ প্রার্থী Commons
 * extmetadata API দিয়ে যাচাই করে মাত্র ৬টিতে গ্রহণযোগ্য মুক্ত
 * লাইসেন্সের লাইভ/প্রজাতি-নিশ্চিত মিডিয়া পাওয়া গেছে। লাইসেন্স
 * মিশ্রণ: ২ CC BY-SA 4.0, ২ CC BY 2.0, ১ CC BY-SA 2.0, ১ CC BY
 * 4.0 (PeerJ মূল-বর্ণনা পত্রের জীবন্ত হলোটাইপ চিত্র)। কোনো
 * ঊনবিংশ শতকের বই-চিত্র, Unidentified-ক্যাটাগরি বা দুর্বল-
 * পরিচয়ের ফাইল নেওয়া হয়নি।
 *
 * বিশেষ সিদ্ধান্ত:
 *  - Occidozyga swanbornorum (Trageser et al. 2021, PeerJ)
 *    বাংলাদেশের পার্বত্য চট্টগ্রাম থেকে নতুন-বর্ণিত; এখনো IUCN-
 *    মূল্যায়ন হয়নি (NE)। কমন্সে Phrynoglossus/Hrynoglossus
 *    নামের ফাইল — গণ-প্রতিশব্দ otherNames-এ সংরক্ষিত; ছবিটি
 *    মূল-বর্ণনা পত্রের CC BY 4.0 জীবন্ত হলোটাইপ চিত্র।
 *  - Duttaphrynus himalayanus, Microhyla fissipes ও Hylarana
 *    taipehensis-এর বাংলাদেশ-উপস্থিতি Rayan & Islam (2026)/IUCN
 *    অনুসারে বিতর্কিত/“presence uncertain”; চেকলিস্ট এদের ৯৬-
 *    তালিকায় রেখেছে বলে স্বচ্ছ আঞ্চলিক-অনিশ্চয়তা ফ্ল্যাগসহ
 *    অন্তর্ভুক্ত করা হলো (পরিচয় নিশ্চিত, উপস্থিতি অংশত অনিশ্চিত)।
 *  - Fejervarya moodiei-র গৃহীত ছবি সঠিক F. moodiei
 *    ক্যাটাগরির লাইভ ফিল্ড ছবি; “Unidentified Anura”-
 *    ক্যাটাগরির অপর একটি ফাইল ইচ্ছাকৃতভাবে বাদ।
 *
 * বর্জিত/মুলতবি (১০ প্রার্থী, নথিভুক্ত): Kalophrynus orangensis
 * (প্রজাতি-নির্দিষ্ট ছবি নেই, শুধু অডিও/অন্য প্রজাতি),
 * Hylarana khare/Pterorana khare (শুধু সাধারণ “Frogs”
 * ক্যাটাগরির দুর্বল-পরিচয় ফাইল), Raorchestes garo,
 * R. kempieae (দুই বানানেই), R. mawsynramensis,
 * R. longchuanensis, Amolops yunnaniensis, Pedostibes kempi,
 * Ingerana occidentis (কমন্সে শূন্য হিট), Ichthyophis
 * garoensis (শুধু IUCN বিন্যাস-মানচিত্র ও PDF)। পূর্ববর্তী
 * ব্যাচ ১–৩-এর সব বর্জন ও ৯ BD-এন্ডেমিক/“presence uncertain”
 * মুলতবি তালিকা বহাল।
 */
const COMMONS = (file: string): { title: string; url: string; license: string } => ({
  title: 'ছবির মূল ফাইল — Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${file}`,
  license: 'Wikimedia Commons',
})

export const MORE_AMPHIBIANS4: Species[] = [
  {
    slug: 'swanborn-puddle-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'সোয়ানবর্নের পুরুর ব্যাঙ', nameEn: "Swanborn's Puddle Frog", scientificName: 'Occidozyga swanbornorum',
    otherNames: ['সোয়ানবর্ন পুডল ব্যাঙ', 'Phrynoglossus swanbornorum (মূল-বর্ণনা নাম)', 'Hrynoglossus swanbornorum', 'Occidozyga swanbornorum (Scott Trageser et al., 2021)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Dicroglossidae', genus: 'Occidozyga', species: 'Occidozyga swanbornorum' },
    summary: 'পার্বত্য চট্টগ্রামের ছড়া-ডোবায় ২০২১-এ নতুন-বর্ণিত ক্ষুদে জলচর ব্যাঙ; হীরে-আকৃতির চোখের মণি; এখনো IUCN-মূল্যায়ন হয়নি (NE)।',
    description:
      'সোয়ানবর্নের পুরুর ব্যাঙ ক্ষুদে-স্থূলকায় অর্ধ-জলচর ডিক্রোগ্লসিড; পিঠ বাদামি-জলপাই with ফ্যাকাশে-গাঢ় দাগ, চোখের মণি আলোভেদে হীরে থেকে ডিম্বাকার হয়, পাশের ডোরার উপস্থিতি নমুনাভেদে ভিন্ন, পেছনের পা মাংসল, আঙুলে সরু জালি। Trageser, Al-Razi, Maria, Nobel, Asaduzzaman & Rahman (2021, PeerJ 9:e11998) পার্বত্য চট্টগ্রামের বন-ডোবা-ছড়া থেকে নতুন প্রজাতি হিসেবে বর্ণনা করেন; মূল-বর্ণনায় গণটি Phrynoglossus হলেও পরবর্তী শ্রেণিবিন্যাসে Occidozyga/Hrynoglossus সমার্থকতা আলোচিত। Rayan & Islam (2026) চেকলিস্টে অন্তর্ভুক্ত। ছোট পোকা-শাবক খেয়ে অগভীর স্থির পানিতে ঘোরে; জীবনবৃত্তান্তের অনেক তথ্য এখনো গবেষণাধীন। ২০২১-প্রজাতি বলে IUCN Red List-এ পৃথক মূল্যায়ন নেই (NE)। ব্যবহৃত ছবিটি মূল-বর্ণনা পত্রের CC BY 4.0 জীবন্ত হলোটাইপ চিত্র।',
    physical: 'দৈর্ঘ্য ২.৫–৩.৫ সেমি; ক্ষুদে স্থূল দেহ, হীরে/ডিম্বাকার মণি, পরিবর্তনশীল পাশ-ডোরা।',
    identification: 'অগভীর ডোবা-ছড়ার ক্ষুদে বাদামি ব্যাঙ; মণির হীরে-আকৃতি ও O. lima-অপেক্ষকৃত খাটো থুতনি।',
    diet: 'ছোট পতঙ্গ, পোকা-শাবক, পিঁপড়া, ক্ষুদে জলজ অমেরুদণ্ডী।',
    behavior: 'অর্ধ-জলচর; অগভীর পানি-কাদায় ঘোরে; ভয়ে ডোবার নিচে ডুব দেয়; তথ্য-স্বল্প।',
    reproduction: 'স্থির পানির ডোবা-ছড়ায় ডিম; বিস্তারিত জীবনবৃত্তান্ত গবেষণাধীন।',
    habitat: 'পাহাড়ি বনের অগভীর ডোবা, ছড়া-প্রান্ত, কর্দমাক্ত স্থির জলাশয়।',
    distribution: 'বাংলাদেশ: পার্বত্য চট্টগ্রাম (নতুন-বর্ণিত, সংকীর্ণ জ্ঞাত বিন্যাস)।',
    whereToSee: 'পার্বত্য চট্টগ্রামের সংরক্ষিত বন-ছড়ার অগভীর ডোবায় বর্ষায় (বিরল, সতর্ক জরিপ আবশ্যক)।',
    season: 'প্রজনন সম্ভবত বর্ষাকালে (মে–সেপ্টেম্বর); তথ্য-স্বল্প।',
    sizeOrHeight: '২.৫–৩.৫ সেন্টিমিটার',
    ecologicalRole: 'ক্ষুদে জলজ পতঙ্গ-নিয়ন্ত্রক; সাপ-পাখি-ছোট স্তন্যপায়ীর খাদ্য।',
    origin: 'native', conservation: 'NE', conservationBn: '২০২১-এ বর্ণিত নতুন প্রজাতি; IUCN Red List-এ এখনো পৃথক মূল্যায়ন হয়নি (NE)। সংকীর্ণ জ্ঞাত বিন্যাসে পাহাড়ি বন উজাড় মূল ঝুঁকি।',
    threats: 'পাহাড়ি বন উজাড়, ছড়া-দখল, বাগান-সম্প্রসারণ, ডোবা-ভরাট।',
    conservationActions: 'টাইপ-আবাস কঠোর সংরক্ষণ; জনতা-জরিপ ও পরিবেশগত গবেষণা; দ্রুত IUCN-মূল্যায়নে তথ্য-সরবরাহ।',
    colorTags: ['#7a6a4e', '#453b2b', '#d8d0ba'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Phrynoglossus_swanbornorum_%2810.7717-peerj.11998%29_Figure_3.png',
    dataStatus: 'partial',
    sources: [IUCN, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Phrynoglossus_swanbornorum_%2810.7717-peerj.11998%29_Figure_3.png')],
  },
  {
    slug: 'moodies-crab-eating-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'মুডির বীবি ব্যাঙ', nameEn: "Moodie's Crab-eating Frog", scientificName: 'Fejervarya moodiei',
    otherNames: ['উত্তর কাঁকড়াভুক ব্যাঙ', 'Northern Crab-eating Frog', 'Fejervarya moodiei (Taylor, 1920)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Dicroglossidae', genus: 'Fejervarya', species: 'Fejervarya moodiei' },
    summary: 'উপকূলীয়-ম্যানগ্রোভ অঞ্চলের লোনা-সহিষ্ণু কাঁকড়াভুক ব্যাঙ; cancrivora-জট থেকে ২০১৯-এ স্বতন্ত্রীকরণ; বৈশ্বিক LC।',
    description:
      'মুডির বীবি ব্যাঙ মাঝারি-স্থূলকায় ক্রিকেট ব্যাঙ; পিঠ বাদামি-ধূসর with গাঢা ভাঁজ-দাগ ও দানাদার আঁচিল, পেট ফ্যাকাশে, পেছনের পা মাংসল-লম্বা। ম্যানগ্রোভ-জোয়ার-খাল-উপকূলীয় জলাভূমিতে ছোট কাঁকড়া-পোকা শিকার করে; লোনা পানিতে সহিষ্ণু। দীর্ঘদিন F. cancrivora-র প্রতিশব্দ ধরা হতো; Yodthong, Stuart & Aowphol (2019, ZooKeys 883) আণবিক-রূপগত বিশ্লেষণে F. moodiei-কে স্বতন্ত্র প্রজাতি হিসেবে নিশ্চিত করেন। Rayan & Islam (2026) চেকলিস্টে বাংলাদেশের উপকূলে নথিভুক্ত; বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৫–৭ সেমি; স্থূল দানাদার পিঠ, মাংসল পা, লোনা-সহিষ্ণু ত্বক।',
    identification: 'উপকূলীয় কাঁকড়াভুক ব্যাঙ; cancrivora-সদৃশ—পায়ের অভ্যন্তরীণ মেটাটার্সাল ভাঁজ ও আণবিক পার্থক্যে।',
    diet: 'ছোট কাঁকড়া, পোকা-শাবক, চিংড়ি, কেঁচো ও ক্ষুদে মেরুদণ্ডী।',
    behavior: 'নিশাচর; জোয়ার-ভাটা-প্রভাবিত এলাকায় ঘোরে; গর্তে লুকোয়; বর্ষায় ডাকে।',
    reproduction: 'অগভীর স্থির-হালকা-লোনা পানিতে ডিম; ট্যাডপোল দ্রুত বাড়ে (তথ্য-স্বল্প)।',
    habitat: 'ম্যানগ্রোভ, জোয়ার-খাল, উপকূলীয় জলাভূমি, লবণাক্ত তৃণভূমি।',
    distribution: 'বাংলাদেশের উপকূল-সুন্দরবন সংলগ্ন অঞ্চল; ভারত-মিয়ানমার-থাইল্যান্ড-ফিলিপাইন বিন্যাস।',
    whereToSee: 'সুন্দরবন-উপকূলীয় ম্যানগ্রোভ খাল-ধারে বর্ষার রাতে টর্চ-হাঁটায়।',
    season: 'প্রজনন বর্ষাকালে (মে–অক্টোবর)।',
    sizeOrHeight: '৫–৭ সেন্টিমিটার',
    ecologicalRole: 'কাঁকড়া-পতঙ্গ-নিয়ন্ত্রক; ম্যানগ্রোভ খাদ্যচক্রের গুরুত্বপূর্ণ শিকার ও শিকারি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে ম্যানগ্রোভ-আবাসে সীমাবদ্ধ, স্থানীয় তথ্য-ঘাটতি রয়েছে।',
    threats: 'ম্যানগ্রোভ উজাড়, চিংড়ি-ঘের, উপকূল-দূষণ, আবাস-টুকরোকরণ।',
    conservationActions: 'ম্যানগ্রোভ সংরক্ষণ; উপকূল-জরিপ; cancrivora-জটে আণবিক শনাক্তকরণ-জরিপ।',
    colorTags: ['#7c6f56', '#48402f', '#d8d2be'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Fejervarya_moodiei_-_Khao_Sam_Roi_Yot_National_Park_%2833104842162%29.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Fejervarya_moodiei_-_Khao_Sam_Roi_Yot_National_Park_%2833104842162%29.jpg')],
  },
  {
    slug: 'serchhip-horned-toad', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'আঁচিলযুক্ত শিংওয়ালা ব্যাঙ', nameEn: "Serchhip's Horned Toad", scientificName: 'Xenophrys serchhipii',
    otherNames: ['সেরছিপি শিং-ব্যাঙ', 'Common Warty Horned Toad', 'Megophrys serchhipii (পুরোনো নাম)', 'Xenophrys serchhipii (Mathew & Sen, 2007)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Megophryidae', genus: 'Xenophrys', species: 'Xenophrys serchhipii' },
    summary: 'পাহাড়ি বনের পাতা-স্তরের আঁচিল-আচ্ছন্ন ছদ্মবেশী শিং-ব্যাঙ; মিজোরাম-মিয়ানমার সীমান্ত-বিন্যাস; বৈশ্বিক LC।',
    description:
      'আঁচিলযুক্ত শিংওয়ালা ব্যাঙ মাঝারি-স্থূলকায় পাতা-ব্যাঙ; পিঠ বাদামি-জলপাই with অসংখ্য আঁচিল ও গাঢা পাতা-শিরা-সদৃশ দাগ, চোখের ওপরে ছোট ত্রিভুজাকার চামড়া-ভাঁজ (শিং), পেট ফ্যাকাশে-দানাদার। বনের পাতা-আবরণে ছদ্মবেশে বসে পোকা-মাকড় অতর্কিতে গিলে ফেলে। মিজোরামের সেরছিপ থেকে Mathew & Sen (2007) বর্ণনা করেন; নামটি টাইপ-এলাকা থেকে। দীর্ঘদিন Megophrys গণে ছিল; বর্তমানে Xenophrys। Rayan & Islam (2026) চেকলিস্টে বাংলাদেশের পূর্ব-পাহাড়ি বনে নথিভুক্ত; বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৪–৬ সেমি; আঁচিল-আচ্ছন্ন পিঠ, ছোট শিং-ভাঁজ, পাতা-ছদ্মবেশ।',
    identification: 'পাতা-স্তরের আঁচিল-ব্যাঙ; X. major-অপেক্ষকৃত ছোট ও বেশি দানাদার; শিং-ভাঁজ খাটো।',
    diet: 'পোকা-শাবক, মাকড়সা, কেঁচো, শামুক ও ক্ষুদে অমেরুদণ্ডী।',
    behavior: 'নিশাচর; পাতা-মেঝে স্থির বসে শিকারের অপেক্ষা করে; চলন ধীর-গোপন।',
    reproduction: 'ঝরনা-কূলের পানিতে ডিম; ফানেল-মুখী ট্যাডপোল স্রোতে কণা খায় (তথ্য-স্বল্প)।',
    habitat: 'চিরসবুজ পাহাড়ি বনের আর্দ্র পাতা-স্তর, ছড়া-প্রান্ত।',
    distribution: 'বাংলাদেশের পূর্ব-পাহাড়ি বন; উত্তর-পূর্ব ভারত (মিজোরাম)-মিয়ানমার সীমান্ত বিন্যাস।',
    whereToSee: 'সাতছড়ি-লাউয়াছড়ার আর্দ্র পাতা-স্তরে বর্ষার রাতে টর্চ-হাঁটায়।',
    season: 'সারাবছর; বর্ষায় ডাক-প্রজনন বেশি।',
    sizeOrHeight: '৪–৬ সেন্টিমিটার',
    ecologicalRole: 'বন-মেঝের অতর্কিত-শিকারি; পতঙ্গ-নিয়ন্ত্রক ও সাপ-ছোট স্তন্যপায়ীর খাদ্য।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশে খণ্ডিত পাহাড়ি বনে সীমাবদ্ধ, আবাস-ক্ষয় ঝুঁকি।',
    threats: 'পাহাড়ি বন উজাড়, পাতা-স্তর বিনাশ, ছড়া-দখল, আবাস-টুকরোকরণ।',
    conservationActions: 'আর্দ্র বন-মেঝে সংরক্ষণ; লক্ষ্যভিত্তিক জরিপ; বন-ভেতরের জলধারা রক্ষা।',
    colorTags: ['#7d6547', '#473620', '#d4c8ae'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Xenophrys_serchhipii_-_Shreeram_M_V_-_Mizoram.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Xenophrys_serchhipii_-_Shreeram_M_V_-_Mizoram.jpg')],
  },
  {
    slug: 'himalayan-toad', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'হিমালয়ী কুনো ব্যাঙ', nameEn: 'Himalayan Toad', scientificName: 'Duttaphrynus himalayanus',
    otherNames: ['হিমালয় শূকর-মাথা কুনো', 'Himalayan Boar-skulled Toad', 'Bufo himalayanus (পুরোনো নাম)', 'Duttaphrynus himalayanus (Günther, 1864)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Bufonidae', genus: 'Duttaphrynus', species: 'Duttaphrynus himalayanus' },
    summary: 'উঁচু-পাহাড়ি বনের বড় কুনো ব্যাঙ; ফোলা প্যারোটিড গ্রন্থি; বাংলাদেশ-উপস্থিতি বিতর্কিত হলেও ৯৬-চেকলিস্টে অন্তর্ভুক্ত; বৈশ্বিক LC।',
    description:
      'হিমালয়ী কুনো ব্যাঙ বড়-স্থূলকায় টোড; পিঠ গাঢা বাদামি-ধূসর with আঁচিল-দানা ও অস্পষ্ট দাগ, চোখের পেছনে বড় ফোলা প্যারোটিড গ্রন্থি, মাথার হাড় চওড়া-শূকর-মুখো, পেট ফ্যাকাশে-দানাদার। উঁচু-পাহাড়ি আর্দ্র বন-ঝোপ-জলাধার-ধারে পোকা-শামুক-কেঁচো খায়; রাতে সক্রিয়, দিনে পাথর-গর্তে লুকোয়। দীর্ঘদিন Bufo himalayanus নামে ছিল; Frost et al. (2006)-এর সংশোধনে Duttaphrynus গণে। গুরুত্বপূর্ণ সতর্কতা: বাংলাদেশে উপস্থিতি বিতর্কিত—Khan (2015) ও Rizvi & Bursey-র রেকর্ড আছে, কিন্তু সাম্প্রতিক ভাউচার-নিশ্চিতকরণ অপেক্ষমাণ; Rayan & Islam (2026) তবু প্রজাতিটিকে ৯৬-চেকলিস্টে রেখেছেন। বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৮–১৩ সেমি; বড় স্থূল দেহ, ফোলা প্যারোটিড গ্রন্থি, চওড়া হাড়-মাথা।',
    identification: 'বড় পাহাড়ি টোড; melanostictus-অপেক্ষকৃত বড় ও উঁচু-অঞ্চলের; প্যারোটিড গ্রন্থি প্রকাণ্ড।',
    diet: 'পোকা-শাবক, শামুক, কেঁচো, মাকড়সা, ক্ষুদে মেরুদণ্ডী।',
    behavior: 'নিশাচর; দিনে পাথর-গর্ত-পাতার নিচে; বর্ষায় জলাধার-ধারে জড়ো হয়।',
    reproduction: 'পাহাড়ি পুকুর-ধীর-স্রোতে ডিমের সুতো; ট্যাডপোল অগভীর জলে বাড়ে।',
    habitat: 'উঁচু-পাহাড়ি আর্দ্র বন, ঝোপ, বন-জলাশয়-প্রান্ত, পাথুরে ঢাল।',
    distribution: 'বাংলাদেশ: উত্তর-পূর্ব সীমান্ত-পাহাড় (উপস্থিতি বিতর্কিত); হিমালয়-নেপাল-ভুটান-উত্তর-পূর্ব ভারত-মিয়ানমার বিন্যাস।',
    whereToSee: 'সংরক্ষিত পাহাড়ি বনের জলাধার-ধারে বর্ষার রাতে (বাংলাদেশে ভাউচার-নিশ্চিতকরণ আবশ্যক)।',
    season: 'প্রজনন বর্ষাকালে (মে–আগস্ট)।',
    sizeOrHeight: '৮–১৩ সেন্টিমিটার',
    ecologicalRole: 'বন-পতঙ্গ-অমেরুদণ্ডী-নিয়ন্ত্রক; সাপ-পাখি-স্তন্যপায়ীর খাদ্য; টোড-টক্সিন প্রতিরক্ষা।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশ-উপস্থিতি বিতর্কিত—ভাউচার/আণবিক নিশ্চিতকরণ ছাড়া আঞ্চলিক রেকর্ড অনিশ্চিত।',
    threats: 'পাহাড়ি বন উজাড়, জলবায়ু-চাপে উঁচু-আবাস সংকোচন, দূষণ।',
    conservationActions: 'লক্ষ্যভিত্তিক ভাউচার-জরিপ; সংরক্ষিত পাহাড়ি বন রক্ষা; তথ্য-নিশ্চিতকরণে গবেষণা।',
    colorTags: ['#6e6250', '#3d362a', '#cfc8b6'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Himalayan_toad_in_Lava_May_2025_by_Tisha_Mukherjee_01.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Himalayan_toad_in_Lava_May_2025_by_Tisha_Mukherjee_01.jpg')],
  },
  {
    slug: 'taiwan-rice-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'ফিসিপিস ক্ষুদ্র-মুখ ব্যাঙ', nameEn: 'Taiwan Rice Frog', scientificName: 'Microhyla fissipes',
    otherNames: ['অলংকৃত বামন ব্যাঙ', 'Ornate Pygmy Frog', 'Microhyla fissipes (Boulenger, 1884)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Microhylidae', genus: 'Microhyla', species: 'Microhyla fissipes' },
    summary: 'ধানক্ষেত-তৃণভূমির ক্ষুদে সরু-মুখ ব্যাঙ; পিঠে জ্যামিতিক দাগ; বাংলাদেশ-উপস্থিতি IUCN-অনিশ্চিত; বৈশ্বিক LC।',
    description:
      'ফিসিপিস ক্ষুদ্র-মুখ ব্যাঙ অতি-ক্ষুদে সরু-গোল-মুখ মাইক্রোহাইলিড; পিঠ ফ্যাকাশে-বাদামি-গোলাপি with গাঢা জ্যামিতিক দাগ-বন্ধনী, পেট সাদা, পা খাটো, চোখ ফোলা-ফোলা। ভেজা তৃণভূমি-ধানক্ষেত-অস্থায়ী ডোবায় পিঁপড়া-উইপোকা-ছোট পোকা শিকার করে; বর্ষায় উঁচু-কম্পাঙ্কের ডাক দেয়। ঐতিহাসিকভাবে M. ornata-জটে বিভ্রান্ত ছিল; Matsui et al. (2005)-এর আণবিক সংশোধনে M. fissipes দক্ষিণ-পূর্ব এশিয়া-চীনের স্বতন্ত্র প্রজাতি হিসেবে চিহ্নিত। গুরুত্বপূর্ণ সতর্কতা: IUCN Red List বাংলাদেশে এর উপস্থিতি “Presence Uncertain” দেখায়; Rayan & Islam (2026) তবু ৯৬-চেকলিস্টে রেখেছেন। বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ২–৩ সেমি; অতি-ক্ষুদে সরু-মুখ, পিঠে গাঢা জ্যামিতিক বন্ধনী-দাগ।',
    identification: 'ধানক্ষেতের ক্ষুদে ব্যাঙ; ornata-সদৃশ—দাগ-বিন্যাস ও আণবিক পার্থক্যে আলাদা।',
    diet: 'পিঁপড়া, উইপোকা, ছোট পতঙ্গ ও মাকড়সা।',
    behavior: 'বর্ষায় অস্থায়ী ডোবা-ধারে জড়ো হয়; লুকিয়ে থাকা স্বভাব; রাতে ডাকে।',
    reproduction: 'বৃষ্টির ডোবা-ধানক্ষেতে ডিম; ট্যাডপোল অল্প জলে দ্রুত রূপান্তরিত হয়।',
    habitat: 'ধানক্ষেত, ভেজা তৃণভূমি, অস্থায়ী বর্ষার জলাশয়, বন-প্রান্ত।',
    distribution: 'বাংলাদেশ (IUCN-অনিশ্চিত); চীন-তাইওয়ান-ইন্দোচীন-মিয়ানমার বিন্যাস।',
    whereToSee: 'বর্ষার ধানক্ষেত-ডোবায় (বাংলাদেশে M. ornata-সঙ্গে সতর্ক শনাক্তকরণ আবশ্যক)।',
    season: 'প্রজনন বর্ষাকালে (মে–সেপ্টেম্বর)।',
    sizeOrHeight: '২–৩ সেন্টিমিটার',
    ecologicalRole: 'ক্ষুদে পতঙ্গ-নিয়ন্ত্রক; সাপ-পাখি-মাকড়সার খাদ্য।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশ-উপস্থিতি IUCN “Presence Uncertain”—আঞ্চলিক নিশ্চিতকরণ জরুরি।',
    threats: 'ধানক্ষেত-ভরাট, কীটনাশক, ornata-জটে তথ্য-বিভ্রাট, অস্থায়ী জলাশয় নষ্ট।',
    conservationActions: 'আণবিক-ডাক-ভিত্তিক জরিপে আঞ্চলিক উপস্থিতি-নিরূপণ; ধানক্ষেত-ডোবা রক্ষা।',
    colorTags: ['#9a8468', '#544532', '#ddd3bf'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Ornate_Pygmy_Frog_%28Microhyla_fissipes%29.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Ornate_Pygmy_Frog_%28Microhyla_fissipes%29.jpg')],
  },
  {
    slug: 'taipei-grass-frog', type: 'prani', group: 'ubhochor', category: 'উভচর',
    nameBn: 'তাইপেই ঘাস ব্যাঙ', nameEn: 'Taipei Grass Frog', scientificName: 'Hylarana taipehensis',
    otherNames: ['দুই-ডোরা ঘাস ব্যাঙ', 'Two-striped Grass Frog', 'Rana taipehensis (পুরোনো নাম)', 'Hylarana taipehensis (Van Denburgh, 1909)'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Amphibia', order: 'Anura', family: 'Ranidae', genus: 'Hylarana', species: 'Hylarana taipehensis' },
    summary: 'জলাভূমি-ঘাসের সরু ফ্যাকাশে-সবুজ ব্যাঙ; পাশে দুই স্পষ্ট ডোরা; বাংলাদেশ-উপস্থিতি IUCN-অনিশ্চিত; বৈশ্বিক LC।',
    description:
      'তাইপেই ঘাস ব্যাঙ সরু-মসৃণ-লম্বা-পাওয়ালা ব্যাঙ; পিঠ ফ্যাকাশে-সবুজ-হলদেটে-বাদামি, নাক থেকে শরীর-পাশ বেয়ে দুটি স্পষ্ট গাঢা লম্বা ডোরা, ঠোঁট-পেট হালকা, পেছনের পা লম্বা। জলাভূমি-ধানক্ষেত-তৃণভূমি-খাল-ধারের ঘাসে পোকা-মাকড় শিকার করে; দ্রুত লাফায় ও ভালো সাঁতার কাটে। দীর্ঘদিন Rana taipehensis নামে ছিল; বর্তমানে Hylarana (কেউ কেউ Sylvirana-তেও রাখেন)। গুরুত্বপূর্ণ সতর্কতা: IUCN Red List বাংলাদেশে উপস্থিতি “Presence Uncertain” দেখায়; Rayan & Islam (2026) তবু ৯৬-চেকলিস্টে রেখেছেন। বৈশ্বিক IUCN কোড LC।',
    physical: 'দৈর্ঘ্য ৪–৬ সেমি; সরু মসৃণ দেহ, পাশে দুই গাঢা ডোরা, ফ্যাকাশে-সবুজ পিঠ।',
    identification: 'ঘাস-জলাভূমির দুই-ডোরা সরু ব্যাঙ; স্পষ্ট পাশ-ডোরা ও লম্বা পা।',
    diet: 'পোকা-শাবক, মশা-লার্ভা, মাকড়সা, কেঁচো।',
    behavior: 'নিশাচর প্রবণ; ঘাস-জলরেখায় ঘোরে; ভয়ে দ্রুত পানিতে লাফ দেয়।',
    reproduction: 'স্থির পানি-জলাভূমিতে ডিম; ট্যাডপোল অগভীর জলে বাড়ে।',
    habitat: 'জলাভূমি, ধানক্ষেত, তৃণভূমি, খাল-বিল-পুকুর-প্রান্ত।',
    distribution: 'বাংলাদেশ (IUCN-অনিশ্চিত); ভুটান-উত্তর-পূর্ব ভারত-মিয়ানমার-চীন-ইন্দোচীন-তাইওয়ান বিন্যাস।',
    whereToSee: 'উত্তর-পূর্বাঞ্চলের জলাভূমি-ধানক্ষেতের ঘাসে বর্ষার সন্ধ্যায় (আঞ্চলিক নিশ্চিতকরণ আবশ্যক)।',
    season: 'প্রজনন বর্ষাকালে (এপ্রিল–সেপ্টেম্বর)।',
    sizeOrHeight: '৪–৬ সেন্টিমিটার',
    ecologicalRole: 'জলাভূমি-পতঙ্গ-নিয়ন্ত্রক; সাপ-পাখি-ছোট স্তন্যপায়ীর খাদ্য।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); বাংলাদেশ-উপস্থিতি IUCN “Presence Uncertain”—আঞ্চলিক ভাউচার-নিশ্চিতকরণ জরুরি।',
    threats: 'জলাভূমি-ভরাট, কীটনাশক, কৃষি-সম্প্রসারণ, আঞ্চলিক তথ্য-ঘাটতি।',
    conservationActions: 'জলাভূমি-ধানক্ষেত সংরক্ষণ; ডাক-আণবিক জরিপ; আঞ্চলিক বিন্যাস-মানচিত্র।',
    colorTags: ['#8a9a5e', '#4a5234', '#dde2c8'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Hylarana_taipehensis.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, HERPS_BD, AMPHIBIANS_BD, COMMONS('Hylarana_taipehensis.jpg')],
  },
]
