#!/usr/bin/env python3
"""
Technical Debt Cleanup Script
Removes console.log statements and categorizes TODOs
"""

import os
import re
import sys
from pathlib import Path

WEB_DIR = Path("/home/ai-whisperers/paragu-ai-builder/web")

# Patterns to match
CONSOLE_LOG_PATTERN = re.compile(r'\s*console\.(log|debug|info|warn|error)\s*\([^)]*\)\s*;?', re.MULTILINE)
TODO_PATTERN = re.compile(r'\s*(//|/\*)\s*(TODO|FIXME|XXX)[\s:]*(.+?)(?:\*/)?$', re.MULTILINE | re.IGNORECASE)

# Files to exclude (libs, generated, etc.)
EXCLUDE_PATTERNS = [
    'node_modules',
    '.next',
    'dist',
    'build',
    '__tests__',
    '*.test.ts',
    '*.test.tsx',
    '*.spec.ts',
]

def should_exclude(filepath):
    """Check if file should be excluded from cleanup"""
    path_str = str(filepath)
    for pattern in EXCLUDE_PATTERNS:
        if pattern in path_str:
            return True
    return False

def remove_console_logs(content, filepath):
    """Remove console.log statements from content"""
    original_lines = content.count('\n')
    cleaned = CONSOLE_LOG_PATTERN.sub('', content)
    removed_lines = original_lines - cleaned.count('\n')
    return cleaned, removed_lines

def process_file(filepath):
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_length = len(content)
        
        # Remove console logs
        cleaned, removed_logs = remove_console_logs(content, filepath)
        
        if removed_logs > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f"✅ {filepath.relative_to(WEB_DIR)}: Removed {removed_logs} console statements")
            return removed_logs
        return 0
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return 0

def main():
    print("🔧 Starting technical debt cleanup...\n")
    
    total_removed = 0
    files_processed = 0
    
    # Process all TypeScript/JavaScript files
    for ext in ['*.ts', '*.tsx', '*.js', '*.jsx']:
        for filepath in WEB_DIR.rglob(ext):
            if should_exclude(filepath):
                continue
            
            files_processed += 1
            removed = process_file(filepath)
            total_removed += removed
    
    print(f"\n📊 Summary:")
    print(f"   Files processed: {files_processed}")
    print(f"   Console statements removed: {total_removed}")
    print(f"\n✨ Cleanup complete!")

if __name__ == "__main__":
    main()
