<#
.SYNOPSIS
    Script di installazione e configurazione del servizio Windows per Study Plan Rebalancer.
    Configura il Firewall per l'accesso LAN e registra il servizio con NSSM sotto l'account utente corrente.

.DESCRIPTION
    1. Richiede automaticamente privilegi di Amministratore (Self-Elevation).
    2. Crea o aggiorna la regola Inbound del Firewall di Windows per la porta 3000 TCP ("Study Planner App").
    3. Individua o scarica automaticamente NSSM (Non-Sucking Service Manager) a 64-bit.
    4. Installa il servizio di avvio automatico di Windows ("UnimoreStudyPlanner") puntando a service-boot.bat.
    5. Configura l'avvio con le credenziali dell'utente Windows corrente (ObjectName) per garantire
       l'accesso alle credenziali Git / GitHub e alle chiavi SSH per il 'git pull' automatico.
    6. Configura la rotazione dei log (stdout e stderr).

.PARAMETER ServiceName
    Nome del servizio Windows (default: "UnimoreStudyPlanner").

.PARAMETER Port
    Porta TCP del server web (default: 3000).

.PARAMETER Account
    Account utente per l'esecuzione del servizio (default: "DOMINIO\Utente" corrente).

.PARAMETER Password
    Password dell'account Windows. Se omessa, verra' richiesta in modo interattivo e protetto.

.PARAMETER NssmPath
    Percorso personalizzato all'eseguibile nssm.exe, se gia' presente altrove sul sistema.

.PARAMETER Uninstall
    Arresta e rimuove completamente il servizio Windows e la regola Firewall creata.

.PARAMETER StartService
    Avvia immediatamente il servizio al termine della configurazione.

.EXAMPLE
    .\setup_windows_service.ps1
    Installa il servizio in modalita' guidata interattiva.

.EXAMPLE
    .\setup_windows_service.ps1 -Uninstall
    Disinstalla il servizio Windows e rimuove la regola Firewall.
#>

[CmdletBinding()]
param(
    [string]$ServiceName = "UnimoreStudyPlanner",
    [int]$Port = 3000,
    [string]$Account,
    [string]$Password,
    [string]$NssmPath,
    [switch]$Uninstall,
    [switch]$StartService
)

$ErrorActionPreference = "Stop"

