import type { Species } from '@/lib/types'
import { MARINE_FISH_BD } from './sources'

/**
 * Marine-fish batch 20: 14 direct checklist rows, all new accepted taxa.
 * The table's row 426 is absent; row 427 is duplicated for two different taxa.
 * Row 427's checklist spelling Ariomma indicum is normalized to WoRMS's accepted
 * Ariomma indica. Candidate rows stop at 453; the checklist's next row 454 is
 * explicitly marked questionable and is not treated as an occurrence record.
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
  conservation: 'LC' | 'VU' | 'NT' | 'EN' | 'CR' | 'DD' | 'NE'
  order: string
  family: string
  aphiaId: number
  commonsFile: string
  uploadPath: string
  credit: string
  license: string
  licenseUrl: string
  note: string
  safetyNote?: string
  safetySource?: { title: string; url: string }
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
const URANOSCOPID_SPINE_CAUTION = 'Handling caution: Uranoscopus species have a strong cleithral spine above the pectoral fin. Venom has been proposed for U. scaber, but whether the substance is venom and whether it occurs in other Uranoscopus species remain uncertain; do not present venom as confirmed for U. dollfusi. Avoid bare-handed handling of the spine. No electric-organ claim is made for this species.'
const URANOSCOPID_SAFETY_SOURCE = {
  title: 'VAPAGuide, Venomous fish — Uranoscopidae (discussion of Uranoscopus spine and uncertainty)',
  url: 'https://www.vapaguide.info/catalogue/NORAM-FIS-141',
}

const CANDIDATES: Candidate[] = [
  {
    slug: 'indian-driftfish', nameBn: 'মাখন চাঁদা', nameEn: 'Indian driftfish',
    scientificName: 'Ariomma indica', checklistName: 'Ariomma indicum', otherNames: ['Ariomma indicum'],
    localName: 'Makhon chanda', habitatCodes: 'M', row: 427, conservation: 'NE',
    order: 'Scombriformes', family: 'Ariommatidae', aphiaId: 219752,
    commonsFile: 'Ariomma indicum Pakistan.png', uploadPath: 'b/b8', credit: 'Hamid Badar Osmany',
    license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '600×410; modern FishBase digital photograph of Ariomma indicum from Pakistan (2014), a synonym spelling for the accepted Ariomma indica; Commons file page confirms photographer and CC BY 3.0.',
  },
  {
    slug: 'silver-pomfret', nameBn: 'ফালি চাঁদা', nameEn: 'Silver pomfret', scientificName: 'Pampus argenteus',
    localName: 'Fali chanda', habitatCodes: 'M, S', row: 428, conservation: 'NE',
    order: 'Scombriformes', family: 'Stromateidae', aphiaId: 127075,
    commonsFile: 'Pampus argenteus at Nanfangao harbor.jpg', uploadPath: '8/8a', credit: 'Ch.Andrew',
    license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '2,272×1,704; contemporary own-work digital field photograph at Nanfangao fishing harbor, Taiwan (2009); CC BY 3.0 is selected from the offered licenses.',
  },
  {
    slug: 'latticed-sandperch', nameBn: 'ল্যাটিসড স্যান্ডপার্চ', nameEn: 'Latticed sandperch',
    scientificName: 'Parapercis clathrata', localName: 'Bailla machh', habitatCodes: 'M, R',
    row: 432, conservation: 'NE', order: 'Uranoscopiformes', family: 'Pinguipedidae', aphiaId: 276987,
    commonsFile: 'Arenal (Parapercis clathrata), Anilao, Filipinas, 2023-08-24, DD 28.jpg', uploadPath: '0/04',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5,931×3,954; modern 2023 underwater field photograph from Anilao, Philippines; Commons file page identifies Diego Delso and CC BY-SA 4.0.'
  },
  {
    slug: 'dollfus-stargazer', nameBn: 'সাগর বাইল্লা', nameEn: "Dollfus' stargazer",
    scientificName: 'Uranoscopus dollfusi', localName: 'Sagor bailla', habitatCodes: 'M',
    row: 439, conservation: 'LC', order: 'Uranoscopiformes', family: 'Uranoscopidae', aphiaId: 274036,
    commonsFile: "Dollfus' Stargazer - Uranoscopus dollfusi.jpg", uploadPath: 'e/e2', credit: 'Bernd',
    license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    note: '4,000×3,000; digital field photograph originally published on Flickr in 2009; Commons verifies CC BY-SA 2.0 and exact species identification.',
    safetyNote: URANOSCOPID_SPINE_CAUTION,
    safetySource: URANOSCOPID_SAFETY_SOURCE,
  },
  {
    slug: 'bay-of-bengal-hogfish', nameBn: 'বে অব বেঙ্গল হগফিশ', nameEn: 'Bay of Bengal hogfish',
    scientificName: 'Bodianus neilli', localName: 'Not stated in Table-I', habitatCodes: 'M, R',
    row: 443, conservation: 'LC', order: 'Labriformes', family: 'Labridae', aphiaId: 273537,
    commonsFile: 'Bodianus neilli 250504007.jpg', uploadPath: 'd/d4', credit: 'Donald Davesne',
    license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    note: '1,977×1,145; exact-taxon iNaturalist field photograph from Thailand, 2022; Commons iNaturalist copyright review confirms Donald Davesne and CC BY 4.0.',
  },
  {
    slug: 'floral-wrasse', nameBn: 'কালা সুন্দরী', nameEn: 'Floral wrasse', scientificName: 'Cheilinus chlorourus',
    localName: 'Kala sundori', habitatCodes: 'M, R', row: 444, conservation: 'LC',
    order: 'Labriformes', family: 'Labridae', aphiaId: 218941,
    commonsFile: 'Lábrido floral (Cheilinus chlorourus), Anilao, Filipinas, 2023-08-25, DD 230.jpg', uploadPath: '3/37',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '3,171×2,114; modern 2023 underwater field photograph from Anilao, Philippines; Commons identifies Diego Delso and CC BY-SA 4.0.',
  },
  {
    slug: 'robust-tuskfish', nameBn: 'রবাস্ট টাস্কফিশ', nameEn: 'Robust tuskfish', scientificName: 'Choerodon robustus',
    localName: 'Not stated in Table-I', habitatCodes: 'M, R', row: 445, conservation: 'NE',
    order: 'Labriformes', family: 'Labridae', aphiaId: 218950,
    commonsFile: 'Choerodon robustus.jpg', uploadPath: 'e/e8', credit: 'KANNAN K',
    license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    note: '2,830×1,313; 2013 digital fish photograph; Commons identifies KANNAN K and CC BY 3.0.',
  },
  {
    slug: 'clown-coris', nameBn: 'কালা ক্লাউন', nameEn: 'Clown coris', scientificName: 'Coris aygula',
    localName: 'Kala clown', habitatCodes: 'M, R', row: 446, conservation: 'LC',
    order: 'Labriformes', family: 'Labridae', aphiaId: 218957,
    commonsFile: 'Coris Napoleón de manchas rojas (Coris aygula), mar Rojo, Egipto, 2023-04-17, DD 101.jpg', uploadPath: 'e/e4',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '6,348×4,232; modern 2023 field photograph from the Red Sea, Egypt; Commons names Diego Delso and CC BY-SA 4.0.',
  },
  {
    slug: 'african-coris', nameBn: 'আফ্রিকান কোরিস', nameEn: 'African coris', scientificName: 'Coris gaimard',
    localName: 'Not stated in Table-I', habitatCodes: 'M, R', row: 447, conservation: 'LC',
    order: 'Labriformes', family: 'Labridae', aphiaId: 218960,
    commonsFile: 'Lábrido (Coris gaimard), Anilao, Filipinas, 2023-08-23, DD 68.jpg', uploadPath: 'b/bd',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '6,471×4,314; modern 2023 underwater field photograph from Anilao, Philippines; Commons featured picture; CC BY-SA 4.0.',
  },
  {
    slug: 'checkerboard-wrasse', nameBn: 'চেকারবোর্ড র‍্যাস', nameEn: 'Checkerboard wrasse',
    scientificName: 'Halichoeres hortulanus', localName: 'Shundori machh', habitatCodes: 'M, R',
    row: 449, conservation: 'LC', order: 'Labriformes', family: 'Labridae', aphiaId: 218985,
    commonsFile: 'Lábrido tablero a cuadros (Halichoeres hortulanus), mar Rojo, Egipto, 2023-04-19, DD 43.jpg', uploadPath: 'f/f4',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '6,011×4,007; modern 2023 field photograph from the Red Sea, Egypt; Commons featured picture and CC BY-SA 4.0.',
  },
  {
    slug: 'barred-thicklip', nameBn: 'বার্ড থিকলিপ', nameEn: 'Barred thicklip',
    scientificName: 'Hemigymnus fasciatus', localName: 'Not stated in Table-I', habitatCodes: 'M, R',
    row: 450, conservation: 'LC', order: 'Labriformes', family: 'Labridae', aphiaId: 218999,
    commonsFile: 'Lábrido (Hemigymnus fasciatus), Anilao, Filipinas, 2023-08-25, DD 222.jpg', uploadPath: '9/97',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5,792×5,792; modern 2023 underwater field photograph from Anilao, Philippines; Commons featured picture and CC BY-SA 4.0.',
  },
  {
    slug: 'bluestreak-cleaner-wrasse', nameBn: 'সুন্দরী মাছ', nameEn: 'Bluestreak cleaner wrasse',
    scientificName: 'Labroides dimidiatus', localName: 'Shundori machh', habitatCodes: 'M',
    row: 451, conservation: 'LC', order: 'Labriformes', family: 'Labridae', aphiaId: 219014,
    commonsFile: 'Lábrido limpiador común (Labroides dimidiatus), islas Ad Dimaniyat, Omán, 2024-08-15, DD 54.jpg', uploadPath: 'e/e6',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5,221×3,481; modern 2024 underwater field photograph from Oman; Commons quality image; CC BY-SA 4.0.',
  },
  {
    slug: 'moon-wrasse', nameBn: 'নিহোলা', nameEn: 'Moon wrasse', scientificName: 'Thalassoma lunare',
    localName: 'Nihola', habitatCodes: 'M, R', row: 452, conservation: 'NE',
    order: 'Labriformes', family: 'Labridae', aphiaId: 212209,
    commonsFile: 'Lábrido lunar (Thalassoma lunare), Nosy Tanikely, Madagascar, 2025-09-20, DD 03.jpg', uploadPath: '2/2a',
    credit: 'Diego Delso', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: '5,192×2,424; modern 2025 underwater field photograph from Madagascar; Commons quality image; CC BY-SA 4.0.',
  },
  {
    slug: 'green-humphead-parrotfish', nameBn: 'সবুজ কুজোমাথাতিয়া মাছ', nameEn: 'Green humphead parrotfish',
    scientificName: 'Bolbometopon muricatum', localName: 'Sobuj kujomathatia machh', habitatCodes: 'M, R',
    row: 453, conservation: 'VU', order: 'Labriformes', family: 'Labridae', aphiaId: 219074,
    commonsFile: 'Bumphead parrotfish (Bolbometopon muricatum) (49509140173).jpg', uploadPath: 'a/a0',
    credit: 'Rickard Zerpe', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    note: '5,184×3,888; modern underwater field photograph from Raja Ampat, Indonesia (2020), sourced from Flickr; Flickr review confirms CC BY 2.0.',
  },
]

const makeRecord = (candidate: Candidate): Species => {
  const image = `https://upload.wikimedia.org/wikipedia/commons/${candidate.uploadPath}/${encodeURIComponent(candidate.commonsFile.replace(/ /g, '_'))}`
  const nameNormalization = candidate.checklistName
    ? ` The checklist prints “${candidate.checklistName}”; WoRMS records that spelling as unaccepted and accepts ${candidate.scientificName} (AphiaID ${candidate.aphiaId}), which is the scientific name used here.`
    : ''
  const safety = candidate.safetyNote ? ` ${candidate.safetyNote}` : ''
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
    description: `${candidate.nameBn} (${candidate.nameEn}; accepted name ${candidate.scientificName}) is listed in Habib & Islam's Bangladesh marine-fish checklist at row ${candidate.row}. Table-I local-name form: “${candidate.localName}”; habitat codes ${candidate.habitatCodes} (${habitatText(candidate.habitatCodes)}); paper-reported global IUCN category ${candidate.conservation}.${nameNormalization} ${UNKNOWN_DETAIL}${safety}`,
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
    threats: candidate.safetyNote ?? 'Species-specific threats are not stated in this checklist row; none are inferred.',
    conservationActions: 'Species-specific threats or management measures are not stated in this checklist row; none are inferred.',
    colorTags: [],
    image,
    dataStatus: 'partial',
    sources: [
      CHECKLIST_ROW(candidate.row),
      COMMONS(candidate.commonsFile),
      { title: `WoRMS accepted taxon: ${candidate.scientificName}`, url: `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${candidate.aphiaId}`, license: 'taxonomic reference' },
      ...(candidate.safetySource ? [{ ...candidate.safetySource, license: 'safety reference' }] : []),
    ],
  }
}

export const MORE_FISH20: Species[] = CANDIDATES.map(makeRecord)

export const MORE_FISH20_MEDIA = CANDIDATES.map((candidate) => ({
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
