/**
 * বাংলা খোঁজার সাধারণীকরণ — বানান-ভেদেও ফল মেলে, কিন্তু ভুল ফল নয়।
 *
 * সমস্যা: একই নামে নানা বানান চলে — ই/ঈ, উ/ঊ, শ/ষ/স, ন/ণ, ড়/র, য়/য,
 * চন্দ্রবিন্দু থাকে বা থাকে না, য-ফলা/র-ফলা লেখা হয় বা হয় না, আবার কখনো
 * একটা স্বর বাদ পড়ে (“দোয়েল” → “দয়েল”)। নিখুঁত বানান না মিললে আগে কিছুই
 * পাওয়া যেত না।
 *
 * সমাধান — দুই স্তর:
 *
 *  ১) **সংকীর্ণ (tight)** — `normalizeBn()`: NFC, ী→ি, ূ→ু, শ/ষ→স, ণ→ন, ৎ→ত,
 *     চন্দ্রবিন্দু ও নুকতা বাদ। কার, হসন্ত ও শব্দ-সীমা **অটুট**। সব ক্ষেত্রে
 *     (নাম-বর্ণনা-শ্রেণি) এটিই আগে চলে — ফল আগের মতোই থাকে, বরং বেশি।
 *
 *  ২) **ঢিলা (loose, কেবল নামের ঘরে)** — শব্দকে উচ্চারণ-প্রতীকে নামিয়ে
 *     (`phonBn`) এক-অক্ষরের ভুল পর্যন্ত সহ্য করা হয়: স্বর বাদ/যোগ, য-ফলা,
 *     ড়↔র, চন্দ্রবিন্দু-ভেদ। তাই “দোয়েল”≡“দয়েল”, “বাদুড়”≡“বাদুর”,
 *     “স্তন্যপায়ী”≡“স্তনপায়ী” — অথচ “বকুল”≢“বাকল”, “মাছ”≢“মৌমাছি”,
 *     “বাঁদর”≢“বাদুড়”। এই স্তর কেবল তখনই চলে যখন সংকীর্ণ স্তরে **কিছুই**
 *     মেলেনি, তাই ফল কখনো কমে না, শুধু বাড়ে।
 *
 * ⚠️ এটি শুধু **তুলনার** রূপ — প্রদর্শিত নাম কখনো বদলায় না, এবং এতে কোনো নতুন
 * তথ্য যোগ হয় না (তাই §“অনুমান নয়” নীতি অক্ষত)।
 */

const BN_DIGITS = '০১২৩৪৫৬৭৮৯'
const NUKTA = '\u09bc'
const HASANTA = '\u09cd'

/** স্বাধীন স্বরবর্ণ → প্রতীক */
const INDEPENDENT_VOWELS: Record<string, string> = {
  অ: 'o', আ: 'a', ই: 'i', ঈ: 'i', উ: 'u', ঊ: 'u', ঋ: 'ri',
  এ: 'e', ঐ: 'oi', ও: 'o', ঔ: 'ou', ৠ: 'ri', ঌ: 'li',
}

/** কার-চিহ্ন → প্রতীক */
const MATRAS: Record<string, string> = {
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri',
  'ৄ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
}

/** ব্যঞ্জনবর্ণ → প্রতীক (উচ্চারণ-নৈকট্য নয়, বানান-সহনশীলতা) */
const CONSONANTS: Record<string, string> = {
  ক: 'k', খ: 'kh', গ: 'g', ঘ: 'gh', ঙ: 'ng',
  চ: 'ch', ছ: 'chh', জ: 'j', ঝ: 'jh', ঞ: 'n',
  ট: 't', ঠ: 'th', ড: 'd', ঢ: 'dh', ণ: 'n',
  ত: 't', থ: 'th', দ: 'd', ধ: 'dh', ন: 'n',
  প: 'p', ফ: 'ph', ব: 'b', ভ: 'bh', ম: 'm',
  য: 'y', র: 'r', ল: 'l', শ: 's', ষ: 's', স: 's', হ: 'h',
  ৎ: 't', ৱ: 'w', ৰ: 'r',
}

/** নামের ঘরে শব্দ আলাদা করার চিহ্ন */
const NAME_SEP = /[\s,;·/|()\[\]—–]+/

/** ঢিলা স্তরে সবচেয়ে ছোট শব্দ */
export const LOOSE_MIN = 3

export function toAsciiDigits(text: string): string {
  return text.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
}

/**
 * সংকীর্ণ রূপ — সব ক্ষেত্রে ব্যবহৃত সাধারণ রূপান্তর।
 * শব্দ ও ফাঁক অটুট; শুধু বানানের প্রচলিত ভেদ এক করা হয়।
 */
