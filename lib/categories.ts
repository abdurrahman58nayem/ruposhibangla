import type { GroupId, SpeciesType, Species } from './types'

export type Category = {
  id: GroupId
  label: string
  labelEn: string
  /** lucide আইকন নাম */
  icon: string
  /** জ্ঞানভান্ডারের কোন অংশে পড়ে */
  type: SpeciesType | 'content'
  route: string
  hint: string
}

/** ১৭টি প্রধান ক্যাটাগরি — আইকনের পাশে সবসময় বাংলা নাম থাকে */
export const CATEGORIES: Category[] = [
  { id: 'pranijogot', label: 'প্রাণীজগৎ', labelEn: 'Animals', icon: 'PawPrint', type: 'prani', route: '/gyan?group=pranijogot', hint: 'বাংলাদেশের সব বন্যপ্রাণী' },
  { id: 'pakhi', label: 'পাখি', labelEn: 'Birds', icon: 'Bird', type: 'prani', route: '/gyan?group=pakhi', hint: 'দোয়েল, মাছরাঙা, দেশি ও পরিযায়ী পাখি' },
  { id: 'machh', label: 'মাছ', labelEn: 'Fish', icon: 'Fish', type: 'prani', route: '/gyan?group=machh', hint: 'ইলিশ, রুই ও স্বাদু-লোনা জলের মাছ' },
  { id: 'stanapayi', label: 'স্তন্যপায়ী', labelEn: 'Mammals', icon: 'Rat', type: 'prani', route: '/gyan?group=stanapayi', hint: 'বাঘ, হাতি, হরিণ, তিমি ও শুশুক' },
  { id: 'sarisrip', label: 'সরীসৃপ', labelEn: 'Reptiles', icon: 'Bug', type: 'prani', route: '/gyan?group=sarisrip', hint: 'সাপ, কুমির, কচ্ছপ ও গুই' },
  { id: 'ubhochor', label: 'উভচর', labelEn: 'Amphibians', icon: 'Waves', type: 'prani', route: '/gyan?group=ubhochor', hint: 'কুনো ব্যাঙ, গেছো ব্যাঙ ও সালামান্ডার' },
  { id: 'kitpotongo', label: 'কীটপতঙ্গ', labelEn: 'Insects', icon: 'Bug', type: 'prani', route: '/gyan?group=kitpotongo', hint: 'প্রজাপতি, মৌমাছি ও গঙ্গাফড়িং' },
  { id: 'ameruddondi', label: 'অন্যান্য অমেরুদণ্ডী', labelEn: 'Invertebrates', icon: 'Shell', type: 'prani', route: '/gyan?group=ameruddondi', hint: 'শামুক, ঝিনুক, কাঁকড়া ও মাকড়সা' },
  { id: 'udbhidful', label: 'উদ্ভিদ ও ফুল', labelEn: 'Plants & Flowers', icon: 'Flower2', type: 'udbhid', route: '/gyan?group=udbhidful', hint: 'শাপলা, কৃষ্ণচূড়া, ফুল ও লতা' },
  { id: 'gachhbon', label: 'গাছ ও বন', labelEn: 'Trees & Forests', icon: 'TreeDeciduous', type: 'udbhid', route: '/gyan?group=gachhbon', hint: 'সুন্দরী, বট, শাল ও বনজ বৃক্ষ' },
  { id: 'chhatrak', label: 'ছত্রাক ও শৈবাল', labelEn: 'Fungi & Algae', icon: 'Sparkles', type: 'udbhid', route: '/gyan?group=chhatrak', hint: 'মাশরুম, শৈবাল ও লাইকেন' },
  { id: 'onujib', label: 'অণুজীব', labelEn: 'Microbes', icon: 'Microscope', type: 'udbhid', route: '/gyan?group=onujib', hint: 'ব্যাকটেরিয়া, প্রোটিস্ট ও অণুজীব' },
  { id: 'nadi', label: 'নদী ও জলাভূমি', labelEn: 'Rivers & Wetlands', icon: 'Waves', type: 'sthan', route: '/gyan?group=nadi', hint: 'পদ্মা, মেঘনা, হাওর ও রাতারগুল' },
  { id: 'pahar', label: 'পাহাড় ও বনাঞ্চল', labelEn: 'Hills & Forests', icon: 'Mountain', type: 'sthan', route: '/gyan?group=pahar', hint: 'সুন্দরবন, রাঙামাটি ও কাপ্তাই' },
  { id: 'grambangla', label: 'গ্রামবাংলা', labelEn: 'Village Life', icon: 'Home', type: 'content', route: '/grambangla', hint: 'ধানখেত, নৌকো ও গ্রামীণ জীবন' },
  { id: 'sahitto', label: 'প্রকৃতি ও সাহিত্য', labelEn: 'Nature in Literature', icon: 'BookOpen', type: 'sahitto', route: '/sahitto', hint: 'জীবনানন্দ, নজরুল ও রবীন্দ্রনাথের চোখ' },
  { id: 'songrokkhon', label: 'পরিবেশ ও সংরক্ষণ', labelEn: 'Conservation', icon: 'ShieldCheck', type: 'content', route: '/songrokkhon', hint: 'আইইউসিএন রেড লিস্ট ও গবেষণা' },
]

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
)

