import type { Species, SpeciesSeed, News, Post, UserRecord, SiteSettings, GroupId } from '@/lib/types'
import { BIRDS } from './birds'
import { ANIMALS } from './animals'
import { PLANTS } from './plants'
import { FISH } from './fish'
import { REPTILES } from './reptiles'
import { AMPHIBIANS } from './amphibians'
import { INSECTS } from './insects'
import { INVERTEBRATES } from './invertebrates'
import { FUNGI_ALGAE } from './fungi-algae'
import { MICROBES } from './microbes'
import { PLACES } from './places'
import { LITERATURE } from './literature'
import { EXTRA_SPECIES } from './extra-species'
import { MORE_PLANTS } from './more-plants'
import { MORE_ANIMALS } from './more-animals'
import { MORE_BIRDS } from './more-birds'
import { MORE_FISH } from './more-fish'
import { MORE_HERPS } from './more-herps'
import { MORE_MAMMALS } from './more-mammals'
import { MORE_PLANTS2 } from './more-plants2'
import { MORE_INSECTS } from './more-insects'
import { MORE_BIRDS2 } from './more-birds2'
import { MORE_PLANTS3 } from './more-plants3'
import { MORE_INSECTS2 } from './more-insects2'
import { SEED_IMAGE_BY_SLUG } from './media-images'
import { withDetails, DETAILS_COUNT } from './details'

/**
 * পুরোনো/উত্তরাধিকারসূত্রে পাওয়া রেকর্ডে `group` না থাকলে বিভাগ থেকে অনুমান করা হয়।
 * কোনো রেকর্ড অসম্পূর্ণ থাকলে সেটি `dataStatus: 'partial'` দিয়ে চিহ্নিত থাকে —
 * কখনোই সম্পূর্ণ বলে দাবি করা হয় না।
 */
export function inferGroup(s: Pick<Species, 'type' | 'category'>): GroupId {
  const c = String(s.category || '').replace(/য়/g, 'য়')
  if (s.type === 'sthan' || s.type === 'sahitto') return s.type === 'sthan' ? 'nadi' : 'sahitto'
  if (s.type === 'udbhid') {
    if (/ছত্রাক|শৈবাল|লাইকেন/.test(c)) return 'chhatrak'
    if (/অণুজীব|ব্যাকটেরিয়া|ব্যাকটেরিয়া/.test(c)) return 'onujib'
    if (/বন|ম্যানগ্রোভ|তাল|বট|ঔষধি/.test(c)) return 'gachhbon'
    return 'udbhidful'
  }
  if (/পাখি/.test(c)) return 'pakhi'
  if (/মাছ/.test(c)) return 'machh'
  if (/স্তন্যপা/.test(c)) return 'stanapayi'
  if (/সরীসৃপ/.test(c)) return 'sarisrip'
  if (/উভচর/.test(c)) return 'ubhochor'
  if (/পতঙ্গ|কীট/.test(c)) return 'kitpotongo'
  if (/অমেরুদণ্ডী|মোলাস্ক|আর্থ্রোপড|ক্রাস্টেশিয়ান/.test(c)) return 'ameruddondi'
  return 'pranijogot'
}

function normalize(s: SpeciesSeed): Species {
  return {
    ...s,
    group: s.group || inferGroup(s),
    dataStatus: s.dataStatus || 'partial',
    updatedAt: s.updatedAt || new Date('2026-01-01').toISOString(),
  }
}

/**
 * একই প্রজাতির একাধিক রেকর্ড (ডুপ্লিকেট) এলে সেগুলো এক করে দেয় —
 * প্রথম রেকর্ডটি মূল ধরা হয়, বাকিগুলোর তথ্য দিয়ে ফাঁকা ঘর পূরণ করা হয় এবং
 * বাদ পড়া স্লাগ `synonyms`-এ রাখা হয়। কোনো তথ্য ফেলা হয় না।
 */
const SCI_RE = /^[A-Z][a-z]+ [a-z][A-Za-z-]+( [A-Za-z.]+)?$/

function mergeKey(s: Species, kind: 'sci' | 'name'): string | null {
  if (kind === 'sci') {
    const v = (s.scientificName || '').trim()
    if (!v || v === '—' || !SCI_RE.test(v)) return null
    return 'sci:' + v.toLowerCase()
  }
  return `name:${s.type}:${(s.nameBn || '').trim()}`
}

