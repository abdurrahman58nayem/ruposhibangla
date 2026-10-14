import type { Species, GroupId } from '@/lib/types'
import CategoryIcon, { toneOf } from '@/components/icons/CategoryIcon'

/**
 * প্রজাতির "সম্পূর্ণ বিবরণ" — বিষয়ভিত্তিক সেকশনে সাজানো।
 *
 * কোনো তথ্য নেই → সেকশন দেখানো হয় না (কখনো ফাঁকা কার্ড বা জাল তথ্য নয়)।
 * প্রতিটি সেকশনের বামে ক্যাটাগরি-রঙের আইকন।
 */

type Section = { key: string; title: string; body: string; icon: GroupId | string }

function build(s: Species): Section[] {
  const out: Section[] = []

  if (s.identification) out.push({ key: 'id', title: 'শনাক্তকরণ', body: s.identification, icon: 'onujib' })
  if (s.physical) out.push({ key: 'phys', title: 'শারীরিক গঠন', body: s.physical, icon: 'pranijogot' })
  if (s.behavior) out.push({ key: 'beh', title: 'আচরণ ও জীবনযাপন', body: s.behavior, icon: s.group })
  if (s.distribution) out.push({ key: 'dist', title: 'বাংলাদেশে বিস্তৃতি', body: s.distribution, icon: 'nadi' })
  if (s.reproduction) out.push({ key: 'rep', title: 'প্রজনন ও জীবনচক্র', body: s.reproduction, icon: 'ubhochor' })
  if (s.ecologicalRole) out.push({ key: 'eco', title: 'প্রকৃতিতে ভূমিকা', body: s.ecologicalRole, icon: 'gachhbon' })
  if (s.threats) out.push({ key: 'thr', title: 'হুমকি', body: s.threats, icon: 'songrokkhon' })
  if (s.conservationActions)
    out.push({ key: 'act', title: 'সংরক্ষণ ও করণীয়', body: s.conservationActions, icon: 'songrokkhon' })

  return out
}

export default function SpeciesSections({ s }: { s: Species }) {
  const sections = build(s)
  if (!sections.length) return null
  const tone = toneOf(s.group)

  return (
    <>
      {sections.map((sec) => {
        const t = toneOf(sec.icon)
        return (
          <section key={sec.key} className="relative pl-0">
            <h3 className="mb-2 flex items-center gap-2 font-display text-[15px] font-bold text-forest-900">
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                style={{ backgroundColor: t.soft }}
              >
                <CategoryIcon id={sec.icon} size={15} variant="auto" strokeWidth={2} />
              </span>
              {sec.title}
            </h3>
            <p
              className="prose-bn border-l-2 pl-3 text-[15.5px] leading-[1.95] text-black/80"
              style={{ borderColor: tone.from }}
            >
              {sec.body}
            </p>
          </section>
        )
      })}
    </>
  )
}
