import { NextResponse } from 'next/server'
import { storeFile, MAX_UPLOAD_BYTES, storageKindAsync } from '@/lib/storage'
import { getSession } from '@/lib/auth'
import { guard as rateGuard, tooManyRequests, RULES } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const _rl = await rateGuard(req, RULES.upload, 'upload')
  if (!_rl.ok) return tooManyRequests(_rl)

  const form = await req.formData().catch(() => null)
  const file = form?.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'ফাইল পাওয়া যায়নি' }, { status: 400 })
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'ফাইলটি অনেক বড় (সর্বোচ্চ ২৫ মেগাবাইট)' }, { status: 413 })
  }
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  if (!isImage && !isVideo) return NextResponse.json({ error: 'শুধু ছবি বা ভিডিও আপলোড করা যাবে' }, { status: 400 })

  const session = await getSession()
  const buffer = Buffer.from(await file.arrayBuffer())
  const folder = session?.role === 'admin' ? 'uploads/admin' : 'uploads/community'
  const { url, key } = await storeFile(buffer, file.type, file.name, folder)
  return NextResponse.json({ ok: true, url, key, mediaType: isVideo ? 'video' : 'image', storage: await storageKindAsync() })
}
