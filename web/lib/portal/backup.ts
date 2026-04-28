import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

const TABLES_TO_BACKUP = [
  'businesses', 'leads', 'subscriptions', 'payments', 'bookings',
  'orders', 'order_items', 'products', 'site_leads', 'tenant_users',
  'tenant_notes', 'portal_notifications', 'analytics_events',
]

export async function runDatabaseBackup(): Promise<{ ok: boolean; tablesCount: number; error?: string }> {
  const supabase = await createClient('service_role')
  let tablesCount = 0
  const backupDir = '/tmp/paraguai-backup'

  try {
    const fs = await import('fs/promises')
    const path = await import('path')

    await fs.mkdir(backupDir, { recursive: true })

    for (const table of TABLES_TO_BACKUP) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(10000)
        if (error) {
          if (error.message.includes('does not exist')) continue
          logger.warn('[backup] table skip', { table, error: error.message })
          continue
        }
        const filePath = path.join(backupDir, `${table}.json`)
        await fs.writeFile(filePath, JSON.stringify({ table, exportedAt: new Date().toISOString(), rows: data ?? [] }, null, 2))
        tablesCount++
      } catch (err) {
        logger.warn('[backup] table failed', { table, error: String(err) })
      }
    }

    const { execSync } = await import('child_process')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const archivePath = `/tmp/paraguai-backup-${timestamp}.tar.gz`
    execSync(`tar -czf ${archivePath} -C /tmp paraguai-backup`, { timeout: 30000 })

    return { ok: true, tablesCount }
  } catch (err) {
    logger.error('[backup] failed', { error: String(err) })
    return { ok: false, tablesCount, error: String(err) }
  }
}
