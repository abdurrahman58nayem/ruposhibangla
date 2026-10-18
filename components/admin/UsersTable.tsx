'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BadgeCheck, Trash2 } from 'lucide-react'
import type { UserRecord, UserRole } from '@/lib/types'
import { toBn } from '@/lib/utils'

export default function UsersTable({ initial }: { initial: Omit<UserRecord, 'passwordHash'>[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [msg, setMsg] = useState('')

  async function patch(id: string, data: Partial<UserRecord>) {
    setItems((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    const d = await res.json()
    if (!res.ok) setMsg(d.error || 'ব্যর্থ')
    else router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('এই অ্যাকাউন্ট মুছে ফেলবেন?')) return
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((u) => u.id !== id))
    router.refresh()
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-forest-900">ব্যবহারকারী ({toBn(items.length)})</h2>
      <p className="mb-4 text-xs text-black/50">
        ব্লু টিক দিন দেশ ও প্রকৃতি নিয়ে কাজ করা পার্টনারদের — এরা সাইটে যাচাইকৃত হিসেবে দেখাবে
      </p>

      {msg && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-forest-50 text-left text-[11px] uppercase tracking-wide text-forest-800">
              <tr>
                <th className="p-3">নাম</th>
                <th className="p-3">রোল</th>
                <th className="p-3">ব্লু টিক</th>
                <th className="p-3">অনুসারী</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t border-black/5">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-forest-100 text-xs font-bold text-forest-800">
                        {u.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          u.name.slice(0, 1)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1 truncate font-semibold text-forest-900">
                          <span className="truncate">{u.name}</span>
                          {u.verified && <BadgeCheck size={14} className="shrink-0 text-sky-500" />}
                        </p>
                        <Link href={`/u/${u.username}`} className="text-[11px] text-black/45 hover:underline">
                          @{u.username}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => patch(u.id, { role: e.target.value as UserRole })}
                      className="rounded-lg border border-black/10 px-2 py-1 text-xs"
                    >
                      <option value="user">ব্যবহারকারী</option>
                      <option value="partner">পার্টনার</option>
                      <option value="admin">অ্যাডমিন</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => patch(u.id, { verified: !u.verified })}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        u.verified ? 'bg-sky-100 text-sky-700' : 'bg-black/5 text-black/50'
                      }`}
                    >
                      {u.verified ? '✔ যাচাইকৃত' : 'ব্লু টিক দিন'}
                    </button>
                  </td>
                  <td className="p-3 text-xs">{toBn(u.followers)}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => remove(u.id)} className="rounded-full p-2 text-black/40 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
