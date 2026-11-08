import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 19: 14 direct Table-I row candidates, of which 11 are new
 * canonical taxa and 3 enrich existing taxa through the central dedupe/merge.
 * Rows 420 and 422 have no eligible modern exact-taxon Commons photograph and
 * are intentionally omitted; rows 424–425 complete the 14-row batch.
 */

type Candidate = {
  slug: string
  nameBn: string
  nameEn: string
  scientificName: string
  localName: string
  habitatCodes: string
  row: number
  conservation: 'LC' | 'VU' | 'NT' | 'EN' | 'CR' | 'DD' | 'NE'
  order: string
  family: string
  commonsFile: string
  uploadPath: string
  credit: string
  license: string
  licenseUrl: string
  note: string
  taxonomySourceUrl: string
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
const SCOMBROID_SAFETY = 'Food-safety note: FDA identifies scombroid fishes in Scombridae as potentially subject to scombrotoxin (histamine) formation when time/temperature controls fail. This is a post-harvest handling hazard, not an intrinsic-poison claim or a Bangladesh-specific risk assessment; use appropriate cold-chain handling.'
const FDA_SCOMBROID = { title: 'U.S. FDA Fish and Fishery Products Hazards and Controls Guidance, Chapter 7: Scombrotoxin (Histamine) Formation', url: 'https://www.fda.gov/media/80248/download', license: 'U.S. FDA guidance' }

const CANDIDATES: Candidate[] = [
  {
    slug: 'bullet-tuna', nameBn: 'বুলেট টুনা', nameEn: 'Bullet tuna', scientificName: 'Auxis rochei',
    localName: 'Tuna machh', habitatCodes: 'M, B, S', row: 410, conservation: 'LC',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127015',
    commonsFile: 'Auxis rochei rochei in Greece.jpg', uploadPath: 'c/c3', credit: 'Χρήστος Καραστέργιος (Lemur12)', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: '960×720; own-work digital fish photograph, Greece, 2020; Commons license page lists CC BY-SA 3.0 and GFDL.',
  },
  {
    slug: 'frigate-tuna', nameBn: 'ফ্রিগেট টুনা', nameEn: 'Frigate tuna', scientificName: 'Auxis thazard',
    localName: 'Tuna machh', habitatCodes: 'M', row: 411, conservation: 'NE',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127016',
    commonsFile: 'Auxis thazard flank2.jpg', uploadPath: 'f/fd', credit: 'karimhaddad / iNaturalist', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1536×2048; iNaturalist field image, Algeria, 2020; Commons iNaturalist copyright review passed in September 2024.',
  },
  {
    slug: 'kawakawa', nameBn: 'কাউয়াকাওয়া টুনা', nameEn: 'Kawakawa', scientificName: 'Euthynnus affinis',
    localName: 'Kawa', habitatCodes: 'M, S', row: 412, conservation: 'LC',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=219708',
    commonsFile: 'Euthynnus affinis Hawaii.jpg', uploadPath: '2/21', credit: 'gonodactylus / iNaturalist', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1536×2048; iNaturalist field photo from Alalakeiki Channel, Hawaii, 2018; Commons copyright review passed in September 2024.',
  },
  {
    slug: 'skipjack-tuna', nameBn: 'স্কিপজ্যাক টুনা', nameEn: 'Skipjack tuna', scientificName: 'Katsuwonus pelamis',
    localName: 'Tuna machh', habitatCodes: 'M', row: 413, conservation: 'LC',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127018',
    commonsFile: 'Katsuwonus pelamis Dominican Republic.jpg', uploadPath: 'a/af', credit: 'cotterh / iNaturalist', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2048×910; iNaturalist field photo, Baní, Dominican Republic, 2019; Commons copyright review passed in September 2024. The alternative NOAA FishWatch thumbnail is only 248×150 and is not used.',
  },
  {
    slug: 'short-mackerel', nameBn: 'শর্ট ম্যাকারেল', nameEn: 'Indian mackerel (short-bodied)', scientificName: 'Rastrelliger brachysoma',
    localName: 'Kauwa, Maitta', habitatCodes: 'M, B, S', row: 414, conservation: 'DD',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=273807',
    commonsFile: 'Rastrel brachy 100812-6025 tdp.jpg', uploadPath: '0/0f', credit: 'Wibowo Djatmiko (Wie146)', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: '1800×1200; own-work photograph of an identified 165 mm fish from a Jakarta market, Indonesia, 2010.',
  },
  {
    slug: 'island-mackerel', nameBn: 'আইল্যান্ড ম্যাকারেল', nameEn: 'Island mackerel', scientificName: 'Rastrelliger faughni',
    localName: 'Kauwa, Maitta', habitatCodes: 'M, S', row: 415, conservation: 'DD',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=273808',
    commonsFile: 'Rastrelliger faughni 01.jpg', uploadPath: 'a/ab', credit: 'plains-wanderer / iNaturalist', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2048×1536; iNaturalist field photograph from Thailand, 2022; Commons copyright review passed in September 2024.',
  },
  {
    slug: 'indian-mackerel', nameBn: 'ইন্ডিয়ান ম্যাকারেল', nameEn: 'Indian mackerel', scientificName: 'Rastrelliger kanagurta',
    localName: 'Kauwa, Maitta', habitatCodes: 'M, S', row: 416, conservation: 'DD',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127020',
    commonsFile: 'Rastrelliger kanagurta in Aceh.jpg', uploadPath: '9/97', credit: 'Si Gam', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '960×604; own-work photograph in Aceh, Indonesia, 2022; Commons file page provides the author and CC BY-SA 4.0 terms.',
  },
  {
    slug: 'striped-bonito', nameBn: 'স্ট্রাইপড বোনিটো', nameEn: 'Striped bonito', scientificName: 'Sarda orientalis',
    localName: 'Tuna', habitatCodes: 'M, S', row: 417, conservation: 'LC',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=219713',
    commonsFile: 'Sarda orientalis (Temminck & Schlegel, 1844) 1321388758.jpg', uploadPath: '2/2b', credit: 'National Museum of Natural History, Smithsonian Institution (S. Meek & S. Hildebrand)', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    note: '9694×3072; Smithsonian NMNH voucher specimen record shared through GBIF; Commons file is CC0. This is a specimen reference image, not a historical book plate.',
  },
  {
    slug: 'blue-mackerel', nameBn: 'ব্লু ম্যাকারেল', nameEn: 'Blue mackerel', scientificName: 'Scomber australasicus',
    localName: 'Maitta', habitatCodes: 'M', row: 418, conservation: 'LC',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=219715',
    commonsFile: 'Scomber australasicus - IMG 9102.jpg', uploadPath: '0/09', credit: 'Brian Gratwicke', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '4032×3024; modern Flickr photograph at Salt Rock Wildlife, Durban, South Africa, 2017; Flickr license review confirmed CC BY 2.0.',
  },
  {
    slug: 'narrow-barred-spanish-mackerel', nameBn: 'ন্যারোবার্ড স্প্যানিশ ম্যাকারেল', nameEn: 'Narrow-barred Spanish mackerel', scientificName: 'Scomberomorus commerson',
    localName: 'Champa', habitatCodes: 'M, S', row: 419, conservation: 'NT',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127024',
    commonsFile: 'Scomberomorus commerson Philippines.jpg', uploadPath: '5/5e', credit: 'ppericard / iNaturalist', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2048×1639; iNaturalist field photo, Philippines, 2025; Commons copyright review completed in July 2025.',
  },
  {
    slug: 'korean-seerfish', nameBn: 'কোরিয়ান সিয়ারফিশ', nameEn: 'Korean seerfish', scientificName: 'Scomberomorus koreanus',
    localName: 'Maitta', habitatCodes: 'M', row: 421, conservation: 'LC',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=273813',
    commonsFile: 'Scomberomorus koreanus.jpg', uploadPath: 'd/d2', credit: 'ongzi / iNaturalist', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2048×1536; iNaturalist field photo, Selangor, Malaysia, 2023; Commons copyright review passed in February 2025.',
  },
  {
    slug: 'yellowfin-tuna', nameBn: 'ইয়েলোফিন টুনা', nameEn: 'Yellowfin tuna', scientificName: 'Thunnus albacares',
    localName: 'Tuna machh', habitatCodes: 'M, B', row: 423, conservation: 'NT',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127027',
    commonsFile: 'Fish4499 - Flickr - NOAA Photo Library.jpg', uploadPath: '9/99', credit: 'SEFSC Pascagoula Laboratory / Brandi Noble, NOAA/NMFS/SEFSC', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '2816×2112; NOAA Gulf of Mexico field/reference photo, 2005; Commons records CC BY 2.0 and NOAA public-domain status.',
  },
  {
    slug: 'bigeye-tuna', nameBn: 'বিগআই টুনা', nameEn: 'Bigeye tuna', scientificName: 'Thunnus obesus',
    localName: 'Tuna machh', habitatCodes: 'M', row: 424, conservation: 'VU',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127028',
    commonsFile: 'Thunnus obesus on sampling table.jpg', uploadPath: '3/37', credit: 'Allen Shimada / NOAA NMFS OST', license: 'Public domain', licenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-USGov-NOAA',
    note: '1944×2592; NOAA ship-based longline research sampling photograph, 2006; U.S. government public-domain file page.',
  },
  {
    slug: 'longtail-tuna', nameBn: 'লংটেইল টুনা', nameEn: 'Longtail tuna', scientificName: 'Thunnus tonggol',
    localName: 'Tuna', habitatCodes: 'M', row: 425, conservation: 'DD',
    order: 'Scombriformes', family: 'Scombridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=219722',
    commonsFile: 'Thunnus tonggol (USNM-445331).jpg', uploadPath: 'd/db', credit: 'The U.S. Food and Drug Administration / Jeff Williams', license: 'Public domain', licenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-USGov-FDA',
    note: '6016×2260; modern FDA/Smithsonian/BFAR-NFRDI collaborative fish-voucher photograph, 2017; Commons file explicitly states free of copyright restrictions and public-domain terms.',
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
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is listed in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. Table-I local-name form: “${candidate.localName}”; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}); paper-reported global IUCN category ${candidate.conservation}. ${UNKNOWN_DETAIL} ${SCOMBROID_SAFETY}`,
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
    threats: SCOMBROID_SAFETY,
    conservationActions: 'Species-specific threats or management measures are not stated in this checklist row; none are inferred.',
    colorTags: [],
    image,
    dataStatus: 'partial',
    sources: [
      CHECKLIST_ROW(candidate.row),
      COMMONS(candidate.commonsFile),
      { title: `WoRMS accepted taxon: ${candidate.scientificName}`, url: candidate.taxonomySourceUrl, license: 'taxonomic reference' },
      FDA_SCOMBROID,
    ],
  }
}

export const MORE_FISH19: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH19_MEDIA = CANDIDATES.map((candidate) => ({
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
