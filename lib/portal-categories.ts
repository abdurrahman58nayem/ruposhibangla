import type { GroupId } from '@/lib/types'

export type PortalSubcategory = { label: string; href: string }
export type PortalCategory = {
  id: string
  label: string
  shortLabel: string
  description: string
  iconGroup: GroupId
  href: string
  subcategories: PortalSubcategory[]
}

const gyan = (group: string, type?: string) => `/gyan?${type ? `type=${type}&` : ''}group=${group}`
const udbhid = (category: string) => `/udbhid?cat=${encodeURIComponent(category)}`
const place = (topic: string) => `/sthan?topic=${encodeURIComponent(topic)}`
const village = (topic: string) => `/grambangla?topic=${encodeURIComponent(topic)}`

/** Presentation-only discovery map. Existing GroupId/category/slug values remain canonical in storage. */
export const PORTAL_CATEGORIES: PortalCategory[] = [
  {
    id: 'animals', label: 'প্রাণীজগৎ', shortLabel: 'প্রাণী', description: 'বাংলাদেশের বন্যপ্রাণী ও প্রাণিকুল', iconGroup: 'pranijogot', href: '/prani',
    subcategories: [
      { label: 'স্তন্যপায়ী প্রাণী', href: gyan('stanapayi', 'prani') }, { label: 'পাখি', href: gyan('pakhi', 'prani') },
      { label: 'মাছ', href: gyan('machh', 'prani') }, { label: 'সরীসৃপ', href: gyan('sarisrip', 'prani') },
      { label: 'উভচর', href: gyan('ubhochor', 'prani') }, { label: 'কীটপতঙ্গ', href: gyan('kitpotongo', 'prani') },
      { label: 'অন্যান্য অমেরুদণ্ডী', href: gyan('ameruddondi', 'prani') },
    ],
  },
  {
    id: 'plants', label: 'উদ্ভিদজগৎ', shortLabel: 'উদ্ভিদ', description: 'গাছ, ফুল, ফল, ফসল, ছত্রাক ও শৈবাল', iconGroup: 'udbhidful', href: '/udbhid',
    subcategories: [
      { label: 'বৃক্ষ ও বনজ উদ্ভিদ', href: gyan('gachhbon', 'udbhid') }, { label: 'ফুল ও শোভাবর্ধক উদ্ভিদ', href: udbhid('ফুল গাছ') },
      { label: 'ফলদ উদ্ভিদ', href: udbhid('ফল গাছ') }, { label: 'ঔষধি উদ্ভিদ', href: udbhid('ঔষধি গাছ') },
      { label: 'শাকসবজি ও ফসল', href: udbhid('শাক-সবজি') }, { label: 'লতাগুল্ম ও ঘাস', href: udbhid('ঘাস-জাতীয়') },
      { label: 'ছত্রাক ও শৈবাল', href: gyan('chhatrak', 'udbhid') },
    ],
  },
  {
    id: 'habitats', label: 'প্রকৃতি ও আবাসস্থল', shortLabel: 'আবাসস্থল', description: 'বন, পাহাড়, নদী, জলাভূমি ও উপকূল', iconGroup: 'pahar', href: '/sthan',
    subcategories: [
      { label: 'বন ও অরণ্য', href: place('forest') }, { label: 'ম্যানগ্রোভ বন', href: place('mangrove') },
      { label: 'পাহাড় ও টিলা', href: place('hill') }, { label: 'নদী ও নদীর চর', href: place('river') },
      { label: 'হাওর ও বিল', href: place('haor') }, { label: 'হ্রদ ও জলাভূমি', href: place('wetland') },
      { label: 'সমুদ্র ও উপকূল', href: place('coast') }, { label: 'দ্বীপ ও চরাঞ্চল', href: place('island') },
      { label: 'ঝরনা ও জলপ্রপাত', href: place('waterfall') }, { label: 'গুহা ও প্রাকৃতিক ভূদৃশ্য', href: place('cave') },
    ],
  },
  {
    id: 'tourism', label: 'প্রাকৃতিক পর্যটন', shortLabel: 'ভ্রমণ', description: 'প্রকৃতিতে ঘোরার জায়গা ও দায়িত্বশীল ভ্রমণ', iconGroup: 'pahar', href: '/sthan?topic=tourism',
    subcategories: [
      { label: 'পাহাড়ি পর্যটনকেন্দ্র', href: place('hill') }, { label: 'বন ও জাতীয় উদ্যান', href: place('forest') },
      { label: 'ঝরনা ও জলপ্রপাত', href: place('waterfall') }, { label: 'সমুদ্রসৈকত', href: place('beach') },
      { label: 'হাওর ও জলাভূমির পর্যটন', href: place('haor') }, { label: 'দ্বীপ ও চর ভ্রমণ', href: place('island') },
      { label: 'পাখি দেখার স্থান', href: place('birding') }, { label: 'নদী ও নৌভ্রমণ', href: place('river') },
      { label: 'ক্যাম্পিং ও প্রকৃতিতে হাঁটা', href: place('camping') },
    ],
  },
  {
    id: 'village', label: 'গ্রামবাংলা ও প্রান্তর', shortLabel: 'গ্রামবাংলা', description: 'গ্রামের মাঠ, জলাশয়, হাট ও মানুষের জীবন', iconGroup: 'grambangla', href: '/grambangla',
    subcategories: [
      { label: 'গ্রামের মেঠোপথ', href: village('মেঠোপথ') }, { label: 'ধানখেত ও ফসলের মাঠ', href: village('ধানখেত') },
      { label: 'সরিষার প্রান্তর', href: village('সরিষা') }, { label: 'তাল, খেজুর ও নারকেলগাছ', href: village('তাল খেজুর নারকেল') },
      { label: 'বাঁশবাগান', href: village('বাঁশবাগান') }, { label: 'গ্রামীণ পুকুর ও জলাশয়', href: village('পুকুর') },
      { label: 'নদীপাড় ও নৌকার ঘাট', href: village('নৌকা ঘাট') }, { label: 'গ্রামীণ হাটবাজার', href: village('হাটবাজার') },
      { label: 'ঐতিহ্যবাহী বাড়ি ও উঠান', href: village('বাড়ি উঠান') }, { label: 'গ্রামীণ কৃষিজীবন', href: village('কৃষিজীবন') },
    ],
  },
  {
    id: 'water', label: 'নদী, জল ও জলজ জীবন', shortLabel: 'নদী-জল', description: 'নদনদী, জলজ প্রাণী ও পানির পরিবেশ', iconGroup: 'nadi', href: gyan('nadi', 'sthan'),
    subcategories: [
      { label: 'বাংলাদেশের নদনদী', href: place('river') }, { label: 'নদীর চর ও বালুচর', href: place('char') },
      { label: 'নদীপথ ও নৌকা', href: village('নৌকা') }, { label: 'জেলে ও মৎস্যজীবন', href: village('জেলে') },
      { label: 'মিঠাপানির জলজ পরিবেশ', href: place('freshwater') }, { label: 'সামুদ্রিক জীববৈচিত্র্য', href: `/gyan?type=prani&group=machh` },
      { label: 'নদীভাঙন ও জলদূষণ', href: '/search?q=নদীভাঙন' },
    ],
  },
  {
    id: 'seasons', label: 'ঋতু ও প্রকৃতি', shortLabel: 'ঋতু', description: 'বাংলার ছয় ঋতু ও মৌসুমি প্রকৃতি', iconGroup: 'udbhidful', href: '/search?q=ঋতু',
    subcategories: [
      { label: 'গ্রীষ্ম', href: '/search?q=গ্রীষ্ম' }, { label: 'বর্ষা', href: '/search?q=বর্ষা' },
      { label: 'শরৎ', href: '/search?q=শরৎ' }, { label: 'হেমন্ত', href: '/search?q=হেমন্ত' },
      { label: 'শীত', href: '/search?q=শীত' }, { label: 'বসন্ত', href: '/search?q=বসন্ত' },
      { label: 'ঋতুভিত্তিক ফুল, ফল ও প্রাকৃতিক ঘটনা', href: '/udbhid' },
    ],
  },
  {
    id: 'culture', label: 'লোকজ ঐতিহ্য ও সংস্কৃতি', shortLabel: 'ঐতিহ্য', description: 'প্রকৃতির সঙ্গে মিশে থাকা লোকজ জীবনধারা', iconGroup: 'sahitto', href: '/grambangla',
    subcategories: [
      { label: 'লোকজ উৎসব ও মেলা', href: village('মেলা') }, { label: 'নৌকাবাইচ', href: village('নৌকাবাইচ') },
      { label: 'লোকসংগীত', href: village('লোকসংগীত') }, { label: 'কৃষিভিত্তিক উৎসব', href: village('কৃষি উৎসব') },
      { label: 'ঐতিহ্যবাহী নৌকা', href: village('নৌকা') }, { label: 'গ্রামীণ কারুশিল্প', href: village('কারুশিল্প') },
      { label: 'প্রকৃতিনির্ভর লোককথা', href: '/kobirchokhe' },
    ],
  },
  {
    id: 'conservation', label: 'জীববৈচিত্র্য ও সংরক্ষণ', shortLabel: 'সংরক্ষণ', description: 'বিপন্ন প্রজাতি, সংরক্ষিত এলাকা ও গবেষণা', iconGroup: 'songrokkhon', href: '/songrokkhon',
    subcategories: [
      { label: 'বিপন্ন ও বিরল প্রজাতি', href: '/gyan?iucn=EN' }, { label: 'সংরক্ষিত বন ও অভয়ারণ্য', href: place('forest') },
      { label: 'জাতীয় উদ্যান', href: '/sthan?topic=forest' }, { label: 'বন্যপ্রাণীর আবাসস্থল', href: place('forest') },
      { label: 'পরিবেশদূষণ ও বন উজাড়', href: '/songrokkhon' }, { label: 'সংরক্ষণ প্রকল্প', href: '/songrokkhon' },
      { label: 'গবেষণা ও বৈজ্ঞানিক তথ্য', href: '/khobor?kind=research' },
    ],
  },
  {
    id: 'stories', label: 'ছবি, গল্প ও সংবাদ', shortLabel: 'ছবি-সংবাদ', description: 'প্রকৃতির ছবি, পর্যবেক্ষণ, গল্প ও খবর', iconGroup: 'pakhi', href: '/feed',
    subcategories: [
      { label: 'প্রকৃতির ছবি ও ভিডিও', href: '/feed' }, { label: 'গ্রামবাংলার আলোকচিত্র', href: '/grambangla' },
      { label: 'স্থানীয় মানুষের প্রকৃতির গল্প', href: '/grambangla' }, { label: 'নতুন প্রজাতি পর্যবেক্ষণ', href: '/observations' },
      { label: 'প্রকৃতিবিষয়ক সংবাদ', href: '/khobor' }, { label: 'গবেষণা ও প্রতিবেদন', href: '/khobor?kind=research' },
      { label: 'ব্যবহারকারীর ছবি ও পর্যবেক্ষণ', href: '/observations' },
    ],
  },
]
