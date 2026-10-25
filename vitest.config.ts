import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    reporters: 'default',
  },
  resolve: {
    alias: {
      // Next.js-এর মতো `@/…` ইমপোর্ট টেস্টেও কাজ করবে
      '@': root,
    },
  },
})
