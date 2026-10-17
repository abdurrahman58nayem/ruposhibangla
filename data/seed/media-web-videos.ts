import type { SpeciesMedia } from '@/lib/types'

/**
 * ওয়েব-ভিডিও সিড — YouTube থেকে প্রজাতিভিত্তিক ভিডিও লিংক + ক্রেডিট (§12)।
 *
 * নীতি:
 *  - ভিডিও কোথাও আপলোড করা হয় না — শুধু উৎসের URL এম্বেড/লিংক করা হয়।
 *  - প্রতিটি এন্ট্রিতে নির্মাতা/চ্যানেলের ক্রেডিট, উৎস-URL ও লাইসেন্স-নোট বাধ্যতামূলক।
 *  - ভিডিও YouTube-এর স্ট্যান্ডার্ড লাইসেন্সে থাকে; এম্বেড করা হয়, কপি নয়।
 *  - ফুটেজ বাংলাদেশের না হলে ক্যাপশনে সেটি স্পষ্ট করা থাকে।
 */

type WebVideoSeed = readonly [
  slug: string,
  /** সম্পূর্ণ YouTube watch URL */
  url: string,
  /** ক্যাপশন (বাংলা) */
  caption: string,
  /** ক্রেডিট — সাধারণত চ্যানেলের নাম */
  credit: string,
]

const YT = 'YouTube — স্ট্যান্ডার্ড লাইসেন্স (উৎসে এম্বেড)'

