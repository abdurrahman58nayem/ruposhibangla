import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock, ArrowLeft, MessageSquare } from 'lucide-react'
import { getRepo } from '@/lib/repo'
import { bnDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  return { title: `প্রশ্নের উত্তর — ${code}`, robots: { index: false } }
}

const STATUS_BN: Record<string, string> = {
  new: 'নতুন প্রশ্ন',
  ai_checking: 'এআই যাচাই করছে',
  admin_review: 'অ্যাডমিন পর্যালোচনায়',
  answer_ready: 'উত্তর প্রস্তুত',
  answered: 'উত্তর জানানো হয়েছে',
  need_info: 'অতিরিক্ত তথ্য প্রয়োজন',
  resolved: 'সমাধান সম্পন্ন',
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const q = await getRepo().getAiQuestionByCode?.(code)

  if (!q) {
    return (
      <div className="container-pb max-w-2xl py-16 text-center">
        <p className="text-sm text-black/55">এই লিংকে কোনো প্রশ্ন পাওয়া যায়নি। লিংকটি ভুল হতে পারে।</p>
        <Link href="/ai" className="btn-primary mt-4">
          আবার প্রশ্ন করুন
        </Link>
      </div>
    )
  }

  return (
    <div className="container-pb max-w-2xl space-y-4 py-6">
      <Link href="/ai" className="inline-flex items-center gap-1 text-xs text-forest-700 hover:underline">
        <ArrowLeft size={13} /> এআই সহচরে ফিরুন
      </Link>

      <div className="card p-4">
        <p className="text-[11px] text-black/45">{bnDate(q.createdAt)} · কোড: {q.trackCode}</p>
        <p className="mt-1 text-sm font-semibold text-forest-900">{q.question}</p>
        {q.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={q.imageUrl} alt="" className="mt-2 max-h-56 rounded-lg object-contain" />
        )}
        <span className="mt-2 inline-block rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-semibold text-forest-800">
          {STATUS_BN[q.status] || q.status}
        </span>
      </div>

      {q.answer ? (
        <div className="card border-emerald-200 bg-emerald-50/50 p-4">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-emerald-800">
            <CheckCircle2 size={16} /> অ্যাডমিন/বিশেষজ্ঞের উত্তর
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-black/75">{q.answer}</p>
          {q.answeredBy && (
            <p className="mt-2 text-[11px] text-black/45">
              — {q.answeredBy}
              {q.answeredAt ? ` · ${bnDate(q.answeredAt)}` : ''}
            </p>
          )}
        </div>
      ) : (
        <div className="card p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-forest-900">
            <Clock size={16} /> উত্তর প্রক্রিয়াধীন
          </p>
          <p className="mt-1 text-xs text-black/55">
            এই প্রশ্নের নির্ভরযোগ্য উত্তর আমাদের তথ্যভান্ডারে পাওয়া যায়নি, তাই এটি বিশেষজ্ঞ/অ্যাডমিন
            পর্যালোচনায় পাঠানো হয়েছে। উত্তর প্রস্তুত হলে এই পাতায় দেখা যাবে এবং আপনাকে জানানো হবে।
          </p>
        </div>
      )}

      {q.aiAnalysis && (
        <div className="card p-4">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-forest-900">
            <MessageSquare size={14} /> এআই-এর প্রাথমিক বিশ্লেষণ
          </p>
          <p className="text-xs leading-relaxed text-black/65">{q.aiAnalysis}</p>
        </div>
      )}

      <p className="text-[11px] text-black/40">
        ব্যক্তিগত তথ্য প্রয়োজনের অতিরিক্ত সংগ্রহ করা হয় না — শুধু প্রশ্ন ও এই ট্র্যাকিং কোড সংরক্ষিত থাকে।
      </p>
    </div>
  )
}
