# Copy Granja Cabral generated images from Cursor project asset cache into sites/granja-cabral/images/<category>/
# Run from repo root: pwsh scripts/copy-granja-cabral-images.ps1

$ErrorActionPreference = "Stop"

$cache = "C:\Users\kyrian\.cursor\projects\c-Users-kyrian-Documents-Work-AI-whisperer-repos-paragu-ai-builder\assets"
$dest  = Join-Path $PSScriptRoot ".." | Resolve-Path
$dest  = Join-Path $dest "sites\granja-cabral\images"

# Map: cache filename -> relative destination path under sites/granja-cabral/images/
$map = @{
    "gc-hero-bg.png"                     = "hero\hero-bg.png"
    "gc-hero-bg-mobile.png"              = "hero\hero-bg-mobile.png"

    "gc-trust-farm-exterior.png"         = "trust\farm-exterior.png"
    "gc-trust-quality-closeup.png"       = "trust\quality-closeup.png"
    "gc-trust-delivery.png"              = "trust\delivery.png"

    "gc-product-huevo-unidad.png"        = "products\huevo-unidad.png"
    "gc-product-bandeja-12.png"          = "products\bandeja-12.png"
    "gc-product-maple-30.png"            = "products\maple-30.png"
    "gc-product-pollo-entero.png"        = "products\pollo-entero.png"
    "gc-product-pollito-tierno.png"      = "products\pollito-tierno.png"
    "gc-product-fertilizante.png"        = "products\fertilizante.png"
    "gc-product-delivery.png"            = "products\delivery.png"
    "gc-product-mayorista.png"           = "products\mayorista.png"
    "gc-product-pedidos-programados.png" = "products\pedidos-programados.png"

    "gc-story-owner.png"                 = "story\owner.png"
    "gc-story-hens.png"                  = "story\hens.png"
    "gc-story-sustainability.png"        = "story\sustainability.png"

    "gc-process-recoleccion.png"         = "process\recoleccion.png"
    "gc-process-seleccion.png"           = "process\seleccion.png"
    "gc-process-empaque.png"             = "process\empaque.png"
    "gc-process-entrega.png"             = "process\entrega.png"

    "gc-b2b-hero.png"                    = "b2b\hero.png"
    "gc-b2b-panaderia.png"               = "b2b\panaderia.png"
    "gc-b2b-restaurante.png"             = "b2b\restaurante.png"
    "gc-b2b-supermercado.png"            = "b2b\supermercado.png"

    "gc-recipe-chipa-guasu.png"          = "recipes\chipa-guasu.png"
    "gc-recipe-sopa-paraguaya.png"       = "recipes\sopa-paraguaya.png"
    "gc-recipe-tortilla.png"             = "recipes\tortilla.png"
    "gc-recipe-flan-casero.png"          = "recipes\flan-casero.png"
    "gc-recipe-milanesa.png"             = "recipes\milanesa.png"
    "gc-recipe-pastel-mandioca.png"      = "recipes\pastel-mandioca.png"

    "gc-gallery-coop.png"                = "gallery\coop.png"
    "gc-gallery-eggs-sorted.png"         = "gallery\eggs-sorted.png"
    "gc-gallery-farm-morning.png"        = "gallery\farm-morning.png"
    "gc-gallery-baskets.png"             = "gallery\baskets.png"

    "gc-testimonial-maria.png"           = "testimonials\maria.png"
    "gc-testimonial-jose.png"            = "testimonials\jose.png"
    "gc-testimonial-restaurant.png"      = "testimonials\restaurant.png"

    "gc-og-default.png"                  = "brand\og-default.png"
}

$copied = 0
$missing = @()

foreach ($src in $map.Keys) {
    $srcPath = Join-Path $cache $src
    $dstRel  = $map[$src]
    $dstPath = Join-Path $dest $dstRel

    if (-not (Test-Path $srcPath)) {
        $missing += $src
        continue
    }

    $dstDir = Split-Path -Parent $dstPath
    if (-not (Test-Path $dstDir)) {
        New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
    }

    Copy-Item -Force -Path $srcPath -Destination $dstPath
    $copied++
}

Write-Host "Copied $copied / $($map.Count) files to $dest" -ForegroundColor Green
if ($missing.Count -gt 0) {
    Write-Host "Missing source files:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    exit 1
}
