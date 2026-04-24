import { chromium } from 'playwright'
import fs from 'fs/promises'

const BASE = 'https://paragu-ai.com'

const PAGES = [
  // superspuma
  ['ss-home',          '/s/es/superspuma'],
  ['ss-financiacion',  '/s/es/superspuma/financiacion'],
  ['ss-promociones',   '/s/es/superspuma/promociones'],
  ['ss-combos',        '/s/es/superspuma/combos'],
  ['ss-guias',         '/s/es/superspuma/guias'],
  ['ss-tiendas',       '/s/es/superspuma/tiendas'],
  ['ss-envios',        '/s/es/superspuma/envios'],
  ['ss-garantia',      '/s/es/superspuma/garantia'],
  ['ss-nosotros',      '/s/es/superspuma/nosotros'],
  ['ss-cambio',        '/s/es/superspuma/cambio'],
  ['ss-terminos',      '/s/es/superspuma/terminos'],
  ['ss-privacidad',    '/s/es/superspuma/privacidad'],
  ['ss-promo-cart',    '/s/es/superspuma/promo-cartagena'],
  // dayah
  ['d-home',           '/s/es/dayah-litworks'],
  ['d-servicios',      '/s/es/dayah-litworks/servicios'],
  ['d-catalogo',       '/s/es/dayah-litworks/catalogo'],
  ['d-portafolio',     '/s/es/dayah-litworks/portafolio'],
  ['d-sobre',          '/s/es/dayah-litworks/sobre'],
  ['d-blog',           '/s/es/dayah-litworks/blog'],
  ['d-contacto',       '/s/es/dayah-litworks/contacto'],
  ['d-terminos',       '/s/es/dayah-litworks/terminos'],
  ['d-privacidad',     '/s/es/dayah-litworks/privacidad'],
]

const OUT = '/tmp/shots'
await fs.mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })

for (const [name, path] of PAGES) {
  for (const [viewport, size] of [['desktop', { width: 1440, height: 900 }]]) {
    const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const url = `${BASE}${path}?_v=${Date.now()}`
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(1200)
      const file = `${OUT}/${name}-${viewport}.png`
      await page.screenshot({ path: file, fullPage: true })
      const stat = await fs.stat(file)
      console.log(`${name} ${viewport}  ${path}  ${(stat.size/1024).toFixed(0)}kb`)
    } catch (e) {
      console.log(`${name} ${viewport}  ERR  ${e.message}`)
    } finally {
      await ctx.close()
    }
  }
}

await browser.close()
