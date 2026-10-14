'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import { Leaf, PawPrint, Mountain, BookOpenText, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string
  alt: string
  fallbackLabel?: string
  fallbackKind?: 'prani' | 'udbhid' | 'gram' | 'sthan' | 'sahitto'
  className?: string
  imgClassName?: string
}

export default function SmartImage({
  src,
  alt,
  fallbackLabel,
  fallbackKind = 'prani',
  className,
  imgClassName,
  ...rest
}: Props) {
  const [failed, setFailed] = useState(!src)

  if (failed) {
    const Icon =
      fallbackKind === 'udbhid'
        ? Leaf
        : fallbackKind === 'sthan'
          ? Mountain
          : fallbackKind === 'sahitto'
            ? BookOpenText
            : fallbackKind === 'gram'
              ? Home
              : PawPrint
    const gradient =
      fallbackKind === 'udbhid'
        ? 'from-forest-500 via-forest-700 to-forest-950'
        : fallbackKind === 'gram'
          ? 'from-earth-400 via-forest-600 to-forest-900'
          : fallbackKind === 'sthan'
            ? 'from-sky-500 via-forest-700 to-forest-950'
            : fallbackKind === 'sahitto'
              ? 'from-earth-500 via-forest-700 to-forest-950'
              : 'from-forest-400 via-forest-700 to-forest-950'
    return (
      <div className={cn('relative grid place-items-center overflow-hidden bg-gradient-to-br', gradient, className)}>
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.5),transparent_45%)]" />
        <div className="relative flex flex-col items-center gap-2 px-3 text-center text-white">
          <Icon size={30} />
          <span className="text-xs font-semibold leading-tight opacity-95">{fallbackLabel || alt}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden bg-forest-50', className)}>
      <Image
        src={src as string}
        alt={alt}
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', imgClassName)}
        {...rest}
      />
    </div>
  )
}
