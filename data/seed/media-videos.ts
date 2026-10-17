import type { SpeciesMedia } from '@/lib/types'

/**
 * Wikimedia Commons video seeds. Each file was checked with the Commons imageinfo
 * API on 2026-10-15; only species-identifiable clips with explicit free licences
 * and named creators are listed. Videos are streamed from Wikimedia, never copied.
 */
export const SEED_VIDEOS: Record<string, SpeciesMedia[]> = {
  machranga: [
    {
      kind: 'video',
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Common_kingfisher_%28Alcedo_atthis%29_in_Slovakia.webm',
      caption: 'Common Kingfishers (Alcedo atthis) — Slovakia; footage recorded outside Bangladesh.',
      credit: 'Lubo Ondrasko',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Common_kingfisher_(Alcedo_atthis)_in_Slovakia.webm',
    },
  ],
  'mete-machranga': [
    {
      kind: 'video',
      url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/004_Pied_kingfisher_at_Queen_Elizabeth_National_Park_Video_by_Giles_Laurent.webm',
      caption: 'Pied Kingfisher at Queen Elizabeth National Park, Uganda; footage recorded outside Bangladesh.',
      credit: 'Giles Laurent',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:004_Pied_kingfisher_at_Queen_Elizabeth_National_Park_Video_by_Giles_Laurent.webm',
    },
  ],
  dudhraj: [
    {
      kind: 'video',
      url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Birds_of_Sahyadri_-Asian_Paradise_Flycatcher_-.webm',
      caption: 'Indian Paradise Flycatcher — Sahyadri, India-তে ধারণ করা; এই ফুটেজ বাংলাদেশের নয়।',
      credit: 'Vivek Kale',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Birds_of_Sahyadri_-Asian_Paradise_Flycatcher_-.webm',
    },
  ],
  'kalo-baza': [
    {
      kind: 'video',
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Black_Baza_-_Video-1.webm',
      caption: 'Black Baza (Aviceda leuphotes) — Karnataka, India; ফুটেজটি বাংলাদেশের নয়।',
      credit: 'Forestowlet',
      license: 'CC0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Black_Baza_-_Video-1.webm',
    },
  ],
  'komla-matha-dama': [
    {
      kind: 'video',
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Orange-headed_Thrush_in_Rabindra_Sarobar_October_2025_by_Tisha_Mukherjee_01.webm',
      caption: 'Orange-headed Thrush (Geokichla citrina) — Rabindra Sarobar, West Bengal, India; ফুটেজটি বাংলাদেশের নয়।',
      credit: 'Tisha Mukherjee',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Orange-headed_Thrush_in_Rabindra_Sarobar_October_2025_by_Tisha_Mukherjee_01.webm',
    },
  ],
}
