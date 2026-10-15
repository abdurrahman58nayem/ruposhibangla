import type { Post } from '@/lib/types'

export type CuratedAttribution = {
  credit: string
  license: string
  licenseUrl: string
  sourceUrl: string
  changesMade: string
}

/** Editorially selected, externally hosted nature videos with verified source-page licences. */
export type ReelPost = Post & {
  curatedAttribution?: CuratedAttribution
  authorHref?: string
}

const CHANNEL_AUTHOR = {
  name: 'রূপসী বাংলা',
  username: 'ruposhibangla',
  verified: true,
  avatar: '/brand/logo-mark.png',
}

const channelPost = (post: Omit<ReelPost, 'authorName' | 'authorId' | 'authorKey' | 'author' | 'authorHref'>): ReelPost => ({
  ...post,
  authorName: CHANNEL_AUTHOR.name,
  authorId: 'user-ruposhibangla',
  authorKey: 'channel-curated-free-media',
  author: CHANNEL_AUTHOR,
  authorHref: '/u/ruposhibangla',
})

/**
 * These remain editorial feed entries, not database seed posts. The original
 * Commons files stay on Wikimedia; each entry keeps its author, source page,
 * and licence visible so the channel does not imply ownership.
 */
export const CURATED_REELS: ReelPost[] = [
  channelPost({
    id: 'reel-pied-kingfisher-uganda',
    kind: 'reel',
    category: 'prani',
    group: 'pakhi',
    title: 'উগান্ডার জলাভূমিতে পাইড মাছরাঙা',
    body: 'Queen Elizabeth National Park, Uganda-তে ধারণ করা। স্থানটি বাংলাদেশে নয়; মূল ভিডিও অপরিবর্তিত রাখা হয়েছে।',
    mediaUrl:
      'https://upload.wikimedia.org/wikipedia/commons/5/57/004_Pied_kingfisher_at_Queen_Elizabeth_National_Park_Video_by_Giles_Laurent.webm',
    thumbUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/004_Pied_kingfisher_at_Queen_Elizabeth_National_Park_Video_by_Giles_Laurent.webm/960px--004_Pied_kingfisher_at_Queen_Elizabeth_National_Park_Video_by_Giles_Laurent.webm.jpg',
    mediaType: 'video',
    location: 'Queen Elizabeth National Park, Uganda',
    tags: ['মাছরাঙা', 'পাখি', 'জলাভূমি', 'মুক্ত ভিডিও'],
    status: 'approved',
    likes: 0,
    comments: 0,
    createdAt: '2026-10-15T00:00:00.000Z',
    curatedAttribution: {
      credit: 'Giles Laurent',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:004_Pied_kingfisher_at_Queen_Elizabeth_National_Park_Video_by_Giles_Laurent.webm',
      changesMade: 'মূল ভিডিও অপরিবর্তিত',
    },
  }),
  channelPost({
    id: 'reel-common-kingfisher-slovakia',
    kind: 'reel',
    category: 'prani',
    group: 'pakhi',
    title: 'নদীর ধারে কমন মাছরাঙা',
    body: 'স্লোভাকিয়ায় ধারণ করা Alcedo atthis। একই প্রজাতির নাম হলেও এই ফুটেজ বাংলাদেশের নয়।',
    mediaUrl:
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Common_kingfisher_%28Alcedo_atthis%29_in_Slovakia.webm',
    thumbUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Common_kingfisher_%28Alcedo_atthis%29_in_Slovakia.webm/960px--Common_kingfisher_%28Alcedo_atthis%29_in_Slovakia.webm.jpg',
    mediaType: 'video',
    location: 'Slovakia',
    speciesSlug: 'machranga',
    tags: ['মাছরাঙা', 'Alcedo atthis', 'পাখি', 'মুক্ত ভিডিও'],
    status: 'approved',
    likes: 0,
    comments: 0,
    createdAt: '2026-10-15T00:00:00.000Z',
    curatedAttribution: {
      credit: 'Lubo Ondrasko',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Common_kingfisher_(Alcedo_atthis)_in_Slovakia.webm',
      changesMade: 'মূল ভিডিও অপরিবর্তিত',
    },
  }),
  channelPost({
    id: 'reel-graceful-birds-earthwild',
    kind: 'reel',
    category: 'prani',
    group: 'pakhi',
    title: 'আকাশে পাখির ঝাঁক',
    body: 'Earthwild TV-র প্রকৃতি-ভিডিও; মূল উৎসে নির্দিষ্ট স্থান বা প্রজাতির নাম উল্লেখ নেই।',
    mediaUrl:
      'https://upload.wikimedia.org/wikipedia/commons/2/29/Graceful_Birds_in_the_Sky-Amazing_Bird_Sound-User_FREE_Videos.webm',
    thumbUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Graceful_Birds_in_the_Sky-Amazing_Bird_Sound-User_FREE_Videos.webm/960px--Graceful_Birds_in_the_Sky-Amazing_Bird_Sound-User_FREE_Videos.webm.jpg',
    mediaType: 'video',
    tags: ['পাখি', 'বন্যপ্রাণী', 'প্রকৃতি', 'মুক্ত ভিডিও'],
    status: 'approved',
    likes: 0,
    comments: 0,
    createdAt: '2026-10-15T00:00:00.000Z',
    curatedAttribution: {
      credit: 'Earthwild TV',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Graceful_Birds_in_the_Sky-Amazing_Bird_Sound-User_FREE_Videos.webm',
      changesMade: 'মূল ভিডিও অপরিবর্তিত',
    },
  }),
  channelPost({
    id: 'reel-birds-on-post-jeffrey-beach',
    kind: 'reel',
    category: 'prani',
    group: 'pakhi',
    title: 'ডালের ওপর পাখিদের বিরতি',
    body: 'Jeffrey Beach-এর পাখির ফুটেজ; মূল উৎসে পাখির প্রজাতি ও ধারণস্থল নির্দিষ্ট করা নেই।',
    mediaUrl:
      'https://upload.wikimedia.org/wikipedia/commons/7/73/Birds_on_the_Post_-_%28Free_to_Use_HD_Stock_Video_Footage%29.webm',
    thumbUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Birds_on_the_Post_-_%28Free_to_Use_HD_Stock_Video_Footage%29.webm/960px--Birds_on_the_Post_-_%28Free_to_Use_HD_Stock_Video_Footage%29.webm.jpg',
    mediaType: 'video',
    tags: ['পাখি', 'প্রকৃতি', 'মুক্ত ভিডিও'],
    status: 'approved',
    likes: 0,
    comments: 0,
    createdAt: '2026-10-15T00:00:00.000Z',
    curatedAttribution: {
      credit: 'Jeffrey Beach',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Birds_on_the_Post_-_(Free_to_Use_HD_Stock_Video_Footage).webm',
      changesMade: 'মূল ভিডিও অপরিবর্তিত',
    },
  }),
  channelPost({
    id: 'reel-running-stream-jlaswilson',
    kind: 'reel',
    category: 'grambangla',
    group: 'nadi',
    title: 'পাথরের ফাঁকে বয়ে যাওয়া জল',
    body: 'স্বচ্ছ জলধারার এই ভিডিওটির মূল উৎসে ধারণস্থল উল্লেখ নেই। নির্মাতা এটি CC0-তে প্রকাশ করেছেন।',
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Running_Stream_Of_Water.webm',
    thumbUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Running_Stream_Of_Water.webm/960px--Running_Stream_Of_Water.webm.jpg',
    mediaType: 'video',
    tags: ['নদী', 'জলধারা', 'প্রকৃতি', 'মুক্ত ভিডিও'],
    status: 'approved',
    likes: 0,
    comments: 0,
    createdAt: '2026-10-15T00:00:00.000Z',
    curatedAttribution: {
      credit: 'jLasWilson',
      license: 'CC0 1.0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Running_Stream_Of_Water.webm',
      changesMade: 'মূল ভিডিও অপরিবর্তিত',
    },
  }),
]
