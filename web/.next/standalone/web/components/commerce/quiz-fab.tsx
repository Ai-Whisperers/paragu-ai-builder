/**
 * Floating action button linking to the Product Finder Quiz.
 *
 * Previously, "Ayudame a elegir" lived as a small outline pill next to
 * the page H1. External UX audit flagged it as the biggest conversion
 * lever on adult-retail shops (where vocabulary is a friction point)
 * treated like an afterthought. This is a FAB: always visible on
 * bottom-right, brand-colored, shadowed, with a subtle pulse in its
 * initial lifetime so first-time visitors notice it before their eyes
 * get filter-fatigued.
 */
import Link from 'next/link'

interface Props {
  href: string
  label?: string
}

export function QuizFab({ href, label = 'Ayudame a elegir' }: Props) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[color:var(--primary,#111)] px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] sm:bottom-6 sm:right-6"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform group-hover:rotate-12"
      >
        <path d="M12 2l2.09 6.42 6.91.1-5.45 4.09L17.72 19 12 14.82 6.28 19l2.17-6.39L3 8.52l6.91-.1L12 2z" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden" aria-hidden="true">
        Quiz
      </span>
    </Link>
  )
}
