import type { SpeciesMedia } from '@/lib/types'

/**
 * Wikimedia Commons ভিডিও-সিড — ২০২৬-১০-১৭ Commons imageinfo API দিয়ে প্রতিটি ফাইলের
 * নির্মাতা (Artist), লাইসেন্স ও সরাসরি স্ট্রিমিং URL যাচাই করে যুক্ত করা হয়েছে।
 * ভিডিও Wikimedia-র সার্ভার থেকেই স্ট্রিম হয় — কোনো ফাইল কপি বা পুনঃআপলোড হয় না।
 * প্রতিটি এন্ট্রিতে নির্মাতার ক্রেডিট, লাইসেন্স ও মূল ফাইল-পাতার লিংক বাধ্যতামূলক (§12)।
 * ফুটেজ বাংলাদেশের না হলে ক্যাপশনে সেটি স্পষ্ট করা থাকে।
 */

/** [লাইসেন্সের নাম, ক্রিয়েটিভ কমন্স লাইসেন্স-URL] */
type License = readonly [string, string]

const BY = (v: string): License => [`CC BY ${v}`, `https://creativecommons.org/licenses/by/${v}/`] as const
const BYSA = (v: string): License => [`CC BY-SA ${v}`, `https://creativecommons.org/licenses/by-sa/${v}/`] as const
const CC0: License = ['CC0', 'https://creativecommons.org/publicdomain/zero/1.0/'] as const

type VideoSeed = readonly [
  slug: string,
  /** Commons ফাইল-পাতার শিরোনাম (File:<file>) */
  file: string,
  /** upload.wikimedia.org/wikipedia/commons/-এর অভ্যন্তরীণ পথ */
  path: string,
  caption: string,
  credit: string,
  license: License,
]

