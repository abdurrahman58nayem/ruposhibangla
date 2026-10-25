/**
 * §12 — প্রকল্পের নিজস্ব সাধারণ চিত্রণগুলোর লাইসেন্স রেকর্ড।
 *
 * `public/illustrations/landscapes/`-এর তিনটি ছবি শুধু **সাধারণ দৃষ্টান্ত** —
 * কোনও নির্দিষ্ট নদী/বন/পাহাড়ের বাস্তব ছবি নয়। এগুলো AI-সহায়তায় তৈরি এবং
 * প্রকল্পের জন্যই রাখা। তাই এগুলোর উৎস ও মালিকানা জানা — কিন্তু এগুলোকে
 * প্রামাণ্যচিত্র (documentary) ছবি হিসেবে দেখানো যাবে না; সেই কথা
 * `subject` ও `note`-এ স্পষ্ট লেখা আছে এবং প্রজাতির পাতায় আলাদা ব্যাজ দেখানো হয়।
 *
 * এই ফাইলটি হাতে রক্ষণাবেক্ষণ করা হয় (media-licenses.ts স্ক্রিপ্টে তৈরি হয়,
 * তাই সেখানে হাত না দিয়ে আলাদা রাখা হয়েছে)।
 */
import type { MediaLicense } from './media-licenses'

const CREDIT = 'রূপসী বাংলা — প্রকল্পের জন্য তৈরি সাধারণ চিত্রণ (AI-সহায়তায়)'
const SOURCE = 'https://github.com/abdurrahman58nayem/ruposhibangla/blob/main/public/illustrations/landscapes/README.md'
const LICENSE = 'প্রকল্পের নিজস্ব চিত্রণ'
const NOTE =
  'এটি নির্দিষ্ট কোনও স্থানের বাস্তব ছবি নয় — শুধুই সাধারণ দৃষ্টান্ত। বাস্তব, লাইসেন্সকৃত ছবি পাওয়া গেলে একই পথে ফাইল প্রতিস্থাপন করুন।'

export const ILLUSTRATION_LICENSES: MediaLicense[] = [
  {
    file: '/illustrations/landscapes/river-placeholder.jpg',
    subject: 'নদী ও জলাভূমি — সাধারণ চিত্রণ',
    slug: '',
    kind: 'image',
    credit: CREDIT,
    source: SOURCE,
    license: LICENSE,
    verified: true,
    note: NOTE,
  },
  {
    file: '/illustrations/landscapes/forest-placeholder.jpg',
    subject: 'বন ও ম্যানগ্রোভ — সাধারণ চিত্রণ',
    slug: '',
    kind: 'image',
    credit: CREDIT,
    source: SOURCE,
    license: LICENSE,
    verified: true,
    note: NOTE,
  },
  {
    file: '/illustrations/landscapes/hills-placeholder.jpg',
    subject: 'পাহাড় ও পাহাড়ি অঞ্চল — সাধারণ চিত্রণ',
    slug: '',
    kind: 'image',
    credit: CREDIT,
    source: SOURCE,
    license: LICENSE,
    verified: true,
    note: NOTE,
  },
]
