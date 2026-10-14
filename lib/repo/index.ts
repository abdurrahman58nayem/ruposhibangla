import { hasDb } from '@/lib/db/client'
import { jsonRepo } from './json'
import { neonRepo } from './neon-repo'
import type { Repo } from './types'

export function getRepo(): Repo {
  return hasDb() ? neonRepo : jsonRepo
}

export type { Repo }
export type { SpeciesQuery, PostQuery, PostPage } from './types'
