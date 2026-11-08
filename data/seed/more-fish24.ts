import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 24: 14 eligible direct Table-I rows screened across 515–533.
 * Row517 Gazza minuta is already seeded; rows518 and 520 had only 300-pixel Commons
 * images, row522's surfaced image was only 567×377, and row532's best surfaced photo
 * was 501×547. Row523's Table-I combination Secutor ruconius is superseded by the
 * WoRMS accepted name Deveximentum ruconius; both source usages are retained.
 */

type Candidate = {
  slug: string
  nameBn: string
  nameEn: string
  scientificName: string
  checklistName?: string
  checklistAphiaId?: number
  synonymName?: string
  synonymAphiaId?: number
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
    slug: 'ornate-ponyfish', nameBn: 'অর্নেট চাঁদা', nameEn: 'Ornate ponyfish', scientificName: 'Equulites lineolatus',
    checklistName: 'Equulites lineolatus', synonymName: 'Leiognathus lineolatus', synonymAphiaId: 218457, localName: 'Tak chanda', habitatCodes: 'M', row: 515, conservation: 'NE',
    order: 'Gerreiformes', family: 'Leiognathidae', aphiaId: 713341,
    commonsFile: 'Leiognathus lineolatus karachi.jpg', uploadPath: 'a/ae',
    credit: 'Hamid Badar Osmany', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '708×364; modern digital fish photograph from Karachi (2009), credited to Hamid Badar Osmany and licensed CC BY 3.0. The Commons title/description uses the superseded combination Leiognathus lineolatus; Commons places it in Category:Equulites lineolatus, and WoRMS maps the former name to accepted Equulites lineolatus (AphiaID 713341). Modest resolution is explicitly recorded.',
  },
  {
    slug: 'splendid-ponyfish', nameBn: 'স্প্লেন্ডিড পনি মাছ', nameEn: 'Splendid ponyfish', scientificName: 'Eubleekeria splendens',
    localName: 'Katali chanda', habitatCodes: 'M, B', row: 516, conservation: 'LC',
    order: 'Gerreiformes', family: 'Leiognathidae', aphiaId: 398527,
    commonsFile: 'Eubleekeria splendens.jpg', uploadPath: '1/18',
    credit: 'BEDO (Thailand)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '640×426; Commons description names Eubleekeria splendens, with own-work attribution to BEDO (Thailand), dated 2015; CC BY-SA 4.0. Modest resolution is explicitly recorded.',
  },
  {
    slug: 'common-ponyfish', nameBn: 'কমন পনি মাছ', nameEn: 'Common ponyfish', scientificName: 'Leiognathus equula',
    localName: 'Tak chanda', habitatCodes: 'M, B, F, S', row: 519, conservation: 'LC',
    order: 'Gerreiformes', family: 'Leiognathidae', aphiaId: 303762,
    commonsFile: 'Leiognathus equula Churaumi.jpg', uploadPath: 'd/dd',
    credit: 'タウナギ', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    note: '6,000×4,000; exact species identified in the Commons caption and structured depicts statement; modern own-work photograph in Okinawa Churaumi Aquarium (19 March 2026), by タウナギ; CC0 1.0. Aquarium setting is stated, not represented as a Bangladesh field observation.',
  },
  {
    slug: 'orangefin-ponyfish', nameBn: 'কমলা-পাখনা চাঁদা', nameEn: 'Orangefin ponyfish', scientificName: 'Photopectoralis bindus',
    localName: 'komola chanda', habitatCodes: 'M, B, S', row: 521, conservation: 'NE',
    order: 'Gerreiformes', family: 'Leiognathidae', aphiaId: 398536,
    commonsFile: 'Photopectoralis bindus - Orangefin ponyfish (কমলা চাঁন্দা মাছ) 01.jpg', uploadPath: '8/84',
    credit: 'JIBON (Wikimedia Bangladesh GLAM)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,313×4,075; exact species in title, description and category; museum specimen collected from Teknaf, photographed through the Institute of Marine Sciences Museum, University of Chittagong GLAM project; photographer JIBON; modern photograph; CC BY-SA 4.0. Commons also categorizes it as Fish of Bangladesh.',
  },
  {
    slug: 'deep-pugnose-ponyfish', nameBn: 'থুতুনি চাঁদা', nameEn: 'Deep pugnose ponyfish', scientificName: 'Deveximentum ruconius',
    checklistName: 'Secutor ruconius', checklistAphiaId: 218463,
    localName: 'Thutuni chanda', habitatCodes: 'M, B, F, S', row: 523, conservation: 'NE',
    order: 'Gerreiformes', family: 'Leiognathidae', aphiaId: 1805566,
    commonsFile: 'Secutor ruconius, Pulau Santan, Banyuwangi, Indonesia.jpg', uploadPath: 'a/a4',
    credit: 'D.G.R. Wiadnya', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '3,648×2,736; Commons description identifies Secutor ruconius, photographed at Pulau Santan, Banyuwangi, Indonesia, and credits D.G.R. Wiadnya; CC BY 4.0. WoRMS marks Secutor ruconius (AphiaID 218463) as a superseded combination and gives accepted Deveximentum ruconius (AphiaID 1805566); the accepted name is used as canonical while the checklist combination is retained as otherNames.',
  },
  {
    slug: 'redtail-butterflyfish', nameBn: 'লাল-লেজ প্রজাপতি মাছ', nameEn: 'Redtail butterflyfish', scientificName: 'Chaetodon collare',
    localName: 'Lal Lezza projapati Machh', habitatCodes: 'M, R', row: 524, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Chaetodontidae', aphiaId: 273330,
    commonsFile: 'Chaetodon collare 340437732.jpg', uploadPath: '3/39',
    credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1,996×1,649; exact Chaetodon collare identification in Commons description and category; modern iNaturalist field photograph from Thailand (2023), credited to portioid; iNaturalist license review confirms CC BY-SA 4.0.',
  },
  {
    slug: 'indian-vagabond-butterflyfish', nameBn: 'ইন্ডিয়ান ভ্যাগাবন্ড প্রজাপতি মাছ', nameEn: 'Indian vagabond butterflyfish', scientificName: 'Chaetodon decussatus',
    localName: 'Projapati machh', habitatCodes: 'M, R', row: 525, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Chaetodontidae', aphiaId: 273333,
    commonsFile: 'Chaetodon decussatus 340634100.jpg', uploadPath: '5/5b',
    credit: 'portioid (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2,048×1,586; exact species identified in Commons description and category; modern iNaturalist field photograph from Thailand (2023), credited to portioid; iNaturalist license review confirms CC BY 4.0.',
  },
  {
    slug: 'blackback-butterflyfish', nameBn: 'কালো-পিঠ প্রজাপতি মাছ', nameEn: 'Blackback butterflyfish', scientificName: 'Chaetodon melannotus',
    localName: 'Projapati machh', habitatCodes: 'M, R', row: 526, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Chaetodontidae', aphiaId: 218743,
    commonsFile: 'Blackback Butterflyfish imported from iNaturalist photo 420769003 on 22 August 2024.jpg', uploadPath: 'b/b2',
    credit: 'jeanpaulboerekamps (iNaturalist; CC0/no rights reserved)', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    note: '1,163×1,088; Commons identifies the subject as Blackback Butterflyfish and links the iNaturalist source photo 420769003; uploader/import record and iNaturalist review confirm CC0 1.0 (author field says no rights reserved). The iNaturalist source is retained for the original observer credit.',
  },
  {
    slug: 'eightband-butterflyfish', nameBn: 'আট-ডোরা প্রজাপতি মাছ', nameEn: 'Indian vagabond butterflyfish (Table-I wording)', scientificName: 'Chaetodon octofasciatus',
    localName: 'Projapati machh', habitatCodes: 'M, R', row: 527, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Chaetodontidae', aphiaId: 218746,
    commonsFile: 'Pez mariposa de ocho franjas (Chaetodon octofasciatus), Anilao, Filipinas, 2023-08-21, DD 55.jpg', uploadPath: 'f/f1',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '3,215×2,143; exact Chaetodon octofasciatus in Commons caption, file title and category; modern own-work underwater field photograph from Anilao, Philippines (2023), by Diego Delso; CC BY-SA 4.0. Table-I row 527 repeats the English common-name wording used at row 525; that source wording is preserved transparently rather than silently corrected.',
  },
  {
    slug: 'vagabond-butterflyfish', nameBn: 'ভ্যাগাবন্ড প্রজাপতি মাছ', nameEn: 'Vagabond butterflyfish', scientificName: 'Chaetodon vagabundus',
    localName: 'Halud projapati machh', habitatCodes: 'M, R', row: 528, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Chaetodontidae', aphiaId: 218754,
    commonsFile: 'Chaetodon vagabundus Réunion.JPG', uploadPath: 'c/ce',
    credit: 'Philippe Bourjon', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: '1,200×888; exact species in file title, description, category and structured depicts statement; modern underwater photograph from Réunion (2008) by Philippe Bourjon; VRT permission is confirmed (ticket 2014091910006014); CC BY-SA 3.0.',
  },
  {
    slug: 'pennant-coralfish', nameBn: 'পেনান্ট কোরালফিশ', nameEn: 'Pennant coralfish', scientificName: 'Heniochus acuminatus',
    localName: 'Dorakata projapati machh', habitatCodes: 'M, B, R', row: 529, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Chaetodontidae', aphiaId: 218765,
    commonsFile: 'Heniochus acuminatus 325519380.jpg', uploadPath: 'a/ab',
    credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1,569×2,048; exact species in Commons description and category; modern iNaturalist field photograph from Thailand (2023), credited to portioid; iNaturalist license review confirms CC BY-SA 4.0.',
  },
  {
    slug: 'singular-bannerfish', nameBn: 'সিঙ্গুলার ব্যানারফিশ', nameEn: 'Singular bannerfish', scientificName: 'Heniochus singularius',
    localName: 'Projapati machh', habitatCodes: 'M, R', row: 530, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Chaetodontidae', aphiaId: 218766,
    commonsFile: 'Heniochus singularius 340761567.jpg', uploadPath: 'a/a9',
    credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1,882×2,048; exact species in Commons description, category and structured depicts statement; modern iNaturalist field photograph from Thailand (2023), credited to portioid; iNaturalist license review confirms CC BY-SA 4.0.',
  },
  {
    slug: 'sixspine-butterflyfish', nameBn: 'ছয়-কাঁটা প্রজাপতি মাছ', nameEn: 'Sixspine butterflyfish', scientificName: 'Parachaetodon ocellatus',
    localName: 'Dorakata projapati machh', habitatCodes: 'M, R', row: 531, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Chaetodontidae', aphiaId: 282012,
    commonsFile: 'Parachaetodon ocellatusRLS.jpg', uploadPath: '5/59',
    credit: 'Graham Edgar / Reef Life Survey', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '1,100×733; exact species in Commons description/category and structured depicts statement; modern Reef Life Survey field photograph at Dampier Marine Park, Australia (2014), credited to Graham Edgar / Reef Life Survey; CC BY 3.0.',
  },
  {
    slug: 'bluering-angelfish', nameBn: 'নীল-চক্র এঞ্জেলফিশ', nameEn: 'Bluering angelfish', scientificName: 'Pomacanthus annularis',
    localName: 'Dudhkomol', habitatCodes: 'M, R', row: 533, conservation: 'LC',
    order: 'Chaetodontiformes', family: 'Pomacanthidae', aphiaId: 220004,
    commonsFile: 'Pomacanthus annularis 189391634.jpg', uploadPath: '8/87',
    credit: 'luluchouette (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,574×989; Commons description/category identify Pomacanthus annularis; modern iNaturalist field photograph from Myanmar (2021), credited to luluchouette; iNaturalist license review confirms CC BY 4.0. The photograph is a regional identity reference, not evidence of Bangladesh occurrence.',
  },
]

