import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-pb py-20">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-forest-700 text-white">
          <Leaf size={30} />
        </span>
        <h1 className="text-2xl font-bold text-forest-900">পাতাটি পাওয়া যায়নি</h1>
        <p className="mt-2 text-sm text-black/55">
          লিংকটি ভুল হতে পারে, অথবা বিষয়টি এখনো আমাদের তথ্যভাণ্ডারে যোগ করা হয়নি।
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/" className="btn-primary">হোমে যান</Link>
          <Link href="/search" className="btn-outline">খুঁজুন</Link>
          <Link href="/jeno" className="btn-outline">আমাদের জানান</Link>
        </div>
      </div>
    </div>
  )
}
