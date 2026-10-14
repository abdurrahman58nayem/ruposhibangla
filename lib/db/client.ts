import fs from 'node:fs'
import path from 'node:path'
import { neon } from '@neondatabase/serverless'

export const DATABASE_URL = process.env.DATABASE_URL || ''

let cached: ReturnType<typeof neon> | null = null

export function hasDb(): boolean {
  return !!DATABASE_URL
}

export function getSql() {
  if (!DATABASE_URL) throw new Error('DATABASE_URL is not set')
  if (!cached) cached = neon(DATABASE_URL)
  return cached
}

/**
 * টেবিলের স্কিমা `db/schema.sql`-এ রাখা হয়েছে — পুরো প্রজেক্টে এটিই একমাত্র উৎস।
 * ব্যবহার হয়: (১) GitHub Workflow → scripts/migrate.mjs (Neon-এ টেবিল তৈরি),
 * (২) /api/admin/setup (সাইট চলা অবস্থায় টেবিল তৈরি + সিড)।
 */
let cachedSchema: string | null = null

export function getSchemaSql(): string {
  if (cachedSchema === null) {
    try {
      cachedSchema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf8')
    } catch (e) {
      console.error('[db] db/schema.sql পড়া যায়নি:', e)
      cachedSchema = ''
    }
  }
  return cachedSchema
}

/** স্কিমাকে আলাদা আলাদা স্টেটমেন্টে ভাগ করে (প্রতিটি স্টেটমেন্ট `;` দিয়ে শেষ) */
export function schemaStatements(): string[] {
  return getSchemaSql().split(';').map((s) => s.trim()).filter(Boolean)
}

/** @deprecated getSchemaSql() ব্যবহার করুন */
export const SCHEMA_SQL = getSchemaSql()
