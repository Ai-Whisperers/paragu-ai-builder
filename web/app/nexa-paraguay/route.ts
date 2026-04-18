/**
 * Nexa Paraguay - Redirect any route to tenant site
 */
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export function GET() {
  return redirect('/s/nl/nexa-paraguay')
}