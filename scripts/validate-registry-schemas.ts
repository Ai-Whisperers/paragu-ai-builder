#!/usr/bin/env node

/**
 * Schema Validation Check
 *
 * Validates that every registry entry has a corresponding schema file.
 * Fails CI if any registry entry is missing a schema.
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const REGISTRY_DIR = join(process.cwd(), 'src', 'registry');
const SCHEMAS_DIR = join(process.cwd(), 'src', 'schemas');

function error(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function log(message) {
  console.log(`✓ ${message}`);
}

function loadRegistryEntries() {
  const entries = [];
  const files = readdirSync(REGISTRY_DIR)
    .filter(f => f.endsWith('.type.json') && f !== 'index.json');

  for (const file of files) {
    try {
      const path = join(REGISTRY_DIR, file);
      const content = JSON.parse(readFileSync(path, 'utf-8'));
      entries.push({ id: content.id, file });
    } catch (err) {
      error(`Failed to load ${file}: ${err.message}`);
    }
  }

  return entries;
}

function loadExistingSchemas() {
  const schemas = new Set();
  const files = readdirSync(SCHEMAS_DIR)
    .filter(f => f.endsWith('.schema.json'));

  for (const file of files) {
    try {
      const path = join(SCHEMAS_DIR, file);
      const content = JSON.parse(readFileSync(path, 'utf-8'));
      schemas.add(content.$id || file.replace('.schema.json', ''));
    } catch (err) {
      error(`Failed to load schema ${file}: ${err.message}`);
    }
  }

  return schemas;
}

function validateSchemas() {
  console.log('🔍 Validating registry entries have schemas...\n');

  const registry = loadRegistryEntries();
  const schemas = loadExistingSchemas();
  const missing = [];

  for (const entry of registry) {
    if (!schemas.has(entry.id)) {
      missing.push(entry);
    }
  }

  if (missing.length === 0) {
    log(`All ${registry.length} registry entries have schemas.`);
    return;
  }

  console.error(`\n❌ Found ${missing.length} registry entries missing schemas:\n`);

  for (const entry of missing) {
    console.error(`  - ${entry.id} (${entry.file})`);
  }

  console.error('\nRun: node scripts/schemas/scaffold-missing.ts');
  error(`CI failed: ${missing.length} entries missing schemas`);
}

validateSchemas();
