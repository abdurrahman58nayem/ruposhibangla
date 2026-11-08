import type { Species } from '@/lib/types'
import { IUCN, IUCN_BD, GBIF, FISH_BD } from './sources'

/**
 * মাছ সম্প্রসারণ — ব্যাচ ৯ (২০২৬-১০-২৭): ৬টি মোহনা/নদ/অ্যাকোয়ারিয়াম-মাছ
 *
 * লক্ষ্যভিত্তি: IUCN Red List of Bangladesh (2015)-এর ২৫৩ মিঠাপানি-
 * প্রজাতি; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১৬৭ (২৫৩-লক্ষ্যের ৬৬%)।
 * ব্যাচ ৮-এর পদ্ধতিগত ডিফের ওপর ভিত্তি করে এ ব্যাচে অবশিষ্ট
 * অনুপস্থিত প্রজাতিগুলো আবার দুই পথে (categorymembers +
 * পূর্ণ-টেক্সট search API) যাচাই করা হয়; GLAM at CVASU ক্যাটাগরির
 * সম্পূর্ণ তালিকাও (দুই পেজ) পরীক্ষা করা হয়। ১৫+ স্ক্রিনিং-ঢেউয়ে
 * মাত্র ৬টি নতুন প্রজাতিতে গ্রহণযোগ্য মুক্ত লাইসেন্সের আধুনিক
 * আলোকচিত্র/বৈজ্ঞানিক-চিত্র পাওয়া যায়।
 *
 * গুরুত্বপূর্ণ সিদ্ধান্ত: (১) তিনটি প্রার্থী (Acanthocobitis
 * zonalternans, Ilisha megaloptera, Setipinna taty) স্ক্রিনিং-এ
 * আধুনিক ফাইল পেলেও দেখা যায় লেগ্যাসি বীজে ভিন্ন স্লাগে আগেই
 * সাইটে আছে — ডুপ-এড হয়নি; (২) Pseudapocryptes elongatus-এর
 * ভিয়েতনামি CC BY-SA ফাইল রান্না-ক্যাটাগরি ("Fish in Viet
 * cuisine")-বদ্ধ ও প্রজাতি-ক্যাটাগরিবিহীন — বর্জিত;
 * (৩) Paraplagusia bilineata (#175)-র ২০২৬-এর তিনটি CC BY-SA
 * ফাইলই শুধু মাথা/পেটের আংশিক-দৃশ্য, কোনো পূর্ণ-দেহ ছবি নেই —
 * বর্জিত; (৪) Neotropius atherinoides-এর মতো এ ব্যাচেও একাধিক
 * "নন-প্লেট" ফাইল extmetadata-তে ঐতিহাসিক (Beavan/Sykes ১৮৩৯/
 * Haludar/Bloch) প্রমাণিত হয়; (৫) Chela laubuca-র চিত্রটি
 * ব্যাচ ৭-এর Devario anomalus-নজিরে Kullander ZooKeys 2018
 * পত্রের বাংলাদেশ (ঢাকা)-নমুনাসংবলিত CC BY 4.0 বৈজ্ঞানিক চিত্র।
 *
 * লাইসেন্স মিশ্রণ (৬ ফাইল): ২ CC BY 4.0 (Chela laubuca —
 * Kullander et al. ZooKeys; Hara hara — R. Gassah/iNaturalist),
 * ১ CC BY-SA 4.0 (Ichthyocampus carce — AravindManoj),
 * ২ CC BY 3.0 (Macrospinosa cuja — M. R. Parvej/FishBase;
 * Trypauchen vagina — H. B. Osmany/FishBase),
 * ১ CC BY-SA 3.0 (Trichogaster labiosus — O. Gorski)।
 *
 * জাতীয় অবস্থা (bdfish ২৫৩-তালিকা-ক্রমিকসহ): LC ৪ (#54, #100,
 * #247, #250), NT ২ (#106, #133)। বৈশ্বিক: LC ৫, DD ১
 * (Macrospinosa cuja, IUCN 2020)।
 */
const COMMONS = (file: string): { title: string; url: string; license: string } => ({
  title: 'ছবির মূল ফাইল — Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
  license: 'Wikimedia Commons',
})

