<#
  One-click deploy-zip builder for President Furniture.

  Produces:  D:\Build Files\president_furniture\<dd.MM.yyyy_hh.mmtt>\
                 president-furniture-deploy.zip
                 manifest.txt

  The zip is SOURCE ONLY -- Hostinger runs its own `npm install && npm run build`
  from it, so node_modules/.next are deliberately excluded. `.env` is excluded
  too: production env vars live in Hostinger's Web App settings, not in the zip.

  Usage:
    .\build-deploy-zip.ps1            # validate (prisma generate + tsc + next build), then zip
    .\build-deploy-zip.ps1 -NoBuild   # skip validation, just zip (~5s)
#>
param(
    [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'

$RepoRoot   = Split-Path -Parent $PSScriptRoot
$OutputRoot = 'D:\Build Files\president_furniture'
$ZipName    = 'president-furniture-deploy.zip'

# Directories/files kept out of the deploy zip.
$ExcludeDirs  = @('node_modules', '.git', '.next', '.vscode', 'Version', '.claude')
$ExcludeFiles = @('.env', '.env.local', 'tsconfig.tsbuildinfo')

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "    [WARN] $msg" -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "    [FAIL] $msg" -ForegroundColor Red }

function Pause-IfInteractive {
    # Keeps the window open on double-click, but does not break scripted/CI runs.
    if ([Environment]::UserInteractive -and -not $env:PF_BUILD_NOPAUSE) {
        try { Read-Host 'Press Enter to close' | Out-Null } catch { }
    }
}

$startedAt = Get-Date
Write-Host 'President Furniture -- deploy zip builder' -ForegroundColor White
Write-Host "Repo: $RepoRoot"

Set-Location $RepoRoot

# ---------------------------------------------------------------- validation
if (-not $NoBuild) {
    Write-Step 'Generating Prisma client'
    & npx prisma generate 2>&1 | Select-Object -Last 3
    if ($LASTEXITCODE -ne 0) { Write-Fail 'prisma generate failed'; Pause-IfInteractive; exit 1 }
    Write-Ok 'Prisma client generated'

    Write-Step 'Type-checking (tsc --noEmit)'
    & npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) { Write-Fail 'Type errors -- fix these before deploying'; Pause-IfInteractive; exit 1 }
    Write-Ok 'No type errors'

    Write-Step 'Production build (next build)'
    & npm run build 2>&1 | Select-Object -Last 12
    if ($LASTEXITCODE -ne 0) { Write-Fail 'Build failed -- fix before deploying'; Pause-IfInteractive; exit 1 }
    Write-Ok 'Build succeeded'
} else {
    Write-Warn 'Validation skipped (-NoBuild) -- zipping unverified source'
}

# ------------------------------------------------------------ output folder
$stamp   = Get-Date -Format 'dd.MM.yyyy_hh.mmtt'
$outDir  = Join-Path $OutputRoot $stamp
$zipPath = Join-Path $outDir $ZipName

# Note the newest pre-existing build folder BEFORE creating this one, so the
# migration-freshness check below compares against the previous build.
$prevBuild = Get-ChildItem -Path $OutputRoot -Directory -ErrorAction SilentlyContinue |
             Where-Object { $_.Name -notlike 'old_*' } |
             Sort-Object LastWriteTime -Descending |
             Select-Object -First 1

if (Test-Path $outDir) {
    # Same-minute rebuild: suffix so nothing is ever silently overwritten.
    $n = 2
    while (Test-Path "${outDir}_$n") { $n++ }
    $outDir  = "${outDir}_$n"
    $zipPath = Join-Path $outDir $ZipName
}
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

# ----------------------------------------------------------------- staging
Write-Step 'Staging clean copy'
$stage = Join-Path $env:TEMP "pf-deploy-stage-$(Get-Random)"
New-Item -ItemType Directory -Path $stage -Force | Out-Null

