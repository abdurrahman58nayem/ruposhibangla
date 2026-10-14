import type { GroupId, SpeciesType } from './types'

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
  { id: 'pranijogot', label: 'প্রাণীজগৎ', labelEn: 'Animals', icon: 'PawPrint', type: 'prani', route: '/gyan?group=pranijogot', hint: 'বাংলাদেশের সব প্রাণী' },
  { id: 'pakhi', label: 'পাখি', labelEn: 'Birds', icon: 'Bird', type: 'prani', route: '/gyan?group=pakhi', hint: 'দেশি ও পরিযায়ী পাখি' },
  { id: 'machh', label: 'মাছ', labelEn: 'Fish', icon: 'Fish', type: 'prani', route: '/gyan?group=machh', hint: 'স্বাদু ও লোনা জলের মাছ' },
  { id: 'stanapayi', label: 'স্তন্যপায়ী', labelEn: 'Mammals', icon: 'Rat', type: 'prani', route: '/gyan?group=stanapayi', hint: 'বাঘ হাতি হরিণ শুশুক' },
  { id: 'sarisrip', label: 'সরীসৃপ', labelEn: 'Reptiles', icon: 'Bug', type: 'prani', route: '/gyan?group=sarisrip', hint: 'সাপ কুমির কচ্ছপ গুই' },
  { id: 'ubhochor', label: 'উভচর', labelEn: 'Amphibians', icon: 'Waves', type: 'prani', route: '/gyan?group=ubhochor', hint: 'ব্যাঙ সালামান্ডার' },
  { id: 'kitpotongo', label: 'কীটপতঙ্গ', labelEn: 'Insects', icon: 'Bug', type: 'prani', route: '/gyan?group=kitpotongo', hint: 'প্রজাপতি মৌমাছি গুবরে পোকা' },
  { id: 'ameruddondi', label: 'অন্যান্য অমেরুদণ্ডী', labelEn: 'Invertebrates', icon: 'Shell', type: 'prani', route: '/gyan?group=ameruddondi', hint: 'মাকড়সা শামুক ঝিনুক কাঁকড়া' },
  { id: 'udbhidful', label: 'উদ্ভিদ ও ফুল', labelEn: 'Plants & Flowers', icon: 'Flower2', type: 'udbhid', route: '/gyan?group=udbhidful', hint: 'ফুল ফল লতা জলজ উদ্ভিদ' },
  { id: 'gachhbon', label: 'গাছ ও বন', labelEn: 'Trees & Forests', icon: 'TreeDeciduous', type: 'udbhid', route: '/gyan?group=gachhbon', hint: 'দেশি গাছ, বন ও বনজ' },
  { id: 'chhatrak', label: 'ছত্রাক ও শৈবাল', labelEn: 'Fungi & Algae', icon: 'Sparkles', type: 'udbhid', route: '/gyan?group=chhatrak', hint: 'মাশরুম, শৈবাল, লাইকেন' },
  { id: 'onujib', label: 'অণুজীব', labelEn: 'Microbes', icon: 'Microscope', type: 'udbhid', route: '/gyan?group=onujib', hint: 'ব্যাকটেরিয়া, প্রোটিস্ট, আর্কিয়া' },
  { id: 'nadi', label: 'নদী ও জলাভূমি', labelEn: 'Rivers & Wetlands', icon: 'Waves', type: 'sthan', route: '/gyan?group=nadi', hint: 'পদ্মা মেঘনা হাওর সুন্দরবন' },
  { id: 'pahar', label: 'পাহাড় ও বনাঞ্চল', labelEn: 'Hills & Forests', icon: 'Mountain', type: 'sthan', route: '/gyan?group=pahar', hint: 'সুন্দরবন, রাঙামাটি, সীতাকুণ্ড' },
  { id: 'grambangla', label: 'গ্রামবাংলা', labelEn: 'Village Life', icon: 'Home', type: 'content', route: '/grambangla', hint: 'ধানখেত, নৌকো, মানুষের দিন' },
  { id: 'sahitto', label: 'প্রকৃতি ও সাহিত্য', labelEn: 'Nature in Literature', icon: 'BookOpen', type: 'sahitto', route: '/sahitto', hint: 'কবির চোখে প্রকৃতি' },
  { id: 'songrokkhon', label: 'পরিবেশ ও সংরক্ষণ', labelEn: 'Conservation', icon: 'ShieldCheck', type: 'content', route: '/songrokkhon', hint: 'হুমকি, গবেষণা, উদ্যোগ' },
]

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
)

export function categoryLabel(id?: string): string {
  return (id && CATEGORY_MAP[id]?.label) || 'অন্যান্য'
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