function fillFrom(target: Species, src: Species) {
  const t = target as unknown as Record<string, unknown>
  const f = src as unknown as Record<string, unknown>
  for (const k of Object.keys(f)) {
    if (k === 'slug' || k === 'synonyms') continue
    const v = f[k]
    const cur = t[k]
    const empty = (x: unknown) => x === undefined || x === null || x === '' || (Array.isArray(x) && x.length === 0)
    if (empty(v)) continue
    if (empty(cur)) {
      t[k] = v
    } else if (k === 'sources' && Array.isArray(cur) && Array.isArray(v)) {
      const seen = new Set((cur as { title: string }[]).map((x) => x.title))
      t[k] = [...(cur as unknown[]), ...(v as { title: string }[]).filter((x) => !seen.has(x.title))]
    } else if (k === 'otherNames' && Array.isArray(cur) && Array.isArray(v)) {
      t[k] = [...new Set([...(cur as string[]), ...(v as string[])])]
    } else if (typeof v === 'string' && typeof cur === 'string' && v.length > cur.length * 1.6) {
      // একাধিক বড় লেখা থাকলে বেশি বিস্তারিতটি রাখা হয়
      t[k] = v
    }
  }
  if (src.slug !== target.slug) {
    target.synonyms = [...new Set([...(target.synonyms || []), src.slug])]
  }
}

function dedupe(list: Species[]): Species[] {
  const byKey = new Map<string, Species>()
  const out: Species[] = []
  for (const s of list) {
    const keys = [mergeKey(s, 'sci'), mergeKey(s, 'name')].filter(Boolean) as string[]
    let target: Species | undefined
    for (const k of keys) {
      const got = byKey.get(k)
      if (got) {
        target = got
        break
      }
    }
    if (!target) {
      const copy: Species = { ...s }
      out.push(copy)
      for (const k of keys) byKey.set(k, copy)
    } else {
      fillFrom(target, s)
      for (const k of keys) if (!byKey.has(k)) byKey.set(k, target)
    }
  }
  return out
}

const ALL_SPECIES_SEED: Species[] = [
  ...BIRDS, ...ANIMALS, ...PLANTS, ...FISH, ...REPTILES, ...AMPHIBIANS,
  ...INSECTS, ...INVERTEBRATES, ...FUNGI_ALGAE, ...MICROBES, ...PLACES, ...LITERATURE,
  ...EXTRA_SPECIES, ...MORE_PLANTS, ...MORE_ANIMALS, ...MORE_BIRDS, ...MORE_FISH, ...MORE_HERPS, ...MORE_MAMMALS, ...MORE_PLANTS2, ...MORE_INSECTS, ...MORE_BIRDS2, ...MORE_PLANTS3, ...MORE_INSECTS2,
].map(normalize)

/** §12 — স্ক্রিপ্টে সংগৃহীত ছবি (data/seed/media-images.ts) যুক্ত করা */
function withSeedImages(list: Species[]): Species[] {
  return list.map((s) => {
    const file = SEED_IMAGE_BY_SLUG[s.slug]
    if (!file || s.image) return s
    return { ...s, image: file }
  })
}

export const SPECIES: Species[] = withDetails(withSeedImages(dedupe(ALL_SPECIES_SEED)))

