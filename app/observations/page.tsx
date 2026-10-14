import type { Metadata } from 'next'
import ObservationForm from '@/components/ObservationForm'
import { getRepo } from '@/lib/repo'
import SmartImage from '@/components/SmartImage'
import { toBn, timeAgoBn, bnDate } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'আমি কী দেখলাম? — পর্যবেক্ষণ' }

export default async function Page() {
  const items = (await getRepo().listObservations?.({ limit: 30 })) || []
  return (
    <div className="container-pb max-w-3xl space-y-5 py-6">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">আমি কী দেখলাম?</h1>
        <p className="mt-1 text-sm text-black/55">
          অজানা পাখি, প্রাণী বা উদ্ভিদ দেখলে ছবি তুলে পাঠান। এআই প্রথমে চেষ্টা করবে, নিশ্চিত না হলে
          অ্যাডমিন/বিশেষজ্ঞ পর্যালোচনা করবেন। কমিউনিটির পরিচয় প্রস্তাব স্বয়ংক্রিয়ভাবে “যাচাইকৃত” হয় না।
        </p>
      </div>

      <ObservationForm />

      <section>
        <h2 className="section-title mb-2">সাম্প্রতিক পর্যবেক্ষণ ({toBn(items.length)})</h2>
        {!items.length && (
          <div className="card p-6 text-center text-sm text-black/55">
            এখনো কোনো পর্যবেক্ষণ জমা পড়েনি।
          </div>
        )}
        <div className="space-y-2">
          {items
            .filter((o) => o.status !== 'rejected')
            .map((o) => (
              <div key={o.id} className="card flex gap-3 p-3">
                {o.photoUrl ? (
                  <SmartImage
                    src={o.photoUrl}
                    alt={o.guessedName || o.speciesSlug || 'পর্যবেক্ষণ'}
                    className="h-20 w-24 shrink-0 rounded-lg"
                  />
                ) : (
                  <span className="grid h-20 w-24 shrink-0 place-items-center rounded-lg bg-forest-50 text-[10px] text-forest-700">
                    ছবি নেই
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-forest-900">
                    {o.speciesSlug ? (
                      <Link href={`/search?q=${encodeURIComponent(o.speciesSlug)}`} className="hover:underline">
                        {o.speciesSlug}
                      </Link>
                    ) : (
                      o.guessedName || 'পরিচয় জানা যায়নি'
                    )}
                  </p>
                  <p className="text-[11px] text-black/45">
                    {o.name} · {bnDate(o.observedAt)} · {timeAgoBn(o.createdAt)}
                  </p>
                  {o.notes && <p className="mt-1 line-clamp-2 text-xs text-black/65">{o.notes}</p>}
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        o.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : o.status === 'identified'
                            ? 'bg-sky-100 text-sky-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {o.status === 'verified'
                        ? 'যাচাইকৃত'
                        : o.status === 'identified'
                          ? 'শনাক্ত (পর্যালোচনাধীন)'
                          : 'পর্যালোচনার অপেক্ষায়'}
                    </span>
                    {o.uncertain && (
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-black/50">
                        পরিচয় অনিশ্চিত
                      </span>
                    )}
                    {o.locationShared && o.location && (
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-black/50">
                        {o.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
