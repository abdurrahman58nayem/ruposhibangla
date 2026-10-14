import MediaManager from '@/components/admin/MediaManager'
import { storageKind } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export default function Page() {
  return <MediaManager storage={storageKind()} />
}
