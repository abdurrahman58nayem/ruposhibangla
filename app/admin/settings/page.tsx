import SettingsForm from '@/components/admin/SettingsForm'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const settings = await getRepo().getSettings()
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-forest-900">সাইট সেটিংস</h2>
      <SettingsForm initial={settings} />
    </div>
  )
}
