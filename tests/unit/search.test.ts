import { describe, expect, it } from 'vitest'
import { SPECIES } from '@/data/seed'
import { matchesFolded, matchesName, namesMatchLoose } from '@/lib/bn-search'
import { iucnInfo } from '@/lib/utils'
import { normalizeCategoryName } from '@/lib/categories'
import type { Species } from '@/lib/types'

/**
 * খোঁজার রিগ্রেশন-পরীক্ষা: `lib/repo/json.ts`-এর `matchesSpecies` যেভাবে
 * খোঁজে, ঠিক সেভাবেই এখানে অনুকরণ করা হয়েছে (একই ঘর, একই দুই স্তর)।
 * উদ্দেশ্য — ভবিষ্যতে কেউ ফোল্ডিং বদলালে আগের ফল যেন হারিয়ে না যায়।
 */

function searchText(s: Species): string {
  const iucn = iucnInfo(s.conservation)
  const isCetacean = s.taxonomy?.order === 'Cetacea' || /তিমি|শুশুক|ডলফিন/.test(s.nameBn)
  const isBat = s.taxonomy?.order === 'Chiroptera' || /বাদুড়/.test(s.nameBn)
  return [
    s.nameBn, s.nameEn, s.scientificName, s.category, normalizeCategoryName(s.category, s.group),
    s.summary, s.habitat, s.description || '', s.identification || '',
    s.conservation, iucn.en, iucn.meaning, s.conservationBn || '',
    (s.otherNames || []).join(' '), (s.synonyms || []).join(' '), s.group || '',
    isCetacean ? 'তিমি শুশুক ডলফিন whale dolphin cetacea সামুদ্রিক স্তন্যপায়ী' : '',
    isBat ? 'বাদুড় bat chiroptera উড়ন্ত স্তন্যপায়ী' : '',
  ].join(' ')
}

function names(s: Species): string[] {
  return [s.nameBn, s.nameEn || '', s.scientificName || '', ...(s.otherNames || []), ...(s.synonyms || [])]
}

function matchesSpecies(s: Species, q: string): boolean {
  return matchesFolded(searchText(s), q) || matchesName(names(s), q)
}

function find(q: string): Species[] {
  return SPECIES.filter((s) => matchesSpecies(s, q))
}

describe('প্রজাতি-খোঁজা: বানান-ভেদের ফলাফল', () => {
  it('টাইপো/বানানভেদেও আসল প্রজাতি পাওয়া যায়', () => {
    const cases: Array<[string, string]> = [
      ['দয়েল', 'দোয়েল'],
      ['দোয়েল', 'দোয়েল'],
      ['বাদুর', 'বাদুড়'],
      ['সালিক', 'শালিক'],
      ['পেচা', 'পেঁচা'],
      ['ময়ুর', 'ময়ূর'],
      ['কৃষ্ণচুড়া', 'কৃষ্ণচূড়া'],
    ]
    for (const [query, expected] of cases) {
      const hits = find(query)
      expect(hits.length, `“${query}” কিছুই পায়নি`).toBeGreaterThan(0)
      expect(
        hits.some((h) => h.nameBn.includes(expected), ),
        `“${query}” → “${expected}” পাওয়া যাচ্ছে না (পেয়েছি: ${hits.slice(0, 5).map((h) => h.nameBn).join(', ')})`,
      ).toBe(true)
    }
  })

  it('শ্রেণির নামের বানানভেদেও শ্রেণিভুক্ত সব প্রাণী মেলে', () => {
    // “স্তনপায়ী” ও “স্তন্যপায়ী” — য-ফলার ভেদ; নামের বদলে **শ্রেণি** মেলে
    const a = find('স্তনপায়ী')
    const b = find('স্তন্যপায়ী')
    expect(a.length).toBeGreaterThan(100)
    expect(a.length).toBe(b.length)
    // বেশিরভাগই স্তন্যপায়ী শ্রেণির; বাকিগুলোতে শব্দটি অন্য ঘরে (যেমন সারাংশে) আছে
    const mammals = a.filter((s) => s.category === 'স্তন্যপায়ী')
    expect(mammals.length).toBeGreaterThan(130)
  })

  it('প্রচলিত প্রশ্নে ফল যেন কমে না', () => {
    const floor: Array<[string, number]> = [
      ['পাখি', 1000], ['মাছ', 600], ['বাঘ', 15], ['সাপ', 150], ['স্তন্যপায়ী', 149],
      ['হাঁস', 39], ['চাঁদ', 29], ['পেঁচা', 28], ['তিমি', 24], ['হাতি', 13],
      ['কাতলা', 5], ['শাপলা', 11], ['tiger', 11], ['pavo', 2],
      ['Icthyophaga', 1], ['রয়েল বেঙ্গল', 1],
    ]
    for (const [query, min] of floor) {
      expect(find(query).length, `“${query}” আগের চেয়ে কমে গেছে`).toBeGreaterThanOrEqual(min)
    }
  })

  it('ভিন্ন প্রাণীতে ভুল পথে পাঠায় না', () => {
    // ব্যঞ্জন-কঙ্কাল আলাদা হলে ঢিলা স্তরও মেলে না
    expect(namesMatchLoose('বাঁদর', 'বাদুড়')).toBe(false)
    expect(namesMatchLoose('হাতি', 'পাতি')).toBe(false)
    expect(namesMatchLoose('মাছ', 'মৌমাছি')).toBe(false)
    expect(matchesName('কাতলা', 'খলিসা')).toBe(false)
    expect(matchesName('দোয়েল', 'বাঘ')).toBe(false)
  })

  it('ইংরেজি ও বৈজ্ঞানিক নামে খোঁজা যায়', () => {
    expect(find('pavo').some((s) => /Pavo/i.test(s.scientificName || ''))).toBe(true)
    expect(find('Royal Bengal').length).toBeGreaterThan(0)
  })
})
