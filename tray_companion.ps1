<#
.SYNOPSIS
    System Tray Companion per StudiPlanner (Study Plan Rebalancer).
    Mostra un'icona interattiva nell'area di notifica (barra di sistema in basso a destra)
    per monitorare lo stato del servizio, aprire l'app nel browser e visualizzare l'IP LAN.
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
$lanUrl = "http://$((Get-LanIP)):$port"

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

# 1. Header titolo (non cliccabile)
$itemTitle = New-Object System.Windows.Forms.ToolStripMenuItem
$itemTitle.Text = "🎓 StudiPlanner (Analisi & Geometria)"
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
$itemLanUrl.Text = "📱 Mostra URL LAN (iPad / MacBook)"
$itemLanUrl.Add_Click({
    $currentLanUrl = "http://$((Get-LanIP)):$port"
    try { [System.Windows.Forms.Clipboard]::SetText($currentLanUrl) } catch {}
    $notifyIcon.ShowBalloonTip(4000, "StudiPlanner - Accesso LAN", "URL per iPad/MacBook: $currentLanUrl`n(Copiato negli appunti!)", [System.Windows.Forms.ToolTipIcon]::Info)
})
$contextMenu.Items.Add($itemLanUrl) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# 4. Stato del Servizio
$itemStatus = New-Object System.Windows.Forms.ToolStripMenuItem
$svc = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
$statusText = if ($svc) { $svc.Status } else { "Non Trovato" }
$itemStatus.Text = "⚙️ Servizio: $statusText"
$itemStatus.Add_Click({
    $currentSvc = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    $st = if ($currentSvc) { $currentSvc.Status } else { "Non Trovato" }
    $notifyIcon.ShowBalloonTip(3000, "StudiPlanner Service", "Stato attuale del servizio Windows '$serviceName': $st", [System.Windows.Forms.ToolTipIcon]::Info)
})
$contextMenu.Items.Add($itemStatus) | Out-Null

# 5. Riavvia Servizio
$itemRestart = New-Object System.Windows.Forms.ToolStripMenuItem
$itemRestart.Text = "🔁 Riavvia Servizio"
$itemRestart.Add_Click({
    try {
        Restart-Service -Name $serviceName -Force
        $notifyIcon.ShowBalloonTip(3000, "StudiPlanner", "Servizio riavviato con successo!", [System.Windows.Forms.ToolTipIcon]::Info)
    } catch {
        $notifyIcon.ShowBalloonTip(3000, "Errore", "Impossibile riavviare il servizio: $_", [System.Windows.Forms.ToolTipIcon]::Error)
    }
})
$contextMenu.Items.Add($itemRestart) | Out-Null

# 6. Apri File di Log
$itemLogs = New-Object System.Windows.Forms.ToolStripMenuItem
$itemLogs.Text = "📜 Visualizza Log"
$itemLogs.Add_Click({
    $stdoutFile = Join-Path $projectDir "logs\service-stdout.log"
    if (Test-Path $stdoutFile) {
        [System.Diagnostics.Process]::Start("notepad.exe", $stdoutFile)
    } else {
        $notifyIcon.ShowBalloonTip(3000, "StudiPlanner", "Nessun file di log trovato.", [System.Windows.Forms.ToolTipIcon]::Warning)
    }
})
$contextMenu.Items.Add($itemLogs) | Out-Null

$contextMenu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

# 7. Esci dalla tray icon
$itemExit = New-Object System.Windows.Forms.ToolStripMenuItem
$itemExit.Text = "❌ Chiudi icona (il servizio rimane attivo)"
$itemExit.Add_Click({
    $notifyIcon.Visible = $false
    $notifyIcon.Dispose()
    [System.Windows.Forms.Application]::Exit()
})
$contextMenu.Items.Add($itemExit) | Out-Null

# Associa menu e click
$notifyIcon.ContextMenuStrip = $contextMenu
$notifyIcon.Add_DoubleClick({
    [System.Diagnostics.Process]::Start($localUrl)
})

# Rendi visibile e mostra notifica di avvio
$notifyIcon.Visible = $true
$notifyIcon.ShowBalloonTip(3000, "StudiPlanner Attivo!", "Applicazione in esecuzione su $localUrl`nFai clic destro per il menu opzioni.", [System.Windows.Forms.ToolTipIcon]::Info)

# Esegui Application message loop per la tray icon
[System.Windows.Forms.Application]::Run()
