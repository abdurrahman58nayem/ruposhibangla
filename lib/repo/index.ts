import { hasDb } from '@/lib/db/client'
import { jsonRepo } from './json'
import { neonRepo } from './neon-repo'
import type { Repo } from './types'

export function getRepo(): Repo {
  return hasDb() ? neonRepo : jsonRepo
}

let readyPromise: Promise<Repo> | null = null

/**
 * init() একবারই চালায় — সিড ডেটা ঢোকানো ও প্রথম অ্যাডমিন (bootstrap) তৈরি নিশ্চিত করে।
 * লগইন, রেজিস্টার, অ্যাডমিন প্যানেল ও সেটআপ রুটে এটি ব্যবহার করা হয়।
 */
export function getReadyRepo(): Promise<Repo> {
  if (!readyPromise) {
    const repo = getRepo()
    readyPromise = repo
      .init()
      .then(() => repo)
      .catch((e) => {
        console.error('[repo] init ব্যর্থ:', e)
        readyPromise = null
        return repo
      })
  }
  return readyPromise
}

export type { Repo }
export type { SpeciesQuery, PostQuery, PostPage } from './types'
