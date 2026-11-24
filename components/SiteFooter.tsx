'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Twitter, Mail } from 'lucide-react'
import { useT } from '@/lib/use-t'
import type { SiteSettings } from '@/lib/types'

const ICONS: Record<string, any> = { facebook: Facebook, youtube: Youtube, x: Twitter, twitter: Twitter, instagram: Instagram }

/**
 * পাদচরণ — বর্তমানে ক্লায়েন্ট কম্পোনেন্ট, কারণ ভাষা বদলালে সঙ্গে সঙ্গে
 * বদলাতে হবে। সেটিংস সার্ভার থেকেই (লে-আউটে) পাঠানো হয়।
 */
export default function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const t = useT()
  if (!settings) return null
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
          <h3 className="mb-3 text-sm font-bold text-white">{t('categories')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/prani">{t('navAnimals')}</Link></li>
            <li><Link className="hover:text-white" href="/udbhid">{t('navPlants')}</Link></li>
            <li><Link className="hover:text-white" href="/grambangla">{t('navVillage')}</Link></li>
            <li><Link className="hover:text-white" href="/kobirchokhe">{t('navKobita')}</Link></li>
            <li><Link className="hover:text-white" href="/khobor">{t('navNews')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">{t('explore')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/share">ছবি/ভিডিও শেয়ার</Link></li>
            <li><Link className="hover:text-white" href="/ai">এআই সহচর</Link></li>
            <li><Link className="hover:text-white" href="/jeno">জেনো — তথ্য জানান</Link></li>
            <li><Link className="hover:text-white" href="/register">অ্যাকাউন্ট খুলুন</Link></li>
            <li><Link className="hover:text-white" href="/about">{t('aboutus')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">{t('contact')}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={14} /> {settings.contactEmail}
            </li>
            <li>
              <Link className="hover:text-white" href="/privacy">{t('privacy')}</Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/terms">{t('terms')}</Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/credits">{t('credits')}</Link>
            </li>
          </ul>
          <p className="mt-4 text-xs text-white/40">
            © {year} {settings.siteName}
            {t('language') === 'ভাষা' ? '। বাংলাদেশের প্রকৃতির জন্য তৈরি।' : ' — made for the nature of Bangladesh.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
