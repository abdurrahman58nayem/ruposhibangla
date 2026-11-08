import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 18: 14 new taxa, all mapped to direct Supplementary
 * Table-I rows below the row-712 stop marker. Rows with no usable exact-taxon
 * image or already-seeded records are intentionally not replaced with weak or
 * historical illustrations. Checklist facts only; richer biology is partial.
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

const HABITAT_LABEL: Record<string, string> = {
  M: 'marine', B: 'brackish water', F: 'freshwater', R: 'reef-associated', S: 'Sundarbans mangrove',
}
const habitatText = (codes: string) => codes.split(',').map((code) => {
  const key = code.trim()
  return `${key} = ${HABITAT_LABEL[key] ?? 'unmapped'}`
}).join('; ')
const STATUS_LABEL: Record<Candidate['conservation'], string> = {
  LC: 'Least Concern (LC)', NT: 'Near Threatened (NT)', VU: 'Vulnerable (VU)',
  EN: 'Endangered (EN)', CR: 'Critically Endangered (CR)', DD: 'Data Deficient (DD)', NE: 'Not Evaluated (NE)',
}
const STATUS_BN: Record<Candidate['conservation'], string> = {
  LC: 'Least Concern (LC)', NT: 'Near Threatened (NT)', VU: 'Vulnerable (VU)',
  EN: 'Endangered (EN)', CR: 'Critically Endangered (CR)', DD: 'Data Deficient (DD)', NE: 'Not Evaluated (NE)',
}
const UNKNOWN_DETAIL = 'Habib & Islam (2021) Table-I does not provide this species-specific detail; it has not been inferred.'
const BARRACUDA_SAFETY = 'Food-safety note (family-level, not Bangladesh-specific): FDA lists barracudas (Sphyraenidae) among fish associated with ciguatera; the hazard is localized and toxin levels can differ among fish from the same area. Follow current local harvest advisories; this checklist does not assess toxin risk in Bangladesh.'
const FDA_NATURAL_TOXINS = { title: 'U.S. FDA Fish and Fishery Products Hazards and Controls Guidance, Chapter 6: Natural Toxins (2019)', url: 'https://www.fda.gov/media/80235/download', license: 'U.S. FDA guidance' }

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
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is listed in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. Table-I local-name form: “${candidate.localName}”; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}); paper-reported global IUCN category ${candidate.conservation}. ${UNKNOWN_DETAIL}${candidate.family === 'Sphyraenidae' ? ` ${BARRACUDA_SAFETY}` : ''}`,
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
    conservationBn: `Habib & Islam (2021), Supplementary Table-I row ${candidate.row}: বৈশ্বিক IUCN শ্রেণি ${STATUS_BN[candidate.conservation]}। প্রবন্ধটি স্পষ্ট করে যে বাংলাদেশের সামুদ্রিক মাছের জাতীয় IUCN মূল্যায়ন তখনো হয়নি; এটি জাতীয় অবস্থার দাবি নয়।`,
    threats: candidate.family === 'Sphyraenidae' ? BARRACUDA_SAFETY : UNKNOWN_DETAIL,
    conservationActions: 'Species-specific threats or management measures are not stated in this checklist row; none are inferred.',
    colorTags: [],
    image,
    dataStatus: 'partial',
    sources: [
      MARINE_FISH_BD,
      COMMONS(candidate.commonsFile),
      { title: `WoRMS accepted taxon: ${candidate.scientificName}`, url: candidate.taxonomySourceUrl, license: 'taxonomic reference' },
      ...(candidate.family === 'Sphyraenidae' ? [FDA_NATURAL_TOXINS] : []),
    ],
  }
}

const CANDIDATES: Candidate[] = [
  {
    slug: 'moonfish', nameBn: 'মুনফিশ মাছ', nameEn: 'Moonfish', scientificName: 'Mene maculata',
    localName: 'Chan chanda', habitatCodes: 'M, B, R, S', row: 388, conservation: 'NE',
    order: 'Carangaria incertae sedis', family: 'Menidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?id=218450&p=taxdetails',
    commonsFile: 'Pilok Mene maculata.jpg', uploadPath: '5/53', credit: 'LonNyoe', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '3120×4160; modern own-work field/market photograph at Madura, 2023; geotagged Commons file page.',
  },
  {
    slug: 'great-barracuda', nameBn: 'গ্রেট ব্যারাকুডা', nameEn: 'Great barracuda', scientificName: 'Sphyraena barracuda',
    localName: 'Dharkuta', habitatCodes: 'M, B, R, S', row: 389, conservation: 'LC',
    order: 'Carangaria incertae sedis', family: 'Sphyraenidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=345843',
    commonsFile: 'Banco de gran barracudas (Sphyraena barracuda), parque nacional Ras Muhammad, Egipto, 2022-03-27, DD 115.jpg', uploadPath: 'd/d7', credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4612×3075; 2022 underwater field photograph, Ras Muhammad National Park, Egypt; Commons quality assessment and complete author/license metadata.',
  },
  {
    slug: 'yellowstripe-barracuda', nameBn: 'ইয়েলোস্ট্রাইপ ব্যারাকুডা', nameEn: 'Yellowstripe barracuda', scientificName: 'Sphyraena chrysotaenia',
    localName: 'Holde dora dharkuta', habitatCodes: 'M, S', row: 390, conservation: 'NE',
    order: 'Carangaria incertae sedis', family: 'Sphyraenidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127067',
    commonsFile: 'Sphyraena chrysotaenia Japan.jpg', uploadPath: '1/16', credit: 're_nebel (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1536×2048; 2021 field photograph, Onomichi, Japan; iNaturalist copyright review completed by Commons in 2025.',
  },
  {
    slug: 'bigeye-barracuda', nameBn: 'বিগআই ব্যারাকুডা', nameEn: 'Bigeye barracuda', scientificName: 'Sphyraena forsteri',
    localName: 'Dharkuta', habitatCodes: 'M, R, S', row: 391, conservation: 'NE',
    order: 'Carangaria incertae sedis', family: 'Sphyraenidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=212047',
    commonsFile: 'Sphyraena forsteri 511174059.jpg', uploadPath: 'f/f8', credit: 'Austen Novis (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '2048×1536; 2025 field photograph, Indonesia; Commons iNaturalist license review completed in July 2025.',
  },
  {
    slug: 'pickhandle-barracuda', nameBn: 'পিকহ্যান্ডেল ব্যারাকুডা', nameEn: 'Pickhandle barracuda', scientificName: 'Sphyraena jello',
    localName: 'Dharkuta', habitatCodes: 'M, B, R, S', row: 392, conservation: 'NE',
    order: 'Carangaria incertae sedis', family: 'Sphyraenidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=212045',
    commonsFile: 'Pickhandle barracuda (Sphyraena jello) (46722836461).jpg', uploadPath: '0/0c', credit: 'Rickard Zerpe', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '4518×3389; 2019 underwater field photograph, Raja Ampat, Indonesia; Flickr license review completed by Commons.',
  },
  {
    slug: 'obtuse-barracuda', nameBn: 'অবটিউজ ব্যারাকুডা', nameEn: 'Obtuse barracuda', scientificName: 'Sphyraena obtusata',
    localName: 'Dharkuta', habitatCodes: 'M, B, R', row: 393, conservation: 'NE',
    order: 'Carangaria incertae sedis', family: 'Sphyraenidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=212056',
    commonsFile: 'Barracuda (Sphyraena obtusata), Anilao, Filipinas, 2023-08-22, DD 248.jpg', uploadPath: 'e/ed', credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5079×3386; 2023 underwater field photograph, Anilao, Philippines; Commons quality assessment and complete author/license metadata.',
  },
  {
    slug: 'sawtooth-barracuda', nameBn: 'সটুথ ব্যারাকুডা', nameEn: 'Sawtooth barracuda', scientificName: 'Sphyraena putnamae',
    localName: 'Korat dati dharkuta', habitatCodes: 'M, R', row: 394, conservation: 'LC',
    order: 'Carangaria incertae sedis', family: 'Sphyraenidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=212050',
    commonsFile: 'Sphyraena putnamae 433812195.jpg', uploadPath: 'b/ba', credit: 'Ashwit Shetty (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1152×2048; 2024 field photograph, Mumbai, India; Commons iNaturalist license review completed in July 2025.',
  },
  {
    slug: 'blackfin-barracuda', nameBn: 'ব্ল্যাকফিন ব্যারাকুডা', nameEn: 'Blackfin barracuda', scientificName: 'Sphyraena qenie',
    localName: 'Dharkuta', habitatCodes: 'M, R', row: 395, conservation: 'NE',
    order: 'Carangaria incertae sedis', family: 'Sphyraenidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=212049',
    commonsFile: 'Sphyraena qenie 366610655.jpg', uploadPath: '6/6a', credit: 'Debra Baker (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1422×1238; 2024 field photograph, Tuvalu; Commons iNaturalist license review completed in July 2025.',
  },
  {
    slug: 'swordfish', nameBn: 'সোর্ডফিশ', nameEn: 'Swordfish', scientificName: 'Xiphias gladius',
    localName: 'Talwar machh', habitatCodes: 'M', row: 396, conservation: 'LC',
    order: 'Carangiformes', family: 'Xiphiidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=127094',
    commonsFile: 'Espadon (Xiphias gladius) (Ifremer 00764-87622).jpg', uploadPath: '9/99', credit: 'Hugues Evano / IFREMER', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '3000×3452; IFREMER fisheries field-sampling/laboratory photograph, from the Océanothèque collection; CC BY 4.0 metadata verified.',
  },
  {
    slug: 'black-marlin', nameBn: 'ব্ল্যাক মার্লিন', nameEn: 'Black marlin', scientificName: 'Istiompax indica',
    localName: 'Kalo talwar', habitatCodes: 'M', row: 397, conservation: 'DD',
    order: 'Carangiformes', family: 'Istiophoridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=712905',
    commonsFile: 'Istiompax indica 1.png', uploadPath: '5/5e', credit: 'Michael Janke', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '600×411; modern 2013 photograph of a caught black marlin, Watamu, Kenya; FishBase credit and CC BY 3.0 file-page record.',
  },
  {
    slug: 'indo-pacific-sailfish', nameBn: 'ইন্দো-প্যাসিফিক সেলফিশ', nameEn: 'Indo-Pacific sailfish', scientificName: 'Istiophorus platypterus',
    localName: 'Pal machh', habitatCodes: 'M', row: 398, conservation: 'LC',
    order: 'Carangiformes', family: 'Istiophoridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?p=taxdetails&id=158812',
    commonsFile: 'Istiophorus platypterus 101956558.jpg', uploadPath: 'd/dc', credit: 'Robert Webster (iNaturalist)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '1536×2048; modern iNaturalist field photograph, eastern tropical Pacific; Commons license review completed in January 2021.',
  },
  {
    slug: 'margarets-dragonet', nameBn: 'মার্গারেটস ড্রাগনেট', nameEn: "Margaret's dragonet", scientificName: 'Callionymus margaretae',
    localName: 'Dragonet machh', habitatCodes: 'M', row: 401, conservation: 'NE',
    order: 'Callionymiformes', family: 'Callionymidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?id=273200&p=taxdetails',
    commonsFile: "Callionymus margaretae - Margaret's dragonet (লম্বালেজ ড্রাগন বাইলা মাছ) 01.jpg", uploadPath: '7/74', credit: 'JIBON / IMS Museum, University of Chittagong', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '3421×5217; modern 2026 IMS Museum digital photograph from the University of Chittagong; author JIBON, exact species and local name appear in the file description.',
  },
  {
    slug: 'goram-dragonet', nameBn: 'গোরাম ড্রাগনেট', nameEn: 'Goram dragonet', scientificName: 'Diplogrammus goramensis',
    localName: 'Dragonet machh', habitatCodes: 'M, R', row: 404, conservation: 'NE',
    order: 'Callionymiformes', family: 'Callionymidae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?id=276334&p=taxdetails',
    commonsFile: 'Goram Dragonet (Diplogrammus goramensis) (32423239166).jpg', uploadPath: '5/59', credit: 'Rickard Zerpe', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    note: '4608×3456; 2017 underwater field photograph, Halmahera, Indonesia; Flickr license review completed by Commons in 2019.',
  },
  {
    slug: 'largehead-hairtail', nameBn: 'লার্জহেড হেয়ারটেইল', nameEn: 'Largehead hairtail', scientificName: 'Trichiurus lepturus',
    localName: 'Churi machh', habitatCodes: 'M, B, S', row: 409, conservation: 'LC',
    order: 'Scombriformes', family: 'Trichiuridae', taxonomySourceUrl: 'https://www.marinespecies.org/aphia.php?id=127089&p=taxdetails',
    commonsFile: 'Trichiurus lepturus by OpenCage.jpg', uploadPath: '7/75', credit: 'OpenCage', license: 'CC BY-SA 2.5', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
    note: '1000×1000; modern digital aquarium photograph at Osaka Aquarium Kaiyukan, Japan; exact species is identified in the Commons taxonomy metadata.',
  },
]

export const MORE_FISH18: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH18_MEDIA = CANDIDATES.map((candidate) => ({
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
