<#
.SYNOPSIS
    System Tray Companion Professionale per StudiPlanner (UNIMORE Ingegneria Informatica).
    Pannello di controllo compatto nella barra di sistema di Windows (Area di Notifica).
    Fornisce badge visivo di stato in tempo reale (Verde/Rosso/Giallo), controlli completi del servizio,
    accesso immediato LAN/Web, sincronizzazione Git e strumenti di diagnostica.
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$projectDir = $PSScriptRoot
if (-not $projectDir) { $projectDir = (Get-Location).Path }

$serviceName = "UnimoreStudyPlanner"
$port = 3000
$ruleName = "Study Planner App"

# Cartella di avvio automatico di Windows
$startupFolder = [Environment]::GetFolderPath("Startup")
$startupShortcut = Join-Path $startupFolder "StudiPlanner Tray.lnk"

# ==============================================================================
# FUNZIONI DI SUPPORTO & RETE
# ==============================================================================
function Get-LanIP {
    try {
        $ipObj = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | 
                 Where-Object { 
                     $_.InterfaceAlias -notmatch 'Loopback|vEthernet|Virtual|WSL' -and 
                     $_.IPAddress -notmatch '^169\.254\.' 
                 } | Select-Object -First 1
        if ($ipObj) { return $ipObj.IPAddress }
    } catch {}
    return "127.0.0.1"
}

function Get-ServiceState {
    try {
        $svc = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
        if ($svc) { return $svc.Status.ToString() }
    } catch {}
    return "NotInstalled"
}

function Test-AutoStartup {
    return (Test-Path $startupShortcut)
}

function Set-AutoStartup([bool]$enable) {
    try {
        if ($enable) {
            $WshShell = New-Object -ComObject WScript.Shell
            $shortcut = $WshShell.CreateShortcut($startupShortcut)
            $shortcut.TargetPath = "wscript.exe"
            $shortcut.Arguments = "`"$projectDir\start-tray.vbs`""
            $shortcut.WorkingDirectory = $projectDir
            $shortcut.Description = "StudiPlanner Tray Companion"
            $shortcut.IconLocation = "$projectDir\icons\icon-192.png, 0"
            $shortcut.Save()
            return $true
        } else {
            if (Test-Path $startupShortcut) { Remove-Item $startupShortcut -Force }
            return $false
        }
    } catch {
        return (Test-Path $startupShortcut)
    }
}

# ==============================================================================
# GENERATORE DINAMICO ICONA CON BADGE DI STATO
# ==============================================================================
function Get-StatusIcon([string]$status) {
    try {
        $iconPath = Join-Path $projectDir "icons\icon-192.png"
        $rawBmp = if (Test-Path $iconPath) {
            [System.Drawing.Bitmap]::FromFile($iconPath)
        } else {
            New-Object System.Drawing.Bitmap 32, 32
        }

        $trayBmp = New-Object System.Drawing.Bitmap 32, 32
        $g = [System.Drawing.Graphics]::FromImage($trayBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

        # Disegna l'icona base del progetto
        $g.DrawImage($rawBmp, 0, 0, 32, 32)

        # Colore indicatore di stato in base allo stato del servizio
        $dotBrush = switch ($status) {
            "Running" { New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 16, 185, 129)) } # Emerald / Teal
            "Stopped" { New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 244, 63, 94)) }  # Rose Red
            "Paused"  { New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 245, 158, 11)) } # Amber
            default   { New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 148, 163, 184)) } # Slate Gray
        }

        $borderBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 7, 11, 20)) # Dark UI bg

        # Disegna badge circolare nell'angolo in basso a destra (diametro 11px con contorno)
        $g.FillEllipse($borderBrush, 19, 19, 13, 13)
        $g.FillEllipse($dotBrush, 20, 20, 11, 11)

        $g.Dispose()
        $rawBmp.Dispose()
        $dotBrush.Dispose()
        $borderBrush.Dispose()

        $hIcon = $trayBmp.GetHicon()
        return [System.Drawing.Icon]::FromHandle($hIcon)
    } catch {
        return [System.Drawing.SystemIcons]::Application
    }
}

# ==============================================================================
# GESTIONE CONTROLLO SERVIZIO
# ==============================================================================
function Manage-ServiceAction([string]$action) {
    try {
        if ($action -eq "Start") { 
            Start-Service -Name $serviceName -ErrorAction Stop 
        } elseif ($action -eq "Stop") { 
            Stop-Service -Name $serviceName -Force -ErrorAction Stop 
        } elseif ($action -eq "Restart") { 
            Restart-Service -Name $serviceName -Force -ErrorAction Stop 
        }
        Update-TrayVisuals
        $notifyIcon.ShowBalloonTip(3000, "StudiPlanner", "Operazione '$action' completata con successo!", [System.Windows.Forms.ToolTipIcon]::Info)
    } catch {
        # Se la sessione non è elevata, invoca con UAC RunAs in background
        try {
            $cmd = "$action-Service -Name $serviceName -Force"
            Start-Process powershell.exe -ArgumentList "-NoProfile -Command `"$cmd`"" -Verb RunAs -WindowStyle Hidden -Wait
            Update-TrayVisuals
            $notifyIcon.ShowBalloonTip(3000, "StudiPlanner", "Operazione '$action' eseguita con privilegi amministratore.", [System.Windows.Forms.ToolTipIcon]::Info)
        } catch {
            $notifyIcon.ShowBalloonTip(3000, "Errore", "Impossibile eseguire $($action): $_", [System.Windows.Forms.ToolTipIcon]::Error)
        }
    }
}

