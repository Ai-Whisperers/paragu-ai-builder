#!/usr/bin/env node
/**
 * Pre-Build Validation Script
 * 
 * Implements the bug prevention patterns discovered from past fixes
 * Run this BEFORE attempting any build to catch issues early
 */

const fs = require('fs')
const path = require('path')

// Terminal colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// ============================================================================
// Validation Rules Based on Past Bug Patterns
// ============================================================================

const VALIDATION_RULES = {
  // Rule 1: Check for duplicate JSON keys
  duplicateKeys: {
    id: 'duplicate-keys',
    severity: 'ERROR',
    description: 'JSON files must not have duplicate keys (second overwrites first)',
    check: (content, filePath) => {
      const lines = content.split('\n')
      const keyStack = []
      const errors = []
      
      lines.forEach((line, idx) => {
        const keyMatch = line.match(/^\s*"([^"]+)"\s*:/)
        if (keyMatch) {
          const key = keyMatch[1]
          const currentLevel = line.match(/^\s*/)[0].length
          
          // Find parent context
          while (keyStack.length > 0 && keyStack[keyStack.length - 1].indent >= currentLevel) {
            keyStack.pop()
          }
          
          const context = keyStack.map(k => k.key).join('.')
          const fullKey = context ? `${context}.${key}` : key
          
          // Check if this key already exists at this level
          const existing = keyStack.find(k => k.key === key && k.indent === currentLevel)
          if (existing) {
            errors.push({
              line: idx + 1,
              key: fullKey,
              message: `Duplicate key "${key}" at line ${idx + 1}`
            })
          }
          
          keyStack.push({ key, indent: currentLevel, line: idx + 1 })
        }
      })
      
      return errors
    }
  },

  // Rule 2: Check for missing braces/brackets
  syntaxValidation: {
    id: 'syntax-validation',
    severity: 'ERROR',
    description: 'JSON must have balanced braces and brackets',
    check: (content, filePath) => {
      const errors = []
      const stack = []
      const pairs = { '{': '}', '[': ']', '}': '{', ']': '[' }
      
      const lines = content.split('\n')
      
      lines.forEach((line, idx) => {
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          
          if (char === '{' || char === '[') {
            stack.push({ char, line: idx + 1, col: i + 1 })
          } else if (char === '}' || char === ']') {
            if (stack.length === 0) {
              errors.push({
                line: idx + 1,
                message: `Unexpected closing ${char} at line ${idx + 1}, col ${i + 1}`
              })
            } else {
              const last = stack.pop()
              if (pairs[char] !== last.char) {
                errors.push({
                  line: idx + 1,
                  message: `Mismatched braces: ${last.char} at line ${last.line} closed with ${char} at line ${idx + 1}`
                })
              }
            }
          }
        }
      })
      
      if (stack.length > 0) {
        stack.forEach(item => {
          errors.push({
            line: item.line,
            message: `Unclosed ${item.char} at line ${item.line}, col ${item.col}`
          })
        })
      }
      
      return errors
    }
  },

  // Rule 3: Check required content structure
  contentStructure: {
    id: 'content-structure',
    severity: 'WARNING',
    description: 'Required content fields should be present',
    check: (content, filePath) => {
      const errors = []
      
      try {
        const data = JSON.parse(content)
        
        // Check for site content (not vertical or registry)
        if (filePath.includes('/sites/') && filePath.includes('/content/')) {
          // Required top-level fields
          if (!data.siteName) {
            errors.push({ line: 1, message: 'Missing required field: siteName' })
          }
          if (!data.navigation) {
            errors.push({ line: 1, message: 'Missing required field: navigation' })
          }
          
          // Check home sections if present
          if (data.home) {
            // Services format check
            if (data.home.programs && !data.home.programs.tiers) {
              errors.push({
                line: 1,
                message: 'home.programs exists but missing tiers array (will cause .map() error)',
                hint: 'Add tiers: [{ id: "basic", name: "Basic", included: [], ctaLabel: "...", ctaHref: "..." }]'
              })
            }
            
            // Testimonials check
            if (data.home.testimonials && !data.home.testimonials.testimonials) {
              errors.push({
                line: 1,
                message: 'home.testimonials exists but missing testimonials array',
                hint: 'Add testimonials: [{ quote: "...", author: "...", role: "...", rating: 5 }]'
              })
            }
            
            // Process steps check
            if (data.home.process && !data.home.process.steps) {
              errors.push({
                line: 1,
                message: 'home.process exists but missing steps array',
                hint: 'Add steps: [{ number: 1, title: "...", description: "..." }]'
              })
            }
          }
          
          // Check servicesPage formats
          if (data.servicesPage && data.servicesPage.services) {
            const svcs = data.servicesPage.services
            // Check for nested format
            if (!Array.isArray(svcs) && svcs.services && !Array.isArray(svcs.services)) {
              errors.push({
                line: 1,
                message: 'servicesPage.services.services should be an array',
                hint: 'Ensure nested services is an array'
              })
            }
          }
        }
      } catch (e) {
        // JSON parse error will be caught by syntax validation
      }
      
      return errors
    }
  },

  // Rule 4: Check for common antipatterns
  antipatterns: {
    id: 'antipatterns',
    severity: 'WARNING',
    description: 'Common content structure issues',
    check: (content, filePath) => {
      const errors = []
      
      // Check for 'items' instead of 'services' in services sections
      if (content.includes('"items"') && filePath.includes('services')) {
        errors.push({
          line: 1,
          message: 'Found "items" key - should be "services" for consistency',
          hint: 'Rename "items" to "services" or update builder to handle both'
        })
      }
      
      // Check for empty arrays that might cause issues
      const emptyArrayMatches = content.match(/"\w+":\s*\[\s*\]/g)
      if (emptyArrayMatches && filePath.includes('/sites/')) {
        emptyArrayMatches.forEach(match => {
          errors.push({
            line: 1,
            message: `Empty array found: ${match} - sections may return null`,
            hint: 'Add sample data or remove section from page config'
          })
        })
      }
      
      return errors
    }
  }
}

