#!/bin/bash
# OpenCode Command Router
# Place this in your project root to enable quick commands

COMMAND=$1
shift

 case $COMMAND in
  "fix-build")
    echo "🔧 Running build fix workflow..."
    npm run typecheck 2>&1 | head -50
    ;;
  
  "add-section")
    SECTION_NAME=$1
    echo "➕ Creating new section: $SECTION_NAME"
    echo "Use: Add a new section component named '$SECTION_NAME' following the hero-section.tsx pattern"
    ;;
  
  "add-business")
    BUSINESS_TYPE=$1
    echo "🏢 Adding business type: $BUSINESS_TYPE"
    echo "Use: Add new business type '$BUSINESS_TYPE' to src/registry/"
    ;;
  
  "db-migrate")
    MIGRATION_NAME=$1
    echo "🗄️  Creating migration: $MIGRATION_NAME"
    echo "Use: Create a new database migration named '$MIGRATION_NAME'"
    ;;
  
  "check-security")
    echo "🔒 Running security audit..."
    echo "Use: Check RLS policies, .env files, and security best practices"
    ;;
  
  "research")
    TOPIC=$1
    echo "🔍 Researching: $TOPIC"
    echo "Use: Research '$TOPIC' and provide comprehensive findings"
    ;;
  
  "analyze-code")
    echo "📊 Analyzing codebase..."
    echo "Use: Analyze the codebase structure and identify improvement opportunities"
    ;;
  
  *)
    echo "❓ Unknown command: $COMMAND"
    echo ""
    echo "Available commands:"
    echo "  fix-build              - Fix TypeScript/build errors"
    echo "  add-section <name>     - Add new section component"
    echo "  add-business <type>    - Add new business type"
    echo "  db-migrate <name>      - Create database migration"
    echo "  check-security         - Run security audit"
    echo "  research <topic>       - Research a topic"
    echo "  analyze-code           - Analyze codebase"
    ;;
esac
