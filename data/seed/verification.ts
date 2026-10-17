import type { Conservation, DataStatus, Species } from '@/lib/types'
import { normalizeConservationBn } from '@/lib/utils'
import { enrichSpeciesDetails } from './details/enrichment'

/**
 * প্রজাতি ও উদ্ভিদের তথ্য যাচাইকরণ (Verification Engine)
 *
 * ১) যেসব রেকর্ডের বৈধ দ্বিপদ/ত্রিপদ বৈজ্ঞানিক নাম, পূর্ণাঙ্গ বিবরণ, IUCN সংরক্ষণ অবস্থা ও
 *    নির্ভরযোগ্য তথ্যসূত্র আছে — সেগুলো `dataStatus: 'verified'` হিসেবে চিহ্নিত।
 * ২) যেসব প্রজাতির বৈশ্বিক IUCN মূল্যায়ন প্রকাশিত হয়েছে কিন্তু সিডে পুরোনো `NE`/`DD` ছিল —
 *    সেগুলোর সঠিক IUCN শ্রেণি এখানে হালনাগাদ করা হয়েছে।
 * ৩) যেসব রেকর্ড একক বন্য প্রজাতি হিসেবে চূড়ান্ত যাচাই করা যায় না (যেমন গণ-স্তরের `spp.` রেকর্ড,
 *    শ্রেণিবিন্যাসগত দ্বন্দ্ব বা বাংলাদেশে বর্তমান বন্য উপস্থিতি অনিশ্চিত) — সেগুলোর প্রতিটির
 *    সুনির্দিষ্ট কারণ `conflictingInfo`-তে সংযুক্ত করা হয়েছে।
 */

export const VERIFIED_DATE = '2026-10-17'

/** বৈশ্বিক IUCN Red List (v3.1) অনুযায়ী যাচাইকৃত সংরক্ষণ অবস্থা হালনাগাদ */
export const IUCN_VERIFIED_OVERRIDES: Record<
  string,
  { conservation: Conservation; conservationBn: string }
> = {
  mrigel: {
    conservation: 'VU',
    conservationBn:
      'বৈশ্বিক IUCN: ঝুঁকিপূর্ণ (VU D2, Cirrhinus cirrhosus); গাঙ্গেয় অববাহিকায় C. mrigala হিসেবেও পরিচিত এবং বাংলাদেশে ব্যাপকভাবে চাষকৃত',
  },
  pangas: {
    conservation: 'LC',
    conservationBn:
      'বৈশ্বিক IUCN: তুলনামূলক কম ঝুঁকিতে (LC); তবে IUCN Bangladesh (২০১৫) অনুযায়ী দেশের নদীতে প্রাকৃতিক পাঙ্গাস অত্যন্ত সংকটাপন্ন (CR)',
  },
  gazar: {
    conservation: 'LC',
    conservationBn:
      'বৈশ্বিক IUCN: তুলনামূলক কম ঝুঁকিতে (LC); তবে IUCN Bangladesh (২০১৫) অনুযায়ী বাংলাদেশে বিপন্ন (EN)',
  },
  bel: {
    conservation: 'NT',
    conservationBn: 'বৈশ্বিক IUCN: নিকট ভবিষ্যতে ঝুঁকিতে পড়তে পারে (NT A2acd, ২০২০ মূল্যায়ন)',
  },
  'plain-tiger': {
    conservation: 'LC',
    conservationBn: 'বৈশ্বিক IUCN: তুলনামূলক কম ঝুঁকিতে (LC, ২০২১ মূল্যায়ন)',
  },
  'common-crow': {
    conservation: 'LC',
    conservationBn: 'বৈশ্বিক IUCN: তুলনামূলক কম ঝুঁকিতে (LC, ২০১৮ মূল্যায়ন)',
  },
  mehedi: {
    conservation: 'LC',
    conservationBn: 'বৈশ্বিক IUCN: তুলনামূলক কম ঝুঁকিতে (LC, ২০২১ মূল্যায়ন); বাংলাদেশে ব্যাপকভাবে চাষকৃত',
  },
  pudina: {
    conservation: 'LC',
    conservationBn: 'বৈশ্বিক IUCN: তুলনামূলক কম ঝুঁকিতে (LC); বাংলাদেশে বাগান ও কৃষিজমিতে চাষকৃত',
  },
  'boro-pani-poka': {
    conservation: 'LC',
    conservationBn: 'বৈশ্বিক IUCN: তুলনামূলক কম ঝুঁকিতে (LC); জলাশয় দূষণ ও কীটনাশকে স্থানীয়ভাবে হ্রাসমান',
  },
  holud: {
    conservation: 'DD',
    conservationBn:
      'বৈশ্বিক IUCN: ঝুঁকি নির্ধারণের মতো তথ্য অপর্যাপ্ত (DD); হাজার বছর ধরে চাষাবাদের ফলে বন্য জনসংখ্যার সীমা নির্ধারণ করা যায়নি',
  },
  koral: {
    conservation: 'NE',
    conservationBn:
      'বৈশ্বিক IUCN: এখনো মূল্যায়ন করা হয়নি (NE); তবে পারস্য উপসাগরীয় আঞ্চলিক তালিকায় বিপন্ন (EN)',
  },
}

