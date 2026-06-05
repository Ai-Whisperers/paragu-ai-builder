export async function getBlogIndex(lang: 'es' | 'en') {
  if (lang === 'en') return (await import('@/content/en/blog/index.json')).default
  return (await import('@/content/es/blog/index.json')).default
}

export async function getBlogPosts(lang: 'es' | 'en') {
  const index = await getBlogIndex(lang)
  const entries = Array.isArray((index as { posts?: unknown[] }).posts)
    ? ((index as { posts: { slug: string }[] }).posts as { slug: string }[])
    : []
  if (entries.length === 0) {
    return []
  }
  return Promise.all(
    entries.map(({ slug }) => import(`@/content/${lang}/blog/posts/${slug}.json`).then(m => m.default).catch(() => null)),
  ).then((results) => results.filter((post): post is NonNullable<typeof post> => Boolean(post)))
}

export async function getBlogPost(lang: 'es' | 'en', slug: string) {
  try {
    const mod = await import(`@/content/${lang}/blog/posts/${slug}.json`)
    return (mod?.default ?? null) as Record<string, unknown> | null
  } catch {
    return null
  }
}
