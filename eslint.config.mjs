import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const root = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: root })

/**
 * ESLint (flat config) — Next.js-এর নিজস্ব নিয়মাবলী।
 *
 * `next lint` Next 15.5-এ অবচিত; তাই সরাসরি ESLint CLI ব্যবহার করা হচ্ছে
 * (`npm run lint`), যাতে CI-তে কোনো ইন্টারঅ্যাকটিভ প্রম্পট না আসে।
 */
const config = [
  {
    // কিছু ফাইলে ইচ্ছাকৃতভাবে `eslint-disable-next-line` আছে (যেমন <img> ব্যবহারের জায়গায়);
    // নিয়মটি বন্ধ থাকায় সেগুলো “unused directive” সতর্কতা তৈরি করত — সেটি বন্ধ।
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    ignores: [
      '.next/**',
      'node_modules/**',
      '.data/**',
      'public/**',
      'scripts/**',
      'next-env.d.ts',
      'coverage/**',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // সাইটে ইচ্ছাকৃতভাবে <img> ব্যবহার হয় (কমন্স হটলিংক + SmartImage ফলব্যাক)
      '@next/next/no-img-element': 'off',
      // হুক-নির্ভরতা সতর্কতা হিসেবে থাকবে, বিল্ড আটকাবে না
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]

export default config