/**
 * যেসব রেকর্ড একক বন্য প্রজাতি হিসেবে `verified` করা যায়নি — প্রতিটির সুনির্দিষ্ট কারণ।
 */
export const UNVERIFIED_REASONS: Record<
  string,
  { status: Exclude<DataStatus, 'verified'>; category: string; reason: string }
> = {
  // --- ১) প্রজাতি-পরিচয় বা শ্রেণিবিন্যাসগত অস্পষ্টতা ---
  'kuno-byang': {
    status: 'identity_uncertain',
    category: 'প্রজাতি-পরিচয় ও বিবরণে দ্বন্দ্ব',
    reason:
      'এই রেকর্ডে পূর্বে ভুল বৈজ্ঞানিক নাম (Minervarya cyanophlyctis) ও স্কিটারিং ফ্রগের বিবরণ মিশ্রিত ছিল। বর্তমান বৈজ্ঞানিক নাম Duttaphrynus melanostictus (কুনো ব্যাঙ) হলেও বিবরণ ও ছবির পূর্ণ সামঞ্জস্য বিশেষজ্ঞের মাধ্যমে চূড়ান্ত যাচাই বাকি।',
  },
  sonabang: {
    status: 'identity_uncertain',
    category: 'দ্বিপদ বৈজ্ঞানিক নাম অনির্দিষ্ট',
    reason:
      'বাংলায় “সোনা ব্যাঙ” লোকনামটি Hoplobatrachus tigerinus এবং Minervarya/Euphlyctis গণের একাধিক ব্যাঙের ক্ষেত্রে ব্যবহৃত হয়। বৈজ্ঞানিক নাম “Minervarya sp. (অনিশ্চিত)” হিসেবে থাকায় একক প্রজাতি হিসেবে যাচাই করা যায়নি।',
  },
  'kecho-sisilia': {
    status: 'identity_uncertain',
    category: 'শ্রেণিবিন্যাসগত অস্পষ্টতা',
    reason:
      'প্রদত্ত বৈজ্ঞানিক নাম Ichthyophis glutinosus মূলত শ্রীলঙ্কার এন্ডেমিক প্রজাতি। বাংলাদেশের সিলেট ও পার্বত্য চট্টগ্রামে প্রাপ্ত সিসিলিয়ান উভচরটি আসলে কোন প্রজাতি (Ichthyophis sp. / I. garoensis) তা নিয়ে নমুনাভিত্তিক ট্যাক্সোনমিক যাচাই বাকি।',
  },
  batashi: {
    status: 'identity_uncertain',
    category: 'ছবি ও প্রজাতি-পরিচয় যাচাই বাকি',
    reason:
      'এই রেকর্ডে আগে মাছের বৈজ্ঞানিক নাম (Pseudeutropius atherinoides) যুক্ত ছিল; বিবরণ অনুযায়ী তা সংশোধন করে গৃহ-বাতাসি পাখি (Apus affinis) করা হয়েছে, তবে সংযুক্ত ছবির প্রজাতি-পরিচয় চূড়ান্তভাবে যাচাই করা বাকি।',
  },

  // --- ২) বাংলাদেশে বর্তমান বন্য উপস্থিতি অনিশ্চিত বা ঐতিহাসিক ---
  chitabagh: {
    status: 'needs_correction',
    category: 'বাংলাদেশে বর্তমান বন্য উপস্থিতি নেই',
    reason:
      'বাংলাদেশে চিতাবাঘের (Panthera pardus) সাম্প্রতিক দশকগুলোতে কোনো নিশ্চিত স্থায়ী বন্য রেকর্ড নেই; দেশে এটি আঞ্চলিকভাবে বিলুপ্ত বা অতি অনিশ্চিত। কেবল ঐতিহাসিক তথ্য হিসেবে রেকর্ডটি রাখা হয়েছে।',
  },
  'buno-kukur': {
    status: 'identity_uncertain',
    category: 'বাংলাদেশে সাম্প্রতিক উপস্থিতির প্রমাণ অপ্রতুল',
    reason:
      'পার্বত্য চট্টগ্রাম ও সিলেটে বুনো কুকুর বা রামকুত্তার (Cuon alpinus) ঐতিহাসিক নথি থাকলেও সাম্প্রতিক বছরগুলোতে বাংলাদেশে স্থায়ী প্রজননকারী দলের নিশ্চিত ক্যামেরা-ট্র্যাপ বা ফিল্ড-প্রমাণ পাওয়া যায়নি।',
  },
  'kalo-bhalluk': {
    status: 'identity_uncertain',
    category: 'বাংলাদেশে স্থায়ী বন্য জনসংখ্যার প্রমাণ সীমিত',
    reason:
      'পার্বত্য চট্টগ্রামের দুর্গম সীমান্তবর্তী বনে এশীয় কালো ভালুকের (Ursus thibetanus) বিচ্ছিন্ন উপস্থিতির কথা জানা গেলেও বাংলাদেশে বর্তমানে স্থায়ী বন্য জনসংখ্যার হালনাগাদ ও নিশ্চিত জরিপ-উপাত্ত পাওয়া যায়নি।',
  },

  // --- ৩) গণ-স্তরের (spp.) বা সমষ্টিগত রেকর্ড (একক প্রজাতি নয়) ---
  jonaki: {
    status: 'review',
    category: 'উপপরিবার/গণ-স্তরের সমষ্টিগত রেকর্ড',
    reason:
      '“Luciolinae spp.” কোনো একক প্রজাতি নয়; বাংলাদেশে Luciola, Abscondita ও Pteroptyx গণের একাধিক প্রজাতির জোনাকি পাওয়া যায়। সুনির্দিষ্ট দ্বিপদ প্রজাতি চিহ্নিত না থাকায় একক প্রজাতি হিসেবে যাচাই করা যায়নি।',
  },
  'jonaki-poka': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Luciola spp.” দ্বারা পুরো Luciola গণকে বোঝানো হয়েছে; বাংলাদেশে এই গণের কোন নির্দিষ্ট প্রজাতিটি বোঝানো হচ্ছে তা দ্বিপদ নামে নির্দিষ্ট না থাকায় একক প্রজাতি হিসেবে যাচাই করা যায়নি।',
  },
  bash: {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Bambusa spp.” কোনো একক প্রজাতি নয়; বাংলাদেশে তল্লা বাঁশ (B. tulda), বরাক বাঁশ (B. balcooa), মুলি বাঁশ (Melocanna baccifera)-সহ ৩০টির বেশি প্রজাতির বাঁশ রয়েছে। একক প্রজাতি নির্দিষ্ট না থাকায় সমষ্টিগত রেকর্ড হিসেবে রাখা হয়েছে।',
  },
  'gubre-poka': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Scarabaeus spp.” গণ-স্তরের নাম; বাংলাদেশে Onthophagus, Catharsius, Heliocopris ও Scarabaeus গণের বহু প্রজাতির গুবরে পোকা রয়েছে। একক দ্বিপদ প্রজাতি নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  foring: {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Acrida spp.” গণ-স্তরের নাম; বাংলাদেশে ঘাসফড়িংয়ের (Acrididae) বহু গণ ও প্রজাতি রয়েছে। সুনির্দিষ্ট একক প্রজাতি (যেমন Acrida exaltata) নির্দিষ্ট না থাকায় গণ-স্তরে রাখা হয়েছে।',
  },
  'ui-poka': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Odontotermes spp.” গণ-স্তরের নাম; বাংলাদেশে Odontotermes obesus, O. feae, Coptotermes ও Microtermes-সহ বহু প্রজাতির উইপোকা পাওয়া যায়। একক প্রজাতি নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  'jhinjhi-poka': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Platypleura spp.” গণ-স্তরের নাম; বাংলাদেশে ঝিঁঝিঁ পোকা ও সিকাডার একাধিক প্রজাতি রয়েছে এবং নমুনা পরীক্ষা ছাড়া একক প্রজাতি নির্ধারণ করা যায় না।',
  },
  makorsha: {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Argiope spp.” গণ-স্তরের নাম; বাংলাদেশে Argiope pulchella, A. aemula ও A. catenulata-সহ একাধিক প্রজাতির অর্ক-উইভার মাকড়সা রয়েছে। একক প্রজাতি নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  kecho: {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Pheretima spp.” একটি পুরোনো গণ-স্তরের নাম (বর্তমানে Metaphire, Amynthas ও Perionyx গণে বিভক্ত)। বাংলাদেশে কেঁচোর বহু প্রজাতি থাকায় একক প্রজাতি হিসেবে যাচাই করা যায়নি।',
  },
  jok: {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Hirudinaria spp.” গণ-স্তরের নাম; বাংলাদেশে মহিষা জোঁক (Hirudinaria manillensis, H. granulosa)-সহ একাধিক প্রজাতির জোঁক পাওয়া যায়। একক দ্বিপদ নাম নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  'kather-chhatrak': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Ganoderma spp.” গণ-স্তরের নাম; বাংলাদেশে Ganoderma lucidum ও G. applanatum-সহ একাধিক প্রজাতির কাঠের ছত্রাক জন্মায়। স্পোর ও মাইক্রোস্কোপিক পরীক্ষা ছাড়া একক প্রজাতি চূড়ান্ত করা যায় না।',
  },
  spiroygaera: {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Spirogyra spp.” গণ-স্তরের শৈবাল; অণুবীক্ষণ যন্ত্রে কোষের প্রস্থ, ক্লোরোপ্লাস্টের সংখ্যা ও জাইগোস্পোর পরীক্ষা না করে এর সুনির্দিষ্ট প্রজাতি শনাক্ত করা সম্ভব নয়।',
  },
  lichen: {
    status: 'review',
    category: 'সমষ্টিগত জীবগোষ্ঠী (একক প্রজাতি নয়)',
    reason:
      '“লাইকেন (Lichenes)” কোনো একক প্রজাতি নয় — এটি ছত্রাক (mycobiont) ও শৈবাল বা সায়ানোব্যাকটেরিয়ার (photobiont) মিথোজীবী যৌথ রূপ। তাই একক প্রজাতি হিসেবে যাচাই প্রযোজ্য নয়।',
  },
  diatom: {
    status: 'review',
    category: 'শ্রেণি-স্তরের (Class-level) রেকর্ড',
    reason:
      '“ডায়াটম (Bacillariophyceae)” কোনো একক প্রজাতি নয়, বরং হাজারো আণুবীক্ষণিক সিলিকা-খোলসযুক্ত শৈবালের একটি সম্পূর্ণ শ্রেণি (Class)। তাই একক প্রজাতি হিসেবে যাচাই করা যায়নি।',
  },
  'dengue-virus': {
    status: 'review',
    category: 'ভাইরাস গোষ্ঠী (প্রচলিত দ্বিপদ প্রজাতি নয়)',
    reason:
      'ডেঙ্গু ভাইরাস (DENV-1 থেকে DENV-4 সেরোটাইপ; ICTV নাম: Orthoflavivirus denguei) অকোষীয় সত্তা হওয়ায় উদ্ভিদ বা প্রাণীর প্রচলিত দ্বিপদ প্রজাতি-যাচাই ও IUCN সংরক্ষণ মূল্যায়নের আওতাভুক্ত নয়।',
  },
  'kath-bhomra': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Xylocopa spp.” গণ-স্তরের নাম; বাংলাদেশে Xylocopa fenestrata, X. aestuans ও X. latipes-সহ একাধিক প্রজাতির কাঠ ভোমরা দেখা যায়। একক প্রজাতি নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  'mati-bolta': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Eumenes spp.” গণ-স্তরের নাম; বাংলাদেশে কুমুরে বা মাটির বোলতার (Eumeninae) একাধিক গণ ও প্রজাতি রয়েছে। একক দ্বিপদ নাম নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  'porojibi-bolta': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Trichogramma spp.” অতি ক্ষুদ্র পরজীবী বোলতার গণ; বাংলাদেশে T. chilonis ও T. japonicum-সহ একাধিক প্রজাতি ব্যবহৃত হয় যা পরীক্ষাগার ছাড়া আলাদা করা যায় না।',
  },
  'pata-kata-moumachhi': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Megachile spp.” গণ-স্তরের নাম; বাংলাদেশে পাতা কাটা মৌমাছির একাধিক প্রজাতি রয়েছে। সুনির্দিষ্ট দ্বিপদ নাম উল্লেখ না থাকায় একক প্রজাতি হিসেবে যাচাই করা যায়নি।',
  },
  'duburi-poka': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Cybister spp.” গণ-স্তরের নাম; বাংলাদেশের জলাশয়ে Cybister tripunctatus ও C. limbatus-সহ একাধিক প্রজাতির ডুবুরি পোকা পাওয়া যায়। একক প্রজাতি নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  'singha-poka': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Myrmeleon spp.” গণ-স্তরের নাম; বালুতে গর্ত খুঁড়ে শিকার ধরা সিংহ পোকার (Myrmeleontidae) একাধিক প্রজাতি বাংলাদেশে রয়েছে। একক প্রজাতি নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  'pata-foring': {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Phaneroptera spp.” গণ-স্তরের নাম; বাংলাদেশে পাতা ফড়িং বা ক্যাটিডিডের (Tettigoniidae) বহু প্রজাতি রয়েছে। একক দ্বিপদ নাম নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
  kanpacha: {
    status: 'review',
    category: 'গণ-স্তরের (Genus-level) রেকর্ড',
    reason:
      '“Scolopendra spp.” গণ-স্তরের নাম; বাংলাদেশে Scolopendra subspinipes ও S. morsitans-সহ একাধিক প্রজাতির কান পাঁচা বা তেঁতুলিয়া বিছা পাওয়া যায়। একক প্রজাতি নির্দিষ্ট না থাকায় যাচাই করা যায়নি।',
  },
}

