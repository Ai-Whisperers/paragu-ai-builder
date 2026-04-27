/**
 * One-off conversion: sites/nexa-paraguay/content/blog/posts.json →
 *                     sites/nexa-paraguay/blog/es/<slug>.mdx
 *
 * The generator pipeline only reads MDX blog files from
 * `sites/<slug>/blog/<locale>/*.mdx`. Nexa's 10 seed posts were written
 * in a legacy JSON format that no loader reads, leaving /blog empty.
 * This script unblocks the blog by emitting frontmatter + markdown body
 * files that fit the existing loader.
 *
 *   npx tsx scripts/convert-nexa-blog-json-to-mdx.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

interface LegacyPost {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  tags?: string[]
  image?: string
  content: string
}

function escapeYamlString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function toMdx(post: LegacyPost): string {
  const lines = [
    '---',
    `title: "${escapeYamlString(post.title)}"`,
    `date: ${post.date}`,
    `author: "${escapeYamlString(post.author)}"`,
    `category: "${escapeYamlString(post.category)}"`,
    `excerpt: "${escapeYamlString(post.excerpt)}"`,
  ]
  if (post.image) {
    lines.push(`coverImage: "${escapeYamlString(post.image)}"`)
  }
  lines.push('---', '', post.content.trim(), '')
  return lines.join('\n')
}

function main() {
  const repoRoot = resolve(__dirname, '..', '..')
  const jsonPath = resolve(repoRoot, 'sites/nexa-paraguay/content/blog/posts.json')
  const outDir = resolve(repoRoot, 'sites/nexa-paraguay/blog/es')

  const raw = readFileSync(jsonPath, 'utf-8')
  const payload = JSON.parse(raw) as { posts: LegacyPost[] }
  if (!Array.isArray(payload.posts)) {
    throw new Error('posts.json: expected { posts: [...] }')
  }

  mkdirSync(outDir, { recursive: true })

  let written = 0
  for (const p of payload.posts) {
    if (!p.slug || !p.title || !p.content) {
      console.warn(`  ↳ skipping post with missing fields: ${JSON.stringify(p).slice(0, 80)}…`)
      continue
    }
    const file = resolve(outDir, `${p.slug}.mdx`)
    writeFileSync(file, toMdx(p), 'utf-8')
    console.log(`  ✓ ${p.slug}.mdx (${p.title.slice(0, 60)}…)`)
    written++
  }
  console.log(`\n[blog-convert] wrote ${written} MDX file(s) to ${outDir}`)
}

main()
