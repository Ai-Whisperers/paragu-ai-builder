$ErrorActionPreference = 'Stop'

$required = @(
  'web/public/logo.png',
  'web/public/logo.svg',
  'web/public/logo-mark.png',
  'web/public/logo-mark.svg',
  'web/public/favicon.ico',
  'web/public/favicon-16x16.png',
  'web/public/favicon-32x32.png',
  'web/public/apple-touch-icon.png',
  'web/public/android-chrome-192x192.png',
  'web/public/android-chrome-512x512.png',
  'web/public/safari-pinned-tab.svg',
  'web/public/site.webmanifest',
  'web/public/og-default.png'
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "Missing platform assets:"
  $missing | ForEach-Object { Write-Host ("  " + $_) }
  exit 2
}

$layout = Get-Content -LiteralPath 'web/app/layout.tsx' -Raw -Encoding UTF8

$mustContain = @(
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/opengraph-image",
  "/og-default.png"
)

$layoutMissing = @()
foreach ($s in $mustContain) {
  if ($layout -notmatch [regex]::Escape($s)) {
    $layoutMissing += $s
  }
}

if ($layoutMissing.Count -gt 0) {
  Write-Host "layout.tsx is missing references:"
  $layoutMissing | ForEach-Object { Write-Host ("  " + $_) }
  exit 3
}

Write-Host "Platform assets: OK"
exit 0

