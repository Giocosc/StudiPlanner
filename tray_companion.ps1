<#
.SYNOPSIS
    System Tray Companion per StudiPlanner (Study Plan Rebalancer).
    Pannello di controllo compatto nella barra di sistema di Windows (Area di Notifica).
    Supporta: Avvia, Arresta, Riavvia, Sincronizzazione Git Pull, Apertura Browser,
    Copia URL LAN iPad, Apertura Log ed Esplora File.
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$projectDir = $PSScriptRoot
if (-not $projectDir) { $projectDir = (Get-Location).Path }

$serviceName = "UnimoreStudyPlanner"
$port = 3000

# Rileva l'indirizzo IP locale (LAN)
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

$localUrl = "http://localhost:$port"

# Funzione per eseguire azioni sul servizio (con elevazione UAC automatica se necessario)
function Manage-ServiceAction([string]$action) {
    try {
        if ($action -eq "Start") { 
            Start-Service -Name $serviceName -ErrorAction Stop 
        } elseif ($action -eq "Stop") { 
            Stop-Service -Name $serviceName -Force -ErrorAction Stop 
        } elseif ($action -eq "Restart") { 
            Restart-Service -Name $serviceName -Force -ErrorAction Stop 
        }
        $notifyIcon.ShowBalloonTip(3000, "StudiPlanner", "Servizio: operazione '$action' completata!", [System.Windows.Forms.ToolTipIcon]::Info)
    } catch {
        # Fallback con elevazione UAC per utenti non-admin
        try {
            $cmd = "$action-Service -Name $serviceName -Force"
            Start-Process powershell.exe -ArgumentList "-NoProfile -Command `"$cmd`"" -Verb RunAs -WindowStyle Hidden -Wait
            $notifyIcon.ShowBalloonTip(3000, "StudiPlanner", "Servizio: operazione '$action' eseguita con privilegi di amministratore.", [System.Windows.Forms.ToolTipIcon]::Info)
        } catch {
            $notifyIcon.ShowBalloonTip(3000, "Errore", "Impossibile eseguire $action sul servizio: $_", [System.Windows.Forms.ToolTipIcon]::Error)
        }
    }
}

# Funzione per eseguire Git Pull on-demand
function Invoke-GitSync {
    try {
        $pullOutput = & git -C "$projectDir" -c safe.directory=* pull 2>&1
        $cleanMsg = ($pullOutput -join "`n").Trim()
        if ($cleanMsg.Length -gt 150) { $cleanMsg = $cleanMsg.Substring(0, 150) + "..." }
        $notifyIcon.ShowBalloonTip(4000, "Git Pull Sincronizzato", $cleanMsg, [System.Windows.Forms.ToolTipIcon]::Info)
    } catch {
        $notifyIcon.ShowBalloonTip(4000, "Git Pull", "Errore di sincronizzazione: $_", [System.Windows.Forms.ToolTipIcon]::Warning)
    }
}

# Inizializza l'icona Tray
$notifyIcon = New-Object System.Windows.Forms.NotifyIcon
$notifyIcon.Text = "StudiPlanner (UNIMORE) - Porta $port"

# Carica icona dal file png del progetto o usa icona di sistema
$iconPath = Join-Path $projectDir "icons\icon-192.png"
if (Test-Path $iconPath) {
    try {
        $bmp = [System.Drawing.Bitmap]::FromFile($iconPath)
        $hIcon = $bmp.GetHicon()
        $notifyIcon.Icon = [System.Drawing.Icon]::FromHandle($hIcon)
    } catch {
        $notifyIcon.Icon = [System.Drawing.SystemIcons]::Application
    }
} else {
    $notifyIcon.Icon = [System.Drawing.SystemIcons]::Application
}

$contextMenu = New-Object System.Windows.Forms.ContextMenuStrip

# 1. Header titolo (disabilitato)
$itemTitle = New-Object System.Windows.Forms.ToolStripMenuItem
$itemTitle.Text = "🎓 StudiPlanner (UNIMORE Ingegneria)"
$itemTitle.Enabled = $false
$contextMenu.Items.Add($itemTitle) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# 2. Apri nel browser locale
$itemOpenLocal = New-Object System.Windows.Forms.ToolStripMenuItem
$itemOpenLocal.Text = "🌐 Apri nel Browser (Locale)"
$itemOpenLocal.Font = New-Object System.Drawing.Font($itemOpenLocal.Font, [System.Drawing.FontStyle]::Bold)
$itemOpenLocal.Add_Click({
    [System.Diagnostics.Process]::Start($localUrl)
})
$contextMenu.Items.Add($itemOpenLocal) | Out-Null

# 3. Mostra/Copia URL LAN per iPad/Mac
$itemLanUrl = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLanUrl.Text = "📱 Mostra/Copia URL LAN (iPad / MacBook)"
$itemLanUrl.Add_Click({
    $currentLanUrl = "http://$((Get-LanIP)):$port"
    try { [System.Windows.Forms.Clipboard]::SetText($currentLanUrl) } catch {}
    $notifyIcon.ShowBalloonTip(4000, "StudiPlanner - Accesso LAN", "URL: $currentLanUrl`n(Copiato negli appunti per Safari/Chrome!)", [System.Windows.Forms.ToolTipIcon]::Info)
})
$contextMenu.Items.Add($itemLanUrl) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# 4. Stato del Servizio Dinamico
$itemStatus = New-Object System.Windows.Forms.ToolStripMenuItem
$itemStatus.Text = "⚙️ Stato: Verifica in corso..."
$itemStatus.Enabled = $false
$contextMenu.Items.Add($itemStatus) | Out-Null

# 5. Controlli Servizio (Avvia, Arresta, Riavvia)
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

# 6. Diagnostica e Log
$itemLogsOut = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLogsOut.Text = "📜 Visualizza Log di Output (Stdout)"
$itemLogsOut.Add_Click({
    $stdoutFile = Join-Path $projectDir "logs\service-stdout.log"
    if (Test-Path $stdoutFile) { [System.Diagnostics.Process]::Start("notepad.exe", $stdoutFile) }
    else { $notifyIcon.ShowBalloonTip(3000, "Log", "File service-stdout.log non ancora presente.", [System.Windows.Forms.ToolTipIcon]::Warning) }
})
$contextMenu.Items.Add($itemLogsOut) | Out-Null

$itemLogsErr = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLogsErr.Text = "⚠️ Visualizza Log Errori (Stderr)"
$itemLogsErr.Add_Click({
    $stderrFile = Join-Path $projectDir "logs\service-stderr.log"
    if (Test-Path $stderrFile) { [System.Diagnostics.Process]::Start("notepad.exe", $stderrFile) }
    else { $notifyIcon.ShowBalloonTip(3000, "Log", "Nessun errore registrato.", [System.Windows.Forms.ToolTipIcon]::Info) }
})
$contextMenu.Items.Add($itemLogsErr) | Out-Null

$itemOpenFolder = New-Object System.Windows.Forms.ToolStripMenuItem
$itemOpenFolder.Text = "📂 Apri Cartella Progetto"
$itemOpenFolder.Add_Click({
    [System.Diagnostics.Process]::Start("explorer.exe", $projectDir)
})
$contextMenu.Items.Add($itemOpenFolder) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# 7. Esci dalla tray icon
$itemExit = New-Object System.Windows.Forms.ToolStripMenuItem
$itemExit.Text = "❌ Chiudi icona (il servizio rimane in background)"
$itemExit.Add_Click({
    $notifyIcon.Visible = $false
    $notifyIcon.Dispose()
    [System.Windows.Forms.Application]::Exit()
})
$contextMenu.Items.Add($itemExit) | Out-Null

# Aggiornamento dinamico dello stato ogni volta che si apre il menu contestuale
$contextMenu.Add_Opening({
    $svc = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if (-not $svc) {
        $itemStatus.Text = "⚪ Stato: Servizio non installato"
        $itemStart.Enabled = $false
        $itemStop.Enabled = $false
        $itemRestart.Enabled = $false
    } elseif ($svc.Status -eq "Running") {
        $itemStatus.Text = "🟢 Stato: In Esecuzione (Running)"
        $itemStart.Enabled = $false
        $itemStop.Enabled = $true
        $itemRestart.Enabled = $true
        $notifyIcon.Text = "StudiPlanner (Attivo - Porta $port)"
    } elseif ($svc.Status -eq "Stopped") {
        $itemStatus.Text = "🔴 Stato: Arrestato (Stopped)"
        $itemStart.Enabled = $true
        $itemStop.Enabled = $false
        $itemRestart.Enabled = $false
        $notifyIcon.Text = "StudiPlanner (Arrestato)"
    } elseif ($svc.Status -eq "Paused") {
        $itemStatus.Text = "🟡 Stato: In Pausa (Paused)"
        $itemStart.Enabled = $true
        $itemStop.Enabled = $true
        $itemRestart.Enabled = $true
        $notifyIcon.Text = "StudiPlanner (In Pausa)"
    } else {
        $itemStatus.Text = "⚙️ Stato: $($svc.Status)"
        $itemStart.Enabled = $true
        $itemStop.Enabled = $true
        $itemRestart.Enabled = $true
    }
})

# Associa menu e doppio click
$notifyIcon.ContextMenuStrip = $contextMenu
$notifyIcon.Add_DoubleClick({
    [System.Diagnostics.Process]::Start($localUrl)
})

# Rendi visibile e mostra notifica di avvio
$notifyIcon.Visible = $true
$notifyIcon.ShowBalloonTip(3000, "StudiPlanner Tray Attivo!", "Fai doppio clic per aprire l'app o clic destro per il menu di controllo.", [System.Windows.Forms.ToolTipIcon]::Info)

# Esegui Application message loop per la tray icon
[System.Windows.Forms.Application]::Run()
