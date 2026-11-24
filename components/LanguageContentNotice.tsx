'use client'

import { Info, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@/components/Providers'

/**
 * ইংরেজি মোডে একটি ছোট, বন্ধ করা যায় এমন নোট।
 *
 * কেন দরকার: ইন্টারফেস দুই ভাষায়, কিন্তু ১৯১০টি প্রজাতির বর্ণনা বাংলাতেই
 * লেখা — মেশিন অনুবাদ করলে অর্থ বিকৃত হতো (§“অনুমান নয়” নীতি)। ব্যবহারকারী
 * যেন ভাবতে না বসেন “ইংরেজি বদলালাম, কিছুই বদলাল না”, সেটি পরিষ্কার করে বলা হয়।
 */
export default function LanguageContentNotice() {
  const { lang, t } = useApp()
  const [closed, setClosed] = useState(false)
  if (lang !== 'en' || closed) return null
  return (
    <div className="container-pb pt-3">
      <div className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50/70 px-3 py-2 text-[11.5px] leading-relaxed text-sky-950">
        <Info size={14} className="mt-0.5 shrink-0" />
        <p className="min-w-0 flex-1">{t('contentLangNotice')}</p>
        <button
          onClick={() => setClosed(true)}
          aria-label={t('close')}
          className="shrink-0 rounded-full p-1 text-sky-800/60 hover:bg-sky-100"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
