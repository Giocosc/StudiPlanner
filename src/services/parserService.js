/**
 * Parser Service for Study Plan Rebalancer
 * Handles CSV parsing (Analisi / Geometria) and Excel / ODS parsing (.xlsx, .ods, .xls)
 * Merges data and detects completed IDs / Argomenti based on Excel sheets.
 */

/**
 * Robust CSV string parser (handles quotes, commas, semicolons, tabs)
 */
export function parseCSVString(csvContent, filename = "") {
  if (!csvContent || typeof csvContent !== "string") return [];

  // Determine delimiter: comma, semicolon or tab
  const firstLine = csvContent.split(/\r?\n/)[0] || "";
  let delimiter = ",";
  if (firstLine.includes(";") && !firstLine.includes(",")) {
    delimiter = ";";
  } else if (firstLine.includes("\t") && !firstLine.includes(",")) {
    delimiter = "\t";
  }

  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const parseRow = (line) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        if (inQuotes && line[i + 1] === char) {
          cur += char;
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map(h => h.trim().toLowerCase());

  // Map header indices
  const getIndex = (aliases) => {
    return headers.findIndex(h => aliases.some(alias => h.includes(alias)));
  };

  const idIdx = getIndex(["id", "codice", "slot", "n."]);
  const materiaIdx = getIndex(["materia", "corso", "subject"]);
  const capitoloIdx = getIndex(["capitolo", "blocco", "sezione", "modulo"]);
  const argomentoIdx = getIndex(["argomento", "argomenti", "teorici", "nome", "titolo", "descrizione"]);
  const oreIdx = getIndex(["ore_stimate", "ore", "stima", "durata", "hours"]);
  const diffIdx = getIndex(["difficoltà", "difficolta", "diff", "difficulty"]);
  const prioritaIdx = getIndex(["priorità", "priorita", "peso", "priority"]);
  const statoIdx = getIndex(["stato", "status", "completato", "fatto", "done"]);

  // Infer subject from filename if not in CSV column
  let fallbackSubject = "Materia Generale";
  const lowerFilename = filename.toLowerCase();
  if (lowerFilename.includes("analisi")) {
    fallbackSubject = "Analisi 1";
  } else if (lowerFilename.includes("geometria")) {
    fallbackSubject = "Geometria";
  }

  const parsedTopics = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseRow(lines[i]);
    if (row.length === 0 || row.every(c => c === "")) continue;

    const id = idIdx !== -1 && row[idIdx] ? row[idIdx] : `TOPIC-${i}`;
    const materia = materiaIdx !== -1 && row[materiaIdx] ? row[materiaIdx] : fallbackSubject;
    const capitolo = capitoloIdx !== -1 && row[capitoloIdx] ? row[capitoloIdx] : "Generale";
    const argomento = argomentoIdx !== -1 && row[argomentoIdx] ? row[argomentoIdx] : (row[2] || `Argomento ${i}`);

    let rawOre = oreIdx !== -1 && row[oreIdx] ? row[oreIdx] : "2.5";
    rawOre = String(rawOre).replace("h", "").replace(",", ".");
    const oreStimate = Math.max(0.5, parseFloat(rawOre) || 2.5);

    let rawDiff = diffIdx !== -1 && row[diffIdx] ? row[diffIdx] : "3";
    const difficolta = Math.min(5, Math.max(1, parseInt(rawDiff, 10) || 3));

    let rawPriorita = prioritaIdx !== -1 && row[prioritaIdx] ? row[prioritaIdx] : "3";
    let prioritaEsame = 3;
    if (typeof rawPriorita === "string") {
      const lower = rawPriorita.toLowerCase();
      if (lower.includes("altissima") || lower === "5") prioritaEsame = 5;
      else if (lower.includes("alta") || lower === "4") prioritaEsame = 4;
      else if (lower.includes("media") || lower === "3") prioritaEsame = 3;
      else if (lower.includes("bassa") || lower === "2") prioritaEsame = 2;
      else if (lower.includes("bassissima") || lower === "1") prioritaEsame = 1;
      else prioritaEsame = parseInt(rawPriorita, 10) || 3;
    }

    let isCompleted = false;
    if (statoIdx !== -1 && row[statoIdx]) {
      const st = row[statoIdx].toLowerCase().trim();
      isCompleted = ["completato", "fatto", "done", "completata", "si", "yes", "1", "true", "superato"].includes(st);
    }

    parsedTopics.push({
      id,
      materia,
      capitolo,
      argomento,
      oreStimate,
      difficolta,
      prioritaEsame,
      isCompleted
    });
  }

  return parsedTopics;
}

