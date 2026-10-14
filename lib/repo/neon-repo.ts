import { getSql } from '@/lib/db/client'
import type { Species, Post, Comment, UserRecord, News, Jeno, SiteSettings, Stats } from '@/lib/types'
import { DEFAULT_SETTINGS, SPECIES, SEED_POSTS, SEED_USERS, SEED_NEWS } from '@/data/seed'
import type { Repo, SpeciesQuery, PostQuery, PostPage } from './types'

const J = (v: unknown) => JSON.stringify(v ?? [])
const P = (v: string | undefined | null): any[] => {
  try {
    const x = JSON.parse(v || '[]')
    return Array.isArray(x) ? x : []
  } catch {
    return []
  }
}

type SpeciesRow = Record<string, any>

function rowToSpecies(r: SpeciesRow): Species {
  return {
    slug: r.slug,
    type: r.type,
    category: r.category,
    nameBn: r.name_bn,
    nameEn: r.name_en || '',
    scientificName: r.scientific_name || '',
    otherNames: P(r.other_names),
    summary: r.summary || '',
    description: r.description || '',
    habitat: r.habitat || '',
    diet: r.diet || '',
    sizeOrHeight: r.size_info || '',
    season: r.season || '',
    whereToSee: r.where_to_see || '',
    reproduction: r.reproduction || '',
    conservation: r.conservation || 'NE',
    conservationBn: r.conservation_bn || '',
    colorTags: P(r.color_tags),
    image: r.image || '',
    gallery: P(r.gallery),
    poetViews: P(r.poet_views),
    sources: P(r.sources),
    featured: !!r.featured,
    views: Number(r.views || 0),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  }
}

function rowToPost(r: Record<string, any>): Post {
  return {
    id: r.id,
    kind: r.kind,
    category: r.category,
    title: r.title || '',
    body: r.body || '',
    mediaUrl: r.media_url || '',
    mediaType: r.media_type || undefined,
    thumbUrl: r.thumb_url || '',
    location: r.location || '',
    speciesSlug: r.species_slug || '',
    tags: P(r.tags),
    authorName: r.author_name,
    authorId: r.author_id || null,
    authorKey: r.author_key || '',
    status: r.status,
    likes: Number(r.likes || 0),
    comments: Number(r.comments || 0),
    featured: !!r.featured,
    createdAt: new Date(r.created_at).toISOString(),
  }
}

function rowToNews(r: Record<string, any>): News {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt || '',
    body: r.body || '',
    cover: r.cover || '',
    tags: P(r.tags),
    published: !!r.published,
    pinned: !!r.pinned,
    views: Number(r.views || 0),
    createdAt: new Date(r.created_at).toISOString(),
  }
}

function rowToUser(r: Record<string, any>): UserRecord {
  return {
    id: r.id,
    username: r.username,
    name: r.name,
    passwordHash: r.password_hash || '',
    email: r.email || '',
    role: r.role || 'user',
    verified: !!r.verified,
    avatar: r.avatar || '',
    bio: r.bio || '',
    location: r.location || '',
    followers: Number(r.followers || 0),
    following: Number(r.following || 0),
    createdAt: new Date(r.created_at).toISOString(),
  }
}

function rowToJeno(r: Record<string, any>): Jeno {
  return {
    id: r.id,
    name: r.name,
    contact: r.contact || '',
    topic: r.topic || '',
    message: r.message || '',
    speciesSlug: r.species_slug || '',
    status: r.status || 'new',
    createdAt: new Date(r.created_at).toISOString(),
  }
}


/** Neon HTTP ড্রাইভার বিভিন্ন ফরম্যাটে ফলাফল দিতে পারে — সবসময় অ্যারে-রূপে নেওয়া */
const asRows = (result: unknown): any[] => {
  if (Array.isArray(result)) return result as any[]
  const rows = (result as any)?.rows
  return Array.isArray(rows) ? rows : []
}

