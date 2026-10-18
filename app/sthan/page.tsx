import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mountain, Trees, Waves } from 'lucide-react'
import SpeciesCard from '@/components/SpeciesCard'
import SearchBar from '@/components/SearchBar'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'বাংলাদেশের প্রাকৃতিক স্থান ও পর্যটন',
  description: 'বাংলাদেশের পাহাড়, বন, নদী, হাওর, দ্বীপ, জলাভূমি ও প্রাকৃতিক পর্যটনকেন্দ্র—তথ্য, ছবি ও ভিডিওসহ।',
  alternates: { canonical: '/sthan' },
}

const TOPICS: { id: string; label: string; test: (text: string, group: string, category: string) => boolean }[] = [
  { id: 'forest', label: 'বন ও জাতীয় উদ্যান', test: (text, group, cat) => /বন|অরণ্য|অভয়ারণ্য|জাতীয় উদ্যান|ম্যানগ্রোভ|শালবন|forest|sanctuary|national park/.test(`${text} ${cat}`) || (group === 'pahar' && cat !== 'পাহাড়') },
  { id: 'mangrove', label: 'ম্যানগ্রোভ বন', test: (text) => /ম্যানগ্রোভ|সুন্দরবন|নিঝুম দ্বীপ|টেংরাগিরি|কুকরি|mangrove|sundarban/.test(text) },
  { id: 'hill', label: 'পাহাড় ও টিলা', test: (text, group, cat) => cat === 'পাহাড়' || /পাহাড়|পাহাড়|উপত্যকা|শৃঙ্গ|hill|mountain/.test(text) },
  { id: 'river', label: 'নদী ও চর', test: (text, group, cat) => group === 'nadi' && /নদী|চর|নদী/.test(`${text} ${cat}`) || /নদী|নদীর চর|river/.test(text) },
  { id: 'haor', label: 'হাওর ও বিল', test: (text) => /হাওর|বিল|haor/.test(text) },
  { id: 'wetland', label: 'হ্রদ ও জলাভূমি', test: (text, group, cat) => /জলাভূমি|জলাবন|হ্রদ|হাওর|বিল|lake|wetland|swamp/.test(`${text} ${cat}`) },
  { id: 'coast', label: 'সমুদ্র ও উপকূল', test: (text) => /উপকূল|সমুদ্র|সৈকত|সেন্ট মার্টিন|কুয়াকাটা|কক্সবাজার|coast|sea/.test(text) },
  { id: 'island', label: 'দ্বীপ ও চরাঞ্চল', test: (text) => /দ্বীপ|চর|island|char/.test(text) },
  { id: 'waterfall', label: 'ঝরনা ও জলপ্রপাত', test: (text) => /ঝরনা|জলপ্রপাত|waterfall/.test(text) },
  { id: 'cave', label: 'গুহা ও ভূদৃশ্য', test: (text) => /গুহা|cave|ভূদৃশ্য/.test(text) },
  { id: 'beach', label: 'সমুদ্রসৈকত', test: (text) => /সৈকত|সমুদ্রসৈকত|beach/.test(text) },
  { id: 'birding', label: 'পাখি দেখার স্থান', test: (text) => /পাখি|অতিথি পাখি|bird/.test(text) },
  { id: 'freshwater', label: 'মিঠাপানির জলজ পরিবেশ', test: (text, group, cat) => group === 'nadi' && /জলাভূমি|জলাবন|হাওর|বিল|হ্রদ|জলাশয়/.test(`${text} ${cat}`) },
  { id: 'camping', label: 'প্রকৃতিতে হাঁটা ও ক্যাম্পিং', test: (text, group) => group === 'pahar' || /ট্রেক|পাহাড়ি পথ|বনপথ/.test(text) },
  { id: 'tourism', label: 'সব পর্যটনস্থান', test: () => true },
]

