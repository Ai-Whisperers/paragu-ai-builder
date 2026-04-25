'use client'

/**
 * Client-side image downscaler.
 *
 * iPhone / Android camera photos are routinely 8–15 MB at 4032×3024 or
 * larger — well over our 5 MB upload cap. Resizing on the client:
 *   - avoids forcing the user to install / understand editing apps
 *   - keeps bandwidth down
 *   - lets us emit WebP where the browser supports it (smaller than JPEG
 *     at matched visual quality)
 *
 * The canvas approach is synchronous-ish and works in every modern
 * browser. We skip resize if:
 *   - the file is already small (<1 MB and dimensions <= MAX_DIMENSION)
 *   - the browser lacks canvas support (unlikely)
 *   - the file is a GIF (would lose animation frames; let the server cap it)
 */

const MAX_DIMENSION = 1600
const OUTPUT_QUALITY = 0.82
const SKIP_BYTES = 1024 * 1024 // 1 MB — below this, no point resizing

export interface ResizeResult {
  file: File
  resized: boolean
  originalBytes: number
  resultBytes: number
}

async function canEncodeWebp(): Promise<boolean> {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.8))
    return !!blob && blob.type === 'image/webp'
  } catch {
    return false
  }
}

function loadImageBitmap(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image_decode_failed'))
    }
    img.src = url
  })
}

export async function resizeImageIfNeeded(file: File): Promise<ResizeResult> {
  const originalBytes = file.size

  if (file.type === 'image/gif') {
    return { file, resized: false, originalBytes, resultBytes: originalBytes }
  }
  if (!file.type.startsWith('image/')) {
    return { file, resized: false, originalBytes, resultBytes: originalBytes }
  }

  // For very small files, skip — saves CPU.
  if (originalBytes < SKIP_BYTES) {
    return { file, resized: false, originalBytes, resultBytes: originalBytes }
  }

  let img: HTMLImageElement
  try {
    img = await loadImageBitmap(file)
  } catch {
    return { file, resized: false, originalBytes, resultBytes: originalBytes }
  }

  const { width, height } = img
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION && originalBytes < 3 * 1024 * 1024) {
    // Already small enough.
    return { file, resized: false, originalBytes, resultBytes: originalBytes }
  }

  const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height, 1)
  const targetW = Math.round(width * ratio)
  const targetH = Math.round(height * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { file, resized: false, originalBytes, resultBytes: originalBytes }
  }
  // Smooth bilinear for downscale — sharper than default nearest.
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, targetW, targetH)

  const preferWebp = await canEncodeWebp()
  const outMime = preferWebp ? 'image/webp' : 'image/jpeg'
  const outExt = preferWebp ? 'webp' : 'jpg'

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outMime, OUTPUT_QUALITY),
  )
  if (!blob) {
    return { file, resized: false, originalBytes, resultBytes: originalBytes }
  }

  // If the "resized" output is somehow bigger, keep the original.
  if (blob.size >= originalBytes) {
    return { file, resized: false, originalBytes, resultBytes: originalBytes }
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
  const outFile = new File([blob], `${baseName}.${outExt}`, { type: outMime, lastModified: Date.now() })
  return { file: outFile, resized: true, originalBytes, resultBytes: outFile.size }
}
