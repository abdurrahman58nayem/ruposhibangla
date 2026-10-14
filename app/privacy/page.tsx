import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'গোপনীয়তা নীতি' }

export default function Page() {
  return (
    <div className="container-pb py-8">
      <div className="mx-auto max-w-3xl card p-6">
        <h1 className="text-2xl font-bold text-forest-900">গোপনীয়তা নীতি</h1>
        <div className="prose-bn mt-4">
          <p>
            আমরা আপনার তথ্যের নিরাপত্তাকে গুরুত্ব দিই। অ্যাকাউন্ট খুললে আমরা শুধুমাত্র আপনার নাম, ব্যবহারনাম ও
            (ঐচ্ছিক) ইমেইল সংরক্ষণ করি। পাসওয়ার্ড এনক্রিপ্ট করে রাখা হয়, কেউ তা দেখতে পায় না।
          </p>
          <p>
            অ্যাকাউন্ট ছাড়া শেয়ার করলে আমরা শুধু আপনার দেওয়া নাম এবং একটি বেনামী কুকি (লাইক/ফলো মনে রাখার জন্য) ব্যবহার
            করি।
          </p>
          <p>
            আপনার আপলোড করা ছবি ও ভিডিও আমাদের স্টোরেজে (Cloudflare R2) জমা থাকে এবং সাইটে সবার জন্য প্রদর্শিত হয়।
            ছবি মুছতে চাইলে যোগাযোগ করুন।
          </p>
          <p>আমরা আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না।</p>
        </div>
      </div>
    </div>
  )
}
