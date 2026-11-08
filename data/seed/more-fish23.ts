import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 23: 14 eligible direct Table-I rows screened from 498 through 514.
 * Row500's only exact-taxon result was an 1878 historical plate; row505 is already seeded.
 * Row511 uses the higher-resolution Commons original of the modern landing-center photograph,
 * not the small 640×363 FishBase rendition. Row513 is held because its Commons depicts
 * statement conflicts with the file title/caption; row515 is next after this batch.
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
const GROUPER_SAFETY = 'Food-safety caution (family/common-group level; not Bangladesh-specific): the U.S. FDA lists grouper among fish associated with ciguatera fish poisoning. Ciguatoxin occurrence is localized and can vary between fish from the same area; this is not a claim that this individual species or Bangladesh catch is toxic. Follow current local harvest advisories; this checklist does not assess toxin risk in Bangladesh.'
const FDA_NATURAL_TOXINS = {
  title: 'U.S. FDA Fish and Fishery Products Hazards and Controls Guidance, Chapter 6: Natural Toxins (2019)',
  url: 'https://www.fda.gov/media/80235/download',
  license: 'U.S. FDA guidance',
}
const FALSE_TREVALY_TAXON_SOURCE = {
  title: 'False trevally species page (identifies Lactarius lactarius and uses the landing-center photograph)',
  url: 'https://en.wikipedia.org/wiki/False_trevally',
  license: 'taxonomic/image-identification reference',
}

