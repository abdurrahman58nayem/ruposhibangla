import UsersTable from '@/components/admin/UsersTable'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const users = await getRepo().listUsers()
  return <UsersTable initial={users.map(({ passwordHash: _p, ...rest }) => rest)} />
}
