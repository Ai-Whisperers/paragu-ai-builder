import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    daily: [
      { date: '2026-05-25', deepseek: 2.34, openrouter: 0.45, claude: 0, total: 2.79 },
      { date: '2026-05-24', deepseek: 2.12, openrouter: 0.52, claude: 0, total: 2.64 },
      { date: '2026-05-23', deepseek: 1.89, openrouter: 0.41, claude: 0.12, total: 2.42 },
      { date: '2026-05-22', deepseek: 2.01, openrouter: 0.38, claude: 0, total: 2.39 },
      { date: '2026-05-21', deepseek: 2.45, openrouter: 0.55, claude: 0, total: 3.00 },
      { date: '2026-05-20', deepseek: 1.78, openrouter: 0.42, claude: 0.08, total: 2.28 },
      { date: '2026-05-19', deepseek: 2.22, openrouter: 0.48, claude: 0, total: 2.70 },
    ],
    models: {
      'deepseek-chat': { cost: 14.23, tokens: 2340000, calls: 1847 },
      'openrouter/gpt-4': { cost: 2.34, tokens: 89000, calls: 234 },
      'openrouter/claude-sonnet': { cost: 1.12, tokens: 45000, calls: 189 },
      'openrouter/gemini': { cost: 0.45, tokens: 120000, calls: 567 },
    },
    total: 19.22,
  })
}