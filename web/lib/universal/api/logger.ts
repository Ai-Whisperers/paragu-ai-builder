import crypto from "crypto"

const LOG_FORMAT = process.env.LOG_FORMAT || "text"
const SERVICE_NAME = "site-template"

function getTraceId(): string {
  return crypto.randomUUID()
}

function formatJson(level: string, message: string, data?: Record<string, unknown>): string {
  const entry = {
    "@timestamp": new Date().toISOString(),
    level,
    message,
    service: SERVICE_NAME,
    traceId: getTraceId(),
    ...data,
  }
  return JSON.stringify(entry)
}

function formatText(level: string, message: string, data?: Record<string, unknown>): string {
  const parts = [`[${new Date().toISOString()}]`, `[${level.toUpperCase()}]`, message]
  if (data && Object.keys(data).length > 0) {
    parts.push(JSON.stringify(data))
  }
  return parts.join(" ")
}

export function log(
  level: "debug" | "info" | "warn" | "error",
  message: string,
  data?: Record<string, unknown>
): void {
  const formatted =
    LOG_FORMAT === "json" ? formatJson(level, message, data) : formatText(level, message, data)

  switch (level) {
    case "debug":
      console.debug(formatted)
      break
    case "info":
      console.info(formatted)
      break
    case "warn":
      console.warn(formatted)
      break
    case "error":
      console.error(formatted)
      break
    default:
      console.log(formatted)
  }
}

export const info = (msg: string, data?: Record<string, unknown>) => log("info", msg, data)
export const warn = (msg: string, data?: Record<string, unknown>) => log("warn", msg, data)
export const error = (msg: string, data?: Record<string, unknown>) => log("error", msg, data)
export const debug = (msg: string, data?: Record<string, unknown>) => log("debug", msg, data)