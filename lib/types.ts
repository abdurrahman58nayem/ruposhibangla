// রূপসী বাংলা — কোর টাইপ ডেফিনিশন
// বাংলাদেশের জীববৈচিত্র্য জ্ঞানভান্ডার + কমিউনিটি + এআই

/* ------------------------------------------------------------------ */
/* জ্ঞানভান্ডার — প্রধান ধরন                                            */
/* ------------------------------------------------------------------ */

/** prani = প্রাণী, udbhid = উদ্ভিদ/ছত্রাক/শৈবাল/অণুজীব, sthan = নদী-বন-পাহাড়, sahitto = সাহিত্য */
export type SpeciesType = 'prani' | 'udbhid' | 'sthan' | 'sahitto'

/** ১৭টি প্রধান ক্যাটাগরি */
export type GroupId =
  | 'pranijogot'   // প্রাণীজগৎ
  | 'pakhi'        // পাখি
  | 'machh'        // মাছ
  | 'stanapayi'    // স্তন্যপায়ী
  | 'sarisrip'     // সরীসৃপ
  | 'ubhochor'     // উভচর
  | 'kitpotongo'   // কীটপতঙ্গ
  | 'ameruddondi'  // অন্যান্য অমেরুদণ্ডী
  | 'udbhidful'    // উদ্ভিদ ও ফুল
  | 'gachhbon'     // গাছ ও বন
  | 'chhatrak'     // ছত্রাক ও শৈবাল
  | 'onujib'       // অণুজীব
  | 'nadi'         // নদী ও জলাভূমি
  | 'pahar'        // পাহাড় ও বনাঞ্চল
  | 'grambangla'   // গ্রামবাংলা
  | 'sahitto'      // প্রকৃতি ও সাহিত্য
  | 'songrokkhon'  // পরিবেশ ও সংরক্ষণ

/** IUCN Red List শ্রেণি */
export type Conservation =
  | 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD' | 'NE'

/**
 * তথ্যের মান — অসম্পূর্ণ তথ্য লুকানো যাবে না, চিহ্নিত করতে হবে।
 */
export type DataStatus =
  | 'verified'          // যাচাইকৃত
  | 'review'            // পর্যালোচনাধীন
  | 'partial'           // আংশিক তথ্য
  | 'identity_uncertain'// পরিচয় অনিশ্চিত
  | 'needs_correction'  // সংশোধন প্রয়োজন

/** পূর্ণ শ্রেণিবিন্যাস */
export type Taxonomy = {
  kingdom?: string
  phylum?: string
  class?: string
  order?: string
  family?: string
  genus?: string
  species?: string
}

/** উৎস + লাইসেন্স */
export type Source = {
  title: string
  url?: string
  /** যেমন: CC BY-SA 4.0, IUCN Red List, GBIF */
  license?: string
  accessedAt?: string
}

export type PoetView = {
  poet: string
  work?: string
  /** কবিতার সংক্ষিপ্ত উদ্ধৃতি/চরণ */
  quote?: string
  note: string
  /** সাহিত্য উদ্ধৃতির সূত্র */
  source?: Source
  needsReview?: boolean
  speciesSlugs?: string[]
}

export type SpeciesMediaVerification = 'verified' | 'needs_review' | 'restricted' | 'unavailable'
export type SpeciesMediaPlatform = 'commons' | 'inaturalist' | 'pexels' | 'youtube' | 'manual'

/** Existing inline media JSON stays compatible; externally discovered assets carry a complete audit trail. */
export type SpeciesMedia = {
  url: string
  kind: 'image' | 'video'
  caption?: string
  title?: string
  credit?: string
  creator?: string
  creatorUrl?: string
  license?: string
  licenseUrl?: string
  sourceUrl?: string
  directMediaUrl?: string
  poster?: string
  sourcePlatform?: SpeciesMediaPlatform
  sourceId?: string
  verificationStatus?: SpeciesMediaVerification
  verificationNote?: string
  scientificName?: string
  identificationConfidence?: number
  identificationBasis?: 'exact_taxon' | 'research_grade' | 'manual_confirmed' | 'unverified'
  commercialUse?: boolean | null
  modificationPermission?: boolean | null
  attributionText?: string
  lastVerifiedAt?: string
  lastReviewedAt?: string
  lastCheckedAt?: string
  mediaId?: string
}