/** কতগুলো রেকর্ড ডুপ্লিকেট হিসেবে এক করা হয়েছে (স্বচ্ছতার জন্য) */
export const SPECIES_STATS = {
  raw: ALL_SPECIES_SEED.length,
  unique: SPECIES.length,
  merged: ALL_SPECIES_SEED.length - SPECIES.length,
  details: DETAILS_COUNT,
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'রূপসী বাংলা',
  siteNameEn: 'Ruposhi Bangla',
  tagline: 'বাংলাদেশের প্রকৃতি ও জীববৈচিত্র্যের ডিজিটাল মিলনমেলা',
  logoUrl: '/brand/logo-mark.png',
  headerNotice: 'বাংলাদেশের প্রাণী ও উদ্ভিদের তথ্য জানুন, ছবি শেয়ার করুন — সব এক জায়গায়।',
  headerNoticeActive: true,
  about:
    'রূপসী বাংলা বাংলাদেশের প্রাণী, পাখি, উদ্ভিদ, গ্রাম-প্রকৃতি ও মানুষের এক জীবন্ত ডিজিটাল আর্কাইভ। এখানে দেশের জীববৈচিত্র্য সম্পর্কে তথ্য পাবেন, নিজের তোলা ছবি-ভিডিও শেয়ার করতে পারবেন এবং দেশ ও প্রকৃতি নিয়ে কাজ করা মানুষদের সাথে যুক্ত হতে পারবেন।',
  socials: [
    { label: 'Facebook', url: 'https://facebook.com/', icon: 'facebook' },
    { label: 'YouTube', url: 'https://youtube.com/', icon: 'youtube' },
    { label: 'X', url: 'https://x.com/', icon: 'x' },
    { label: 'Instagram', url: 'https://instagram.com/', icon: 'instagram' },
  ],
  contactEmail: 'hello@ruposhibangla.org',
  aiName: 'রূপসী সহচর',
  aiIntro:
    'আমি এই সাইটের নিজস্ব সহচর। বাংলাদেশের প্রাণী, পাখি, উদ্ভিদ, গ্রামবাংলা ও প্রকৃতি-সংরক্ষণ — যেকোনো বিষয়ে জিজ্ঞেস করুন।',
  footerNote: 'রূপসী বাংলা — বাংলাদেশের প্রকৃতি ও জীববৈচিত্র্যের জন্য একটি উন্মুক্ত উদ্যোগ।',
}

/** মূল চ্যানেল — রূপসী বাংলা (ব্লু-টিক যাচাইকৃত, আমাদের নিজস্ব চ্যানেল) */
export const CHANNEL_USER = {
  id: 'user-ruposhibangla',
  username: 'ruposhibangla',
  name: 'রূপসী বাংলা',
  role: 'partner' as const,
  verified: true,
  avatar: '/brand/logo-mark.png',
  bio: 'রূপসী বাংলা — দেশের প্রকৃতি, মানুষ ও গ্রামের গল্প। রূপসী বাংলার মূল চ্যানেল।',
  location: 'বাংলাদেশ',
  createdAt: '2026-01-01T00:00:00.000Z',
  followers: 1284,
  following: 0,
  passwordHash: '',
  email: 'channel@ruposhibangla.org',
}

export const SEED_USERS: UserRecord[] = [
  CHANNEL_USER,
  {
    id: 'user-nature-bd',
    username: 'naturebd',
    name: 'নেচার বাংলাদেশ',
    role: 'partner' as const,
    verified: true,
    avatar: '',
    bio: 'সুন্দরবন ও হাওর নিয়ে কাজ করা ফটোগ্রাফারদের দল।',
    location: 'খুলনা, বাংলাদেশ',
    createdAt: '2026-01-04T00:00:00.000Z',
    followers: 421,
    following: 0,
    passwordHash: '',
    email: 'naturebd@example.org',
  },
]

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

