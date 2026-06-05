/**
 * ANNOTATION: SafeImage
 *
 * What it is: Wrapper around Next.js Image component that handles missing/broken images gracefully.
 * Shows a fallback placeholder when the image fails to load or is missing.
 *
 * Why your business needs it: Broken image icons look unprofessional and break the visual flow.
 * This component ensures every image slot has a graceful fallback — no broken icons ever.
 *
 * What AI populates from your data: None — this is a pure utility component.
 * It protects your site from broken image references in product data or CMS content.
 *
 * Your input: None — this is handled automatically.
 *
 * Plan availability: All plans
 */

/**
 * @component SafeImage
 * @description Next/Image wrapper with error fallback to placeholder.
 * @featureFlags core
 * @requires next/image
 * @implementation useState for error tracking, conditional render of fallback
 */

'use client'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
}

export function SafeImage({ src, fallbackSrc, alt, className, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className || ''}`}>
        {fallbackSrc ? (
          <Image src={fallbackSrc} alt={alt || 'placeholder'} fill className="object-cover opacity-50" />
        ) : (
          <span className="text-gray-400 text-sm p-4">{alt || 'Imagen no disponible'}</span>
        )}
      </div>
    )
  }

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className || ''}`}>
        <span className="text-gray-400 text-sm p-4">{alt || 'Imagen no disponible'}</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  )
}