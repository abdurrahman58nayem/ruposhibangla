import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f8f2',
          100: '#dcefe6',
          200: '#bfe0d4',
          300: '#93caab',
          400: '#5fae80',
          500: '#3d9163',
          600: '#2b754f',
          700: '#235d41',
          800: '#1e4a35',
          900: '#123324',
          950: '#082015',
        },
        earth: {
          50: '#fdf8f0',
          100: '#f8ecd8',
          200: '#efd5ae',
          300: '#e3b67c',
          400: '#d7944f',
          500: '#cb7a37',
          600: '#b5602b',
          700: '#964926',
          800: '#7a3c25',
          900: '#653323',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        /* ── বাংলাদেশের প্রকৃতি ও ঐতিহ্য — রঙের ছক ────────────── */
        /** পদ্মা-মেঘনা-যমুনা ও হাওরের নীল */
        nadi: {
          50: '#eef7fb',
          100: '#d7ecf6',
          200: '#b0dbed',
          300: '#7fc2e0',
          400: '#489fce',
          500: '#2e7fb8',
          600: '#1f6499',
          700: '#1b517d',
          800: '#12557f',
          900: '#0d334f',
        },
        /** ধানখেতের সোনালি / সরিষা ফুল */
        paddy: {
          50: '#fdf8ec',
          100: '#f9eecf',
          200: '#f2dca0',
          300: '#e8c26a',
          400: '#e0a62c',
          500: '#cb7a37',
          600: '#b5602b',
          700: '#964926',
          800: '#7a3c25',
          900: '#653323',
        },
        /** লাল মাটি / ইট / টেরাকোটা */
        mati: {
          50: '#fdf4f1',
          100: '#fae5dd',
          200: '#f3c9ba',
          300: '#e8a48c',
          400: '#d97e60',
          500: '#cc5f42',
          600: '#bc4935',
          700: '#9c3a2b',
          800: '#813328',
          900: '#6c2e25',
        },
        /** শাপলা — জাতীয় ফুল */
        shapla: {
          50: '#fdf2f6',
          100: '#fbe4ee',
          200: '#f7c9dd',
          300: '#efa3c4',
          400: '#e0708f',
          500: '#d1517a',
          600: '#b8456e',
          700: '#9a355c',
          800: '#82304e',
          900: '#6e2c43',
        },
        /** নকশী কাঁথার গাঢ় লাল */
        kantha: {
          50: '#fdf2f2',
          100: '#fae4e4',
          200: '#f3c9c9',
          300: '#e7a3a3',
          400: '#d86e6e',
          500: '#cb4a4a',
          600: '#b04a4a',
          700: '#933c3c',
          800: '#7a2a2a',
          900: '#662727',
        },
      },
      fontFamily: {
        bn: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'SolaimanLipi', 'Kalpurush', 'system-ui', 'sans-serif'],
        /** শিরোনামে প্রিমিয়াম সেরিফ — বাংলা লিপির সাথে ভালো বসে */
        display: ['"Noto Serif Bengali"', '"Hind Siliguri"', 'SolaimanLipi', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,40,28,.05), 0 8px 24px -12px rgba(16,40,28,.18)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'none' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up .5s ease both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}

export default config
