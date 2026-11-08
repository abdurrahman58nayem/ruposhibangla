import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 25: 14 eligible direct Table-I rows in 534–548.
 * Row537 Abudefduf bengalensis is already represented in prior seeds. Each
 * Pomacentridae order is retained exactly as WoRMS reports it (Ovalentaria
 * incertae sedis), rather than borrowing the neighbouring Pomacanthidae order.
 */

type Candidate = {
  slug: string
  nameBn: string
  nameEn: string
  scientificName: string
  localName: string
  habitatCodes: string
  row: number
  conservation: 'LC' | 'NE' | 'DD' | 'NT' | 'VU'
  order: string
  family: string
  aphiaId: number
  commonsFile: string
  uploadPath: string
  credit: string
  license: string
  licenseUrl: string
  note: string
}

const COMMONS = (file: string) => ({
  title: 'Wikimedia Commons file page',
  url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
  license: 'Wikimedia Commons',
})
const CHECKLIST_ROW = (row: number) => ({
  ...MARINE_FISH_BD,
  title: `Habib & Islam (2021) Supplementary Table-I — direct checklist match, row ${row}`,
})
const HABITAT_LABEL: Record<string, string> = {
  M: 'marine', B: 'brackish water', F: 'freshwater', R: 'reef-associated', S: 'Sundarbans mangrove',
}
const habitatText = (codes: string) => codes.split(',').map((code) => {
  const key = code.trim()
  return `${key} = ${HABITAT_LABEL[key] ?? 'unmapped'}`
}).join('; ')
const UNKNOWN_DETAIL = 'Habib & Islam (2021) Table-I does not provide this species-specific detail; it has not been inferred.'

