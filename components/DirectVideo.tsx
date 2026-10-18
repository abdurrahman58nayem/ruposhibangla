'use client'

import { useState } from 'react'
import type { VideoEmbed } from '@/components/SpeciesVideoEmbed'

export default function DirectVideo({ video }: { video: VideoEmbed }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <a href={video.sourceUrl || video.url} target="_blank" rel="noopener noreferrer" className="grid h-full min-h-[200px] place-items-center p-5 text-center text-sm text-white/85 hover:text-white">ভিডিওটি এখন সরাসরি লোড হচ্ছে না। মূল উৎসে দেখুন →</a>
  return <video className="h-full min-h-[200px] w-full object-contain" controls preload="metadata" poster={video.poster} playsInline onError={() => setFailed(true)}>
    <source src={video.url} />
    আপনার ব্রাউজার এই ভিডিওটি চালাতে পারছে না।
  </video>
}