const makeRecord = (candidate: Candidate): Species => {
  const image = `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`
  const checklistName = candidate.checklistName ?? candidate.scientificName
  const checklistNameNote = checklistName !== candidate.scientificName
    ? ` Table-I uses the name ${checklistName}; WoRMS treats it as a superseded combination and accepts ${candidate.scientificName}.`
    : ''
  return {
    slug: candidate.slug,
    type: 'prani',
    group: 'machh',
    category: 'মাছ',
    nameBn: candidate.nameBn,
    nameEn: candidate.nameEn,
    scientificName: candidate.scientificName,
    otherNames: checklistName === candidate.scientificName ? [] : [checklistName],
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
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is listed in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. Table-I scientific-name form: “${checklistName}”; local-name form: “${candidate.localName}”; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}); paper-reported global IUCN category ${candidate.conservation}.${checklistNameNote} ${UNKNOWN_DETAIL}`,
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
      ...(candidate.checklistAphiaId ? [{ title: `WoRMS checklist-name mapping: ${checklistName}`, url: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${candidate.checklistAphiaId}`, license: 'synonym / accepted-name reference' }] : []),
      ...(candidate.synonymAphiaId && candidate.synonymName ? [{ title: `WoRMS synonym mapping: ${candidate.synonymName}`, url: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${candidate.synonymAphiaId}`, license: 'synonym / accepted-name reference' }] : []),
    ],
  }
}

export const MORE_FISH24: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH24_MEDIA = CANDIDATES.map((candidate) => ({
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
