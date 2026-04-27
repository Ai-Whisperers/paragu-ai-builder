import type { ComponentType, SVGProps } from 'react'
import {
  NigiriIcon,
  MakiIcon,
  SashimiIcon,
  TemakiIcon,
  SakeIcon,
  TempuraIcon,
  ChopsticksIcon,
} from './sushi'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const CATEGORY_ICONS: Record<string, IconComponent> = {
  nigiri: NigiriIcon,
  maki: MakiIcon,
  maki_rolls: MakiIcon,
  specialty_rolls: MakiIcon,
  sashimi: SashimiIcon,
  hand_rolls: TemakiIcon,
  temaki: TemakiIcon,
  sake: SakeIcon,
  beverages: SakeIcon,
  tempura: TempuraIcon,
  appetizers: TempuraIcon,
  hibachi: ChopsticksIcon,
  main_courses: ChopsticksIcon,
}

export function SushiCategoryIcon({
  category,
  ...props
}: { category: string } & SVGProps<SVGSVGElement>) {
  const key = category.toLowerCase().replace(/\s+/g, '_')
  const Icon = CATEGORY_ICONS[key] ?? ChopsticksIcon
  return <Icon {...props} />
}
