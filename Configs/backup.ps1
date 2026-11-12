# =====================================================================
#  backup.ps1  -  copia as configuracoes do Obsidian para Configs/obsidian
#
#  Uso (PowerShell, dentro da pasta Configs ou de qualquer lugar):
#     powershell -ExecutionPolicy Bypass -File .\backup.ps1
#
#  O que guarda em Configs\obsidian:
#   - As configuracoes do Obsidian (*.json da raiz, menos workspace.json).
#   - Os snippets CSS (feitos por mim).
#   - Os MEUS plugins ($PluginsProprios): completos (codigo + configuracao).
#   - Plugins e temas da loja: NADA deles. Ficam so listados no
#     Configs\Extensoes.md, com link, pra reinstalar num PC novo.
#   - Senhas/tokens nos data.json sao APAGADOS na copia.
# =====================================================================
param(
    [string]$Vault = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)
$ErrorActionPreference = "Stop"

# Plugins feitos por mim (nao existem na loja): o codigo deles entra no backup.
# Criou outro plugin? Adicione o id dele aqui.
$PluginsProprios = @("estudos-rpg")

$origem  = Join-Path $Vault ".obsidian"
$destino = Join-Path $PSScriptRoot "obsidian"
if (-not (Test-Path $origem)) { throw "Nao achei $origem. Passe -Vault <pasta do vault>." }

Write-Host "Vault:   $Vault"
Write-Host "Origem:  $origem"
Write-Host "Destino: $destino"

function Copiar([string]$de, [string]$para, [string[]]$extra = @()) {
    $null = robocopy $de $para @extra /NFL /NDL /NJH /NJS /NP
    if ($LASTEXITCODE -ge 8) { throw "robocopy falhou ($de -> $para, codigo $LASTEXITCODE)" }
}

# Monta o backup numa pasta temporaria e depois espelha no destino
# (assim o que saiu do .obsidian, ou deixou de ser guardado, some do backup tambem).
$stage = Join-Path ([IO.Path]::GetTempPath()) ("obsidian-backup-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $stage | Out-Null
try {
    Get-ChildItem $origem -File -Filter "*.json" | Where-Object { $_.Name -notlike "workspace*" } |
        Copy-Item -Destination $stage
    if (Test-Path (Join-Path $origem "snippets")) { Copiar (Join-Path $origem "snippets") (Join-Path $stage "snippets") @("/E", "/XF", "*.bak") }

    Get-ChildItem (Join-Path $origem "plugins") -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        $alvo = Join-Path $stage "plugins\$($_.Name)"
        # Plugins da loja nao entram no backup: ficam so listados no Extensoes.md.
        if ($PluginsProprios -contains $_.Name) { Copiar $_.FullName $alvo @("/E", "/XD", "node_modules") }
    }

    Copiar $stage $destino @("/MIR")
} finally {
    Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
}

# 3. Segredos: qualquer campo com token/senha/segredo/apikey e valor nao vazio
$padrao = '("(?i)[a-z_]*(token|password|passwd|secret|apikey|api_key|accesskey)[a-z_]*"\s*:\s*")([^"]+)(")'
$mascarados = @()
Get-ChildItem $destino -Recurse -Filter "data.json" | ForEach-Object {
    $txt = [IO.File]::ReadAllText($_.FullName)
    if ($txt -match $padrao) {
        $novo = [regex]::Replace($txt, $padrao, '$1$4')
        [IO.File]::WriteAllText($_.FullName, $novo, (New-Object Text.UTF8Encoding $false))
        $mascarados += $_.FullName.Substring($destino.Length + 1)
    }
}

# 4. Extensoes.md
$utf8 = New-Object Text.UTF8Encoding $false
$ativos = @()
$cp = Join-Path $origem "community-plugins.json"
if (Test-Path $cp) { $ativos = Get-Content $cp -Raw -Encoding UTF8 | ConvertFrom-Json }
$aparencia = Get-Content (Join-Path $origem "appearance.json") -Raw -Encoding UTF8 | ConvertFrom-Json

$md = New-Object System.Collections.Generic.List[string]
$md.Add("# Extens" + [char]0x00F5 + "es e configura" + [char]0x00E7 + [char]0x00F5 + "es")
$md.Add("")
$md.Add("> Gerado por ``backup.ps1`` em " + (Get-Date -Format "yyyy-MM-dd HH:mm") + ". N" + [char]0x00E3 + "o edite " + [char]0x00E0 + " m" + [char]0x00E3 + "o: rode o script de novo.")
$md.Add("")
$md.Add("## Plugins")
$md.Add("")
$md.Add("Os da loja: instale pelo link (ou em Configura" + [char]0x00E7 + [char]0x00F5 + "es " + [char]0x2192 + " Plugins da comunidade). Os feitos por mim j" + [char]0x00E1 + " v" + [char]0x00EA + "m completos no backup.")
$md.Add("")
$md.Add("| Plugin | ID | Vers" + [char]0x00E3 + "o | Ativo | No backup |")
$md.Add("|---|---|---|---|---|")
Get-ChildItem (Join-Path $origem "plugins") -Directory | Sort-Object Name | ForEach-Object {
    $mf = Join-Path $_.FullName "manifest.json"
    if (Test-Path $mf) {
        $m = Get-Content $mf -Raw -Encoding UTF8 | ConvertFrom-Json
        $on = if ($ativos -contains $m.id) { "sim" } else { "-" }
        $dj = if ($PluginsProprios -contains $m.id) { "completo" } else { "instalar pela loja" }
        $nome = if ($PluginsProprios -contains $m.id) { $m.name + " (feito por mim)" } else { "[" + $m.name + "](https://obsidian.md/plugins?id=" + $m.id + ")" }
        $md.Add("| $nome | ``$($m.id)`` | $($m.version) | $on | $dj |")
    }
}
$md.Add("")
$md.Add("## Temas")
$md.Add("")
Get-ChildItem (Join-Path $origem "themes") -Directory -ErrorAction SilentlyContinue | ForEach-Object {
    $mark = if ($aparencia.cssTheme -eq $_.Name) { " **(ativo)**" } else { "" }
    $md.Add("- $($_.Name)$mark")
}
$md.Add("")
$md.Add("## Snippets CSS")
$md.Add("")
Get-ChildItem (Join-Path $origem "snippets") -Filter "*.css" -ErrorAction SilentlyContinue | ForEach-Object {
    $n = $_.BaseName
    $mark = if ($aparencia.enabledCssSnippets -contains $n) { " **(ativo)**" } else { "" }
    $md.Add("- ``$($_.Name)``$mark")
}
$md.Add("")
$md.Add("## Plugins nativos ativos")
$md.Add("")
$core = Get-Content (Join-Path $origem "core-plugins.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$core.PSObject.Properties | Where-Object { $_.Value -eq $true } | ForEach-Object { $md.Add("- $($_.Name)") }
$md.Add("")
[IO.File]::WriteAllText((Join-Path $PSScriptRoot ("Extens" + [char]0x00F5 + "es.md")), ($md -join "`n"), $utf8)

$tam = "{0:N1} MB" -f ((Get-ChildItem $destino -Recurse -File | Measure-Object Length -Sum).Sum / 1MB)
Write-Host ""
Write-Host "Backup OK ($tam) -> $destino" -ForegroundColor Green
if ($mascarados.Count) {
    Write-Host "Segredos apagados na copia (configure de novo apos restaurar):" -ForegroundColor Yellow
    $mascarados | ForEach-Object { Write-Host "  - $_" }
}