/**
 * Parses an Excel or ODS file buffer using SheetJS (XLSX)
 * Extracts sheets, rows, and detects completion status
 */
export function parseExcelData(arrayBuffer, filename = "") {
  if (typeof XLSX === "undefined") {
    throw new Error("SheetJS (XLSX) library is not loaded. Please ensure xlsx.full.min.js is available.");
  }

  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetNames = workbook.SheetNames;

  const completedIds = new Set();
  const completedKeywords = [];
  const rawRows = [];

  sheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    // Convert to array of objects
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    data.forEach((row, idx) => {
      rawRows.push({ ...row, __sheet: sheetName, __rowIdx: idx });

      // Look for a status column
      let isDone = false;
      let rowId = null;
      let rowTopic = null;

      Object.entries(row).forEach(([colKey, colVal]) => {
        const key = colKey.toLowerCase();
        const val = String(colVal).trim().toLowerCase();

        // Check if key is ID
        if (key === "id" || key.includes("codice") || key === "slot" || key === "codice slot") {
          rowId = String(colVal).trim();
        }

        // Check if key is Argomento / Teorema
        if (key.includes("argoment") || key.includes("teorema") || key.includes("dimostrazione") || key.includes("titolo")) {
          rowTopic = String(colVal).trim();
        }

        // Check for completed status
        if (key.includes("stato") || key.includes("status") || key.includes("completat") || key.includes("fatto")) {
          if (["completato", "fatto", "done", "completata", "si", "yes", "1", "true", "superato", "studiato"].includes(val)) {
            isDone = true;
          }
        }
      });

      if (isDone) {
        if (rowId) completedIds.add(rowId.toUpperCase());
        if (rowTopic && rowTopic.length > 4) {
          completedKeywords.push(rowTopic.toLowerCase());
        }
      }
    });
  });

  return {
    filename,
    sheetNames,
    completedIds,
    completedKeywords,
    totalRows: rawRows.length,
    rawRows
  };
}

/**
 * Normalizes text for fuzzy topic matching
 */
function cleanTextForMatching(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Merges topic list with completion data extracted from Excel
 */
export function mergeTopicsWithExcelData(topics, excelParsedData) {
  if (!excelParsedData) return { topics, matchedCount: 0 };

  const { completedIds, completedKeywords } = excelParsedData;
  let matchedCount = 0;

  const merged = topics.map(topic => {
    // If already completed in memory, keep it completed
    if (topic.isCompleted) return topic;

    let shouldMarkCompleted = false;

    // 1. Direct ID match (e.g. "A-01", "G-01", "S1-A", "1")
    const topicIdUpper = topic.id.toUpperCase();
    if (completedIds.has(topicIdUpper)) {
      shouldMarkCompleted = true;
    }

    // Check if slot code matches (e.g. S1-A, S2-B)
    for (const compId of completedIds) {
      if (topicIdUpper.includes(compId) || compId.includes(topicIdUpper)) {
        shouldMarkCompleted = true;
        break;
      }
    }

    // 2. Keyword/Sub-string match on topic name
    if (!shouldMarkCompleted && completedKeywords.length > 0) {
      const cleanTopic = cleanTextForMatching(topic.argomento);
      for (const kw of completedKeywords) {
        const cleanKw = cleanTextForMatching(kw);
        // If keyword contains at least 3 significant words and overlaps
        const words = cleanKw.split(" ").filter(w => w.length > 3);
        const matchCount = words.filter(w => cleanTopic.includes(w)).length;
        if (words.length >= 3 && matchCount / words.length >= 0.6) {
          shouldMarkCompleted = true;
          break;
        }
        if (cleanTopic.includes(cleanKw) || cleanKw.includes(cleanTopic)) {
          shouldMarkCompleted = true;
          break;
        }
      }
    }

    if (shouldMarkCompleted) {
      matchedCount++;
      return {
        ...topic,
        isCompleted: true,
        completedSource: "Excel Sync"
      };
    }

    return topic;
  });

  return {
    topics: merged,
    matchedCount,
    totalTopics: merged.length
  };
}
