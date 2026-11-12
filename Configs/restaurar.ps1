# =====================================================================
#  restaurar.ps1  -  coloca de volta as configuracoes salvas em Configs/obsidian
#
#  FECHE O OBSIDIAN ANTES. Uso:
#     powershell -ExecutionPolicy Bypass -File .\restaurar.ps1
#
#  - Se ja existir um .obsidian no vault, ele vira .obsidian.antes-AAAAMMDD-HHMM
#    (nada e perdido).
#  - Depois e so abrir o Obsidian, confiar no vault ("Trust author and enable
#    plugins") e reiniciar uma vez.
# =====================================================================
param(
    [string]$Vault = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)
$ErrorActionPreference = "Stop"

$origem  = Join-Path $PSScriptRoot "obsidian"
$destino = Join-Path $Vault ".obsidian"
if (-not (Test-Path $origem)) { throw "Nao achei $origem. Rode o backup.ps1 antes (ou baixe o repositorio)." }

if (Get-Process -Name "Obsidian" -ErrorAction SilentlyContinue) {
    throw "O Obsidian esta aberto. Feche-o e rode de novo (senao ele sobrescreve as configs ao fechar)."
}

Write-Host "Restaurando para: $destino"
if (Test-Path $destino) {
    $copia = "$destino.antes-" + (Get-Date -Format "yyyyMMdd-HHmm")
    Move-Item $destino $copia
    Write-Host "Configuracao atual guardada em: $copia" -ForegroundColor Yellow
}

$null = robocopy $origem $destino /E /NFL /NDL /NJH /NJS /NP
if ($LASTEXITCODE -ge 8) { throw "robocopy falhou (codigo $LASTEXITCODE)" }

Write-Host ""
Write-Host "Pronto! Agora:" -ForegroundColor Green
Write-Host "  1. Abra o Obsidian e abra a pasta do vault: $Vault"
Write-Host "  2. Clique em 'Trust author and enable plugins'"
Write-Host "  3. Instale os plugins da loja listados em Configs\Extensoes.md (cada um tem o link)"
Write-Host "  4. Configuracoes > Aparencia: reinstale o tema (ex.: AnuPpuccin)"
Write-Host "  5. Feche e abra o Obsidian de novo"
Write-Host "  6. Reconfigure o que tinha senha/token (o backup apaga esses valores)"