export function normalizeBn(input: string | undefined | null): string {
  if (!input) return ''
  return String(input)
    .normalize('NFC')
    .replace(/ী/g, 'ি')
    .replace(/ূ/g, 'ু')
    .replace(/ৎ/g, 'ত')
    // য-ফলা: “স্তন্যপায়ী” ≡ “স্তনপায়ী” (পুরোনো cleanBn-এ এটিই ছিল)
    .replace(/\u09cd\u09af/g, '')
    .replace(/\u09df/g, 'য') // য় (পূর্ব-রচিত রূপ)
    .replace(/\u09dc/g, 'ড') // ড়
    .replace(/\u09dd/g, 'ঢ') // ঢ়
    .replace(/়/g, '') // বাকি নুকতা
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
}

/** উচ্চারণ-বিশ্লেষণ: ব্যঞ্জন-কঙ্কাল ও স্বর-ধারা আলাদা */
export type PhonParts = { cons: string; vowels: string; full: string }

/**
 * শব্দকে উচ্চারণ-প্রতীকে ভাঙে। ব্যঞ্জন ও স্বর আলাদা রাখা হয়, কারণ
 * বানান-ভেদে **ব্যঞ্জন কখনো বদলায় না**, শুধু স্বর বাদ পড়ে বা বদলায়।
 */
export function phonParts(input: string | undefined | null): PhonParts {
  if (!input) return { cons: '', vowels: '', full: '' }
  const s = String(input).normalize('NFC').toLowerCase()
  let cons = ''
  let vowels = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    const next = s[i + 1]

    if (ch === NUKTA) continue

    // য় / ড় / ঢ় = বেস + নুকতা
    if (next === NUKTA) {
      if (ch === 'য') { cons += 'y'; i += 1; continue }
      if (ch === 'ড' || ch === 'ঢ') { cons += 'r'; i += 1; continue }
      if (ch === 'ণ') { cons += 'n'; i += 1; continue }
    }

    if (ch === '\u09df') { cons += 'y'; continue }
    if (ch === '\u09dc' || ch === '\u09dd') { cons += 'r'; continue }

    // ো / ৌ দুই কোড-পয়েন্টে আসে (ে + া / ে + ৗ)
    if (ch === 'ে' && (next === 'া' || next === 'ৗ')) {
      vowels += next === 'া' ? 'o' : 'ou'
      i += 1
      continue
    }

    // হসন্ত + য-ফলা/র-ফলা: দুটোই বাদ (স্তন্যপায়ী ≡ স্তনপায়ী)
    if (ch === HASANTA) {
      const n = s[i + 1]
      if (n === 'য' || n === 'র') i += 1
      continue
    }

    if (ch === 'ঁ') { vowels += '~'; continue } // চন্দ্রবিন্দু আলাদা চিহ্ন
    if (ch === 'ং') { cons += 'ng'; continue }
    if (ch === 'ঃ' || ch === 'ঽ') continue

    const matra = MATRAS[ch]
    if (matra !== undefined) { vowels += matra; continue }
    const vowel = INDEPENDENT_VOWELS[ch]
    if (vowel !== undefined) { vowels += vowel; continue }

    const c = CONSONANTS[ch]
    if (c !== undefined) { cons += c; continue }

    if (/[a-z0-9]/.test(ch)) { cons += ch; continue }
    cons += '.' // শব্দ-সীমা: শব্দ জোড়া লেগে ভুল মিল হবে না
  }
  return { cons, vowels, full: cons + '\u0001' + vowels }
}

/**
 * উচ্চারণ-প্রতীক (ব্যঞ্জন+স্বর একসঙ্গে) — দেখার/পরীক্ষার সুবিধায়।
 */
export function phonBn(input: string | undefined | null): string {
  return phonParts(input).full
}

/** সাধারণ সম্পাদনা-দূরত্ব (Damerau–Levenshtein), নির্দিষ্ট সীমা ছাড়ালে বন্ধ */
function withinEdits(a: string, b: string, max: number): boolean {
  if (a === b) return true
  if (Math.abs(a.length - b.length) > max) return false
  const m = a.length
  const n = b.length
  // সারি-ভিত্তিক DP; max ছোট (১-২) বলে খরচ কম
  let prev2: number[] = []
  let prev: number[] = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur: number[] = [i]
    let rowMin = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
      // অদল-বদল (দইয়েল ↔ দোয়েল)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1)
      }
      cur.push(v)
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return false
    prev2 = prev
    prev = cur
  }
  return prev[n] <= max
}

/**
 * একই নামের সম্ভাব্য বানান কি না — **ব্যঞ্জন-কঙ্কাল হুবহু এক** হতে হবে,
 * স্বর-ধারায় সর্বোচ্চ এক ধাপ ভেদ চলবে (স্বর বাদ পড়া/যোগ হওয়া)।
 *
 * কেন এমন: “দোয়েল”→d,y,l আর “দয়েল”→d,y,l একই ব্যঞ্জন, শুধু স্বর বাদ;
 * “বাদুড়” ও “বাদুর” পুরোপুরি এক। কিন্তু “হাতি”(h,t) আর “পাতি”(p,t),
 * “বক”(b,k) আর “বকুল”(b,k,l) — ব্যঞ্জনই আলাদা, তাই ভুল মিল হয় না।
 */
