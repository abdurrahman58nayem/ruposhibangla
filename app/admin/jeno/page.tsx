import JenoList from '@/components/admin/JenoList'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page() {
  return <JenoList initial={await getRepo().listJeno()} />
}