# ==============================================================================
# 0. VERIFICA E AUTO-ELEVAZIONE COME AMMINISTRATORE
# ==============================================================================
$currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]$currentIdentity
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host ""
    Write-Host "======================================================================" -ForegroundColor Yellow
    Write-Host " [!] ELEVAZIONE PRIVILEGI RICHIESTA" -ForegroundColor Yellow
    Write-Host " L'installazione di servizi Windows e la configurazione del Firewall" -ForegroundColor Yellow
    Write-Host " richiedono privilegi di Amministratore." -ForegroundColor Yellow
    Write-Host " Rilancio dello script con privilegi elevati (UAC)..." -ForegroundColor Yellow
    Write-Host "======================================================================" -ForegroundColor Yellow
    Write-Host ""

    $scriptPath = $MyInvocation.MyCommand.Path
    $argList = "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""
    if ($Uninstall) { $argList += " -Uninstall" }
    if ($StartService) { $argList += " -StartService" }
    if ($Account) { $argList += " -Account `"$Account`"" }
    if ($Password) { $argList += " -Password `"$Password`"" }
    if ($NssmPath) { $argList += " -NssmPath `"$NssmPath`"" }

    try {
        Start-Process powershell.exe -ArgumentList $argList -Verb RunAs
        exit 0
    } catch {
        Write-Error "Impossibile elevare i privilegi. Eseguire PowerShell come Amministratore manualmente."
        exit 1
    }
}

# Imposta directory di lavoro alla root del progetto
$projectDir = $PSScriptRoot
if (-not $projectDir) {
    $projectDir = (Get-Location).Path
}
Set-Location -Path $projectDir

$ruleName = "Study Planner App"
$bootScript = Join-Path $projectDir "service-boot.bat"
$logDir = Join-Path $projectDir "logs"
$toolsDir = Join-Path $projectDir "tools"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  🎓 StudiPlanner — Setup Servizio Windows & Rete Locale (LAN)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Directory Progetto: $projectDir" -ForegroundColor Gray
Write-Host " Nome Servizio:      $ServiceName" -ForegroundColor Gray
Write-Host " Porta Web TCP:      $Port" -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# ==============================================================================
# DISINSTALLAZIONE (Se richiesto flag -Uninstall)
# ==============================================================================
if ($Uninstall) {
    Write-Host "[*] Procedura di rimozione del servizio e regole correlate..." -ForegroundColor Yellow

    # Rileva NSSM se presente
    $nssmCmd = Get-Command nssm.exe -ErrorAction SilentlyContinue
    $localNssm = Join-Path $toolsDir "nssm.exe"
    $resolvedNssm = $null
    if ($NssmPath -and (Test-Path $NssmPath)) { $resolvedNssm = $NssmPath }
    elseif (Test-Path $localNssm) { $resolvedNssm = $localNssm }
    elseif ($nssmCmd) { $resolvedNssm = $nssmCmd.Source }

    # Arresto e rimozione servizio
    $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($svc) {
        Write-Host "[-] Arresto del servizio '$ServiceName'..." -ForegroundColor Yellow
        try { Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue } catch {}

        if ($resolvedNssm) {
            Write-Host "[-] Rimozione servizio tramite NSSM..." -ForegroundColor Yellow
            & $resolvedNssm remove $ServiceName confirm | Out-Null
        } else {
            Write-Host "[-] Rimozione servizio tramite sc.exe..." -ForegroundColor Yellow
            & sc.exe delete $ServiceName | Out-Null
        }
        Write-Host "[OK] Servizio '$ServiceName' rimosso con successo." -ForegroundColor Green
    } else {
        Write-Host "[i] Nessun servizio '$ServiceName' attualmente installato." -ForegroundColor Gray
    }

    # Rimozione regola firewall
    $firewallRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    if ($firewallRule) {
        Write-Host "[-] Rimozione regola Firewall '$ruleName'..." -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
        Write-Host "[OK] Regola Firewall rimossa." -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "Disinstallazione completata con successo." -ForegroundColor Green
    exit 0
}

# ==============================================================================
# 1. CONFIGURAZIONE DEL FIREWALL DI WINDOWS (Accesso LAN iPad/Mac)
# ==============================================================================
Write-Host "[Passo 1/4] Configurazione del Firewall di Windows per accesso LAN..." -ForegroundColor White

try {
    $existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    if ($existingRule) {
        Write-Host "  -> Regola '$ruleName' gia' presente nel Firewall. Aggiornamento parametri..." -ForegroundColor Yellow
        Set-NetFirewallRule -DisplayName $ruleName `
            -LocalPort $Port `
            -Protocol TCP `
            -Action Allow `
            -Direction Inbound `
            -Enabled True | Out-Null
    } else {
        Write-Host "  -> Creazione nuova regola Inbound per porta $Port TCP..." -ForegroundColor Cyan
        New-NetFirewallRule -DisplayName $ruleName `
            -Description "Consente l'accesso da rete locale (LAN, es. iPad o MacBook) a StudiPlanner (porta $Port TCP)" `
            -Direction Inbound `
            -Action Allow `
            -Protocol TCP `
            -LocalPort $Port `
            -Profile Any | Out-Null
    }
    Write-Host "  [OK] Traffico Inbound TCP $Port autorizzato con successo ('$ruleName')." -ForegroundColor Green
} catch {
    Write-Warning "Impossibile aggiornare la regola Firewall automaticamente: $_"
}

# ==============================================================================
# 2. INDIVIDUAZIONE O DOWNLOAD AUTOMATICO DI NSSM
# ==============================================================================
Write-Host ""
Write-Host "[Passo 2/4] Verifica e configurazione di NSSM (Non-Sucking Service Manager)..." -ForegroundColor White

$nssmExecutable = $null

# Cerca NSSM: parametro esplicito > PATH > tools locale > cartelle note
if ($NssmPath -and (Test-Path $NssmPath)) {
    $nssmExecutable = $NssmPath
} else {
    $inPath = Get-Command nssm.exe -ErrorAction SilentlyContinue
    if ($inPath) {
        $nssmExecutable = $inPath.Source
    } elseif (Test-Path (Join-Path $toolsDir "nssm.exe")) {
        $nssmExecutable = Join-Path $toolsDir "nssm.exe"
    } elseif (Test-Path "C:\ProgramData\chocolatey\bin\nssm.exe") {
        $nssmExecutable = "C:\ProgramData\chocolatey\bin\nssm.exe"
    }
}