export default async function LandscapesPage({ searchParams }: { searchParams: Promise<{ cat?: string; topic?: string; q?: string }> }) {
  const { cat, topic, q = '' } = await searchParams
  const all = await getRepo().listSpecies({ type: 'sthan', q: q.trim() || undefined, limit: 5000 })
  const places = all.filter((place) => place.type === 'sthan')
  const hills = places.filter((place) => place.category === 'পাহাড়')
  const forests = places.filter((place) => place.category === 'বনাঞ্চল' || /বন|জলাবন/.test(place.category))
  const legacyFilter = cat === 'পাহাড়' ? hills : cat === 'বনাঞ্চল' ? forests : places
  const activeTopic = TOPICS.find((item) => item.id === topic)
  const selected = activeTopic ? legacyFilter.filter((place) => activeTopic.test(`${place.nameBn} ${place.nameEn} ${place.habitat || ''} ${place.summary} ${place.whereToSee || ''}`.toLowerCase(), place.group, place.category)) : legacyFilter
  const sectionTitle = activeTopic?.label || (cat === 'পাহাড়' ? 'পাহাড় ও উপত্যকা' : cat === 'বনাঞ্চল' ? 'বন, জাতীয় উদ্যান ও অভয়ারণ্য' : 'প্রকৃতি ও পর্যটনের সব স্থান')

  return <main className="container-pb py-6 sm:py-9">
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-950 via-forest-800 to-emerald-700 p-6 text-white sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-100">বাংলাদেশের প্রাকৃতিক ঐতিহ্য</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">প্রকৃতি, আবাসস্থল ও ভ্রমণ</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">পাহাড়, সংরক্ষিত বন, ম্যানগ্রোভ, নদী, হাওর, দ্বীপ ও প্রাকৃতিক পর্যটনকেন্দ্র—একই স্থানের মূল রেকর্ড অক্ষুণ্ণ রেখে আবাসস্থল ও ভ্রমণ-ধরন ধরে খুঁজুন।</p>
      <div className="mt-5 max-w-xl"><SearchBar compact placeholder="সুন্দরবন, কাপ্তাই, রাতারগুল…"/></div>
      <div className="mt-5 flex flex-wrap gap-2 text-xs sm:text-sm">
        <Link href="/sthan" className={`rounded-full px-3 py-2 ${!cat && !topic ? 'bg-white text-forest-900' : 'bg-white/15 hover:bg-white/25'}`}>সব স্থান ({toBn(places.length)})</Link>
        <Link href="/sthan?cat=পাহাড়" className={`rounded-full px-3 py-2 ${cat === 'পাহাড়' ? 'bg-white text-forest-900' : 'bg-white/15 hover:bg-white/25'}`}>পাহাড় ({toBn(hills.length)})</Link>
        <Link href="/sthan?cat=বনাঞ্চল" className={`rounded-full px-3 py-2 ${cat === 'বনাঞ্চল' ? 'bg-white text-forest-900' : 'bg-white/15 hover:bg-white/25'}`}>বন ও উদ্যান ({toBn(forests.length)})</Link>
      </div>
    </header>

    <div className="my-5 grid gap-3 sm:grid-cols-3">
      <Link href="/sthan?topic=hill" className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 hover:bg-emerald-100"><h2 className="flex items-center gap-2 font-bold text-forest-900"><Mountain size={18}/> পাহাড়ি ভূদৃশ্য</h2><p className="mt-1 text-xs text-black/60">পাহাড়, উপত্যকা, হ্রদ ও ঝরনা</p></Link>
      <Link href="/sthan?topic=forest" className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 hover:bg-emerald-100"><h2 className="flex items-center gap-2 font-bold text-forest-900"><Trees size={18}/> বন ও সংরক্ষিত উদ্যান</h2><p className="mt-1 text-xs text-black/60">জাতীয় উদ্যান ও বন্যপ্রাণী অভয়ারণ্য</p></Link>
      <Link href="/sthan?topic=river" className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 hover:bg-emerald-100"><h2 className="flex items-center gap-2 font-bold text-forest-900"><Waves size={18}/> নদী ও জলাভূমি</h2><p className="mt-1 text-xs text-black/60">নদী, হাওর, হ্রদ ও জলাবন</p></Link>
    </div>

    <nav aria-label="প্রাকৃতিক স্থান ফিল্টার" className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-2">
      {TOPICS.map((item) => <Link key={item.id} href={`/sthan?topic=${item.id}`} className={`chip whitespace-nowrap ${topic === item.id ? 'chip-active' : ''}`}>{item.label}</Link>)}
    </nav>

    <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-forest-900">{sectionTitle}</h2><p className="mt-1 text-xs text-black/50">{toBn(selected.length)}টি স্থান · বিস্তারিত পাতায় ছবি, উৎস ও পাওয়া গেলে ভিডিও</p></div><Link href="/gyan?type=sthan" className="shrink-0 text-xs font-semibold text-forest-700 hover:underline">জ্ঞানভান্ডার <ArrowRight size={13} className="ml-1 inline"/></Link></div>
    {selected.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{selected.map((place) => <SpeciesCard key={place.slug} s={place}/>)}</div> : <p className="card p-8 text-center text-sm text-black/55">এই ফিল্টারে স্থান পাওয়া যায়নি। <Link href="/sthan" className="ml-1 font-semibold text-forest-700 hover:underline">সব স্থান দেখুন</Link></p>}

    <p className="mt-6 rounded-xl bg-stone-50 p-4 text-xs leading-relaxed text-black/55">এই তালিকায় জাতীয় উদ্যান, গুরুত্বপূর্ণ সংরক্ষিত বন ও পরিচিত প্রাকৃতিক স্থান আছে। এটি প্রতিটি স্থানীয় টিলা বা বনখণ্ডের ভূমি-জরিপ নয়; কিছু রেকর্ড পর্যালোচনাধীন। ভ্রমণের আগে বন অধিদপ্তর ও স্থানীয় কর্তৃপক্ষের হালনাগাদ নির্দেশনা যাচাই করুন।</p>
  </main>
}