export type Species = {
  id?: string
  slug: string
  type: SpeciesType
  /** ১৭টি ক্যাটাগরির একটি */
  group: GroupId
  /** সূক্ষ্ম বিভাগ — যেমন: ফল, ঔষধি, জলজ, নদী, জলাভূমি */
  category: string
  nameBn: string
  nameEn: string
  scientificName: string
  /** স্থানীয়/আঞ্চলিক নাম */
  otherNames?: string[]
  /** সমার্থক ও পুরোনো বৈজ্ঞানিক নাম */
  synonyms?: string[]
  taxonomy?: Taxonomy
  summary: string
  description: string
  /** শারীরিক বৈশিষ্ট্য */
  physical?: string
  /** শনাক্তকরণের লক্ষণ */
  identification?: string
  diet?: string
  /** আচরণ ও জীবনচক্র */
  behavior?: string
  reproduction?: string
  habitat: string
  /** বাংলাদেশে বিস্তৃতি */
  distribution?: string
  whereToSee?: string
  /** ঋতুভিত্তিক উপস্থিতি */
  season?: string
  sizeOrHeight?: string
  /** প্রাকৃতিক পরিবেশে ভূমিকা */
  ecologicalRole?: string
  /** বন্য / গৃহপালিত / চাষকৃত / পরিযায়ী / বহিরাগত / আগ্রাসী */
  origin?: 'native' | 'domestic' | 'cultivated' | 'migratory' | 'exotic' | 'invasive'
  conservation: Conservation
  conservationBn?: string
  /** হুমকি */
  threats?: string
  /** সংরক্ষণের উপায় */
  conservationActions?: string
  colorTags: string[]
  image: string
  gallery?: string[]
  media?: SpeciesMedia[]
  poetViews?: PoetView[]
  sources?: Source[]
  /** তথ্যের মান */
  dataStatus?: DataStatus
  lastVerifiedAt?: string
  /** একাধিক উৎসে পার্থক্য থাকলে */
  conflictingInfo?: string
  /**
   * "থিন স্টাব" প্রতিস্থাপনের আগের সংস্করণ —
   * বিস্তারিত বিবরণ বসলে আগের এক-লাইনের লেখা এখানে সংরক্ষিত থাকে (তথ্য হারায় না)।
   */
  stubArchive?: Record<string, string>
  /** বিপন্ন প্রজাতি — অবস্থান গোপন রাখতে হবে */
  sensitive?: boolean
  featured?: boolean
  views?: number
  createdAt?: string
  updatedAt?: string
}

/* ------------------------------------------------------------------ */
/* সামাজিক — পোস্ট, মন্তব্য, প্রতিক্রিয়া                                  */
/* ------------------------------------------------------------------ */

export type PostCategory = 'prani' | 'udbhid' | 'grambangla' | 'manush' | 'songrokkhon' | 'other'
export type PostKind = 'photo' | 'video' | 'note' | 'reel'
export type PostStatus = 'approved' | 'pending' | 'rejected' | 'archived'

/** পোস্টের লেখকের সারাংশ — কার্ডে নাম, @username ও নীল টিক দেখাতে */
export type PostAuthor = {
  name: string
  username?: string
  verified?: boolean
  avatar?: string
}

