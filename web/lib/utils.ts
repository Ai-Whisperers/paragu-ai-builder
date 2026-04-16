/**
 * Utility functions.
 * cn() merges Tailwind classes safely (from Vete pattern).
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Replace {{placeholder}} tokens in a template string.
 */
export function fillTemplate(
  template: string,
  data: Record<string, string | number | undefined>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key]
    return value !== undefined ? String(value) : match
  })
}
