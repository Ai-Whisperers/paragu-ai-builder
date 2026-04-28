import { NextResponse } from 'next/server'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function notFound(message = 'not_found') {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function conflict(message: string) {
  return NextResponse.json({ error: message }, { status: 409 })
}

export function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : 'internal_error'
  return NextResponse.json({ error: message }, { status: 500 })
}

export function validation(detail: unknown) {
  return NextResponse.json({ error: 'validation', detail }, { status: 400 })
}
