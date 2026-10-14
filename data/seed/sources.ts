import type { Source } from '@/lib/types'

/**
 * সাধারণ তথ্যসূত্র — জ্ঞানভান্ডারের প্রতিটি রেকর্ডে উৎস ও লাইসেন্স থাকা বাধ্যতামূলক।
 * যে রেকর্ডের উৎস যাচাই হয়নি, সেটি dataStatus: 'partial' দিয়ে চিহ্নিত থাকে।
 */
export const IUCN: Source = { title: 'IUCN Red List of Threatened Species', url: 'https://www.iucnredlist.org', license: 'IUCN Red List Terms of Use' }
export const IUCN_BD: Source = { title: 'Red List of Bangladesh (IUCN Bangladesh, ২০১৫)', url: 'https://www.iucnredlist.org', license: 'IUCN Bangladesh' }
export const GBIF: Source = { title: 'GBIF — Global Biodiversity Information Facility', url: 'https://www.gbif.org', license: 'CC BY 4.0 / CC0' }
export const EOFF: Source = { title: 'Encyclopedia of Flora and Fauna of Bangladesh (বাংলাদেশ এশিয়াটিক সোসাইটি)', license: 'Asiatic Society of Bangladesh' }
export const POWO: Source = { title: 'Plants of the World Online (Kew)', url: 'https://powo.science.kew.org', license: 'Kew — CC BY 4.0' }
export const HERBARIUM: Source = { title: 'Bangladesh National Herbarium (BNH)', license: 'Bangladesh National Herbarium' }
export const FISH_BD: Source = { title: 'Fishes of the World / বাংলাদেশের মাছ (মৎস্য গবেষণা প্রতিষ্ঠান)', license: 'বাংলাদেশ মৎস্য গবেষণা ইনস্টিটিউট' }
export const HERPS_BD: Source = { title: 'Amphibians and Reptiles of Bangladesh — কবীর ও অন্যান্য (২০০৯)', license: 'Arannayk Foundation / প্রকাশিত সূত্র' }
export const BIRDS_BD: Source = { title: 'Birds of Bangladesh — সিদ্দিকী ও অন্যান্য', license: 'প্রকাশিত সূত্র' }
export const NEEDS_CHECK: Source = { title: 'সংরক্ষণ অবস্থা ও তথ্যসূত্র যাচাই করা বাকি', license: '—' }
