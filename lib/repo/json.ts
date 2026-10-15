import fs from 'node:fs'
import { resolveSpeciesImage } from '@/lib/species-image'
import path from 'node:path'
import type {
  Species, Post, Comment, UserRecord, News, Jeno, SiteSettings, Stats,
  AiQuestion, Notification, SavedItem, Report, Observation, AuditLog, CoverageRow,
} from '@/lib/types'
import { CATEGORIES } from '@/lib/categories'
import { ensureAdminUser } from '@/lib/bootstrap'
import { DEFAULT_SETTINGS, SPECIES, SEED_POSTS, SEED_USERS, SEED_NEWS } from '@/data/seed'
import type { Repo, SpeciesQuery, PostQuery, PostPage } from './types'
import { pendingSeedSpecies, makeSyncResult } from './seed-sync'
import type { SpeciesSyncOptions } from './seed-sync'

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
  /** R2/AI-এর মতো গোপন কী — কখনো ক্লায়েন্টে পাঠানো হয় না */
  secrets: Record<string, string>
  aiQuestions: AiQuestion[]
  notifications: Notification[]
  saves: SavedItem[]
  reports: Report[]
  observations: Observation[]
  auditLogs: AuditLog[]
  blocks: { blockerKey: string; userId: string; createdAt: string }[]
}

/** “প্রাণীজগৎ” একটি ছাতা-ক্যাটাগরি — সব প্রাণীকেই বোঝায় */
function groupMatches(s: Species, group?: string): boolean {
  if (!group || group === 'all') return true
  if (group === 'pranijogot') return s.type === 'prani'
  return s.group === group
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
    secrets: {},
    aiQuestions: [],
    notifications: [],
    saves: [],
    reports: [],
    observations: [],
    auditLogs: [],
    blocks: [],
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
    secrets: {},
    aiQuestions: [],
    notifications: [],
    saves: [],
    reports: [],
    observations: [],
    auditLogs: [],
    blocks: [],
  }
}

/** পোস্টে লেখকের নাম/@username/নীল-টিক জুড়ে দেয় */
function speciesHref(type?: string, slug?: string): string | undefined {
  if (!slug) return undefined
  if (type === 'udbhid') return `/udbhid/${slug}`
  if (type === 'sthan') return `/sthan/${slug}`
  if (type === 'sahitto') return `/sahitto/${slug}`
  return `/prani/${slug}`
}

function attachAuthors(db: DB, rows: Post[]): Post[] {
  const byId = new Map(db.users.map((u) => [u.id, u]))
  const speciesById = new Map(db.species.map((sp) => [sp.slug, sp]))
  return rows.map((p) => {
    const u = p.authorId ? byId.get(p.authorId) : undefined
    const sp = speciesById.get(p.speciesSlug || '')
    return {
      ...p,
      author: u
        ? { name: u.name, username: u.username, verified: !!u.verified, avatar: u.avatar || '' }
        : { name: p.authorName, verified: false, avatar: '' },
      speciesHref: speciesHref(sp?.type, p.speciesSlug || undefined),
    }
  })
}

function read(): DB {
  if (globalAny.__pb_db) return globalAny.__pb_db
  let db: DB
  try {
    if (fs.existsSync(DATA_FILE)) {
      db = migrate(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as DB)
    } else {
      db = seedDb()
      write(db)
    }
  } catch {
    db = seedDb()
  }
  globalAny.__pb_db = migrate(db)
  return globalAny.__pb_db
}

