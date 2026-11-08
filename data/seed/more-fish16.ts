import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 16 — 14 Bangladesh-checklist taxa, Nov 2026.
 * Supplementary Table-I rows 352–360, 362–364, 366–367 were row-checked.
 * Row 361 (Caranx hippos) is marked # and explicitly classed questionable
 * by Habib & Islam because of its distant distribution; row 365 (Decapterus
 * kurroides) was not selected because the available Commons file still needs
 * license review. No records or files are inferred from citation presence.
 * Taxonomic combinations were updated against WoRMS/CAS; original checklist
 * combinations remain visible as aliases. Species-specific natural history
 * fields not supported by the sources are explicitly left as unverified text.
 */

type Candidate = {
  slug: string
  nameBn: string
  nameEn: string
  scientificName: string
  checklistName: string
  genus: string
  family: string
  localName: string
  habitatCodes: string
  row: number
  commonsFile: string
  uploadPath: string
  credit: string
  license: string
  licenseUrl?: string
  note: string
  extraNames?: string[]
}

const COMMONS = (file: string) => ({
  title: 'Wikimedia Commons file page',
  url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
  license: 'Wikimedia Commons',
})

const habitatText = (codes: string) => {
  const labels: Record<string, string> = { M: 'marine', B: 'brackish water', F: 'freshwater', R: 'reef-associated', S: 'Sundarbans mangrove' }
  return codes.split(',').map((code) => `${code.trim()} = ${labels[code.trim()] ?? 'unmapped'}`).join('; ')
}

