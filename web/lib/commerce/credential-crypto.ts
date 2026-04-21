import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGO = 'aes-256-gcm'

interface EncryptedField {
  iv: string  // hex
  ct: string  // hex
  tag: string // hex
}

export interface EncryptedSecrets {
  fields: Record<string, EncryptedField>
}

function getKey(): Buffer {
  const hex = process.env.COMMERCE_CREDENTIALS_KEY
  if (!hex) {
    throw new Error('COMMERCE_CREDENTIALS_KEY not set — generate with: openssl rand -hex 32')
  }
  if (hex.length !== 64) {
    throw new Error('COMMERCE_CREDENTIALS_KEY must be 64 hex chars (32 bytes / AES-256)')
  }
  return Buffer.from(hex, 'hex')
}

function encryptField(plaintext: string): EncryptedField {
  const iv = randomBytes(12) // 96-bit IV recommended for GCM
  const cipher = createCipheriv(ALGO, getKey(), iv)
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    iv: iv.toString('hex'),
    ct: ct.toString('hex'),
    tag: tag.toString('hex'),
  }
}

function decryptField(field: EncryptedField): string {
  const decipher = createDecipheriv(ALGO, getKey(), Buffer.from(field.iv, 'hex'))
  decipher.setAuthTag(Buffer.from(field.tag, 'hex'))
  const pt = Buffer.concat([
    decipher.update(Buffer.from(field.ct, 'hex')),
    decipher.final(),
  ])
  return pt.toString('utf8')
}

/** Encrypt every value in plain → store as EncryptedSecrets blob. */
export function encryptSecrets(plain: Record<string, string>): EncryptedSecrets {
  const fields: Record<string, EncryptedField> = {}
  for (const [k, v] of Object.entries(plain)) {
    fields[k] = encryptField(v)
  }
  return { fields }
}

/** Decrypt every field in blob → return plain map. Throws on auth-tag mismatch. */
export function decryptSecrets(blob: EncryptedSecrets): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(blob.fields ?? {})) {
    out[k] = decryptField(v)
  }
  return out
}

/** Returns last 4 chars of the plaintext for display ("•••• 1234"). */
export function preview(value: string | undefined): string {
  if (!value || value.length < 4) return '••••'
  return `•••• ${value.slice(-4)}`
}
