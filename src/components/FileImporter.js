import React, { useState } from "react";
import { IconUpload, IconDownload, IconCheckCircle, IconRefresh, IconLayers, IconBookOpen, IconSave, IconFileCheck } from "./Icons.js";
import { parseCSVString, parseExcelData, mergeTopicsWithExcelData } from "../services/parserService.js";
import { INITIAL_TOPICS } from "../data/defaultData.js";

export function FileImporter({
  topics,
  settings,
  customDayCapacities = {},
  onCustomCapacitiesUpdated,
  onTopicsUpdated,
  onSettingsUpdated,
  fsSyncStatus,
  onConnectFileSystem,
  onDisconnectFileSystem,
  onTriggerManualSave
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isFsAccessSupported = typeof window !== "undefined" && "showOpenFilePicker" in window;

  // Handle transparent File System Access connection
  const handleConnectFileClick = async () => {
    if (!onConnectFileSystem) {
      setNotification({
        type: "error",
        message: "Gestore sincronizzazione File System non configurato."
      });
      return;
    }
    setIsProcessing(true);
    setNotification(null);
    try {
      const res = await onConnectFileSystem();
      if (res && res.fileName) {
        setNotification({
          type: "success",
          message: `Sincronizzazione attiva con "${res.fileName}"! ${res.imported ? "Dati importati dal file." : "Stato attuale salvato nel file."} Ogni modifica verrà riscritta automaticamente.`
        });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setNotification({
          type: "error",
          message: `Errore durante il collegamento file: ${err.message}`
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Process a selected or dropped file
  const handleFile = async (file) => {
    if (!file) return;
    setIsProcessing(true);
    setNotification(null);

    try {
      const fileName = file.name;
      const lowerName = fileName.toLowerCase();

      if (lowerName.endsWith(".json")) {
        // Restore JSON backup
        const text = await file.text();
        const backup = JSON.parse(text);
        if (backup.topics && Array.isArray(backup.topics)) {
          onTopicsUpdated(backup.topics);
          if (backup.settings && onSettingsUpdated) {
            onSettingsUpdated(backup.settings);
          }
          if (backup.customDayCapacities && onCustomCapacitiesUpdated) {
            onCustomCapacitiesUpdated(backup.customDayCapacities);
          }
          setNotification({
            type: "success",
            message: `Backup JSON "${fileName}" ripristinato con successo!`
          });
        } else {
          throw new Error("Formato del file di backup JSON non valido.");
        }
      } else if (lowerName.endsWith(".csv") || lowerName.endsWith(".txt")) {
        // Read text as CSV
        const text = await file.text();
        const parsed = parseCSVString(text, fileName);

        if (parsed.length === 0) {
          throw new Error("Nessuna riga valida trovata nel file CSV/TXT.");
        }

        // Merge with existing topics: if IDs already exist, update them; else append
        const existingMap = new Map(topics.map(t => [t.id.toUpperCase(), t]));
        let newCount = 0;
        let updatedCount = 0;

        parsed.forEach(p => {
          const key = p.id.toUpperCase();
          if (existingMap.has(key)) {
            existingMap.set(key, { ...existingMap.get(key), ...p });
            updatedCount++;
          } else {
            existingMap.set(key, p);
            newCount++;
          }
        });

        const mergedList = Array.from(existingMap.values());
        onTopicsUpdated(mergedList);

        setNotification({
          type: "success",
          message: `File CSV "${fileName}" caricato con successo! Aggiunti ${newCount} nuovi argomenti, aggiornati ${updatedCount}.`
        });
      } else if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".ods") || lowerName.endsWith(".xls")) {
        // Read binary as Excel / ODS
        const arrayBuffer = await file.arrayBuffer();
        const excelData = parseExcelData(arrayBuffer, fileName);

        // Merge completion status with existing topics
        const { topics: mergedTopics, matchedCount } = mergeTopicsWithExcelData(topics, excelData);
        onTopicsUpdated(mergedTopics);

        setNotification({
          type: "success",
          message: `File Excel "${fileName}" sincronizzato! Rilevati ${excelData.completedIds.size} ID completati e sincronizzati ${matchedCount} argomenti nel piano.`
        });
      } else {
        throw new Error("Formato non supportato. Carica un file .csv, .txt, .xlsx, .ods o .json.");
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: `Errore durante il parsing: ${err.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Reset to default repo UNIMORE dataset
  const handleResetToDefault = () => {
    onTopicsUpdated(INITIAL_TOPICS);
    setNotification({
      type: "success",
      message: "Dataset originale UNIMORE ricaricato in memoria (63 argomenti: 32 Analisi 1 + 31 Geometria)."
    });
  };

  // Export updated study plan as Excel (.xlsx)
  const handleExportExcel = () => {
    if (typeof XLSX === "undefined") {
      alert("Libreria SheetJS (XLSX) non caricata.");
      return;
    }

    const dataToExport = topics.map(t => ({
      ID: t.id,
      Materia: t.materia,
      Capitolo: t.capitolo || "",
      Argomento: t.argomento,
      "Ore Stimate": t.oreStimate,
      "Ore Effettive (con buffer)": t.effectiveHours || t.oreStimate,
      Difficoltà: t.difficolta,
      Priorità: t.prioritaEsame,
      Stato: t.isCompleted ? "Completato" : "Da fare",
      "Data Completamento": t.completedDate || "",
      "Giorno Assegnato": t.assignedDayName || "",
      "Data Assegnata": t.assignedDate || "",
      "Settimana": t.assignedWeek || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Piano Ribilanciato");

    XLSX.writeFile(workbook, "Piano_Studi_Ribilanciato_UNIMORE.xlsx");
  };

  // Download complete JSON Backup
  const handleExportJsonBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      settings,
      topics,
      customDayCapacities
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Backup_StudyPlan_UNIMORE_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* File System Access API Transparent Auto-Sync Box */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-5 md:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className={`p-3 rounded-2xl flex-shrink-0 border ${
              fsSyncStatus?.active
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
            }`}>
              <IconFileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Sincronizzazione Trasparente File System
                </h3>
                {fsSyncStatus?.active ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-pulse-subtle">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    ATTIVA
                  </span>
                ) : (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Non collegato
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Collega direttamente un file JSON salvato su <strong>iCloud Drive</strong>, <strong>Google Drive</strong> o sul tuo computer tramite la <em>File System Access API</em>. L'app sovrascriverà automaticamente il file ad ogni modifica, eliminando la necessità di scaricare backup manuali!
              </p>

              {fsSyncStatus?.active && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-cyan-300">
                    📁 File: <strong>{fsSyncStatus.fileName}</strong>
                  </span>
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-emerald-400">
                    ✓ Ultimo salvataggio: {fsSyncStatus.lastSaved || "In attesa..."}
                  </span>
                  {fsSyncStatus.isSaving && (
                    <span className="text-cyan-400 animate-pulse text-[11px]">
                      Scrittura su disco in corso...
                    </span>
                  )}
                  {fsSyncStatus.error && (
                    <span className="text-rose-400 text-[11px]">
                      ⚠️ {fsSyncStatus.error}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center flex-shrink-0">
            {fsSyncStatus?.active ? (
              <>
                <button
                  type="button"
                  onClick={onTriggerManualSave}
                  className="px-3.5 py-2 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <IconSave className="w-4 h-4" />
                  Salva Ora su File
                </button>
                <button
                  type="button"
                  onClick={onDisconnectFileSystem}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Disconnetti
                </button>
              </>
            ) : isFsAccessSupported ? (
              <button
                type="button"
                onClick={handleConnectFileClick}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-950/50 flex items-center gap-2"
              >
                <IconFileCheck className="w-4 h-4" />
                <span>Collega File JSON (iCloud / Drive)</span>
              </button>
            ) : (
              <div className="text-[11px] text-amber-300/80 bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl max-w-xs">
                La File System Access API non è supportata da questo browser (usa Chrome, Edge o Opera per l'auto-sync trasparente).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Persistence Status Box */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <IconSave className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-300">
              Salvataggio Dati Automatico Attivo
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ogni modifica (completamento argomenti, ribilanciamento, date, impostazioni) è memorizzata in tempo reale nel tuo browser (<strong>LocalStorage</strong>). Non perderai nulla ricaricando o chiudendo la pagina.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportJsonBackup}
          className="text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 flex-shrink-0"
        >
          <IconDownload className="w-3.5 h-3.5" />
          Scarica Backup JSON
        </button>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition backdrop-blur-md relative overflow-hidden ${
          isDragging
            ? "border-cyan-400 bg-cyan-950/30 scale-[1.01]"
            : "border-slate-700/80 bg-slate-900/60 hover:border-slate-600"
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl flex items-center justify-center">
            <IconUpload className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              Carica file di studio o backup
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Trascina qui i file <strong>CSV</strong>, i file <strong>Excel / ODS</strong> o un <strong>Backup JSON</strong>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-950/40 inline-flex items-center gap-2">
              <IconUpload className="w-4 h-4" />
              <span>Seleziona File (CSV, Excel, Backup JSON)</span>
              <input
                type="file"
                accept=".csv,.txt,.xlsx,.ods,.xls,.json"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleResetToDefault}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition inline-flex items-center gap-2"
            >
              <IconRefresh className="w-4 h-4 text-cyan-400" />
              <span>Carica Dataset Ufficiale UNIMORE</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-emerald-500/30 transition inline-flex items-center gap-2"
            >
              <IconDownload className="w-4 h-4 text-emerald-400" />
              <span>Esporta Excel (.xlsx)</span>
            </button>
          </div>

          {isProcessing && (
            <div className="text-xs text-cyan-400 font-medium animate-pulse mt-2">
              Elaborazione del file in corso lato client...
            </div>
          )}
        </div>
      </div>

      {/* Notification banner */}
      {notification && (
        <div className={`p-4 rounded-2xl text-xs md:text-sm font-medium border flex items-center justify-between ${
          notification.type === "success"
            ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
            : "bg-rose-950/50 border-rose-500/40 text-rose-200"
        }`}>
          <div className="flex items-center space-x-2">
            <IconCheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 ml-2"
          >
            Chiudi
          </button>
        </div>
      )}

      {/* Summary of Local Workspace Files */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <IconBookOpen className="w-4 h-4 text-cyan-400" />
          File UNIMORE supportati e compatibili
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="font-bold text-emerald-300 mb-1">1. Geometria.txt / Geometria.csv</div>
            <p className="text-slate-400">
              CSV contenente ID, Capitolo, Argomenti, Ore_Stimate, Difficoltà e Priorità (G-01 a G-31).
            </p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="font-bold text-cyan-300 mb-1">2. Analisi.csv / Analisi.txt</div>
            <p className="text-slate-400">
              CSV dei 32 slot ufficiali del corso di Analisi Matematica 1 (A-01 a A-32) con syllabus completo.
            </p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="font-bold text-indigo-300 mb-1">3. Excel / ODS Tracker</div>
            <p className="text-slate-400">
              Fogli <code>Tracker Analisi 1</code>, <code>Tracker Geometria</code> e <code>Teoremi</code> con colonna <code>Stato</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