const CANDIDATES: Candidate[] = [
  {
    slug: 'emperor-angelfish', nameBn: 'সম্রাট এঞ্জেলফিশ', nameEn: 'Emperor angelfish', scientificName: 'Pomacanthus imperator',
    localName: 'Raja dudhkomol', habitatCodes: 'M, R', row: 534, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Pomacanthidae', aphiaId: 220001,
    commonsFile: 'Pez ángel emperador (Pomacanthus imperator), islas Ad Dimaniyat, Omán, 2024-08-14, DD 47.jpg', uploadPath: '2/2c',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '3,834×2,556; exact Pomacanthus imperator in Commons title/caption and subject category; modern underwater field photograph at the Ad Dimaniyat Islands, Oman (2024), credited to Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'semicircle-angelfish', nameBn: 'অর্ধবৃত্ত এঞ্জেলফিশ', nameEn: 'Semicircle angelfish', scientificName: 'Pomacanthus semicirculatus',
    localName: 'Dudhkomol', habitatCodes: 'M, R', row: 535, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Pomacanthidae', aphiaId: 220003,
    commonsFile: 'Semicircle angelfish (Pomacanthus semicirculatus) (46982094644).jpg', uploadPath: 'c/c6',
    credit: 'Rickard Zerpe', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '3,140×2,355; exact species in Commons title/description/category; modern underwater field photograph, credited to Rickard Zerpe; CC BY 2.0.',
  },
  {
    slug: 'sixbar-angelfish', nameBn: 'ছয়-ডোরা এঞ্জেলফিশ', nameEn: 'Sixbar angelfish', scientificName: 'Pomacanthus sexstriatus',
    localName: 'Chhoi dagi dudhkomol', habitatCodes: 'M, R', row: 536, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Pomacanthidae', aphiaId: 276026,
    commonsFile: 'Maratua Pomacanthus sexstriatus (33).jpg', uploadPath: 'd/d9',
    credit: 'Nanosanchez', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,000×1,336; exact species in Commons caption/category; modern underwater field photograph from Maratua, Indonesia; credited to Nanosanchez; CC BY-SA 4.0. Habib & Islam (2021) row536 marks this Bangladesh record “Present study”; the checklist paper also depicts the species from Saint Martin’s Island in Fig. 3.',
  },
  {
    slug: 'banded-sergeant', nameBn: 'সাত-ডোরা সার্জেন্ট', nameEn: 'Banded sergeant', scientificName: 'Abudefduf septemfasciatus',
    localName: 'Pathari', habitatCodes: 'M, R', row: 538, conservation: 'LC',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212878,
    commonsFile: 'Abudefduf septemfasciatus 582210382.jpg', uploadPath: '0/06',
    credit: 'Susan Prior (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,500×1,500; exact species in Commons description/category and iNaturalist source; modern field photograph by Susan Prior; iNaturalist copyright review confirms CC BY 4.0.',
  },
  {
    slug: 'scissortail-sergeant', nameBn: 'কাঁচি-লেজ সার্জেন্ট', nameEn: 'Scissortail sergeant', scientificName: 'Abudefduf sexfasciatus',
    localName: 'Pathari', habitatCodes: 'M, R', row: 539, conservation: 'NE',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 159289,
    commonsFile: 'Abudefduf sexfasciatus 341062205.jpg', uploadPath: 'f/fb',
    credit: 'Hugo Innes (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2,048×1,536; exact species in Commons description, category and structured depicts statement; modern field photograph from Japan by Hugo Innes; iNaturalist copyright review confirms CC BY 4.0.',
  },
  {
    slug: 'blackspot-sergeant', nameBn: 'কালো-ছোপ সার্জেন্ট', nameEn: 'Blackspot sergeant', scientificName: 'Abudefduf sordidus',
    localName: 'Pathari', habitatCodes: 'M, B, R', row: 540, conservation: 'LC',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212888,
    commonsFile: 'Blackspot Sergeant imported from iNaturalist photo 420766459 on 23 August 2024.jpg', uploadPath: 'a/a9',
    credit: 'Jean-Paul Boerekamps (iNaturalist)', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    note: '1,910×1,992; Commons title, description/category and iNaturalist-linked source identify Blackspot Sergeant (Abudefduf sordidus); modern field photograph credited to Jean-Paul Boerekamps; source is marked CC0/no rights reserved.',
  },
  {
    slug: 'indo-pacific-sergeant', nameBn: 'ইন্দো-প্যাসিফিক সার্জেন্ট', nameEn: 'Indo-Pacific sergeant', scientificName: 'Abudefduf vaigiensis',
    localName: 'Pathari', habitatCodes: 'M, R', row: 541, conservation: 'LC',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212879,
    commonsFile: 'Sargento mayor del Pacífico (Abudefduf vaigiensis), Zanzíbar, Tanzania, 2024-05-31, DD 84.jpg', uploadPath: '8/80',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '3,452×2,301; exact Abudefduf vaigiensis in title/caption/category; modern underwater field photograph from Zanzibar, Tanzania (2024) by Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'saddle-anemonefish', nameBn: 'স্যাডল অ্যানিমোনফিশ', nameEn: 'Saddle anemonefish', scientificName: 'Amphiprion ephippium',
    localName: 'Mudhah', habitatCodes: 'M, R', row: 542, conservation: 'LC',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212782,
    commonsFile: 'Amphiprion ephippium 341445553.jpg', uploadPath: '6/60',
    credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,022×1,829; exact species in Commons description/category; modern iNaturalist field photograph credited to portioid; license review confirms CC BY-SA 4.0.',
  },
  {
    slug: 'orange-clownfish', nameBn: 'কমলা ক্লাউনফিশ', nameEn: 'Orange clownfish', scientificName: 'Amphiprion percula',
    localName: 'Parri Mach', habitatCodes: 'M, R', row: 543, conservation: 'NE',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 278402,
    commonsFile: 'Clown anemonefish (Amphiprion percula) at Sea Life Melbourne Aquarium.jpg', uploadPath: 'e/e6',
    credit: 'fir0002', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5,699×3,799; exact Amphiprion percula in Commons title/description/category; modern photograph by fir0002 at Sea Life Melbourne Aquarium (captive setting explicitly stated); CC BY-SA 4.0.',
  },
  {
    slug: 'big-lip-damsel', nameBn: 'বড়-ঠোঁট ড্যামসেল', nameEn: 'Big-lip damsel', scientificName: 'Cheiloprion labiatus',
    localName: 'Mudhah', habitatCodes: 'M, R', row: 544, conservation: 'NE',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 280136,
    commonsFile: 'Cheiloprion labiatus 564517253.jpg', uploadPath: '0/00',
    credit: 'Debra Baker (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '996×738; exact Cheiloprion labiatus in Commons description/category; modern iNaturalist field photograph credited to Debra Baker; license review confirms CC BY 4.0. Modest resolution is recorded explicitly.',
  },
  {
    slug: 'green-puller', nameBn: 'সবুজ পুলার', nameEn: 'Green puller', scientificName: 'Chromis cinerascens',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 545, conservation: 'LC',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212815,
    commonsFile: 'Chromis cinerascens 329916637.jpg', uploadPath: 'e/e3',
    credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,048×1,506; exact species in Commons description/category; modern iNaturalist field photograph credited to portioid; license review confirms CC BY-SA 4.0. The paper labels row545 “Present Study” and includes C. cinerascens among new Bangladesh distribution records in Fig. 2.',
  },
  {
    slug: 'ternate-chromis', nameBn: 'তের্নাতে ক্রোমিস', nameEn: 'Ternate chromis', scientificName: 'Chromis ternatensis',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 546, conservation: 'NE',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212810,
    commonsFile: 'Chromis ternatensis 329666517.jpg', uploadPath: 'f/fb',
    credit: 'Donald Davesne (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2,048×1,536; exact species in Commons description/category; modern iNaturalist field photograph credited to Donald Davesne; license review confirms CC BY 4.0.',
  },
  {
    slug: 'blue-green-chromis', nameBn: 'নীল-সবুজ ক্রোমিস', nameEn: 'Blue green damselfish', scientificName: 'Chromis viridis',
    localName: 'Neelima', habitatCodes: 'M, R', row: 547, conservation: 'NE',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212811,
    commonsFile: 'Blue-green Chromis, Kiribati imported from iNaturalist photo 345755248.jpg', uploadPath: '1/12',
    credit: 'Debra Baker (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,938×1,484; Commons title/description and iNaturalist source identify Blue-green Chromis; modern field photograph from Kiribati credited to Debra Baker; license review confirms CC BY 4.0.',
  },
  {
    slug: 'surge-damselfish', nameBn: 'সার্জ ড্যামসেলফিশ', nameEn: 'Surge damselfish', scientificName: 'Chrysiptera brownriggii',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 548, conservation: 'NE',
    order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 276827,
    commonsFile: 'Chrysiptera brownriggii Réunion.jpg', uploadPath: 'e/ed',
    credit: 'Philippe Bourjon', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1,200×984; exact species in Commons description/category; modern field photograph from Réunion by Philippe Bourjon; CC BY-SA 4.0; Commons permission ticket 2014091910006014 is documented on the file page. Modest resolution is recorded explicitly.',
  },
]

