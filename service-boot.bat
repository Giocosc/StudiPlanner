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

:: 2. Rilevamento dinamico di Git nel PATH o nei percorsi noti
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    if exist "%ProgramFiles%\Git\cmd\git.exe" (
        set "PATH=%ProgramFiles%\Git\cmd;!PATH!"
    )
)

:: Sincronizzazione automatica con il repository remoto prima dell'avvio
where git >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [1/2] Sincronizzazione con il repository Git remoto...
    git -c safe.directory=* pull
    if !ERRORLEVEL! equ 0 (
        echo [OK] Repository allineato con successo all'ultimo commit.
    ) else (
        echo [AVVISO] git pull non riuscito. Avvio con l'ultima copia locale disponibile.
    )
) else (
    echo [AVVISO] Git non trovato nel PATH. Salto sincronizzazione remota.
)

:: 3. Rilevamento dinamico dell'eseguibile Python
set "PYTHON_CMD="

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PYTHON_CMD=python"
    goto RUN_SERVER
)

where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PYTHON_CMD=py"
    goto RUN_SERVER
)

:: Cerca Python nelle cartelle AppData dell'utente corrente o di altri utenti
for /d %%D in ("%SystemDrive%\Users\*\AppData\Local\Programs\Python\Python*") do (
    if exist "%%D\python.exe" (
        set "PYTHON_CMD=%%D\python.exe"
        set "PATH=%%D;%%D\Scripts;!PATH!"
        goto RUN_SERVER
    )
)

:: Cerca Python nelle installazioni a livello di sistema
for /d %%D in ("%ProgramFiles%\Python*") do (
    if exist "%%D\python.exe" (
        set "PYTHON_CMD=%%D\python.exe"
        set "PATH=%%D;%%D\Scripts;!PATH!"
        goto RUN_SERVER
    )
)

:RUN_SERVER
if not defined PYTHON_CMD (
    echo [ERRORE] Eseguibile Python non trovato nel sistema!
    exit /b 1
)

echo [2/2] Avvio del server HTTP Python in foreground: !PYTHON_CMD! server.py --no-browser
"!PYTHON_CMD!" server.py --no-browser

echo [INFO] Server Python terminato con codice: %ERRORLEVEL%
exit /b %ERRORLEVEL%
