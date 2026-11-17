@echo off
setlocal EnableDelayedExpansion

:: 1. Posizionamento dinamico nella cartella del repository
cd /d "%~dp0"

echo ======================================================================
echo  [Study Plan Rebalancer] Bootstrap Servizio di Avvio
echo  Data/Ora: %date% %time%
echo  Directory: %CD%
echo ======================================================================

:: Crea la cartella dei log se non esiste
if not exist "logs" mkdir "logs"

:: 2. Sincronizzazione automatica con il repository remoto prima dell'avvio
echo [1/2] Sincronizzazione con il repository Git remoto...
where git >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Esecuzione di git pull in corso...
    git -c safe.directory=* pull
    if %ERRORLEVEL% neq 0 (
        echo [ATTENZIONE] 'git pull' non e' andato a buon fine (possibile assenza momentanea di rete o credenziali).
        echo [ATTENZIONE] Il server verra' comunque avviato con l'ultima copia locale disponibile.
    ) else (
        echo [OK] Repository allineato con successo all'ultimo commit.
    )
) else (
    echo [ATTENZIONE] Eseguibile 'git' non trovato nel PATH. Salto sincronizzazione remota.
)

:: 3. Avvio del server web in foreground
echo [2/2] Avvio del server HTTP Python in foreground (porta 3000)...
python server.py --no-browser

if %ERRORLEVEL% neq 0 (
    echo [ERRORE] Il server Python si e' arrestato con codice di uscita: %ERRORLEVEL%
)

exit /b %ERRORLEVEL%