const makeRecord = (candidate: Candidate): Species => {
  const image = `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`
  return {
    slug: candidate.slug,
    type: 'prani',
    group: 'machh',
    category: 'মাছ',
    nameBn: candidate.nameBn,
    nameEn: candidate.nameEn,
    scientificName: candidate.scientificName,
    otherNames: [],
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Actinopterygii',
      order: candidate.order,
      family: candidate.family,
      genus: candidate.scientificName.split(' ')[0],
      species: candidate.scientificName,
    },
    summary: `${candidate.nameEn} — Habib & Islam (2021) Supplementary Table-I row ${candidate.row}; Bangladesh marine-fish checklist entry; paper-reported global IUCN ${candidate.conservation}.`,
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is listed in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. Table-I local-name form: “${candidate.localName}”; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}); paper-reported global IUCN category ${candidate.conservation}. ${UNKNOWN_DETAIL}`,
    physical: UNKNOWN_DETAIL,
    identification: `Use the accepted scientific name ${candidate.scientificName} with a specialist identification key; Table-I is not a diagnostic description.`,
    diet: UNKNOWN_DETAIL,
    behavior: UNKNOWN_DETAIL,
    reproduction: UNKNOWN_DETAIL,
    habitat: `Checklist habitat codes: ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}). No species-specific depth or microhabitat is inferred.`,
    distribution: 'Bangladesh coastal/marine checklist entry; no broader range claim is made here.',
    whereToSee: `Recorded in the Bangladesh marine checklist at row ${candidate.row}; the row does not identify a more precise observation site.`,
    season: UNKNOWN_DETAIL,
    sizeOrHeight: 'Not provided in the checklist row; size not inferred.',
    ecologicalRole: UNKNOWN_DETAIL,
    origin: 'native',
    conservation: candidate.conservation,
    conservationBn: `Habib & Islam (2021), Supplementary Table-I row ${candidate.row}: বৈশ্বিক IUCN শ্রেণি ${candidate.conservation}। প্রবন্ধটি স্পষ্ট করে যে বাংলাদেশের সামুদ্রিক মাছের জাতীয় IUCN মূল্যায়ন তখনো হয়নি; এটি জাতীয় অবস্থার দাবি নয়।`,
    threats: UNKNOWN_DETAIL,
    conservationActions: 'Species-specific threats or management measures are not stated in this checklist row; none are inferred.',
    colorTags: [],
    image,
    dataStatus: 'partial',
    sources: [
      CHECKLIST_ROW(candidate.row),
      COMMONS(candidate.commonsFile),
      { title: `WoRMS accepted taxon: ${candidate.scientificName}`, url: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${candidate.aphiaId}`, license: 'taxonomic reference' },
    ],
  }
}

export const MORE_FISH25: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH25_MEDIA = CANDIDATES.map((candidate) => ({
  file: `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`,
  subject: `${candidate.nameBn} (${candidate.nameEn})`,
  slug: candidate.slug,
  kind: 'image' as const,
  credit: candidate.credit,
  source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(candidate.commonsFile)}`,
  license: candidate.license,
  licenseUrl: candidate.licenseUrl,
  verified: true,
  note: `Commons file page reviewed; ${candidate.note}`,
}))