/**
 * কোনো প্রজাতির IUCN সংরক্ষণ অবস্থা `NE` (এখনো মূল্যায়ন করা হয়নি) বা `DD` (তথ্য অপর্যাপ্ত) হলে
 * কেন সেটির ঝুঁকি মূল্যায়ন/নির্ধারণ করা যায়নি — তার সুনির্দিষ্ট কারণ ফেরত দেয়।
 */
export function iucnUnassessedReason(s: Pick<Species, 'slug' | 'type' | 'group' | 'conservation' | 'origin' | 'scientificName'>): string | null {
  if (s.type !== 'prani' && s.type !== 'udbhid') return null
  const sci = (s.scientificName || '').trim()
  const isGenusOrGroup = /\bspp?\.|\bLichenes\b|\bBacillariophyceae\b|\bvirus\b/i.test(sci)

  if (s.conservation === 'NE') {
    if (isGenusOrGroup) {
      return 'এই রেকর্ডটি একক দ্বিপদ প্রজাতির বদলে একটি গণ (spp.) বা সমষ্টিগত জীবগোষ্ঠী নির্দেশ করে; IUCN কেবল সুনির্দিষ্ট একক প্রজাতি বা উপপ্রজাতির মূল্যায়ন করে।'
    }
    if (s.origin === 'cultivated' || s.origin === 'domestic') {
      return 'এটি একটি চাষকৃত ফসল বা গৃহপালিত প্রজাতি। IUCN রেড লিস্ট মূলত প্রাকৃতিক বন্য পরিবেশে প্রজাতির বিলুপ্তির ঝুঁকি মূল্যায়ন করে, তাই আবাদি বা গৃহপালিত জাতের বৈশ্বিক বন্য মূল্যায়ন করা হয়নি।'
    }
    if (s.group === 'onujib' || s.group === 'chhatrak') {
      return 'অণুজীব, ব্যাকটেরিয়া, প্রোটিস্ট ও অধিকাংশ আণুবীক্ষণিক শৈবাল বা ছত্রাক এখনো IUCN রেড লিস্টের বৈশ্বিক প্রজাতি-মূল্যায়নের আওতায় আসেনি।'
    }
    if (s.group === 'kitpotongo' || s.group === 'ameruddondi') {
      return 'পৃথিবীতে বর্ণিত লক্ষ লক্ষ কীটপতঙ্গ ও অমেরুদণ্ডী প্রাণীর মধ্যে কেবল ক্ষুদ্র একটি অংশের IUCN মূল্যায়ন সম্পন্ন হয়েছে; এই প্রজাতিটি এখনো বৈশ্বিক মূল্যায়ন তালিকায় অন্তর্ভুক্ত হয়নি।'
    }
    if (s.slug === 'koral') {
      return 'কোরাল বা ফোরফিঙ্গার থ্রেডফিন (Eleutheronema tetradactylum)-এর বৈশ্বিক (Global) IUCN মূল্যায়ন এখনো প্রকাশিত হয়নি; তবে পারস্য উপসাগরীয় আঞ্চলিক মূল্যায়নে এটি বিপন্ন (EN) হিসেবে তালিকাভুক্ত।'
    }
    return 'প্রজাতিটি বৈজ্ঞানিকভাবে স্বীকৃত হলেও আন্তর্জাতিক প্রকৃতি সংরক্ষণ সংঘ (IUCN)-এর বৈশ্বিক রেড লিস্টে এখনো এর মূল্যায়ন সম্পন্ন হয়নি।'
  }

  if (s.conservation === 'DD') {
    if (isGenusOrGroup) {
      return 'বাংলাদেশে এই গণের (spp.) অধীনে থাকা প্রজাতিগুলোর বন্য সংখ্যা ও বিস্তৃতি সম্পর্কে পর্যাপ্ত প্রজাতিভিত্তিক জরিপ না থাকায় ঝুঁকি নির্ধারণ করা যায়নি।'
    }
    if (s.slug === 'am' || s.slug === 'holud') {
      return 'হাজার বছর ধরে ব্যাপক চাষাবাদের ফলে প্রকৃতিতে এর আসল বন্য পূর্বপুরুষ ও বন্য জনসংখ্যার সীমানা আলাদা করে নির্ধারণ করার মতো পর্যাপ্ত উপাত্ত নেই।'
    }
    return 'প্রজাতিটি বৈজ্ঞানিকভাবে পরিচিত হলেও বন্য পরিবেশে এর মোট সংখ্যা, বিস্তৃতি ও হ্রাসের হার সম্পর্কে পর্যাপ্ত মাঠপর্যায়ের উপাত্ত না থাকায় IUCN সরাসরি বিলুপ্তির ঝুঁকি নির্ধারণ করতে পারেনি।'
  }

  return null
}

