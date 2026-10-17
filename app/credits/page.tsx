import type { Metadata } from 'next'
import Link from 'next/link'
import { MEDIA_LICENSES } from '@/data/seed/media-licenses'
import { toBn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'মিডিয়া ক্রেডিট ও লাইসেন্স',
  description: 'রূপসী বাংলা প্ল্যাটফর্মে ব্যবহৃত ছবি ও মিডিয়ার উৎস, ফটোগ্রাফার, লাইসেন্স ও যাচাইয়ের কারণ।',
}

export default function CreditsPage() {
  // MEDIA_LICENSES একটি অ্যারে — Object.entries() ব্যবহার করলে “ফাইল” কলামে
  // ফাইলের নামের বদলে ক্রমিক নম্বর চলে আসত (আগের বাগ)। সরাসরি অ্যারেই ব্যবহার করছি।
  const entries = MEDIA_LICENSES
  const verified = entries.filter((m) => m.verified).length
  const pending = entries.length - verified

  return (
    <div className="container-pb py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-2xl font-bold text-forest-900">মিডিয়া ক্রেডিট ও লাইসেন্স</h1>
        <p className="mt-2 text-sm leading-relaxed text-black/65">
          রূপসী বাংলায় ব্যবহৃত প্রতিটি ছবির ফটোগ্রাফার, উৎস ও লাইসেন্স স্বচ্ছভাবে নথিভুক্ত করা হচ্ছে। যেসব ছবির
          চূড়ান্ত লাইসেন্স ও মূল ফটোগ্রাফারের নাম এখনো যাচাই করা সম্ভব হয়নি, সেগুলোকে কল্পিত ক্রেডিট না দিয়ে{' '}
          <span className="font-semibold text-amber-800">“যাচাই বাকি”</span> এবং কী কারণে যাচাই বাকি তা স্পষ্টভাবে দেখানো হয়েছে।
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-forest-50 px-3 py-1 font-medium text-forest-900">
            মোট নথিভুক্ত ছবি: {toBn(entries.length)}
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
            লাইসেন্স যাচাইকৃত ✓: {toBn(verified)}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800">
            যাচাই বাকি (কারণসহ): {toBn(pending)}
          </span>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/10 bg-forest-50/70 text-[11px] font-semibold uppercase tracking-wide text-forest-900">
              <tr>
                <th className="px-3 py-2.5">ফাইল (ক্লিক করে যাচাই করুন)</th>
                <th className="px-3 py-2.5">বিষয়</th>
                <th className="px-3 py-2.5">ক্রেডিট / ফটোগ্রাফার</th>
                <th className="px-3 py-2.5">লাইসেন্স</th>
                <th className="px-3 py-2.5">যাচাই অবস্থা</th>
                <th className="px-3 py-2.5">যাচাইয়ের বিবরণ / কেন যাচাই বাকি</th>
                <th className="px-3 py-2.5">উৎস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {entries.map((m) => (
                <tr key={m.file} className="align-top hover:bg-forest-50/30">
                  <td className="max-w-[22rem] px-3 py-2 font-mono text-[11px] text-black/75">
                    <a
                      href={m.file}
                      target="_blank"
                      rel="noreferrer"
                      title={m.file}
                      className="break-all text-forest-700 hover:underline"
                    >
                      {m.file.split('/').slice(-2).join('/')}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-black/70">{m.subject || '—'}</td>
                  <td className="px-3 py-2 text-black/70">{m.credit || '—'}</td>
                  <td className="px-3 py-2 text-black/70 whitespace-nowrap">{m.license}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {m.verified ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        যাচাইকৃত ✓
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        যাচাই বাকি
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 leading-relaxed text-black/70">
                    {m.verified
                      ? m.note || 'মূল ফটোগ্রাফার ও ওপেন লাইসেন্স যাচাইকৃত।'
                      : m.note || 'মূল ফটোগ্রাফারের নাম ও সুনির্দিষ্ট ক্রিয়েটিভ কমন্স লাইসেন্স সংস্করণ চূড়ান্তভাবে মিলিয়ে দেখা বাকি।'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {m.source ? (
                      <a
                        href={m.source}
                        target="_blank"
                        rel="noreferrer"
                        className="text-forest-700 hover:underline"
                      >
                        উৎস দেখুন
                      </a>
                    ) : (
                      <span className="text-black/35">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-black/55">
          কোনো ছবির সঠিক ফটোগ্রাফার বা লাইসেন্স আপনার জানা থাকলে অথবা কপিরাইট বিষয়ে জানাতে চাইলে{' '}
          <Link href="/jeno" className="font-semibold text-forest-700 hover:underline">
            জেনো পাতায় জানান
          </Link>
          ।
        </p>
      </div>
    </div>
  )
}
