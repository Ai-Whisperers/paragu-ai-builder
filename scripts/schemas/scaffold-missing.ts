#!/usr/bin/env node

/**
 * Schema Scaffold Generator
 *
 * Finds registry entries without corresponding schema files and generates
 * scaffold schemas for them.
 *
 * Usage:
 *   node scripts/schemas/scaffold-missing.ts [--dry-run] [--verbose]
 *
 * Options:
 *   --dry-run    Print what would be created without writing files
 *   --verbose     Log detailed progress
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { RegistryEntry } from '../../web/lib/types';

interface SchemaFile {
  id: string;
  path: string;
  content: unknown;
}

interface Options {
  dryRun: boolean;
  verbose: boolean;
};

const args = process.argv.slice(2);
const options: Options = {
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose'),
};

const REGISTRY_DIR = join(process.cwd(), 'src', 'registry');
const SCHEMAS_DIR = join(process.cwd(), 'src', 'schemas');

function log(message: string): void {
  if (options.verbose) {
    console.log(`[INFO] ${message}`);
  }
}

function error(message: string): void {
  console.error(`[ERROR] ${message}`);
  process.exit(1);
}

function loadRegistryEntries(): Map<string, RegistryEntry> {
  const entries = new Map<string, RegistryEntry>();
  const files = readdirSync(REGISTRY_DIR)
    .filter(f => f.endsWith('.type.json') && f !== 'index.json');

  log(`Found ${files.length} registry files`);

  for (const file of files) {
    try {
      const path = join(REGISTRY_DIR, file);
      const content = JSON.parse(readFileSync(path, 'utf-8'));
      entries.set(content.id, content);
      log(`Loaded registry entry: ${content.id}`);
    } catch (err) {
      error(`Failed to load ${file}: ${(err as Error).message}`);
    }
  }

  return entries;
}

function loadExistingSchemas(): Map<string, SchemaFile> {
  const schemas = new Map<string, SchemaFile>();
  const files = readdirSync(SCHEMAS_DIR)
    .filter(f => f.endsWith('.schema.json'));

  log(`Found ${files.length} existing schema files`);

  for (const file of files) {
    try {
      const path = join(SCHEMAS_DIR, file);
      const content = JSON.parse(readFileSync(path, 'utf-8'));
      const id = content.$id || file.replace('.schema.json', '');
      schemas.set(id, { id, path, content });
      log(`Loaded schema: ${id}`);
    } catch (err) {
      error(`Failed to load schema ${file}: ${(err as Error).message}`);
    }
  }

  return schemas;
}

function findMissingSchemas(
  registry: Map<string, RegistryEntry>,
  schemas: Map<string, SchemaFile>
): string[] {
  const missing: string[] = [];

  for (const [id] of registry) {
    if (!schemas.has(id)) {
      missing.push(id);
      log(`Missing schema for: ${id}`);
    }
  }

  return missing;
}

function generateSchema(
  entry: RegistryEntry,
  existingSchemas: Map<string, SchemaFile>
): string {
  const { id, nameEs, nameEn, extends: extendsId } = entry;

  let extendsRef = 'base-business';
  let extendsName = 'Base Business';

  if (extendsId && existingSchemas.has(extendsId)) {
    extendsRef = extendsId;
    extendsName = existingSchemas.get(extendsId)!.content.$title || extendsId;
  }

  const title = nameEs || nameEn || id.replace(/_/g, ' ').replace(/\b\w/g, s => s.toUpperCase());

  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: id,
    title: `${title} Business Input Schema (SCAFFOLD)`,
    description: `Additional fields for ${title} businesses beyond ${extendsName}. Generated scaffold - review and extend with domain-specific fields.`,
    allOf: [{ $ref: `#${extendsRef}` }],
    properties: {},
    inputForm: {
      priority1: ['businessName', 'contact.phone', 'contact.email'],
      priority2: ['location.address', 'location.city', 'services'],
      priority3: ['branding.logoUrl', 'team', 'seo.googleBusinessProfileUrl']
    }
  };

  return JSON.stringify(schema, null, 2);
}

function writeSchema(id: string, content: string): void {
  const filename = `${id}.schema.json`;
  const filepath = join(SCHEMAS_DIR, filename);

  if (options.dryRun) {
    console.log(`[DRY-RUN] Would create: ${filepath}`);
    console.log(content);
    console.log('---');
    return;
  }

  try {
    writeFileSync(filepath, `${content}\n`, 'utf-8');
    console.log(`✓ Created: ${filename}`);
  } catch (err) {
    error(`Failed to write ${filename}: ${(err as Error).message}`);
  }
}

function main(): void {
  console.log('🏗️  Schema Scaffold Generator\n');

  const registry = loadRegistryEntries();
  const schemas = loadExistingSchemas();

  const missing = findMissingSchemas(registry, schemas);

  if (missing.length === 0) {
    console.log('✓ All registry entries have schemas. Nothing to generate.');
    return;
  }

  console.log(`\nFound ${missing.length} registry entries missing schemas.\n`);

  for (const id of missing) {
    const entry = registry.get(id);
    if (!entry) {
      console.warn(`⚠ Warning: Registry entry ${id} not found (should not happen)`);
      continue;
    }

    const schema = generateSchema(entry, schemas);
    writeSchema(id, schema);
  }

  console.log(`\n✓ Generated ${missing.length} schema scaffolds.`);

  if (!options.dryRun) {
    console.log('\nNext steps:');
    console.log('1. Review generated schemas in src/schemas/');
    console.log('2. Add domain-specific properties to properties object');
    console.log('3. Update inputForm priority levels for your use case');
    console.log('4. Commit scaffolds to version control');
  }
}

main();
