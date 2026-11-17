<#
.SYNOPSIS
    Crea il collegamento desktop e nel menu Start per StudiPlanner in modalità App Nativa (PWA).
    Permette di aggiungere con 1 clic l'applicazione alla Barra delle Applicazioni (Taskbar) di Windows.
#>

$projectDir = $PSScriptRoot
if (-not $projectDir) { $projectDir = (Get-Location).Path }

$icoPath = Join-Path $projectDir "icons\app.ico"
$url = "http://localhost:3000"

# 1. Rileva il browser migliore (Chrome o Edge)
$browserExe = $null

$chromeReg = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" -ErrorAction SilentlyContinue
if ($chromeReg -and (Test-Path $chromeReg.'(default)')) {
    $browserExe = $chromeReg.'(default)'
} elseif (Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe") {
    $browserExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}

if (-not $browserExe) {
    $edgeReg = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe" -ErrorAction SilentlyContinue
    if ($edgeReg -and (Test-Path $edgeReg.'(default)')) {
        $browserExe = $edgeReg.'(default)'
    } elseif (Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") {
        $browserExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    }
}

$WshShell = New-Object -ComObject WScript.Shell

# Percorsi di destinazione
$desktopFolder = [Environment]::GetFolderPath("Desktop")
$desktopShortcut = Join-Path $desktopFolder "StudiPlanner.lnk"

$startMenuFolder = Join-Path ([Environment]::GetFolderPath("Programs")) "StudiPlanner"
if (-not (Test-Path $startMenuFolder)) {
    New-Item -ItemType Directory -Path $startMenuFolder -Force | Out-Null
}
$startMenuShortcut = Join-Path $startMenuFolder "StudiPlanner.lnk"

# Funzione per creare il collegamento PWA con AppUserModelId
function Create-PwaShortcut([string]$destPath) {
    $shortcut = $WshShell.CreateShortcut($destPath)
    if ($browserExe) {
        $shortcut.TargetPath = $browserExe
        $shortcut.Arguments = "--app=`"$url`""
    } else {
        $shortcut.TargetPath = "cmd.exe"
        $shortcut.Arguments = "/c start `"`" `"$url`""
        $shortcut.WindowStyle = 7 # Minimized
    }
    $shortcut.WorkingDirectory = $projectDir
    $shortcut.Description = "StudiPlanner — Analisi 1 & Geometria UNIMORE"
    if (Test-Path $icoPath) {
        $shortcut.IconLocation = "$icoPath, 0"
    }
    $shortcut.Save()
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  🎓 StudiPlanner — Generazione Collegamento per Barra Applicazioni" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# Crea sul Desktop
Create-PwaShortcut $desktopShortcut
Write-Host " [OK] Collegamento creato sul Desktop:" -ForegroundColor Green
Write-Host "      $desktopShortcut" -ForegroundColor White

# Crea nel Menu Start
Create-PwaShortcut $startMenuShortcut
Write-Host " [OK] Collegamento registrato nel Menu Start di Windows:" -ForegroundColor Green
Write-Host "      $startMenuShortcut" -ForegroundColor White

Write-Host ""
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host " 📌 COME AGGIUNGERE L'ICONA ALLA BARRA DELLE APPLICAZIONI (TASKBAR):" -ForegroundColor Yellow
Write-Host " 1. Vai sul tuo Desktop o apri il Menu Start digitando 'StudiPlanner'." -ForegroundColor White
Write-Host " 2. Fai CLIC DESTRO sull'icona di StudiPlanner." -ForegroundColor White
Write-Host " 3. Seleziona: 'Aggiungi alla barra delle applicazioni' (Pin to Taskbar)." -ForegroundColor Cyan
Write-Host "    (Su Windows 11: Mostra altre opzioni -> Aggiungi alla barra delle applicazioni)" -ForegroundColor Gray
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host " VANTAGGIO: L'app si aprirà in una finestra pulita e indipendente," -ForegroundColor Green
Write-Host " senza barre URL o schede disordinate del browser, come una vera app nativa!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
