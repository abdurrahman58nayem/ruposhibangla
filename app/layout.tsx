import type { Metadata, Viewport } from 'next'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import BottomNav from '@/components/BottomNav'
import SiteFooter from '@/components/SiteFooter'
import { getRepo } from '@/lib/repo'

const DEFAULT_NAME = 'প্রকৃতি বাংলা'
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
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://prakritibangla.org'
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
      'প্রকৃতি বাংলা',
      'রূপসী বাংলা',
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
    icons: { icon: '/brand/logo-mark.png' },
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
    <html lang="bn-BD" dir="ltr">
      <body className="min-h-screen bg-[#f7faf7] antialiased">
        <SiteHeader notice={notice} />
        <main className="pb-safe">{children}</main>
        <SiteFooter />
        <BottomNav />
      </body>
    </html>
  )
}
