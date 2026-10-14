import ReportsList from '@/components/admin/ReportsList'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page() {
  return <ReportsList initial={(await getRepo().listReports?.()) || []} />
}