const VIDEO_SEEDS: VideoSeed[] = [
  // ─── পাখি ───────────────────────────────────────────────────────────────
  ['machranga', 'Common kingfisher (Alcedo atthis) in Slovakia.webm', '7/72/Common_kingfisher_%28Alcedo_atthis%29_in_Slovakia.webm', 'Common Kingfishers (Alcedo atthis) — Slovakia; footage recorded outside Bangladesh.', 'Lubo Ondrasko', BY('3.0')],
  ['mete-machranga', '004 Pied kingfisher at Queen Elizabeth National Park Video by Giles Laurent.webm', '5/57/004_Pied_kingfisher_at_Queen_Elizabeth_National_Park_Video_by_Giles_Laurent.webm', 'Pied Kingfisher at Queen Elizabeth National Park, Uganda; footage recorded outside Bangladesh.', 'Giles Laurent', BYSA('4.0')],
  ['doyel', "Oriental Magpie Robin (Copsychus saularis), Bangalore, India - 20070917.ogv", '9/97/Oriental_Magpie_Robin_%28Copsychus_saularis%29%2C_Bangalore%2C_India_-_20070917.ogv', 'সাদা-কালো দোয়েল ঝোপের ডালে — ভারতের বেঙ্গালুরুতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Sundar.', BYSA('3.0')],
  ['boro-tia', 'Alexandrine parakeet from West Bengal.webm', '5/5f/Alexandrine_parakeet_from_West_Bengal.webm', 'বড় টিয়া (Alexandrine Parakeet) — পশ্চিমবঙ্গ, ভারত; ফুটেজটি বাংলাদেশের নয়।', 'Gannu03', BY('4.0')],
  ['tia', 'Psittacula krameri feeding in Kulturpark Izmir Turkiye.webm', 'c/c7/Psittacula_krameri_feeding_in_Kulturpark_Izmir_Turkiye.webm', 'টিয়া (Rose-ringed Parakeet) খাদ্য খাচ্ছে — তুরস্কের ইজমিরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', '3nformasyonel', CC0],
  ['kaloghur-rajon', 'Black-naped Monarch nurturing nestlings, Panvel, Maharashtra, India.webm', 'f/f5/Black-naped_Monarch_nurturing_nestlings%2C_Panvel%2C_Maharashtra%2C_India.webm', 'কালোঘাড় রাজন বাসায় ছানা পালন করছে — ভারতের মহারাষ্ট্রে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', "Shiv's fotografia", BY('4.0')],
  ['nilkantha', 'Indian Roller.ogv', 'e/e1/Indian_Roller.ogv', 'নীলকণ্ঠ (Indian Roller) উড়াল ও বিশ্রামের দৃশ্য — ফুটেজটি বাংলাদেশের নয়।', 'Aviceda', BYSA('3.0')],
  ['hudhud', 'Hoopoe feeding in Lengeri, Assam, India.webm', 'd/d1/Hoopoe_feeding_in_Lengeri%2C_Assam%2C_India.webm', 'হুদহুদ মাটিতে খাদ্য খুঁজছে — ভারতের আসামে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Kaushiko123', BYSA('4.0')],
  ['chorui', '2022-06-17 KRIŽE PASSERIFORMES Passer domesticus DOMAČI VRABEC.webm', 'e/ea/2022-06-17_KRI%C5%BDE_PASSERIFORMES_Passer_domesticus_DOMA%C4%8CI_VRABEC.webm', 'চড়ুই পাখি (Passer domesticus) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['kokil', 'Common Koel eating papaya fruit.webm', 'e/e1/Common_Koel_eating_papaya_fruit.webm', 'পুরুষ কোকিল পেঁপে ফল খাচ্ছে — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Rajnkd', BYSA('4.0')],
  ['finge', 'Black Drongo in Baruipur November 2025 by Tisha Mukherjee.webm', '4/40/Black_Drongo_in_Baruipur_November_2025_by_Tisha_Mukherjee.webm', 'কালো ফিঙে — পশ্চিমবঙ্গের বারুইপুরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['dandkak', 'Jungle crow (Corvus macrorhynchos).webm', '5/56/Jungle_crow_%28Corvus_macrorhynchos%29.webm', 'দাঁড়কাক (Large-billed Crow) — ফুটেজটি বাংলাদেশের নয়।', 'The Nature Box', BYSA('3.0')],
  ['moyna', 'Acridotheres tristis in Thailand Bangkok.webm', '3/36/Acridotheres_tristis_in_Thailand_Bangkok.webm', 'ময়না (Common Myna) — থাইল্যান্ডের ব্যাংককে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Amada44', BYSA('3.0')],
  ['kath-shalik', 'Chestnut-tailed starling (Sturnia malabarica).webm', 'f/f8/Chestnut-tailed_starling_%28Sturnia_malabarica%29.webm', 'কাঠ শালিক (Chestnut-tailed Starling) — ফুটেজটি বাংলাদেশের নয়।', 'Nabin K. Sapkota (ভিডিও), Shahanshah Bappy (ছবি)', BYSA('4.0')],
  ['eurashio-taroka', 'Flock of starlings (Sturnus vulgaris).webm', 'a/aa/Flock_of_starlings_%28Sturnus_vulgaris%29.webm', 'ইউরেশীয় তারোকার ঝাঁক (Sturnus vulgaris) — ফুটেজটি বাংলাদেশের নয়।', 'Karen Roe', BY('2.0')],
  ['jungle-satvai', 'Jungle babbler feeding fledglings.webm', 'f/f2/Jungle_babbler_feeding_fledglings.webm', 'জঙ্গল সাতভাই ছানাকে খাদ্য দিচ্ছে — ফুটেজটি বাংলাদেশের নয়।', 'Shivamjoker', BYSA('4.0')],
  ['holud-bulbul', 'Golden Oriole. Oriolus oriolus v.webm', 'b/b2/Golden_Oriole._Oriolus_oriolus_v.webm', 'সোনাবউ-জাতীয় গোল্ডেন ওরিওল (Oriolus oriolus) — ফুটেজটি বাংলাদেশের নয়।', 'Gail Hampshire', BY('2.0')],
  ['nilgola-bosontobouri', 'Blue-throated Barbet in Rabindra Sarobar March 2025 by Tisha Mukherjee.webm', '9/92/Blue-throated_Barbet_in_Rabindra_Sarobar_March_2025_by_Tisha_Mukherjee.webm', 'নীলগলা বসন্তবৌরি — কলকাতার রবীন্দ্র সরোবরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['choto-bosontobouri', 'Coppersmith Barbet Hammering Copper.webm', '5/57/Coppersmith_Barbet_Hammering_Copper.webm', 'ছোট বসন্তবৌরি (Coppersmith Barbet) গাছের গর্তে ঠোঁট দিয়ে খোঁড়ছে — ফুটেজটি বাংলাদেশের নয়।', 'sunch28', BY('3.0')],
  ['kaththokra', 'Black-rumped flameback TVM Video.webm', 'a/af/Black-rumped_flameback_TVM_Video.webm', 'কাঠঠোকরা (Black-rumped Flameback) গাছে বসে — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Shishirdasika', BYSA('4.0')],
  ['tuntuni', 'Tailorbird.webm', 'c/c1/Tailorbird.webm', 'টুনটুনি (Common Tailorbird) — ফুটেজটি বাংলাদেশের নয়।', 'Vetskumar', BYSA('4.0')],
  ['shweto-chokkhu', 'Indian white-eye bathing.webm', '2/2d/Indian_white-eye_bathing.webm', 'শ্বেতচক্ষু (Indian White-eye) স্নান করছে — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Ganesh Subramaniam', BY('2.0')],
  ['moutushi', 'Purple-rumped Sunbird.ogv', '3/36/Purple-rumped_Sunbird.ogv', 'মৌটুসি (Purple-rumped Sunbird) — ফুটেজটি বাংলাদেশের নয়।', 'Aviceda', BYSA('3.0')],
  ['nil-moutushi', 'Cinnyris asiaticus - 2017-02-19.webm', '9/9f/Cinnyris_asiaticus_-_2017-02-19.webm', 'নীল মৌটুসি (Purple Sunbird) — ফুটেজটি বাংলাদেশের নয়।', 'Pristurus', BYSA('3.0')],
  ['lahtora', 'Long-tailed Shrike (Lanius schach) preening.webm', '7/74/Long-tailed_Shrike_%28Lanius_schach%29_preening.webm', 'ল্যাটোরা (Long-tailed Shrike) পালক গোছাচ্ছে — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Gannu03', BYSA('4.0')],
  ['kalo-dana-thenti', 'Himantopus himantopus - 2017-02-19.webm', '6/6f/Himantopus_himantopus_-_2017-02-19.webm', 'কালো-ডানা ঠেংটি (Black-winged Stilt) — ফুটেজটি বাংলাদেশের নয়।', 'Pristurus', BYSA('3.0')],
  ['shada-bok', 'Egretta garzetta - Little-egrets (video), Adana 2016-11-12 01-1.webm', '9/96/Egretta_garzetta_-_Little-egrets_%28video%29%2C_Adana_2016-11-12_01-1.webm', 'সাদা বক (Little Egret) জলাশয়ে খাদ্য খুঁজছে — তুরস্কের আদানায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Zeynel Cebeci', BYSA('4.0')],
  ['kani-bok', 'Pondheron.ogv', 'e/ec/Pondheron.ogv', 'কানি বক (Pond Heron) — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Yndesai', BYSA('3.0')],
  ['moddho-bok', 'Intermediate Egret day95.ogv', 'c/cd/Intermediate_Egret_day95.ogv', 'মধ্য বক (Intermediate Egret) — ফুটেজটি বাংলাদেশের নয়।', 'Aviceda', BYSA('3.0')],
  ['dhusor-bok', 'Grey heron (Ardea cinerea) in Kasai Rinkai Park, Tokyo.webm', '5/5f/Grey_heron_%28Ardea_cinerea%29_in_Kasai_Rinkai_Park%2C_Tokyo.webm', 'ধূসর বক (Grey Heron) — জাপানের টোকিওতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'The Nature Box', BYSA('4.0')],
  ['shobuj-bok', 'Striated heron (Butorides striata) fishing in Mauritius.webm', 'b/b2/Striated_heron_%28Butorides_striata%29_fishing_in_Mauritius.webm', 'সবুজ বক (Striated Heron) মাছ শিকার করছে — মরিশাসে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'gailhampshire', BY('2.0')],
  ['go-bok', 'Bubulcus ibis - Western Cattle Egret 03.webm', 'd/d0/Bubulcus_ibis_-_Western_Cattle_Egret_03.webm', 'গো-বক (Western Cattle Egret) — তুরস্কে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Zeynel Cebeci', BYSA('4.0')],
  ['chamch-thunti-bok', 'Eurasian Spoonbills (Platalea leucorodia).webm', 'd/da/Eurasian_Spoonbills_%28Platalea_leucorodia%29.webm', 'চামচঠুঁটি বক (Eurasian Spoonbill) — ফুটেজটি বাংলাদেশের নয়।', 'Gail Hampshire', BY('2.0')],
  ['kalo-matha-kashtechora', 'Threskiornis melanocephalus.ogv', 'e/eb/Threskiornis_melanocephalus.ogv', 'কালো মাথা কাস্তেচরা (Black-headed Ibis) — ফুটেজটি বাংলাদেশের নয়।', 'Lymantria', BYSA('3.0')],
  ['hargila', 'Greater Adjutant in Bhagalpur December 2025 by Tisha Mukherjee.webm', '7/78/Greater_Adjutant_in_Bhagalpur_December_2025_by_Tisha_Mukherjee.webm', 'হাড়গিলা — ভারতের ভাগলপুরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['sada-gogonbihongo', 'Wuppertal - Zoo - Pelecanus onocrotalus 02 (1) ies.webm', '9/96/Wuppertal_-_Zoo_-_Pelecanus_onocrotalus_02_%281%29_ies.webm', 'সাদা গগনবিহঙ্গ (Great White Pelican) — জার্মানির চিড়িয়াখানায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Frank Vincentz', BYSA('3.0')],
  ['pati-batan', 'Common sandpiper (Actitis hypoleucos) in Slovakia.webm', '7/79/Common_sandpiper_%28Actitis_hypoleucos%29_in_Slovakia.webm', 'পাতি বাটান (Common Sandpiper) — স্লোভাকিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Lubo Ondrasko', BY('3.0')],
  ['shobuj-batan', '2022-09-14 VRHNIKA Ribniki pri stari opekarni CHARADRIIFORMES Tringa ochropus PRODNIK.webm', '2/23/2022-09-14_VRHNIKA_Ribniki_pri_stari_opekarni_CHARADRIIFORMES_Tringa_ochropus_PRODNIK.webm', 'সবুজ বাটান (Green Sandpiper) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['pacific-golden-plover', 'Pacific Golden-Plover redcliffe95.ogv', '9/97/Pacific_Golden-Plover_redcliffe95.ogv', 'প্রশান্ত মহাসাগরীয় সোনালি চাপাখি (Pacific Golden-Plover) — ফুটেজটি বাংলাদেশের নয়।', 'Aviceda', BYSA('3.0')],
  ['boro-balu-batan', 'Greater Sand Plover wynnum.ogv', '1/12/Greater_Sand_Plover_wynnum.ogv', 'বড় বালুচরী (Greater Sand Plover) — ফুটেজটি বাংলাদেশের নয়।', 'Aviceda', BYSA('3.0')],
  ['khude-ringed-plover', '2022-05-21 IZLIV SOČE CHARADRIIFORMES Charadrius dubius MALI DEŽEVNIK.webm', 'f/f7/2022-05-21_IZLIV_SO%C4%8CE_CHARADRIIFORMES_Charadrius_dubius_MALI_DE%C5%BDEVNIK.webm', 'ক্ষুদে চাপাখি (Little Ringed Plover) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ["temmincks-stint", "Temminck's Stint in Kotulpur December 2025 by Tisha Mukherjee.webm", 'b/bb/Temminck%27s_Stint_in_Kotulpur_December_2025_by_Tisha_Mukherjee.webm', 'টেমিন্কের বাটান — পশ্চিমবঙ্গের কোতুলপুরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['kadakhocha', '2022-03-12 IZLIV SOČE CHARADRIIFORMES Gallinago gallinago KOZICA.webm', 'a/a5/2022-03-12_IZLIV_SO%C4%8CE_CHARADRIIFORMES_Gallinago_gallinago_KOZICA.webm', 'কাদাখোঁচা (Common Snipe) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['pied-avoset', '2022-05-21 IZLIV SOČE CHARADRIIFORMES Recurvirostra avosetta SABLJARKA.webm', '2/22/2022-05-21_IZLIV_SO%C4%8CE_CHARADRIIFORMES_Recurvirostra_avosetta_SABLJARKA.webm', 'পিয়েড অ্যাভোসেট (Pied Avocet) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['uttor-lapwing', 'Vanellus vanellus.ogv', '2/26/Vanellus_vanellus.ogv', 'উত্তরী ল্যাপউইং (Northern Lapwing) — ফুটেজটি বাংলাদেশের নয়।', 'Hugo.arg', CC0],
  ['khanjon', 'White Wagtail (Motacilla alba lugens).webm', '9/97/White_Wagtail_%28Motacilla_alba_lugens%29.webm', 'খঞ্জন (White Wagtail, M. a. lugens উপপ্রজাতি) — জাপানে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'The Nature Box', BYSA('4.0')],
  ['dhusor-khonjon', 'Grey Wagtails. Motacilla cinerea.webm', '0/0a/Grey_Wagtails._Motacilla_cinerea.webm', 'ধূসর খঞ্জনা (Grey Wagtail) — ফুটেজটি বাংলাদেশের নয়।', 'Gail Hampshire', BY('2.0')],
  ['citrine-khonjon', 'Citrine Wagtail in Baruipur November 2025 by Tisha Mukherjee.webm', '0/06/Citrine_Wagtail_in_Baruipur_November_2025_by_Tisha_Mukherjee.webm', 'সিট্রিন খঞ্জনা — পশ্চিমবঙ্গের বারুইপুরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['kalo-redstart', '2022-09-06 MIRKE PASSERIFORMES Phoenicurus ochruros ŠMARNICA.webm', '8/87/2022-09-06_MIRKE_PASSERIFORMES_Phoenicurus_ochruros_%C5%A0MARNICA.webm', 'কালো রেডস্টার্ট (Black Redstart) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['kalomatha-gangchil', '2022-03-12 PANCAN CHARADRIIFORMES Larus ridibundus REČNI GALEB.webm', '7/7a/2022-03-12_PANCAN_CHARADRIIFORMES_Larus_ridibundus_RE%C4%8CNI_GALEB.webm', 'কালোমাথা গাঙচিল (Black-headed Gull) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['pati-nodi', 'Common Tern in Bakkhali September 2025 by Tisha Mukherjee 01.webm', 'c/cf/Common_Tern_in_Bakkhali_September_2025_by_Tisha_Mukherjee_01.webm', 'পাতি নদীগাংচিল (Common Tern) — পশ্চিমবঙ্গের বক্কালিতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['common-coot', 'Eurasian coot (Fulica atra).webm', '5/5c/Eurasian_coot_%28Fulica_atra%29.webm', 'ইউরেশীয় কুট (Eurasian Coot) — স্লোভাকিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Lubo Ondrasko', BY('3.0')],
  ['jal-murgi', 'Gallinula chloropus-Common moorhen VP8.webm', '3/3c/Gallinula_chloropus-Common_moorhen_VP8.webm', 'জলমুরগি (Common Moorhen) — বুলগেরিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Neli St Ivanova - Сдружение за дива природа БАЛКАНИ', BYSA('4.0')],
  ['balu-hash', 'Cotton Pygmy Goose swimming 01.webm', '7/7d/Cotton_Pygmy_Goose_swimming_01.webm', 'বালু হাঁস (Cotton Pygmy Goose) সাঁতার কাটছে — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Ganesh Mohan T', BYSA('4.0')],
  ['bhuti-hash', '2022-03-05 BLED ANSERIFORMES Aythya nyroca KOSTANJEVKA 3.webm', 'b/b5/2022-03-05_BLED_ANSERIFORMES_Aythya_nyroca_KOSTANJEVKA_3.webm', 'ভূঁতি হাঁস (Ferruginous Duck) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['jiriya-hash', '2022-03-27 ZBILJSKO JEZERO ANSERIFORMES Anas querquedula REGLJA.webm', 'c/cd/2022-03-27_ZBILJSKO_JEZERO_ANSERIFORMES_Anas_querquedula_REGLJA.webm', 'গিরিয়া হাঁস (Garganey) — স্লোভেনিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['nilpakhha-hash', 'Löffelenten - Northern Shoveler - Anas clypeata.webm', 'f/f1/L%C3%B6ffelenten_-_Northern_Shoveler_-_Anas_clypeata.webm', 'নীলপাখনা হাঁস (Northern Shoveler) — জার্মানিতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'AO1Uta', BY('3.0')],
  ['mandarin-hash', 'Aix galericulata 2016 07 10.webm', '2/27/Aix_galericulata_2016_07_10.webm', 'ম্যান্ডারিন হাঁস (Mandarin Duck) — জাপানে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Nesnad', BY('4.0')],
  ['fulvous-shishihans', 'The whistle of the fulvous whistling duck.webm', '6/65/The_whistle_of_the_fulvous_whistling_duck.webm', 'ফুলভাস শিশুহাঁস (Fulvous Whistling Duck) ও তার বিশেষ ডাক — ফুটেজটি বাংলাদেশের নয়।', 'Thierry Dugnolle', BYSA('4.0')],
  ['kalo-chil', 'Black Kite eulo95.ogv', 'e/e0/Black_Kite_eulo95.ogv', 'কালো চিল (Black Kite) আকাশে উড়ছে — অস্ট্রেলিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Aviceda', BYSA('3.0')],
  ['kalo-baza', 'Black Baza - Video-1.webm', '2/29/Black_Baza_-_Video-1.webm', 'Black Baza (Aviceda leuphotes) — Karnataka, India; ফুটেজটি বাংলাদেশের নয়।', 'Forestowlet', CC0],
  ['shapkheko-eagle', 'Crested Serpent Eagle flight.ogv', '9/9c/Crested_Serpent_Eagle_flight.ogv', 'সাপখেকো ঈগল (Crested Serpent Eagle) উড়াল — ফুটেজটি বাংলাদেশের নয়।', 'Aviceda', BYSA('3.0')],
  ['khato-angul-sapkhekho-eagle', 'Circaetus gallicus.webm', 'e/e6/Circaetus_gallicus.webm', 'খাঁটো-আঙুল সাপখেকো (Short-toed Snake Eagle) — ফুটেজটি বাংলাদেশের নয়।', 'Juan lacruz', BYSA('4.0')],
  ['dhola-pecha', 'Barn Owl rushck.ogv', '2/2c/Barn_Owl_rushck.ogv', 'ধলা পেঁচা (Barn Owl) — ফুটেজটি বাংলাদেশের নয়।', 'Aviceda', BYSA('3.0')],
  ['kath-pecha', 'Brown Hawk-Owl in Purbasthali January 2026 by Tisha Mukherjee.webm', '8/8e/Brown_Hawk-Owl_in_Purbasthali_January_2026_by_Tisha_Mukherjee.webm', 'কাঠ পেঁচা (Brown Hawk-Owl) — পশ্চিমবঙ্গের পুরবস্তলীতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['dagi-khurule', 'Asian Barred Owlet in Kurseong September 2026 by Tisha Mukherjee.webm', 'f/f2/Asian_Barred_Owlet_in_Kurseong_September_2026_by_Tisha_Mukherjee.webm', 'দাগি খুরুলে (Asian Barred Owlet) — ভারতের কার্সিয়াংয়ে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['chotokan-pecha', 'Short-eared owl (Asio flammeus).webm', '6/64/Short-eared_owl_%28Asio_flammeus%29.webm', 'ছোটকান পেঁচা (Short-eared Owl) — উদ্ধারকেন্দ্রে যত্নের দৃশ্য; ফুটেজটি বাংলাদেশের নয়।', 'Wild Bird Aid', BY('3.0')],
  ['pati-kestrel', 'Eurasian Kestrel in Kurseong September 2026 by Tisha Mukherjee.webm', '0/07/Eurasian_Kestrel_in_Kurseong_September_2026_by_Tisha_Mukherjee.webm', 'পাতি কেস্ট্রেল (Common Kestrel) — ভারতের কার্সিয়াংয়ে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['moyur', 'Peafowls at Bangladesh National Zoo.webm', 'c/c5/Peafowls_at_Bangladesh_National_Zoo.webm', 'ময়ূর ও ময়ূরী — ঢাকার বাংলাদেশ জাতীয় চিড়িয়াখানায় ধারণকৃত (বন্দি অবস্থায়)।', 'Deloar Akram', BYSA('4.0')],
  ['komla-matha-dama', 'Orange-headed Thrush in Rabindra Sarobar October 2025 by Tisha Mukherjee 01.webm', '6/6a/Orange-headed_Thrush_in_Rabindra_Sarobar_October_2025_by_Tisha_Mukherjee_01.webm', 'Orange-headed Thrush (Geokichla citrina) — Rabindra Sarobar, West Bengal, India; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['dudhraj', 'Birds of Sahyadri -Asian Paradise Flycatcher -.webm', '8/83/Birds_of_Sahyadri_-Asian_Paradise_Flycatcher_-.webm', 'Indian Paradise Flycatcher — Sahyadri, India-তে ধারণ করা; এই ফুটেজ বাংলাদেশের নয়।', 'Vivek Kale', BY('3.0')],
  ['jhinjhin-phutki', 'Zitting Cisticola in Baruipur September 2025 by Tisha Mukherjee.webm', '1/11/Zitting_Cisticola_in_Baruipur_September_2025_by_Tisha_Mukherjee.webm', 'ঝিঁঝিঁ ফুতকি (Zitting Cisticola) — পশ্চিমবঙ্গের বারুইপুরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['holudpet-phutki', 'Yellow-bellied Prinia in Baruipur September 2025 by Tisha Mukherjee.webm', '6/63/Yellow-bellied_Prinia_in_Baruipur_September_2025_by_Tisha_Mukherjee.webm', 'হলুদপেট ফুতকি — পশ্চিমবঙ্গের বারুইপুরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['tinranga-munia', 'Tricolored Munia in Baruipur September 2025 by Tisha Mukherjee 02.webm', '8/87/Tricolored_Munia_in_Baruipur_September_2025_by_Tisha_Mukherjee_02.webm', 'তিনরঙা মুনিয়া — পশ্চিমবঙ্গের বারুইপুরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Tisha Mukherjee', BYSA('4.0')],
  ['shobuj-bhubonchil', 'Green Bee-eater - Merops orientalis.ogv', '3/32/Green_Bee-eater_-_Merops_orientalis.ogv', 'সবুজ ভুবনচিল (Green Bee-eater) — ফুটেজটি বাংলাদেশের নয়।', 'Anton', BYSA('3.0')],
  ['lalmatha-vubonchil', 'Merops leschenaulti - Kaeng Krachan.ogv', '7/75/Merops_leschenaulti_-_Kaeng_Krachan.ogv', 'লালমাথা ভুবনচিল (Chestnut-headed Bee-eater) — থাইল্যান্ডের কেং ক্রাচানে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'JJ Harrison (https://www.jjharrison.com.au/)', BYSA('3.0')],

  // ─── স্তন্যপায়ী ──────────────────────────────────────────────────────────
  ['rhesus-banor', 'Rhesus macaque - 20160710.webm', '0/03/Rhesus_macaque_-_20160710.webm', 'রেসাস বাঁদর (Rhesus Macaque) — জাপানে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Nesnad', BYSA('4.0')],
  ['hati', '2023-02-17 ZOO LJUBLJANA Elephas maximus AZIJSKI SLON.webm', 'e/ef/2023-02-17_ZOO_LJUBLJANA_Elephas_maximus_AZIJSKI_SLON.webm', 'এশীয় হাতি (Elephas maximus) — স্লোভেনিয়ার লিউব্লিয়ানা চিড়িয়াখানায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'NaIzletuSi ™', BY('3.0')],
  ['bagh', 'A walk with the Tigress.webm', 'b/b2/A_walk_with_the_Tigress.webm', 'রয়্যাল বেঙ্গল বাঘিনীর হাঁটার দৃশ্য — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Ismail Shariff', BY('3.0')],
  ['chitabagh', 'Leopard (Panthera pardus), in Uttarakhand, India.webm', 'f/fc/Leopard_%28Panthera_pardus%29%2C_in_Uttarakhand%2C_India.webm', 'চিতাবাঘ/তোলা বাঘ (Leopard) — ভারতের উত্তরাখণ্ডে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', "Shiv's fotografia", BYSA('4.0')],
  ['meghla-chita', 'Clouded leopard (Neofelis nebulosa) in a zoo.webm', '0/09/Clouded_leopard_%28Neofelis_nebulosa%29_in_a_zoo.webm', 'মেঘলা চিতা (Clouded Leopard) — চিড়িয়াখানায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Parker Knight', BY('2.0')],
  ['chitra-horin', 'Axisdeer-tobudobutsuen-2012.ogv', '9/9e/Axisdeer-tobudobutsuen-2012.ogv', 'চিত্রা হরিণ (Chital / Axis Deer) — জাপানের চিড়িয়াখানায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Nesnad', BYSA('3.0')],
  ['buno-mohish', 'Asian water buffalo (Bubalus bubalis) in shallow water video.webm', '9/92/Asian_water_buffalo_%28Bubalus_bubalis%29_in_shallow_water_video.webm', 'জল-মহিষ (Bubalus bubalis) — বন্য বুনো মহিষের (Bubalus arnee) গৃহপালিত রূপ; ফুটেজটি বাংলাদেশের নয়।', 'Gannu03', BYSA('4.0')],
  ['buno-kukur', 'Dhole (Cuon alpinus).webm', 'e/ea/Dhole_%28Cuon_alpinus%29.webm', 'বুনো কুকুর / রামকুত্তা (Dhole) — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'J R Patel', BYSA('4.0')],
  ['neul', 'Herpestidae - Herpestes javanicus (Javan Mongoose).webm', '9/95/Herpestidae_-_Herpestes_javanicus_%28Javan_Mongoose%29.webm', 'নকুল গোত্রের প্রতিনিধি (Javan Mongoose) — চিড়িয়াখানায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Hectonichus', BYSA('4.0')],
  ['dhani-indur', 'Greater bandicoot rat or Indian bandicoot rat (Bandicota indica).webm', 'd/d7/Greater_bandicoot_rat_or_Indian_bandicoot_rat_%28Bandicota_indica%29.webm', 'বন্দিকোটা গণের ইঁদুর (Greater Bandicoot Rat) — ধানি ইঁদুরের নিকটাত্মীয়; ফুটেজটি বাংলাদেশের নয়।', 'କୁମୁଦ ଘୋଷ', BY('4.0')],
  ['kathbiralii', 'סנאי חמש-פס Funambulus pennantii.webm', 'a/af/%D7%A1%D7%A0%D7%90%D7%99_%D7%97%D7%9E%D7%A9-%D7%A4%D7%A1_Funambulus_pennantii.webm', 'পাতি কাঠবিড়ালি (Northern Palm Squirrel) — ইসরায়েলে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'שגי', BYSA('4.0')],
  ['nengti-indur', 'Fancy mouse (Mus musculus) in Avon Valley.webm', '8/8e/Fancy_mouse_%28Mus_musculus%29_in_Avon_Valley.webm', 'নেংটি ইঁদুরের গৃহপালিত রূপ (Fancy Mouse, Mus musculus) — যুক্তরাজ্যে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'The Nature Box', BYSA('4.0')],
  ['buno-shukor', 'Sus scrofa-wild boars-Bulgaria-4 VP8.webm', 'a/aa/Sus_scrofa-wild_boars-Bulgaria-4_VP8.webm', 'বুনো শূকর (Wild Boar) — বুলগেরিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Neli St Ivanova - Сдружение за дива природа БАЛКАНИ', BYSA('4.0')],
  ['eurasian-otter', 'Eurasian Otter (Lutra lutra).webm', 'b/b1/Eurasian_Otter_%28Lutra_lutra%29.webm', 'ইউরেশীয় ভোঁদড় (Eurasian Otter) — ফুটেজটি বাংলাদেশের নয়।', 'Gail Hampshire', BY('2.0')],
  ['khaja-badur', 'Indonesian short-nosed fruit bat (Cynopterus titthaecheilus) eats a banana.webm', '2/2e/Indonesian_short-nosed_fruit_bat_%28Cynopterus_titthaecheilus%29_eats_a_banana.webm', 'কুন্তোপ্তেরাস গণের ফল-ভক্ষক বাদুড় (Cynopterus titthaecheilus) — খাজা বাদুড়ের নিকটাত্মীয়; ফুটেজটি বাংলাদেশের নয়।', 'Joaquim Baeta', BY('4.0')],
  ['nil-timi', 'Antarctic Blue Whales.webm', 'b/b6/Antarctic_Blue_Whales.webm', 'নীল তিমি (Blue Whale) — অ্যান্টার্কটিকা-সংলগ্ন সমুদ্রে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Blagoj Klincharski', BY('3.0')],
  ['dugong', 'Dugong dugon. Seekuh. Дюгонь.Rotes Meer..DSCF9589.webm', 'e/ec/Dugong_dugon._Seekuh._%D0%94%D1%8E%D0%B3%D0%BE%D0%BD%D1%8C.Rotes_Meer..DSCF9589.webm', 'ডুগং (Dugong) — লাল সাগরে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Kora27', BYSA('4.0')],

  // ─── সরিসৃপ ও উভচর ───────────────────────────────────────────────────────
  ['nona-kumir', 'Feeding a saltwater crocodile (Crocodylus porosus).webm', 'f/f0/Feeding_a_saltwater_crocodile_%28Crocodylus_porosus%29.webm', 'নোনা কুমির (Saltwater Crocodile) — যত্নকেন্দ্রে খাদ্য প্রদানের দৃশ্য; ফুটেজটি বাংলাদেশের নয়।', 'Fernanda', BY('3.0')],
  ['guisap', 'Bengal Monitor DSCN2669.webm', '1/1d/Bengal_Monitor_DSCN2669.webm', 'গুইসাপ (Bengal Monitor) — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'RIT RAJARSHI', BYSA('4.0')],
  ['girigiti', 'Calotes versicolor 2.webm', 'e/ed/Calotes_versicolor_2.webm', 'গিরিগিটি (Oriental Garden Lizard) — ইন্দোনেশিয়ায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Aris riyanto', BYSA('4.0')],
  ['ghor-tiktiki', 'Common house gecko licking on top of table.webm', '9/99/Common_house_gecko_licking_on_top_of_table.webm', 'বাড়ির টিকটিকি (Common House Gecko) — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Praveenp', BYSA('4.0')],
  ['gohora', "King Cobra (Ophiophagus hannah) crossing a path in the afternoon in Singapore's Sungei Buloh Wetland Reserve (May 27, 2023).ogg", "6/69/King_Cobra_%28Ophiophagus_hannah%29_crossing_a_path_in_the_afternoon_in_Singapore%27s_Sungei_Buloh_Wetland_Reserve_%28May_27%2C_2023%29.ogg", 'গোখরা (King Cobra) পথ পার হচ্ছে — সিঙ্গাপুরের সুনগেই বুলোহ জলাভূমিতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Jason Quinn', BYSA('4.0')],
  ['shonkhini', 'Milking Banded Krait (Bungarus fasciatus) Venom, in Slow Motion.webm', '9/9d/Milking_Banded_Krait_%28Bungarus_fasciatus%29_Venom%2C_in_Slow_Motion.webm', 'শঙ্খিনী (Banded Krait) — গবেষণাগারে সাপ-বিষ সংগ্রহের ধীরগতির দৃশ্য (প্রতিষেধক তৈরির কাজ); ফুটেজটি বাংলাদেশের নয়।', 'Joaquim Baeta', BY('4.0')],
  ['green-sea-turtle', 'Green sea turtles (Chelonia mydas) in Hawaii.webm', '3/35/Green_sea_turtles_%28Chelonia_mydas%29_in_Hawaii.webm', 'সবুজ সামুদ্রিক কচ্ছপ (Green Sea Turtle) — হাওয়াইয়ে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Piyush Kumar', BY('2.0')],
  ['chonchu-kachchim', 'Hawksbill sea turtle at Koh Tao, Thailand.ogv', '9/95/Hawksbill_sea_turtle_at_Koh_Tao%2C_Thailand.ogv', 'চঞ্চু কচ্ছপ (Hawksbill Turtle) — থাইল্যান্ডের কো তাওতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Amada44', BYSA('3.0')],
  ['kuno-byang', 'Duttaphrynus melanostictus, mating.webm', '6/61/Duttaphrynus_melanostictus%2C_mating.webm', 'কুনো ব্যাঙের মিলনের দৃশ্য (Duttaphrynus melanostictus) — ফুটেজটি বাংলাদেশের নয়।', 'Joaquim Baeta', BY('4.0')],

  // ─── মাছ ও জলজ ───────────────────────────────────────────────────────────
  ['ilish', 'Hilsha Fish Fry from Mawa ghat.webm', '9/94/Hilsha_Fish_Fry_from_Mawa_ghat.webm', 'পদ্মার মাওয়া ঘাটে ইলিশ ভাজার প্রস্তুতি — বাংলাদেশের ইলিশ-সংস্কৃতির দৃশ্য।', 'Sm faysal', BYSA('4.0')],
  ['lal-kholisa', 'Dwarf Gourami in Aquarium.WebM', '5/5b/Dwarf_Gourami_in_Aquarium.WebM', 'লাল খলিশা / ডওয়ার্ফ গৌরামি (Trichogaster lalius) — অ্যাকোয়ারিয়ামে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Carlo Cabanilla', BYSA('2.0')],
  ['zebra-danio', 'From-Schooling-to-Shoaling Patterns of Collective Motion in Zebrafish (Danio rerio) - pone.0048865.s017.ogv', 'b/b7/From-Schooling-to-Shoaling-Patterns-of-Collective-Motion-in-Zebrafish-%28Danio-rerio%29-pone.0048865.s017.ogv', 'ঝাঁকে সাঁতরানো জেব্রা-ড্যানিও (Danio rerio) — আচরণ-গবেষণার ভিডিও; ফুটেজটি বাংলাদেশের নয়।', 'Miller N, Gerlai R (2012), PLoS ONE', BY('2.5')],

  // ─── প্রজাপতি ও কীটপতঙ্গ ─────────────────────────────────────────────────
  ['plain-tiger', 'Nectaring activity of Danaus chrysippus (Linnaeus, 1758) - Plain Tiger (Male) on Lantana camara flower DSC 3006.webm', '2/2e/Nectaring_activity_of_Danaus_chrysippus_%28Linnaeus%2C_1758%29_-_Plain_Tiger_%28Male%29_on_Lantana_camara_flower_DSC_3006.webm', 'পুরুষ প্লেইন টাইগার প্রজাপতি ল্যান্টানা ফুলে মধু চুষছে — পশ্চিমবঙ্গে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Sandipoutsider', BYSA('4.0')],
  ['lime-butterfly', 'Nectaring activity of Papilio demoleus Linnaeus, 1758 - Lime Swallowtail on Lantana camara flower.DSC 3024.webm', '7/77/Nectaring_activity_of_Papilio_demoleus_Linnaeus%2C_1758_-_Lime_Swallowtail_on_Lantana_camara_flower.DSC_3024.webm', 'লিমন বাটারফ্লাই (Lime Swallowtail) ফুলে মধু চুষছে — পশ্চিমবঙ্গে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Sandipoutsider', BYSA('4.0')],
  ['projapoti-mormi', 'Nectaring of Papilio polytes Linnaeus, 1758 - Common Mormon (Male) Butterfly DSC 3029.webm', '2/2d/Nectaring_of_Papilio_polytes_Linnaeus%2C_1758_-_Common_Mormon_%28Male%29_Butterfly_DSC_3029.webm', 'পুরুষ মরমি প্রজাপতি (Common Mormon) ফুলে মধু চুষছে — পশ্চিমবঙ্গে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Sandipoutsider', BYSA('4.0')],
  ['lemon-pansy', 'Close wing basking position of Junonia lemonias (Linnaeus, 1758) - Lemon Pansy DSC 3045.webm', '1/1c/Close_wing_basking_position_of_Junonia_lemonias_%28Linnaeus%2C_1758%29_-_Lemon_Pansy_DSC_3045.webm', 'লেবু প্যানসি (Lemon Pansy) ডানা বন্ধ করে রোদ পোহাচ্ছে — পশ্চিমবঙ্গে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Sandipoutsider', BYSA('4.0')],
  ['common-jezebel', 'Nectaring activity of Delias eucharis (Drury, 1773) - Indian Jezebel (Male) DSC 3022.webm', '4/43/Nectaring_activity_of_Delias_eucharis_%28Drury%2C_1773%29_-_Indian_Jezebel_%28Male%29_DSC_3022.webm', 'কমন জেজেবেল (Indian Jezebel) — পশ্চিমবঙ্গে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Sandipoutsider', BYSA('4.0')],
  ['grass-yellow', 'A Eurema hecabe (Linnaeus, 1758) - Common Grass Yellow butterfly emerges from its pupal stage.webm', '6/6b/A_Eurema_hecabe_%28Linnaeus%2C_1758%29_-_Common_Grass_Yellow_butterfly_emerges_from_its_pupal_stage.webm', 'কমন গ্রাস ইয়েলো প্রজাপতির মূককীট থেকে বেরিয়ে আসার মুহূর্ত — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Ankit0908', BY('4.0')],
  ['ladybird', 'Coccinella septempunctata.ogv', '3/3d/Coccinella_septempunctata.ogv', 'সাতবিন্দি ধনশা (Seven-spotted Ladybird) — ফুটেজটি বাংলাদেশের নয়।', 'Pristurus', BYSA('3.0')],
  ['makorsha', 'Argiope and milkweedBug.webm', '0/02/Argiope_and_milkweedBug.webm', 'আর্জিওপি জাল-বোনা মাকড়সা (Argiope) — ফুটেজটি বাংলাদেশের নয়।', 'Dennis.insect.filmer', BYSA('4.0')],
  ['laphano-makorsha', 'Plexippus paykulli - japan - 2023 aug 25.webm', '9/92/Plexippus_paykulli_-_japan_-_2023_aug_25.webm', 'লাফানো মাকড়সা (Pantropical Jumping Spider, Plexippus paykulli) — জাপানে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Nesnad', BY('4.0')],
  ['moumachhi-bishal', 'Apis dorsata nest slowed down.webm', 'b/b7/Apis_dorsata_nest_slowed_down.webm', 'বড় মৌমাছির (Apis dorsata) খোলা বাসার ধীরগতির দৃশ্য — গবেষণা-ভিডিও; ফুটেজটি বাংলাদেশের নয়।', 'Kastberger G, Schmelzer E, Kranner I (2008), PLoS ONE', BYSA('2.5')],
  ['pipra', 'Oecophylla smaragdina (Red weaver ant) carrying a dead Odonata on a wall (video).webm', '8/85/Oecophylla_smaragdina_%28Red_weaver_ant%29_carrying_a_dead_Odonata_on_a_wall_%28video%29.webm', 'সবুজ পিঁপড়া (Weaver Ant, Oecophylla smaragdina) শিকার টেনে নিয়ে যাচ্ছে — ফুটেজটি বাংলাদেশের নয়।', 'Basile Morin', BYSA('4.0')],
  ['gandhi-poka', 'Nezara viridula larva 009.ogv', 'd/d2/Nezara_viridula_larva_009.ogv', 'সবুজ গান্ধি পোকার লার্ভা (Nezara viridula) — ফুটেজটি বাংলাদেশের নয়।', 'Amada44', BY('3.0')],
  ['resom-poka', 'Silkworms (Bombyx mori).webm', '2/27/Silkworms_%28Bombyx_mori%29.webm', 'রেশম-পোকার লার্ভা (Silkworm, Bombyx mori) — ফুটেজটি বাংলাদেশের নয়।', 'Hilary Mason', BY('2.0')],
  ['shobuj-foring', 'Orthetrum sabina - 2017-02-28.webm', '7/72/Orthetrum_sabina_-_2017-02-28.webm', 'সবুজ ফড়িং (Slender Skimmer, Orthetrum sabina) — ফুটেজটি বাংলাদেশের নয়।', 'Pristurus', BYSA('3.0')],
  ['bolta', 'Vespa affinis at their nest (1).webm', 'e/ee/Vespa_affinis_at_their_nest_%281%29.webm', 'বোলতা (Lesser Banded Hornet, Vespa affinis) বাসার কাছে — ফুটেজটি বাংলাদেশের নয়।', 'KEmel49', BYSA('4.0')],
  ['kanpacha', 'Scolopendra Polymorpha looking for prey.webm', '7/7e/Scolopendra_Polymorpha_looking_for_prey.webm', 'কানপাঁচা গণের প্রতিনিধি (Scolopendra polymorpha) শিকার খুঁজছে — ফুটেজটি বাংলাদেশের নয়।', 'Hwmrocker', BYSA('4.0')],
  ['telapoka', 'Periplaneta americana performing a high-speed inversion on a ramp (top view) - Journal.pone.0038003.s001.ogv', '9/9a/Periplaneta_americana_performing_a_high-speed_inversion_on_a_ramp_%28top_view%29_-_Journal.pone.0038003.s001.ogv', 'তেলাপোকার (Periplaneta americana) উল্টে-দৌড়ানোর ধীরগতির বিশ্লেষণ — গবেষণা-ভিডিও; ফুটেজটি বাংলাদেশের নয়।', 'Mongeau J-M et al. (2012), PLoS ONE', BY('2.5')],
  ['charpoka', 'The-Odorant-Receptor-Co-Receptor-from-the-Bed-Bug-Cimex-lectularius-L-pone.0113692.s006.ogv', 'e/e3/The-Odorant-Receptor-Co-Receptor-from-the-Bed-Bug-Cimex-lectularius-L-pone.0113692.s006.ogv', 'খাটোনা পোকা (Bed Bug, Cimex lectularius) — গবেষণা-ভিডিও; ফুটেজটি বাংলাদেশের নয়।', 'Hansen I et al. (2016), PLoS ONE', CC0],
  ['mantis', 'Praying Mantis . Mantis religiosa.webm', '4/4e/Praying_Mantis_._Mantis_religiosa.webm', 'ম্যান্টিস (Praying Mantis, Mantis religiosa) — ফুটেজটি বাংলাদেশের নয়।', 'Gail Hampshire', BY('2.0')],
  ['kath-bhomra', 'Xylocopa appendiculata circumvolans flying HighFrameRate.webm', '1/1b/Xylocopa_appendiculata_circumvolans_flying_HighFrameRate.webm', 'কাঠ ভোমরা গণের প্রতিনিধি (Xylocopa appendiculata) উচ্চগতির ক্যামেরায় — জাপানে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Phonon.b', BYSA('4.0')],
  ['varroa-mite', 'Short video of bee suffering from varroa mites in Minnesota.webm', '2/2b/Short_video_of_bee_suffering_from_varroa_mites_in_Minnesota.webm', 'মৌমাছির দেহে ভারোয়া মাইট (Varroa destructor) — যুক্তরাষ্ট্রে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Mathieu Landretti', BYSA('4.0')],
  ['scabies-mite', 'Sarcoptes scabiei.ogv', 'c/c7/Sarcoptes_scabiei.ogv', 'চুলকুনি মাইট (Sarcoptes scabiei) — অণুবীক্ষণিক দৃশ্য।', 'My Core Competency is Competency', BY('3.0')],

  // ─── ছত্রাক, শৈবাল ও অণুজীব ──────────────────────────────────────────────
  ['amiba', 'Amoeba proteus.ogv', '0/08/Amoeba_proteus.ogv', 'অ্যামিবা (Amoeba proteus) — অণুবীক্ষণিক দৃশ্য।', 'Deuterostome', BYSA('3.0')],
  ['paramecium', 'Paramecium caudatum conjugation.ogv', 'a/a8/Paramecium_caudatum_conjugation.ogv', 'প্যারামিসিয়ামের যুগ্মন (conjugation) — অণুবীক্ষণিক দৃশ্য।', 'Deuterostome', BYSA('3.0')],
  ['ecoli', 'En.Video-Escherichia coli O157-H7.webm', 'a/a8/En.Video-Escherichia_coli_O157-H7.webm', 'ই. কোলাই (E. coli O157:H7) — চিকিৎসা-শিক্ষামূলক অ্যানিমেশন।', 'Ozzie10aaaa', BYSA('4.0')],
  ['diatom', 'Slowly gliding diatom DSC 6987.webm', '4/49/Slowly_gliding_diatom_DSC_6987.webm', 'ডায়াটমের ধীর সরণ — অণুবীক্ষণিক দৃশ্য।', 'Brandon Seah', BY('4.0')],
  ['yeast', 'Small-Toxic-Protein-Encoded-on-Chromosome-VII-of-Saccharomyces-cerevisiae-pone.0120678.s007.ogv', '5/58/Small-Toxic-Protein-Encoded-on-Chromosome-VII-of-Saccharomyces-cerevisiae-pone.0120678.s007.ogv', 'ইস্ট (Saccharomyces cerevisiae) কোষের গবেষণা-ভিডিও — অণুবীক্ষণিক দৃশ্য।', 'Makanae K et al. (2015), PLoS ONE', BY('4.0')],
  ['vibrio-cholerae', 'Cochleates-Derived-from-Vibrio-cholerae-O1-Proteoliposomes-The-Impact-of-Structure-Transformation-pone.0046461.s001.ogv', '1/1a/Cochleates-Derived-from-Vibrio-cholerae-O1-Proteoliposomes-The-Impact-of-Structure-Transformation-pone.0046461.s001.ogv', 'ভিব্রিও কোলারাই-সংক্রান্ত গবেষণা-ভিডিও (কোচলিয়েট গঠনের অ্যানিমেশন)।', 'Acevedo R et al. (2012), PLoS ONE', BY('2.5')],
  ['jhinuk-mushroom', 'Oyster Mushroom Timelapse.webm', 'f/f3/Oyster_Mushroom_Timelapse.webm', 'ঝিনুক মাশরুম (Oyster Mushroom) ফোটার টাইম-ল্যাপস।', 'Robert Fisher', BY('3.0')],
  ['khat-mashroom', 'Button mushroom - Agaricus bisporus.webm', '4/4e/Button_mushroom_-_Agaricus_bisporus.webm', 'খাদ্য মাশরুম (Button Mushroom, Agaricus bisporus)।', 'momentaryvitality', BY('3.0')],
  ['kather-chhatrak', 'Bracket fungus on tree.webm', '5/5a/Bracket_fungus_on_tree.webm', 'গাছের গুঁড়িতে বার্কেট ধরনের কাঠ-ছত্রাক (Ganoderma-জাতীয়) — যুক্তরাজ্যে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'The Nature Box', BYSA('3.0')],

  // ─── উদ্ভিদ ──────────────────────────────────────────────────────────────
  ['shapla', 'Water lily opening bloom 20fps.ogv', '0/02/Water_lily_opening_bloom_20fps.ogv', 'শাপলা-জাতীয় শ্বেতপদ্ম (Water Lily) ফোটার ধীরগতির টাইম-ল্যাপস।', 'SecretDisc', BYSA('3.0')],
  ['padma', 'Lotus fields Campinas 2015-04-25.ogv', '2/27/Lotus_fields_Campinas_2015-04-25.ogv', 'পদ্ম-ক্ষেত (Lotus, Nelumbo nucifera) — ব্রাজিলে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Ricardo de Sampaio Dagnino', BYSA('4.0')],
  ['jaba', 'Hibiscus Blooming Time Lapse.webm', '6/6e/Hibiscus_Blooming_Time_Lapse.webm', 'জবা (Hibiscus) ফোটার টাইম-ল্যাপস — ভারতে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Mainakchatterjee.tech', BYSA('4.0')],
  ['nayan-tara', 'Catharanthus roseus 1.ogv', 'c/c8/Catharanthus_roseus_1.ogv', 'নয়নতারা (Madagascar Periwinkle, Catharanthus roseus) — ফ্রান্সে ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Lionel Allorge', BYSA('3.0')],
  ['gada-phul', 'Peacock butterflies on blooming orange marigold flowers.webm', '0/0e/Peacock_butterflies_on_blooming_orange_marigold_flowers.webm', 'গাঁদা ফুলে (Marigold, Tagetes) প্রজাপতি বসেছে — ফুটেজটি বাংলাদেশের নয়।', 'Andrew Siwiec', BY('4.0')],
  ['tomato', 'Phototropism in Solanum lycopersicum.webm', 'a/aa/Phototropism_in_Solanum_lycopersicum.webm', 'টমেটো চারার আলোমুখী বৃদ্ধি (phototropism) — টাইম-ল্যাপস।', 'therealbeale', BY('3.0')],
  ['dhan', 'Paddy and Potato Fields, Sunei.webm', '3/3e/Paddy_and_Potato_Fields%2C_Sunei.webm', 'পাহাড়ি ঢালে ধানের খেত — ভারতের মেঘালয়-সংলগ্ন এলাকায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Wann Majaw', BY('4.0')],
  ['peyaj', 'Individual crystals (monocrystals) and polycrystals (clusters) in epidermal cells of onion bulb scale (Allium cepa).webm', 'a/a1/Individual_crystals_%28monocrystals%29_and_polycrystals_%28clusters%29_in_epidermal_cells_of_onion_bulb_scale_%28Allium_cepa%29.webm', 'পেঁয়াজের পাতা-কোষে অক্সালেট স্ফটিক — অণুবীক্ষণিক দৃশ্য।', 'Deni Ingilizovski', BYSA('4.0')],
  ['narikel', 'Fresh coconut 🥥 video.webm', '8/84/Fresh_coconut_%F0%9F%A5%A5_video.webm', 'নারিকেল (Coconut) — কচি নারিকেলের দৃশ্য।', 'Muktee1494', BYSA('4.0')],
  ['am', 'Big and fresh mango 🥭 Video.webm', 'a/aa/Big_and_fresh_mango_%F0%9F%A5%AD_Video.webm', 'আম (Mango) — কাঁচা আমের দৃশ্য।', 'Muktee1494', BYSA('4.0')],
  ['morich', 'Big and fresh Pepper 🌶️ video.webm', '7/75/Big_and_fresh_Pepper_%F0%9F%8C%B6%EF%B8%8F_video.webm', 'লঙ্কা / মরিচ (Chilli Pepper) — তাজা লঙ্কার দৃশ্য।', 'Muktee1494', BYSA('4.0')],
  ['ada', 'Fresh and big Ginger.webm', '2/23/Fresh_and_big_Ginger.webm', 'আদা (Ginger) — তাজা আদার দৃশ্য।', 'Muktee1494', BYSA('4.0')],
  ['dhersosh', 'Fresh okro video.webm', '0/0d/Fresh_okro_video.webm', "ঢেঁড়স (Okra / Lady's Finger) — তাজা ঢেঁড়সের দৃশ্য।", 'Muktee1494', BYSA('4.0')],
  ['pepe', 'Kerala Goldenbacked Woodpecker eating papaya fruit,Nileshwar 2022.webm', 'd/dd/Kerala_Goldenbacked_Woodpecker_eating_papaya_fruit%2CNileshwar_2022.webm', 'কাঠঠোকরা পেঁপের ফল খাচ্ছে (Common Flameback) — ভারতের কেরালায় ধারণকৃত; ফুটেজটি বাংলাদেশের নয়।', 'Rajnkd', BYSA('4.0')],

  // ─── বাংলাদেশের স্থান ────────────────────────────────────────────────────
  ['tanguar-haor', 'Tanguar Haor drone fotage-1.webm', '1/15/Tanguar_Haor_drone_fotage-1.webm', 'টাঙ্গুয়ার হাওরের ড্রোন-ভিডিও — সুনামগঞ্জ, বাংলাদেশ; রামসার সাইটের বিস্তীর্ণ জলরাশি।', 'RTV', BYSA('4.0')],
  ['sundarban', 'Kochikhali point, Sundarbans.webm', 'f/f7/Kochikhali_point%2C_Sundarbans.webm', 'সুন্দরবনের কচিখালি পয়েন্ট — খুলনা বিভাগ, বাংলাদেশ।', 'Yahya', BYSA('4.0')],
  ['sent-martin', 'Panoramic view of Saint Martin Island , Bangladesh.webm', 'b/b4/Panoramic_view_of_Saint_Martin_Island_%2C_Bangladesh.webm', 'সেন্ট মার্টিন দ্বীপের প্যানোরামিক দৃশ্য — বাংলাদেশের একমাত্র প্রবাল দ্বীপ।', 'Tanvir Rahat', BYSA('4.0')],
  ['sitakunda', 'Scenic view of Sitakund Eco-Park, Chittagong, Bangladesh.webm', '4/42/Scenic_view_of_Sitakund_Eco-Park%2C_Chittagong%2C_Bangladesh.webm', 'সীতাকুণ্ড ইকো-পার্কের দৃশ্য — চট্টগ্রাম, বাংলাদেশ।', 'Tanvir Rahat', BYSA('4.0')],
  ['rangamati-kaptai', 'Kaptai Lake video.webm', 'f/f0/Kaptai_Lake_video.webm', 'কাপ্তাই হ্রদের দৃশ্য — রাঙামাটি, বাংলাদেশ।', 'Al Riaz Uddin', BYSA('4.0')],
  ['padma-nodi', 'Padma River-Bangladesh.webm', 'd/da/Padma_River-Bangladesh.webm', 'পদ্মা নদীর বিস্তীর্ণ জলরাশি — বাংলাদেশ।', 'Roshu Bangal', BYSA('4.0')],
]

/** slug → SpeciesMedia[] রূপে রূপান্তর; URL/লাইসেন্স/উৎস-পাতা সবসময় জোড়ায় জোড়ায় থাকে। */
export const SEED_VIDEOS: Record<string, SpeciesMedia[]> = Object.fromEntries(
  VIDEO_SEEDS.map(([slug, file, path, caption, credit, license]) => [
    slug,
    [
      {
        kind: 'video' as const,
        url: `https://upload.wikimedia.org/wikipedia/commons/${path}`,
        caption,
        credit,
        license: license[0],
        licenseUrl: license[1],
        sourceUrl: `https://commons.wikimedia.org/wiki/File:${file}`,
      },
    ],
  ]),
)
