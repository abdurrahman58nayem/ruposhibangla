import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 17. Fourteen direct Table-I matches, all at/before row 385.
 * Rows 371, 373 and 374 were already seeded in earlier batches. Rows 368 and 377
 * are deliberately not selected: the available exact-name image candidates
 * were unsuitable (cooked/scientifically conflicted or too small/poor quality).
 * Row 712 remains the hard stop; no later checklist row is introduced here.
 * Records make no species-specific biology or national IUCN claim beyond the
 * checklist. Such details remain explicitly partial rather than inferred.
 */

type Candidate = {
  slug: string
  nameBn: string
  nameEn: string
  scientificName: string
  localName: string
  habitatCodes: string
  row: number
  commonsFile: string
  uploadPath: string
  credit: string
  license: string
  licenseUrl?: string
  note: string
  conservation?: 'LC' | 'VU'
  genus?: string
  checklistName?: string
  taxonomySourceUrl?: string
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
  const status = candidate.conservation ?? 'LC'
  const limitation = 'Habib & Islam Table-I provides the checklist name, local-name transcription, habitat codes and global IUCN category, but not this species-specific detail; do not infer it.'
  return {
    slug: candidate.slug,
    type: 'prani',
    group: 'machh',
    category: 'মাছ',
    nameBn: candidate.nameBn,
    nameEn: candidate.nameEn,
    scientificName: candidate.scientificName,
    otherNames: candidate.checklistName && candidate.checklistName !== candidate.scientificName ? [candidate.checklistName] : [],
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Actinopterygii',
      order: 'Carangiformes',
      family: 'Carangidae',
      genus: candidate.genus ?? candidate.scientificName.split(' ')[0],
      species: candidate.scientificName,
    },
    summary: `${candidate.nameEn} — Habib & Islam (2021) Supplementary Table-I row ${candidate.row}; Bangladesh marine-fish checklist entry; paper-reported global IUCN ${status}.`,
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is included in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. The table records the local-name form “${candidate.localName}”, habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}), and global IUCN category ${status}. ${limitation}`,
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
    conservation: status,
    conservationBn: `বৈশ্বিক IUCN শ্রেণি: ${status === 'VU' ? 'Vulnerable' : 'Least Concern (LC)'}, Habib & Islam (2021), Supplementary Table-I row ${candidate.row}। তাঁদের প্রবন্ধে বাংলাদেশের সামুদ্রিক মাছের জাতীয় IUCN মূল্যায়ন অনুপস্থিত বলা হয়েছে; তাই এটি জাতীয় অবস্থার দাবি নয়।`,
    threats: limitation,
    conservationActions: 'প্রজাতি-নির্দিষ্ট হুমকি বা ব্যবস্থাপনা সুপারিশ এই checklist row-তে নেই; স্থানীয় মূল্যায়ন ছাড়া অনুমান করা হয়নি।',
    colorTags: [],
    image,
    dataStatus: 'partial',
    sources: [
      MARINE_FISH_BD,
      COMMONS(candidate.commonsFile),
      ...(candidate.taxonomySourceUrl ? [{ title: `WoRMS accepted name: ${candidate.scientificName}`, url: candidate.taxonomySourceUrl, license: 'taxonomic reference' }] : []),
    ],
  }
}

const CANDIDATES: Candidate[] = [
  {
    slug: 'rainbow-runner', nameBn: 'রেইনবো রানার মাছ', nameEn: 'Rainbow runner', scientificName: 'Elagatis bipinnulata',
    localName: 'Tota machh', habitatCodes: 'M, R', row: 369,
    commonsFile: 'Elagatis bipinnulata.jpg', uploadPath: 'd/d3', credit: 'Dr. Dwayne Meadows, NOAA/NMFS/OPR', license: 'Public domain',
    note: '960×1280; NOAA Coral Kingdom field photograph, Northwest Hawaiian Islands, 2004; U.S. government work.',
  },
  {
    slug: 'golden-trevally', nameBn: 'গোল্ডেন ট্রেভ্যালি মাছ', nameEn: 'Golden trevally', scientificName: 'Gnathanodon speciosus',
    localName: 'Ghora maittya', habitatCodes: 'M, R', row: 370,
    commonsFile: 'Gnathanodon speciosus 361575196.jpg', uploadPath: '7/76', credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', note: '2048×1251; modern 2024 iNaturalist field photograph, Indonesia; Commons iNaturalist license review completed.',
  },
  {
    slug: 'pilotfish', nameBn: 'পাইলটফিশ', nameEn: 'Pilotfish', scientificName: 'Naucrates ductor',
    localName: 'Pilot machh', habitatCodes: 'M, R', row: 372,
    commonsFile: 'Naucrates ductor Croatia.JPG', uploadPath: 'e/e9', credit: 'Christoph Hübner', license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/', note: '640×480; digital fish photograph, Jezera, Croatia, 2007; author and license named on Commons file page.',
  },
  {
    slug: 'longrakered-trevally', nameBn: 'লংরেকার্ড ট্রেভ্যালি মাছ', nameEn: 'Longrakered trevally', scientificName: 'Atropus mentalis',
    checklistName: 'Ulua mentalis', genus: 'Atropus', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?id=218447&p=taxdetails', localName: 'Chanda', habitatCodes: 'M, R, S', row: 386,
    commonsFile: 'Ulua mentalis.JPG', uploadPath: '6/6f', credit: 'Kare Kare', license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', note: '1462×896; own-work digital fish photograph, Port Douglas, 2011; Table-I combination Ulua mentalis updated to WoRMS-accepted Atropus mentalis.',
  },
  {
    slug: 'doublespotted-queenfish', nameBn: 'ডাবলস্পটেড কুইনফিশ', nameEn: 'Doublespotted queenfish', scientificName: 'Scomberoides lysan',
    localName: 'Chapa', habitatCodes: 'M, B, R', row: 375,
    commonsFile: 'Scomberoides lysan by NPS.jpg', uploadPath: '4/41', credit: 'Randall Watanuki (U.S. National Park Service)', license: 'Public domain',
    note: '504×346; NPS field photograph, modern digital file, PD as U.S. federal employee work; not a historical plate.',
  },
  {
    slug: 'barred-queenfish', nameBn: 'বার্ড কুইনফিশ', nameEn: 'Barred queenfish', scientificName: 'Scomberoides tala',
    localName: 'Bom maittya', habitatCodes: 'M, R', row: 376,
    commonsFile: 'Barred queenfish.jpg', uploadPath: '0/00', credit: 'Hamid Badar Osmany', license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/', note: '758×338; Karachi fish photograph; Commons license review completed 24 February 2020.',
  },
  {
    slug: 'oxeye-scad', nameBn: 'অক্সআই স্ক্যাড মাছ', nameEn: 'Oxeye scad', scientificName: 'Selar boops',
    localName: 'Shitap', habitatCodes: 'M, R, S', row: 378,
    commonsFile: 'Selar boops, Aceh.jpg', uploadPath: '0/04', credit: 'Si Gam', license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', note: '1040×780; own-work field photograph, Aceh Sea, 2022.',
  },
  {
    slug: 'bigeye-scad', nameBn: 'বিগআই স্ক্যাড মাছ', nameEn: 'Bigeye scad', scientificName: 'Selar crumenophthalmus',
    localName: 'Boro choukka', habitatCodes: 'M, R, S', row: 379,
    commonsFile: 'Selar crumenophthalmus (S1079) (23076471431).jpg', uploadPath: 'f/fc', credit: 'Robert Aguilar / Smithsonian Environmental Research Center', license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/', note: '3556×1100; modern 2015 VIMS trawl-survey specimen photograph; Flickr license review completed.',
  },
  {
    slug: 'yellowstripe-scad', nameBn: 'ইয়েলোস্ট্রাইপ স্ক্যাড মাছ', nameEn: 'Yellowstripe scad', scientificName: 'Selaroides leptolepis',
    localName: 'Holde dora choukka', habitatCodes: 'M, B, R', row: 380,
    commonsFile: 'Selaroides leptolepis (FDA 201).jpg', uploadPath: 'e/ea', credit: 'U.S. Food and Drug Administration; photo by J. Deeds', license: 'Public domain',
    note: '1280×960; modern FDA seafood-identification reference photograph, 2011; U.S. government work, Flickr review completed.',
  },
  {
    slug: 'longfin-yellowtail', nameBn: 'লংফিন ইয়েলোটেইল মাছ', nameEn: 'Longfin yellowtail', scientificName: 'Seriola rivoliana',
    localName: 'Mouri', habitatCodes: 'M, R', row: 381,
    commonsFile: 'Seriola rivoliana.JPG', uploadPath: 'f/fa', credit: 'Julien Bidet', license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', note: '4000×3000; modern digital photograph from Baa Atoll, Maldives; uploader received from photographer/copyright holder.',
  },
  {
    slug: 'blackbanded-trevally', nameBn: 'ব্ল্যাকব্যান্ডেড ট্রেভ্যালি মাছ', nameEn: 'Blackbanded trevally', scientificName: 'Seriolina nigrofasciata',
    localName: 'Kalo dora', habitatCodes: 'M, B, R, S', row: 382,
    commonsFile: 'Black banded kingfish.JPG', uploadPath: '5/51', credit: 'Kare Kare', license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', note: '942×346; own-work digital fish photograph, Bali, 2012.',
  },
  {
    slug: 'small-spotted-dart', nameBn: 'স্মলস্পটেড ডার্ট মাছ', nameEn: 'Small spotted dart', scientificName: 'Trachinotus baillonii',
    localName: 'Anjupuli', habitatCodes: 'M, B, R', row: 383,
    commonsFile: 'Small spotted dart (Trachinotus baillonii), Anse Lazio, Praslin, Seychelles.jpg', uploadPath: '2/20', credit: 'Guido and Carrara family', license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/', note: '3384×2253; modern 2023 field photograph, Seychelles; Flickr license review completed.',
  },
  {
    slug: 'snubnose-pompano', nameBn: 'স্নাবনোজ পম্পানো মাছ', nameEn: 'Snubnose pompano', scientificName: 'Trachinotus blochii',
    localName: 'Kata tikka', habitatCodes: 'M, B, R', row: 384,
    commonsFile: 'Trachinotus blochii, Guam.jpg', uploadPath: 'a/a6', credit: 'David Burdick (NOAA Coral Kingdom)', license: 'Public domain',
    note: '700×525; modern NOAA Coral Kingdom field photograph from Guam; U.S. government work, photographer David Burdick.',
  },
  {
    slug: 'arabian-scad', nameBn: 'আরাবিয়ান স্ক্যাড মাছ', nameEn: 'Arabian scad', scientificName: 'Trachurus indicus',
    localName: 'Mouri', habitatCodes: 'M, R', row: 385, conservation: 'VU',
    commonsFile: 'Trachurus indicus.jpg', uploadPath: 'd/d4', credit: 'Hamid Badar Osmany', license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/', note: '755×342; Karachi fish photograph, 2013; Commons license review completed 24 February 2020.',
  },
]

export const MORE_FISH17: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH17_MEDIA = CANDIDATES.map((candidate) => ({
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
