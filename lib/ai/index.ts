import type { Species, News, Post, SiteSettings } from '@/lib/types'
import { IUCN, IUCN_ORDER, iucnInfo } from '@/lib/utils'
import { paletteToBnColors } from './colors'

export type Doc = {
  id: string
  type: 'species' | 'news' | 'post' | 'poet' | 'static'
  title: string
  text: string
  keywords: string
  href: string
}

const STOP = new Set([
  'আর','এবং','কি','কী','কে','এই','ওই','সে','তার','তাদের','হলো','হয়','করে','করেছে','আছে','কোথায়','কোথায়','কখন','কেন',
  'কেমন','কীভাবে','কিভাবে','বলুন','বল','বলো','দিন','আমি','আমার','আমরা','জানতে','চাই','সম্পর্কে','একটু','দয়া','প্লিজ',
  'অনেক','কিছু','না','হ্যাঁ','থেকে','যে','যার','ও','তো','তাও','আপনি','আপনার','এরা','এর','এটি','ওরা','কোন','কোনো','কত',
  'the','a','an','is','are','of','about','tell','me','what','where','when','how','please','and','or','in','to',
])

export function tokenize(q: string): string[] {
  return (q || '')
    .toLowerCase()
    .replace(/[।,;:!?()\[\]"'`~*|\\<>{}\n\t]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOP.has(t))
}

export function buildDocs(species: Species[], news: News[], posts: Post[], settings: SiteSettings): Doc[] {
  const docs: Doc[] = []

  species.forEach((s) => {
    const info = iucnInfo(s.conservation)
    docs.push({
      id: `species:${s.slug}`,
      type: 'species',
      title: `${s.nameBn} (${s.nameEn})`,
      text: [
        s.summary,
        s.description,
        `বৈজ্ঞানিক নাম: ${s.scientificName}`,
        `বিভাগ: ${s.category}`,
        `বাসস্থান: ${s.habitat}`,
        s.diet ? `খাদ্য: ${s.diet}` : '',
        s.sizeOrHeight ? `আকার: ${s.sizeOrHeight}` : '',
        s.season ? `মৌসুম: ${s.season}` : '',
        s.whereToSee ? `কোথায় দেখা যায়: ${s.whereToSee}` : '',
        `সংরক্ষণ অবস্থা (IUCN): ${info.code} — ${info.en} (${info.meaning})${s.conservationBn ? ` · ${s.conservationBn}` : ''}`,
        (s.otherNames || []).length ? `অন্যান্য নাম: ${(s.otherNames || []).join(', ')}` : '',
        `রং: ${(s.colorTags || []).join(', ')}`,
      ]
        .filter(Boolean)
        .join('। '),
      keywords: [
        s.nameBn, s.nameEn, s.scientificName, s.category,
        info.code, info.en, info.meaning,
        ...(s.otherNames || []), ...(s.colorTags || []),
      ]
        .filter(Boolean)
        .join(' '),
      href: s.type === 'prani' ? `/prani/${s.slug}` : `/udbhid/${s.slug}`,
    })
    ;(s.poetViews || []).forEach((pv, i) => {
      docs.push({
        id: `poet:${s.slug}:${i}`,
        type: 'poet',
        title: `কবির চোখে ${s.nameBn} — ${pv.poet}`,
        text: `${pv.poet}${pv.work ? ` (${pv.work})` : ''} — ${pv.note} প্রসঙ্গ: ${s.nameBn}।`,
        keywords: `${pv.poet} ${s.nameBn} কবি কবিতা সাহিত্য ${pv.work || ''}`,
        href: s.type === 'prani' ? `/prani/${s.slug}#kobi` : `/udbhid/${s.slug}#kobi`,
      })
    })
  })

  news.forEach((n) => {
    docs.push({
      id: `news:${n.slug}`,
      type: 'news',
      title: n.title,
      text: `${n.excerpt} ${n.body}`,
      keywords: `${n.title} ${(n.tags || []).join(' ')} খবর নিউজ প্রকৃতি বাংলাদেশ`,
      href: `/khobor/${n.slug}`,
    })
  })

  posts.forEach((p) => {
    docs.push({
      id: `post:${p.id}`,
      type: 'post',
      title: p.title || (p.body || '').slice(0, 60),
      text: `${p.body || ''} ${(p.tags || []).join(' ')} ${p.location || ''} — ${p.authorName}`,
      keywords: `${p.title || ''} ${(p.tags || []).join(' ')} ${p.authorName} ${p.location || ''}`,
      href: `/post/${p.id}`,
    })
  })

  docs.push({
    id: 'static:about',
    type: 'static',
    title: settings.siteName + ' সম্পর্কে',
    text: `${settings.about} এই সাইটে আছে প্রাণী ও উদ্ভিদের তথ্যভাণ্ডার, গ্রামবাংলার ছবি, কবির চোখে প্রকৃতি, খবর, এবং ছবি-ভিডিও শেয়ারের জায়গা।`,
    keywords: 'সাইট সম্পর্কে পরিচয় কী এই সাইট প্রকৃতি বাংলা রূপসী বাংলা',
    href: '/about',
  })

  docs.push({
    id: 'static:iucn',
    type: 'static',
    title: 'IUCN রেড লিস্টের শ্রেণিবিভাগ — কোন চিহ্নের অর্থ কী?',
    text:
      'IUCN Red List Categories and Criteria (Version 3.1) অনুযায়ী ৯টি শ্রেণি ও অর্থ: ' +
      IUCN_ORDER.map((c) => `${IUCN[c].code} — ${IUCN[c].en}: ${IUCN[c].meaning} (${IUCN[c].detailBn})`).join(' | '),
    keywords:
      'IUCN আইইউসিএন রেড লিস্ট শ্রেণিবিভাগ চিহ্ন অর্থ সংরক্ষণ অবস্থা EX EW CR EN VU NT LC DD NE Extinct Critically Endangered Vulnerable Near Threatened Least Concern Data Deficient Not Evaluated বিলুপ্ত সংকটাপন্ন বিপন্ন ঝুঁকিপূর্ণ',
    href: '/songrokkhon#iucn',
  })

  return docs
}

export function retrieve(docs: Doc[], query: string, k = 5): { doc: Doc; score: number }[] {
  const tokens = tokenize(query)
  if (!tokens.length) return []
  const raw = query.trim().toLowerCase()
  const scored = docs.map((doc) => {
    const title = doc.title.toLowerCase()
    const kw = doc.keywords.toLowerCase()
    const text = doc.text.toLowerCase()
    let score = 0
    for (const t of tokens) {
      if (title.includes(t)) score += 7
      if (kw.includes(t)) score += 5
      const occurrences = text.split(t).length - 1
      if (occurrences > 0) score += Math.min(occurrences, 6) * 1.2
    }
    if (raw && title.includes(raw)) score += 20
    if (raw && kw.includes(raw)) score += 12
    if (doc.type === 'species') score *= 1.15
    return { doc, score }
  })
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}

const TYPE_LABEL: Record<Doc['type'], string> = {
  species: 'প্রজাতি',
  news: 'খবর',
  post: 'পোস্ট',
  poet: 'কবির চোখে',
  static: 'তথ্য',
}

export function composeAnswer(query: string, hits: { doc: Doc; score: number }[]): string {
  if (!hits.length) {
    return [
      'এই প্রশ্নের নির্ভরযোগ্য উত্তর দিতে আরও যাচাই প্রয়োজন। আমার তথ্যভাণ্ডারে এ বিষয়ে এখনো যথেষ্ট তথ্য নেই — তাই অনুমান করে কোনো উত্তর তৈরি করব না।',
      '',
      'আপনি চাইলে প্রশ্নটি রূপসী বাংলার বিশেষজ্ঞ/অ্যাডমিন টিমের কাছে পাঠাতে পারেন।',
      '',
      'এর আগে আপনি—',
      '• প্রাণী বা উদ্ভিদের নাম (যেমন: দোয়েল, বাঘ, শাপলা) লিখে জিজ্ঞেস করতে পারেন',
      '• “কবির চোখে দোয়েল” লিখে সাহিত্যের দিকটি দেখতে পারেন',
      '• “জেনো” পাতা থেকে নতুন তথ্য পাঠাতে পারেন — আমরা যোগ করে দেব।',
    ].join('\n')
  }

  const top = hits[0].doc
  const parts: string[] = []

  if (top.type === 'species') {
    const text = top.text.split('। ')
    parts.push(`**${top.title}**`)
    parts.push(text.slice(0, 5).join('। ') + '।')
    const facts = text.slice(5)
    if (facts.length) parts.push(facts.join('। ') + '।')
  } else if (top.type === 'poet') {
    parts.push(`**${top.title}**`)
    parts.push(top.text)
  } else if (top.type === 'news') {
    parts.push(`**${top.title}** (খবর)`)
    parts.push(top.text.slice(0, 700))
  } else {
    parts.push(`**${top.title}**`)
    parts.push(top.text.slice(0, 600))
  }

  const others = hits.slice(1, 4)
  if (others.length) {
    parts.push('')
    parts.push('সম্পর্কিত আরও:')
    others.forEach((h) => parts.push(`• ${h.doc.title} — ${TYPE_LABEL[h.doc.type]}`))
  }

  parts.push('')
  parts.push(`বিস্তারিত: ${top.href}`)
  return parts.join('\n')
}

type LlmResult = { answer: string; mode: 'llm' | 'local' }

export async function answer(
  query: string,
  hits: { doc: Doc; score: number }[],
  opts?: { aiName?: string; intro?: string },
): Promise<LlmResult> {
  const local = composeAnswer(query, hits)
  const provider = (process.env.AI_PROVIDER || 'local').toLowerCase()
  const apiKey = process.env.AI_API_KEY
  if (provider === 'local' || !apiKey) return { answer: local, mode: 'local' }

  const base =
    provider === 'openai'
      ? 'https://api.openai.com/v1'
      : provider === 'openrouter'
        ? 'https://openrouter.ai/api/v1'
        : provider === 'gemini'
          ? 'https://generativelanguage.googleapis.com/v1beta/openai'
          : ''

  if (!base) return { answer: local, mode: 'local' }

  const context = hits
    .map((h, i) => `[${i + 1}] (${TYPE_LABEL[h.doc.type]}) ${h.doc.title}\n${h.doc.text}\nURL: ${h.doc.href}`)
    .join('\n\n')

  const system = [
    `তুমি "${opts?.aiName || 'প্রকৃতি সহচর'}" — বাংলাদেশের প্রকৃতি, প্রাণী ও উদ্ভিদ বিষয়ক একজন বাংলা সহকারী।`,
    'তুমি শুধুমাত্র নিচে দেওয়া তথ্যের ভিত্তিতে উত্তর দেবে। তথ্য না থাকলে সরাসরি বলবে যে জানো না, কল্পনা করবে না।',
    'উত্তর বাংলায়, সহজ ও বন্ধুত্বপূর্ণ ভাষায়, ২০০-৩৫০ শব্দের মধ্যে দেবে। প্রয়োজনে বুলেট পয়েন্ট ব্যবহার করবে।',
    'শেষে ব্যবহৃত তথ্যসূত্রের লিংক দেবে।',
  ].join(' ')

  const user = `প্রশ্ন: ${query}\n\nপ্রসঙ্গ:\n${context || '(কোনো প্রসঙ্গ পাওয়া যায়নি)'}`

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.4,
        max_tokens: 900,
      }),
    })
    if (!res.ok) return { answer: local, mode: 'local' }
    const data = (await res.json()) as any
    const out = data?.choices?.[0]?.message?.content
    if (typeof out === 'string' && out.trim()) return { answer: out.trim(), mode: 'llm' }
    return { answer: local, mode: 'local' }
  } catch {
    return { answer: local, mode: 'local' }
  }
}

export function matchByColors(palette: string[], species: Species[]) {
  const colors = paletteToBnColors(palette || [])
  if (!colors.length) return { colors: [], matches: [] as { species: Species; score: number }[] }
  const matches = species
    .map((s) => {
      const tags = s.colorTags || []
      let score = 0
      colors.forEach((c, idx) => {
        const weight = 1 / (idx + 1)
        if (tags.includes(c)) score += 3 * weight
      })
      return { species: s, score }
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
  return { colors, matches }
}
