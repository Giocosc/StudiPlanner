<#
.SYNOPSIS
    Configura l'avvio automatico dell'icona nella barra di sistema (System Tray) al login dell'utente.
#>
param(
    [switch]$Uninstall
)

$startupFolder = [Environment]::GetFolderPath("Startup")
$shortcutPath = Join-Path $startupFolder "StudiPlanner Tray.lnk"
$vbsPath = Join-Path $PSScriptRoot "start-tray.vbs"

if ($Uninstall) {
    if (Test-Path $shortcutPath) {
        Remove-Item $shortcutPath -Force
        Write-Host "[OK] Collegamento rimosso da Esecuzione Automatica." -ForegroundColor Green
    } else {
        Write-Host "[i] Nessun collegamento trovato in Esecuzione Automatica." -ForegroundColor Gray
    }
    exit 0
}

$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$vbsPath`""
$shortcut.WorkingDirectory = $PSScriptRoot
$shortcut.Description = "StudiPlanner Tray Companion"
$shortcut.IconLocation = "$PSScriptRoot\icons\icon-192.png, 0"
$shortcut.Save()

Write-Host "======================================================================" -ForegroundColor Green
Write-Host " [OK] Icona di sistema configurata per l'avvio automatico al login!" -ForegroundColor Green
Write-Host " Collegamento creato in: $shortcutPath" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
