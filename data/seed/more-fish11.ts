import type { Species } from '@/lib/types'
import { IUCN, IUCN_BD, GBIF, FISH_BD } from './sources'

/**
 * মাছ সম্প্রসারণ — ব্যাচ ১০ (২০২৬-১০-২৭): ১টি মোহনা/ধানক্ষেত-রাইসফিশ
 *
 * লক্ষ্যভিত্তি: IUCN Red List of Bangladesh (2015)-এর ২৫৩ মিঠাপানি-
 * প্রজাতি; ব্যাচ-পূর্বে সাইটে মাছ ছিল ১৭৩ (২৫৩-লক্ষ্যের ৬৮%)।
 * ব্যাচ ৯-এর পদ্ধতিগত ডিফের ওপর ভিত্তি করে অবশিষ্ট অনুপস্থিত
 * প্রজাতিগুলো আবার দুই পথে (পূর্ণ-টেক্সট search API + প্রজাতি-
 * নামের বিভিন্ন প্রতিশব্দ-রূপ) যাচাই করা হয়; ৭টি স্ক্রিনিং-ঢেউয়ে
 * ৪০+ নাম-অনুসন্ধান চালানো হলে মাত্র ১টি নতুন প্রজাতিতে
 * গ্রহণযোগ্য মুক্ত লাইসেন্সের আধুনিক বৈজ্ঞানিক-চিত্র পাওয়া যায়।
 *
 * গুরুত্বপূর্ণ সিদ্ধান্ত: (১) Gymnostomus ariza-র ২০২২ সালের
 * CC BY-SA 4.0 আধুনিক আলোকচিত্র (Beta Mahatvaraj) প্রথমে
 * গৃহীত-প্রার্থী মনে হলেও দেখা যায় ব্যাচ ২-এর more-fish3.ts-এ
 * slug 'ariza-carp' (nameBn ভাঙনা মাছ, বৈজ্ঞানিক-নাম Cirrhinus
 * ariza)-এ ঠিক একই ফাইলসহ প্রজাতিটি আগেই সাইটে আছে — ডুপ-এড
 * হয়নি (লেগ্যাসি-প্রতিশব্দ-শৃঙ্খল; ২৫৩-তালিকা #112 VU-র কভারেজ
 * ব্যাচ ২ থেকেই বিদ্যমান); (২) Oryzias dancena-র দুটি নতুন
 * CC BY 2.5 ফাইলের একটিতে (Adult male, pageid 177371020)
 * Commons ক্যাটাগরি “Images with watermarks” থাকায় বর্জিত;
 * অপর ফাইলটি (Illustration, pageid 177371019) ওয়াটারমার্ক-
 * বিহীন এবং Takehana et al.-এর medaka ফাইলোজিনি গবেষণাপত্রের
 * আধুনিক বৈজ্ঞানিক-চিত্র — ব্যাচ ৭ (PLOS ONE Devario) ও
 * ব্যাচ ৯ (ZooKeys Chela)-এর জার্নাল-চিত্র নজিরে গৃহীত;
 * (৩) “Bain fish.jpg” (CC BY-SA 4.0, 2017) “Unidentified
 * Actinopterygii”-ক্যাটাগরিভুক্ত ও প্রজাতি-নির্ণয়হীন — বর্জিত;
 * (৪) Ailia coila/punctata, Schistura savona, Gagata cenia,
 * Nangra bucculenta/ornata, Salmostoma sardinella, Puntius
 * puntio, Mystus armatus, Silonia silondia, Eutropiichthys
 * murius, Pethia phutunio, Thryssa purava, Apocryptes bato,
 * Taenioides buchanani, Chagunius chagunio, Crossocheilus
 * latius, Megarasbora elanga, Macrognathus aculeatus,
 * Nematalosa nasus, Rasbora rasbora, Odontamblyopus
 * rubicundus, Canthophrys gongota, Pseudambassis lala,
 * Securicula gora, Gogangra viridescens, Salmostoma
 * acinaces, Cynoglossus lingua প্রভৃতিতে শুধু Day/Mintern/
 * Achilles/Ford/Suzini প্লেট, Iconographia Zoologica-স্ক্যান,
 * ১৮০৭–১৯৩৬ বই-চিত্র বা জার্নাল-PDF পাওয়া যায়;
 * (৫) Gagata youssoufi, Badis chittagongis, Danio annulosus,
 * Pseudolaguvia inornata, Psilorhynchus rahmani,
 * Lepidocephalichthys irrorata, Awaous grammepomus,
 * Nangra bucculenta — শূন্য-হিট; (৬) Brachygobius nunus,
 * Butis melanostigma, Oryzias melastigma, Hara jerdoni,
 * Microphis deocata, Esomus lineatus, Oryzias carnaticus,
 * Amblypharyngodon microlepis — PDF/ভিন্ন-প্রজাতি/প্লেট;
 * (৭) Sicamugil cascasia (#229 VU)-তে নতুন হাই-রেজ ফাইল
 * আসেনি — ১৮০px BioTrek মুলতবি বহাল।
 *
 * লাইসেন্স (১ ফাইল): ১ CC BY 2.5 (Oryzias dancena —
 * Takehana, Naruse, Sakaizumi ও Chen-এর বৈজ্ঞানিক-চিত্র,
 * ১৫৪২×১১২৪)।
 *
 * জাতীয় অবস্থা (bdfish ২৫৩-তালিকা-ক্রমিকসহ): DD ১ (#163)।
 * বৈশ্বিক: LC ১ (IUCN 2019, e.T172326A60603626)।
 *
 * নাম-সতর্কতা: চক্কুনি/কানপোনা/বেচি স্থানীয় নামগুলো
 * Aplocheilus panchax (ব্যাচ ২, slug blue-panchax)-র সাথেও
 * যৌথভাবে প্রচলিত; প্রজাতি দুটি ভিন্ন গণ-পরিবারের
 * (Adrianichthyidae বনাম Aplocheilidae)। nameBn হিসেবে
 * Freshwater Biodiversity Portal of Bangladesh-এর
 * “Chokkuni (চক্কুনি)” বানানটি নেওয়া হয়েছে; বিকল্প
 * বানান/নাম otherNames-এ সংরক্ষিত।
 */