export type Post = {
  id: string
  kind: PostKind
  category: PostCategory
  title?: string
  body?: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  thumbUrl?: string
  location?: string
  speciesSlug?: string
  group?: GroupId
  tags: string[]
  authorName: string
  authorId?: string | null
  authorKey: string
  /** users টেবিল/সংগ্রহ থেকে জোড়া দেওয়া লেখক-তথ্য */
  author?: PostAuthor
  /** প্রজাতির পাতার সঠিক পথ (/prani, /udbhid, /sthan, /sahitto) */
  speciesHref?: string
  status: PostStatus
  likes: number
  comments: number
  featured?: boolean
  /** অ্যাডমিন প্যানেল থেকে অফিসিয়াল চ্যানেলের পোস্ট পিন */
  pinned?: boolean
  /** লেখক জানতে চেয়েছেন: “এটি কোন প্রজাতি?” (§16) */
  needsIdentification?: boolean
  /** বিশেষজ্ঞ যাচাইয়ের পর নির্ধারিত প্রজাতি — স্বয়ংক্রিয়ভাবে বসানো হয় না */
  identifiedSpecies?: string
  createdAt: string
}

/** শনাক্তকরণের উৎস (§16) — কোনোটিই স্বয়ংক্রিয়ভাবে যাচাইকৃত হয় না */
export type IdSource = 'ai' | 'community' | 'expert'

export type Comment = {
  id: string
  postId: string
  name: string
  userId?: string | null
  body: string
  createdAt: string
  /** প্রজাতির প্রস্তাব (slug) */
  suggestedSpecies?: string
  /** মানুষের পড়ার মতো নাম */
  suggestedName?: string
  idSource?: IdSource
  /** কেবল বিশেষজ্ঞ/সম্পাদক পর্যালোচনায় true */
  idVerified?: boolean
  verifiedBy?: string | null
  verifiedAt?: string | null
}

export type Report = {
  id: string
  /** post | comment | user | species */
  targetType: 'post' | 'comment' | 'user' | 'species'
  targetId: string
  reason: string
  details?: string
  reporterName?: string
  reporterKey?: string
  status: 'new' | 'reviewing' | 'resolved' | 'dismissed'
  createdAt: string
}

/** পর্যবেক্ষণ — “আমি কী দেখলাম?” */
export type Observation = {
  id: string
  speciesSlug?: string
  /** শনাক্ত না হলে মুক্ত লেখা */
  guessedName?: string
  name: string
  userId?: string | null
  authorKey: string
  photoUrl?: string
  /** অবস্থান শেয়ারের অনুমতি না দিলে খালি */
  location?: string
  /** অবস্থান গোপন — শুধু এলাকা */
  coarseLocation?: string
  locationShared?: boolean
  notes?: string
  observedAt: string
  /** অনিশ্চিত = true হলে যাচাইকৃত পর্যবেক্ষণ নয় */
  uncertain: boolean
  status: 'submitted' | 'identified' | 'verified' | 'rejected'
  identifiedBy?: string
  createdAt: string
}

export type SavedItem = {
  id: string
  userKey: string
  /** post | species | news */
  targetType: 'post' | 'species' | 'news'
  targetId: string
  createdAt: string
}

export type Notification = {
  id: string
  userKey: string
  type: 'ai_answer' | 'follow' | 'comment' | 'reaction' | 'news' | 'system'
  title: string
  body: string
  url?: string
  read: boolean
  createdAt: string
}

/* ------------------------------------------------------------------ */
/* ব্যবহারকারী ও ভূমিকা                                                  */
/* ------------------------------------------------------------------ */

/**
 * guest = অ্যাকাউন্টহীন (সংরক্ষিত হয় না)
 * partner = যাচাইকৃত পার্টনার (ব্লু টিক) — কোনো অ্যাডমিন ক্ষমতা নেই
 * editor = মডারেটর
 * admin / super_admin
 */
export type UserRole = 'user' | 'partner' | 'editor' | 'admin' | 'super_admin'

export type PublicUser = {
  id: string
  username: string
  name: string
  role: UserRole
  verified: boolean
  avatar?: string
  cover?: string
  bio?: string
  location?: string
  createdAt: string
  followers: number
  following: number
}

export type UserRecord = PublicUser & {
  passwordHash: string
  email?: string
  /** অ্যাকাউন্ট মুছে ফেলার অনুরোধ */
  deletionRequested?: boolean
}

export type AuditLog = {
  id: string
  actorId: string
  actorName: string
  action: string
  target?: string
  detail?: string
  createdAt: string
}

