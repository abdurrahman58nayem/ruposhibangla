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
export const SNAKES_BD_2025: Source = { title: 'Haidar et al. (2025) Revisiting the snakes of Bangladesh — Herpetozoa 38: 253–269', url: 'https://doi.org/10.3897/herpetozoa.38.e163473', license: 'CC BY 4.0' }
export const CHT_TURTLES_2015: Source = { title: 'Rahman et al. (2015) — পার্বত্য চট্টগ্রামের কাছিম-কচ্ছপ জরিপ, Chelonian Conservation and Biology 14(2)', url: 'https://doi.org/10.2744/CCB-1146.1', license: 'প্রকাশিত সূত্র' }
export const JOTT_SEATURTLES: Source = { title: 'Journal of Threatened Taxa — বাংলাদেশের সামুদ্রিক কাছিম: Sonadia–সেন্টমার্টিন সমীক্ষা (২০২৪)', url: 'https://threatenedtaxa.org/index.php/JoTT/article/view/9194', license: 'CC BY 4.0' }
export const AMPHIBIANS_BD: Source = { title: 'Rayan & Islam (2026) An Updated Checklist of the Amphibians of Bangladesh — ৯৬ প্রজাতির হালনাগাদ চেকলিস্ট (EcoEvoRxiv)', url: 'https://ecoevorxiv.org/repository/object/14602/download/25422/', license: 'প্রকাশিত সূত্র' }
export const REPFOCUS: Source = { title: 'RepFocus — Reptiles of Bangladesh চেকলিস্ট (Midtgaard, সংকলন ২০২৩-০৪-১৪)', url: 'https://www.repfocus.dk/GEO/Bangladesh.html', license: 'প্রকাশিত সূত্র' }
export const BIRDS_BD: Source = { title: 'Birds of Bangladesh — সিদ্দিকী ও অন্যান্য', license: 'প্রকাশিত সূত্র' }
export const MARINE_FISH_BD: Source = { title: 'Habib & Islam (2021) An updated checklist of Marine Fishes of Bangladesh — Bangladesh J. Fish. 32(2): 357–367 (৭৪০ সামুদ্রিক প্রজাতির চেকলিস্ট)', url: 'https://doi.org/10.52168/bjf.2020.32.40', license: 'প্রকাশিত সূত্র' }
export const BDFISH_HARVEST: Source = { title: 'BdFISH Feature (2012) Commonly harvested fishes in the coastal and marine environments of Bangladesh', url: 'https://en.bdfish.org/2012/05/commonly-harvested-fishes-coastal-marine-environments-bangladesh/', license: 'প্রকাশিত সূত্র' }
export const NEEDS_CHECK: Source = { title: 'সংরক্ষণ অবস্থা ও তথ্যসূত্র যাচাই করা বাকি', license: '—' }