export const WEB_VIDEO_SEEDS: WebVideoSeed[] = [
  // ─── স্তন্যপায়ী ─────────────────────────────────────────────────────────
  [
    'bagh',
    'https://www.youtube.com/watch?v=-ZVyKHohl_g',
    'Royal Bengal Tigers: Guardians of the Sundarbans in Bangladesh in 4K — সুন্দরবনের বাঘের পূর্ণাঙ্গ ভিডিও।',
    'Atmosyoutube',
  ],
  [
    'bagh',
    'https://www.youtube.com/watch?v=LNSZjsjeTog',
    'Land of the Swamp Tiger — সুন্দরবনের জলাভূমিতে বাঘের জীবন; @RoundglassSustain।',
    'Roundglass Sustain',
  ],
  [
    'hati',
    'https://www.youtube.com/watch?v=ZqoPcxT4v0Q',
    'Elephants under threat in Bangladesh — বাংলাদেশে বন্য হাতির হুমকি ও আবাসন সংকট।',
    'Al Jazeera English',
  ],
  [
    'shushuk',
    'https://www.youtube.com/watch?v=9Gj8qkwti6c',
    'বিশ্বের বিরল ডলফিন বাংলাদেশের সুন্দরবনে!! — ইরাবতী ডলফিন (Irrawaddy dolphin) নিয়ে বাংলা প্রতিবেদন।',
    'Bioscope Entertainment',
  ],
  [
    'gangeya-shushuk',
    'https://www.youtube.com/watch?v=8VdjWnewvvs',
    'Tangled Fates — গাঙ্গেয় শুশুক (Ganges River Dolphin) নিয়ে সংরক্ষণ-তথ্যচিত্র; উপসাগরীয় উপকূলের বাইক্যাচ সংকট।',
    'Wildlife Conservation Trust',
  ],
  [
    'pochhima-hoolock-gibbon',
    'https://www.youtube.com/watch?v=CtlUCtnaqwg',
    'Home in the Trees: Western Hoolock Gibbon — পশ্চিমা হুলক গিবনের জীবনচরিত; ভারতের উত্তর-পূর্বে ধারণকৃত, প্রজাতিটি বাংলাদেশেও বসবাস করে।',
    'Roundglass Sustain',
  ],
  [
    'mecho-biral',
    'https://www.youtube.com/watch?v=mqHG9K4wqCw',
    'Love thy Neighbour: The Villagers of Paddapukur and the Fishing Cat — মেছোবাঘ ও গ্রামবাসীর সহাবস্থানের গল্প।',
    'Roundglass Sustain',
  ],
  [
    'deshi-bhodor',
    'https://www.youtube.com/watch?v=HIKuOtv99H4',
    'Near Extinction: Wild Otters of Bangladesh — বাংলাদেশের বন্য ভাসুকিয়া ওদোরের অবস্থা, বিলুপ্তির কিনারায়।',
    'Otter Project Bangladesh',
  ],
  [
    'eurasian-otter',
    'https://www.youtube.com/watch?v=Ww-gbZU_des',
    'Eurasian & Smooth Coated Otters in Bangladesh — বাংলাদেশে ভাসুকিয়া ওদোর ও ইউরেশীয় ওদোরের বর্তমান অবস্থা।',
    'MDKwildlife Documentary',
  ],
  [
    'meghla-chita',
    'https://www.youtube.com/watch?v=btDxyNbpaLo',
    'Clouded Leopard Cubs Grow Up | India’s Wild Leopards — মেঘলা চিতার বাচ্চাদের বেড়ে ওঠা; Nat Geo. ফুটেজ ভারতে ধারণকৃত।',
    'Nat Geo Animals',
  ],
  [
    'bonrui',
    'https://www.youtube.com/watch?v=gz4HXyxcess',
    "Pangolin | World's Weirdest — বাঘাহাঙ্গুর/বনরুই-জাতীয় প্যাঙ্গোলিনের অভিযোজন ও চোরাচালানের হুমকি; Nat Geo.",
    'Nat Geo Animals',
  ],
  [
    'china-bonrui',
    'https://www.youtube.com/watch?v=q1O5B8I6cXs',
    'The Insane Biology of: The Pangolin — প্যাঙ্গোলিনের জীববিজ্ঞান; চীনা বনরুইসহ সব প্যাঙ্গোলিনের বিপন্ন অবস্থা।',
    'Real Science',
  ],
  [
    'lajjaboti-banor',
    'https://www.youtube.com/watch?v=JDqpcHGfJ2I',
    'Meet the slow loris, the only venomous primate — লোরিস-জাতীয় প্রাইমেটের বিষধর বৈশিষ্ট্য; TED-Ed. লাজুকবানরের (Bengal slow loris) ঘনিষ্ঠ আত্মীয়।',
    'TED-Ed',
  ],
  [
    'sunda-lojjabati-banor',
    'https://www.youtube.com/watch?v=AdbHMMuONHw',
    'Rescuers Release 20 Javan Slow Lorises Back Into The Wild — লোরিস উদ্ধার ও পুনঃস্থাপন; Nat Geo. ফুটেজ জাভার, সুন্দা লাজুকবানরের ঘনিষ্ঠ প্রজাতি।',
    'National Geographic',
  ],
  [
    'rhesus-banor',
    'https://www.youtube.com/watch?v=NSEInZ5p4e8',
    'Rhesus Macaque: The Monkey Fighting for Survival in Bangladesh — বাংলাদেশে রেসাস বানরের টিকে থাকার লড়াই।',
    'Nabil ForestEye',
  ],
  [
    'shial',
    'https://www.youtube.com/watch?v=gVYSsS37GBY',
    'The Wild Beside Us: Golden Jackals of Kalapur — সোনালি শিয়ালের শিকার-পদ্ধতি ও মানুষের সাথে সহাবস্থান।',
    'Roundglass Sustain',
  ],
  [
    'badur',
    'https://www.youtube.com/watch?v=8IUUOMFAaOg',
    'Facts About The Indian Flying Fox — বড় বাদুড়/ইন্ডিয়ান ফ্লাইং ফক্সের বৈশিষ্ট্য ও সংরক্ষণ।',
    'Wildlife SOS',
  ],
  [
    'chitra-horin',
    'https://www.youtube.com/watch?v=GK8P1IVkkYo',
    'Spotted Chital Deer grazing in the highly endangered Sundarbans — সুন্দরবনে ছারাল/চিত্রা হরিণের চরানো।',
    'WildFilmsIndia',
  ],
  [
    'shombor',
    'https://www.youtube.com/watch?v=97RHqTJZe0E',
    'Largest deer in India — Sambar Deer — সম্বর হরিণের বৈশিষ্ট্য ও ভারতীয় বন্যপ্রাণী হিসেবে পরিচিতি।',
    'Kanniyakumari Nature Foundation',
  ],
  [
    'chitabagh',
    'https://www.youtube.com/watch?v=CMQbU9vRH3U',
    'Leopards of Mumbai: Survival in the World’s Largest Urban Jungle — চিতাবাঘের মহানগর-জীবনে টিকে থাকা; ফুটেজ ভারতে ধারণকৃত।',
    'Extreme Earth',
  ],
  [
    'bon-biral',
    'https://www.youtube.com/watch?v=Vcu_FIbjTTM',
    'The Hunt — Indian Jungle Cat — বনবিড়ালের শিকারের দৃশ্য, স্বাভাবিক আবাসনে।',
    'The Primal Instinct',
  ],
  [
    'humpback-timi',
    'https://www.youtube.com/watch?v=U_HUiC1dP00',
    'The fascinating world of the humpback whales — মেটো-মিনটিমি (Humpback whale) নিয়ে পূর্ণ তথ্যচিত্র।',
    'Free High-Quality Documentaries',
  ],
  [
    'nirno-porpoise',
    'https://www.youtube.com/watch?v=I3d6y-tuI6M',
    'Facts: The Finless Porpoise — পাখনাহীন পর্পোইজের বৈশিষ্ট্য ও সংরক্ষণ-অবস্থা।',
    'Deep Marine Scenes',
  ],
  [
    'nil-timi',
    'https://www.youtube.com/watch?v=1fzT6ifrhL8',
    'Blue Whale | Blue Planet | BBC Studios — নীল তিমির পূর্ণাঙ্গ দৃশ্য; BBC-র ব্লু প্ল্যানেট সিরিজ থেকে।',
    'BBC Studios',
  ],
  [
    'sperm-timi',
    'https://www.youtube.com/watch?v=haisScEj-qI',
    "The Greatest Hunt You've Never Seen: Sperm Whale vs. Giant Squid — মোকাতিমির গভীর-সমুদ্রে শিকার; পূর্ণ তথ্যচিত্র।",
    'Wild Life Documentary',
  ],
  [
    'indo-pacific-bottlenose',
    'https://www.youtube.com/watch?v=CF3VzOw6hFs',
    'Bully Bottlenose Dolphins | Wild Caribbean | BBC Earth — বোতলনো-ডলফিনের দলগত আচরণ; ফুটেজ ক্যারিবিয়ানে ধারণকৃত।',
    'BBC Earth',
  ],
  [
    'bottlenose-dolphin',
    'https://www.youtube.com/watch?v=WLhaPQvCExs',
    'Dolphins React to Bizarre Bubbles | Ocean Giants | BBC Earth — বোতলনো-ডলফিনের কৌতূহলী স্বভাব ও বুদবুদ-খেলা।',
    'BBC Earth',
  ],
  [
    'humpback-dolphin',
    'https://www.youtube.com/watch?v=9ROb6wJMg1w',
    'Documentary on Indian Ocean Humpback Dolphin — হাম্পব্যাক ডলফিনের (Sousa) বাসস্থান ও সংরক্ষণ-তথ্যচিত্র।',
    'Nouf Almahri',
  ],
  [
    'sloth-bhalluk',
    'https://www.youtube.com/watch?v=qKP-8CcPeXg',
    'Living with Sloth Bears — Wildlife SOS-এর চলচ্চিত্র; ভারতে মানুষ ও স্লথ ভালুকের সহাবস্থান।',
    'International Bear Association (IBA)',
  ],
  [
    'kalo-bhalluk',
    'https://www.youtube.com/watch?v=Jw58GTkkUag',
    'Some Interesting Facts About Asiatic Black Bears — এশীয় কালো ভালুকের গুরুত্বপূর্ণ বৈশিষ্ট্য।',
    'Wildlife SOS',
  ],
  [
    'neul',
    'https://www.youtube.com/watch?v=vdg9gkmWsEA',
    'Cobra vs. Mongoose | National Geographic — নেউল ও কোবরার লড়াই; Nat Geo-র কিংবদন্তি ক্লিপ।',
    'National Geographic',
  ],
  [
    'phayre-langur',
    'https://www.youtube.com/watch?v=yhmIxymhegw',
    "An endangered monkey's diet changed as forests vanished — ফেয়ারের লিফমাঙ্কি (Phayre's leaf monkey) নিয়ে প্রতিবেদন।",
    'Mongabay India',
  ],
  [
    'capped-langur',
    'https://www.youtube.com/watch?v=4o2sqLqPjH8',
    'The Capped Langur, studied by Chandan Kumar Duarah — ক্যাপড-ল্যাঙ্গুরের বন্য জীবন-পর্যবেক্ষণ।',
    'Borphookon & Son',
  ],
  [
    'chita-bidal',
    'https://www.youtube.com/watch?v=7qgFL3iyOTI',
    'Leopard Cat (camera trap) — চিতা বিড়ালের ক্যামেরা-ট্র্যাপ ফুটেজ; দক্ষিণ-পূর্ব এশিয়ার বনে ধারণকৃত।',
    'Wildlife Alliance Camera-Trap',
  ],
  [
    'bham',
    'https://www.youtube.com/watch?v=vw9CiNL3wFw',
    'How I Film Large-spotted Civets in the Wild at Night — রাতের বনে বড়-দাগওয়ালা বিভরের দুর্লভ ফুটেজ; থাইল্যান্ডে ধারণকৃত (ঘনিষ্ঠ প্রজাতি)।',
    'Thailand Wild',
  ],
  [
    'shojaru',
    'https://www.youtube.com/watch?v=xgZism6uzMo',
    'Indian Crested Porcupine (Hystrix indica) — শিয়াল কাটার (শোজারু) মা-বাচ্চার রাতের দৃশ্য।',
    'WildFilmsIndia',
  ],
  [
    'bharotiyo-tal-kathbiral',
    'https://www.youtube.com/watch?v=ijoiKe9iRTA',
    'Indian palm squirrel constructing nest materials — তাল-কাঠবিড়ালির বাসা বানানোর দৃশ্য।',
    'WildFilmsIndia',
  ],
]

/** slug -> SpeciesMedia রূপে রূপান্তর (একটি প্রজাতিতে একাধিক ভিডিও থাকতে পারে) */
export const WEB_VIDEOS: Record<string, SpeciesMedia[]> = WEB_VIDEO_SEEDS.reduce(
  (acc, [slug, url, caption, credit]) => {
    const entry: SpeciesMedia = {
      kind: 'video' as const,
      url,
      caption,
      credit,
      license: YT,
      sourceUrl: url,
    }
    if (acc[slug]) acc[slug].push(entry)
    else acc[slug] = [entry]
    return acc
  },
  {} as Record<string, SpeciesMedia[]>,
)
