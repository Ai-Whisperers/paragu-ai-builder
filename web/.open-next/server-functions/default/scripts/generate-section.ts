#!/usr/bin/env node

/**
 * Component Generator Script
 * 
 * Usage: npx tsx scripts/generate-section.ts <component-name> [--type=section|ui]
 * 
 * Examples:
 *   npx tsx scripts/generate-section.ts hero-section
 *   npx tsx scripts/generate-section.ts date-picker --type=ui
 */

import * as fs from 'fs'
import * as path from 'path'

interface ComponentTemplate {
  name: string
  type: 'section' | 'ui'
  description?: string
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase())
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
}

function generateSectionTemplate({ name, description }: ComponentTemplate): string {
  const pascalName = toPascalCase(name)
  
  return `"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ${pascalName}Props {
  /** Section title */
  title?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * ${description || `${pascalName} section component`}
 * 
 * @example
 * <${pascalName} title="${pascalName}" className="my-8" />
 */
export function ${pascalName}({ title, className }: ${pascalName}Props) {
  return (
    <section className={cn("py-16", className)}>
      {title && (
        <h2 className="text-3xl font-bold text-[var(--text)] mb-8 text-center">
          {title}
        </h2>
      )}
      <div className="container mx-auto px-4">
        {/* Add your section content here */}
        <p className="text-[var(--text-muted)]">
          ${pascalName} section content goes here...
        </p>
      </div>
    </section>
  )
}
`
}

function generateUITemplate({ name, description }: ComponentTemplate): string {
  const pascalName = toPascalCase(name)
  const kebabName = toKebabCase(name)
  
  return `"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const ${kebabName.replace(/-/g, '')}Variants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: "",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ${pascalName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${kebabName.replace(/-/g, '')}Variants> {
  /** Component description */
}

/**
 * ${description || `${pascalName} UI component`}
 * 
 * @example
 * <${pascalName} variant="default" size="md" />
 */
export function ${pascalName}({
  className,
  variant,
  size,
  children,
  ...props
}: ${pascalName}Props) {
  return (
    <div
      className={cn(${kebabName.replace(/-/g, '')}Variants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  )
}
`
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('❌ Error: Component name is required')
    console.log('')
    console.log('Usage: npx tsx scripts/generate-section.ts <component-name> [--type=section|ui]')
    console.log('')
    console.log('Examples:')
    console.log('  npx tsx scripts/generate-section.ts hero-section')
    console.log('  npx tsx scripts/generate-section.ts date-picker --type=ui')
    process.exit(1)
  }

  const name = args[0]
  const typeArg = args.find(arg => arg.startsWith('--type='))
  const type = (typeArg?.split('=')[1] as 'section' | 'ui') || 'section'
  const descArg = args.find(arg => arg.startsWith('--desc='))
  const description = descArg?.split('=')[1]

  if (!['section', 'ui'].includes(type)) {
    console.error('❌ Error: Type must be "section" or "ui"')
    process.exit(1)
  }

  const kebabName = toKebabCase(name)
  const targetDir = type === 'section' 
    ? path.join(process.cwd(), 'components', 'sections')
    : path.join(process.cwd(), 'components', 'ui')
  
  const filePath = path.join(targetDir, `${kebabName}.tsx`)

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`❌ Error: Component already exists at ${filePath}`)
    process.exit(1)
  }

  // Ensure directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // Generate template
  const template = type === 'section'
    ? generateSectionTemplate({ name, type, description })
    : generateUITemplate({ name, type, description })

  // Write file
  fs.writeFileSync(filePath, template, 'utf-8')

  console.log(`✅ Created ${type} component: ${filePath}`)
  console.log('')
  console.log('Next steps:')
  console.log(`  1. Edit ${filePath} to add your component logic`)
  console.log(`  2. Export the component from components/${type === 'section' ? 'sections' : 'ui'}/index.ts if needed`)
  console.log(`  3. Run 'npm run typecheck' to verify TypeScript`)
  
  // Update index.ts if it exists
  const indexPath = path.join(targetDir, 'index.ts')
  if (fs.existsSync(indexPath)) {
    const exportLine = `export { ${toPascalCase(name)} } from './${kebabName}'\n`
    fs.appendFileSync(indexPath, exportLine, 'utf-8')
    console.log(`  4. Added export to ${indexPath}`)
  }
}

main()
