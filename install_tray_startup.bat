@echo off
cd /d "%~dp0"
echo Configurazione avvio automatico della Tray Icon...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install_tray_startup.ps1"
pause
