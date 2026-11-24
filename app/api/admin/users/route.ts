import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { isAdminRole } from '@/lib/roles'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session || !isAdminRole(session.role)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const users = await getRepo().listUsers()
  return NextResponse.json(users.map(({ passwordHash: _p, ...rest }) => rest))
}
