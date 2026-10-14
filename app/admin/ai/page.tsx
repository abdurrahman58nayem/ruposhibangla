import AiQuestionsPanel from '@/components/admin/AiQuestionsPanel'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page() {
  return <AiQuestionsPanel initial={await getRepo().listAiQuestions?.() || []} />
}