const makeRecord = (candidate: Candidate): Species => {
  const image = `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`
  const checklistSource = `Habib & Islam Supplementary Table-I, row ${candidate.row}; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}).`
  const limitation = 'Habib & Islam Table-I provides the checklist name, local-name transcription, habitat codes and global IUCN category, but not this species-specific detail; do not infer it.'
  const aliases = [candidate.checklistName, ...(candidate.extraNames ?? [])]
    .filter((value) => value && value !== candidate.scientificName && value !== candidate.nameBn)
  return {
    slug: candidate.slug,
    type: 'prani',
    group: 'machh',
    category: 'মাছ',
    nameBn: candidate.nameBn,
    nameEn: candidate.nameEn,
    scientificName: candidate.scientificName,
    otherNames: aliases,
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Actinopterygii',
      order: 'Carangiformes',
      family: candidate.family,
      genus: candidate.genus,
      species: candidate.scientificName,
    },
    summary: `${candidate.nameEn} — Habib & Islam (2021) Supplementary Table-I row ${candidate.row}; Bangladesh marine-fish checklist entry; global IUCN category LC.`,
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is included in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. The table records the local-name form “${candidate.localName}”, habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}), and global IUCN category LC. ${limitation}`,
    physical: limitation,
    identification: `Use the accepted scientific name ${candidate.scientificName} and a specialist identification key; the checklist alone is not a diagnostic description.`,
    diet: limitation,
    behavior: limitation,
    reproduction: limitation,
    habitat: `Checklist habitat codes: ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}). The checklist does not provide species-specific depth or microhabitat here.`,
    distribution: 'Bangladesh coastal/marine checklist entry; broader species range is not asserted in this record.',
    whereToSee: `Recorded in the Bangladesh marine checklist (row ${candidate.row}); a more precise local site is not specified in the cited row.`,
    season: limitation,
    sizeOrHeight: 'Not provided in the checklist row; size not inferred.',
    ecologicalRole: limitation,
    origin: 'native',
    conservation: 'LC',
    conservationBn: `বৈশ্বিক IUCN শ্রেণি: Least Concern (LC), Habib & Islam (2021), Supplementary Table-I row ${candidate.row}। তাঁদের প্রবন্ধে বাংলাদেশের সামুদ্রিক মাছের জাতীয় IUCN মূল্যায়ন অনুপস্থিত বলা হয়েছে; তাই এটি জাতীয় অবস্থার দাবি নয়।`,
    threats: limitation,
    conservationActions: 'প্রজাতি-নির্দিষ্ট হুমকি বা ব্যবস্থাপনা সুপারিশ এই checklist row-তে নেই; স্থানীয় মূল্যায়ন ছাড়া অনুমান করা হয়নি।',
    colorTags: [],
    image,
    dataStatus: 'partial',
    sources: [
      MARINE_FISH_BD,
      COMMONS(candidate.commonsFile),
    ],
  }
}

const CANDIDATES: Candidate[] = [
  {
    slug: 'cleftbelly-trevally', nameBn: 'গেন্দা মৌরি মাছ', nameEn: 'Cleftbelly trevally',
    scientificName: 'Atropus atropos', checklistName: 'Atropus atropos', genus: 'Atropus', family: 'Carangidae',
    localName: 'Genda Mouri', habitatCodes: 'M, S', row: 352,
    commonsFile: 'Atropus atropos - Cleftbelly trevally (টেক চান্দা মাছ) 01.jpg', uploadPath: '0/0a',
    extraNames: ['গেন্দা মৌরি', 'Genda Mouri', 'Bangada', 'Brama atropos', 'Caranx atropus', 'Atropus atropus (misspelling)'],
    credit: 'JIBON (Wikimedia Bangladesh GLAM; IMS Museum, University of Chittagong)', license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', note: '3540×5282; Bangladesh museum specimen; name alias “টেক চান্দা” withheld because it collides with Gazza rhombea.',
  },
  {
    slug: 'yellowtail-scad', nameBn: 'বম মাইত্তা মাছ', nameEn: 'Yellowtail scad',
    scientificName: 'Atule mate', checklistName: 'Atule mate', genus: 'Atule', family: 'Carangidae',
    localName: 'Bom maittya', habitatCodes: 'M, B, R', row: 353,
    commonsFile: 'Atule mate 340437582.jpg', uploadPath: 'c/cf', credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', note: '2048×1306; modern iNaturalist observation, Phuket, Thailand.',
  },
  {
    slug: 'longfin-trevally', nameBn: 'লংফিন ট্রেভ্যালি মাছ', nameEn: 'Longfin trevally',
    scientificName: 'Atropus armatus', checklistName: 'Carangoides armatus', genus: 'Atropus', family: 'Carangidae',
    localName: 'Mouri', habitatCodes: 'M, B, R, S', row: 354,
    commonsFile: 'Longfin trevally.JPG', uploadPath: 'e/e6', credit: 'Kare Kare', license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', note: '1436×792; own-work fish photograph, Port Douglas; checklist combination updated to WoRMS-accepted Atropus armatus.',
  },
  {
    slug: 'longnose-trevally', nameBn: 'লংনোজ ট্রেভ্যালি মাছ', nameEn: 'Longnose trevally',
    scientificName: 'Platycaranx chrysophrys', checklistName: 'Carangoides chrysophrys', genus: 'Platycaranx', family: 'Carangidae',
    localName: 'Mouri', habitatCodes: 'M, B, R', row: 355,
    commonsFile: 'Carangoides chrysophrys Pakistan.JPG', uploadPath: 'e/ec', credit: 'Mohammad Moazzam Khan', license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/', note: '640×286; modern exact-taxon fish photograph from offshore Pakistan; comparatively low resolution, but the higher-resolution Dubai file history began as unidentified fish.',
  },
  {
    slug: 'coastal-trevally', nameBn: 'কোস্টাল ট্রেভ্যালি মাছ', nameEn: 'Coastal trevally',
    scientificName: 'Turrum coeruleopinnatum', checklistName: 'Carangoides coeruleopinnatus', genus: 'Turrum', family: 'Carangidae',
    localName: 'Mouri', habitatCodes: 'M, R', row: 356,
    commonsFile: 'Coastal trevally Bali.jpg', uploadPath: '4/42', credit: 'Kare Kare', license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', note: '1390×684; modern own-work photograph from Bali. File description has spelling variant “caeruleopinnatus”; taxonomy cross-checked to WoRMS-accepted Turrum coeruleopinnatum.',
  },
  {
    slug: 'blue-trevally', nameBn: 'ব্লু ট্রেভ্যালি মাছ', nameEn: 'Blue trevally',
    scientificName: 'Ferdauia ferdau', checklistName: 'Carangoides ferdau', genus: 'Ferdauia', family: 'Carangidae',
    localName: 'Mouri', habitatCodes: 'M, B, R', row: 357,
    commonsFile: 'Blue trevally, Micronesia.jpg', uploadPath: '1/11', credit: 'Dr. Dwayne Meadows, NOAA/NMFS/OPR', license: 'Public domain',
    note: '2272×1704; modern NOAA Coral Kingdom field photograph, 2006; U.S. government work. Checklist combination updated to Ferdauia ferdau.',
  },
  {
    slug: 'bumpnose-trevally', nameBn: 'বাম্পনোজ ট্রেভ্যালি মাছ', nameEn: 'Bumpnose trevally',
    scientificName: 'Atropus hedlandensis', checklistName: 'Carangoides hedlandensis', genus: 'Atropus', family: 'Carangidae',
    localName: 'Mouri', habitatCodes: 'M, R, S', row: 358,
    commonsFile: 'Bumpnose trevally exmouth.jpg', uploadPath: '1/10', credit: 'Kare Kare', license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', note: '492×289; own-work fish photograph from Exmouth, Western Australia; checklist combination updated to WoRMS-accepted Atropus hedlandensis.',
  },
  {
    slug: 'malabar-trevally', nameBn: 'মালাবার ট্রেভ্যালি মাছ', nameEn: 'Malabar trevally',
    scientificName: 'Platycaranx malabaricus', checklistName: 'Carangoides malabaricus', genus: 'Platycaranx', family: 'Carangidae',
    localName: 'Malabar moori', habitatCodes: 'M, R, S', row: 359,
    commonsFile: 'Malabar trevally 2.JPG', uploadPath: 'a/ad', credit: 'Kare Kare', license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', note: '846×408; modern own-work fish photograph from Sri Lanka; checklist combination updated to WoRMS-accepted Platycaranx malabaricus.',
  },
  {
    slug: 'blacktip-trevally', nameBn: 'ব্ল্যাকটিপ ট্রেভ্যালি মাছ', nameEn: 'Blacktip trevally',
    scientificName: 'Caranx heberi', checklistName: 'Caranx heberi', genus: 'Caranx', family: 'Carangidae',
    localName: 'Mouri', habitatCodes: 'M, B, R', row: 360,
    commonsFile: 'Blacktip Trevally Caranx heberi 01.jpg', uploadPath: '5/59', credit: 'Dr. Raju Kasambe', license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', note: '4080×3072; modern 2023 fish-market photograph, Mumbai; Habib & Islam mark row 360 “Present study”.',
  },
  {
    slug: 'giant-trevally', nameBn: 'জায়ান্ট ট্রেভ্যালি মাছ', nameEn: 'Giant trevally',
    scientificName: 'Caranx ignobilis', checklistName: 'Caranx ignobilis', genus: 'Caranx', family: 'Carangidae',
    localName: 'Nilambori', habitatCodes: 'M, B, R, S', row: 362,
    commonsFile: 'Caranx ignobilis 314597146.jpg', uploadPath: '7/72', credit: 'Rolf Lawrenz (iNaturalist)', license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', note: '894×599; modern 2023 iNaturalist field photograph from Australia.',
  },
  {
    slug: 'bluefin-trevally', nameBn: 'ব্লুফিন ট্রেভ্যালি মাছ', nameEn: 'Bluefin trevally',
    scientificName: 'Caranx melampygus', checklistName: 'Caranx melampygus', genus: 'Caranx', family: 'Carangidae',
    localName: 'Nilambori', habitatCodes: 'M, B, R', row: 363,
    commonsFile: 'Caranx melampygus 1.jpg', uploadPath: '0/03', credit: 'Dr. Dwayne Meadows, NOAA/NMFS/OPR', license: 'Public domain',
    note: '1600×1232; modern NOAA Coral Kingdom field photograph, 2004; U.S. government work.',
  },
  {
    slug: 'bigeye-trevally', nameBn: 'বিগআই ট্রেভ্যালি মাছ', nameEn: 'Bigeye trevally',
    scientificName: 'Caranx sexfasciatus', checklistName: 'Caranx sexfasciatus', genus: 'Caranx', family: 'Carangidae',
    localName: 'Boro choukka', habitatCodes: 'M, B, F, R, S', row: 364,
    commonsFile: 'Caranx sexfasciatus in Aceh.jpg', uploadPath: 'b/bb', credit: 'Si Gam', license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', note: '960×523; modern own-work fish photograph, Aceh, 2022.',
  },
  {
    slug: 'shortfin-scad', nameBn: 'শর্টফিন স্ক্যাড মাছ', nameEn: 'Shortfin scad',
    scientificName: 'Decapterus macrosoma', checklistName: 'Decapterus macrosoma', genus: 'Decapterus', family: 'Carangidae',
    localName: 'Lalamburi', habitatCodes: 'M, R', row: 366,
    commonsFile: 'Decapterus macrosoma (FDA 198).jpg', uploadPath: 'e/eb', credit: 'U.S. Food and Drug Administration; photo by J. Deeds', license: 'Public domain',
    note: '1280×960; modern FDA seafood-reference photograph, 2011; U.S. government work.',
  },
  {
    slug: 'japanese-scad', nameBn: 'জাপানিজ স্ক্যাড মাছ', nameEn: 'Japanese scad',
    scientificName: 'Decapterus maruadsi', checklistName: 'Decapterus maruadsi', genus: 'Decapterus', family: 'Carangidae',
    localName: 'Nilambori', habitatCodes: 'M, R', row: 367,
    commonsFile: 'Decapterus maruadsi.jpg', uploadPath: 'a/a8', credit: 're_nebel (iNaturalist)', license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', note: '1536×2048; modern 2019 iNaturalist photograph from Japan.',
  },
]

export const MORE_FISH16: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH16_MEDIA = CANDIDATES.map((candidate) => ({
  file: `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`,
  subject: `${candidate.nameBn} (${candidate.nameEn})`,
  slug: candidate.slug,
  kind: 'image' as const,
  credit: candidate.credit,
  source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(candidate.commonsFile)}`,
  license: candidate.license,
  ...(candidate.licenseUrl ? { licenseUrl: candidate.licenseUrl } : {}),
  verified: true,
  note: `Commons file page reviewed; ${candidate.note}`,
}))