export function categoryLabel(id?: string): string {
  return (id && CATEGORY_MAP[id]?.label) || 'অন্যান্য'
}

/**
 * প্রজাতির ফ্রি-ফর্ম ক্যাটাগরি নামকে প্রমিত (canonical) রূপ দেয় —
 * বানানভেদ বা বিভক্ত নাম (যেমন: স্তন্যপায়ী/স্তন্যপায়ী/স্তন্যপায়ী প্রাণী, পতঙ্গ/কীটপতঙ্গ) এক করে।
 */
export function normalizeCategoryName(cat?: string, group?: GroupId): string {
  if (!cat) {
    if (group && CATEGORY_MAP[group]) return CATEGORY_MAP[group].label
    return 'অন্যান্য'
  }
  const c = cat.trim().replace(/য়/g, 'য়')
  if (/স্তন্যপা|স্তনপা/.test(c)) return 'স্তন্যপায়ী'
  if (/পাখি|পাখী/.test(c)) return 'পাখি'
  if (/মাছ/.test(c)) return 'মাছ'
  if (/সরীসৃপ|সরিসৃপ/.test(c)) return 'সরীসৃপ'
  if (/উভচর/.test(c)) return 'উভচর'
  if (/পতঙ্গ|কীট/.test(c)) return 'কীটপতঙ্গ'
  if (/অমেরুদণ্ডী|মোলাস্ক|আর্থ্রোপড|ক্রাস্টেশিয়ান/.test(c)) return 'অন্যান্য অমেরুদণ্ডী'
  if (/ঔষধি/.test(c)) return 'ঔষধি গাছ'
  if (/তাল/.test(c)) return 'তাল-জাতীয়'
  if (/ঘাস/.test(c)) return 'ঘাস-জাতীয়'
  if (/বট/.test(c)) return 'বট-জাতীয়'
  if (/ম্যানগ্রোভ/.test(c)) return 'ম্যানগ্রোভ'
  if (/জলজ/.test(c)) return 'জলজ উদ্ভিদ'
  if (/ফুল/.test(c)) return 'ফুল গাছ'
  if (/ফল/.test(c) && !/ফসল/.test(c)) return 'ফল গাছ'
  if (/বন গাছ/.test(c)) return 'বন গাছ'
  if (/ফসল/.test(c)) return 'ফসল'
  if (/শাক|সবজি/.test(c)) return 'শাক-সবজি'
  if (/মসলা/.test(c)) return 'মসলা'
  if (/ছত্রাক/.test(c)) return 'ছত্রাক'
  if (/শৈবাল/.test(c)) return 'শৈবাল'
  if (/লাইকেন/.test(c)) return 'লাইকেন'
  if (/অণুজীব|ব্যাকটেরিয়া|ব্যাকটেরিয়া/.test(c)) return 'অণুজীব'
  if (/নদী/.test(c)) return 'নদী'
  if (/জলাভূমি|হাওর|বিল|জলাবন/.test(c)) return 'জলাভূমি'
  if (/পাহাড়|পাহাড়/.test(c)) return 'পাহাড়'
  if (/বন|বনাঞ্চল/.test(c)) return 'বনাঞ্চল'
  return cat.trim()
}

/** ক্যাটাগরি অনুযায়ী বিস্তারিত পাতার পাথ */
export function speciesPath(s: { type: SpeciesType; slug: string }): string {
  if (s.type === 'prani') return `/prani/${s.slug}`
  if (s.type === 'udbhid') return `/udbhid/${s.slug}`
  if (s.type === 'sthan') return `/sthan/${s.slug}`
  return `/sahitto/${s.slug}`
}

export function typeLabel(t: SpeciesType): string {
  return t === 'prani' ? 'প্রাণী' : t === 'udbhid' ? 'উদ্ভিদ' : t === 'sthan' ? 'স্থান' : 'সাহিত্য'
}