const CANDIDATES: Candidate[] = [
  {
    slug: 'starspotted-grouper', nameBn: 'স্টারস্পটেড গ্রুপার', nameEn: 'Starspotted grouper', scientificName: 'Epinephelus hexagonatus',
    localName: 'Chitra bole', habitatCodes: 'M, R', row: 498, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218232,
    commonsFile: 'Mérou mélifère (Epinephelus hexagonatus) (Ifremer 00756-86776).jpg', uploadPath: '1/1b',
    credit: 'Jerome Huet (IFREMER)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '3,872×2,592; Commons/IFREMER identifies the exact taxon and credits Jerome Huet; image documented as captured during field sampling or laboratory dissections, not an illustration; CC BY 4.0.',
  },
  {
    slug: 'giant-grouper', nameBn: 'জায়ান্ট গ্রুপার', nameEn: 'Giant grouper', scientificName: 'Epinephelus lanceolatus',
    localName: 'Bol koral', habitatCodes: 'M, B, R, S', row: 499, conservation: 'DD',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218224,
    commonsFile: 'Epinephelus lanceolatus by OpenCage.jpg', uploadPath: '5/56',
    credit: 'OpenCage', license: 'CC BY-SA 2.5', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
    note: '2,736×2,736; exact species stated on Commons; modern photograph at Suma Aqualife Park, Kobe, Japan (aquarium, not a field observation); photographer OpenCage; CC BY-SA 2.5.',
  },
  {
    slug: 'malabar-grouper', nameBn: 'মালাবার গ্রুপার', nameEn: 'Malabar grouper', scientificName: 'Epinephelus malabaricus',
    localName: 'Bole coral', habitatCodes: 'M, B, R', row: 501, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218206,
    commonsFile: 'Epinephelus malabaricus in UShaka Sea World 1098.jpg', uploadPath: '9/96',
    credit: 'Amada44', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '4,845×2,484; exact species and photographer Amada44 named on Commons; modern aquarium photograph at UShaka Sea World (2011), not a field observation; CC BY 3.0 selected from the offered licenses.',
  },
  {
    slug: 'honeycomb-grouper', nameBn: 'হানিকম্ব গ্রুপার', nameEn: 'Honeycomb grouper', scientificName: 'Epinephelus merra',
    localName: 'Guti bole', habitatCodes: 'M, R', row: 502, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218228,
    commonsFile: 'Mérou gâteau de cire (Epinephelus merra) (Ifremer 00764-87556).jpg', uploadPath: '1/12',
    credit: 'Jerome Huet (IFREMER)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '3,872×2,592; Commons/IFREMER identifies E. merra and credits Jerome Huet; documented field-sampling or laboratory-dissection photograph, not an illustration; CC BY 4.0.',
  },
  {
    slug: 'comet-grouper', nameBn: 'কমেট গ্রুপার', nameEn: 'Comet grouper', scientificName: 'Epinephelus morrhua',
    localName: 'Bole coral', habitatCodes: 'M, R', row: 503, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218201,
    commonsFile: 'Mérou comète (Epinephelus morrhua) (Ifremer 00764-87557).jpg', uploadPath: '7/7a',
    credit: 'Jerome Huet (IFREMER)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '4,608×3,456; Commons/IFREMER identifies E. morrhua and credits Jerome Huet; documented field-sampling or laboratory-dissection photograph, not an illustration; CC BY 4.0.',
  },
  {
    slug: 'camouflage-grouper', nameBn: 'ক্যামোফ্লাজ গ্রুপার', nameEn: 'Camouflage grouper', scientificName: 'Epinephelus polyphekadion',
    localName: 'Kalo bole', habitatCodes: 'M, R', row: 504, conservation: 'VU',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218197,
    commonsFile: 'Camouflage grouper Epinephelus polyphekadion (5816836758).jpg', uploadPath: '1/10',
    credit: 'Paul Asman and Jill Lenoble', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '1,393×929; modern Flickr underwater photograph from Fiji (2011), Commons names E. polyphekadion and photographers Paul Asman and Jill Lenoble; license review confirmed CC BY 2.0.',
  },
  {
    slug: 'oblique-banded-grouper', nameBn: 'ওব্লিক-ব্যান্ডেড গ্রুপার', nameEn: 'Oblique-banded grouper', scientificName: 'Epinephelus radiatus',
    localName: 'Bol Machh', habitatCodes: 'M, R', row: 506, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218222,
    commonsFile: 'Mérou zébré (Epinephelus radiatus) (Ifremer 00764-87558).jpg', uploadPath: 'f/f6',
    credit: 'Jerome Huet (IFREMER)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '4,608×3,456; Commons/IFREMER identifies E. radiatus and credits Jerome Huet; documented field-sampling or laboratory-dissection photograph, not an illustration; CC BY 4.0.',
  },
  {
    slug: 'greasy-grouper', nameBn: 'গ্রিসি গ্রুপার', nameEn: 'Greasy grouper', scientificName: 'Epinephelus tauvina',
    localName: 'Bole', habitatCodes: 'M, R, S', row: 507, conservation: 'DD',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218205,
    commonsFile: 'Mero crestado gris (Epinephelus tauvina), mar Rojo, Egipto, 2023-04-18, DD 68.jpg', uploadPath: 'f/f0',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5,767×3,845; modern own-work underwater photograph in the Red Sea, Egypt (2023); Commons caption identifies E. tauvina and credits Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'goldenstriped-soapfish', nameBn: 'গোল্ডেন-স্ট্রাইপড সোপফিশ', nameEn: 'Goldenstriped soapfish', scientificName: 'Grammistes sexlineatus',
    localName: 'Choydagi Perch', habitatCodes: 'M, R', row: 508, conservation: 'LC',
    order: 'Perciformes', family: 'Grammistidae', aphiaId: 211864,
    commonsFile: 'Jabonero de seis rayas (Grammistes sexlineatus), Zanzíbar, Tanzania, 2024-06-01, DD 131.jpg', uploadPath: 'f/f7',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4,429×2,953; modern own-work underwater photograph in Zanzibar, Tanzania (2024); Commons caption identifies G. sexlineatus and credits Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'leopard-coral-grouper', nameBn: 'লেপার্ড কোরালগ্রুপার', nameEn: 'Leopard coral grouper', scientificName: 'Plectropomus leopardus',
    localName: 'Chitra bole', habitatCodes: 'M', row: 509, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218261,
    commonsFile: 'Plectropomus leopardus 326868772.jpg', uploadPath: 'c/cd',
    credit: 'portioid (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,048×1,395; 2023 iNaturalist field photograph from Thailand; Commons identifies P. leopardus, credits portioid and records the CC BY-SA 4.0 review.',
  },
  {
    slug: 'roving-coral-grouper', nameBn: 'রোভিং কোরালগ্রুপার', nameEn: 'Roving coral grouper', scientificName: 'Plectropomus pessuliferus',
    localName: 'Lal koral bole', habitatCodes: 'M', row: 510, conservation: 'LC',
    order: 'Perciformes', family: 'Epinephelidae', aphiaId: 218265,
    commonsFile: 'Mero (Plectropomus pessuliferus), parque nacional Ras Muhammad, Egipto, 2022-03-26, DD 140.jpg', uploadPath: '3/3d',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '2,377×1,585; modern own-work underwater photograph in Ras Muhammad National Park, Egypt (2022); Commons caption identifies P. pessuliferus and credits Diego Delso; CC BY-SA 4.0.',
  },
  {
    slug: 'false-trevally', nameBn: 'ফলস ট্রেভ্যালি', nameEn: 'False trevally', scientificName: 'Lactarius lactarius',
    localName: 'Sokedi', habitatCodes: 'M, B, S', row: 511, conservation: 'NE',
    order: 'Sphyraeniformes', family: 'Lactariidae', aphiaId: 218381,
    commonsFile: 'FalseTrevally.jpg', uploadPath: '7/7f',
    credit: 'Ravi Yedavalli', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: '3,264×2,448; modern own-work photograph of landed false trevallies at Visakhapatnam fish landing center, India (2009); file is used in the species article for L. lactarius and shows a commercial catch, not a live field observation; CC BY-SA 3.0. This higher-resolution original was preferred to the exact-name 640×363 FishBase image.',
  },
  {
    slug: 'silver-moony', nameBn: 'সিলভার মুনি', nameEn: 'Silver moony', scientificName: 'Monodactylus argenteus',
    localName: 'Akali chanda', habitatCodes: 'M, B, F', row: 512, conservation: 'LC',
    order: 'Eupercaria incertae sedis1', family: 'Monodactylidae', aphiaId: 218695,
    commonsFile: 'Monodactylus argenteus 173820575.jpg', uploadPath: '0/03',
    credit: 'Lek Khauv (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2,048×1,536; 2021 iNaturalist field photograph from Australia; Commons identifies M. argenteus and records author Lek Khauv and CC BY 4.0 review.',
  },
  {
    slug: 'elongate-ponyfish', nameBn: 'লম্বা টাক চাঁদা', nameEn: 'Elongate ponyfish', scientificName: 'Equulites elongatus',
    localName: 'Tak chanda', habitatCodes: 'M', row: 514, conservation: 'NE',
    order: 'Gerreiformes', family: 'Leiognathidae', aphiaId: 398517,
    commonsFile: 'Equulites elongatus.jpg', uploadPath: '5/51',
    credit: 'BEDO (Thailand)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '640×426; modern own-work digital photograph (2015); Commons description, category and depicts item identify E. elongatus; author BEDO (Thailand); CC BY-SA 4.0. The modest resolution is retained explicitly in this audit.',
  },
]

function makeRecord(candidate: Candidate): Species {
  const image = `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`
  const hasGrouperSafety = candidate.family === 'Epinephelidae'
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
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is listed in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. Table-I local-name form: “${candidate.localName}”; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}); paper-reported global IUCN category ${candidate.conservation}. ${UNKNOWN_DETAIL}${hasGrouperSafety ? ` ${GROUPER_SAFETY}` : ''}`,
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
    threats: hasGrouperSafety ? GROUPER_SAFETY : UNKNOWN_DETAIL,
    conservationActions: 'Species-specific threats or management measures are not stated in this checklist row; none are inferred.',
    colorTags: [],
    image,
    dataStatus: 'partial',
    sources: [
      CHECKLIST_ROW(candidate.row),
      COMMONS(candidate.commonsFile),
      { title: `WoRMS accepted taxon: ${candidate.scientificName}`, url: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${candidate.aphiaId}`, license: 'taxonomic reference' },
      ...(hasGrouperSafety ? [FDA_NATURAL_TOXINS] : []),
      ...(candidate.slug === 'false-trevally' ? [FALSE_TREVALY_TAXON_SOURCE] : []),
    ],
  }
}

export const MORE_FISH23: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH23_MEDIA = CANDIDATES.map((candidate) => ({
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