function Invoke-GitSync {
    try {
        $pullOutput = & git -C "$projectDir" -c safe.directory=* pull 2>&1
        $cleanMsg = ($pullOutput -join " ").Trim()
        if ($cleanMsg.Length -gt 120) { $cleanMsg = $cleanMsg.Substring(0, 120) + "..." }
        $notifyIcon.ShowBalloonTip(3500, "Sincronizzazione GitHub", $cleanMsg, [System.Windows.Forms.ToolTipIcon]::Info)
    } catch {
        $notifyIcon.ShowBalloonTip(3500, "GitHub Sync", "Errore: $_", [System.Windows.Forms.ToolTipIcon]::Warning)
    }
}

# ==============================================================================
# INIZIALIZZAZIONE COMPONENTI NOTIFYICON
# ==============================================================================
$notifyIcon = New-Object System.Windows.Forms.NotifyIcon
$contextMenu = New-Object System.Windows.Forms.ContextMenuStrip
$notifyIcon.ContextMenuStrip = $contextMenu

# ------------------------------------------------------------------------------
# 1. HEADER (Identità applicazione)
# ------------------------------------------------------------------------------
$itemTitle = New-Object System.Windows.Forms.ToolStripMenuItem
$itemTitle.Text = "🎓 StudiPlanner — UNIMORE"
$itemTitle.Font = New-Object System.Drawing.Font($itemTitle.Font, [System.Drawing.FontStyle]::Bold)
$itemTitle.Enabled = $false
$contextMenu.Items.Add($itemTitle) | Out-Null

# ------------------------------------------------------------------------------
# 2. STATO IN TEMPO REALE
# ------------------------------------------------------------------------------
$itemStatus = New-Object System.Windows.Forms.ToolStripMenuItem
$itemStatus.Text = "⚙️ Stato: Rilevamento in corso..."
$itemStatus.Add_Click({
    $st = Get-ServiceState
    $ip = Get-LanIP
    $msg = "Stato Servizio: $st`nPorta Locale: $port`nIP LAN: http://${ip}:$port"
    $notifyIcon.ShowBalloonTip(3500, "Dettagli StudiPlanner", $msg, [System.Windows.Forms.ToolTipIcon]::Info)
})
$contextMenu.Items.Add($itemStatus) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# ------------------------------------------------------------------------------
# 3. ACCESSO WEB (Locale & LAN)
# ------------------------------------------------------------------------------
$itemOpenLocal = New-Object System.Windows.Forms.ToolStripMenuItem
$itemOpenLocal.Text = "🌐 Apri nel Browser (Locale)"
$itemOpenLocal.Font = New-Object System.Drawing.Font($itemOpenLocal.Font, [System.Drawing.FontStyle]::Bold)
$itemOpenLocal.Add_Click({
    [System.Diagnostics.Process]::Start("http://localhost:$port")
})
$contextMenu.Items.Add($itemOpenLocal) | Out-Null