export const neonRepo: Repo = {
  kind: 'neon',

  async init() {
    const sql = getSql()
    await sql`select 1`
  },

  // ---------- species ----------
  async listSpecies(q: SpeciesQuery): Promise<Species[]> {
    const sql = getSql()
    const type = q.type && q.type !== 'all' ? q.type : null
    const cat = q.category && q.category !== 'all' ? q.category : null
    const term = q.q ? `%${q.q.trim().toLowerCase()}%` : null
    const limit = q.limit ?? 500
    const offset = q.offset ?? 0
    const rows = await sql`
      select * from species
      where (${type}::text is null or type = ${type})
        and (${cat}::text is null or category = ${cat})
        and (${term}::text is null or lower(
              name_bn || ' ' || coalesce(name_en,'') || ' ' || coalesce(scientific_name,'') || ' ' ||
              category || ' ' || coalesce(summary,'') || ' ' || coalesce(habitat,'') || ' ' || coalesce(other_names,'')
            ) like ${term})
        and (${!!q.featured}::boolean = false or featured = true)
      order by featured desc, name_bn asc
      limit ${limit} offset ${offset}
    `
    return asRows(rows).map(rowToSpecies)
  },

  async countSpecies(q: SpeciesQuery): Promise<number> {
    const sql = getSql()
    const type = q.type && q.type !== 'all' ? q.type : null
    const cat = q.category && q.category !== 'all' ? q.category : null
    const term = q.q ? `%${q.q.trim().toLowerCase()}%` : null
    const rows = await sql`
      select count(*)::int as c from species
      where (${type}::text is null or type = ${type})
        and (${cat}::text is null or category = ${cat})
        and (${term}::text is null or lower(
              name_bn || ' ' || coalesce(name_en,'') || ' ' || coalesce(scientific_name,'') || ' ' ||
              category || ' ' || coalesce(summary,'') || ' ' || coalesce(habitat,'') || ' ' || coalesce(other_names,'')
            ) like ${term})
    `
    return Number(asRows(rows)[0]?.c || 0)
  },

  async getSpecies(slug) {
    const sql = getSql()
    const rows = await sql`select * from species where slug = ${slug}`
    return asRows(rows)[0] ? rowToSpecies(asRows(rows)[0]) : null
  },

  async upsertSpecies(s) {
    const sql = getSql()
    await sql`
      insert into species (slug, type, category, name_bn, name_en, scientific_name, other_names, summary,
        description, habitat, diet, size_info, season, where_to_see, reproduction, conservation,
        conservation_bn, color_tags, image, gallery, poet_views, sources, featured, views, updated_at)
      values (${s.slug}, ${s.type}, ${s.category}, ${s.nameBn}, ${s.nameEn || ''}, ${s.scientificName || ''},
        ${J(s.otherNames)}, ${s.summary || ''}, ${s.description || ''}, ${s.habitat || ''}, ${s.diet || ''},
        ${s.sizeOrHeight || ''}, ${s.season || ''}, ${s.whereToSee || ''}, ${s.reproduction || ''},
        ${s.conservation || 'NE'}, ${s.conservationBn || ''}, ${J(s.colorTags)}, ${s.image || ''},
        ${J(s.gallery)}, ${J(s.poetViews)}, ${J(s.sources)}, ${!!s.featured}, ${s.views || 0}, now())
      on conflict (slug) do update set
        type = excluded.type, category = excluded.category, name_bn = excluded.name_bn,
        name_en = excluded.name_en, scientific_name = excluded.scientific_name,
        other_names = excluded.other_names, summary = excluded.summary, description = excluded.description,
        habitat = excluded.habitat, diet = excluded.diet, size_info = excluded.size_info,
        season = excluded.season, where_to_see = excluded.where_to_see, reproduction = excluded.reproduction,
        conservation = excluded.conservation, conservation_bn = excluded.conservation_bn,
        color_tags = excluded.color_tags, image = excluded.image, gallery = excluded.gallery,
        poet_views = excluded.poet_views, sources = excluded.sources, featured = excluded.featured,
        updated_at = now()
    `
    return s
  },

  async deleteSpecies(slug) {
    const sql = getSql()
    await sql`delete from species where slug = ${slug}`
  },

  async bumpSpeciesViews(slug) {
    const sql = getSql()
    await sql`update species set views = coalesce(views,0) + 1 where slug = ${slug}`
  },

  async listCategories(type) {
    const sql = getSql()
    const rows = await sql`
      select category as name, count(*)::int as count from species
      where (${(type ?? null)}::text is null or type = ${type ?? null})
      group by category order by count desc
    `
    return asRows(rows).map((r: any) => ({ name: r.name, count: Number(r.count) }))
  },

  // ---------- posts ----------
  async listPosts(q: PostQuery): Promise<PostPage> {
    const sql = getSql()
    const status = q.status && q.status !== 'all' ? q.status : null
    const cat = q.category && q.category !== 'all' ? q.category : null
    const kind = q.kind && q.kind !== 'all' ? q.kind : null
    const species = q.speciesSlug || null
    const author = q.authorId || null
    const term = q.q ? `%${q.q.trim().toLowerCase()}%` : null
    const limit = q.limit ?? 12
    let offset = 0
    if (q.cursor) {
      const cur = await sql`select created_at from posts where id = ${q.cursor}`
      if (asRows(cur)[0]) {
        const cnt = await sql`
          select count(*)::int as c from posts
          where (${status}::text is null or status = ${status})
            and (${cat}::text is null or category = ${cat})
            and (${kind}::text is null or kind = ${kind})
            and (${species}::text is null or species_slug = ${species})
            and (${author}::text is null or author_id = ${author})
            and created_at > ${asRows(cur)[0].created_at}
        `
        offset = Number(asRows(cnt)[0]?.c || 0)
      }
    }
    const rows = await sql`
      select * from posts
      where (${status}::text is null or status = ${status})
        and (${cat}::text is null or category = ${cat})
        and (${kind}::text is null or kind = ${kind})
        and (${species}::text is null or species_slug = ${species})
        and (${author}::text is null or author_id = ${author})
        and (${term}::text is null or lower(
              coalesce(title,'') || ' ' || coalesce(body,'') || ' ' || coalesce(author_name,'') || ' ' ||
              coalesce(tags,'') || ' ' || coalesce(location,'')) like ${term})
      order by created_at desc
      limit ${limit} offset ${offset}
    `
    const items = asRows(rows).map(rowToPost)
    const nextCursor = items.length === limit ? items[items.length - 1].id : null
    return { items, nextCursor }
  },

  async getPost(id) {
    const sql = getSql()
    const rows = await sql`select * from posts where id = ${id}`
    return asRows(rows)[0] ? rowToPost(asRows(rows)[0]) : null
  },

  async createPost(p) {
    const sql = getSql()
    await sql`
      insert into posts (id, kind, category, title, body, media_url, media_type, thumb_url, location,
        species_slug, tags, author_name, author_id, author_key, status, likes, comments, featured, created_at)
      values (${p.id}, ${p.kind}, ${p.category}, ${p.title || ''}, ${p.body || ''}, ${p.mediaUrl || ''},
        ${p.mediaType || ''}, ${p.thumbUrl || ''}, ${p.location || ''}, ${p.speciesSlug || ''}, ${J(p.tags)},
        ${p.authorName}, ${p.authorId || null}, ${p.authorKey || ''}, ${p.status}, ${p.likes || 0},
        ${p.comments || 0}, ${!!p.featured}, ${p.createdAt})
      on conflict (id) do nothing
    `
    return p
  },

  async updatePost(id, patch) {
    const sql = getSql()
    const cur = await sql`select * from posts where id = ${id}`
    if (!asRows(cur)[0]) return null
    const next = { ...rowToPost(asRows(cur)[0]), ...patch }
    await sql`
      update posts set kind = ${next.kind}, category = ${next.category}, title = ${next.title || ''},
        body = ${next.body || ''}, media_url = ${next.mediaUrl || ''}, media_type = ${next.mediaType || ''},
        thumb_url = ${next.thumbUrl || ''}, location = ${next.location || ''},
        species_slug = ${next.speciesSlug || ''}, tags = ${J(next.tags)}, author_name = ${next.authorName},
        author_id = ${next.authorId || null}, author_key = ${next.authorKey || ''}, status = ${next.status},
        likes = ${next.likes || 0}, comments = ${next.comments || 0}, featured = ${!!next.featured}
      where id = ${id}
    `
    return next
  },

  async deletePost(id) {
    const sql = getSql()
    await sql`delete from comments where post_id = ${id}`
    await sql`delete from likes where post_id = ${id}`
    await sql`delete from posts where id = ${id}`
  },

  async toggleLike(postId, key) {
    const sql = getSql()
    const existing = await sql`select 1 from likes where post_id = ${postId} and like_key = ${key}`
    if (asRows(existing)[0]) {
      await sql`delete from likes where post_id = ${postId} and like_key = ${key}`
      await sql`update posts set likes = greatest(likes - 1, 0) where id = ${postId}`
    } else {
      await sql`insert into likes (post_id, like_key) values (${postId}, ${key}) on conflict do nothing`
      await sql`update posts set likes = likes + 1 where id = ${postId}`
    }
    const rows = await sql`select likes from posts where id = ${postId}`
    return { liked: !asRows(existing)[0], likes: Number(asRows(rows)[0]?.likes || 0) }
  },

  async hasLiked(postId, key) {
    const sql = getSql()
    const rows = await sql`select 1 from likes where post_id = ${postId} and like_key = ${key}`
    return !!asRows(rows)[0]
  },

  async listComments(postId) {
    const sql = getSql()
    const rows = await sql`select * from comments where post_id = ${postId} order by created_at asc`
    return asRows(rows).map((r: any) => ({
      id: r.id,
      postId: r.post_id,
      name: r.name,
      userId: r.user_id,
      body: r.body,
      createdAt: new Date(r.created_at).toISOString(),
    }))
  },

  async addComment(c) {
    const sql = getSql()
    await sql`
      insert into comments (id, post_id, name, user_id, body, created_at)
      values (${c.id}, ${c.postId}, ${c.name}, ${c.userId || null}, ${c.body}, ${c.createdAt})
    `
    await sql`update posts set comments = comments + 1 where id = ${c.postId}`
    return c
  },

  async deleteComment(id) {
    const sql = getSql()
    const rows = await sql`select post_id from comments where id = ${id}`
    await sql`delete from comments where id = ${id}`
    if (asRows(rows)[0]) await sql`update posts set comments = greatest(comments - 1, 0) where id = ${asRows(rows)[0].post_id}`
  },

  // ---------- users ----------
  async createUser(u) {
    const sql = getSql()
    await sql`
      insert into users (id, username, name, password_hash, email, role, verified, avatar, bio, location, followers, following, created_at)
      values (${u.id}, ${u.username}, ${u.name}, ${u.passwordHash || ''}, ${u.email || ''}, ${u.role},
        ${!!u.verified}, ${u.avatar || ''}, ${u.bio || ''}, ${u.location || ''}, ${u.followers || 0}, ${u.following || 0}, ${u.createdAt})
      on conflict (username) do nothing
    `
    return u
  },
  async getUserByUsername(username) {
    const sql = getSql()
    const rows = await sql`select * from users where lower(username) = ${username.trim().toLowerCase()}`
    return asRows(rows)[0] ? rowToUser(asRows(rows)[0]) : null
  },
  async getUserById(id) {
    const sql = getSql()
    const rows = await sql`select * from users where id = ${id}`
    return asRows(rows)[0] ? rowToUser(asRows(rows)[0]) : null
  },
  async listUsers() {
    const sql = getSql()
    const rows = await sql`select * from users order by created_at desc`
    return asRows(rows).map(rowToUser)
  },
  async updateUser(id, patch) {
    const sql = getSql()
    const cur = await sql`select * from users where id = ${id}`
    if (!asRows(cur)[0]) return null
    const next = { ...rowToUser(asRows(cur)[0]), ...patch }
    await sql`
      update users set name = ${next.name}, username = ${next.username}, password_hash = ${next.passwordHash || ''},
        email = ${next.email || ''}, role = ${next.role}, verified = ${!!next.verified}, avatar = ${next.avatar || ''},
        bio = ${next.bio || ''}, location = ${next.location || ''}
      where id = ${id}
    `
    return next
  },
  async deleteUser(id) {
    const sql = getSql()
    await sql`delete from follows where user_id = ${id}`
    await sql`delete from users where id = ${id}`
  },

  // ---------- follows ----------
  async toggleFollow(followerKey, userId) {
    const sql = getSql()
    const existing = await sql`select 1 from follows where follower_key = ${followerKey} and user_id = ${userId}`
    if (asRows(existing)[0]) {
      await sql`delete from follows where follower_key = ${followerKey} and user_id = ${userId}`
    } else {
      await sql`insert into follows (follower_key, user_id) values (${followerKey}, ${userId}) on conflict do nothing`
    }
    const cnt = await sql`select count(*)::int as c from follows where user_id = ${userId}`
    await sql`update users set followers = ${Number(asRows(cnt)[0]?.c || 0)} where id = ${userId}`
    return !asRows(existing)[0]
  },
  async isFollowing(followerKey, userId) {
    const sql = getSql()
    const rows = await sql`select 1 from follows where follower_key = ${followerKey} and user_id = ${userId}`
    return !!asRows(rows)[0]
  },
  async followingIds(followerKey) {
    const sql = getSql()
    const rows = await sql`select user_id from follows where follower_key = ${followerKey}`
    return asRows(rows).map((r: any) => r.user_id)
  },

  // ---------- news ----------
  async listNews(opts) {
    const sql = getSql()
    const rows = await sql`
      select * from news
      where (${!!opts?.publishedOnly}::boolean = false or published = true)
      order by pinned desc, created_at desc
      limit ${opts?.limit ?? 100}
    `
    return asRows(rows).map(rowToNews)
  },
  async getNews(slug) {
    const sql = getSql()
    const rows = await sql`select * from news where slug = ${slug}`
    return asRows(rows)[0] ? rowToNews(asRows(rows)[0]) : null
  },
  async upsertNews(n) {
    const sql = getSql()
    await sql`
      insert into news (id, slug, title, excerpt, body, cover, tags, published, pinned, views, created_at)
      values (${n.id}, ${n.slug}, ${n.title}, ${n.excerpt || ''}, ${n.body || ''}, ${n.cover || ''},
        ${J(n.tags)}, ${!!n.published}, ${!!n.pinned}, ${n.views || 0}, ${n.createdAt})
      on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, body = excluded.body,
        cover = excluded.cover, tags = excluded.tags, published = excluded.published, pinned = excluded.pinned
    `
    return n
  },
  async deleteNews(id) {
    const sql = getSql()
    await sql`delete from news where id = ${id}`
  },

  // ---------- jeno ----------
  async listJeno() {
    const sql = getSql()
    const rows = await sql`select * from jeno order by created_at desc`
    return asRows(rows).map(rowToJeno)
  },
  async createJeno(j) {
    const sql = getSql()
    await sql`
      insert into jeno (id, name, contact, topic, message, species_slug, status, created_at)
      values (${j.id}, ${j.name}, ${j.contact || ''}, ${j.topic || ''}, ${j.message || ''},
        ${j.speciesSlug || ''}, ${j.status || 'new'}, ${j.createdAt})
    `
    return j
  },
  async updateJeno(id, patch) {
    const sql = getSql()
    const cur = await sql`select * from jeno where id = ${id}`
    if (!asRows(cur)[0]) return null
    const next = { ...rowToJeno(asRows(cur)[0]), ...patch }
    await sql`update jeno set status = ${next.status}, topic = ${next.topic}, message = ${next.message} where id = ${id}`
    return next
  },
  async deleteJeno(id) {
    const sql = getSql()
    await sql`delete from jeno where id = ${id}`
  },

  // ---------- settings ----------
  async getSettings() {
    const sql = getSql()
    const rows = await sql`select key, value from settings`
    const out: any = { ...DEFAULT_SETTINGS }
    asRows(rows).forEach((r: any) => {
      try {
        out[r.key] = JSON.parse(r.value)
      } catch {
        out[r.key] = r.value
      }
    })
    return out as SiteSettings
  },
  async saveSettings(s) {
    const sql = getSql()
    for (const [k, v] of Object.entries(s)) {
      await sql`insert into settings (key, value) values (${k}, ${JSON.stringify(v)})
        on conflict (key) do update set value = excluded.value`
    }
  },

  // ---------- stats / search ----------
  async stats(): Promise<Stats> {
    const sql = getSql()
    const one = async (query: string) => {
      const rows = await sql(query)
      return Number((rows as any)?.[0]?.c || 0)
    }
    const [species, birds, nonBirdAnimals, plants, posts, photos, videos, users, partners, pending] = await Promise.all([
      one("select count(*)::int as c from species"),
      one("select count(*)::int as c from species where category = 'পাখি'"),
      one("select count(*)::int as c from species where type = 'prani' and category <> 'পাখি'"),
      one("select count(*)::int as c from species where type = 'udbhid'"),
      one("select count(*)::int as c from posts where status = 'approved'"),
      one("select count(*)::int as c from posts where status = 'approved' and kind = 'photo'"),
      one("select count(*)::int as c from posts where status = 'approved' and kind = 'video'"),
      one("select count(*)::int as c from users"),
      one("select count(*)::int as c from users where verified = true"),
      one("select count(*)::int as c from posts where status = 'pending'"),
    ])
    return { species, birds, animals: nonBirdAnimals, plants, posts, photos, videos, users, partners, pending }
  },

  async search(q) {
    const term = `%${q.trim().toLowerCase()}%`
    const [species, posts, news] = await Promise.all([
      this.listSpecies({ q, limit: 12 }),
      (async () => {
        const sql = getSql()
        const rows = await sql`
          select * from posts where status = 'approved' and lower(
            coalesce(title,'') || ' ' || coalesce(body,'') || ' ' || coalesce(author_name,'') || ' ' || coalesce(tags,'')
          ) like ${term} order by created_at desc limit 12`
        return asRows(rows).map(rowToPost)
      })(),
      (async () => {
        const sql = getSql()
        const rows = await sql`
          select * from news where published = true and lower(title || ' ' || coalesce(excerpt,'') || ' ' || coalesce(body,''))
          like ${term} order by created_at desc limit 6`
        return asRows(rows).map(rowToNews)
      })(),
    ])
    return { species, posts, news }
  },

  async reseed() {
    const sql = getSql()
    await sql`truncate species, posts, comments, likes, follows, news, jeno restart identity`
    for (const s of SPECIES) await this.upsertSpecies(s)
    for (const u of SEED_USERS) await this.createUser(u)
    for (const p of SEED_POSTS) await this.createPost(p)
    for (const n of SEED_NEWS) await this.upsertNews(n)
  },
}
