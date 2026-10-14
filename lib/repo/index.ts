import { hasDb } from '@/lib/db/client'
import { jsonRepo } from './json'
import { neonRepo } from './neon-repo'
import type { Repo } from './types'

function rawRepo(): Repo {
  return hasDb() ? neonRepo : jsonRepo
}

/** সিঙ্ক রেপো — যেকোনো জায়গায় ব্যবহার করা যায়; প্রথমবারে init() ব্যাকগ্রাউন্ডে চালু করে */
export function getRepo(): Repo {
  void getReadyRepo()
  return rawRepo()
}

let readyPromise: Promise<Repo> | null = null

/**
 * init() একবারই চালায় — সিড ডেটা ঢোকানো ও প্রথম অ্যাডমিন (bootstrap) তৈরি নিশ্চিত করে।
 * লগইন, রেজিস্টার, অ্যাডমিন প্যানেল ও সেটআপ রুটে এটি ব্যবহার করা হয়।
 */
export function getReadyRepo(): Promise<Repo> {
  if (!readyPromise) {
    const repo = rawRepo()
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
