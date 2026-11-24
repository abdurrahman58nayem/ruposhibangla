import UsersTable from '@/components/admin/UsersTable'
import VerificationQueue from '@/components/admin/VerificationQueue'
import { getRepo } from '@/lib/repo'
import { decidedVerifications, pendingVerifications } from '@/lib/verification'

export const dynamic = 'force-dynamic'

type Row = Awaited<ReturnType<ReturnType<typeof getRepo>['listUsers']>>[number]

function strip(users: Row[]) {
  return users.map(({ passwordHash: _p, ...rest }) => rest)
}

export default async function Page() {
  const users = await getRepo().listUsers()
  return (
    <div className="space-y-8">
      <VerificationQueue
        pending={strip(pendingVerifications(users))}
        decided={strip(decidedVerifications(users))}
      />
      <UsersTable initial={strip(users)} />
    </div>
  )
}
