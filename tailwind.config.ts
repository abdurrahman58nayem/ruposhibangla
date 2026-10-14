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
      },
      fontFamily: {
        bn: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'SolaimanLipi', 'Kalpurush', 'system-ui', 'sans-serif'],
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