# Sottomenu Accesso LAN per dispositivi esterni
$itemLanMenu = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLanMenu.Text = "📱 Accesso LAN (iPad / MacBook)"

$itemLanCopy = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLanCopy.Text = "📋 Copia URL negli Appunti"
$itemLanCopy.Add_Click({
    $lanUrl = "http://$((Get-LanIP)):$port"
    try { [System.Windows.Forms.Clipboard]::SetText($lanUrl) } catch {}
    $notifyIcon.ShowBalloonTip(3500, "URL Copiato!", "$lanUrl pronto da incollare su iPad/MacBook.", [System.Windows.Forms.ToolTipIcon]::Info)
})
$itemLanMenu.DropDownItems.Add($itemLanCopy) | Out-Null

$itemLanOpen = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLanOpen.Text = "🌐 Apri URL LAN in questo Browser"
$itemLanOpen.Add_Click({
    $lanUrl = "http://$((Get-LanIP)):$port"
    [System.Diagnostics.Process]::Start($lanUrl)
})
$itemLanMenu.DropDownItems.Add($itemLanOpen) | Out-Null

$contextMenu.Items.Add($itemLanMenu) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# ------------------------------------------------------------------------------
# 4. CICLO DI VITA DEL SERVIZIO
# ------------------------------------------------------------------------------
$itemStart = New-Object System.Windows.Forms.ToolStripMenuItem
$itemStart.Text = "▶️  Avvia Servizio"
$itemStart.Add_Click({ Manage-ServiceAction "Start" })
$contextMenu.Items.Add($itemStart) | Out-Null

$itemStop = New-Object System.Windows.Forms.ToolStripMenuItem
$itemStop.Text = "⏹️  Arresta Servizio"
$itemStop.Add_Click({ Manage-ServiceAction "Stop" })
$contextMenu.Items.Add($itemStop) | Out-Null

$itemRestart = New-Object System.Windows.Forms.ToolStripMenuItem
$itemRestart.Text = "🔄  Riavvia Servizio"
$itemRestart.Add_Click({ Manage-ServiceAction "Restart" })
$contextMenu.Items.Add($itemRestart) | Out-Null

$itemGitPull = New-Object System.Windows.Forms.ToolStripMenuItem
$itemGitPull.Text = "⬇️  Sincronizza Repository (Git Pull)"
$itemGitPull.Add_Click({ Invoke-GitSync })
$contextMenu.Items.Add($itemGitPull) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# ------------------------------------------------------------------------------
# 5. STRUMENTI & DIAGNOSTICA (Sottomenu Ordinato)
# ------------------------------------------------------------------------------
$itemToolsMenu = New-Object System.Windows.Forms.ToolStripMenuItem
$itemToolsMenu.Text = "🛠️  Strumenti & Diagnostica"

$itemLogsOut = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLogsOut.Text = "📜 Visualizza Log Stdout (Output)"
$itemLogsOut.Add_Click({
    $stdoutFile = Join-Path $projectDir "logs\service-stdout.log"
    if (Test-Path $stdoutFile) { [System.Diagnostics.Process]::Start("notepad.exe", $stdoutFile) }
    else { $notifyIcon.ShowBalloonTip(3000, "Log", "service-stdout.log non ancora presente.", [System.Windows.Forms.ToolTipIcon]::Warning) }
})
$itemToolsMenu.DropDownItems.Add($itemLogsOut) | Out-Null

