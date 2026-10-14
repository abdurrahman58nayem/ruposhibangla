// প্রকৃতি বাংলা — কোর টাইপ ডেফিনিশন

export type SpeciesType = 'prani' | 'udbhid'

export type Conservation =
  | 'EX'
  | 'EW'
  | 'CR'
  | 'EN'
  | 'VU'
  | 'NT'
  | 'LC'
  | 'DD'
  | 'NE'

export type PoetView = {
  poet: string
  work?: string
  note: string
  needsReview?: boolean
}

export type Species = {
  id?: string
  slug: string
  type: SpeciesType
  /** যেমন: পাখি, স্তন্যপায়ী, সরীসৃপ, উভচর, মাছ, পতঙ্গ / গাছ, ফুল, ফল, ঔষধি, জলজ, লতা */
  category: string
  nameBn: string
  nameEn: string
  scientificName: string
  otherNames?: string[]
  summary: string
  description: string
  habitat: string
  diet?: string
  sizeOrHeight?: string
  season?: string
  whereToSee?: string
  reproduction?: string
  conservation: Conservation
  conservationBn?: string
  colorTags: string[]
  image: string
  gallery?: string[]
  poetViews?: PoetView[]
  sources?: { title: string; url: string }[]
  featured?: boolean
  views?: number
  createdAt?: string
  updatedAt?: string
}

export type PostCategory = 'prani' | 'udbhid' | 'grambangla' | 'manush' | 'other'
export type PostKind = 'photo' | 'video' | 'note'
export type PostStatus = 'approved' | 'pending' | 'rejected'

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
  tags: string[]
  authorName: string
  authorId?: string | null
  authorKey: string
  status: PostStatus
  likes: number
  comments: number
  featured?: boolean
  createdAt: string
}

export type Comment = {
  id: string
  postId: string
  name: string
  userId?: string | null
  body: string
  createdAt: string
}

export type UserRole = 'admin' | 'partner' | 'user'

export type PublicUser = {
  id: string
  username: string
  name: string
  role: UserRole
  verified: boolean
  avatar?: string
  bio?: string
  location?: string
  createdAt: string
  followers: number
  following: number
}

export type UserRecord = PublicUser & {
  passwordHash: string
  email?: string
}

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
  views?: number
  createdAt: string
}

export type Jeno = {
  id: string
  name: string
  contact?: string
  topic: string
  message: string
  speciesSlug?: string
  status: 'new' | 'read' | 'done'
  createdAt: string
}

export type SocialLink = { label: string; url: string; icon?: string }

export type SiteSettings = {
  siteName: string
  siteNameEn: string
  tagline: string
  logoUrl: string
  headerNotice: string
  headerNoticeActive: boolean
  about: string
  socials: SocialLink[]
  contactEmail: string
  aiName: string
  aiIntro: string
  footerNote: string
}

export type Stats = {
  species: number
  birds: number
  animals: number
  plants: number
  posts: number
  photos: number
  videos: number
  users: number
  partners: number
  pending: number
}
