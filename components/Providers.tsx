'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { t as translate, type DictKey } from '@/lib/i18n'

type Theme = 'light' | 'dark' | 'system'

type AppState = {
  theme: Theme
  setTheme: (t: Theme) => void
  resolvedTheme: 'light' | 'dark'
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: DictKey) => string
  dataSaver: boolean
  setDataSaver: (v: boolean) => void
  autoplay: boolean
  setAutoplay: (v: boolean) => void
  videoSound: boolean
  setVideoSound: (v: boolean) => void
  reduceMotion: boolean
  setReduceMotion: (v: boolean) => void
  ready: boolean
}

const Ctx = createContext<AppState | null>(null)

const KEY = {
  theme: 'pb_theme',
  lang: 'pb_lang',
  dataSaver: 'pb_data_saver',
  autoplay: 'pb_autoplay',
  sound: 'pb_sound',
  reduce: 'pb_reduce_motion',
}

function read<T extends string>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  return (localStorage.getItem(key) as T) || fallback
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [systemDark, setSystemDark] = useState(false)
  const [lang, setLangState] = useState<Lang>('bn')
  const [dataSaver, setDataSaverState] = useState(false)
  const [autoplay, setAutoplayState] = useState(true)
  const [videoSound, setVideoSoundState] = useState(false)
  const [reduceMotion, setReduceMotionState] = useState(false)
  const [ready, setReady] = useState(false)

  // localStorage থেকে পড়া + সিস্টেম থিম শোনা
  useEffect(() => {
    setThemeState(read<Theme>(KEY.theme, 'system'))
    setLangState(read<Lang>(KEY.lang, 'bn'))
    setDataSaverState(localStorage.getItem(KEY.dataSaver) === '1')
    setAutoplayState(localStorage.getItem(KEY.autoplay) !== '0')
    setVideoSoundState(localStorage.getItem(KEY.sound) === '1')
    setReduceMotionState(
      localStorage.getItem(KEY.reduce) === '1' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    setReady(true)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  // <html> ক্লাস ও data-attr আপডেট
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.classList.toggle('reduce-motion', reduceMotion)
    root.style.colorScheme = resolvedTheme
    root.lang = lang === 'bn' ? 'bn-BD' : 'en'
  }, [resolvedTheme, reduceMotion, lang])

  const api = useMemo<AppState>(
    () => ({
      theme,
      setTheme: (v) => {
        setThemeState(v)
        localStorage.setItem(KEY.theme, v)
      },
      resolvedTheme,
      lang,
      setLang: (v) => {
        setLangState(v)
        localStorage.setItem(KEY.lang, v)
      },
      t: (key: DictKey) => translate(lang, key),
      dataSaver,
      setDataSaver: (v) => {
        setDataSaverState(v)
        localStorage.setItem(KEY.dataSaver, v ? '1' : '0')
      },
      autoplay,
      setAutoplay: (v) => {
        setAutoplayState(v)
        localStorage.setItem(KEY.autoplay, v ? '1' : '0')
      },
      videoSound,
      setVideoSound: (v) => {
        setVideoSoundState(v)
        localStorage.setItem(KEY.sound, v ? '1' : '0')
      },
      reduceMotion,
      setReduceMotion: (v) => {
        setReduceMotionState(v)
        localStorage.setItem(KEY.reduce, v ? '1' : '0')
      },
      ready,
    }),
    [theme, resolvedTheme, lang, dataSaver, autoplay, videoSound, reduceMotion, ready],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <Providers>')
  return ctx
}