if (-not $nssmExecutable) {
    Write-Host "  -> NSSM non trovato localmente. Avvio download automatico..." -ForegroundColor Cyan
    if (-not (Test-Path $toolsDir)) {
        New-Item -ItemType Directory -Path $toolsDir -Force | Out-Null
    }

    $nssmZipUrl = "https://nssm.cc/release/nssm-2.24.zip"
    $mirrorUrl = "https://github.com/kirillkovalenko/nssm-mirror/raw/master/release/nssm-2.24.zip"
    $zipTarget = Join-Path $toolsDir "nssm-temp.zip"
    $extractedFolder = Join-Path $toolsDir "nssm-extracted"

    # Abilita protocolli moderni TLS 1.2
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13

    $downloadSuccess = $false
    try {
        Write-Host "  -> Download da $nssmZipUrl..." -ForegroundColor Gray
        Invoke-WebRequest -Uri $nssmZipUrl -OutFile $zipTarget -UseBasicParsing -TimeoutSec 15
        $downloadSuccess = $true
    } catch {
        Write-Host "  [!] Download primario non riuscito. Tentativo dal mirror GitHub..." -ForegroundColor Yellow
        try {
            Invoke-WebRequest -Uri $mirrorUrl -OutFile $zipTarget -UseBasicParsing -TimeoutSec 15
            $downloadSuccess = $true
        } catch {
            Write-Warning "Download fallito: $_"
        }
    }

    if ($downloadSuccess -and (Test-Path $zipTarget)) {
        try {
            Write-Host "  -> Estrazione archivio NSSM a 64-bit..." -ForegroundColor Gray
            if (Test-Path $extractedFolder) { Remove-Item -Path $extractedFolder -Recurse -Force }
            Expand-Archive -Path $zipTarget -DestinationPath $extractedFolder -Force

            # Copia il binario win64
            $win64Nssm = Get-ChildItem -Path $extractedFolder -Filter "nssm.exe" -Recurse | Where-Object { $_.FullName -match 'win64' } | Select-Object -First 1
            if ($win64Nssm) {
                $targetNssm = Join-Path $toolsDir "nssm.exe"
                Copy-Item -Path $win64Nssm.FullName -Destination $targetNssm -Force
                $nssmExecutable = $targetNssm
                Write-Host "  [OK] NSSM 64-bit configurato in: $nssmExecutable" -ForegroundColor Green
            }

            # Pulizia temporanei
            Remove-Item -Path $zipTarget -Force -ErrorAction SilentlyContinue
            Remove-Item -Path $extractedFolder -Recurse -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Warning "Estrazione archivio non riuscita: $_"
        }
    }

    # Se ancora non disponibile, prova winget
    if (-not $nssmExecutable) {
        $wingetCmd = Get-Command winget.exe -ErrorAction SilentlyContinue
        if ($wingetCmd) {
            Write-Host "  -> Tentativo installazione tramite winget..." -ForegroundColor Cyan
            & winget.exe install -e --id NSSM.NSSM --silent --accept-source-agreements --accept-package-agreements | Out-Null
            $inPathAfter = Get-Command nssm.exe -ErrorAction SilentlyContinue
            if ($inPathAfter) { $nssmExecutable = $inPathAfter.Source }
        }
    }
}

if (-not $nssmExecutable -or -not (Test-Path $nssmExecutable)) {
    Write-Host ""
    Write-Error "Impossibile reperire 'nssm.exe'. Scaricalo manualmente da https://nssm.cc/download e copialo in '$toolsDir\nssm.exe', oppure esegui 'winget install nssm' e rilancia lo script."
    exit 1
}

Write-Host "  [OK] Eseguibile NSSM valido: $nssmExecutable" -ForegroundColor Green

# ==============================================================================
# 3. REGISTRAZIONE E CONFIGURAZIONE DEL SERVIZIO WINDOWS
# ==============================================================================
Write-Host ""
Write-Host "[Passo 3/4] Registrazione del servizio '$ServiceName'..." -ForegroundColor White

if (-not (Test-Path $bootScript)) {
    Write-Error "Script di avvio '$bootScript' non trovato!"
    exit 1
}

# Assicura esistenza cartella log
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

$stdoutLog = Join-Path $logDir "service-stdout.log"
$stderrLog = Join-Path $logDir "service-stderr.log"

