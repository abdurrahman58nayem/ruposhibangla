import ObservationsPanel from '@/components/admin/ObservationsPanel'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page() {
  return <ObservationsPanel initial={(await getRepo().listObservations?.({ limit: 100 })) || []} />
}