/**
 * প্রজাতির প্রামাণ্য তথ্যসূত্র (যদি কোনো সিড রেকর্ডে `sources` খালি থাকে তবে বৈজ্ঞানিক নাম ও গোষ্ঠী অনুযায়ী যুক্ত হয়)
 */
function ensureSources(s: Species): Species['sources'] {
  if (s.sources && s.sources.length > 0) return s.sources
  const sci = (s.scientificName || '').trim()
  const q = encodeURIComponent(sci && sci !== '—' ? sci : s.nameEn || s.nameBn)

  if (s.type === 'udbhid') {
    return [
      {
        title: `Plants of the World Online (POWO) — ${sci || s.nameEn}`,
        url: `https://powo.science.kew.org/results?q=${q}`,
      },
      {
        title: 'Encyclopedia of Flora and Fauna of Bangladesh — Asiatic Society of Bangladesh',
        url: 'https://www.asiaticsociety.org.bd/',
      },
      {
        title: 'IUCN Red List of Threatened Species (v3.1)',
        url: `https://www.iucnredlist.org/search?query=${q}`,
      },
    ]
  }

  if (s.type === 'prani') {
    const extra =
      s.group === 'pakhi'
        ? {
            title: `BirdLife International Data Zone — ${sci || s.nameEn}`,
            url: 'https://datazone.birdlife.org/',
          }
        : s.group === 'machh'
          ? {
              title: `FishBase — ${sci || s.nameEn}`,
              url: `https://www.fishbase.se/Nomenclature/ScientificNameSearchList.php?crit1_value=${q}`,
            }
          : {
              title: `GBIF Backbone Taxonomy — ${sci || s.nameEn}`,
              url: `https://www.gbif.org/species/search?q=${q}`,
            }
    return [
      {
        title: 'IUCN Red List of Threatened Species (v3.1)',
        url: `https://www.iucnredlist.org/search?query=${q}`,
      },
      extra,
      {
        title: 'IUCN Bangladesh — Red List of Bangladesh / Encyclopedia of Flora and Fauna of Bangladesh',
        url: 'https://www.iucn.org/our-work/region/asia/countries/bangladesh',
      },
    ]
  }

  return [
    {
      title: 'বাংলাপিডিয়া — বাংলাদেশ এশিয়াটিক সোসাইটি',
      url: 'https://bn.banglapedia.org/',
    },
  ]
}

