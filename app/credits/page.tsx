import type { Metadata } from 'next'
import Link from 'next/link'
import { MEDIA_LICENSES } from '@/data/seed/media-licenses'
import { ShieldCheck, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'মিডিয়া ক্রেডিট ও লাইসেন্স',
  description:
    'রূপসী বাংলায় ব্যবহৃত প্রতিটি ছবি ও ভিডিওর উৎস, লেখক ও লাইসেন্সের তালিকা — যাচাই না করা মিডিয়া স্পষ্টভাবে চিহ্নিত।',
  alternates: { canonical: '/credits' },
}

export default function Page() {
  const total = MEDIA_LICENSES.length
  const verified = MEDIA_LICENSES.filter((m) => m.verified).length
  const pending = total - verified

  return (
    <div className="container-pb py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-forest-900 sm:text-3xl">মিডিয়া ক্রেডিট ও লাইসেন্স</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-black/60">
          রূপসী বাংলায় প্রকাশিত প্রতিটি ছবি ও ভিডিওর উৎস, ফটোগ্রাফার/লেখক এবং লাইসেন্স এখানে থাকবে। আমাদের নীতি: কোনো
          মিডিয়ার ক্রেডিট বা লাইসেন্স অনুমান করে লেখা হবে না — যাচাই না হওয়া মিডিয়া “যাচাই বাকি” হিসেবেই দেখানো হবে এবং
          প্রকাশের আগে সেটি প্রতিস্থাপন করতে হবে।
        </p>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs text-black/50">মোট মিডিয়া</p>
          <p className="text-2xl font-bold text-forest-900">{total}</p>
        </div>
        <div className="card p-4">
          <p className="flex items-center gap-1 text-xs text-black/50">
            <ShieldCheck size={13} className="text-emerald-600" /> উৎস ও লাইসেন্স যাচাইকৃত
          </p>
          <p className="text-2xl font-bold text-emerald-700">{verified}</p>
        </div>
        <div className="card p-4">
          <p className="flex items-center gap-1 text-xs text-black/50">
            <AlertTriangle size={13} className="text-amber-600" /> যাচাই বাকি
          </p>
          <p className="text-2xl font-bold text-amber-700">{pending}</p>
        </div>
      </div>

      {pending > 0 && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <b>সতর্কতা:</b> বর্তমানে {pending}টি মিডিয়ার উৎস ও লাইসেন্স যাচাই করা হয়নি — এগুলো ডেভেলপমেন্টের সময় স্থানধারক
          (placeholder) হিসেবে রাখা হয়েছে। প্রোডাকশনে যাওয়ার আগে প্রতিটি ফাইলের উৎস-লিংক, লেখক ও লাইসেন্স যোগ করতে হবে,
          অথবা ফাইলটি নিজস্ব বা সঠিকভাবে লাইসেন্সকৃত ছবি দিয়ে বদলাতে হবে। ভুল ক্রেডিট দেখানো হলে সেটি অবিলম্বে সংশোধন করা
          হবে — পেলে আমাদের জানান।
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase text-black/50">
            <tr>
              <th className="p-3">ফাইল / বিষয়</th>
              <th className="p-3">ক্রেডিট</th>
              <th className="p-3">উৎস</th>
              <th className="p-3">লাইসেন্স</th>
              <th className="p-3">অবস্থা</th>
            </tr>
          </thead>
          <tbody>
            {MEDIA_LICENSES.map((m) => (
              <tr key={m.file} className="border-b border-black/5 last:border-0">
                <td className="p-3">
                  <p className="font-medium text-forest-900">{m.subject}</p>
                  {m.slug ? (
                    <Link href={`/prani/${m.slug}`} className="text-[11px] text-forest-700 hover:underline">
                      {m.file}
                    </Link>
                  ) : (
                    <p className="text-[11px] text-black/40">{m.file}</p>
                  )}
                </td>
                <td className="p-3 text-black/70">{m.credit || '—'}</td>
                <td className="p-3">
                  {m.source ? (
                    <a href={m.source} target="_blank" rel="noreferrer" className="text-forest-700 hover:underline">
                      লিংক
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-3 text-black/70">{m.license}</td>
                <td className="p-3">
                  {m.verified ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                      যাচাইকৃত
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                      যাচাই বাকি
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-black/45">
        কোনো ছবির ক্রেডিট ভুল বা অনুপস্থিত থাকলে অনুগ্রহ করে{' '}
        <Link href="/jeno" className="text-forest-700 hover:underline">
          জেনো
        </Link>{' '}
        পেজ বা রিপোর্ট বাটন ব্যবহার করে জানান — আমরা সংশোধন করব।
      </p>
    </div>
  )
}
