import type { Metadata, Viewport } from 'next'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import BottomNav from '@/components/BottomNav'
import SiteFooter from '@/components/SiteFooter'
import { Providers } from '@/components/Providers'
import { getRepo } from '@/lib/repo'

const DEFAULT_NAME = 'রূপসী বাংলা'
const DEFAULT_DESC =
  'বাংলাদেশের পাখি, প্রাণী, উদ্ভিদ, গ্রামবাংলা ও জীববৈচিত্র্যের সব তথ্য এক জায়গায় — ছবি, ভিডিও, কবির চোখে প্রকৃতি ও নিজস্ব এআই সহচর সহ।'

export async function generateMetadata(): Promise<Metadata> {
  let settings
  try {
    settings = await getRepo().getSettings()
  } catch {
    settings = null as any
  }
  const name = settings?.siteName || DEFAULT_NAME
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://ruposhibangla.org'
  return {
    metadataBase: new URL(url),
    title: {
      default: `${name} — বাংলাদেশের প্রকৃতি, প্রাণী ও উদ্ভিদ অভিধান`,
      template: `%s | ${name}`,
    },
    description: DEFAULT_DESC,
    keywords: [
      'বাংলাদেশের পাখি',
      'বাংলাদেশের প্রাণী',
      'বাংলাদেশের উদ্ভিদ',
      'জীববৈচিত্র্য',
      'সুন্দরবন',
      'দোয়েল',
      'বাংলার বাঘ',
      'গ্রামবাংলা',
      'রূপসী বাংলা',
      'Ruposhi Bangla',
    ],
    authors: [{ name }],
    openGraph: {
      type: 'website',
      locale: 'bn_BD',
      siteName: name,
      title: `${name} — বাংলাদেশের প্রকৃতি, প্রাণী ও উদ্ভিদ অভিধান`,
      description: DEFAULT_DESC,
      images: ['/brand/og-cover.jpg'],
    },
    twitter: { card: 'summary_large_image', title: name, description: DEFAULT_DESC },
    alternates: { canonical: '/' },
    icons: {
      icon: [
        { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/brand/favicon-64.png', sizes: '64x64', type: 'image/png' },
      ],
      apple: '/brand/apple-touch-icon.png',
      shortcut: '/brand/favicon-64.png',
    },
    manifest: '/manifest.webmanifest',
  }
}

export const viewport: Viewport = {
  themeColor: '#1e4a35',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let notice: string | null = null
  try {
    const s = await getRepo().getSettings()
    if (s.headerNoticeActive && s.headerNotice) notice = s.headerNotice
  } catch {
    notice = null
  }

  return (
    <html lang="bn-BD" dir="ltr" suppressHydrationWarning>
      <head>
        {/* থিম ফ্ল্যাশ এড়াতে — প্রথম পেইন্টের আগেই ক্লাস বসে যায় */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pb_theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var c=document.documentElement.classList;d?c.add('dark'):c.remove('dark');c.style.colorScheme=d?'dark':'light';if(localStorage.getItem('pb_reduce_motion')==='1'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)c.add('reduce-motion');var l=localStorage.getItem('pb_lang');if(l)document.documentElement.lang=l==='bn'?'bn-BD':'en';}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f7faf7] antialiased dark:bg-[#08130d]">
        <Providers>
          <SiteHeader notice={notice} />
          <main className="pb-safe">{children}</main>
          <SiteFooter />
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
