# VS Code Snippets

Useful code snippets for working with Paragu-AI Builder.

## Installation

1. Open VS Code
2. Press `Ctrl/Cmd + Shift + P`
3. Type "Preferences: Configure User Snippets"
4. Select `paragu-ai-builder.code-snippets`

Or copy these to `.vscode/paragu-ai.code-snippets` in your workspace.

## Snippets

### React Components

#### Section Component

```json
{
  "Section Component": {
    "prefix": "section",
    "description": "Create a new section component",
    "body": [
      "export interface ${1:Name}SectionProps {",
      "  title: string",
      "  $2",
      "}",
      "",
      "export function ${1:Name}Section({ title, $3 }: ${1:Name}SectionProps) {",
      "  return (",
      "    <section className=\"py-16 bg-[var(--surface)]\">",
      "      <div className=\"max-w-6xl mx-auto px-4\">",
      "        <h2 className=\"text-3xl font-bold text-[var(--text)]\">{title}</h2>",
      "        $0",
      "      </div>",
      "    </section>",
      "  )",
      "}"
    ]
  }
}
```

#### UI Component with CVA

```json
{
  "CVA Component": {
    "prefix": "cva-component",
    "description": "Create a CVA-based UI component",
    "body": [
      "import { cva, type VariantProps } from 'class-variance-authority'",
      "import { cn } from '@/lib/utils'",
      "",
      "const ${1:component}Variants = cva(",
      "  'base-classes',",
      "  {",
      "    variants: {",
      "      variant: {",
      "        default: '',",
      "        primary: '',",
      "      },",
      "      size: {",
      "        default: '',",
      "        sm: '',",
      "        lg: '',",
      "      },",
      "    },",
      "    defaultVariants: {",
      "      variant: 'default',",
      "      size: 'default',",
      "    },",
      "  }",
      ")",
      "",
      "export interface ${2:Name}Props",
      "  extends VariantProps<typeof ${1:component}Variants> {",
      "  children: React.ReactNode",
      "}",
      "",
      "export function ${2:Name}({ variant, size, children }: ${2:Name}Props) {",
      "  return (",
      "    <div className={cn(${1:component}Variants({ variant, size }))}>",
      "      {children}",
      "    </div>",
      "  )",
      "}"
    ]
  }
}
```

### Hooks

#### Custom Hook

```json
{
  "Custom Hook": {
    "prefix": "hook",
    "description": "Create a custom React hook",
    "body": [
      "import { useState, useEffect } from 'react'",
      "",
      "export function use${1:HookName}(initialValue: ${2:type}) {",
      "  const [state, setState] = useState(initialValue)",
      "",
      "  useEffect(() => {",
      "    $0",
      "  }, [])",
      "",
      "  return { state, setState }",
      "}"
    ]
  }
}
```

### Supabase

#### Server Client

```json
{
  "Supabase Server Client": {
    "prefix": "supa-server",
    "description": "Create Supabase server client",
    "body": [
      "import { createClient } from '@/lib/supabase/server'",
      "",
      "const supabase = await createClient()",
      "const { data, error } = await supabase",
      "  .from('${1:table}')",
      "  .select('*')",
      "  $0"
    ]
  }
}
```

#### Scoped Query

```json
{
  "Scoped Query": {
    "prefix": "scoped-query",
    "description": "Use business-scoped query",
    "body": [
      "import { scopedQueries } from '@/lib/supabase/scoped'",
      "",
      "const { select, insert, update } = scopedQueries(supabase, businessId)",
      "",
      "const { data, error } = await select('${1:table}', '*')"
    ]
  }
}
```

### Utilities

#### JSDoc Comment

```json
{
  "JSDoc": {
    "prefix": "jsdoc",
    "description": "Add JSDoc comment",
    "body": [
      "/**",
      " * $1",
      " * ",
      " * @param $2 - $3",
      " * @returns $4",
      " * @example",
      " * $5",
      " */"
    ]
  }
}
```

#### Logger

```json
{
  "Logger": {
    "prefix": "log",
    "description": "Add structured log",
    "body": [
      "logger.${1:info}('${2:message}', {",
      "  action: '${3:component.action}',",
      "  $0",
      "})"
    ]
  }
}
```

### Testing

#### Unit Test

```json
{
  "Unit Test": {
    "prefix": "test",
    "description": "Create unit test",
    "body": [
      "import { describe, it, expect } from 'vitest'",
      "",
      "describe('${1:Name}', () => {",
      "  it('should ${2:behavior}', () => {",
      "    $0",
      "  })",
      "})"
    ]
  }
}
```

#### Component Test

```json
{
  "Component Test": {
    "prefix": "test-component",
    "description": "Create component test",
    "body": [
      "import { render, screen } from '@testing-library/react'",
      "import { ${1:Component} } from './${2:file}'",
      "",
      "describe('${1:Component}', () => {",
      "  it('renders correctly', () => {",
      "    render(<${1:Component} ${3:props} />)",
      "    expect(screen.getByText('${4:text}')).toBeInTheDocument()",
      "  })",
      "})"
    ]
  }
}
```

### Business Types

#### Type Definition

```json
{
  "Type Definition": {
    "prefix": "type",
    "description": "Create TypeScript interface",
    "body": [
      "export interface ${1:Name} {",
      "  id: string",
      "  $0",
      "  createdAt: string",
      "  updatedAt: string",
      "}"
    ]
  }
}
```

### Database

#### Migration

```json
{
  "Migration": {
    "prefix": "migration",
    "description": "Create database migration",
    "body": [
      "-- Migration: ${1:description}",
      "-- Created: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "",
      "-- Up",
      "${0}",
      "",
      "-- Down",
      "-- ROLLBACK:"
    ]
  }
}
```

#### RLS Policy

```json
{
  "RLS Policy": {
    "prefix": "rls",
    "description": "Create RLS policy",
    "body": [
      "CREATE POLICY \"${1:policy_name}\"",
      "  ON ${2:table}",
      "  FOR ${3|SELECT,INSERT,UPDATE,DELETE,ALL|}",
      "  TO ${4:authenticated}",
      "  USING (${5:condition})",
      "  WITH CHECK (${5:condition});"
    ]
  }
}
```

## Keyboard Shortcuts

### Essential Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Shift + P` | Command palette |
| `Ctrl/Cmd + P` | Quick file open |
| `Ctrl/Cmd + Shift + F` | Global search |
| `Ctrl/Cmd + D` | Select next occurrence |
| `Ctrl/Cmd + Shift + L` | Select all occurrences |
| `F12` | Go to definition |
| `Alt + F12` | Peek definition |
| `Ctrl/Cmd + .` | Quick fix |

### Custom Shortcuts

Add to `.vscode/settings.json`:

```json
{
  "keybindings": [
    {
      "key": "ctrl+shift+t",
      "command": "workbench.action.tasks.runTask",
      "args": "typecheck"
    }
  ]
}
```
