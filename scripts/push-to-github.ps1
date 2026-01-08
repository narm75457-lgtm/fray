<#
.SYNOPSIS
  Inicializa repo Git si hace falta, crea commit y empuja a remoto.

.PARAMETER RemoteUrl
  URL del remote (por defecto https://github.com/narm75457-lgtm/fray.git)

USAGE
  .\scripts\push-to-github.ps1
  .\scripts\push-to-github.ps1 -RemoteUrl "https://github.com/user/repo.git"
#>

[CmdletBinding()]
param(
  [string]$RemoteUrl = 'https://github.com/narm75457-lgtm/fray.git'
)

function Fail($msg) { Write-Host $msg -ForegroundColor Red; exit 1 }

Write-Host "Running git push helper..."

try {
  git --version > $null 2>&1
} catch {
  Fail 'git no está disponible en este entorno. Instala Git y vuelve a ejecutar este script localmente.'
}

if (!(Test-Path .git)) {
  Write-Host 'No hay repo Git. Inicializando...'
  git init || Fail 'git init falló'
}

$hasHead = $false
try {
  git rev-parse --verify HEAD > $null 2>&1; if ($LASTEXITCODE -eq 0) { $hasHead = $true }
} catch {}

if (-not $hasHead) {
  Write-Host 'Creando primer commit...'
  git add -A || Fail 'git add falló'
  git commit -m "chore: initial commit" || Fail 'git commit falló. Asegúrate de configurar user.name/user.email con git config.'
}

Write-Host 'Creando/renombrando rama a main...'
git branch -M main || Fail 'git branch -M main falló'

if (git remote | Select-String -Pattern '^origin$') {
  Write-Host 'Actualizando URL de origin...'
  git remote set-url origin $RemoteUrl || Fail 'git remote set-url falló'
} else {
  Write-Host 'Añadiendo remote origin...'
  git remote add origin $RemoteUrl || Fail 'git remote add origin falló'
}

Write-Host "Empujando a origin/main..."
git push -u origin main || Fail 'git push falló. Revisa credenciales.'

Write-Host 'Push completado.' -ForegroundColor Green
