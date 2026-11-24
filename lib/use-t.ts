'use client'

import { useApp } from '@/components/Providers'

/**
 * ক্লায়েন্ট কম্পোনেন্টে অনুবাদ — `Providers`-এর ভাষা থেকেই।
 *
 * `Providers` ইতিমধ্যেই `t` দেয়, কিন্তু ভেতরে `lib/i18n` টেনে আনে; ছোট
 * কম্পোনেন্টে বারবার `const { t } = useApp()` লেখার বদলে এই হুক ব্যবহার
 * করা যায়। সার্ভার কম্পোনেন্টে কাজ করবে না — ওখানে `t(lang, key)` সরাসরি।
 */
export function useT() {
  return useApp().t
}

export function useLang() {
  return useApp().lang
}
