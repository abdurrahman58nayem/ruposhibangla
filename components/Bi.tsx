'use client'

import { useApp } from '@/components/Providers'

/**
 * সার্ভার কম্পোনেন্টের ভেতরে ভাষা-সচেতন লেখা।
 *
 * পুরো পাতা ক্লায়েন্টে না নিয়ে শুধু লেখাটুকু ক্লায়েন্ট লিফ করা হয় — ফলে
 * ডেটা সার্ভারেই থাকে (SEO/গতি অটুট), অথচ ভাষা বদলালে লেখা সঙ্গে সঙ্গে বদলায়।
 * দুই ভাষার লেখা হাতে লেখা — মেশিন অনুবাদ নয়।
 */
export default function Bi({ bn, en }: { bn: string; en: string }) {
  const { lang } = useApp()
  return <>{lang === 'bn' ? bn : en}</>
}

/** একই কাজ, কিন্তু একক লাইনে/অ্যাট্রিবিউটের জন্য সাধারণ ফাংশন-রূপ */
export function pick(lang: 'bn' | 'en', bn: string, en: string): string {
  return lang === 'bn' ? bn : en
}
