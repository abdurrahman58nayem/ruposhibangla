import type { Species, Post, Comment, UserRecord, News, Jeno, SiteSettings, Stats, SpeciesType, PostCategory, PostKind } from '@/lib/types'

export type SpeciesQuery = {
  type?: SpeciesType | 'all'
  category?: string
  q?: string
  featured?: boolean
  limit?: number
  offset?: number
}

export type PostQuery = {
  status?: 'approved' | 'pending' | 'rejected' | 'all'
  category?: PostCategory | 'all'
  kind?: PostKind | 'all'
  speciesSlug?: string
  authorId?: string
  q?: string
  cursor?: string | null
  limit?: number
}

export type PostPage = { items: Post[]; nextCursor: string | null }

export interface Repo {
  readonly kind: 'json' | 'neon'

  // --- lifecycle ---
  init(): Promise<void>

  // --- species ---
  listSpecies(q: SpeciesQuery): Promise<Species[]>
  countSpecies(q: SpeciesQuery): Promise<number>
  getSpecies(slug: string): Promise<Species | null>
  upsertSpecies(s: Species): Promise<Species>
  deleteSpecies(slug: string): Promise<void>
  bumpSpeciesViews(slug: string): Promise<void>
  listCategories(type?: SpeciesType): Promise<{ name: string; count: number }[]>

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

  // --- users ---
  createUser(u: UserRecord): Promise<UserRecord>
  getUserByUsername(username: string): Promise<UserRecord | null>
  getUserById(id: string): Promise<UserRecord | null>
  listUsers(): Promise<UserRecord[]>
  updateUser(id: string, patch: Partial<UserRecord>): Promise<UserRecord | null>
  deleteUser(id: string): Promise<void>

  // --- follows ---
  toggleFollow(followerKey: string, userId: string): Promise<boolean>
  isFollowing(followerKey: string, userId: string): Promise<boolean>
  followingIds(followerKey: string): Promise<string[]>

  // --- news ---
  listNews(opts?: { publishedOnly?: boolean; limit?: number }): Promise<News[]>
  getNews(slug: string): Promise<News | null>
  upsertNews(n: News): Promise<News>
  deleteNews(id: string): Promise<void>

  // --- jeno (জেনো — তথ্য জমা) ---
  listJeno(): Promise<Jeno[]>
  createJeno(j: Jeno): Promise<Jeno>
  updateJeno(id: string, patch: Partial<Jeno>): Promise<Jeno | null>
  deleteJeno(id: string): Promise<void>

  // --- settings ---
  getSettings(): Promise<SiteSettings>
  saveSettings(s: SiteSettings): Promise<void>

  // --- misc ---
  stats(): Promise<Stats>
  search(q: string): Promise<{ species: Species[]; posts: Post[]; news: News[] }>
  reseed(): Promise<void>
}