$itemLogsErr = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLogsErr.Text = "⚠️ Visualizza Log Stderr (Errori)"
$itemLogsErr.Add_Click({
    $stderrFile = Join-Path $projectDir "logs\service-stderr.log"
    if (Test-Path $stderrFile) { [System.Diagnostics.Process]::Start("notepad.exe", $stderrFile) }
    else { $notifyIcon.ShowBalloonTip(3000, "Log", "Nessun errore presente.", [System.Windows.Forms.ToolTipIcon]::Info) }
})
$itemToolsMenu.DropDownItems.Add($itemLogsErr) | Out-Null

$itemCleanLogs = New-Object System.Windows.Forms.ToolStripMenuItem
$itemCleanLogs.Text = "🧹 Azzera File di Log"
$itemCleanLogs.Add_Click({
    try {
        Clear-Content (Join-Path $projectDir "logs\service-stdout.log") -ErrorAction SilentlyContinue
        Clear-Content (Join-Path $projectDir "logs\service-stderr.log") -ErrorAction SilentlyContinue
        $notifyIcon.ShowBalloonTip(2500, "StudiPlanner", "File di log azzerati con successo.", [System.Windows.Forms.ToolTipIcon]::Info)
    } catch {}
})
$itemToolsMenu.DropDownItems.Add($itemCleanLogs) | Out-Null

$itemToolsMenu.DropDownItems.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

$itemCheckFirewall = New-Object System.Windows.Forms.ToolStripMenuItem
$itemCheckFirewall.Text = "🛡️ Verifica Regola Firewall Windows"
$itemCheckFirewall.Add_Click({
    $fw = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    if ($fw -and $fw.Enabled -eq "True") {
        $notifyIcon.ShowBalloonTip(3500, "Firewall Windows", "Regola '$ruleName' ATTIVA (Porta $port TCP Inbound autorizzata).", [System.Windows.Forms.ToolTipIcon]::Info)
    } else {
        $notifyIcon.ShowBalloonTip(3500, "Firewall Windows", "Regola non attiva. Esegui setup_windows_service.ps1 come Admin.", [System.Windows.Forms.ToolTipIcon]::Warning)
    }
})
$itemToolsMenu.DropDownItems.Add($itemCheckFirewall) | Out-Null

$itemOpenServices = New-Object System.Windows.Forms.ToolStripMenuItem
$itemOpenServices.Text = "🗄️ Apri Gestione Servizi (services.msc)"
$itemOpenServices.Add_Click({
    [System.Diagnostics.Process]::Start("services.msc")
})
$itemToolsMenu.DropDownItems.Add($itemOpenServices) | Out-Null

$itemOpenFolder = New-Object System.Windows.Forms.ToolStripMenuItem
$itemOpenFolder.Text = "📂 Apri Cartella Progetto in Explorer"
$itemOpenFolder.Add_Click({
    [System.Diagnostics.Process]::Start("explorer.exe", $projectDir)
})
$itemToolsMenu.DropDownItems.Add($itemOpenFolder) | Out-Null

$contextMenu.Items.Add($itemToolsMenu) | Out-Null