# Verifica se il servizio esiste gia'
$existingSvc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($existingSvc) {
    Write-Host "  -> Il servizio '$ServiceName' esiste gia'. Arresto in corso per aggiornamento configurazione..." -ForegroundColor Yellow
    try { & $nssmExecutable stop $ServiceName } catch {}
    Start-Sleep -Seconds 1
} else {
    Write-Host "  -> Installazione del nuovo servizio Windows '$ServiceName'..." -ForegroundColor Cyan
    # Usa cmd.exe /c per eseguire in modo affidabile lo script .bat
    & $nssmExecutable install $ServiceName "$env:ComSpec" "/c `"$bootScript`"" | Out-Null
}

# Configurazione parametri NSSM
Write-Host "  -> Configurazione directory di lavoro e parametri di avvio..." -ForegroundColor Gray
& $nssmExecutable set $ServiceName Application "$env:ComSpec" | Out-Null
& $nssmExecutable set $ServiceName AppParameters "/c `"$bootScript`"" | Out-Null
& $nssmExecutable set $ServiceName AppDirectory "$projectDir" | Out-Null
& $nssmExecutable set $ServiceName DisplayName "Unimore Study Planner - Rebalancer Service" | Out-Null
& $nssmExecutable set $ServiceName Description "Servizio in background per StudiPlanner (UNIMORE Ingegneria Informatica) con auto-sync git e accesso LAN" | Out-Null
& $nssmExecutable set $ServiceName Start SERVICE_AUTO_START | Out-Null

# Configurazione rotazione e percorsi di log
Write-Host "  -> Configurazione rotazione log (1MB max per file)..." -ForegroundColor Gray
& $nssmExecutable set $ServiceName AppStdout "$stdoutLog" | Out-Null
& $nssmExecutable set $ServiceName AppStderr "$stderrLog" | Out-Null
& $nssmExecutable set $ServiceName AppRotateFiles 1 | Out-Null
& $nssmExecutable set $ServiceName AppRotateOnline 1 | Out-Null
& $nssmExecutable set $ServiceName AppRotateBytes 1048576 | Out-Null

# ==============================================================================
# 4. IMPERATIVO: CONFIGURAZIONE CREDENZIALI UTENTE (ObjectName)
# ==============================================================================
Write-Host ""
Write-Host "[Passo 4/4] Configurazione credenziali utente (ObjectName)..." -ForegroundColor White
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkCyan
Write-Host " [CRUCIALE] PERCHE' E' NECESSARIO L'ACCOUNT UTENTE:" -ForegroundColor Cyan
Write-Host " 1. 'service-boot.bat' esegue 'git pull' prima di avviare il server." -ForegroundColor White
Write-Host " 2. Git salva le credenziali HTTPS (Windows Credential Manager) e le" -ForegroundColor White
Write-Host "    chiavi SSH (~/.ssh) ESCLUSIVAMENTE nel profilo del tuo utente." -ForegroundColor White
Write-Host " 3. Se il servizio girasse sotto 'LocalSystem', il 'git pull' fallirebbe" -ForegroundColor White
Write-Host "    sistematicamente per mancanza di autorizzazione." -ForegroundColor White
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkCyan

# Rilevamento dell'account utente target
$effectiveAccount = $Account
if (-not $effectiveAccount) {
    # Default: Utente corrente nel formato DOMINIO\NomeUtente o .\NomeUtente
    if ($env:USERDOMAIN) {
        $effectiveAccount = "$env:USERDOMAIN\$env:USERNAME"
    } else {
        $effectiveAccount = ".\$env:USERNAME"
    }
}

Write-Host " Account selezionato per l'esecuzione: " -NoNewline
Write-Host "$effectiveAccount" -ForegroundColor Yellow

$credentialsConfigured = $false

if ($Password) {
    # Password fornita da parametro
    Write-Host "  -> Configurazione credenziali via parametro script..." -ForegroundColor Gray
    $setAccountResult = & $nssmExecutable set $ServiceName ObjectName $effectiveAccount $Password 2>&1
    if ($LASTEXITCODE -eq 0) {
        $credentialsConfigured = $true
        Write-Host "  [OK] Credenziali impostate con successo per $effectiveAccount." -ForegroundColor Green
    } else {
        Write-Warning "Impossibile impostare le credenziali fornite: $setAccountResult"
    }
} else {
    # Richiesta interattiva sicura
    Write-Host ""
    Write-Host " Inserisci la password di Windows per l'account [$effectiveAccount]:" -ForegroundColor White
    Write-Host " (Se utilizzi Windows Hello / PIN o preferisci la GUI, premi INVIO per aprire il configuratore grafico)" -ForegroundColor DarkGray
    
    $securePass = Read-Host -Prompt "Password Windows" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
    $plainPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

    if (-not [string]::IsNullOrWhiteSpace($plainPass)) {
        Write-Host "  -> Applicazione credenziali su NSSM..." -ForegroundColor Gray
        $setAccountResult = & $nssmExecutable set $ServiceName ObjectName $effectiveAccount $plainPass 2>&1
        if ($LASTEXITCODE -eq 0) {
            $credentialsConfigured = $true
            Write-Host "  [OK] Credenziali impostate con successo per $effectiveAccount." -ForegroundColor Green
            Write-Host "  [INFO] NSSM ha concesso automaticamente il privilegio 'SeServiceLogonRight' (Accesso come servizio)." -ForegroundColor Gray
        } else {
            Write-Warning "Configurazione password automatica non riuscita: $setAccountResult"
        }
    } else {
        Write-Host ""
        Write-Host "  [i] Nessuna password digitata da riga di comando." -ForegroundColor Yellow
        Write-Host "      Apertura della GUI di NSSM per inserire l'account nella scheda 'Log on'..." -ForegroundColor Cyan
        Write-Host "      (Seleziona 'This account', inserisci $effectiveAccount e la tua password, poi clicca 'Edit service')" -ForegroundColor Yellow
        
        # Avvia l'editor grafico di NSSM
        Start-Process -FilePath $nssmExecutable -ArgumentList "edit $ServiceName" -Wait
        $credentialsConfigured = $true
    }
}

# ==============================================================================
# RIEPILOGO STATO, INDIRIZZI LAN E GESTIONE SERVIZIO
# ==============================================================================
# Rileva l'indirizzo IP locale (LAN) del PC
$lanIp = "127.0.0.1"
try {
    $ipObj = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | 
             Where-Object { 
                 $_.InterfaceAlias -notmatch 'Loopback|vEthernet|Virtual|WSL' -and 
                 $_.IPAddress -notmatch '^169\.254\.' 
             } | Select-Object -First 1
    if ($ipObj) { $lanIp = $ipObj.IPAddress }
} catch {}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  🎉 INSTALLAZIONE COMPLETATA CON SUCCESSO!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host " Servizio Windows:     $ServiceName" -ForegroundColor White
Write-Host " Eseguito da account:  $effectiveAccount" -ForegroundColor White
Write-Host " Script avviato:       $bootScript" -ForegroundColor White
Write-Host " Regola Firewall:      $ruleName (Porta $Port TCP Inbound)" -ForegroundColor White
Write-Host " File di Log:          $logDir\service-stdout.log" -ForegroundColor White
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  📍 URL Locale (questo PC):    http://localhost:$Port" -ForegroundColor Cyan
Write-Host "  📱 URL LAN (iPad / MacBook):  http://${lanIp}:$Port" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host " Comandi utili di gestione (PowerShell Amministratore):" -ForegroundColor White
Write-Host "   - Avviare il servizio:       Start-Service $ServiceName" -ForegroundColor Gray
Write-Host "   - Arrestare il servizio:     Stop-Service $ServiceName" -ForegroundColor Gray
Write-Host "   - Riavviare il servizio:     Restart-Service $ServiceName" -ForegroundColor Gray
Write-Host "   - Visualizzare lo stato:     Get-Service $ServiceName" -ForegroundColor Gray
Write-Host "   - Modificare con GUI NSSM:   $nssmExecutable edit $ServiceName" -ForegroundColor Gray
Write-Host "   - Monitorare log in tempo reale: Get-Content `"$stdoutLog`" -Wait" -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""

if ($StartService) {
    Write-Host "[*] Avvio immediato del servizio '$ServiceName'..." -ForegroundColor Cyan
    try {
        & $nssmExecutable start $ServiceName
        Start-Sleep -Seconds 2
        $status = (Get-Service -Name $ServiceName).Status
        Write-Host "[OK] Stato attuale del servizio: $status" -ForegroundColor Green
    } catch {
        Write-Warning "Impossibile avviare il servizio: $_"
    }
}