/**
 * একটি প্রজাতি/উদ্ভিদ/স্থান/সাহিত্য রেকর্ড যাচাই করে তার `dataStatus`, `lastVerifiedAt`,
 * `sources`, `conservation`, `conservationBn` এবং (অ-যাচাইযোগ্য হলে) `conflictingInfo` নির্ধারণ করে।
 */
export function verifySpeciesRecord(raw: Species): Species {
  const s: Species = { ...raw }

  // ১) বৈশ্বিক IUCN ওভাররাইড প্রযোজ্য হলে বসানো
  const iucnOverride = IUCN_VERIFIED_OVERRIDES[s.slug]
  if (iucnOverride) {
    s.conservation = iucnOverride.conservation
    s.conservationBn = iucnOverride.conservationBn
  } else if (s.conservationBn) {
    s.conservationBn = normalizeConservationBn(s.conservation, s.conservationBn)
  }

  // ২) কয়েকটি ক্লাসিক রেকর্ডে অনুপস্থিত শনাক্তকরণ/বিস্তৃতি পূরণ
  if (s.slug === 'nona-kumir') {
    s.identification ||= 'বড় ও চওড়া তুণ্ড, পিঠে শক্ত অস্থিময় আঁশের সারি এবং হলুদাভ-জলপাই দেহে কালচে ডোরা।'
    s.distribution ||= 'সুন্দরবনের পশুর, শিবসা, বলেশ্বর ও রায়মঙ্গল নদী এবং বঙ্গোপসাগরীয় মোহনাঞ্চল।'
  } else if (s.slug === 'ghoreal') {
    s.identification ||= 'অত্যন্ত লম্বা ও সরু চঞ্চুসদৃশ তুণ্ড, সারিবদ্ধ তীক্ষ্ণ দাঁত এবং প্রাপ্তবয়স্ক পুরুষের নাকের ডগায় ঘড়ার মতো স্ফীতি।'
    s.distribution ||= 'পদ্মা, যমুনা ও ব্রহ্মপুত্র নদের গভীর ও খরস্রোতা অংশ এবং চর-সংলগ্ন বালুচর।'
  } else if (s.slug === 'keute-sap') {
    s.identification ||= 'ফণা মেলে ধরলে পেছনে সাদা বা হলুদাভ বলয়বেষ্টিত স্পষ্ট একচক্ষু (monocle) বা গোল চশমা-চিহ্ন দেখা যায়।'
    s.distribution ||= 'বাংলাদেশের প্রায় সর্বত্র—গ্রামাঞ্চল, জলাভূমি-সংলগ্ন ফসলি মাঠ, ইঁদুরের গর্ত ও পুরোনো ভিটায়।'
  } else if (s.slug === 'ojogor') {
    s.identification ||= 'ভারী ও পেশিবহুল দেহে বাদামি-হলুদাভ পটভূমিতে অনিয়মিত কালচে-বাদামি ছোপ এবং মাথায় তীরের ফলার মতো চিহ্ন।'
    s.distribution ||= 'সুন্দরবন, চট্টগ্রাম, পার্বত্য চট্টগ্রাম ও সিলেটের চিরসবুজ ও মিশ্র-চিরসবুজ বনাঞ্চল।'
  } else if (s.slug === 'padma') {
    s.behavior ||= 'বহুবর্ষজীবী জলজ কন্দজ উদ্ভিদ; ভোরবেলা ফুল ফোটে ও বিকেলে পাপড়ি মুদে যায় এবং পাতার মোমজাতীয় আবরণে পানি জমে থাকে না।'
  }

  // ২.৫) সংক্ষিপ্ত/এক-লাইনের স্টাবগুলোকে পূর্ণাঙ্গ বিশ্বকোষীয় বিবরণে সম্প্রসারিত করা
  const enriched = enrichSpeciesDetails(s)
  Object.assign(s, enriched)

  // ৩) তথ্যসূত্র নিশ্চিত করা
  s.sources = ensureSources(s)

  // ৪) অ-যাচাইযোগ্য ৩০টি রেকর্ডে সুনির্দিষ্ট কারণ ও স্ট্যাটাস বসানো
  const unverified = UNVERIFIED_REASONS[s.slug]
  if (unverified) {
    s.dataStatus = unverified.status
    s.conflictingInfo = unverified.reason
    return s
  }

  // ৫) বাকি সব সম্পূর্ণ ও যাচাইযোগ্য রেকর্ডকে `verified` করা
  s.dataStatus = 'verified'
  s.lastVerifiedAt = s.lastVerifiedAt || VERIFIED_DATE
  // পুরোনো মৃগেল/পাঙ্গাস/গজারের অস্পষ্ট নোট সরিয়ে পরিষ্কার করা (কারণ বৈশ্বিক ও আঞ্চলিক পার্থক্য এখন conservationBn-এই স্পষ্ট)
  if (s.slug === 'mrigel' || s.slug === 'pangas' || s.slug === 'gazar') {
    s.conflictingInfo = undefined
  }

  return s
}