$roboArgs = @($RepoRoot, $stage, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP')
$roboArgs += '/XD'
$roboArgs += $ExcludeDirs
$roboArgs += '/XF'
$roboArgs += $ExcludeFiles
& robocopy @roboArgs | Out-Null
# robocopy: exit codes 0-7 are success (1 = files copied), >=8 is a real error.
if ($LASTEXITCODE -ge 8) {
    Write-Fail "robocopy failed (exit $LASTEXITCODE)"
    Remove-Item -Recurse -Force $stage -ErrorAction SilentlyContinue
    Pause-IfInteractive
    exit 1
}
$fileCount = (Get-ChildItem -Path $stage -Recurse -File).Count
Write-Ok "$fileCount files staged"

# --------------------------------------------------------------------- zip
Write-Step 'Compressing'
Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zipPath -CompressionLevel Optimal
Remove-Item -Recurse -Force $stage -ErrorAction SilentlyContinue
$zipMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
Write-Ok "$ZipName ($zipMb MB)"

# ---------------------------------------------------------------- manifest
Write-Step 'Writing manifest'
$commit    = (& git rev-parse --short HEAD 2>$null)
$branch    = (& git rev-parse --abbrev-ref HEAD 2>$null)
$dirty     = (& git status --porcelain 2>$null)
$dirtyNote = if ($dirty) { "YES -- $(($dirty | Measure-Object).Count) uncommitted file(s)" } else { 'no (clean tree)' }

$migrationDirs = Get-ChildItem -Path (Join-Path $RepoRoot 'prisma\migrations') -Directory -ErrorAction SilentlyContinue |
                 Sort-Object Name

$validatedNote = if ($NoBuild) { 'NO (-NoBuild: not type-checked or built)' } else { 'yes (prisma generate + tsc + next build all passed)' }

$manifest = @()
$manifest += 'President Furniture -- deploy zip manifest'
$manifest += '=========================================='
$manifest += "Built:          $($startedAt.ToString('yyyy-MM-dd HH:mm:ss'))"
$manifest += "Zip:            $ZipName ($zipMb MB, $fileCount files)"
$manifest += "Validated:      $validatedNote"
$manifest += ''
$manifest += "Git commit:     $commit"
$manifest += "Git branch:     $branch"
$manifest += "Uncommitted:    $dirtyNote"
$manifest += ''
$manifest += 'Prisma migrations included in this zip:'
foreach ($m in $migrationDirs) { $manifest += "  - $($m.Name)" }
$manifest += ''
$manifest += 'Deploy: hPanel > Websites > Web Apps > presidentfurniturebd.com > Redeploy > upload this zip.'
$manifest += 'Migrations are NOT applied by the Hostinger build -- run them yourself from local PowerShell:'
$manifest += '  $env:DATABASE_URL = "mysql://<user>:<pass>@srv1158.hstgr.io:3306/u565363010_president_db"'
$manifest += '  npx prisma migrate deploy'
$manifest += '  Remove-Item Env:\DATABASE_URL'
$manifest | Set-Content -Path (Join-Path $outDir 'manifest.txt') -Encoding UTF8
Write-Ok 'manifest.txt written'

# ------------------------------------------------- pending-migration notice
$newestMigration = $migrationDirs | Sort-Object Name -Descending | Select-Object -First 1
if ($newestMigration -and $prevBuild -and $newestMigration.LastWriteTime -gt $prevBuild.LastWriteTime) {
    Write-Host ''
    Write-Host '  ***********************************************************' -ForegroundColor Yellow
    Write-Host '  *  THIS ZIP CONTAINS A MIGRATION NEWER THAN YOUR LAST     *' -ForegroundColor Yellow
    Write-Host '  *  BUILD. Run prisma migrate deploy against production    *' -ForegroundColor Yellow
    Write-Host '  *  BACK-TO-BACK with this deploy, or the site will 500.   *' -ForegroundColor Yellow
    Write-Host '  ***********************************************************' -ForegroundColor Yellow
    Write-Host "  Newest migration: $($newestMigration.Name)" -ForegroundColor Yellow
}

# -------------------------------------------------------------------- done
$elapsed = [math]::Round(((Get-Date) - $startedAt).TotalSeconds, 0)
Write-Host ''
Write-Host "DONE in ${elapsed}s -> $zipPath" -ForegroundColor Green
Start-Process explorer.exe $outDir
Write-Host ''
Pause-IfInteractive
