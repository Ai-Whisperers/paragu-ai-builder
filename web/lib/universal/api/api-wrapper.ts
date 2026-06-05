import { NextRequest, NextResponse } from "next/server"
import { apiError } from "./errors"

export function withApiAuth(
  handler: (request: NextRequest, context?: { params?: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: { params?: Promise<Record<string, string>> }) => {
    const cookieHeader = request.headers.get("cookie") || ""
    const cookies: Record<string, string> = {}
    for (const pair of cookieHeader.split(";")) {
      const [key, ...val] = pair.trim().split("=")
      if (key) cookies[key] = val.join("=")
    }

    const adminSession = cookies["admin_session"]
    if (!adminSession) {
      return NextResponse.json(
        apiError("UNAUTHORIZED", "No autenticado"),
        { status: 401 }
      )
    }

    const { verifyToken } = await import("@/lib/auth/admin-auth")
    const payload = await verifyToken(adminSession)
    if (!payload) {
      return NextResponse.json(
        apiError("UNAUTHORIZED", "Sesión inválida o expirada"),
        { status: 401 }
      )
    }

    return handler(request, context)
  }
}