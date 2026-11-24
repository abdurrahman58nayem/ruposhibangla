import { describe, expect, it } from 'vitest'
import { DATA_STATUS_LABEL, LANGS, t, type DictKey } from '@/lib/i18n'

/**
 * ভাষা-পরীক্ষা: ইংরেজি অনুবাদে যেন কোনো বাংলা লেখা না-থাকে, আর কোনো
 * কী যেন বাদ না-পড়ে। (ব্যবহারকারীর অভিযোগ ছিল “toggle কাজ করে না” —
 * আসলে অনেক জায়গায় অভিধানই ছিল না।)
 */
describe('ভাষা — অভিধান', () => {
  it('দুটি ভাষা আছে', () => {
    expect(LANGS).toEqual(['bn', 'en'])
  })

  it('সব শিরোনাম-কী দুই ভাষাতেই আছে ও খালি নয়', () => {
    const keys: DictKey[] = [
      'home', 'knowledge', 'feed', 'reels', 'profile', 'ai', 'settings',
      'search', 'notifications', 'login', 'register', 'logout', 'share', 'saved',
      'navAnimals', 'navPlants', 'navVillage', 'navKobita', 'navNews',
      'media', 'dataSaver', 'autoplay', 'videoSound', 'reduceMotion',
      'displayName', 'username', 'bio', 'password', 'saveChanges',
      'savedItems', 'myObservations', 'myProfile',
      'aboutus', 'contact', 'privacy', 'terms', 'credits',
      'cancel', 'confirm', 'submit', 'error', 'retry', 'seeAll',
    ]
    for (const key of keys) {
      for (const lang of LANGS) {
        const value = t(lang, key)
        expect(value, `${lang}.${key}`).toBeTruthy()
        expect(value.trim(), `${lang}.${key} খালি`).not.toBe('')
      }
    }
  })

  it('ইংরেজিতে বাংলা অক্ষর থাকে না (বাংলা নাম নিজে আলাদা)', () => {
    const sample: DictKey[] = ['settings', 'navAnimals', 'search', 'dataSaver', 'credits', 'seeAll', 'myProfile']
    for (const key of sample) {
      expect(t('en', key), `en.${key}`).not.toMatch(/[\u0980-\u09FF]/)
      expect(t('bn', key), `bn.${key}`).toMatch(/[\u0980-\u09FF]/)
    }
  })

  it('বাংলা ও ইংরেজি আসলে আলাদা (নকল অনুবাদ নয়)', () => {
    const keys: DictKey[] = ['settings', 'search', 'navAnimals', 'credits', 'seeAll']
    for (const key of keys) {
      expect(t('bn', key), key).not.toBe(t('en', key))
    }
  })

  it('তথ্যের অবস্থার লেবেল দুই ভাষাতেই', () => {
    for (const [key, labels] of Object.entries(DATA_STATUS_LABEL)) {
      expect(labels.bn, key).toBeTruthy()
      expect(labels.en, key).toBeTruthy()
      expect(labels.en, key).not.toMatch(/[\u0980-\u09FF]/)
    }
  })
})
