#!/usr/bin/env node
/**
 * Unified CLI for catalog/seed/validation operations. Replaces the previous
 * scattered scripts; each former script is now a subcommand that calls into a
 * small set of shared helpers.
 *
 * Subcommands:
 *   cli scaffold-verticals         → create new vertical folders from scaffold-verticals.ts
 *   cli create-base-types          → create 10 abstract base types
 *   cli tag-verticals              → back-fill verticalId on legacy type files
 *   cli seed-from-enum [--doc P]   → bulk-seed from a markdown enumeration doc
 *   cli prune-token-wrappers [--apply]
 *   cli prune-auto-content  [--apply]
 *   cli generate-config            → regenerate web/lib/engine/static-config.ts + shards
 *   cli validate                   → run registry + tokens + schemas validators
 *   cli add-type <id> --vertical=<id> --nameEs="..." --nameEn="..."
 *
 * Usage: `npx tsx scripts/cli.ts <subcommand> [flags]`
 *
 * The individual legacy scripts still exist (they're cheap, single-purpose
 * entry points that this CLI delegates to via execSync) so CI and tooling that
 * reference them by filename keep working. The CLI is the ergonomic front
 * door for humans.
 */

import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type Runner = (args: string[]) => void | Promise<void>

function runScript(script: string, forwardArgs: string[] = []): void {
  const scriptPath = path.join(__dirname, script)
  cp.execSync(`npx tsx "${scriptPath}" ${forwardArgs.map((a) => JSON.stringify(a)).join(' ')}`, {
    stdio: 'inherit',
  })
}

function usage(): void {
  console.log(`\nparagu-builder CLI\n`)
  console.log('Subcommands:')
  for (const [name, { description }] of Object.entries(COMMANDS)) {
    console.log(`  ${name.padEnd(24)} ${description}`)
  }
  console.log('\nFlags forward to the underlying script (e.g. --apply, --doc).')
}

const COMMANDS: Record<string, { description: string; run: Runner }> = {
  'scaffold-verticals': {
    description: 'Create new vertical folders (idempotent)',
    run: (a) => runScript('scaffold-verticals.ts', a),
  },
  'create-base-types': {
    description: 'Create 11 abstract base types (idempotent)',
    run: (a) => runScript('create-base-types.ts', a),
  },
  'tag-verticals': {
    description: 'Back-fill verticalId on legacy type files',
    run: (a) => runScript('tag-types-with-verticals.ts', a),
  },
  'seed-from-enum': {
    description: 'Bulk-seed types from docs/GLOBAL_BUSINESS_TYPE_ENUMERATION.md',
    run: (a) => runScript('seed-from-enumeration.ts', a),
  },
  'prune-token-wrappers': {
    description: 'Remove thin `extends:"vertical:..."` stubs (add --apply)',
    run: (a) => runScript('prune-token-wrappers.ts', a),
  },
  'prune-auto-content': {
    description: 'Remove auto-seeded generic content files (add --apply)',
    run: (a) => runScript('prune-auto-seeded-content.ts', a),
  },
  'generate-config': {
    description: 'Regenerate static-config.ts + 23 vertical data shards',
    run: (a) => runScript('generate-static-config.ts', a),
  },
  validate: {
    description: 'Run registry schema + tokens + content validators',
    run: () => {
      runScript('validate-registry.ts')
      runScript('validate-tokens.ts')
      runScript('validate-content.ts')
      runScript('validate-schemas.ts')
    },
  },
  'add-type': {
    description: 'Add a new type: add-type <id> --vertical=<id> --nameEs=... --nameEn=...',
    run: async (args) => {
      const id = args[0]
      if (!id || id.startsWith('--')) {
        console.error('usage: cli add-type <id> --vertical=<vid> --nameEs="..." --nameEn="..." [--extends=<base>]')
        process.exit(1)
      }
      const flags = Object.fromEntries(
        args
          .filter((a) => a.startsWith('--'))
          .map((a) => {
            const eq = a.indexOf('=')
            return [a.slice(2, eq >= 0 ? eq : undefined), eq >= 0 ? a.slice(eq + 1) : 'true']
          }),
      )
      const verticalId = flags.vertical
      const nameEs = flags.nameEs
      const nameEn = flags.nameEn
      if (!verticalId || !nameEs || !nameEn) {
        console.error('missing required flags: --vertical, --nameEs, --nameEn')
        process.exit(1)
      }
      const catalog = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../../src/verticals/catalog.json'), 'utf-8'),
      ) as { verticals: Record<string, { baseType: string; schemaType: string }> }
      const vertical = catalog.verticals[verticalId]
      if (!vertical) {
        console.error(`unknown vertical: ${verticalId}`)
        console.error(`available: ${Object.keys(catalog.verticals).join(', ')}`)
        process.exit(1)
      }
      const extendsType = flags.extends || vertical.baseType
      const registryPath = path.resolve(__dirname, `../../src/registry/${id}.type.json`)
      if (fs.existsSync(registryPath)) {
        console.error(`registry already exists: ${registryPath}`)
        process.exit(1)
      }
      const registry = {
        id,
        nameEs,
        nameEn,
        verticalId,
        extends: extendsType,
        tokens: id,
        seo: {
          schemaType: vertical.schemaType,
          titleTemplate: `{{businessName}} - ${nameEs} en {{city}}`,
          descriptionTemplate: `${nameEs} profesional en {{city}}.`,
        },
        hero: {
          headlineTemplate: `{{businessName}} - ${nameEs}`,
          subheadlineTemplate: `${nameEs} profesional en {{city}}.`,
        },
      }
      fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf-8')
      console.log(`+ ${id} (registry)`)
      console.log(`Token file intentionally omitted — resolver falls back to ${verticalId} defaults.`)
      console.log(`Content intentionally omitted — compose() synthesizes via defaultContentFor().`)
      console.log(`Regenerate static-config with: cli generate-config`)
    },
  },
  help: {
    description: 'Show this help',
    run: () => usage(),
  },
}

async function main(): Promise<void> {
  const [subcommand, ...rest] = process.argv.slice(2)
  if (!subcommand || subcommand === '--help' || subcommand === '-h') {
    usage()
    return
  }
  const cmd = COMMANDS[subcommand]
  if (!cmd) {
    console.error(`unknown subcommand: ${subcommand}`)
    usage()
    process.exit(1)
  }
  await cmd.run(rest)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