export const MORE_FISH10: Species[] = [
  {
    slug: 'indian-glass-barb', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'লাউবুচা', nameEn: 'Indian Glass Barb', scientificName: 'Chela laubuca',
    otherNames: ['দেশি লাউবুছা', 'চেপ চেলা', 'Laubuka laubuca', 'Indian glass barb', 'Perilampus laubuca'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Cypriniformes', family: 'Danionidae', genus: 'Chela', species: 'Chela laubuca' },
    summary: 'স্বচ্ছ-রুপালি ক্ষুদে চেলা; বাংলাদেশে লাউবুচা; Kullander ZooKeys 2018-এর ঢাকা-নমুনাসহ বৈজ্ঞানিক চিত্র; বৈশ্বিক ও জাতীয় LC (#54)।',
    description:
      'লাউবুচার দেহ অত্যন্ত চাপা-ফলক-সদৃশ, প্রায়-স্বচ্ছ-রুপালি; পেট-রেখা ধারালো, মুখ ঊর্ধ্ব-মুখী, চোখ তুলনামূলক-বড়, পার্শ্বরেখা নিচু-বক্র ও আঁশ ক্ষুদে-ঝিলিকময়; পুচ্ছ-পাখনা গভীর-কাঁটাচামচ। নদ-খাল-বিল-প্লাবনভূমির উপরি-জলে ঝাঁক বেঁধে ভাসমান পতঙ্গ ও প্ল্যাঙ্কটন খেয়ে বেড়ায়। বাংলাদেশ, ভারত, মিয়ানমার, শ্রীলঙ্কা ও দক্ষিণ-পূর্ব এশিয়ায় বিস্তৃত। আধুনিক শ্রেণীবিন্যাসে Laubuka laubuca নাম প্রচলিত; ২৫৩-তালিকা Chela laubuca অনুসরণ করা হয়েছে। ব্যবহৃত চিত্রটি Kullander, Rahman, Norén ও Mollah-র ZooKeys 2018 গবেষণাপত্রের, যেখানে বাংলাদেশ ঢাকার ৯৫% ইথানল-সংরক্ষিত নমুনা (NRM 67317) অন্তর্ভুক্ত। বৈশ্বিক ও জাতীয় IUCN — উভয়ই LC (#54)।',
    physical: 'দৈর্ঘ্য সাধারণত ৫–৮ সেমি; স্বচ্ছ-রুপালি ফলক-চাপা দেহ, ধারালো পেট, বড় চোখ।',
    identification: 'প্রায়-স্বচ্ছ দেহ ও ঊর্ধ্ব-মুখী-মুখ; Chela cachius-র চেয়ে দেহ গভীরতর ও আঁশ ক্ষুদ্রতর।',
    diet: 'ভাসমান পতঙ্গ, প্ল্যাঙ্কটন, পতঙ্গ-লার্ভা, ভাসমান জৈবকণা।',
    behavior: 'উপরি-জলের দ্রুত-ঝাঁকপ্রিয় শান্ত-স্বভাবের মাছ; আলো-আকর্ষী।',
    reproduction: 'বর্ষাকালে প্লাবনভূমি-কুলে ডিম ছাড়ে; বিস্তারিত আংশিক-নথিভুক্ত।',
    habitat: 'নদ-খাল-বিল-প্লাবনভূমির মুক্ত-উপরি-জল, আগাছা-ঘেরা শান্ত প্রান্ত।',
    distribution: 'বাংলাদেশ (ঢাকাসহ দেশব্যাপী); ভারত, মিয়ানমার, শ্রীলঙ্কা, দক্ষিণ-পূর্ব এশিয়া।',
    whereToSee: 'ক্ষুদে-মাছের হাট, গ্রামীণ খাল-বিল ও মৎস্য-জরিপ-নমুনায়।',
    season: 'প্রজনন বর্ষাকালে (জুন–সেপ্টেম্বর); সারাবছর পাওয়া যায়।',
    sizeOrHeight: '৫–৮ সেন্টিমিটার',
    ecologicalRole: 'উপরি-জলের পতঙ্গভোজী ও বৃহৎ মাছ-পাখির প্রধান ক্ষুদে-শিকার; খাদ্য-জাল-কড়ি।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); IUCN Bangladesh ২০১৫-তেও LC (#54)।',
    threats: 'পানি-দূষণ, কীটনাশক-প্রবাহ, সূক্ষ্ম-জাল-নিধন, প্লাবনভূমি-ভরাট, প্রবাহ-হ্রাস।',
    conservationActions: 'জলাভূমি-সংরক্ষণ, ক্ষুদে-জাল-নিয়ন্ত্রণ, দূষণ-হ্রাস, জনসংখ্যা-মনিটরিং।',
    colorTags: ['#d7dde2', '#95a7b2', '#f2f5f7'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Laubuka_laubuca._A_NRM_57234%2C_53.1_mm_SL%2C_in_Formalin%2C_Indien%2C_Einzugsgebiet_des_Brahmaputra%2C_Dibrugarh._B_NRM_67317_mm_SL%2C_in_95%25_Ethanol_Bangladesh%2C_Dhaka.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Laubuka laubuca. A NRM 57234, 53.1 mm SL, in Formalin, Indien, Einzugsgebiet des Brahmaputra, Dibrugarh. B NRM 67317 mm SL, in 95% Ethanol Bangladesh, Dhaka.jpg')],
  },
  {
    slug: 'kosi-hara', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'চাকামাকা', nameEn: 'Kosi Hara', scientificName: 'Hara hara',
    otherNames: ['কাটাকুন্তি', 'তিত মাগুর', 'Erethistes hara', 'Kosi hara', 'Pimelodus hara'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Siluriformes', family: 'Erethistidae', genus: 'Hara', species: 'Hara hara' },
    summary: 'দক্ষিণ এশীয় ক্ষুদে পাথর-ক্যাটফিশ; বাংলাদেশে চাকামাকা/কাটাকুন্তি; বৈশ্বিক ও জাতীয় LC (#100)।',
    description:
      'চাকামাকার দেহ ছোট-লম্বা, মাথা চ্যাপ্টা-ভোঁতা, ত্বক রুক্ষ-আঁশবিহীন; চার জোড়া শুঁড়ি, পৃষ্ঠ-কাঁটা খাটো-মসৃণ, পার্শ্ব-পাখনার কাঁটা শক্ত; রঙ ফিকে-বাদামি-হলদে with পিঠ গাঢ় ও অস্পষ্ট-ফোঁটা-সারি, পেট ফ্যাকাশে। নদ-স্রোতের পাথর-বালি-তলে বাস করে; ক্ষুদে পোকা-লার্ভা, ক্রাস্টেসিয়ান ও ডেট্রিটাস খায়। বাংলাদেশ, ভারত, নেপাল, মিয়ানমার ও চীনের দক্ষিণাংশে বিস্তৃত; দৈর্ঘ্য ১৩ সেমি পর্যন্ত। অনেক শ্রেণীবিন্যাসে Erethistes hara নামে গণ্য (Hara গণকে অবৈধ ঘোষণা করা হয়েছে); ২৫৩-তালিকা Hara hara অনুসরণ করা হয়েছে। ছবিটি ভারতের মেঘালয় (বাংলাদেশ-সীমান্ত নিকটবর্তী)-এর ২০১৮ সালের iNaturalist-পর্যবেক্ষণ। বৈশ্বিক ও জাতীয় IUCN — উভয়ই LC (#100)।',
    physical: 'দৈর্ঘ্য সাধারণত ৬–১০ সেমি (সর্বোচ্চ ১৩ সেমি TL); রুক্ষ-আঁশবিহীন ত্বক, ভোঁতা-চ্যাপ্টা মাথা, শক্ত-কাঁটা।',
    identification: 'ছোট-খাটো পৃষ্ঠ-কাঁটা ও চার জোড়া শুঁড়ি; Hara jerdoni-র চেয়ে দেহ বৃহত্তর ও লম্বা।',
    diet: 'জলজ পোকা-লার্ভা, ক্ষুদে ক্রাস্টেসিয়ান, কৃমি, ডেট্রিটাস।',
    behavior: 'নিশাচর-তল-বাসী; পাথর-নিচে আশ্রয়; বিপদে কাঁটা ফাঁক করে।',
    reproduction: 'স্রোত-জলে ডিম পাড়ে; বিস্তারিত প্রজনন-তথ্য সীমিত।',
    habitat: 'নদ-স্রোতের পাথর-বালি-তল, স্বচ্ছ-অম্লীয়-মৃদু জল।',
    distribution: 'বাংলাদেশ; ভারত (মেঘালয়-গঙ্গা-ব্রহ্মপুত্র), নেপাল, মিয়ানমার, দক্ষিণ চীন।',
    whereToSee: 'উত্তর-পূর্ব সীমান্ত-নদ ও পাথুরে-স্রোতের মাছ-হাটে; বিশেষ জরিপ-নমুনায়।',
    season: 'সারাবছর স্রোত-জলে; বর্ষায় নিচু-প্রস্থানে নামতে পারে।',
    sizeOrHeight: '৬–১০ সেন্টিমিটার (সর্বোচ্চ ১৩ সেমি TL)',
    ecologicalRole: 'তল-স্তরের ক্ষুদে-শিকারী ও স্রোত-মান-নির্দেশক; বৃহৎ মাছের শিকার।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); IUCN Bangladesh ২০১৫-তেও LC (#100)।',
    threats: 'নদ-দখল, বালি-পাথর উত্তোলন, পলি-পড়া, কীটনাশক-প্রবাহ, প্রবাহ-হ্রাস।',
    conservationActions: 'স্রোত-প্রবাহ-সংরক্ষণ, উত্তোলন-নিষেধাজ্ঞা, বাফার-বনায়ন, জরিপ-মনিটরিং।',
    colorTags: ['#a89a82', '#6b5f4c', '#ddd5c4'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Erethistes_hara.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Erethistes hara.jpg')],
  },
  {
    slug: 'indian-freshwater-pipefish', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'কুমিরের খিল', nameEn: 'Indian Freshwater Pipefish', scientificName: 'Ichthyocampus carce',
    otherNames: ['কারা কুমিরের খিল', 'Freshwater pipefish', 'Syngnathus carce', 'Hippichthys carce'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Syngnathiformes', family: 'Syngnathidae', genus: 'Ichthyocampus', species: 'Ichthyocampus carce' },
    summary: 'সরু-নলাকার স্বাদু-লোনা-জলের পাইপফিশ; বাংলাদেশে কুমিরের খিল; বৈশ্বিক LC, জাতীয় NT (#106)।',
    description:
      'কুমিরের খিলের দেহ অত্যন্ত লম্বা-সরু-নলাকার, অস্থি-কবচ-সদৃশ আংটি-আঁশে ঢাকা; মুখ নল-আকারের-চোষক, চোখ ছোট; পৃষ্ঠ-পাখনা ক্ষুদে ও পুচ্ছ-পাখনা পাখা-সদৃশ; রঙ ফিকে-বাদামি-সবজে with অস্পষ্ট-ডোরা। সাঁতার ধীর-অর্ধ-খাড়া; প্ল্যাঙ্কটন, ক্ষুদে ক্রাস্টেসিয়ান ও জলজ পোকা-লার্ভা চুষে খায়। স্ত্রী-নির্বিশেষে পুরুষ প্রাণী তল্পি-থলিতে ডিম বহন করে বাচ্চা ফোটায়। মোহনা, জোয়ার-নদ ও মিঠা-জলের স্রোতে বাস করে; বাংলাদেশসহ ভারত মহাসাগর থেকি পশ্চিম প্রশান্ত মহাসাগর পর্যন্ত বিস্তৃত; দৈর্ঘ্য ১৫ সেমি পর্যন্ত। বৈশ্বিক IUCN LC; জাতীয় IUCN Bangladesh ২০১৫-তে NT (#106)।',
    physical: 'দৈর্ঘ্য সাধারণত ৮–১২ সেমি (সর্বোচ্চ ১৫ সেমি); নলাকার-কবচ-দেহ, চোষক-মুখ, ধীর-খাড়া-সাঁতার।',
    identification: 'নল-আকার-চোষক-মুখ ও অস্থি-আংটি-দেহ; Microphis cuncalus-র চেয়ে দেহ সরু ও থলি-গঠন ভিন্ন।',
    diet: 'প্ল্যাঙ্কটন, ক্ষুদে ক্রাস্টেসিয়ান, পোকা-লার্ভা, অতিক্ষুদে জলজকণা।',
    behavior: 'ধীর-অর্ধ-খাড়া-সাঁতারু; আগাছা-ডাঙরে লুকিয়ে থাকে; পুরুষ-থলি-ডিম্বধারণ।',
    reproduction: 'পুরুষের তল্পি-থলিতে স্ত্রী ডিম জমা করে; নিষিক্ত ডিম থলিতেই ফোটে—মাছেদের মধ্যে বিরল পিতৃ-যত্ন।',
    habitat: 'মোহনা, জোয়ার-নদ, মিঠা-জলের স্রোত ও আগাছা-ঘেরা অগভীর জল।',
    distribution: 'বাংলাদেশ; ভারত মহাসাগর–পশ্চিম প্রশান্ত মহাসাগর বেল্ট (ভারত–ইন্দোনেশিয়া)।',
    whereToSee: 'উপকূলীয় মোহনা-খাল ও ক্ষুদে-মাছের হাটে; মৎস্য-জরিপ-নমুনায়।',
    season: 'প্রজনন বর্ষাকালে; সারাবছর মোহনা-জলে থাকে।',
    sizeOrHeight: '৮–১২ সেন্টিমিটার (সর্বোচ্চ ১৫ সেমি)',
    ecologicalRole: 'অগভীর-জলের ক্ষুদে-অমেরুদণ্ডী-নিয়ন্ত্রক ও বৃহৎ মাছ-পাখির শিকার; মোহনা-স্বাস্থ্য-সূচক।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); IUCN Bangladesh ২০১৫: প্রায়-বিপদগ্রস্ত (NT, #106) — মোহনা-আবাস-চাপে জাতীয় জনসংখ্যা হ্রাসমান।',
    threats: 'মোহনা-ভরাট, ম্যানগ্রোভ-উজাড়, লবণাক্ততা-পরিবর্তন, দূষণ, সূক্ষ্ম-জাল-আহরণ।',
    conservationActions: 'ম্যানগ্রোভ-মোহনা-সংরক্ষণ, প্রজনন-মৌসুমে আহরণ-নিয়ন্ত্রণ, জনসংখ্যা-জরিপ।',
    colorTags: ['#9aa38a', '#5f6852', '#e3e6da'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Ichthyocampus_carce.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Ichthyocampus carce.jpg')],
  },
  {
    slug: 'cuja-bola', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'কুঁজো পোয়া', nameEn: 'Cuja Bola', scientificName: 'Macrospinosa cuja',
    otherNames: ['কুইজ্জা পোয়া', 'কুজা ভোলা', 'Bola cuja', 'Cuja croaker', 'Johnius cujus'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Acanthuriformes', family: 'Sciaenidae', genus: 'Macrospinosa', species: 'Macrospinosa cuja' },
    summary: 'গঙ্গা-মোহনার কাঁটা-পোয়া মাছ; বাংলাদেশে কুঁজো পোয়া; চট্টগ্রাম-ফিশারি ঘাটের FishBase ছবি; বৈশ্বিক DD, জাতীয় NT (#133)।',
    description:
      'কুঁজো পোয়ার দেহ লম্বা-চাপা-রুপালি-সবজে, পিঠ ফিকে-ধূসর ও পেট রুপালি-ফ্যাকাশে; মাথা খানিক ভোঁতা, মুখ প্রান্তিক-নিচু, পার্শ্ব-রেখা স্পষ্ট; পায়ু-পাখনার দ্বিতীয় কাঁটা লম্বা-মজবুত (গণ-নামের উৎস), পুচ্ছ-পাখনা সামান্য-খাঁজ-করা; আঁশ বড়-ঝিলিকময়। মোহনা, নদ-মুখ ও ম্যানগ্রোভ-খালের নরম-পলি-তলে বাস করে; চিংড়ি, ক্ষুদে মাছ, পলি-কৃমি ও ডেট্রিটাস খায়; আংশিক-অভিবাসী, জোয়ার-নদ বেয়ে মিঠা-জলে ওঠে। গঙ্গা-ব্রহ্মপুত্র মোহনা (সুন্দরবন), মিয়ানমার ও থাইল্যান্ড পর্যন্ত বিস্তৃত; মনো-টাইপিক গণের একমাত্র প্রজাতি। সাঁতার-থলি মূল্যবান বলে অতি-আহরণ-চাপ রয়েছে। বৈশ্বিক IUCN 2020: DD; জাতীয় IUCN Bangladesh ২০১৫: NT (#133)।',
    physical: 'দৈর্ঘ্য সাধারণত ১৫–২৫ সেমি; রুপালি-চাপা দেহ, লম্বা-মজবুত পায়ু-কাঁটা, বড়-ঝিলিক-আঁশ।',
    identification: 'পায়ু-পাখনার দীর্ঘ দ্বিতীয় কাঁটা ও ক্রোকার-মাথা-গঠন; অন্য পোয়া-মাছের চেয়ে দেহ রুপালি-গভীর।',
    diet: 'চিংড়ি-ক্রাস্টেসিয়ান, ক্ষুদে মাছ, পলি-কৃমি, ডেট্রিটাস।',
    behavior: 'তল-বাসী-ঝাঁকপ্রিয়; গভীর-মৃদু-শব্দ (drumming) উৎপাদন করে; জোয়ার-ভাটা-অভিবাসী।',
    reproduction: 'জোয়ার-নদ-মুখে ডিম ছাড়ে; আংশিক-অভিবাসী; বিস্তারিত সীমিত-নথিভুক্ত।',
    habitat: 'মোহনা, নদ-মুখ, ম্যানগ্রোভ-খাল, পলি-নরম-তল, জোয়ার-মিঠা-মিশ্র জল।',
    distribution: 'বাংলাদেশ (সুন্দরবন-চট্টগ্রাম মোহনা); ভারত, মিয়ানমার, থাইল্যান্ড।',
    whereToSee: 'চট্টগ্রাম-খুলনার মোহনা-মাছ-ঘাট (ফিশারি ঘাট) ও সুন্দরবন-সংলগ্ন বাজারে।',
    season: 'সারাবছর; বর্ষা-জোয়ারে নদ-মুখে বেশি ধরা পড়ে।',
    sizeOrHeight: '১৫–২৫ সেন্টিমিটার',
    ecologicalRole: 'তল-স্তরের ক্রাস্টেশিয়ান-ভোজী ও বৃহৎ শিকারীর খাদ্য; মোহনা-খাদ্য-জাল-কড়ি।',
    origin: 'native', conservation: 'DD', conservationBn: 'বৈশ্বিক IUCN: তথ্য-ঘাটতি (DD, ২০২০) — জনসংখ্যা-প্রবণতা-উপাত্ত অপ্রতুল; IUCN Bangladesh ২০১৫: প্রায়-বিপদগ্রস্ত (NT, #133)।',
    threats: 'সাঁতার-থলি-লক্ষ্যকৃত অতি-আহরণ, সূক্ষ্ম-জাল, মোহনা-দূষণ, ম্যানগ্রোভ-উজাড়, পলি-পড়া।',
    conservationActions: 'আহরণ-কোটা-নির্ধারণ, প্রজনন-অভয়াশ্রম, জরিপ-গবেষণা (DD→সুনির্দিষ্ট শ্রেণি), মোহনা-সংরক্ষণ।',
    colorTags: ['#c2c8c4', '#7f8d88', '#eef1ef'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Cujabola.png',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Cujabola.png')],
  },
  {
    slug: 'thick-lipped-gourami', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'ঠোঁটমোটা খলিশা', nameEn: 'Thick-lipped Gourami', scientificName: 'Trichogaster labiosus',
    otherNames: ['Thontmota Khalisha', 'Colisa labiosa', 'Trichogaster labiosa', 'Sunset gourami'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Anabantiformes', family: 'Osphronemidae', genus: 'Trichogaster', species: 'Trichogaster labiosus' },
    summary: 'পুরু-ঠোঁটের রঙিন খলিশা; বাংলাদেশে ঠোঁটমোটা খলিশা; অ্যাকোয়ারিয়াম-জনপ্রিয়; বৈশ্বিক ও জাতীয় LC (#247)।',
    description:
      'ঠোঁটমোটা খলিশার দেহ ডিম্বাকার-চাপা, পুরু-মাংসল-ঠোঁট ও সুতো-সদৃশ-রূপান্তরিত পেলভিক-পাখনা; পুরুষের পার্শ্বে তির্যক-পাতলা লাল-নীল ডোরা এবং স্ত্রী রুপালি-ফ্যাকাশে; পৃষ্ঠ-পাখনার ডগা পুরুষে সূঁচালো; আঁশ ক্ষুদে-ঘন। শান্ত-প্রকৃতির গোলকধাঁধা-মাছ (labyrinth fish) — অক্সিজেন-কম জলে বায়ু-গ্রহণে সক্ষম; শৈবাল, পোকা, ক্ষুদে ক্রাস্টেসিয়ান ও জৈবকণা খায়। দক্ষিণ মিয়ানমার আদি-আবাস; বাংলাদেশ-ভারতসহ দক্ষিণ এশিয়ায় বিস্তৃত ও অ্যাকোয়ারিয়াম-বাণিজ্যে জনপ্রিয়; দৈর্ঘ্য ৯ সেমি পর্যন্ত। ব্যুবল-নীড় (bubble nest) বানিয়ে প্রজনন করে। বৈশ্বিক ও জাতীয় IUCN — উভয়ই LC (#247)।',
    physical: 'দৈর্ঘ্য সাধারণত ৬–৯ সেমি; ডিম্বাকার-চাপা দেহ, পুরু-ঠোঁট, সুতো-পেলভিক-পাখনা, তির্যক-লাল-নীল ডোরা।',
    identification: 'মাংসল-পুরু-ঠোঁট ও সুতো-সদৃশ পেলভিক-পাখনা; T. fasciata-র চেয়ে ঠোঁট স্পষ্টতই পুরু।',
    diet: 'শৈবাল, জলজ পোকা-লার্ভা, ক্ষুদে ক্রাস্টেসিয়ান, ডেট্রিটাস, প্রস্তুত-খাদ্য।',
    behavior: 'শান্ত-উপরি-মধ্য-স্তরের মাছ; বায়ু-গ্রহণে নিয়মিত পৃষ্ঠে ভাসে; পুরুষ আঞ্চলিক-প্রজনন-আচরণ দেখায়।',
    reproduction: 'ব্যুবল-নীড়-নির্মাতা; পুরুষ ফেনা-নীড় বানিয়ে ডিম পাহারা দেয়।',
    habitat: 'বন্য-অবস্থায় ধীর-স্রোতের নদ-খাল-বিল-জলাভূমি; অ্যাকোয়ারিয়ামে বহুল-পালিত।',
    distribution: 'আদি-আবাস দক্ষিণ মিয়ানমার; বাংলাদেশ-ভারতে বিস্তৃত; কলম্বিয়ায় অনুপ্রবেশকারী।',
    whereToSee: 'অ্যাকোয়ারিয়াম-দোকান ও শখের-চৌবাচ্চায়; ময়মনসিংহ-হাওর-জরিপ-নমুনায়।',
    season: 'প্রজনন বর্ষাকালে; অ্যাকোয়ারিয়ামে সারাবছর প্রজনন-সক্ষম।',
    sizeOrHeight: '৬–৯ সেন্টিমিটার',
    ecologicalRole: 'মধ্য-স্তরের সর্বভুক-ক্ষুদে-শিকারী ও পোকা-শৈবাল-নিয়ন্ত্রক; অ্যাকোয়ারিয়াম-অর্থনীতির অংশ।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC, ২০১০); IUCN Bangladesh ২০১৫-তেও LC (#247)।',
    threats: 'আবাস-ভরাট, কীটনাশক-দূষণ, অ্যাকোয়ারিয়াম-অতি-সংগ্রহ, অবমুক্ত-বহিরাগত-প্রজাতি-ঝুঁকি।',
    conservationActions: 'জলাভূমি-সংরক্ষণ, টেকসই-সংগ্রহ-নীতি, বন্য-জনসংখ্যা-জরিপ, অ্যাকোয়ারিয়াম-সচেতনতা।',
    colorTags: ['#c98a5e', '#7a5a3c', '#e8d3b8'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Colisa_labiosa_m.jpg',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Colisa labiosa m.jpg')],
  },
  {
    slug: 'burrowing-goby', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'সাদা চেউয়া', nameEn: 'Burrowing Goby', scientificName: 'Trypauchen vagina',
    otherNames: ['Sada cheowa', 'Pink mud goby', 'Red goby', 'Gobius vagina'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Gobiiformes', family: 'Oxudercidae', genus: 'Trypauchen', species: 'Trypauchen vagina' },
    summary: 'গর্ত-খুঁড়ে বাস করা লালচে-সাদা ঈল-গোবি; বাংলাদেশে সাদা চেউয়া; বৈশ্বিক ও জাতীয় LC (#250)।',
    description:
      'সাদা চেউয়ার দেহ লম্বা-বেলনাকার-ঈল-সদৃশ, লালচে-গোলাপি-ফ্যাকাশে; মাথা ভোঁতা-চ্যাপ্টা, চোখ ক্ষুদে-উপরে-স্থিত, কানকুয়ার-উপরি-প্রান্তে স্বতন্ত্র-থলি; পাখনা ক্ষুদে ও পরস্পর-যুক্ত, আঁশ ক্ষুদে-অস্পষ্ট; ত্বক পিচ্ছিল-শ্লেষ্মাযুক্ত। মোহনা ও উপকূলের পলি-কাদা-তলে গভীর-গর্ত খুঁড়ে বাস করে; পলি-ডেট্রিটাস, ক্ষুদে ক্রাস্টেসিয়ান ও পলি-কৃমি খায়। ইন্দো-প্রশান্ত মহাসাগরীয় বেল্টে বাংলাদেশ, ভারত, দক্ষিণ-পূর্ব এশিয়া ও চীন পর্যন্ত বিস্তৃত; দৈর্ঘ্য ২০–২২ সেমি পর্যন্ত। বাংলাদেশের সুন্দরবন-মোহনা ও উপকূলীয় হাটে সাদা চেউয়া নামে পরিচিত। বৈশ্বিক ও জাতীয় IUCN — উভয়ই LC (#250)।',
    physical: 'দৈর্ঘ্য সাধারণত ১২–১৮ সেমি (সর্বোচ্চ ২০–২২ সেমি); লালচে-গোলাপি বেলনাকার-দেহ, ক্ষুদে-চোখ, পিচ্ছিল-ত্বক।',
    identification: 'ঈল-সদৃশ-লালচে-দেহ ও কানকুয়ার-থলি; Taenioides-দের চেয়ে দেহ ফ্যাকাশে-গোলাপি ও চোখ অপেক্ষাকৃত-স্পষ্ট।',
    diet: 'পলি-ডেট্রিটাস, ক্ষুদে ক্রাস্টেসিয়ান, পলি-কৃমি, অমেরুদণ্ডী-লার্ভা।',
    behavior: 'গর্ত-খননকারী-তল-বাসী; ভাটায় গর্তে থাকে, জোয়ারে সক্রিয়; অক্সিজেন-কম-পলিতে সহিষ্ণু।',
    reproduction: 'মোহনা-কাদা-তলে ডিম পাড়ে; বিস্তারিত প্রজনন-তথ্য সীমিত।',
    habitat: 'মোহনা-উপকূলের নরম-পলি-কাদা-তল, ম্যানগ্রোভ-প্রান্ত, লবণাক্ত-মিঠা-মিশ্র জল।',
    distribution: 'বাংলাদেশ (সুন্দরবন-উপকূল); ইন্দো-প্রশান্ত বেল্ট (ভারত–চীন–দক্ষিণ-পূর্ব এশিয়া)।',
    whereToSee: 'সুন্দরবন-সংলগ্ন মোহনা-চর ও উপকূলীয় মাছ-হাটে; জরিপ-নমুনায়।',
    season: 'সারাবছর; বর্ষা-জোয়ারে কাদা-চরে বেশি দেখা যায়।',
    sizeOrHeight: '১২–১৮ সেন্টিমিটার (সর্বোচ্চ ২০–২২ সেমি)',
    ecologicalRole: 'কাদা-তলের ডেট্রিটাস-পুনর্চক্রণকারী ও বায়ু-চলাচলকারী (bioturbator); বড় মাছ-পাখির শিকার।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC); IUCN Bangladesh ২০১৫-তেও LC (#250)।',
    threats: 'মোহনা-ভরাট, কাদা-দূষণ, প্লাস্টিক-জমা, তীর-প্রতিরক্ষা-নির্মাণ, প্রবাহ-বাধা।',
    conservationActions: 'কাদা-চর-সংরক্ষণ, দূষণ-নিয়ন্ত্রণ, ম্যানগ্রোভ-সুরক্ষা, জনসংখ্যা-মনিটরিং।',
    colorTags: ['#d8b8a8', '#9c7a6c', '#f0e4dc'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Trypauchen_vagina.png',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Trypauchen vagina.png')],
  },
]