const COMMONS = (file: string): { title: string; url: string; license: string } => ({
  title: 'ছবির মূল ফাইল — Wikimedia Commons',
  url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
  license: 'Wikimedia Commons',
})

export const MORE_FISH11: Species[] = [
  {
    slug: 'indian-ricefish', type: 'prani', group: 'machh', category: 'মাছ',
    nameBn: 'চক্কুনি', nameEn: 'Indian Ricefish', scientificName: 'Oryzias dancena',
    otherNames: ['কানপোনা', 'বেচি', 'চৌক্কুনি', 'Indian blue ricefish', 'Estuarine ricefish', 'Cyprinus dancena', 'Aplocheilus mcclellandi'],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: 'Beloniformes', family: 'Adrianichthyidae', genus: 'Oryzias', species: 'Oryzias dancena' },
    summary: 'মোহনা-ধানক্ষেতের ক্ষুদে রাইসফিশ; বাংলাদেশে চক্কুনি/কানপোনা; Takehana et al.-এর CC BY 2.5 বৈজ্ঞানিক চিত্র; বৈশ্বিক LC, জাতীয় DD (#163)।',
    description:
      'চক্কুনির দেহ ছোট-লম্বাটে-স্বচ্ছ-মুক্তাভ, মাথা সামান্য চ্যাপ্টা ও মুখ তির্যক-ঊর্ধ্ব-মুখী, নিচের চোয়াল খানিক লম্বা; উভয় চোয়ালে এক সারি দাঁত, চোখে হালকা-নীল ধাতব ঝিলিক। আঁশ বড়-গোলাকার (পার্শ্ব-সারিতে ২৭), পার্শ্বরেখা অনুপস্থিত; পৃষ্ঠ-পাখনা দেহের অনেক-পেছনে, পুচ্ছ-পাখনা গোলাকার; পিঠ ফিকে-সবজে-ধূসর, পেট ফ্যাকাশে-সাদা এবং পার্শ্ব-মধ্য দিয়ে সরু-কালচে-ডোরা যা পুচ্ছ-গোড়ায় ফিকে-ফোঁটায় শেষ হয়। দৈর্ঘ্য মাত্র ৩.১–৪ সেমি। উপকূলীয় মোহনা, নদ-মুখ, খাল-বিল ও ধানক্ষেতের উপরি-জলে ভাসমান প্ল্যাঙ্কটন, পতঙ্গ ও লার্ভা খেয়ে বেড়ায়; লবণাক্ততা-সহিষ্ণু (euryhaline)। স্ত্রী ডিমের গুচ্ছ পেট-পাখনার কাছে বহন করে এবং জন্মের মাত্র ~৬০ দিন পরেই নতুন প্রজন্ম প্রজননে সক্ষম। বাংলাদেশ, ভারত, শ্রীলঙ্কা, মিয়ানমার, থাইল্যান্ড ও মালয় উপদ্বীপে বিস্তৃত। অনেক রচনায় Oryzias melastigma নামে ভুল-শনাক্ত হয়েছে; IUCN Bangladesh ২০১৫ দুটিকে আলাদা মূল্যায়ন করেছে (#163 DD, #164 LC)। ব্যবহৃত চিত্রটি Takehana, Naruse, Sakaizumi ও Chen-এর medaka গণের আণবিক-ফাইলোজিনি গবেষণাপত্রের আধুনিক বৈজ্ঞানিক-চিত্র (CC BY 2.5)। বৈশ্বিক IUCN LC (২০১৯); জাতীয় IUCN Bangladesh ২০১৫: DD (#163)।',
    physical: 'দৈর্ঘ্য ৩.১–৪ সেমি; স্বচ্ছ-মুক্তাভ-বেজ লম্বাটে দেহ, তির্যক-ঊর্ধ্ব-মুখ, গোলাকার পুচ্ছ, নীল-ঝিলিক-চোখ।',
    identification: 'পার্শ্বরেখা-অনুপস্থিতি, দেহের পেছনাংশে পৃষ্ঠ-পাখনা ও পার্শ্ব-মধ্যের সরু-কালচে-ডোরা; Aplocheilus panchax-র চেয়ে দেহ সরু ও চ্যাপ্টা-মাথা।',
    diet: 'ভাসমান প্ল্যাঙ্কটন, জলজ পতঙ্গ ও লার্ভা, ক্ষুদে ক্রাস্টেসিয়ান, পতঙ্গ-কণা।',
    behavior: 'উপরি-জলের ঝাঁকপ্রিয়-শান্ত মাছ; ধীর-ভাসমান থেকে হঠাৎ ছোটে; লবণাক্ততার বিস্তৃত-পরিসর সহ্য করে।',
    reproduction: 'স্ত্রী নিষিক্ত ডিমের গুচ্ছ বহন করে গাছপালায় সংযুক্ত করে; প্রজন্ম-ব্যবধান মাত্র ~৬০ দিন; বর্ষায় প্রধান প্রজনন।',
    habitat: 'উপকূলীয় মোহনা, নদ-মুখ, জোয়ার-খাল, ধানক্ষেত, পুকুর ও অগভীর প্লাবনভূমির মিঠা–লোনা মিশ্র জল।',
    distribution: 'বাংলাদেশ (উপকূলীয় অঞ্চলসহ); ভারত, শ্রীলঙ্কা, মিয়ানমার, থাইল্যান্ড, মালয় উপদ্বীপ।',
    whereToSee: 'উপকূলীয় ধানক্ষেত-খাল-মোহনার ক্ষুদে-মাছ-হাট ও মৎস্য-জরিপ-নমুনায়।',
    season: 'প্রজনন প্রধানত বর্ষাকালে (জুন–সেপ্টেম্বর); সারাবছর উপকূলীয় জলে পাওয়া যায়।',
    sizeOrHeight: '৩.১–৪ সেন্টিমিটার',
    ecologicalRole: 'উপরি-জলের প্ল্যাঙ্কটন-পতঙ্গ-নিয়ন্ত্রক ও বৃহৎ মাছ-পাখির ক্ষুদে-শিকার; মশক-লার্ভা ভক্ষণে উপকারী।',
    origin: 'native', conservation: 'LC', conservationBn: 'বৈশ্বিক IUCN: ন্যূনতম বিপদগ্রস্ত (LC, ২০১৯, e.T172326A60603626); IUCN Bangladesh ২০১৫: তথ্য-ঘাটতি (DD, #163) — জাতীয় জনসংখ্যা-উপাত্ত অপ্রতুল।',
    threats: 'মোহনা-ভরাট, ধানক্ষেত-কীটনাশক, শিল্প-লবণাক্ততা-পরিবর্তন, পানি-দূষণ, সূক্ষ্ম-জাল-নিধন, আগাছা-নাশক।',
    conservationActions: 'মোহনা-ধানক্ষেত-জলাভূমি সংরক্ষণ, কীটনাশক-নিয়ন্ত্রণ, জাতীয় জনসংখ্যা-জরিপ (DD→সুনির্দিষ্ট শ্রেণি), নাগরিক-বিজ্ঞান-পর্যবেক্ষণ।',
    colorTags: ['#dfe3dc', '#9fb0a8', '#f6f7f2'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Illustration_of_Oryzias_Dancena_%28Hamilton%2C_1822%29.png',
    dataStatus: 'partial',
    sources: [IUCN, IUCN_BD, GBIF, FISH_BD, COMMONS('Illustration of Oryzias Dancena (Hamilton, 1822).png')],
  },
]
