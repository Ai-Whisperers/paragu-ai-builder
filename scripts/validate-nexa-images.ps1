$ErrorActionPreference = 'Stop'

$manifestPath = Join-Path $PSScriptRoot '..\sites\nexa-paraguay\images.json'
$raw = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8

try {
  $json = $raw | ConvertFrom-Json
} catch {
  Write-Error ("images.json is not valid JSON: " + $_.Exception.Message)
  exit 1
}

function Get-ImageSrcValues {
  param(
    [Parameter(Mandatory = $true)]
    $Node
  )

  $out = @()

  if ($null -eq $Node) {
    return $out
  }

  if ($Node -is [System.Collections.IDictionary]) {
    foreach ($k in $Node.Keys) {
      if ($k -eq 'src' -and $Node[$k] -is [string]) {
        $out += $Node[$k]
      } else {
        $out += Get-ImageSrcValues -Node $Node[$k]
      }
    }
    return $out
  }

  if ($Node -is [System.Collections.IEnumerable] -and -not ($Node -is [string])) {
    foreach ($item in $Node) {
      $out += Get-ImageSrcValues -Node $item
    }
    return $out
  }

  foreach ($p in $Node.PSObject.Properties) {
    if ($p.Name -eq 'src' -and $p.Value -is [string]) {
      $out += $p.Value
    } else {
      $out += Get-ImageSrcValues -Node $p.Value
    }
  }

  return $out
}

$refs = Get-ImageSrcValues -Node $json | Where-Object { $_ -like '/sites/nexa-paraguay/images/*' } | Sort-Object -Unique

$missing = @()
foreach ($r in $refs) {
  $disk = ($r -replace '^/', '') -replace '/', '\'
  if (-not (Test-Path -LiteralPath $disk)) {
    $missing += $r
  }
}

Write-Host "images.json JSON: OK"
Write-Host ("Referenced image paths: " + $refs.Count)
Write-Host ("Missing on disk: " + $missing.Count)

if ($missing.Count -gt 0) {
  $missing | ForEach-Object { Write-Host ("  " + $_) }
  exit 2
}

exit 0

