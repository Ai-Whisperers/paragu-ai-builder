const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const hostname = '0.0.0.0'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)

      // Handle static assets MIME type
      if (parsedUrl.pathname.match(/\.(js|css|woff2?|ttf|eot|otf)$/)) {
        const ext = parsedUrl.pathname.split('.').pop()

        const contentTypes = {
          'js': 'application/javascript; charset=utf-8',
          'css': 'text/css; charset=utf-8',
          'woff': 'font/woff',
          'woff2': 'font/woff2',
          'ttf': 'font/ttf',
          'eot': 'application/vnd.ms-fontobject',
          'otf': 'font/otf',
        }

        if (ext && contentTypes[ext]) {
          res.setHeader('Content-Type', contentTypes[ext])
        }
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})