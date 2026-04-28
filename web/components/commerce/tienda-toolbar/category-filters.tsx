'use client'

import { Pill } from '@/components/ui/pill'

interface Props {
  availableCategories: string[]
  categoryCounts?: Record<string, number>
  initialCategories: string[]
  onToggleCategory: (cat: string) => void
  onClear: () => void
}

const CATEGORY_ICONS: Record<string, string> = {
  Camping: '\u{1F3D4}\uFE0F',
  Pesca: '\u{1F3A3}',
  'Acc. Personales': '\u{1F392}',
  Automoviles: '\u{1F697}',
  Motos: '\u{1F3CD}\uFE0F',
  Campo: '\u{1F33F}',
  'Tactico/Defensa': '\u{1F5E1}\uFE0F',
}

export function CategoryFilters({ availableCategories, categoryCounts, initialCategories, onToggleCategory, onClear }: Props) {
  if (availableCategories.length === 0) return null

  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">Categoria</legend>
      {initialCategories.length > 0 ? (
        <Pill onClick={onClear}>← Todas</Pill>
      ) : null}
      {availableCategories.map((cat) => {
        const count = categoryCounts?.[cat]
        const active = initialCategories.includes(cat)
        const label = cat.charAt(0).toUpperCase() + cat.slice(1)
        return (
          <Pill
            key={cat}
            active={active}
            onClick={() => onToggleCategory(cat)}
            count={count}
            icon={CATEGORY_ICONS[cat] ?? ''}
          >
            {label}
          </Pill>
        )
      })}
    </fieldset>
  )
}
