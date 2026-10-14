import MediaManager from '@/components/admin/MediaManager'
import StorageSettingsForm from '@/components/admin/StorageSettingsForm'
import { storageKindAsync } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const storage = await storageKindAsync()
  return (
    <div className="space-y-6">
      <StorageSettingsForm />
      <MediaManager storage={storage} />
    </div>
  )
}
