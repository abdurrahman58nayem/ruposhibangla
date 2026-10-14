import ModerationList from '@/components/admin/ModerationList'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams
  const status = (sp.status as any) || 'pending'
  const repo = getRepo()
  const page = await repo.listPosts({ status, limit: 50 })
  const counts = {
    pending: (await repo.listPosts({ status: 'pending', limit: 1 })).items.length,
  }
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-forest-900">পোস্ট মডারেশন</h2>
        <p className="text-xs text-black/50">সম্প্রদায়ের শেয়ার করা ছবি/ভিডিও অনুমোদন বা সরিয়ে দিন</p>
        <div className="mt-3 flex gap-2 text-xs">
          {[
            { id: 'pending', label: 'অপেক্ষমান' },
            { id: 'approved', label: 'প্রকাশিত' },
            { id: 'rejected', label: 'বাতিল' },
          ].map((s) => (
            <a
              key={s.id}
              href={`/admin/posts?status=${s.id}`}
              className={`chip ${status === s.id ? 'chip-active' : ''}`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <ModerationList initial={page.items} />
      <p className="mt-3 text-[11px] text-black/40">নোট: বর্তমানে নতুন পোস্ট সরাসরি প্রকাশিত হয়; চাইলে API/PATCH দিয়ে “pending” করে অটো-মডারেশন চালু করা যায়।</p>
    </div>
  )
}
