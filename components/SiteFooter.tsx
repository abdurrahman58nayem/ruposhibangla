import Link from 'next/link'
import { getRepo } from '@/lib/repo'
import { Facebook, Instagram, Youtube, Twitter, Mail } from 'lucide-react'

const ICONS: Record<string, any> = { facebook: Facebook, youtube: Youtube, x: Twitter, twitter: Twitter, instagram: Instagram }

export default async function SiteFooter() {
  let settings
  try {
    settings = await getRepo().getSettings()
  } catch {
    return null
  }
  const year = new Date().getFullYear()

  return (
    <footer className="mt-14 border-t border-black/5 bg-forest-950 text-white/80">
      <div className="container-pb grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logoUrl || '/brand/logo-mark.png'} alt="" className="h-9 w-9 rounded-full bg-white object-cover" />
            <span className="text-lg font-bold text-white">{settings.siteName}</span>
          </div>
          <p className="text-sm leading-relaxed">{settings.footerNote}</p>
          <div className="mt-4 flex gap-2">
            {settings.socials?.map((s) => {
              const Icon = ICONS[(s.icon || '').toLowerCase()] || Facebook
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">বিষয়ভিত্তিক</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/prani">প্রাণী</Link></li>
            <li><Link className="hover:text-white" href="/udbhid">উদ্ভিদ</Link></li>
            <li><Link className="hover:text-white" href="/grambangla">গ্রামবাংলা</Link></li>
            <li><Link className="hover:text-white" href="/kobirchokhe">কবির চোখে</Link></li>
            <li><Link className="hover:text-white" href="/khobor">প্রকৃতির খবর</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">অংশগ্রহণ</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/share">ছবি/ভিডিও শেয়ার</Link></li>
            <li><Link className="hover:text-white" href="/ai">এআই সহচর</Link></li>
            <li><Link className="hover:text-white" href="/jeno">জেনো — তথ্য জানান</Link></li>
            <li><Link className="hover:text-white" href="/register">অ্যাকাউন্ট খুলুন</Link></li>
            <li><Link className="hover:text-white" href="/about">আমাদের সম্পর্কে</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">যোগাযোগ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={14} /> {settings.contactEmail}
            </li>
            <li>
              <Link className="hover:text-white" href="/privacy">গোপনীয়তা নীতি</Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/terms">ব্যবহারের শর্তাবলি</Link>
            </li>
          </ul>
          <p className="mt-4 text-xs text-white/40">
            © {year} {settings.siteName}। বাংলাদেশের প্রকৃতির জন্য তৈরি।
          </p>
        </div>
      </div>
    </footer>
  )
}