/** পুরোনো .data/db.json-এ নতুন কালেকশন না থাকলে যোগ করে নেয় */
function migrate(db: DB): DB {
  db.species = (db.species || []).map((s) => ({
    ...s,
    image: resolveSpeciesImage(s.slug, s.image),
  }))
  db.posts ||= []
  db.comments ||= []
  db.likes ||= []
  db.users ||= []
  db.follows ||= []
  db.news ||= []
  db.jeno ||= []
  db.aiQuestions ||= []
  db.notifications ||= []
  db.saves ||= []
  db.reports ||= []
  db.observations ||= []
  db.auditLogs ||= []
  db.blocks ||= []
  db.settings = { ...DEFAULT_SETTINGS, ...(db.settings || {}) }
  db.secrets = { ...(db.secrets || {}) }
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
  const hay = [
    s.nameBn, s.nameEn, s.scientificName, s.category, s.summary, s.habitat,
    (s.otherNames || []).join(' '), (s.synonyms || []).join(' '), s.group || '',
    (s.poetViews || []).map((p) => `${p.poet} ${p.work || ''} ${p.note}`).join(' '),
  ]
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
    await ensureAdminUser(jsonRepo)
  },

  // ---------- species ----------
  async listSpecies(q: SpeciesQuery): Promise<Species[]> {
    const db = read()
    let rows = db.species.filter((s) => {
      if (q.type && q.type !== 'all' && s.type !== q.type) return false
      if (!groupMatches(s, q.group)) return false
      if (q.category && q.category !== 'all' && s.category !== q.category) return false
      if (q.dataStatus && q.dataStatus !== 'all' && (s.dataStatus || 'partial') !== q.dataStatus) return false
      if (q.featured && !s.featured) return false
      if (q.q && !matchesSpecies(s, q.q)) return false
      return true
    })
    rows = [...rows].sort((a, b) => {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1
      return a.nameBn.localeCompare(b.nameBn, 'bn') || a.slug.localeCompare(b.slug)
    })
    if (q.offset) rows = rows.slice(q.offset)
    if (q.limit) rows = rows.slice(0, q.limit)
    return rows
  },

  async countSpecies(q: SpeciesQuery): Promise<number> {
    const db = read()
    return db.species.filter((s) => {
      if (q.type && q.type !== 'all' && s.type !== q.type) return false
      if (!groupMatches(s, q.group)) return false
      if (q.category && q.category !== 'all' && s.category !== q.category) return false
      if (q.dataStatus && q.dataStatus !== 'all' && (s.dataStatus || 'partial') !== q.dataStatus) return false
      if (q.featured && !s.featured) return false
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
      if (q.authorKey && p.authorKey !== q.authorKey) return false
      if (q.group && q.group !== 'all' && p.group !== q.group) return false
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
    const items = attachAuthors(db, rows.slice(start, start + limit))
    const nextCursor = start + limit < rows.length ? items[items.length - 1]?.id ?? null : null
    return { items, nextCursor }
  },

  async getPost(id) {
    const db = read()
    const p = db.posts.find((x) => x.id === id)
    return p ? attachAuthors(db, [p])[0] : null
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

  async updateComment(id, patch) {
    const db = read()
    const c = db.comments.find((x) => x.id === id)
    if (!c) return null
    Object.assign(c, patch)
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
  async getSecret(name) {
    return read().secrets?.[name] || ''
  },
  async setSecret(name, value) {
    const db = read()
    db.secrets = db.secrets || {}
    if (value) db.secrets[name] = value
    else delete db.secrets[name]
    write(db)
  },

  // ---------- coverage ----------
  async coverage(): Promise<CoverageRow[]> {
    const db = read()
    const rows = CATEGORIES.map((c) => {
      const rows = db.species.filter((s) => (c.id === 'pranijogot' ? s.type === 'prani' : s.group === c.id))
      return {
        group: c.id,
        label: c.label,
        total: rows.length,
        verified: rows.filter((s) => (s.dataStatus || 'partial') === 'verified').length,
        partial: rows.filter((s) => (s.dataStatus || 'partial') !== 'verified').length,
        missingNameBn: rows.filter((s) => !s.nameBn || !s.nameBn.trim()).length,
        missingImage: rows.filter((s) => !s.image).length,
        missingSource: rows.filter((s) => !s.sources || s.sources.length === 0).length,
        lastUpdated: rows.map((s) => s.updatedAt || '').sort().pop() || undefined,
      }
    })
    return rows
  },

  // ---------- save ----------
  async toggleSave(item) {
    const db = read()
    const i = db.saves.findIndex((x) => x.userKey === item.userKey && x.targetType === item.targetType && x.targetId === item.targetId)
    if (i >= 0) {
      db.saves.splice(i, 1)
      write(db)
      return false
    }
    db.saves.push(item)
    write(db)
    return true
  },
  async listSaves(userKey) {
    return read().saves.filter((s) => s.userKey === userKey).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  },

  // ---------- report ----------
  async createReport(r) {
    const db = read()
    db.reports.push(r)
    write(db)
    return r
  },
  async listReports() {
    return [...read().reports].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  },
  async updateReport(id, patch) {
    const db = read()
    const i = db.reports.findIndex((r) => r.id === id)
    if (i < 0) return null
    db.reports[i] = { ...db.reports[i], ...patch }
    write(db)
    return db.reports[i]
  },

  // ---------- observation ----------
  async createObservation(o) {
    const db = read()
    db.observations.push(o)
    write(db)
    return o
  },
  async listObservations(opts = {}) {
    let rows = [...read().observations]
    if (opts.status && opts.status !== 'all') rows = rows.filter((o) => o.status === opts.status)
    if (opts.userKey) rows = rows.filter((o) => o.authorKey === opts.userKey)
    if (opts.speciesSlug) rows = rows.filter((o) => o.speciesSlug === opts.speciesSlug)
    rows.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    return opts.limit ? rows.slice(0, opts.limit) : rows
  },
  async updateObservation(id, patch) {
    const db = read()
    const i = db.observations.findIndex((o) => o.id === id)
    if (i < 0) return null
    db.observations[i] = { ...db.observations[i], ...patch }
    write(db)
    return db.observations[i]
  },

  // ---------- notification ----------
  async addNotification(n) {
    const db = read()
    db.notifications.push(n)
    write(db)
    return n
  },
  async listNotifications(userKey) {
    return read().notifications.filter((n) => n.userKey === userKey).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 50)
  },
  async markNotificationsRead(userKey) {
    const db = read()
    db.notifications.forEach((n) => {
      if (n.userKey === userKey) n.read = true
    })
    write(db)
  },

  // ---------- AI questions ----------
  async createAiQuestion(q) {
    const db = read()
    db.aiQuestions.push(q)
    write(db)
    return q
  },
  async listAiQuestions(opts = {}) {
    let rows = [...read().aiQuestions]
    if (opts.status && opts.status !== 'all') rows = rows.filter((q) => q.status === opts.status)
    return rows.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
  },
  async getAiQuestionByCode(code) {
    return read().aiQuestions.find((q) => q.trackCode === code) || null
  },
  async updateAiQuestion(id, patch) {
    const db = read()
    const i = db.aiQuestions.findIndex((q) => q.id === id)
    if (i < 0) return null
    db.aiQuestions[i] = { ...db.aiQuestions[i], ...patch }
    write(db)
    if (patch.answer && db.aiQuestions[i].userKey) {
      db.notifications.push({
        id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userKey: db.aiQuestions[i].userKey,
        type: 'ai_answer',
        title: 'আপনার প্রশ্নের উত্তর পাওয়া গেছে',
        body: String(patch.answer).slice(0, 120),
        url: `/ai/q/${db.aiQuestions[i].trackCode}`,
        read: false,
        createdAt: new Date().toISOString(),
      })
    }
    write(db)
    return db.aiQuestions[i]
  },

  // ---------- audit ----------
  async addAudit(log) {
    const db = read()
    db.auditLogs.push(log)
    if (db.auditLogs.length > 500) db.auditLogs = db.auditLogs.slice(-500)
    write(db)
  },
  async listAudit(limit = 100) {
    return [...read().auditLogs].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, limit)
  },

  // ---------- block ----------
  async toggleBlock(blockerKey, userId) {
    const db = read()
    const i = db.blocks.findIndex((b) => b.blockerKey === blockerKey && b.userId === userId)
    if (i >= 0) {
      db.blocks.splice(i, 1)
      write(db)
      return false
    }
    db.blocks.push({ blockerKey, userId, createdAt: new Date().toISOString() })
    write(db)
    return true
  },
  async blockedIds(blockerKey) {
    return read().blocks.filter((b) => b.blockerKey === blockerKey).map((b) => b.userId)
  },

  // ---------- stats / search ----------
  async stats(): Promise<Stats> {
    const db = read()
    return {
      species: db.species.length,
      birds: db.species.filter((s) => s.category === 'পাখি').length,
      animals: db.species.filter((s) => s.type === 'prani' && s.category !== 'পাখি').length,
      plants: db.species.filter((s) => s.type === 'udbhid').length,
      places: db.species.filter((s) => s.type === 'sthan').length,
      literature: db.species.filter((s) => s.type === 'sahitto').length,
      verifiedSpecies: db.species.filter((s) => (s.dataStatus || 'partial') === 'verified').length,
      partialSpecies: db.species.filter((s) => (s.dataStatus || 'partial') !== 'verified').length,
      posts: db.posts.filter((p) => p.status === 'approved').length,
      photos: db.posts.filter((p) => p.kind === 'photo' && p.status === 'approved').length,
      videos: db.posts.filter((p) => p.kind === 'video' && p.status === 'approved').length,
      users: db.users.length,
      partners: db.users.filter((u) => u.verified).length,
      reels: db.posts.filter((p) => p.kind === 'reel' && p.status === 'approved').length,
      pending: db.posts.filter((p) => p.status === 'pending').length,
      aiPending: (db.aiQuestions || []).filter((q) => q.status !== 'answered' && q.status !== 'resolved').length,
      reports: (db.reports || []).filter((r) => r.status === 'new').length,
      observations: (db.observations || []).length,
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

  /**
   * সিড থেকে অনুপস্থিত প্রজাতি যোগ করা (লোকাল JSON স্টোর)।
   * কোনো রেকর্ড মুছে ফেলা হয় না; বিদ্যমান রেকর্ড অক্ষত থাকে
   * (`overwrite: true` দিলে কেবল রিফ্রেশ হয়)।
   */
  async syncSpecies(opts: SpeciesSyncOptions = {}) {
    const db = read()
    const before = db.species.length
    const { toAdd, toUpdate } = pendingSeedSpecies(
      db.species.map((s) => s.slug),
      !!opts.overwrite,
    )

    if (opts.dryRun) return makeSyncResult({ before, toAdd, toUpdate, dryRun: true })

    try {
      for (const s of toAdd) db.species.push({ ...s, views: 0 })
      for (const s of toUpdate) {
        const i = db.species.findIndex((x) => x.slug === s.slug)
        if (i < 0) continue
        const views = db.species[i].views || 0
        db.species[i] = { ...db.species[i], ...s, views }
      }
      write(db)
      return makeSyncResult({ before, toAdd, toUpdate })
    } catch (e: any) {
      return makeSyncResult({ before, toAdd, toUpdate, error: e?.message || 'সিঙ্ক ব্যর্থ' })
    }
  },
}
