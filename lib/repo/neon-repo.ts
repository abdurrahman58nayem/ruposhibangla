import { getSql } from '@/lib/db/client'
import { resolveSpeciesImage, resolveSpeciesMedia } from '@/lib/species-image'
import type {
  Species, Post, Comment, UserRecord, News, Jeno, SiteSettings, Stats,
  AiQuestion, Notification, SavedItem, Report, Observation, AuditLog, CoverageRow,
} from '@/lib/types'
import { CATEGORIES, normalizeCategoryName } from '@/lib/categories'
import { normalizeConservationBn } from '@/lib/utils'
import { ensureAdminUser } from '@/lib/bootstrap'
import { DEFAULT_SETTINGS, SPECIES, SEED_POSTS, SEED_USERS, SEED_NEWS } from '@/data/seed'
import { verifySpeciesRecord } from '@/data/seed/verification'
import type { Repo, SpeciesQuery, PostQuery, PostPage } from './types'
import { pendingSeedSpecies, makeSyncResult, syncSummary, SEED_SPECIES_COUNT } from './seed-sync'
import type { SpeciesSyncOptions } from './seed-sync'

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

function parseJson<T>(v: unknown, fallback: T): T {
  try {
    return (JSON.parse(String(v || '')) as T) ?? fallback
  } catch {
    return fallback
  }
}

/** পুরোনো রেকর্ডে group না থাকলে বিভাগ থেকে অনুমান */
function inferGroup(s: { type?: string; category?: string }): any {
  const c = String(s.category || '').replace(/য়/g, 'য়')
  if (s.type === 'sthan') return 'nadi'
  if (s.type === 'sahitto') return 'sahitto'
  if (s.type === 'udbhid') {
    if (/ছত্রাক|শৈবাল|লাইকেন/.test(c)) return 'chhatrak'
    if (/অণুজীব|ব্যাকটেরি/.test(c)) return 'onujib'
    if (/বন|ম্যানগ্রোভ|তাল|বট|ঔষধি/.test(c)) return 'gachhbon'
    return 'udbhidful'
  }
  if (/পাখি/.test(c)) return 'pakhi'
  if (/মাছ/.test(c)) return 'machh'
  if (/স্তন্যপা/.test(c)) return 'stanapayi'
  if (/সরীসৃপ/.test(c)) return 'sarisrip'
  if (/উভচর/.test(c)) return 'ubhochor'
  if (/পতঙ্গ|কীট/.test(c)) return 'kitpotongo'
  if (/অমেরুদণ্ডী|মোলাস্ক|আর্থ্রোপড/.test(c)) return 'ameruddondi'
  return 'pranijogot'
}

function rowToSpecies(r: SpeciesRow): Species {
  const group = r.group || inferGroup({ type: r.type, category: r.category })
  return verifySpeciesRecord({
    slug: r.slug,
    type: r.type,
    group,
    category: normalizeCategoryName(r.category, group),
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
    conservationBn: r.conservation_bn ? normalizeConservationBn(r.conservation || 'NE', r.conservation_bn) : '',
    colorTags: P(r.color_tags),
    image: resolveSpeciesImage(r.slug, r.image),
    gallery: P(r.gallery),
    poetViews: P(r.poet_views),
    sources: P(r.sources),
    synonyms: P(r.synonyms),
    taxonomy: parseJson(r.taxonomy, {}),
    physical: r.physical || '',
    identification: r.identification || '',
    behavior: r.behavior || '',
    distribution: r.distribution || '',
    ecologicalRole: r.ecological_role || '',
    origin: r.origin || undefined,
    threats: r.threats || '',
    conservationActions: r.conservation_actions || '',
    media: resolveSpeciesMedia(r.slug, P(r.media)),
    dataStatus: r.data_status || 'partial',
    lastVerifiedAt: r.last_verified_at ? new Date(r.last_verified_at).toISOString() : undefined,
    conflictingInfo: r.conflicting_info || '',
    sensitive: !!r.sensitive,
    featured: !!r.featured,
    views: Number(r.views || 0),
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  })
}

function rowToAiQuestion(r: Record<string, any>): AiQuestion {
  return {
    id: r.id,
    question: r.question || '',
    userId: r.user_id || null,
    userName: r.user_name || '',
    userKey: r.user_key || '',
    trackCode: r.track_code || '',
    imageUrl: r.image_url || '',
    aiAnalysis: r.ai_analysis || '',
    missingInfo: r.missing_info || '',
    searchResults: P(r.search_results),
    status: r.status || 'new',
    answer: r.answer || '',
    answeredBy: r.answered_by || '',
    answeredAt: r.answered_at ? new Date(r.answered_at).toISOString() : undefined,
    suggestToKnowledgeBase: !!r.suggest_to_kb,
    speciesSlug: r.species_slug || '',
    createdAt: new Date(r.created_at).toISOString(),
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
    pinned: !!r.pinned,
    group: r.group || undefined,
    needsIdentification: !!r.needs_identification,
    identifiedSpecies: r.identified_species || '',
    createdAt: new Date(r.created_at).toISOString(),
  }
}

