import NewsManager from '@/components/admin/NewsManager'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const news = await getRepo().listNews({ publishedOnly: false, limit: 100 })
  return <NewsManager initial={news} />
}
