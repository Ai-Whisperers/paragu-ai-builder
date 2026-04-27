import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Middleware = (req: NextRequest, next: () => Promise<NextResponse>) => Promise<NextResponse>

export function chain(middleware: Middleware[]) {
  return async function (request: NextRequest): Promise<NextResponse> {
    let index = 0
    const next = async (): Promise<NextResponse> => {
      if (index < middleware.length) {
        return middleware[index++](request, next)
      }
      return NextResponse.next()
    }
    return next()
  }
}
