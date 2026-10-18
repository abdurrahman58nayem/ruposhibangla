import type {
  Species, Post, Comment, UserRecord, News, Jeno, SiteSettings, Stats, SpeciesType,
  PostCategory, PostKind, AiQuestion, Notification, SavedItem, Report, Observation,
  AuditLog, CoverageRow, GroupId, DataStatus, Conservation,
} from '@/lib/types'
import type { SpeciesSyncOptions, SpeciesSyncResult } from './seed-sync'

export type SpeciesQuery = {
  type?: SpeciesType | 'all'
  group?: GroupId | 'all'
  category?: string
  conservation?: Conservation | 'all'
  q?: string
  dataStatus?: DataStatus | 'unverified' | 'all'
  featured?: boolean
  /** true হলে শুধু ভিডিও-আছে এমন প্রজাতি (রিলস ফিডের জন্য) */
  hasVideo?: boolean
  limit?: number
  offset?: number
}

export type PostQuery = {
  status?: 'approved' | 'pending' | 'rejected' | 'archived' | 'all'
  category?: PostCategory | 'all'
  kind?: PostKind | 'all'
  group?: GroupId | 'all'
  speciesSlug?: string
  authorId?: string
  authorKey?: string
  q?: string
  cursor?: string | null
  limit?: number
}

export type PostPage = { items: Post[]; nextCursor: string | null }

export interface Repo {
  readonly kind: 'json' | 'neon'

  // --- lifecycle ---
  init(): Promise<void>

  // --- species / জ্ঞানভান্ডার ---
  listSpecies(q: SpeciesQuery): Promise<Species[]>
  countSpecies(q: SpeciesQuery): Promise<number>
  getSpecies(slug: string): Promise<Species | null>
  upsertSpecies(s: Species): Promise<Species>
  /** Replace only the media JSON column, preserving all other species fields. */
  setSpeciesMedia(slug: string, media: Species['media']): Promise<Species | null>
  deleteSpecies(slug: string): Promise<void>
  bumpSpeciesViews(slug: string): Promise<void>
  listCategories(type?: SpeciesType): Promise<{ name: string; count: number }[]>
  coverage(): Promise<CoverageRow[]>

  // --- posts ---
  listPosts(q: PostQuery): Promise<PostPage>
  getPost(id: string): Promise<Post | null>
  createPost(p: Post): Promise<Post>
  updatePost(id: string, patch: Partial<Post>): Promise<Post | null>
  deletePost(id: string): Promise<void>
  toggleLike(postId: string, key: string): Promise<{ liked: boolean; likes: number }>
  hasLiked(postId: string, key: string): Promise<boolean>
  listLikedKeys?(key: string): Promise<string[]>

  // --- comments ---
  listComments(postId: string): Promise<Comment[]>
  addComment(c: Comment): Promise<Comment>
  deleteComment(id: string): Promise<void>
  /** মন্তব্য আপডেট — প্রজাতি শনাক্তকরণ যাচাইসহ (§16) */
  updateComment(id: string, patch: Partial<Comment>): Promise<Comment | null>

  // --- users ---
  createUser(u: UserRecord): Promise<UserRecord>
  getUserByUsername(username: string): Promise<UserRecord | null>
  getUserById(id: string): Promise<UserRecord | null>
  listUsers(): Promise<UserRecord[]>
  updateUser(id: string, patch: Partial<UserRecord>): Promise<UserRecord | null>
  deleteUser(id: string): Promise<void>

  // --- follows / block ---
  toggleFollow(followerKey: string, userId: string): Promise<boolean>
  isFollowing(followerKey: string, userId: string): Promise<boolean>
  followingIds(followerKey: string): Promise<string[]>
  toggleBlock?(blockerKey: string, userId: string): Promise<boolean>
  blockedIds?(blockerKey: string): Promise<string[]>

  // --- news ---
  listNews(opts?: { publishedOnly?: boolean; limit?: number }): Promise<News[]>
  getNews(slug: string): Promise<News | null>
  upsertNews(n: News): Promise<News>
  deleteNews(id: string): Promise<void>

  // --- jeno / ফিডব্যাক ---
  listJeno(): Promise<Jeno[]>
  createJeno(j: Jeno): Promise<Jeno>
  updateJeno(id: string, patch: Partial<Jeno>): Promise<Jeno | null>
  deleteJeno(id: string): Promise<void>

  // --- saved ---
  toggleSave?(item: SavedItem): Promise<boolean>
  listSaves?(userKey: string): Promise<SavedItem[]>

  // --- reports ---
  createReport?(r: Report): Promise<Report>
  listReports?(): Promise<Report[]>
  updateReport?(id: string, patch: Partial<Report>): Promise<Report | null>

  // --- observations / পর্যবেক্ষণ ---
  createObservation?(o: Observation): Promise<Observation>
  listObservations?(opts?: { status?: string; userKey?: string; speciesSlug?: string; limit?: number }): Promise<Observation[]>
  updateObservation?(id: string, patch: Partial<Observation>): Promise<Observation | null>

  // --- notifications ---
  addNotification?(n: Notification): Promise<Notification>
  listNotifications?(userKey: string): Promise<Notification[]>
  markNotificationsRead?(userKey: string): Promise<void>

  // --- AI questions ---
  createAiQuestion?(q: AiQuestion): Promise<AiQuestion>
  listAiQuestions?(opts?: { status?: string }): Promise<AiQuestion[]>
  getAiQuestionByCode?(code: string): Promise<AiQuestion | null>
  updateAiQuestion?(id: string, patch: Partial<AiQuestion>): Promise<AiQuestion | null>

  // --- audit ---
  addAudit?(log: AuditLog): Promise<void>
  listAudit?(limit?: number): Promise<AuditLog[]>

  // --- settings ---
  getSettings(): Promise<SiteSettings>
  saveSettings(s: SiteSettings): Promise<void>

  // --- secrets (R2/AI ক্রেডেনশিয়াল — সার্ভার-সাইড, কখনো ক্লায়েন্টে যায় না) ---
  getSecret(name: string): Promise<string>
  setSecret(name: string, value: string): Promise<void>

  // --- misc ---
  stats(): Promise<Stats>
  search(q: string): Promise<{ species: Species[]; posts: Post[]; news: News[] }>
  reseed(): Promise<void>
  /**
   * সিড (কোড) থেকে ডেটাবেজে অনুপস্থিত প্রজাতিগুলো যোগ করে —
   * কোনো কিছু মুছে ফেলা হয় না, বিদ্যমান রেকর্ড অক্ষত থাকে
   * (`overwrite: true` দিলে কেবল সেগুলো সিড-ভার্সনে রিফ্রেশ হয়)।
   * `dryRun: true` দিলে শুধু হিসাব দেয়, কিছু লেখে না।
   */
  syncSpecies(opts?: SpeciesSyncOptions): Promise<SpeciesSyncResult>
}