export const SEED_POSTS: Post[] = [
  {
    id: 'post-1',
    kind: 'photo',
    category: 'grambangla',
    title: 'সকালের কুয়াশায় ধানখেত',
    body:
      'ভোরের আলো ফুটতেই কুয়াশার নিচে হারিয়ে যাওয়া ধানখেত। গ্রামের এই দৃশ্য না দেখলে বোঝা যায় না আমাদের দেশ কতটা সুন্দর।',
    mediaUrl: '/seed/village/paddy-1.jpg',
    mediaType: 'image',
    location: 'ময়মনসিংহ',
    tags: ['ধানখেত', 'কুয়াশা', 'গ্রামবাংলা'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 248,
    comments: 12,
    featured: true,
    createdAt: daysAgo(1),
  },
  {
    id: 'post-2',
    kind: 'photo',
    category: 'prani',
    title: 'আমাদের দোয়েল',
    body:
      'জাতীয় পাখি দোয়েল। সকালে বাগানের ডালে বসে সুর ছড়ায় — এই দৃশ্য যেন বাংলার প্রতিদিনের শুরুর সুর।',
    mediaUrl: '/seed/prani/doyel.jpg',
    mediaType: 'image',
    speciesSlug: 'doyel',
    location: 'ঢাকা',
    tags: ['দোয়েল', 'জাতীয় পাখি'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 512,
    comments: 34,
    featured: true,
    createdAt: daysAgo(2),
  },
  {
    id: 'post-3',
    kind: 'photo',
    category: 'grambangla',
    title: 'নদীর নৌকো, জেলের হাতের জাল',
    body: 'নদীমাতৃক দেশের নিত্যদিনের ছবি। সকালের বাজারে তাজা মাছ নিয়ে ভিড় — এখানেই গ্রামের হাট শুরু।',
    mediaUrl: '/seed/village/nouka.jpg',
    mediaType: 'image',
    location: 'চাঁদপুর',
    tags: ['নদী', 'জেলে', 'নৌকো'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 189,
    comments: 8,
    createdAt: daysAgo(3),
  },
  {
    id: 'post-4',
    kind: 'photo',
    category: 'prani',
    title: 'সুন্দরবনের রাজা',
    body:
      'বাংলার বাঘ — আমাদের জাতীয় প্রাণী, আবার ম্যানগ্রোভ বনের সবচেয়ে বড় অভিভাবক। এদের টিকিয়ে রাখতে হবে আমাদেরই।',
    mediaUrl: '/seed/prani/bagh.jpg',
    mediaType: 'image',
    speciesSlug: 'bagh',
    location: 'সুন্দরবন',
    tags: ['বাঘ', 'সুন্দরবন', 'বিপন্ন প্রজাতি'],
    authorName: 'নেচার বাংলাদেশ',
    authorId: 'user-nature-bd',
    authorKey: 'seed-naturebd',
    status: 'approved',
    likes: 733,
    comments: 41,
    featured: true,
    createdAt: daysAgo(4),
  },
  {
    id: 'post-5',
    kind: 'photo',
    category: 'grambangla',
    title: 'মাটির ঘর, বাঁশের বেড়া',
    body: 'বাঁশ আর মাটির তৈরি গ্রামের ঘর — গরমে ঠান্ডা, বৃষ্টিতে আশ্রয়। সহজ সরল মানুষের হাতের কারিগরি।',
    mediaUrl: '/seed/village/homestead.jpg',
    mediaType: 'image',
    location: 'সিলেট',
    tags: ['গ্রামের ঘর', 'বাঁশ'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 312,
    comments: 19,
    createdAt: daysAgo(5),
  },
  {
    id: 'post-6',
    kind: 'photo',
    category: 'udbhid',
    title: 'বৈশাখের আগুন — কৃষ্ণচূড়া',
    body: 'রাস্তার ধারে কৃষ্ণচূড়া ফুটলে বোঝা যায় বৈশাখ এসে গেছে। লাল রঙের এই বিস্ফোরণ আমাদের ঋতুচেতনার অংশ।',
    mediaUrl: '/seed/udbhid/krishnochura.jpg',
    mediaType: 'image',
    speciesSlug: 'krishnochura',
    location: 'ঢাকা',
    tags: ['কৃষ্ণচূড়া', 'বৈশাখ'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 421,
    comments: 22,
    createdAt: daysAgo(6),
  },
  {
    id: 'post-7',
    kind: 'photo',
    category: 'grambangla',
    title: 'হাটে যাওয়ার পথ',
    body: 'সাপ্তাহিক হাটের দিন। মাথায় ঝুড়ি, হাতে কাঁথা — গ্রামের মানুষের ছোট্ট যাত্রা।',
    mediaUrl: '/seed/village/haat.jpg',
    mediaType: 'image',
    location: 'নেত্রকোনা',
    tags: ['হাট', 'গ্রামের মানুষ'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 167,
    comments: 6,
    createdAt: daysAgo(7),
  },
  {
    id: 'post-8',
    kind: 'photo',
    category: 'prani',
    title: 'মাছরাঙা — নীল বিদ্যুৎ',
    body: 'পুকুরের ধারে শুকনো ডালে বসে থাকে, আর ঝটিকা মেরে জলে ডুব দেয়। প্রকৃতির সবচেয়ে সুন্দর শিকারি।',
    mediaUrl: '/seed/prani/machranga.jpg',
    mediaType: 'image',
    speciesSlug: 'machranga',
    location: 'টাঙ্গাইল',
    tags: ['মাছরাঙা', 'পাখি'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 289,
    comments: 15,
    createdAt: daysAgo(8),
  },
  {
    id: 'post-9',
    kind: 'photo',
    category: 'udbhid',
    title: 'শাপলা — আমাদের জাতীয় ফুল',
    body: 'পুকুরের বুকে ভেসে থাকা সাদা শাপলা। বর্ষার পর হাওরে এদের রাজত্ব শুরু।',
    mediaUrl: '/seed/udbhid/shapla.jpg',
    mediaType: 'image',
    speciesSlug: 'shapla',
    location: 'সুনামগঞ্জ',
    tags: ['শাপলা', 'জাতীয় ফুল', 'হাওর'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 356,
    comments: 17,
    createdAt: daysAgo(9),
  },
  {
    id: 'post-10',
    kind: 'photo',
    category: 'grambangla',
    title: 'সন্ধ্যায় গ্রামের পথ',
    body: 'খেজুর-তালের দিগন্ত আর গরু ফেরার পথ — গ্রামের সন্ধ্যা নিজেই একটা কবিতা।',
    mediaUrl: '/seed/village/paddy-2.jpg',
    mediaType: 'image',
    location: 'ফরিদপুর',
    tags: ['সন্ধ্যা', 'গ্রাম'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 203,
    comments: 9,
    createdAt: daysAgo(10),
  },
  {
    id: 'post-11',
    kind: 'photo',
    category: 'prani',
    title: 'সুন্দরবনের সুন্দরী গাছ',
    body: 'যে গাছের নামেই সুন্দরবনের নাম। লোনা জলে টিকে থাকা এই গাছ বনের প্রথম প্রতিরক্ষা।',
    mediaUrl: '/seed/udbhid/shundori.jpg',
    mediaType: 'image',
    speciesSlug: 'shundori',
    location: 'সুন্দরবন',
    tags: ['সুন্দরী', 'ম্যানগ্রোভ'],
    authorName: 'নেচার বাংলাদেশ',
    authorId: 'user-nature-bd',
    authorKey: 'seed-naturebd',
    status: 'approved',
    likes: 274,
    comments: 11,
    createdAt: daysAgo(11),
  },
  {
    id: 'post-12',
    kind: 'photo',
    category: 'prani',
    title: 'শুশুক — নদীর হাসি',
    body: 'সুন্দরবনের খালে মাঝে মাঝে জলের ওপরে ভেসে ওঠে শুশুক। এদের দেখা মানেই নদী এখনো বেঁচে আছে।',
    mediaUrl: '/seed/prani/shushuk.jpg',
    mediaType: 'image',
    speciesSlug: 'shushuk',
    location: 'সুন্দরবন',
    tags: ['শুশুক', 'ডলফিন', 'বিপন্ন'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 398,
    comments: 26,
    createdAt: daysAgo(12),
  },
  {
    id: 'post-13',
    kind: 'note',
    category: 'grambangla',
    title: 'আমাদের গ্রাম, আমাদের মানুষ',
    body:
      'খুব ভোরে উঠে মাঠে যাওয়া কৃষক, পুকুরে জাল ফেলা জেলে, স্কুলে যাওয়া শিশু — এই সহজ সরল মানুষের হাতেই আসলে দেশ চলে। তাদের ছবি আর গল্প এই পাতায় জমা হোক।',
    tags: ['গ্রামের মানুষ', 'গল্প'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 145,
    comments: 13,
    createdAt: daysAgo(13),
  },
  {
    id: 'post-14',
    kind: 'photo',
    category: 'grambangla',
    title: 'ম্যানগ্রোভের সকাল',
    body: 'সুন্দরবনের ভেতর দিয়ে খাল বেয়ে যাওয়া — কুয়াশা, পাখির ডাক আর লোনা হাওয়ার গন্ধ।',
    mediaUrl: '/seed/village/sundarbans.jpg',
    mediaType: 'image',
    location: 'সুন্দরবন',
    tags: ['সুন্দরবন', 'কুয়াশা'],
    authorName: 'নেচার বাংলাদেশ',
    authorId: 'user-nature-bd',
    authorKey: 'seed-naturebd',
    status: 'approved',
    likes: 331,
    comments: 14,
    createdAt: daysAgo(14),
  },
  {
    id: 'post-15',
    kind: 'photo',
    category: 'prani',
    title: 'নীলকণ্ঠ — আকাশের নীল ঝলক',
    body: 'মাঠের তারে বসে থাকে ধূসর পাখি, আর উড়লে ডানায় ধরা পড়ে নীল বিদ্যুৎ।',
    mediaUrl: '/seed/prani/nilkantha.jpg',
    mediaType: 'image',
    speciesSlug: 'nilkantha',
    location: 'রাজশাহী',
    tags: ['নীলকণ্ঠ', 'পাখি'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 256,
    comments: 10,
    createdAt: daysAgo(15),
  },
  {
    id: 'post-16',
    kind: 'photo',
    category: 'grambangla',
    title: 'পুকুরপাড়ের শৈশব',
    body: 'গ্রামের শিশুরা জলে নেমে মাছ ধরে — খেলা আর জীবিকা একসাথে মিশে আছে।',
    mediaUrl: '/seed/village/children.jpg',
    mediaType: 'image',
    location: 'লালমনিরহাট',
    tags: ['শিশু', 'গ্রাম'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 222,
    comments: 18,
    createdAt: daysAgo(16),
  },
  {
    id: 'post-17',
    kind: 'photo',
    category: 'udbhid',
    title: 'শিমুল ফুল — শীতের শেষ আগুন',
    body: 'পাতা ঝরিয়ে শিমুল গাছে লাল ফুল ফোটে। এরপর আসে সাদা তুলার ঝড় — বসন্তের আগমনী।',
    mediaUrl: '/seed/udbhid/shimul.jpg',
    mediaType: 'image',
    speciesSlug: 'shimul',
    location: 'মুন্সীগঞ্জ',
    tags: ['শিমুল', 'ফুল'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 187,
    comments: 7,
    createdAt: daysAgo(17),
  },
  {
    id: 'post-18',
    kind: 'photo',
    category: 'grambangla',
    title: 'মাঠে নারী শ্রমিকের হাত',
    body: 'ধান রোপণ থেকে মাড়াই — গ্রামের নারীরা কৃষির মূল চালিকাশক্তি। তাদের পরিশ্রমেই ফসল ঘরে আসে।',
    mediaUrl: '/seed/village/woman.jpg',
    mediaType: 'image',
    location: 'রংপুর',
    tags: ['কৃষি', 'নারী', 'গ্রাম'],
    authorName: 'রূপসী বাংলা',
    authorId: 'user-ruposhibangla',
    authorKey: 'seed-channel',
    status: 'approved',
    likes: 405,
    comments: 24,
    createdAt: daysAgo(18),
  },
]

export const SEED_NEWS: News[] = [
  {
    id: 'news-1',
    slug: 'sundarban-tiger-survey-2026',
    title: 'সুন্দরবনে বাঘের নতুন জরিপ: সংখ্যা স্থিতিশীল, চ্যালেঞ্জ কমেনি',
    excerpt:
      'বন বিভাগের সর্বশেষ ক্যামেরা-ট্র্যাপ জরিপে সুন্দরবনে বাঘের উপস্থিতি আগের মতোই রয়েছে, তবে বাঘ-মানুষ সংঘাত ও জলবায়ু পরিবর্তন নতুন হুমকি।',
    body:
      'সুন্দরবনের বাঘ নিয়ে সর্বশেষ জরিপে দেখা গেছে, ম্যানগ্রোভ বনে বাঘের উপস্থিতি সামগ্রিকভাবে স্থিতিশীল রয়েছে। ক্যামেরা-ট্র্যাপ চিত্র ও পদচিহ্ন বিশ্লেষণ করে বন বিভাগ জানিয়েছে, পশ্চিম ও দক্ষিণ ব্লকে বাঘের বিচরণ বেশি।\n\nতবে উদ্বেগের বিষয়ও আছে। জলবায়ু পরিবর্তনে লবণাক্ততা বাড়ছে, সুন্দরী গাছের "টপ ডাইং" রোগ ছড়াচ্ছে, আর জোয়ার-ভাটার ধরন বদলাচ্ছে। অন্যদিকে বনের প্রান্তে মানুষের চাপ ও মাছ ধরার নৌকায় বাঘের সংঘর্ষের ঘটনা বাড়ছে।\n\nবিশেষজ্ঞদের মতে বাঘ বাঁচাতে হলে চিত্রা হরিণ ও বুনো শূকরের মতো শিকার-প্রাণীর সংখ্যা ঠিক রাখা, করিডোর সংরক্ষণ এবং স্থানীয় মানুষকে সহনশীলতা-প্রকল্পে যুক্ত করা — এই তিনটি একসাথে করার বিকল্প নেই।',
    cover: '/seed/prani/bagh.jpg',
    tags: ['বাঘ', 'সুন্দরবন', 'সংরক্ষণ'],
    published: true,
    pinned: true,
    views: 1240,
    createdAt: daysAgo(2),
  },
  {
    id: 'news-2',
    slug: 'haor-bird-count-2026',
    title: 'হাওরে শীতের অতিথি: এবার রেকর্ড সংখ্যক পরিযায়ী পাখি',
    excerpt:
      'হাকালুকি ও টাঙ্গুয়ার হাওরে এবার আগের চেয়ে বেশি পরিযায়ী পাখি দেখা গেছে। স্থানীয়দের সচেতনতা ও জলাশয় রক্ষায় এটি বড় সাফল্য।',
    body:
      'সিলেট-সুনামগঞ্জের হাওরগুলোতে এবারের শীতে অস্বাভাবিক সংখ্যক পরিযায়ী পাখি দেখা গেছে। স্থানীয় পর্যবেক্ষক ও স্বেচ্ছাসেবীরা জানিয়েছেন, সরালি হাঁস, পানকৌড়ি, সাদা বক ও বিভিন্ন প্রজাতির জলচর পাখির ঝাঁক আগের বছরের তুলনায় বেশি।\n\nহাওরের মাছ শিকারে নিষিদ্ধ মৌসুম যথাযথ পালন, স্থানীয় যুবদের পাহারা এবং জলাশয় ভরাট রোধে উদ্যোগ — এসবই এর পেছনে বড় কারণ।\n\nতবে উদ্বেগ আছে: জলবায়ু পরিবর্তনে অসময়ে বন্যা ও খরা, কীটনাশকের ব্যবহার এবং বিদ্যুতের তারে পাখির মৃত্যু এখনো বড় হুমকি।',
    cover: '/seed/prani/shada-bok.jpg',
    tags: ['পাখি', 'হাওর', 'পরিযায়ী'],
    published: true,
    pinned: false,
    views: 860,
    createdAt: daysAgo(6),
  },
  {
    id: 'news-3',
    slug: 'shal-bon-rokkha-udjog',
    title: 'মধুপুর শালবন: স্থানীয়দের হাতে বন রক্ষার নতুন উদ্যোগ',
    excerpt:
      'মধুপুরে শালবন রক্ষায় এবার সামনে এলেন স্থানীয় যুব সমাজ। বনায়ন, পাহারা ও বিকল্প জীবিকা — তিন মুখে কাজ শুরু।',
    body:
      'টাঙ্গাইলের মধুপুর শালবন দীর্ঘদিন ধরে দখল ও অবৈধ কাটার চাপে আছে। এবার উদ্যোগ নিয়েছে স্থানীয় যুব সংগঠন ও স্কুল-কলেজের শিক্ষার্থীরা।\n\nতাদের পরিকল্পনায় আছে: বনের প্রান্তে শাল, মেহগনি ও দেশীয় প্রজাতির চারা রোপণ; নিয়মিত পাহারা; এবং বনের ওপর নির্ভরশীল পরিবারের জন্য বিকল্প জীবিকা (মৌচাষ, নার্সারি, ইকো-ট্যুর গাইড) তৈরি।\n\nবন বিভাগের কর্মকর্তারা জানিয়েছেন, স্থানীয় মানুষ সামনে না এলে কোনো বনই বাঁচানো সম্ভব নয়। এই উদ্যোগকে তারা "আশার খবর" বলছেন।',
    cover: '/seed/udbhid/shal.jpg',
    tags: ['শালবন', 'বনায়ন', 'মধুপুর'],
    published: true,
    pinned: false,
    views: 540,
    createdAt: daysAgo(11),
  },
]
