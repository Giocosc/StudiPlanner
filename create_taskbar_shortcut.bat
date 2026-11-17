@echo off
cd /d "%~dp0"
echo Generazione del collegamento Desktop e Taskbar per StudiPlanner...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create_taskbar_shortcut.ps1"
pause