# ------------------------------------------------------------------------------
# 6. AVVIO AUTOMATICO CON WINDOWS (Checkbox Interattiva)
# ------------------------------------------------------------------------------
$itemAutoStart = New-Object System.Windows.Forms.ToolStripMenuItem
$itemAutoStart.Text = "🚀 Avvia Icona al Login di Windows"
$itemAutoStart.CheckOnClick = $true
$itemAutoStart.Checked = Test-AutoStartup
$itemAutoStart.Add_Click({
    $newState = Set-AutoStartup $itemAutoStart.Checked
    $itemAutoStart.Checked = $newState
    $msg = if ($newState) { "Icona aggiunta ad Esecuzione Automatica." } else { "Icona rimossa da Esecuzione Automatica." }
    $notifyIcon.ShowBalloonTip(3000, "Avvio Automatico", $msg, [System.Windows.Forms.ToolTipIcon]::Info)
})
$contextMenu.Items.Add($itemAutoStart) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# ------------------------------------------------------------------------------
# 7. CHIUSURA TRAY ICON
# ------------------------------------------------------------------------------
$itemExit = New-Object System.Windows.Forms.ToolStripMenuItem
$itemExit.Text = "🚪 Chiudi Icona (Il servizio resta attivo)"
$itemExit.Add_Click({
    $timer.Stop()
    $notifyIcon.Visible = $false
    $notifyIcon.Dispose()
    [System.Windows.Forms.Application]::Exit()
})
$contextMenu.Items.Add($itemExit) | Out-Null

# ==============================================================================
# LOGICA DI AGGIORNAMENTO DINAMICO (Timer & Apertura Menu)
# ==============================================================================
function Update-TrayVisuals {
    $st = Get-ServiceState
    $lanIp = Get-LanIP
    
    # Aggiorna icona dinamica con pallino colorato
    $newIcon = Get-StatusIcon $st
    $notifyIcon.Icon = $newIcon

    # Aggiorna Tooltip
    $tooltip = switch ($st) {
        "Running" { "StudiPlanner: ATTIVO (Porta $port)`nLAN: http://${lanIp}:$port" }
        "Stopped" { "StudiPlanner: ARRESTATO" }
        "Paused"  { "StudiPlanner: IN PAUSA (Throttling)" }
        default   { "StudiPlanner: $st" }
    }
    # Il tooltip in Windows Forms supporta max 63 o 127 caratteri
    if ($tooltip.Length -gt 63) { $tooltip = $tooltip.Substring(0, 63) }
    $notifyIcon.Text = $tooltip

    # Aggiorna etichette del menu
    if ($st -eq "Running") {
        $itemStatus.Text = "🟢 Servizio: In Esecuzione (Porta $port)"
        $itemStart.Enabled = $false
        $itemStop.Enabled = $true
        $itemRestart.Enabled = $true
    } elseif ($st -eq "Stopped") {
        $itemStatus.Text = "🔴 Servizio: Arrestato (Stopped)"
        $itemStart.Enabled = $true
        $itemStop.Enabled = $false
        $itemRestart.Enabled = $false
    } elseif ($st -eq "Paused") {
        $itemStatus.Text = "🟡 Servizio: In Pausa (Paused)"
        $itemStart.Enabled = $true
        $itemStop.Enabled = $true
        $itemRestart.Enabled = $true
    } else {
        $itemStatus.Text = "⚙️ Servizio: $st"
        $itemStart.Enabled = $true
        $itemStop.Enabled = $true
        $itemRestart.Enabled = $true
    }

    # Sincronizza stato checkbox autostart
    $itemAutoStart.Checked = Test-AutoStartup
}

# Aggiornamento ad ogni apertura del menu con clic destro
$contextMenu.Add_Opening({
    Update-TrayVisuals
})

# Doppio clic apre sempre il browser locale
$notifyIcon.Add_DoubleClick({
    [System.Diagnostics.Process]::Start("http://localhost:$port")
})

# ==============================================================================
# TIMER DI MONITORAGGIO STATO (Ogni 4 secondi, consumo CPU ~0%)
# ==============================================================================
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 4000
$timer.Add_Tick({
    Update-TrayVisuals
})

# Primo avvio visivo
Update-TrayVisuals
$notifyIcon.Visible = $true
$timer.Start()

$lanIpNow = Get-LanIP
$notifyIcon.ShowBalloonTip(3000, "StudiPlanner Attivo!", "Locale: http://localhost:$port`nLAN: http://${lanIpNow}:$port`nDoppio clic: apri | Clic destro: menu", [System.Windows.Forms.ToolTipIcon]::Info)

# Avvio del message loop
[System.Windows.Forms.Application]::Run()
