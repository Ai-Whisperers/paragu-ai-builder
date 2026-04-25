#!/usr/bin/env npx tsx
/**
 * create-type — scaffold a new business type.
 *
 * Usage:
 *   npm run create-type -- <id> [--name "Display Name"] [--schema-type "LocalBusiness"]
 *
 * Examples:
 *   npm run create-type -- cafeteria
 *   npm run create-type -- cafeteria --name "Cafetería" --schema-type Cafe
 *
 * Writes four files (refusing to overwrite existing ones):
 *   src/registry/<id>.type.json
 *   src/tokens/<id>.tokens.json
 *   src/content/<id>.content.json
 *   src/schemas/<id>.schema.json
 *
 * After running, add the new id to src/registry/index.json and run
 * `npm run validate:schemas && npm run validate:tokens` to confirm shape.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

const REPO_ROOT = resolve(__dirname, '..', '..')
const REG_DIR = resolve(REPO_ROOT, 'src', 'registry')
const TOK_DIR = resolve(REPO_ROOT, 'src', 'tokens')
const CON_DIR = resolve(REPO_ROOT, 'src', 'content')
const SCH_DIR = resolve(REPO_ROOT, 'src', 'schemas')

interface CliArgs {
  id: string
  displayName: string
  schemaType: string
}

function parseArgs(argv: string[]): CliArgs {
  const positional: string[] = []
  let displayName: string | undefined
  let schemaType = 'LocalBusiness'

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--name' || arg === '-n') {
      displayName = argv[++i]
    } else if (arg === '--schema-type') {
      schemaType = argv[++i]
    } else if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    } else if (!arg.startsWith('-')) {
      positional.push(arg)
    }
  }

  if (positional.length === 0) {
    console.error('error: missing <id> argument\n')
    printUsage()
    process.exit(1)
  }

  const id = positional[0]
  if (!/^[a-z][a-z0-9_]*$/.test(id)) {
    console.error(`error: id "${id}" must match /^[a-z][a-z0-9_]*$/ (snake_case, letters + digits + underscores)`)
    process.exit(1)
  }

  return {
    id,
    displayName: displayName || titleCase(id.replace(/_/g, ' ')),
    schemaType,
  }
}

function printUsage(): void {
  console.log(`Usage: npm run create-type -- <id> [--name "Display Name"] [--schema-type Cafe]

Options:
  --name, -n        Display name shown to users (default: titlecased id)
  --schema-type     schema.org type (default: LocalBusiness)
  --help, -h        Show this message`)
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

function refuseIfExists(path: string): void {
  if (existsSync(path)) {
    console.error(`error: ${path} already exists — refusing to overwrite`)
    process.exit(1)
  }
}

function writeJson(path: string, data: unknown): void {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log(`  wrote ${path}`)
}

function registryTemplate(args: CliArgs) {
  return {
    id: args.id,
    nameEs: args.displayName,
    nameEn: args.displayName,
    tokens: args.id,
    pages: {
      homepage: {
        sections: ['header', 'hero', 'services', 'contact', 'testimonials', 'ctaBanner', 'footer'],
        requiredSections: ['header', 'hero', 'services', 'contact', 'footer'],
      },
      services: {
        sections: ['header', 'services', 'faq', 'ctaBanner', 'footer'],
        requiredSections: ['header', 'services', 'footer'],
      },
      contact: {
        sections: ['header', 'contact', 'footer'],
        requiredSections: ['header', 'contact', 'footer'],
      },
    },
    features: {
      onlineBooking: { enabled: false },
      serviceMenu: { enabled: true, showPrices: true, showDuration: true },
      portfolio: { enabled: false },
      beforeAfter: { enabled: false },
      classSchedule: { enabled: false },
      packageBuilder: { enabled: false },
      whatsappFloat: { enabled: true },
      googleMapsEmbed: { enabled: true },
      pricingDisplay: { enabled: true },
    },
    targetAudience: {
      primary: 'TODO: describe primary audience',
      secondary: 'TODO: describe secondary audience',
    },
    seo: {
      titleTemplate: `{{businessName}} - ${args.displayName} en {{city}}`,
      descriptionTemplate: `${args.displayName} en {{city}}. TODO: write a 2-sentence description.`,
      schemaType: args.schemaType,
      keywords: [`${args.id} {{city}}`, `${args.displayName.toLowerCase()} {{city}}`],
    },
    nav: {
      items: ['Inicio', 'Servicios', 'Contacto'],
      cta: { text: 'Consultar', action: 'contact' },
    },
    hero: {
      style: 'image',
      headlineTemplate: `{{businessName}}`,
      subheadlineTemplate: 'TODO: tagline',
      ctaPrimary: { text: 'Consultar', action: 'contact' },
    },
  }
}

function tokensTemplate(args: CliArgs) {
  return {
    name: args.displayName,
    extends: 'base',
    theme: 'light',
    mood: ['clean', 'professional'],
    palettes: {
      optionA: {
        name: 'Default',
        colors: {
          primary: '#2c3e50',
          secondary: '#c0392b',
          accent: '#f39c12',
          background: '#ffffff',
          surface: '#f8f9fa',
          text: '#1a1a1a',
          textMuted: '#6b7280',
          success: '#27ae60',
          error: '#e74c3c',
        },
      },
    },
    defaultPalette: 'optionA',
    typography: {
      heading: { family: 'Inter', weights: [600, 700] },
      body: { family: 'Inter', weights: [400, 500] },
    },
  }
}

function contentTemplate(args: CliArgs) {
  return {
    id: args.id,
    locale: 'es-PY',
    hero: {
      headline: `{{businessName}} en {{city}}`,
      subheadline: 'TODO: write a short, compelling subheadline',
      ctaPrimary: 'Consultar',
      ctaSecondary: 'Ver servicios',
    },
    servicesPage: {
      title: 'Servicios',
      categories: [
        {
          key: 'principales',
          title: 'Principales',
          defaultServices: [
            { name: 'TODO: service name', price: null, duration: 30, description: 'TODO: describe service' },
          ],
        },
      ],
    },
    galleryPage: { title: 'Galería', subtitle: 'Conocé nuestro trabajo' },
    teamPage: { title: 'Nuestro Equipo' },
    contactPage: { title: 'Contactanos' },
    faq: [
      { q: 'TODO: question', a: 'TODO: answer' },
    ],
    ctaBanner: {
      title: '¿Listo para empezar?',
      buttonText: 'Consultar',
    },
    footer: {
      columns: [],
      quickLinks: [],
      copyright: `© {{year}} {{businessName}}. Todos los derechos reservados.`,
    },
    whatsapp: {
      defaultMessage: 'Hola! Me interesa conocer más sobre sus servicios.',
    },
  }
}

function schemaTemplate(args: CliArgs) {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: `https://paragu-ai.com/schemas/${args.id}.schema.json`,
    title: `${args.displayName} Business Schema`,
    description: `Validation schema for ${args.displayName} business data.`,
    type: 'object',
    required: ['name', 'slug', 'type', 'city'],
    properties: {
      name: { type: 'string', minLength: 1 },
      slug: { type: 'string', pattern: '^[a-z0-9-]+$' },
      type: { const: args.id },
      city: { type: 'string', minLength: 1 },
      tagline: { type: 'string' },
      phone: { type: 'string' },
      email: { type: 'string', format: 'email' },
      whatsapp: { type: 'string' },
      services: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'string' },
            duration: { type: 'number' },
          },
        },
      },
    },
  }
}

function main(): void {
  const args = parseArgs(process.argv.slice(2))

  const paths = {
    registry: resolve(REG_DIR, `${args.id}.type.json`),
    tokens: resolve(TOK_DIR, `${args.id}.tokens.json`),
    content: resolve(CON_DIR, `${args.id}.content.json`),
    schema: resolve(SCH_DIR, `${args.id}.schema.json`),
  }

  for (const path of Object.values(paths)) {
    refuseIfExists(path)
  }

  console.log(`Scaffolding business type: ${args.id} (${args.displayName})`)
  writeJson(paths.registry, registryTemplate(args))
  writeJson(paths.tokens, tokensTemplate(args))
  writeJson(paths.content, contentTemplate(args))
  writeJson(paths.schema, schemaTemplate(args))

  console.log(`\nNext steps:`)
  console.log(`  1. Add "${args.id}" to src/registry/index.json`)
  console.log(`  2. Fill in TODO placeholders in the 4 files above`)
  console.log(`  3. npm run validate:schemas && npm run validate:tokens`)
  console.log(`  4. Regenerate static-config if needed`)
}

main()
