import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 21: 14 direct Table-I rows screened from row 455 onward.
 * Row 454 is questionable; existing accepted-taxon seed entries, taxa without a
 * defensible modern Commons photograph, and rows beyond 479 were not used.
 * Row 471's checklist spelling is normalized to WoRMS's accepted P. heptacantha.
 */

type Candidate = {
  slug: string
  nameBn: string
  nameEn: string
  scientificName: string
  checklistName?: string
  otherNames?: string[]
  localName: string
  habitatCodes: string
  row: number
  conservation: 'LC' | 'NE'
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
    slug: 'raggedfin-parrotfish', nameBn: 'র‍্যাগডফিন টিয়া মাছ', nameEn: 'Raggedfin parrotfish',
    scientificName: 'Chlorurus rhakoura', localName: 'Kala tia machh', habitatCodes: 'M, B, R',
    row: 455, conservation: 'LC', order: 'Labriformes', family: 'Labridae', aphiaId: 277510,
    commonsFile: 'Chlorurus rhakoura, Thailand imported from iNaturalist photo 254172491.jpg', uploadPath: 'b/b9',
    credit: 'Pavel Borodin (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '864×502; 2023 iNaturalist field photograph from Thailand; Commons iNaturalist review confirms Pavel Borodin and CC BY 4.0.',
  },
  {
    slug: 'blue-barred-parrotfish', nameBn: 'নীল-ডোরি টিয়া মাছ', nameEn: 'Blue-barred parrotfish',
    scientificName: 'Scarus ghobban', localName: 'Nil tia machh', habitatCodes: 'M, B, R',
    row: 456, conservation: 'LC', order: 'Labriformes', family: 'Labridae', aphiaId: 219127,
    commonsFile: 'Loro barbazul (Scarus ghobban), La Paz, Baja California, México, 2024-12-20, DD 55.jpg', uploadPath: '7/76',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4,917×3,278; modern own-work field photograph from La Paz, Mexico (2024); Commons file page confirms Diego Delso, exact taxon and CC BY-SA 4.0.',
  },
  {
    slug: 'common-parrotfish', nameBn: 'সাধারণ টিয়া মাছ', nameEn: 'Common parrotfish',
    scientificName: 'Scarus psittacus', localName: 'Tia Machh', habitatCodes: 'M, R',
    row: 457, conservation: 'LC', order: 'Labriformes', family: 'Labridae', aphiaId: 219125,
    commonsFile: 'Pez loro (Scarus psittacus), Nosy Antanimora, Madagascar, 2025-09-15, DD 71.jpg', uploadPath: '3/3d',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4,914×3,276; modern own-work field photograph from Madagascar (2025); Commons file page identifies Diego Delso and CC BY-SA 4.0.',
  },
  {
    slug: 'rivulated-parrotfish', nameBn: 'রেখা-ডোরা টিয়া মাছ', nameEn: 'Rivulated parrotfish',
    scientificName: 'Scarus rivulatus', localName: 'Tia machh', habitatCodes: 'M, R',
    row: 458, conservation: 'LC', order: 'Labriformes', family: 'Labridae', aphiaId: 367210,
    commonsFile: 'Scarus rivulatus, Aborek Island imported from iNaturalist photo 330177773.jpg', uploadPath: 'a/ac',
    credit: 'Libby Hepburn (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,910×1,627; 2023 iNaturalist field photograph from Aborek Island, Indonesia; Commons review confirms Libby Hepburn and CC BY 4.0.',
  },
  {
    slug: 'whipfin-silver-biddy', nameBn: 'হুইপফিন রূপালি-বিডি', nameEn: 'Whipfin silver-biddy',
    scientificName: 'Gerres filamentosus', localName: 'Dom machh', habitatCodes: 'M, B, F, S',
    row: 463, conservation: 'LC', order: 'Gerreiformes', family: 'Gerreidae', aphiaId: 218524,
    commonsFile: 'Gerres filamentosus (Cuvier, 1829).jpg', uploadPath: 'c/c7',
    credit: 'BEDO', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '640×426; own-work digital photograph made in Thailand in 2015; Commons file page records author BEDO and CC BY-SA 4.0. Used as a modest-resolution but identifiable modern photograph, not a plate.',
  },
  {
    slug: 'glowbelly', nameBn: 'আলোকোদরী মাছ', nameEn: 'Glowbelly',
    scientificName: 'Acropoma japonicum', localName: 'Samudrik punti mach', habitatCodes: 'M',
    row: 467, conservation: 'NE', order: 'Pempheriformes', family: 'Acropomatidae', aphiaId: 220048,
    commonsFile: 'Acropoma japonicum.png', uploadPath: 'c/ca',
    credit: 'Hamid Badar Osmany', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '600×309; 2014 digital FishBase photograph of the exact taxon; Commons file page identifies Hamid Badar Osmany and CC BY 3.0.',
  },
  {
    slug: 'yellowfin-goatfish', nameBn: 'হলুদ-পাখনার ছাগলমাছ', nameEn: 'Yellowfin goatfish',
    scientificName: 'Mulloidichthys vanicolensis', localName: 'Chhagol machh', habitatCodes: 'M, R',
    row: 469, conservation: 'LC', order: 'Mulliformes', family: 'Mullidae', aphiaId: 218648,
    commonsFile: 'Grupo de chivos de aleta amarilla (Mulloidichthys vanicolensis), Zanzíbar, Tanzania, 2024-05-31, DD 72.jpg', uploadPath: '7/7f',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '6,037×4,025; modern own-work underwater field photograph of a group in Zanzibar (2024); Commons identifies Diego Delso and CC BY-SA 4.0.',
  },
  {
    slug: 'red-sea-goatfish', nameBn: 'লোহিত সাগরের ছাগলমাছ', nameEn: 'Red Sea goatfish',
    scientificName: 'Parupeneus forsskali', localName: 'Chhagol machh', habitatCodes: 'M, B, R, S',
    row: 470, conservation: 'NE', order: 'Mulliformes', family: 'Mullidae', aphiaId: 218669,
    commonsFile: 'Parupeneus forsskali, Dibab, Rode Zee, EG imported from iNaturalist photo 151388649.jpg', uploadPath: 'c/cb',
    credit: 'jeanpaulboerekamps (iNaturalist; CC0)', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    note: '2,048×962; modern iNaturalist field photograph from Egypt (2021); Commons review confirms the exact taxon and CC0 dedication.',
  },
  {
    slug: 'cinnabar-goatfish', nameBn: 'সিনাবার ছাগলমাছ', nameEn: 'Cinnabar goatfish',
    scientificName: 'Parupeneus heptacantha', checklistName: 'Parupeneus heptacanthus', otherNames: ['Parupeneus heptacanthus'],
    localName: 'Chhagol machh', habitatCodes: 'M, B, R, S', row: 471, conservation: 'LC',
    order: 'Mulliformes', family: 'Mullidae', aphiaId: 1841078,
    commonsFile: 'Cinnabar goatfish (Parupeneus heptacanthus) (38411454182).jpg', uploadPath: 'f/f5',
    credit: 'Rickard Zerpe', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '4,608×3,456; modern field photograph from Halmahera, Indonesia (2017); Commons Flickr review confirms Rickard Zerpe and CC BY 2.0. WoRMS marks checklist spelling P. heptacanthus as an incorrect subsequent spelling and accepts P. heptacantha (AphiaID 1841078).',
  },
  {
    slug: 'japanese-goatfish', nameBn: 'জাপানি ছাগলমাছ', nameEn: 'Japanese goatfish',
    scientificName: 'Upeneus japonicus', localName: 'Chhagol machh', habitatCodes: 'M, R',
    row: 472, conservation: 'NE', order: 'Mulliformes', family: 'Mullidae', aphiaId: 218694,
    commonsFile: 'Upeneus japonicus by OpenCage.jpg', uploadPath: '6/69',
    credit: 'OpenCage', license: 'CC BY-SA 2.5', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
    note: '2,447×2,448; modern digital photograph from Himeji Aquarium, Japan (2007); Commons identifies OpenCage and CC BY-SA 2.5. It is a photograph, not an illustration or book plate.',
  },
  {
    slug: 'goldband-goatfish', nameBn: 'সোনালি-ফিতার ছাগলমাছ', nameEn: 'Goldband goatfish',
    scientificName: 'Upeneus moluccensis', localName: 'Sonalidagi chagol mach', habitatCodes: 'M, B, R, S',
    row: 473, conservation: 'LC', order: 'Mulliformes', family: 'Mullidae', aphiaId: 126989,
    commonsFile: 'Upeneus moluccensis Davao.jpg', uploadPath: '3/38',
    credit: 'greg3ph (iNaturalist)', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,536×2,048; 2018 iNaturalist field photograph from Davao, Philippines; Commons review confirms author greg3ph and CC BY 4.0.',
  },
  {
    slug: 'ochrebanded-goatfish', nameBn: 'গেরুয়া-ফিতার ছাগলমাছ', nameEn: 'Ochrebanded goatfish',
    scientificName: 'Upeneus sundaicus', localName: 'Sonali bata', habitatCodes: 'M, B',
    row: 475, conservation: 'LC', order: 'Mulliformes', family: 'Mullidae', aphiaId: 273673,
    commonsFile: 'Ochrebanded goatfish (Upeneus sundaicus) (45259705962).jpg', uploadPath: '2/20',
    credit: 'Rickard Zerpe', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '4,097×3,073; modern field photograph from Lembeh, Indonesia (2018); Commons Flickr review confirms Rickard Zerpe and CC BY 2.0.',
  },
  {
    slug: 'finstripe-goatfish', nameBn: 'ডোরাকাটা ছাগলমাছ', nameEn: 'Finstripe goatfish',
    scientificName: 'Upeneus taeniopterus', localName: 'Chhagol machh', habitatCodes: 'M, R, S',
    row: 477, conservation: 'LC', order: 'Mulliformes', family: 'Mullidae', aphiaId: 218685,
    commonsFile: 'Upeneus taeniopterus.jpg', uploadPath: '8/8a',
    credit: 'Roberto Pillon', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '800×600; modern FishBase photograph by Roberto Pillon (2010; Commons page records the original photo date); Commons license page confirms CC BY 3.0.',
  },
  {
    slug: 'freckled-goatfish', nameBn: 'ছোপযুক্ত ছাগলমাছ', nameEn: 'Freckled goatfish',
    scientificName: 'Upeneus tragula', localName: 'Sonali bata', habitatCodes: 'M, B, R',
    row: 478, conservation: 'LC', order: 'Mulliformes', family: 'Mullidae', aphiaId: 218689,
    commonsFile: 'Salmonete oriental (Upeneus tragula), Anilao, Filipinas, 2023-08-23, DD 109.jpg', uploadPath: '2/27',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '4,374×2,916; modern own-work field photograph from Anilao, Philippines (2023); Commons identifies Diego Delso and CC BY-SA 4.0; assessed as a Commons Quality image.',
  },
]

