import { describe, expect, it } from 'vitest'
import {
  foldBn, foldTerms, matchesFolded, matchesName,
  namesMatchLoose, namesMatchTight, normalizeBn, toAsciiDigits,
} from '@/lib/bn-search'

describe('বাংলা খোঁজা — সংকীর্ণ রূপ', () => {
  it('বানানের প্রচলিত ভেদ এক করে', () => {
    const pairs: Array<[string, string]> = [
      ['পাখি', 'পাখী'],
      ['বাঘ', 'বাঘ'],
      // শ/ষ→স ইচ্ছাকৃতভাবে সংকীর্ণ স্তরে নেই — “সাপ” আর “শাপ” আলাদা রাখতে।
      // ওই ভেদ ঢিলা স্তরে শব্দ-সীমায় মেটে (নিচের ব্লক দেখুন)।
      ['কৃষ্ণচূড়া', 'কৃষ্ণচুড়া'],
      ['সরীসৃপ', 'সরীসৃপ'],
    ]
    for (const [a, b] of pairs) {
      expect(normalizeBn(a), `${a} ↔ ${b}`).toBe(normalizeBn(b))
    }
  })

  it('আলাদা শব্দ জোড়া লাগায় না', () => {
    expect(normalizeBn('বাঘ')).not.toBe(normalizeBn('বাগ'))
    expect(normalizeBn('বাঁদর')).not.toBe(normalizeBn('বাদুড়'))
    expect(normalizeBn('বক')).not.toBe(normalizeBn('বকুল'))
  })

  it('বাংলা সংখ্যা ASCII-তে রূপান্তরিত হয়', () => {
    expect(toAsciiDigits('১৯১০')).toBe('1910')
    expect(normalizeBn('১৯১০')).toBe('1910')
  })
})

describe('বাংলা খোঁজা — ঢিলা রূপ (নামের ঘর)', () => {
  it('কার/হসন্ত/য-ফলা ভেদেও একই নামে পৌঁছায়', () => {
    const pairs: Array<[string, string]> = [
      ['দোয়েল', 'দয়েল'],
      ['স্তন্যপায়ী', 'স্তনপায়ী'],
      ['বাদুড়', 'বাদুর'],
      ['কৃষ্ণচূড়া', 'কৃষ্ণচুড়া'],
      ['হাঁস', 'হাস'],
      ['চাঁদ', 'চাদ'],
      ['শালিক', 'সালিক'],
      ['সাপলা', 'শাপলা'],
    ]
    for (const [a, b] of pairs) {
      expect(matchesName(a, b), `${a} ↔ ${b}`).toBe(true)
      expect(matchesName(b, a), `${b} ↔ ${a}`).toBe(true)
    }
  })

  it('ভিন্ন প্রাণীকে গুলিয়ে ফেলে না', () => {
    expect(matchesName('বাঁদর', 'বাদুড়')).toBe(false)
    // ছোট প্রশ্নে ঢিলা স্তর চলে না — “বক” দিয়ে “বকুল” বা “মাছ” দিয়ে
    // “মৌমাছি” খুঁজে পাওয়া উচিত নয় (সেটি সংকীর্ণ স্তরে নাম-অংশ হিসেবে মেলে)
    expect(namesMatchLoose('বকুল', 'বক')).toBe(false)
    expect(namesMatchLoose('মৌমাছি', 'মাছ')).toBe(false)
    expect(matchesName('কাতলা', 'খলিসা')).toBe(false)
    expect(matchesName('দোয়েল', 'বাঘ')).toBe(false)
    expect(matchesName('শালিক', 'শাপলা')).toBe(false)
  })

  it('ইংরেজি ও বৈজ্ঞানিক নামে কাজ করে, বড়/ছোট হাতের অক্ষরে নয়', () => {
    expect(matchesName('Pavo cristatus', 'pavo')).toBe(true)
    expect(matchesName(['ময়ূর', 'Pavo cristatus'], 'CRISTATUS')).toBe(true)
    expect(matchesName('Pavo cristatus', 'বাঘ')).toBe(false)
  })

  it('দুই স্তর আলাদাভাবে ব্যবহার করা যায়', () => {
    expect(namesMatchTight('দোয়েল', 'দয়েল')).toBe(false)
    expect(namesMatchLoose('দোয়েল', 'দয়েল')).toBe(true)
    expect(namesMatchTight('দোয়েল', 'দোয়েল')).toBe(true)
  })

  it('একাধিক শব্দ — সবগুলো থাকতে হবে', () => {
    expect(matchesName('বাংলার বাঘ · Royal Bengal Tiger', 'বাঘ tiger')).toBe(true)
    expect(matchesName('বাংলার বাঘ', 'বাঘ হাতি')).toBe(false)
    expect(foldTerms('  বাঘ   রয়েল  ')).toHaveLength(2)
  })

  it('খালি প্রশ্নে সব মেলে (আগে ফিল্টার করা হয়)', () => {
    expect(matchesFolded('যেকোনো', '')).toBe(true)
    expect(matchesName('যেকোনো', '   ')).toBe(true)
    expect(foldTerms('   ')).toEqual([])
    expect(foldBn(undefined)).toBe('')
    expect(normalizeBn(null)).toBe('')
  })
})