/* ------------------------------------------------------------------ */
/* সংবাদ, গবেষণা, সাহিত্য                                                 */
/* ------------------------------------------------------------------ */

export type News = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  cover?: string
  tags: string[]
  published: boolean
  pinned?: boolean
  /** সংবাদ | গবেষণা | সংরক্ষণ */
  kind?: 'news' | 'research' | 'conservation'
  /** মূল প্রকাশক */
  publisher?: string
  sourceUrl?: string
  publishedAt?: string
  views?: number
  createdAt: string
}

/** “জেনো” — তথ্য জমা / ফিডব্যাক */
export type Jeno = {
  id: string
  name: string
  contact?: string
  topic: string
  message: string
  speciesSlug?: string
  /** তথ্য জমা | ভুল সংশোধন | ফিচার অনুরোধ | সমস্যা | অন্যান্য */
  kind?: 'info' | 'correction' | 'feature' | 'problem' | 'other'
  status: 'new' | 'read' | 'done'
  createdAt: string
}

/* ------------------------------------------------------------------ */
/* এআই — প্রশ্ন, উত্তর, পর্যালোচনা                                        */
/* ------------------------------------------------------------------ */

export type AiQuestionStatus =
  | 'new'            // নতুন প্রশ্ন
  | 'ai_checking'    // এআই যাচাই করছে
  | 'admin_review'   // অ্যাডমিন পর্যালোচনায়
  | 'answer_ready'   // উত্তর প্রস্তুত
  | 'answered'       // উত্তর জানানো হয়েছে
  | 'need_info'      // অতিরিক্ত তথ্য প্রয়োজন
  | 'resolved'       // সমাধান সম্পন্ন

export type AiQuestion = {
  id: string
  question: string
  /** প্রশ্নকারীর পরিচয় (লগইন থাকলে) */
  userId?: string | null
  userName?: string
  userKey: string
  /** গেস্ট ট্র্যাকিং কোড — লিংক দিয়ে উত্তর দেখবে */
  trackCode: string
  imageUrl?: string
  /** এআই-এর প্রাথমিক বিশ্লেষণ */
  aiAnalysis?: string
  /** কোন তথ্য পাওয়া যায়নি */
  missingInfo?: string
  /** অনুসন্ধানে পাওয়া ফল */
  searchResults?: { slug: string; nameBn: string; type: string }[]
  status: AiQuestionStatus
  answer?: string
  answeredBy?: string
  answeredAt?: string
  /** উত্তর জ্ঞানভান্ডারে যুক্ত করার সুপারিশ */
  suggestToKnowledgeBase?: boolean
  speciesSlug?: string
  createdAt: string
}

/* ------------------------------------------------------------------ */
/* সাইট সেটিংস                                                          */
/* ------------------------------------------------------------------ */

export type SocialLink = { label: string; url: string; icon?: string }

export type SiteSettings = {
  siteName: string
  siteNameEn: string
  tagline: string
  logoUrl: string
  coverUrl?: string
  headerNotice: string
  headerNoticeActive: boolean
  about: string
  socials: SocialLink[]
  contactEmail: string
  aiName: string
  aiIntro: string
  footerNote: string
}

/* ------------------------------------------------------------------ */
/* পরিসংখ্যান ও কভারেজ                                                   */
/* ------------------------------------------------------------------ */

export type Stats = {
  species: number
  birds: number
  animals: number
  plants: number
  places: number
  literature: number
  verifiedSpecies: number
  partialSpecies: number
  posts: number
  photos: number
  videos: number
  reels: number
  users: number
  partners: number
  pending: number
  aiPending: number
  reports: number
  observations: number
}

/** জীবগোষ্ঠীভিত্তিক তথ্য কভারেজ */
export type CoverageRow = {
  group: GroupId
  label: string
  total: number
  verified: number
  partial: number
  missingNameBn: number
  missingImage: number
  missingSource: number
  lastUpdated?: string
}

/** সিড ডেটার জন্য — group স্বয়ংক্রিয়ভাবে বসানো যায় */
export type SpeciesSeed = Omit<Species, 'group'> & { group?: GroupId }