const makeRecord = (candidate: Candidate): Species => {
  const image = `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`
  const nameNormalization = candidate.checklistName
    ? ` The checklist prints “${candidate.checklistName}”; WoRMS marks that spelling unaccepted and accepts ${candidate.scientificName} (AphiaID ${candidate.aphiaId}), which is used here.`
    : ''
  return {
    slug: candidate.slug,
    type: 'prani',
    group: 'machh',
    category: 'মাছ',
    nameBn: candidate.nameBn,
    nameEn: candidate.nameEn,
    scientificName: candidate.scientificName,
    otherNames: candidate.otherNames ?? [],
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Actinopterygii',
      order: candidate.order,
      family: candidate.family,
      genus: candidate.scientificName.split(' ')[0],
      species: candidate.scientificName,
    },
    summary: `${candidate.nameEn} — Habib & Islam (2021) Supplementary Table-I row ${candidate.row}; Bangladesh marine-fish checklist entry; paper-reported global IUCN ${candidate.conservation}.${nameNormalization}`,
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is listed in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. Table-I local-name form: “${candidate.localName}”; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}); paper-reported global IUCN category ${candidate.conservation}.${nameNormalization} ${UNKNOWN_DETAIL}`,
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

export const MORE_FISH21: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH21_MEDIA = CANDIDATES.map((candidate) => ({
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
