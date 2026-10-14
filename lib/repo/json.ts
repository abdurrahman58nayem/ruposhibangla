import fs from 'node:fs'
import path from 'node:path'
import type { Species, Post, Comment, UserRecord, News, Jeno, SiteSettings, Stats } from '@/lib/types'
import { DEFAULT_SETTINGS, SPECIES, SEED_POSTS, SEED_USERS, SEED_NEWS } from '@/data/seed'
import type { Repo, SpeciesQuery, PostQuery, PostPage } from './types'

type DB = {
  species: Species[]
  posts: Post[]
  comments: Comment[]
  likes: { postId: string; key: string; createdAt: string }[]
  users: UserRecord[]
  follows: { followerKey: string; userId: string; createdAt: string }[]
  news: News[]
  jeno: Jeno[]
  settings: SiteSettings
}

const DATA_DIR = path.join(process.cwd(), '.data')
const DATA_FILE = path.join(DATA_DIR, 'db.json')

const globalAny = globalThis as unknown as { __pb_db?: DB }

function emptyDb(): DB {
  return {
    species: [],
    posts: [],
    comments: [],
    likes: [],
    users: [],
    follows: [],
    news: [],
    jeno: [],
    settings: { ...DEFAULT_SETTINGS },
  }
}

function seedDb(): DB {
  return {
    species: SPECIES.map((s) => ({ ...s, views: 0 })),
    posts: SEED_POSTS.map((p) => ({ ...p })),
    comments: [
      {
        id: 'cm-1',
        postId: 'post-2',
        name: 'রাহাত হোসেন',
        body: 'খুব সুন্দর ছবি! আমাদের বাগানে প্রতিদিন সকালে দোয়েল দেখি।',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'cm-2',
        postId: 'post-2',
        name: 'নুসরাত জাহান',
        body: 'জাতীয় পাখি সম্পর্কে এত বিস্তারিত তথ্য আগে জানতাম না। ধন্যবাদ।',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'cm-3',
        postId: 'post-4',
        name: 'তানভীর আহমেদ',
        body: 'সুন্দরবনের বাঘ বাঁচাতে হলে আমাদের সচেতনতা বাড়াতেই হবে।',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'cm-4',
        postId: 'post-1',
        name: 'মিলন মিয়া',
        body: 'আমাদের গ্রামের এই দৃশ্য — সকালে ঘুম থেকে উঠে দেখি।',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
    likes: [],
    users: SEED_USERS.map((u) => ({ ...u })),
    follows: [],
    news: SEED_NEWS.map((n) => ({ ...n })),
    jeno: [],
    settings: { ...DEFAULT_SETTINGS },
  }
}

function read(): DB {
  if (globalAny.__pb_db) return globalAny.__pb_db
  let db: DB
  try {
    if (fs.existsSync(DATA_FILE)) {
      db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as DB
      db.settings = { ...DEFAULT_SETTINGS, ...(db.settings || {}) }
    } else {
      db = seedDb()
      write(db)
    }
  } catch {
    db = seedDb()
  }
  globalAny.__pb_db = db
  return db
}

function write(db: DB) {
  globalAny.__pb_db = db
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8')
  } catch {
    /* read-only fs (e.g. serverless) — keep in memory */
  }
}

function matchesSpecies(s: Species, q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const hay = [s.nameBn, s.nameEn, s.scientificName, s.category, s.summary, (s.otherNames || []).join(' '), s.habitat]
    .join(' ')
    .toLowerCase()
  return needle.split(/\s+/).every((t) => hay.includes(t))
}

function sortPostsDesc(posts: Post[]) {
  return [...posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export const jsonRepo: Repo = {
  kind: 'json',

  async init() {
    read()
  },

  // ---------- species ----------
  async listSpecies(q: SpeciesQuery): Promise<Species[]> {
    const db = read()
    let rows = db.species.filter((s) => {
      if (q.type && q.type !== 'all' && s.type !== q.type) return false
      if (q.category && q.category !== 'all' && s.category !== q.category) return false
      if (q.featured && !s.featured) return false
      if (q.q && !matchesSpecies(s, q.q)) return false
      return true
    })
    rows = [...rows].sort((a, b) => {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1
      return a.nameBn.localeCompare(b.nameBn, 'bn')
    })
    if (q.offset) rows = rows.slice(q.offset)
    if (q.limit) rows = rows.slice(0, q.limit)
    return rows
  },

  async countSpecies(q: SpeciesQuery): Promise<number> {
    const db = read()
    return db.species.filter((s) => {
      if (q.type && q.type !== 'all' && s.type !== q.type) return false
      if (q.category && q.category !== 'all' && s.category !== q.category) return false
      if (q.q && !matchesSpecies(s, q.q)) return false
      return true
    }).length
  },

  async getSpecies(slug) {
    return read().species.find((s) => s.slug === slug) || null
  },

  async upsertSpecies(s) {
    const db = read()
    const i = db.species.findIndex((x) => x.slug === s.slug)
    const next: Species = { ...s, updatedAt: new Date().toISOString() }
    if (i >= 0) db.species[i] = { ...db.species[i], ...next }
    else db.species.push({ ...next, createdAt: next.createdAt || new Date().toISOString() })
    write(db)
    return next
  },

  async deleteSpecies(slug) {
    const db = read()
    db.species = db.species.filter((s) => s.slug !== slug)
    write(db)
  },

  async bumpSpeciesViews(slug) {
    const db = read()
    const s = db.species.find((x) => x.slug === slug)
    if (s) {
      s.views = (s.views || 0) + 1
      write(db)
    }
  },

  async listCategories(type) {
    const db = read()
    const map = new Map<string, number>()
    db.species.filter((s) => !type || s.type === type).forEach((s) => map.set(s.category, (map.get(s.category) || 0) + 1))
    return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
  },

  // ---------- posts ----------
  async listPosts(q: PostQuery): Promise<PostPage> {
    const db = read()
    let rows = db.posts.filter((p) => {
      const status = q.status || 'approved'
      if (status !== 'all' && p.status !== status) return false
      if (q.category && q.category !== 'all' && p.category !== q.category) return false
      if (q.kind && q.kind !== 'all' && p.kind !== q.kind) return false
      if (q.speciesSlug && p.speciesSlug !== q.speciesSlug) return false
      if (q.authorId && p.authorId !== q.authorId) return false
      if (q.q) {
        const hay = [p.title, p.body, p.authorName, (p.tags || []).join(' '), p.location].join(' ').toLowerCase()
        if (!q.q.toLowerCase().split(/\s+/).every((t) => hay.includes(t))) return false
      }
      return true
    })
    rows = sortPostsDesc(rows)
    const limit = q.limit ?? 12
    let start = 0
    if (q.cursor) {
      const idx = rows.findIndex((p) => p.id === q.cursor)
      start = idx >= 0 ? idx + 1 : 0
    }
    const items = rows.slice(start, start + limit)
    const nextCursor = start + limit < rows.length ? items[items.length - 1]?.id ?? null : null
    return { items, nextCursor }
  },

  async getPost(id) {
    return read().posts.find((p) => p.id === id) || null
  },

  async createPost(p) {
    const db = read()
    db.posts.push(p)
    write(db)
    return p
  },

  async updatePost(id, patch) {
    const db = read()
    const i = db.posts.findIndex((p) => p.id === id)
    if (i < 0) return null
    db.posts[i] = { ...db.posts[i], ...patch }
    write(db)
    return db.posts[i]
  },

  async deletePost(id) {
    const db = read()
    db.posts = db.posts.filter((p) => p.id !== id)
    db.comments = db.comments.filter((c) => c.postId !== id)
    db.likes = db.likes.filter((l) => l.postId !== id)
    write(db)
  },

  async toggleLike(postId, key) {
    const db = read()
    const i = db.likes.findIndex((l) => l.postId === postId && l.key === key)
    const post = db.posts.find((p) => p.id === postId)
    let liked = false
    if (i >= 0) {
      db.likes.splice(i, 1)
      if (post) post.likes = Math.max(0, post.likes - 1)
    } else {
      db.likes.push({ postId, key, createdAt: new Date().toISOString() })
      if (post) post.likes = post.likes + 1
      liked = true
    }
    write(db)
    return { liked, likes: post?.likes ?? 0 }
  },

  async hasLiked(postId, key) {
    return read().likes.some((l) => l.postId === postId && l.key === key)
  },

  async listComments(postId) {
    return read()
      .comments.filter((c) => c.postId === postId)
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
  },

  async addComment(c) {
    const db = read()
    db.comments.push(c)
    const post = db.posts.find((p) => p.id === c.postId)
    if (post) post.comments += 1
    write(db)
    return c
  },

  async deleteComment(id) {
    const db = read()
    const c = db.comments.find((x) => x.id === id)
    db.comments = db.comments.filter((x) => x.id !== id)
    if (c) {
      const post = db.posts.find((p) => p.id === c.postId)
      if (post) post.comments = Math.max(0, post.comments - 1)
    }
    write(db)
  },

  // ---------- users ----------
  async createUser(u) {
    const db = read()
    db.users.push(u)
    write(db)
    return u
  },
  async getUserByUsername(username) {
    const u = username.trim().toLowerCase()
    return read().users.find((x) => x.username.toLowerCase() === u) || null
  },
  async getUserById(id) {
    return read().users.find((x) => x.id === id) || null
  },
  async listUsers() {
    return [...read().users].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  },
  async updateUser(id, patch) {
    const db = read()
    const i = db.users.findIndex((u) => u.id === id)
    if (i < 0) return null
    db.users[i] = { ...db.users[i], ...patch }
    write(db)
    return db.users[i]
  },
  async deleteUser(id) {
    const db = read()
    db.users = db.users.filter((u) => u.id !== id)
    db.follows = db.follows.filter((f) => f.userId !== id)
    write(db)
  },

  // ---------- follows ----------
  async toggleFollow(followerKey, userId) {
    const db = read()
    const i = db.follows.findIndex((f) => f.followerKey === followerKey && f.userId === userId)
    let following = false
    if (i >= 0) db.follows.splice(i, 1)
    else {
      db.follows.push({ followerKey, userId, createdAt: new Date().toISOString() })
      following = true
    }
    const user = db.users.find((u) => u.id === userId)
    if (user) user.followers = db.follows.filter((f) => f.userId === userId).length
    write(db)
    return following
  },
  async isFollowing(followerKey, userId) {
    return read().follows.some((f) => f.followerKey === followerKey && f.userId === userId)
  },
  async followingIds(followerKey) {
    return read()
      .follows.filter((f) => f.followerKey === followerKey)
      .map((f) => f.userId)
  },

  // ---------- news ----------
  async listNews(opts) {
    let rows = [...read().news].sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1
      return +new Date(b.createdAt) - +new Date(a.createdAt)
    })
    if (opts?.publishedOnly) rows = rows.filter((n) => n.published)
    if (opts?.limit) rows = rows.slice(0, opts.limit)
    return rows
  },
  async getNews(slug) {
    return read().news.find((n) => n.slug === slug) || null
  },
  async upsertNews(n) {
    const db = read()
    const i = db.news.findIndex((x) => x.slug === n.slug)
    if (i >= 0) db.news[i] = { ...db.news[i], ...n }
    else db.news.push(n)
    write(db)
    return n
  },
  async deleteNews(id) {
    const db = read()
    db.news = db.news.filter((n) => n.id !== id)
    write(db)
  },

  // ---------- jeno ----------
  async listJeno() {
    return [...read().jeno].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  },
  async createJeno(j) {
    const db = read()
    db.jeno.push(j)
    write(db)
    return j
  },
  async updateJeno(id, patch) {
    const db = read()
    const i = db.jeno.findIndex((j) => j.id === id)
    if (i < 0) return null
    db.jeno[i] = { ...db.jeno[i], ...patch }
    write(db)
    return db.jeno[i]
  },
  async deleteJeno(id) {
    const db = read()
    db.jeno = db.jeno.filter((j) => j.id !== id)
    write(db)
  },

  // ---------- settings ----------
  async getSettings() {
    return { ...DEFAULT_SETTINGS, ...read().settings }
  },
  async saveSettings(s) {
    const db = read()
    db.settings = s
    write(db)
  },

  // ---------- stats / search ----------
  async stats(): Promise<Stats> {
    const db = read()
    return {
      species: db.species.length,
      birds: db.species.filter((s) => s.category === 'পাখি').length,
      animals: db.species.filter((s) => s.type === 'prani' && s.category !== 'পাখি').length,
      plants: db.species.filter((s) => s.type === 'udbhid').length,
      posts: db.posts.filter((p) => p.status === 'approved').length,
      photos: db.posts.filter((p) => p.kind === 'photo' && p.status === 'approved').length,
      videos: db.posts.filter((p) => p.kind === 'video' && p.status === 'approved').length,
      users: db.users.length,
      partners: db.users.filter((u) => u.verified).length,
      pending: db.posts.filter((p) => p.status === 'pending').length,
    }
  },

  async search(q) {
    const db = read()
    const needle = q.trim().toLowerCase()
    if (!needle) return { species: [], posts: [], news: [] }
    const species = db.species.filter((s) => matchesSpecies(s, needle)).slice(0, 12)
    const posts = db.posts
      .filter((p) => p.status === 'approved')
      .filter((p) =>
        [p.title, p.body, p.authorName, (p.tags || []).join(' ')].join(' ').toLowerCase().includes(needle),
      )
      .slice(0, 12)
    const news = db.news
      .filter((n) => n.published)
      .filter((n) => [n.title, n.excerpt, n.body].join(' ').toLowerCase().includes(needle))
      .slice(0, 6)
    return { species, posts, news }
  },

  async reseed() {
    write(seedDb())
  },
}
