/**
 * Utility functions.
 * cn() merges Tailwind classes safely (from Vete pattern).
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS classes safely using clsx and tailwind-merge.
 * 
 * This function combines multiple class values (strings, objects, arrays) and
 * resolves Tailwind class conflicts by merging them intelligently.
 * 
 * @param inputs - Class values to merge (strings, objects, arrays, or undefined)
 * @returns A merged string of Tailwind CSS classes
 * 
 * @example
 * cn('text-red-500', 'bg-blue-500') // 'text-red-500 bg-blue-500'
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500' (later takes precedence)
 * cn('px-2', condition && 'py-2') // 'px-2 py-2' or 'px-2' based on condition
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a string to a URL-friendly slug.
 * 
 * Normalizes the string by removing accents, converting to lowercase,
 * and replacing spaces/special characters with hyphens.
 * 
 * @param text - The string to convert to a slug
 * @returns A URL-friendly slug string
 * 
 * @example
 * slugify('Hello World!') // 'hello-world'
 * slugify('Café & Résumé') // 'cafe-resume'
 * slugify('My Business Name') // 'my-business-name'
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Replace {{placeholder}} tokens in a template string.
 * 
 * Searches for {{key}} patterns in the template and replaces them
 * with corresponding values from the data object. Unmatched placeholders
 * are left unchanged.
 * 
 * @param template - The template string containing {{placeholder}} tokens
 * @param data - An object mapping keys to replacement values
 * @returns The template string with placeholders replaced
 * 
 * @example
 * fillTemplate('Hello {{name}}!', { name: 'World' }) // 'Hello World!'
 * fillTemplate('{{greeting}} {{name}}', { greeting: 'Hi', name: 'Alice' }) // 'Hi Alice'
 * fillTemplate('Missing: {{key}}', {}) // 'Missing: {{key}}'
 */
export function fillTemplate(
  template: unknown,
  data: Record<string, string | number | undefined>
): string {
  if (typeof template !== 'string') return String(template ?? '')
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key]
    return value !== undefined ? String(value) : match
  })
}
