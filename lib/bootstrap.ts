import { hashPassword } from '@/lib/auth'
import type { Repo } from '@/lib/repo/types'
import type { UserRecord } from '@/lib/types'

/**
 * প্রথম অ্যাডমিন তৈরি (bootstrap)।
 *
 * কোনো অ্যাডমিন না থাকলে `.env`-এর ADMIN_USERNAME / ADMIN_EMAIL /
 * ADMIN_PASSWORD দিয়ে একটি অ্যাডমিন অ্যাকাউন্ট তৈরি হয় — যাতে সাইট
 * ডেপলয়ের পর /login-এ ঢুকে অ্যাডমিন প্যানেলে যাওয়া যায়।
 *
 * নিরাপত্তা:
 *  - পাসওয়ার্ড সরাসরি রাখা হয় না, `hashPassword()` (scrypt + salt) দিয়ে হ্যাশ করা হয়।
 *  - কোনো অ্যাডমিন থাকলে কিছুই করা হয় না (বারবার চালালেও নিরাপদ)।
 *  - ADMIN_PASSWORD না দিলে ফাংশন কিছু করে না — রেজিস্টারের পথ খোলা থাকে।
 *
 * অ্যাডমিন প্যানেল → আমার অ্যাকাউন্ট (/admin/account) থেকে পরে
 * ইমেইল ও পাসওয়ার্ড বদলানো যায়।
 */
export async function ensureAdminUser(repo: Repo): Promise<void> {
  const password = process.env.ADMIN_PASSWORD || ''
  if (!password) return

  try {
    const users = await repo.listUsers()
    if (users.some((u) => u.role === 'admin' || u.role === 'super_admin')) return

    let username = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase()
    if (await repo.getUserByUsername(username)) username = `${username}-${Date.now().toString(36)}`

    const now = new Date().toISOString()
    const user: UserRecord = {
      id: `user-admin-${Date.now().toString(36)}`,
      username,
      name: 'অ্যাডমিন',
      passwordHash: hashPassword(password),
      email: (process.env.ADMIN_EMAIL || 'admin@ruposhibangla.org').trim(),
      role: 'admin',
      verified: true,
      avatar: '',
      bio: 'রূপসী বাংলার প্রশাসক।',
      location: 'বাংলাদেশ',
      followers: 0,
      following: 0,
      createdAt: now,
    }
    await repo.createUser(user)
    console.log(`[bootstrap] অ্যাডমিন তৈরি হয়েছে: @${username}`)
  } catch (e) {
    console.error('[bootstrap] অ্যাডমিন তৈরি করা যায়নি:', e)
  }
}
