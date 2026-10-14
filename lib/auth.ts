import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import type { UserRecord, UserRole } from '@/lib/types'

const SECRET = process.env.AUTH_SECRET || 'prakriti-bangla-dev-secret-change-me'

export const SESSION_COOKIE = 'pb_session'
export const GUEST_COOKIE = 'pb_guest'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = (stored || '').split(':')
    if (!salt || !hash) return false
    const test = crypto.scryptSync(password, salt, 64)
    const expected = Buffer.from(hash, 'hex')
    if (expected.length !== test.length) return false
    return crypto.timingSafeEqual(test, expected)
  } catch {
    return false
  }
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
}

export type Session = {
  id: string
  username: string
  name: string
  role: UserRole
}

export function createSessionToken(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function readSessionToken(token: string | undefined): Session | null {
  if (!token) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  if (sign(payload) !== sig) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data?.id || !data?.role) return null
    return data as Session
  } catch {
    return null
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const c = await cookies()
    return readSessionToken(c.get(SESSION_COOKIE)?.value)
  } catch {
    return null
  }
}

export async function getGuestKey(): Promise<string> {
  try {
    const c = await cookies()
    return c.get(GUEST_COOKIE)?.value || 'guest-anon'
  } catch {
    return 'guest-anon'
  }
}

export async function isAdmin(): Promise<boolean> {
  const s = await getSession()
  return !!s && s.role === 'admin'
}

export function publicUser(u: UserRecord) {
  const { passwordHash: _ph, ...rest } = u
  return rest
}

export function newGuestId(): string {
  return 'g-' + crypto.randomBytes(12).toString('hex')
}