/** সামুদ্রিক স্তন্যপায়ী (তিমি, শুশুক, ডলফিন, ডুগং) কিনা যাচাই */
export function isCetaceanOrMarine(s: Pick<Species, 'nameBn' | 'nameEn' | 'scientificName' | 'taxonomy' | 'slug'>): boolean {
  if (s.taxonomy?.order === 'Cetacea' || s.taxonomy?.order === 'Sirenia') return true
  const n = (s.nameBn || '') + ' ' + (s.nameEn || '') + ' ' + (s.slug || '')
  return /তিমি|শুশুক|ডলফিন|ডুগং|পোরপোইজ|হোয়েল|whale|dolphin|porpoise|dugong/i.test(n)
}

/** বাদুড় (উড়ন্ত স্তন্যপায়ী) কিনা যাচাই */
export function isBatSpecies(s: Pick<Species, 'nameBn' | 'nameEn' | 'scientificName' | 'taxonomy' | 'slug'>): boolean {
  if (s.taxonomy?.order === 'Chiroptera') return true
  const n = (s.nameBn || '') + ' ' + (s.nameEn || '') + ' ' + (s.slug || '')
  return /বাদুড়|বাদুড়|চামচিকা|পিপিস্ট্রেল|bat|flying fox|pipistrelle/i.test(n)
}

/** স্তন্যপায়ী দলের ভেতরে দ্রুত ব্রাউজ করার জন্য বিষয়ভিত্তিক উপ-বিভাগ */
export type MammalSubCategory = {
  id: string
  label: string
  hint: string
  badge?: string
}

export const MAMMAL_SUB_FILTERS: MammalSubCategory[] = [
  { id: 'all', label: 'সব স্তন্যপায়ী', hint: 'বাংলাদেশের ১৩৯টি স্তন্যপায়ী প্রজাতি' },
  { id: 'cetacea', label: 'তিমি ও শুশুক', badge: 'সামুদ্রিক', hint: 'নীল তিমি, ডলফিন ও সামুদ্রিক স্তন্যপায়ী' },
  { id: 'carnivora', label: 'বাঘ ও শিকারি প্রাণী', badge: 'মাংসাশী', hint: 'রয়্যাল বেঙ্গল বাঘ, চিতাবাঘ, ভাম ও ভোঁদড়' },
  { id: 'herbivore', label: 'হরিণ, হাতি ও বুনো মহিষ', badge: 'তৃণভোজী', hint: 'চিত্রা হরিণ, এশীয় হাতি ও সম্বর' },
  { id: 'primate', label: 'বানর ও ল্যাঙ্গুর', badge: 'প্রাইমেট', hint: 'হুলক গিবন, বানর ও চশমা পরা হনুমান' },
  { id: 'bat', label: 'বাদুড়', badge: 'উড়ন্ত', hint: 'ফলখেকো বাদুড় ও কীটখেকো বাদুড়' },
  { id: 'rodent', label: 'কাঠবিড়ালি ও ইঁদুর', badge: 'রডেন্ট', hint: 'উড়ন্ত কাঠবিড়ালি ও দেশি ইঁদুর' },
]

export function matchesMammalSubCategory(s: Species, subId?: string): boolean {
  if (!subId || subId === 'all') return true
  if (subId === 'cetacea') return isCetaceanOrMarine(s)
  if (subId === 'bat') return isBatSpecies(s)
  const order = s.taxonomy?.order || ''
  const family = s.taxonomy?.family || ''
  const n = (s.nameBn || '') + ' ' + (s.nameEn || '') + ' ' + (s.slug || '')
  if (subId === 'carnivora') {
    return order === 'Carnivora' || /বাঘ|চিতা|বিড়াল|বিড়াল|শিয়াল|শিয়াল|ভালুক|ভোঁদড়|ভোদড়|নকুল|বেজি|নেউল|মার্টেন/i.test(n)
  }
  if (subId === 'herbivore') {
    return order === 'Artiodactyla' || order === 'Proboscidea' || order === 'Perissodactyla' || /হরিণ|হাতি|মহিষ|গৌড়|গণ্ডার|সেরো|বরাহিঙ্গ/i.test(n)
  }
  if (subId === 'primate') {
    return order === 'Primates' || /বানর|বাঁদর|ল্যাঙ্গুর|হনুমান|গিবন/i.test(n)
  }
  if (subId === 'rodent') {
    return order === 'Rodentia' || order === 'Lagomorpha' || order === 'Eulipotyphla' || /কাঠবিড়ালি|কাঠবিড়ালি|ইঁদুর|ইদুর|সজারু|খরগোশ|ছুচুন্দ্র|মোল/i.test(n)
  }
  return true
}
