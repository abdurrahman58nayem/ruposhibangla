import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 22: 14 direct Supplementary Table-I rows screened from row 479 onward.
 * Row 479's Commons file was a different species; row 480 surfaced only historical plates;
 * row 481 is explicitly questionable; row 485 is an existing seed; row 491 lacked an eligible file.
 * The selected row 482 image is the exact-taxon Réunion 2 photograph, not the misleadingly
 * titled neighboring file whose description identifies Kyphosus vaigiensis.
 */

type Candidate = {
  slug: string
  nameBn: string
  nameEn: string
  scientificName: string
  localName: string
  habitatCodes: string
  row: number
  conservation: 'LC' | 'NE' | 'DD' | 'NT'
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
    slug: 'blue-sea-chub', nameBn: 'কালাফুনি মাছ', nameEn: 'Blue sea chub', scientificName: 'Kyphosus cinerascens',
    localName: 'Kalafuni, Bida machh', habitatCodes: 'M, R', row: 482, conservation: 'LC',
    order: 'Centrarchiformes', family: 'Kyphosidae', aphiaId: 218708,
    commonsFile: 'Kyphosus cinerascens Réunion 2.jpg', uploadPath: '8/81',
    credit: 'Philippe Bourjon', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1,200×857; modern digital photograph from Réunion (2021); Commons description/category and depicts statement identify K. cinerascens; author Philippe Bourjon and CC BY-SA 4.0 are confirmed, with permission archived by Wikimedia VRT (ticket 2014091710035746).',
  },
  {
    slug: 'brassy-chub', nameBn: 'বিডা মাছ', nameEn: 'Brassy chub', scientificName: 'Kyphosus vaigiensis',
    localName: 'Bida machh', habitatCodes: 'M', row: 483, conservation: 'LC',
    order: 'Centrarchiformes', family: 'Kyphosidae', aphiaId: 218706,
    commonsFile: 'Chopa (Kyphosus vaigiensis), islas Ad Dimaniyat, Omán, 2024-08-13, DD 115.jpg', uploadPath: 'f/fe',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5,821×3,881; modern own-work field photograph from Ad Dimaniyat Islands, Oman (2024); Commons caption names K. vaigiensis and credits Diego Delso under CC BY-SA 4.0.',
  },
  {
    slug: 'fourlined-terapon', nameBn: 'চার-ডোরি বরগুনি', nameEn: 'Fourlined terapon', scientificName: 'Pelates quadrilineatus',
    localName: 'Barguni', habitatCodes: 'M, B, R', row: 484, conservation: 'NE',
    order: 'Centrarchiformes', family: 'Terapontidae', aphiaId: 127077,
    commonsFile: 'Pelates quadrilineatus - Fourlined terapon (বরগুনি মাছ) 01.jpg', uploadPath: 'e/eb',
    credit: 'JIBON (Wikimedia Bangladesh GLAM)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '3,087×4,654; modern University of Chittagong Institute of Marine Sciences Museum specimen photograph; Commons identifies the exact species, JIBON and CC BY-SA 4.0.',
  },
  {
    slug: 'largescaled-terapon', nameBn: 'বড়-আঁশি টেরাপন', nameEn: 'Largescaled terapon', scientificName: 'Terapon theraps',
    localName: 'Barguni', habitatCodes: 'M, B, F, R, S', row: 486, conservation: 'LC',
    order: 'Centrarchiformes', family: 'Terapontidae', aphiaId: 218349,
    commonsFile: 'Terapon theraps 326862448.jpg', uploadPath: '2/23',
    credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1,747×1,439; 2023 iNaturalist field photograph from Thailand; Commons record identifies T. theraps, contributor portioid and CC BY-SA 4.0.',
  },
  {
    slug: 'chocolate-hind', nameBn: 'চকলেট হাইন্ড', nameEn: 'Chocolate hind', scientificName: 'Cephalopholis boenak',
    localName: 'Chitra bole', habitatCodes: 'M, R', row: 487, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218182,
    commonsFile: 'Serránido (Cephalopholis boenak), Nosy Tanikely, Madagascar, 2025-09-20, DD 09.jpg', uploadPath: 'a/a7',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5,851×3,901; modern own-work field photograph from Madagascar (2025); Commons file page identifies C. boenak, Diego Delso, CC BY-SA 4.0 and Quality image status.',
  },
  {
    slug: 'bluelined-hind', nameBn: 'নীল-রেখা হাইন্ড', nameEn: 'Bluelined hind', scientificName: 'Cephalopholis formosa',
    localName: 'Neel Dagi Bole', habitatCodes: 'M, R', row: 488, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218190,
    commonsFile: 'Cephalopholis formosa 333914688.jpg', uploadPath: '3/3f',
    credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,048×1,651; 2023 iNaturalist field photograph from Thailand; Commons identifies C. formosa, contributor portioid and CC BY-SA 4.0.',
  },
  {
    slug: 'vermillion-grouper', nameBn: 'ভার্মিলিয়ন গ্রুপার', nameEn: 'Vermillion grouper', scientificName: 'Cephalopholis miniata',
    localName: 'Bole Machh', habitatCodes: 'M, R, S', row: 489, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218184,
    commonsFile: 'Cierva coral (Cephalopholis miniata), Zanzíbar, Tanzania, 2024-05-30, DD 14.jpg', uploadPath: '6/64',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '6,059×4,039; modern own-work field photograph from Zanzibar (2024); Commons identifies C. miniata, Diego Delso, CC BY-SA 4.0 and Quality image status.',
  },
  {
    slug: 'tomato-hind', nameBn: 'টমেটো হাইন্ড', nameEn: 'Tomato hind', scientificName: 'Cephalopholis sonnerati',
    localName: 'Chatki', habitatCodes: 'M, R', row: 490, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218183,
    commonsFile: 'Cephalopholis sonnerati in Mauritius.jpg', uploadPath: 'd/da',
    credit: 'Alain Feulvarch', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1,280×851; modern fish photograph from Mauritius; Commons identifies C. sonnerati, photographer Alain Feulvarch and CC BY-SA 4.0.',
  },
  {
    slug: 'humpback-grouper-cromileptes', nameBn: 'হাম্পব্যাক গ্রুপার', nameEn: 'Humpback grouper', scientificName: 'Cromileptes altivelis',
    localName: 'Kalophotshada bole', habitatCodes: 'M, R', row: 492, conservation: 'DD',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218193,
    commonsFile: 'Humpback grouper (Cromileptes altivelis) (38933783460).jpg', uploadPath: '5/5f',
    credit: 'Rickard Zerpe', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '3,516×2,637; Flickr field photograph from Lembeh, Indonesia (2018); Commons identifies C. altivelis and author Rickard Zerpe under CC BY 2.0.',
  },
  {
    slug: 'duskytail-grouper', nameBn: 'ডাস্কিটেইল গ্রুপার', nameEn: 'Duskytail grouper', scientificName: 'Epinephelus bleekeri',
    localName: 'Bole macch', habitatCodes: 'M', row: 493, conservation: 'NT',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 273838,
    commonsFile: 'Epinephelus bleekeri, Indonesia imported from iNaturalist photo 361046125.jpg', uploadPath: '6/62',
    credit: 'portioid (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,427×2,048; 2024 iNaturalist field photograph from Indonesia; Commons/iNaturalist record identifies E. bleekeri, contributor portioid and CC BY 4.0.',
  },
  {
    slug: 'brownspotted-grouper', nameBn: 'বাদামি-ছোপ গ্রুপার', nameEn: 'Brownspotted grouper', scientificName: 'Epinephelus chlorostigma',
    localName: 'Badami bole', habitatCodes: 'M, R', row: 494, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218199,
    commonsFile: 'Epinephelus chlorostigma 2.JPG', uploadPath: '7/70',
    credit: 'Jean-Lou Justine', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: '640×319; modern own-work field photograph from New Caledonia (2009); Commons identifies E. chlorostigma, Jean-Lou Justine and CC BY-SA 3.0. Retained as an identifiable photograph, not a plate; modest resolution is explicitly noted.',
  },
  {
    slug: 'orangespotted-grouper', nameBn: 'কমলা-ছোপ গ্রুপার', nameEn: 'Orangespotted grouper', scientificName: 'Epinephelus coioides',
    localName: 'Futki bole', habitatCodes: 'M, B, R, S', row: 495, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218200,
    commonsFile: 'Epinephelus coioides (Orange spotted grouper) in the Philippines.jpg', uploadPath: '7/78',
    credit: 'Obsidian Soul', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1,817×654; modern own-work photograph from the Philippines (2017); Commons identifies E. coioides, author Obsidian Soul and CC BY-SA 4.0.',
  },
  {
    slug: 'cloudy-grouper', nameBn: 'মেঘলা গ্রুপার', nameEn: 'Cloudy grouper', scientificName: 'Epinephelus erythrurus',
    localName: 'Chitra bole', habitatCodes: 'M, B, R, S', row: 496, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 273850,
    commonsFile: 'Epinephelus erythrurus 340757330.jpg', uploadPath: '1/14',
    credit: 'portioid (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2,048×1,481; 2023 iNaturalist field photograph from Thailand; Commons/iNaturalist record identifies E. erythrurus, contributor portioid and CC BY 4.0.',
  },
  {
    slug: 'blacktip-grouper', nameBn: 'কালো-ডগা গ্রুপার', nameEn: 'Blacktip grouper', scientificName: 'Epinephelus fasciatus',
    localName: 'Lal bole', habitatCodes: 'M, B, R, S', row: 497, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218207,
    commonsFile: 'Mero de punta negra (Epinephelus fasciatus), Nosy Kalakajoro, Madagascar, 2025-09-14, DD 37.jpg', uploadPath: '3/32',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4,865×3,243; modern own-work field photograph from Madagascar (2025); Commons identifies E. fasciatus, Diego Delso and CC BY-SA 4.0; Quality image candidate.',
  },
]

function makeRecord(candidate: Candidate): Species {
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
    threats: 'Species-specific threats are not stated in this checklist row; none are inferred.',
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

export const MORE_FISH22: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH22_MEDIA = CANDIDATES.map((candidate) => ({
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
