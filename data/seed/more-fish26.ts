import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 26: 14 eligible direct Table-I rows in 549–566.
 * Rows 555, 557 and 560 are held out: surfaced Commons choices were historical-only
 * or no eligible exact-species image was found. WoRMS Pomacentridae orders are retained
 * as Ovalentaria incertae sedis; synonym updates are recorded without losing checklist names.
 */

type Candidate = {
  slug: string; nameBn: string; nameEn: string; scientificName: string
  checklistName?: string; checklistAphiaId?: number
  localName: string; habitatCodes: string; row: number
  conservation: 'LC' | 'NE' | 'DD' | 'NT' | 'VU'
  order: string; family: string; aphiaId: number
  commonsFile: string; uploadPath: string; credit: string
  license: string; licenseUrl: string; note: string
}
const COMMONS = (file: string) => ({ title: 'Wikimedia Commons file page', url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`, license: 'Wikimedia Commons' })
const CHECKLIST_ROW = (row: number) => ({ ...MARINE_FISH_BD, title: `Habib & Islam (2021) Supplementary Table-I — direct checklist match, row ${row}` })
const HABITAT_LABEL: Record<string, string> = { M: 'marine', B: 'brackish water', F: 'freshwater', R: 'reef-associated', S: 'Sundarbans mangrove' }
const habitatText = (codes: string) => codes.split(',').map((code) => { const key = code.trim(); return `${key} = ${HABITAT_LABEL[key] ?? 'unmapped'}` }).join('; ')
const UNKNOWN_DETAIL = 'Habib & Islam (2021) Table-I does not provide this species-specific detail; it has not been inferred.'

const CANDIDATES: Candidate[] = [
  {
    slug: 'onespot-demoiselle', nameBn: 'এক-ছোপ ডেমোয়াজেল', nameEn: 'Onespot demoiselle', scientificName: 'Chrysiptera unimaculata',
    localName: 'Pettoli', habitatCodes: 'M', row: 549, conservation: 'LC', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 218782,
    commonsFile: 'Chrysiptera unimaculata.JPG', uploadPath: '8/88', credit: 'Philippe Bourjon', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: '1,200×939; Commons description identifies Chrysiptera unimaculata; modern underwater photograph from Réunion (2012), by Philippe Bourjon; CC BY-SA 3.0; VRT ticket 2014091910006014 confirmed.',
  },
  {
    slug: 'marginate-dascyllus', nameBn: 'প্রান্ত-দাগ ড্যাসিলাস', nameEn: 'Marginate dascyllus', scientificName: 'Dascyllus marginatus',
    localName: 'Pandua', habitatCodes: 'M, R', row: 550, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212849,
    commonsFile: 'Pomacéntrido (Dascyllus marginatus), mar Rojo, Egipto, 2023-04-19, DD 46.jpg', uploadPath: '8/82', credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,702×1,801; exact species in Commons caption/category; modern underwater field photograph from the Red Sea, Egypt (2023), by Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'white-damsel', nameBn: 'সাদা ড্যামসেল', nameEn: 'White damsel', scientificName: 'Dischistodus perspicillatus',
    localName: 'Aphoo', habitatCodes: 'M, B, R', row: 551, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 280563,
    commonsFile: 'White damsel (Dischistodus perspicillatus) (40321696762).jpg', uploadPath: '6/6c', credit: 'Rickard Zerpe', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '3,644×2,733; exact species in title, caption and category; modern field photo of a juvenile at Lembeh, Indonesia (2018), by Rickard Zerpe; Flickr license review confirms CC BY 2.0.',
  },
  {
    slug: 'honeyhead-damsel', nameBn: 'মধুমাথা ড্যামসেল', nameEn: 'Honey-head damsel', scientificName: 'Dischistodus prosopotaenia',
    localName: 'Pettoli', habitatCodes: 'M, B, R', row: 552, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 280564,
    commonsFile: 'DischistProsopotaenRLS.jpg', uploadPath: '2/2e', credit: 'Graham Edgar / Reef Life Survey', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '1,309×873; Commons description identifies Honeyhead Damsel (Dischistodus prosopotaenia); modern Reef Life Survey field photo from the Great Barrier Reef (2018), by Graham Edgar / RLS; CC BY 3.0.',
  },
  {
    slug: 'yellowtail-demoiselle', nameBn: 'হলুদ-লেজ ডেমোয়াজেল', nameEn: 'Yellowtail demoiselle', scientificName: 'Neopomacentrus azysron',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 553, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 218837,
    commonsFile: 'Neopomacentrus azysron Yellowtail Demoiselle.jpg', uploadPath: '0/08', credit: 'Paul Asman and Jill Lenoble', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '2,323×1,549; exact species in title and description; modern field photograph from Australia, dated 2019, by Paul Asman and Jill Lenoble; Flickr review confirms CC BY 2.0.',
  },
  {
    slug: 'regal-demoiselle', nameBn: 'রাজকীয় ডেমোয়াজেল', nameEn: 'Regal demoiselle', scientificName: 'Neopomacentrus cyanomos',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 554, conservation: 'VU', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 218839,
    commonsFile: 'Pomacéntrido (Neopomacentrus cyanomos), Nosy Sakatia, Madagascar, 2025-09-18, DD 29.jpg', uploadPath: 'a/a0', credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4,757×3,171; exact species in Commons caption/category; modern underwater field photograph from Nosy Sakatia, Madagascar (2025), by Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'obscure-damsel', nameBn: 'অস্পষ্ট-রঙা ড্যামসেল', nameEn: 'Obscure damsel', scientificName: 'Pomacentrus adelus',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 556, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 277127,
    commonsFile: 'PomacentAdel3MarkRosenstein.jpg', uploadPath: 'a/a6', credit: 'Mark Rosenstein', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: '1,300×868; exact Pomacentrus adelus in Commons description/category; modern field photo from Ba, Fiji (2016), by Mark Rosenstein; CC BY-SA 3.0.',
  },
  {
    slug: 'caerulean-damsel', nameBn: 'নীল-আকাশি ড্যামসেল', nameEn: 'Caerulean damsel', scientificName: 'Pomacentrus caeruleus',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 558, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212993,
    commonsFile: 'Clowns de Mayotte.jpg', uploadPath: 'e/e1', credit: 'Frédéric Ducarme', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4,000×3,000; Commons description explicitly identifies Pomacentrus caeruleus among the fish pictured; modern underwater field photo from Mayotte (2017), by Frédéric Ducarme; CC BY-SA 4.0.',
  },
  {
    slug: 'neon-damselfish', nameBn: 'নিয়ন ড্যামসেলফিশ', nameEn: 'Neon damselfish', scientificName: 'Pomacentrus coelestis',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 559, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 277145,
    commonsFile: 'Damisela neón (Pomacentrus coelestis), Anilao, Filipinas, 2023-08-23, DD 45.jpg', uploadPath: '8/84', credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,282×1,521; exact Pomacentrus coelestis in caption/category; modern underwater field photo from Anilao, Philippines (2023), by Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'similar-damsel', nameBn: 'সদৃশ ড্যামসেল', nameEn: 'Similar damsel', scientificName: 'Pomacentrus similis',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 561, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 277170,
    commonsFile: 'Pomacentrus similis 249635529.jpg', uploadPath: '5/58', credit: 'Donald Davesne', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,293×903; exact species in Commons caption/category; modern iNaturalist field photo from Thailand (2022), by Donald Davesne; license review confirms CC BY 4.0. Modest resolution is recorded.',
  },
  {
    slug: 'threespot-damselfish', nameBn: 'তিন-ছোপ ড্যামসেলফিশ', nameEn: 'Threespot damsel', scientificName: 'Pomacentrus tripunctatus',
    localName: 'Aphoo', habitatCodes: 'M, B, R', row: 562, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 212968,
    commonsFile: 'Pomacentrus tripunctatus 264306609.jpg', uploadPath: 'd/de', credit: 'Sönke Bonde (iNaturalist)', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    note: '2,048×1,365; exact species in Commons description/category; modern iNaturalist field photo from Thailand (2022), by Sönke Bonde; CC0 1.0.',
  },
  {
    slug: 'ocellate-damselfish', nameBn: 'চক্ষুবিন্দু ড্যামসেলফিশ', nameEn: 'Ocellate damselfish', scientificName: 'Pomacentrus vaiuli',
    localName: 'Pettoli', habitatCodes: 'M, R', row: 563, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 277176,
    commonsFile: 'Damita ocelada (Pomacentrus vaiuli), Anilao, Filipinas, 2023-08-22, DD 20.jpg', uploadPath: 'b/b5', credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4,913×3,275; exact species in Commons caption/category; modern underwater field photo from Anilao, Philippines (2023), by Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'maroon-anemonefish', nameBn: 'মেরুন অ্যানিমোনফিশ', nameEn: 'Spinecheek anemonefish', scientificName: 'Amphiprion biaculeatus',
    checklistName: 'Premnas biaculeatus', checklistAphiaId: 212768,
    localName: 'Lal clown mach', habitatCodes: 'M, R', row: 564, conservation: 'NE', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 1605249,
    commonsFile: 'Maroon Clown Fish444.jpg', uploadPath: '9/98', credit: 'Benjamint444', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: '1,067×800; Commons description identifies Maroon Clownfish as Premnas biaculeatus; own-work photo by Benjamint444; CC BY-SA 3.0. WoRMS marks checklist Premnas biaculeatus (AphiaID 212768) unaccepted and accepts Amphiprion biaculeatus (1605249); source form retained as an alias.',
  },
  {
    slug: 'pacific-gregory', nameBn: 'প্রশান্ত মহাসাগরীয় গ্রেগরি', nameEn: 'Pacific gregory', scientificName: 'Plectroglyphidodon fasciolatus',
    checklistName: 'Stegastes fasciolatus', checklistAphiaId: 218850,
    localName: 'Pettoli', habitatCodes: 'M, R', row: 566, conservation: 'LC', order: 'Ovalentaria incertae sedis', family: 'Pomacentridae', aphiaId: 1592381,
    commonsFile: 'Plectroglyphidodon fasciolatus, Emily Bay, Kingston 2899, Norfolk Island imported from iNaturalist photo 239784273.jpg', uploadPath: '2/2c', credit: 'Susan Prior (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,500×1,500; Commons title and iNaturalist observation 140112794 identify accepted Plectroglyphidodon fasciolatus; Commons category retains checklist combination Stegastes fasciolatus; modern Norfolk Island field photo by Susan Prior, reviewed CC BY 4.0. WoRMS maps checklist name (218850, superseded combination) to accepted name (1592381).',
  },
]

const makeRecord = (candidate: Candidate): Species => {
  const image = `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`
  const checklistName = candidate.checklistName ?? candidate.scientificName
  const checklistNameNote = checklistName !== candidate.scientificName ? ` Table-I uses ${checklistName}; WoRMS treats it as a superseded/unaccepted combination and accepts ${candidate.scientificName}.` : ''
  return {
    slug: candidate.slug, type: 'prani', group: 'machh', category: 'মাছ', nameBn: candidate.nameBn, nameEn: candidate.nameEn,
    scientificName: candidate.scientificName, otherNames: checklistName === candidate.scientificName ? [] : [checklistName],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Actinopterygii', order: candidate.order, family: candidate.family, genus: candidate.scientificName.split(' ')[0], species: candidate.scientificName },
    summary: `${candidate.nameEn} — Habib & Islam (2021) Supplementary Table-I row ${candidate.row}; Bangladesh marine-fish checklist entry; paper-reported global IUCN ${candidate.conservation}.`,
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is listed in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. Table-I scientific-name form: “${checklistName}”; local-name form: “${candidate.localName}”; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}); paper-reported global IUCN category ${candidate.conservation}.${checklistNameNote} ${UNKNOWN_DETAIL}`,
    physical: UNKNOWN_DETAIL, identification: `Use the accepted scientific name ${candidate.scientificName} with a specialist identification key; Table-I is not a diagnostic description.`,
    diet: UNKNOWN_DETAIL, behavior: UNKNOWN_DETAIL, reproduction: UNKNOWN_DETAIL,
    habitat: `Checklist habitat codes: ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}). No species-specific depth or microhabitat is inferred.`,
    distribution: 'Bangladesh coastal/marine checklist entry; no broader range claim is made here.',
    whereToSee: `Recorded in the Bangladesh marine checklist at row ${candidate.row}; the row does not identify a more precise observation site.`,
    season: UNKNOWN_DETAIL, sizeOrHeight: 'Not provided in the checklist row; size not inferred.', ecologicalRole: UNKNOWN_DETAIL,
    origin: 'native', conservation: candidate.conservation,
    conservationBn: `Habib & Islam (2021), Supplementary Table-I row ${candidate.row}: বৈশ্বিক IUCN শ্রেণি ${candidate.conservation}। প্রবন্ধটি স্পষ্ট করে যে বাংলাদেশের সামুদ্রিক মাছের জাতীয় IUCN মূল্যায়ন তখনো হয়নি; এটি জাতীয় অবস্থার দাবি নয়।`,
    threats: UNKNOWN_DETAIL, conservationActions: 'Species-specific threats or management measures are not stated in this checklist row; none are inferred.',
    colorTags: [], image, dataStatus: 'partial',
    sources: [
      CHECKLIST_ROW(candidate.row), COMMONS(candidate.commonsFile),
      { title: `WoRMS accepted taxon: ${candidate.scientificName}`, url: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${candidate.aphiaId}`, license: 'taxonomic reference' },
      ...(candidate.checklistAphiaId ? [{ title: `WoRMS checklist-name mapping: ${checklistName}`, url: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${candidate.checklistAphiaId}`, license: 'synonym / accepted-name reference' }] : []),
      ...(candidate.slug === 'pacific-gregory' ? [{ title: 'iNaturalist observation taxon confirmation: Plectroglyphidodon fasciolatus', url: 'https://www.inaturalist.org/observations/140112794', license: 'image identity reference' }] : []),
    ],
  }
}
export const MORE_FISH26: Species[] = CANDIDATES.map(makeRecord)
export const MORE_FISH26_MEDIA = CANDIDATES.map((candidate) => ({
  file: `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`,
  subject: `${candidate.nameBn} (${candidate.nameEn})`, slug: candidate.slug, kind: 'image' as const,
  credit: candidate.credit, source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(candidate.commonsFile)}`,
  license: candidate.license, licenseUrl: candidate.licenseUrl, verified: true,
  note: `Commons file page reviewed; ${candidate.note}`,
}))