/** একাধিক পোস্টের লেখক-তথ্য এক কলেই জুড়ে দেয় */
function speciesHref(type?: string, slug?: string): string | undefined {
  if (!slug) return undefined
  if (type === 'udbhid') return `/udbhid/${slug}`
  if (type === 'sthan') return `/sthan/${slug}`
  if (type === 'sahitto') return `/sahitto/${slug}`
  return `/prani/${slug}`
}

async function withAuthors(rows: Post[]): Promise<Post[]> {
  const bare = (p: Post) => ({ ...p, author: { name: p.authorName, verified: false, avatar: '' } })
  try {
    const sql = getSql()
    const ids = [...new Set(rows.map((p) => p.authorId).filter(Boolean) as string[])]
    const slugs = [...new Set(rows.map((p) => p.speciesSlug).filter(Boolean) as string[])]
    const byId = new Map<string, any>()
    if (ids.length) {
      const ures = await sql`select id, username, name, verified, avatar from users where id = any(${ids})`
      asRows(ures).forEach((u: any) => byId.set(u.id, u))
    }
    const bySlug = new Map<string, any>()
    if (slugs.length) {
      const sres = await sql`select slug, type from species where slug = any(${slugs})`
      asRows(sres).forEach((r: any) => bySlug.set(r.slug, r))
    }
    return rows.map((p) => {
      const u = p.authorId ? byId.get(p.authorId) : undefined
      const sp = p.speciesSlug ? bySlug.get(p.speciesSlug) : undefined
      return {
        ...p,
        author: u
          ? { name: u.name, username: u.username, verified: !!u.verified, avatar: u.avatar || '' }
          : { name: p.authorName, verified: false, avatar: '' },
        speciesHref: speciesHref(sp?.type, p.speciesSlug || undefined),
      }
    })
  } catch {
    return rows.map(bare)
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

/**
 * Neon ডেটাবেজ ফাঁকা থাকলে (কোনো প্রজাতি ও কোনো পোস্ট নেই) একবার সিড ডেটা বসায়।
 *
 * কেন দরকার: GitHub Workflow শুধু টেবিল তৈরি করে (সার্ভার ছাড়াই)। প্রজাতির
 * রেকর্ড বসানোর জন্য আলাদা করে /api/admin/setup কল করতে হতো — এখন সাইট প্রথমবার
 * চালু হলেই নিজে থেকেই হয়ে যায়।
 *
 * নিরাপত্তা: species ও posts — দুটোই খালি থাকলে কেবল চালু হয়। কোনো একটিতে ডেটা
 * থাকলে কিছুই করা হয় না, ফলে কোনো বিদ্যমান তথ্য কখনো মুছে যায় না।
 */
async function seedIfEmptyNeon(repo: any): Promise<void> {
  try {
    const sql = getSql()
    const s = asRows(await sql`select count(*)::int as c from species`)
    const p = asRows(await sql`select count(*)::int as c from posts`)
    if (Number(s[0]?.c || 0) === 0 && Number(p[0]?.c || 0) === 0) {
      console.log(`[neon] ডেটাবেজ ফাঁকা — ${SEED_SPECIES_COUNT}টি প্রজাতি, চ্যানেল, পোস্ট ও খবর বসানো হচ্ছে…`)
      await repo.reseed()
      console.log('[neon] সিড সম্পন্ন')
    }
  } catch (e) {
    console.error('[neon] সিড যাচাই চলতে সমস্যা:', e)
  }
}

/**
 * সিড বাড়লে সেই নতুন রেকর্ডগুলো ডেটাবেজে নিজে থেকেই যোগ হয়।
 *
 * পটভূমি: আগে সিড কেবল ফাঁকা ডেটাবেজে বসতো, তাই পরে যোগ করা ব্যাচগুলো
 * (more-birds3…9, more-plants3, more-insects2 ইত্যাদি) লাইভ সাইটে কখনো
 * ঢুকতো না — সাইট পুরোনো সংখ্যা দেখাতে থাকতো। এই ধাপ সেই ফাঁক পূরণ করে।
 *
 * নিরাপত্তা: কেবল অনুপস্থিত স্লাগ INSERT হয়। বিদ্যমান রেকর্ড, ইউজারের পোস্ট,
 * মন্তব্য ও অ্যাকাউন্ট — কিছুতেই হাত দেওয়া হয় না। বন্ধ করতে: `AUTO_SYNC_SPECIES=0`।
 */
async function syncSpeciesOnBoot(repo: any): Promise<void> {
  if ((process.env.AUTO_SYNC_SPECIES || '1') === '0') return
  try {
    const check = await repo.syncSpecies({ dryRun: true })
    if (!check?.missing) return
    console.log(
      `[neon] সিডে ${check.missing}টি রেকর্ড বেশি পাওয়া গেছে — ডেটাবেজে যোগ করা হচ্ছে (মুছে ফেলা হচ্ছে না)…`,
    )
    const done = await repo.syncSpecies()
    console.log(`[neon] জ্ঞানভান্ডার সিঙ্ক: ${syncSummary(done)}`)
  } catch (e) {
    console.error('[neon] সিড সিঙ্ক চলতে সমস্যা:', e)
  }
}

export const neonRepo: Repo = {
  kind: 'neon',

  async init() {
    const sql = getSql()
    await sql`select 1`
    await ensureAdminUser(neonRepo)
    await seedIfEmptyNeon(neonRepo)
    await syncSpeciesOnBoot(neonRepo)
  },

  // ---------- species ----------
  async listSpecies(q: SpeciesQuery): Promise<Species[]> {
    const sql = getSql()
    const type = q.type && q.type !== 'all' ? q.type : null
    const cat = q.category && q.category !== 'all' ? q.category : null
    const grp = q.group && q.group !== 'all' ? q.group : null
    // “প্রাণীজগৎ” = সব প্রাণী
    const umbrella = q.group === 'pranijogot'
    const grpFilter = umbrella ? null : grp
    const typeFilter = umbrella ? 'prani' : type
    const cons = q.conservation && q.conservation !== 'all' ? q.conservation : null
    const st = q.dataStatus && q.dataStatus !== 'all' ? q.dataStatus : null
    const term = q.q ? `%${q.q.trim().toLowerCase()}%` : null
    const limit = q.limit ?? 5000
    const offset = q.offset ?? 0
    const rows = await sql`
      select * from species
      where (${typeFilter}::text is null or type = ${typeFilter})
        and (${cat}::text is null or category = ${cat})
        and (${grpFilter}::text is null or "group" = ${grpFilter})
        and (${cons}::text is null or conservation = ${cons})
        and (${st}::text is null or data_status = ${st})
        and (${term}::text is null or lower(
              name_bn || ' ' || coalesce(name_en,'') || ' ' || coalesce(scientific_name,'') || ' ' ||
              category || ' ' || coalesce(summary,'') || ' ' || coalesce(habitat,'') || ' ' || coalesce(other_names,'') || ' ' || coalesce(conservation,'') || ' ' || coalesce(conservation_bn,'')
            ) like ${term})
        and (${!!q.featured}::boolean = false or featured = true)
        and (${!q.hasVideo}::boolean = true or media like '%"kind":"video"%' or media like '%"kind": "video"%')
      order by featured desc, name_bn asc, slug asc
      limit ${limit} offset ${offset}
    `
    return asRows(rows).map(rowToSpecies)
  },

  async countSpecies(q: SpeciesQuery): Promise<number> {
    const sql = getSql()
    const type = q.type && q.type !== 'all' ? q.type : null
    const cat = q.category && q.category !== 'all' ? q.category : null
    const cons = q.conservation && q.conservation !== 'all' ? q.conservation : null
    const term = q.q ? `%${q.q.trim().toLowerCase()}%` : null
    const rows = await sql`
      select count(*)::int as c from species
      where (${type}::text is null or type = ${type})
        and (${cat}::text is null or category = ${cat})
        and (${q.group === 'pranijogot' ? null : (q.group && q.group !== 'all' ? q.group : null)}::text is null or "group" = ${q.group === 'pranijogot' ? null : (q.group && q.group !== 'all' ? q.group : null)})
        and (${q.group === 'pranijogot' ? 'prani' : null}::text is null or type = ${q.group === 'pranijogot' ? 'prani' : null})
        and (${cons}::text is null or conservation = ${cons})
        and (${(q.dataStatus && q.dataStatus !== 'all' ? q.dataStatus : null)}::text is null or data_status = ${(q.dataStatus && q.dataStatus !== 'all' ? q.dataStatus : null)})
        and (${term}::text is null or lower(
              name_bn || ' ' || coalesce(name_en,'') || ' ' || coalesce(scientific_name,'') || ' ' ||
              category || ' ' || coalesce(summary,'') || ' ' || coalesce(habitat,'') || ' ' || coalesce(other_names,'') || ' ' || coalesce(conservation,'') || ' ' || coalesce(conservation_bn,'')
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
      insert into species (slug, type, category, "group", name_bn, name_en, scientific_name, other_names,
        synonyms, taxonomy, summary, description, physical, identification, diet, behavior, reproduction,
        habitat, distribution, where_to_see, season, size_info, ecological_role, origin, conservation,
        conservation_bn, threats, conservation_actions, conflicting_info, sensitive,
        color_tags, image, gallery, media, poet_views, sources, data_status, last_verified_at, featured, views, updated_at)
      values (${s.slug}, ${s.type}, ${s.category}, ${s.group}, ${s.nameBn}, ${s.nameEn || ''}, ${s.scientificName || ''},
        ${J(s.otherNames)}, ${J(s.synonyms)}, ${JSON.stringify(s.taxonomy || {})},
        ${s.summary || ''}, ${s.description || ''}, ${s.physical || ''}, ${s.identification || ''}, ${s.diet || ''},
        ${s.behavior || ''}, ${s.reproduction || ''}, ${s.habitat || ''}, ${s.distribution || ''},
        ${s.whereToSee || ''}, ${s.season || ''}, ${s.sizeOrHeight || ''}, ${s.ecologicalRole || ''},
        ${s.origin || ''}, ${s.conservation || 'NE'}, ${s.conservationBn || ''}, ${s.threats || ''},
        ${s.conservationActions || ''}, ${s.conflictingInfo || ''}, ${!!s.sensitive},
        ${J(s.colorTags)}, ${s.image || ''}, ${J(s.gallery)}, ${J(s.media)}, ${J(s.poetViews)}, ${J(s.sources)},
        ${s.dataStatus || 'partial'}, ${s.lastVerifiedAt || null}, ${!!s.featured}, ${s.views || 0}, now())
      on conflict (slug) do update set
        type = excluded.type, category = excluded.category, name_bn = excluded.name_bn,
        name_en = excluded.name_en, scientific_name = excluded.scientific_name,
        other_names = excluded.other_names, summary = excluded.summary, description = excluded.description,
        habitat = excluded.habitat, diet = excluded.diet, size_info = excluded.size_info,
        season = excluded.season, where_to_see = excluded.where_to_see, reproduction = excluded.reproduction,
        conservation = excluded.conservation, conservation_bn = excluded.conservation_bn,
        color_tags = excluded.color_tags, image = excluded.image, gallery = excluded.gallery,
        poet_views = excluded.poet_views, sources = excluded.sources, featured = excluded.featured,
        "group" = excluded."group", synonyms = excluded.synonyms, taxonomy = excluded.taxonomy,
        physical = excluded.physical, identification = excluded.identification, behavior = excluded.behavior,
        distribution = excluded.distribution, ecological_role = excluded.ecological_role, origin = excluded.origin,
        threats = excluded.threats, conservation_actions = excluded.conservation_actions,
        conflicting_info = excluded.conflicting_info, sensitive = excluded.sensitive, media = excluded.media,
        data_status = excluded.data_status, last_verified_at = excluded.last_verified_at,
        views = excluded.views, updated_at = now()
    `
    return s
  },

  async setSpeciesMedia(slug, media) {
    const sql = getSql()
    await sql`update species set media = ${JSON.stringify(media || [])}::jsonb, updated_at = now() where slug = ${slug}`
    const rows = await sql`select * from species where slug = ${slug}`
    return asRows(rows)[0] ? rowToSpecies(asRows(rows)[0]) : null
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
    const map = new Map<string, number>()
    for (const r of asRows(rows)) {
      const norm = normalizeCategoryName(r.name)
      map.set(norm, (map.get(norm) || 0) + Number(r.count))
    }
    return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
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
            and (${(q.group && q.group !== 'all' ? q.group : null)}::text is null or "group" = ${(q.group && q.group !== 'all' ? q.group : null)})
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
        and (${(q.group && q.group !== 'all' ? q.group : null)}::text is null or "group" = ${(q.group && q.group !== 'all' ? q.group : null)})
        and (${term}::text is null or lower(
              coalesce(title,'') || ' ' || coalesce(body,'') || ' ' || coalesce(author_name,'') || ' ' ||
              coalesce(tags,'') || ' ' || coalesce(location,'')) like ${term})
      order by created_at desc
      limit ${limit} offset ${offset}
    `
    const items = await withAuthors(asRows(rows).map(rowToPost))
    const nextCursor = items.length === limit ? items[items.length - 1].id : null
    return { items, nextCursor }
  },

  async getPost(id) {
    const sql = getSql()
    const rows = await sql`select * from posts where id = ${id}`
    if (!asRows(rows)[0]) return null
    return (await withAuthors([rowToPost(asRows(rows)[0])]))[0]
  },

  async createPost(p) {
    const sql = getSql()
    await sql`
      insert into posts (id, kind, category, title, body, media_url, media_type, thumb_url, location,
        species_slug, tags, author_name, author_id, author_key, status, likes, comments, featured,
        pinned, "group", needs_identification, identified_species, created_at)
      values (${p.id}, ${p.kind}, ${p.category}, ${p.title || ''}, ${p.body || ''}, ${p.mediaUrl || ''},
        ${p.mediaType || ''}, ${p.thumbUrl || ''}, ${p.location || ''}, ${p.speciesSlug || ''}, ${J(p.tags)},
        ${p.authorName}, ${p.authorId || null}, ${p.authorKey || ''}, ${p.status}, ${p.likes || 0},
        ${p.comments || 0}, ${!!p.featured}, ${!!p.pinned}, ${p.group || ''}, ${!!p.needsIdentification},
        ${p.identifiedSpecies || ''}, ${p.createdAt})
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
        likes = ${next.likes || 0}, comments = ${next.comments || 0}, featured = ${!!next.featured},
        pinned = ${!!next.pinned}, "group" = ${next.group || ''},
        needs_identification = ${!!next.needsIdentification},
        identified_species = ${next.identifiedSpecies || ''}
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
      suggestedSpecies: r.suggested_species || '',
      suggestedName: r.suggested_name || '',
      idSource: (r.id_source as any) || undefined,
      idVerified: !!r.id_verified,
      verifiedBy: r.verified_by || null,
      verifiedAt: r.verified_at ? new Date(r.verified_at).toISOString() : null,
      createdAt: new Date(r.created_at).toISOString(),
    }))
  },

  async addComment(c) {
    const sql = getSql()
    await sql`
      insert into comments (id, post_id, name, user_id, body, created_at,
        suggested_species, suggested_name, id_source, id_verified, verified_by, verified_at)
      values (${c.id}, ${c.postId}, ${c.name}, ${c.userId || null}, ${c.body}, ${c.createdAt},
        ${c.suggestedSpecies || ''}, ${c.suggestedName || ''}, ${c.idSource || ''}, ${!!c.idVerified},
        ${c.verifiedBy || ''}, ${c.verifiedAt || null})
    `
    await sql`update posts set comments = comments + 1 where id = ${c.postId}`
    return c
  },

  async updateComment(id, patch) {
    const sql = getSql()
    const cur = asRows(await sql`select * from comments where id = ${id}`)[0]
    if (!cur) return null
    const next: any = {
      id,
      postId: cur.post_id,
      name: cur.name,
      userId: cur.user_id,
      body: cur.body,
      suggestedSpecies: cur.suggested_species || '',
      suggestedName: cur.suggested_name || '',
      idSource: cur.id_source || undefined,
      idVerified: !!cur.id_verified,
      verifiedBy: cur.verified_by || null,
      verifiedAt: cur.verified_at ? new Date(cur.verified_at).toISOString() : null,
      createdAt: new Date(cur.created_at).toISOString(),
      ...patch,
    }
    await sql`
      update comments set body = ${next.body},
        suggested_species = ${next.suggestedSpecies || ''},
        suggested_name = ${next.suggestedName || ''},
        id_source = ${next.idSource || ''},
        id_verified = ${!!next.idVerified},
        verified_by = ${next.verifiedBy || ''},
        verified_at = ${next.verifiedAt || null}
      where id = ${id}
    `
    return next as any
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
    asRows(rows)
      // `secret:` দিয়ে শুরু হওয়া কীগুলো গোপন (R2/AI ক্রেডেনশিয়াল) — কখনো সেটিংসে ফেরত দেওয়া হয় না
      .filter((r: any) => !String(r.key || '').startsWith('secret:'))
      .forEach((r: any) => {
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
  async getSecret(name) {
    const sql = getSql()
    const rows = asRows(await sql`select value from settings where key = ${'secret:' + name}`)
    return rows[0]?.value || ''
  },
  async setSecret(name, value) {
    const sql = getSql()
    if (value) {
      await sql`insert into settings (key, value) values (${'secret:' + name}, ${value})
        on conflict (key) do update set value = excluded.value`
    } else {
      await sql`delete from settings where key = ${'secret:' + name}`
    }
  },

  // ---------- coverage ----------
  async coverage(): Promise<CoverageRow[]> {
    const sql = getSql()
    const rows = await sql`
      select "group",
             count(*)::int as total,
             count(*) filter (where data_status = 'verified')::int as verified,
             count(*) filter (where data_status <> 'verified')::int as partial,
             count(*) filter (where coalesce(name_bn,'') = '')::int as missing_name_bn,
             count(*) filter (where coalesce(image,'') = '')::int as missing_image,
             count(*) filter (where coalesce(sources,'[]') in ('[]',''))::int as missing_source,
             max(updated_at) as last_updated
      from species group by "group"
      union all
      select 'pranijogot' as "group",
             count(*)::int as total,
             count(*) filter (where data_status = 'verified')::int as verified,
             count(*) filter (where data_status <> 'verified')::int as partial,
             count(*) filter (where coalesce(name_bn,'') = '')::int as missing_name_bn,
             count(*) filter (where coalesce(image,'') = '')::int as missing_image,
             count(*) filter (where coalesce(sources,'[]') in ('[]',''))::int as missing_source,
             max(updated_at) as last_updated
      from species where type = 'prani'`
    const map = new Map<string, any>()
    for (const r of asRows(rows)) map.set(r.group, r)
    return CATEGORIES.map((c) => {
      const r = map.get(c.id) as any
      return {
        group: c.id,
        label: c.label,
        total: Number(r?.total || 0),
        verified: Number(r?.verified || 0),
        partial: Number(r?.partial || 0),
        missingNameBn: Number(r?.missing_name_bn || 0),
        missingImage: Number(r?.missing_image || 0),
        missingSource: Number(r?.missing_source || 0),
        lastUpdated: r?.last_updated ? new Date(r.last_updated).toISOString() : undefined,
      }
    })
  },

  // ---------- save ----------
  async toggleSave(item) {
    const sql = getSql()
    const rows = await sql`delete from saves where user_key = ${item.userKey} and target_type = ${item.targetType} and target_id = ${item.targetId} returning id`
    if (asRows(rows).length) return false
    await sql`insert into saves (id, user_key, target_type, target_id) values (${item.id}, ${item.userKey}, ${item.targetType}, ${item.targetId})`
    return true
  },
  async listSaves(userKey) {
    const sql = getSql()
    const rows = await sql`select * from saves where user_key = ${userKey} order by created_at desc limit 200`
    return asRows(rows).map((r: any) => ({
      id: r.id, userKey: r.user_key, targetType: r.target_type, targetId: r.target_id,
      createdAt: new Date(r.created_at).toISOString(),
    }))
  },

  // ---------- report ----------
  async createReport(r) {
    const sql = getSql()
    await sql`insert into reports (id, target_type, target_id, reason, details, reporter_name, reporter_key, status)
      values (${r.id}, ${r.targetType}, ${r.targetId}, ${r.reason || ''}, ${r.details || ''}, ${r.reporterName || ''}, ${r.reporterKey || ''}, ${r.status || 'new'})`
    return r
  },
  async listReports() {
    const sql = getSql()
    const rows = await sql`select * from reports order by created_at desc limit 300`
    return asRows(rows).map((r: any) => ({
      id: r.id, targetType: r.target_type, targetId: r.target_id, reason: r.reason, details: r.details,
      reporterName: r.reporter_name, reporterKey: r.reporter_key, status: r.status,
      createdAt: new Date(r.created_at).toISOString(),
    }))
  },
  async updateReport(id, patch) {
    const sql = getSql()
    const sets: string[] = []
    const vals: any[] = []
    let i = 1
    const map: Record<string, string> = { status: 'status', reason: 'reason', details: 'details' }
    for (const [k, col] of Object.entries(map)) {
      if ((patch as any)[k] !== undefined) {
        sets.push(`${col} = $${i++}`)
        vals.push((patch as any)[k])
      }
    }
    if (!sets.length) return null
    vals.push(id)
    const rows = await sql(`update reports set ${sets.join(', ')} where id = $${i} returning *`, vals)
    const r = asRows(rows)[0] as any
    return r ? { id: r.id, status: r.status } as Report : null
  },

  // ---------- observation ----------
  async createObservation(o) {
    const sql = getSql()
    await sql`insert into observations (id, species_slug, guessed_name, name, user_id, author_key, photo_url,
      location, coarse_location, location_shared, notes, observed_at, uncertain, status, identified_by)
      values (${o.id}, ${o.speciesSlug || ''}, ${o.guessedName || ''}, ${o.name || ''}, ${o.userId || null},
        ${o.authorKey}, ${o.photoUrl || ''}, ${o.location || ''}, ${o.coarseLocation || ''},
        ${!!o.locationShared}, ${o.notes || ''}, ${o.observedAt}, ${!!o.uncertain}, ${o.status || 'submitted'}, ${o.identifiedBy || ''})`
    return o
  },
  async listObservations(opts = {}) {
    const sql = getSql()
    const status = opts.status && opts.status !== 'all' ? opts.status : null
    const userKey = opts.userKey || null
    const sp = opts.speciesSlug || null
    const limit = opts.limit ?? 100
    const rows = await sql`
      select * from observations
      where (${status}::text is null or status = ${status})
        and (${userKey}::text is null or author_key = ${userKey})
        and (${sp}::text is null or species_slug = ${sp})
      order by created_at desc limit ${limit}`
    return asRows(rows).map((r: any) => ({
      id: r.id, speciesSlug: r.species_slug, guessedName: r.guessed_name, name: r.name, userId: r.user_id,
      authorKey: r.author_key, photoUrl: r.photo_url, location: r.location, coarseLocation: r.coarse_location,
      locationShared: !!r.location_shared, notes: r.notes,
      observedAt: new Date(r.observed_at).toISOString(), uncertain: !!r.uncertain,
      status: r.status, identifiedBy: r.identified_by, createdAt: new Date(r.created_at).toISOString(),
    }))
  },
  async updateObservation(id, patch) {
    const sql = getSql()
    const sets: string[] = []
    const vals: any[] = []
    let i = 1
    const map: Record<string, string> = { status: 'status', speciesSlug: 'species_slug', identifiedBy: 'identified_by', notes: 'notes', uncertain: 'uncertain' }
    for (const [k, col] of Object.entries(map)) {
      if ((patch as any)[k] !== undefined) {
        sets.push(`${col} = $${i++}`)
        vals.push((patch as any)[k])
      }
    }
    if (!sets.length) return null
    vals.push(id)
    const rows = await sql(`update observations set ${sets.join(', ')} where id = $${i} returning *`, vals)
    const r = asRows(rows)[0] as any
    return r ? { id: r.id, status: r.status } as Observation : null
  },

  // ---------- notification ----------
  async addNotification(n) {
    const sql = getSql()
    await sql`insert into notifications (id, user_key, type, title, body, url, read)
      values (${n.id}, ${n.userKey}, ${n.type}, ${n.title}, ${n.body || ''}, ${n.url || ''}, ${!!n.read})`
    return n
  },
  async listNotifications(userKey) {
    const sql = getSql()
    const rows = await sql`select * from notifications where user_key = ${userKey} order by created_at desc limit 50`
    return asRows(rows).map((r: any) => ({
      id: r.id, userKey: r.user_key, type: r.type, title: r.title, body: r.body, url: r.url,
      read: !!r.read, createdAt: new Date(r.created_at).toISOString(),
    }))
  },
  async markNotificationsRead(userKey) {
    const sql = getSql()
    await sql`update notifications set read = true where user_key = ${userKey}`
  },

  // ---------- AI questions ----------
  async createAiQuestion(q) {
    const sql = getSql()
    await sql`insert into ai_questions (id, question, user_id, user_name, user_key, track_code, image_url,
      ai_analysis, missing_info, search_results, status, species_slug)
      values (${q.id}, ${q.question}, ${q.userId || null}, ${q.userName || ''}, ${q.userKey}, ${q.trackCode},
        ${q.imageUrl || ''}, ${q.aiAnalysis || ''}, ${q.missingInfo || ''}, ${J(q.searchResults)},
        ${q.status || 'new'}, ${q.speciesSlug || ''})`
    return q
  },
  async listAiQuestions(opts = {}) {
    const sql = getSql()
    const status = opts.status && opts.status !== 'all' ? opts.status : null
    const rows = await sql`select * from ai_questions
      where (${status}::text is null or status = ${status}) order by created_at asc limit 300`
    return asRows(rows).map(rowToAiQuestion)
  },
  async getAiQuestionByCode(code) {
    const sql = getSql()
    const rows = await sql`select * from ai_questions where track_code = ${code} limit 1`
    const r = asRows(rows)[0]
    return r ? rowToAiQuestion(r) : null
  },
  async updateAiQuestion(id, patch) {
    const sql = getSql()
    const sets: string[] = []
    const vals: any[] = []
    let i = 1
    const map: Record<string, string> = { status: 'status', answer: 'answer', answeredBy: 'answered_by', aiAnalysis: 'ai_analysis', missingInfo: 'missing_info', speciesSlug: 'species_slug' }
    for (const [k, col] of Object.entries(map)) {
      if ((patch as any)[k] !== undefined) {
        sets.push(`${col} = $${i++}`)
        vals.push((patch as any)[k])
      }
    }
    if ((patch as any).suggestToKnowledgeBase !== undefined) {
      sets.push(`suggest_to_kb = $${i++}`)
      vals.push(!!(patch as any).suggestToKnowledgeBase)
    }
    if (patch.answer) {
      sets.push(`answered_at = now()`)
    }
    if (!sets.length) return null
    vals.push(id)
    const rows = await sql(`update ai_questions set ${sets.join(', ')} where id = $${i} returning *`, vals)
    const r = asRows(rows)[0] as any
    if (r && patch.answer && r.user_key) {
      await sql`insert into notifications (id, user_key, type, title, body, url)
        values (${`ntf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`}, ${r.user_key}, 'ai_answer',
          'আপনার প্রশ্নের উত্তর পাওয়া গেছে', ${String(patch.answer).slice(0, 180)}, ${`/ai/q/${r.track_code}`})`
    }
    return r ? rowToAiQuestion(r) : null
  },

  // ---------- audit ----------
  async addAudit(log) {
    const sql = getSql()
    await sql`insert into audit_logs (id, actor_id, actor_name, action, target, detail)
      values (${log.id}, ${log.actorId || ''}, ${log.actorName || ''}, ${log.action}, ${log.target || ''}, ${log.detail || ''})`
  },
  async listAudit(limit = 100) {
    const sql = getSql()
    const rows = await sql`select * from audit_logs order by created_at desc limit ${limit}`
    return asRows(rows).map((r: any) => ({
      id: r.id, actorId: r.actor_id, actorName: r.actor_name, action: r.action,
      target: r.target, detail: r.detail, createdAt: new Date(r.created_at).toISOString(),
    }))
  },

  // ---------- block ----------
  async toggleBlock(blockerKey, userId) {
    const sql = getSql()
    const rows = await sql`delete from blocks where blocker_key = ${blockerKey} and user_id = ${userId} returning user_id`
    if (asRows(rows).length) return false
    await sql`insert into blocks (blocker_key, user_id) values (${blockerKey}, ${userId})`
    return true
  },
  async blockedIds(blockerKey) {
    const sql = getSql()
    const rows = await sql`select user_id from blocks where blocker_key = ${blockerKey}`
    return asRows(rows).map((r: any) => r.user_id)
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
    const [places, literature, verifiedSpecies, partialSpecies, reels, aiPending, reports, observations] = await Promise.all([
      one("select count(*)::int as c from species where type = 'sthan'"),
      one("select count(*)::int as c from species where type = 'sahitto'"),
      one("select count(*)::int as c from species where data_status = 'verified'"),
      one("select count(*)::int as c from species where data_status <> 'verified'"),
      one("select count(*)::int as c from posts where status = 'approved' and kind = 'reel'"),
      one("select count(*)::int as c from ai_questions where status not in ('answered','resolved')"),
      one("select count(*)::int as c from reports where status = 'new'"),
      one("select count(*)::int as c from observations"),
    ])
    return {
      species, birds, animals: nonBirdAnimals, plants, places, literature, verifiedSpecies, partialSpecies,
      posts, photos, videos, reels, users, partners, pending, aiPending, reports, observations,
    }
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

  /**
   * ⚠️ ধ্বংসাত্মক: species-সহ posts, comments, likes, follows, news সব মুছে
   * নতুন করে সিড বসায়। ইউজারের তৈরি কনটেন্ট হারিয়ে যায় —
   * সাধারণ ক্ষেত্রে এর বদলে `syncSpecies()` ব্যবহার করুন।
   */
  async reseed() {
    const sql = getSql()
    await sql`truncate species, posts, comments, likes, follows, news, jeno, observations, reports, saves, notifications restart identity`
    await sql`delete from audit_logs`
    await sql`delete from ai_questions`
    await sql`delete from blocks`
    for (const s of SPECIES) await this.upsertSpecies(s)
    for (const u of SEED_USERS) await this.createUser(u)
    for (const p of SEED_POSTS) await this.createPost(p)
    for (const n of SEED_NEWS) await this.upsertNews(n)
  },

  /**
   * সিড (কোড) ↔ Neon ডেটাবেজ সিঙ্ক — **কোনো কিছু মুছে ফেলা হয় না**।
   *
   * ডিফল্ট আচরণ: যে রেকর্ডগুলো ডেটাবেজে নেই, কেবল সেগুলো যোগ (INSERT) হয়।
   * আগে থেকে থাকা রেকর্ড অক্ষত থাকে, ফলে অ্যাডমিনের সম্পাদনা/ছবি/ভিউ নষ্ট হয় না।
   * `overwrite: true` দিলে বিদ্যমানগুলোও সিড-ভার্সনে রিফ্রেশ হয়।
   * `dryRun: true` দিলে শুধু হিসাব দেয়, কোনো লেখা হয় না।
   */
  async syncSpecies(opts: SpeciesSyncOptions = {}) {
    try {
      const sql = getSql()
      const rows = asRows(await sql`select slug from species`)
      const before = rows.length
      const { toAdd, toUpdate } = pendingSeedSpecies(
        rows.map((r: any) => String(r.slug)),
        !!opts.overwrite,
      )

      if (opts.dryRun) return makeSyncResult({ before, toAdd, toUpdate, dryRun: true })

      // ৮টি করে সমান্তরালে — ৬৬০টি রেকর্ডও কয়েক সেকেন্ডেই শেষ হয়
      const CHUNK = 8
      const targets = [...toAdd, ...toUpdate]
      for (let i = 0; i < targets.length; i += CHUNK) {
        await Promise.all(targets.slice(i, i + CHUNK).map((s) => this.upsertSpecies(s)))
      }
      return makeSyncResult({ before, toAdd, toUpdate })
    } catch (e: any) {
      return makeSyncResult({
        before: 0,
        toAdd: [],
        toUpdate: [],
        error: e?.message || 'সিঙ্ক ব্যর্থ',
      })
    }
  },
}
