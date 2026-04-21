# Validate Granja Cabral images.json + content/site references.
# - Parses all JSON files for syntax
# - Walks images.json recursively, collects every .src path
# - Scans content/es.json & site.json for image-like paths (backgroundImage, imageUrl, heroImage)
# - Reports any referenced file that does not exist on disk.

$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$tenantDir = Join-Path $root "sites\granja-cabral"

function Read-Json($path) {
    return Get-Content -Raw -LiteralPath $path | ConvertFrom-Json
}

function Get-Strings {
    param($node, [string[]]$keys)
    if ($null -eq $node) { return @() }
    $results = @()
    if ($node -is [System.Collections.IEnumerable] -and -not ($node -is [string])) {
        foreach ($item in $node) { $results += Get-Strings -node $item -keys $keys }
    }
    elseif ($node.PSObject.Properties.Count -gt 0) {
        foreach ($p in $node.PSObject.Properties) {
            if ($keys -contains $p.Name -and $p.Value -is [string]) {
                $results += $p.Value
            }
            $results += Get-Strings -node $p.Value -keys $keys
        }
    }
    return $results
}

$errors = 0
$jsonFiles = @(
    "sites\granja-cabral\images.json",
    "sites\granja-cabral\site.json",
    "sites\granja-cabral\content\es.json",
    "sites\granja-cabral\pages\home.json",
    "sites\granja-cabral\tokens.json"
)

Write-Host "== JSON syntax ==" -ForegroundColor Cyan
foreach ($rel in $jsonFiles) {
    $p = Join-Path $root $rel
    try {
        [void](Read-Json $p)
        Write-Host "  OK  $rel"
    } catch {
        Write-Host "  ERR $rel :: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "== Image references ==" -ForegroundColor Cyan

$manifest = Read-Json (Join-Path $root "sites\granja-cabral\images.json")
$content  = Read-Json (Join-Path $root "sites\granja-cabral\content\es.json")
$site     = Read-Json (Join-Path $root "sites\granja-cabral\site.json")

$refs = @()
$refs += Get-Strings -node $manifest.images -keys @("src")
$refs += Get-Strings -node $content -keys @("backgroundImage","backgroundImageMobile","imageUrl","heroImage","image")
$refs += Get-Strings -node $site.images -keys @("hero","manifest")

# Keep only paths under /sites/granja-cabral/images/ (skip /sites/granja-cabral/images.json manifest entry)
$refs = $refs | Where-Object { $_ -like "/sites/granja-cabral/*" } | Sort-Object -Unique

$missing = @()
foreach ($ref in $refs) {
    $local = Join-Path $root ($ref.TrimStart('/').Replace('/', '\'))
    if (-not (Test-Path $local)) {
        $missing += $ref
    }
}

Write-Host "  $($refs.Count) unique image references checked"
if ($missing.Count -gt 0) {
    Write-Host "  Missing:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    $errors += $missing.Count
} else {
    Write-Host "  All references resolve." -ForegroundColor Green
}

Write-Host ""
if ($errors -gt 0) {
    Write-Host "FAILED ($errors problems)" -ForegroundColor Red
    exit 1
}
Write-Host "OK" -ForegroundColor Green