export function sameNameVariant(a: string, b: string): boolean {
  const pa = phonParts(a)
  const pb = phonParts(b)
  if (!pa.cons || !pb.cons) return false
  if (pa.cons !== pb.cons) return false
  return vowelsCompatible(pa.vowels, pb.vowels)
}

/**
 * স্বর-ধারার সহনশীলতা।
 *  • চন্দ্রবিন্দু থাকলে/না থাকলে — শুধু ওই একটি চিহ্নের ভেদ মাফ (হাঁস ≡ হাস),
 *    বাকি স্বর হুবহু এক হতে হবে। তাই বাঁদর ≢ বাদুড় (a~ বনাম au)।
 *  • চন্দ্রবিন্দু না থাকলে — স্বরে সর্বোচ্চ এক ধাপ ভেদ (দোয়েল ≡ দয়েল)।
 */
function vowelsCompatible(a: string, b: string): boolean {
  if (a === b) return true
  if (a.includes('~') || b.includes('~')) {
    return a.replace(/~/g, '') === b.replace(/~/g, '')
  }
  return withinEdits(a, b, 1)
}

/** এক শব্দের দুই রূপ */
export type FoldedTerm = { raw: string; tight: string; phon: PhonParts }

/** প্রশ্নকে শব্দে ভেঙে দুই স্তরে নামানো */
export function foldTerms(query: string): FoldedTerm[] {
  return String(query || '')
    .split(NAME_SEP)
    .filter(Boolean)
    .map((raw) => ({ raw, tight: normalizeBn(raw), phon: phonParts(raw) }))
    .filter((t) => t.tight)
}

/**
 * সাধারণ লেখায় প্রশ্নের প্রতিটি শব্দ আছে কি না — সংকীর্ণ রূপে।
 * (আগের ব্যবহার: নাম, সারাংশ, আবাসস্থল, শ্রেণি, সংরক্ষণ-অবস্থা সব একসঙ্গে।)
 */
export function matchesFolded(haystack: string, query: string): boolean {
  const terms = foldTerms(query)
  if (!terms.length) return true
  const hay = normalizeBn(haystack)
  return terms.every((term) => hay.includes(term.tight))
}

/** নামের ঘরে সংকীর্ণ মিল — শব্দের যেকোনো জায়গায় */
export function namesMatchTight(names: string | string[], query: string): boolean {
  const terms = foldTerms(query)
  if (!terms.length) return true
  const hay = normalizeBn((Array.isArray(names) ? names : [names]).filter(Boolean).join(' '))
  return terms.every((term) => hay.includes(term.tight))
}

/** নামের ঘরে ঢিলা মিল — পুরো শব্দে, ব্যঞ্জন-কঙ্কাল হুবহু + স্বরে এক ধাপ */
export function namesMatchLoose(names: string | string[], query: string): boolean {
  const terms = foldTerms(query)
  if (!terms.length) return true
  const list = (Array.isArray(names) ? names : [names]).filter(Boolean)
  if (!list.length) return false
  const parts = list
    .flatMap((name) => String(name).split(NAME_SEP))
    .filter(Boolean)
    .map((tok) => phonParts(tok))
    .filter((p) => p.cons)
  return terms.every((term) => {
    const consLen = term.phon.cons.replace(/\./g, '').length
    // খুব ছোট শব্দে কঙ্কালও ছোট — গোলমাল এড়াতে বাদ; তবে চন্দ্রবিন্দুর
    // ভেদ (হাঁস ≡ হাস, চাঁদ ≡ চাদ) নিরাপদ, তাই সেটি ছোট শব্দেও চলে
    const onlyChandrabindu = /~/.test(term.phon.vowels) || parts.some((p) => /~/.test(p.vowels))
    if (consLen < LOOSE_MIN && !onlyChandrabindu) return false
    return parts.some(
      (p) => p.cons === term.phon.cons && vowelsCompatible(term.phon.vowels, p.vowels),
    )
  })
}

/**
 * নামের ঘরে দুই স্তরেই খোঁজা (একীভূত)। `matchesFolded`-এর চেয়ে ঢিলা,
 * কিন্তু পুরো শব্দে — তাই ভুল প্রাণীতে পৌঁছায় না।
 */
export function matchesName(names: string | string[], query: string): boolean {
  return namesMatchTight(names, query) || namesMatchLoose(names, query)
}

/** ঢিলা রূপ — বানান-ভেদের প্রতীক কেবল দেখা/পরীক্ষার জন্য */
export const foldBn = phonBn
