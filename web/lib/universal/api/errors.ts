export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMITED = 'RATE_LIMITED',
  CONFLICT = 'CONFLICT',
  DB_NOT_CONFIGURED = 'DB_NOT_CONFIGURED',
  STRIPE_NOT_CONFIGURED = 'STRIPE_NOT_CONFIGURED',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  MISSING_FIELDS = 'MISSING_FIELDS',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

export interface ApiErrorResponse {
  ok: false
  code: string
  message: string
  error: string
  timestamp: string
  details?: unknown
}

export function apiError(code: string, message: string, details?: unknown): ApiErrorResponse {
  return {
    ok: false,
    code,
    message,
    error: message,
    timestamp: new Date().toISOString(),
    ...(details !== undefined && { details }),
  }
}

export function isApiErrorCode(val: string): val is ApiErrorCode {
  return Object.values(ApiErrorCode).includes(val as ApiErrorCode)
}