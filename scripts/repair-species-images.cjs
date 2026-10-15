#!/usr/bin/env node
// Only fill blank images on existing rows. Never insert/delete/reseed content.
require('./register-typescript.cjs')
const { neon } = require('@neondatabase/serverless')
const { SPECIES } = require('../data/seed/index.ts')
const { resolveSpeciesImage } = require('../lib/species-image.ts')

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
  const sql = neon(process.env.DATABASE_URL)
  const before = await sql`select slug, image from species where btrim(coalesce(image, '')) = ''`
  const repairs = before.map((s) => ({ slug: s.slug, image: resolveSpeciesImage(s.slug, s.image) }))
    .filter((s) => s.image)
  const changed = await sql`
    update species s set image = r.image
    from jsonb_to_recordset(${JSON.stringify(repairs)}::jsonb) as r(slug text, image text)
    where s.slug = r.slug and btrim(coalesce(s.image, '')) = ''
    returning s.slug
  `
  const remaining = await sql`select slug from species where btrim(coalesce(image, '')) = '' order by slug`
  console.log(JSON.stringify({ seedRecords: SPECIES.length, blankBefore: before.length,
    repaired: changed.length, remainingBlank: remaining.map((s) => s.slug) }, null, 2))
  if (remaining.length) process.exitCode = 1
}
main().catch(() => { console.error('Image repair failed. Check database connection/schema (credentials omitted).'); process.exitCode = 1 })