// ============================================================================
// Validation Engine
// ============================================================================

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const results = []
  
  Object.values(VALIDATION_RULES).forEach(rule => {
    const errors = rule.check(content, filePath)
    if (errors.length > 0) {
      results.push({
        rule: rule.id,
        severity: rule.severity,
        description: rule.description,
        errors
      })
    }
  })
  
  return results
}

function findJsonFiles(dir) {
  const files = []
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    
    entries.forEach(entry => {
      const fullPath = path.join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        // Skip node_modules and .next
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          walk(fullPath)
        }
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(fullPath)
      }
    })
  }
  
  walk(dir)
  return files
}

// ============================================================================
// Main Execution
// ============================================================================

function main() {
  log('\n🔍 PRE-BUILD VALIDATION SUITE', 'blue')
  log('=============================\n', 'blue')
  
  const rootDir = process.cwd()
  const jsonFiles = findJsonFiles(rootDir)
  
  log(`Found ${jsonFiles.length} JSON files to validate\n`)
  
  let totalErrors = 0
  let totalWarnings = 0
  const filesWithIssues = []
  
  jsonFiles.forEach((filePath, idx) => {
    // Only check sites and src directories
    if (!filePath.includes('/sites/') && !filePath.includes('/src/')) {
      return
    }
    
    const relativePath = path.relative(rootDir, filePath)
    const results = validateFile(filePath)
    
    if (results.length > 0) {
      filesWithIssues.push({ file: relativePath, results })
      
      results.forEach(result => {
        if (result.severity === 'ERROR') totalErrors++
        if (result.severity === 'WARNING') totalWarnings++
      })
    }
  })
  
  // Report results
  if (filesWithIssues.length === 0) {
    log('✅ All validation checks passed!', 'green')
    log(`\n${jsonFiles.length} files validated successfully\n`)
    process.exit(0)
  } else {
    log(`❌ Found issues in ${filesWithIssues.length} files:\n`, 'red')
    
    filesWithIssues.forEach(({ file, results }) => {
      log(`📄 ${file}`, 'yellow')
      log('─'.repeat(50))
      
      results.forEach(result => {
        const color = result.severity === 'ERROR' ? 'red' : 'yellow'
        log(`  [${result.severity}] ${result.description}`, color)
        
        result.errors.forEach(error => {
          log(`    → Line ${error.line}: ${error.message}`, color)
          if (error.hint) {
            log(`      💡 ${error.hint}`, 'blue')
          }
        })
      })
      
      log('')
    })
    
    log('─'.repeat(50))
    log(`\nSummary:`, 'blue')
    log(`  Errors: ${totalErrors}`, totalErrors > 0 ? 'red' : 'green')
    log(`  Warnings: ${totalWarnings}`, totalWarnings > 0 ? 'yellow' : 'green')
    
    if (totalErrors > 0) {
      log('\n❌ Fix errors before building\n', 'red')
      process.exit(1)
    } else {
      log('\n⚠️  Warnings present but build may succeed\n', 'yellow')
      process.exit(0)
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

module.exports = { validateFile, VALIDATION_RULES }
