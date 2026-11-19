/**
 * Calendar Export Service (.ics / iCalendar)
 * Esporta il piano di studio serale e weekend di StudiPlanner in formato standard .ics
 * compatibile con Google Calendar, Apple Calendar, Microsoft Outlook e Thunderbird.
 */

export function formatIcsDateTime(dateStr, timeStr) {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:mm"
  const cleanDate = dateStr.replace(/-/g, "");
  const [hours, mins] = timeStr.split(":");
  return `${cleanDate}T${hours.padStart(2, "0")}${mins.padStart(2, "0")}00`;
}

export function addHoursToTime(timeStr, hoursToAdd) {
  const [h, m] = timeStr.split(":").map(Number);
  const totalMins = Math.round(h * 60 + m + hoursToAdd * 60);
  const newH = Math.floor(totalMins / 60) % 24;
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export function escapeIcsText(text) {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Spezza le righe oltre 75 ottetti come richiesto da RFC 5545 (§3.1).
 */
export function foldIcsLine(line) {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const parts = [];
  let current = "";
  for (const ch of line) {
    const limit = parts.length === 0 ? 75 : 74; // le righe di continuazione iniziano con uno spazio
    if (encoder.encode(current + ch).length > limit) {
      parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts.join("\r\n ");
}

/** Orario di inizio dalla fascia del giorno (es. "Sera (19:00 - 21:30)"), altrimenti il default. */
function getStartTime(day) {
  const match = String(day.timeSlot || "").match(/(\d{1,2}):(\d{2})/);
  if (match) return `${match[1].padStart(2, "0")}:${match[2]}`;
  return day.isWeekend ? "10:00" : "19:30";
}

/** Blocchi di studio pianificati nel giorno (escluse sessioni già registrate e argomenti completati). */
export function getPlannedTopics(day) {
  return (day.topics || []).filter(t => !t.isSessionLog && !(t.completato || t.isCompleted));
}

export function generateIcsCalendar(calendarDays = []) {
  const now = new Date();
  const dtStamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//StudiPlanner//UNIMORE Ingegneria Informatica//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:StudiPlanner UNIMORE (Analisi 1 & Geometria)",
    "X-WR-TIMEZONE:Europe/Rome",
    "X-WR-CALDESC:Programma di studio ottimizzato per studente lavoratore UNIMORE"
  ];

  calendarDays.forEach(day => {
    // Solo Oggi e giorni futuri: il passato è già nello Storico
    if (day.isPast) return;
    const planned = getPlannedTopics(day);
    if (planned.length === 0) return;

    const startTimeStr = getStartTime(day);
    const plannedHours = Number(planned.reduce((acc, t) => acc + Number(t.effectiveHours || 0), 0).toFixed(2));
    const durationHours = plannedHours > 0 ? plannedHours : Number(day.maxHours) || (day.isWeekend ? 4.5 : 2.5);
    const endTimeStr = addHoursToTime(startTimeStr, durationHours);

    const startDt = formatIcsDateTime(day.date, startTimeStr);
    // Fine dopo la mezzanotte: si passa al giorno successivo
    const [sh, sm] = startTimeStr.split(":").map(Number);
    const endsNextDay = sh * 60 + sm + Math.round(durationHours * 60) >= 24 * 60;
    const endDate = endsNextDay ? nextDateStr(day.date) : day.date;
    const endDt = formatIcsDateTime(endDate, endTimeStr);

    const label = t => `${t.id} ${t.argomento || t.titolo || ""}`.trim() + (t.isSplit ? ` (Parte ${t.partIndex}/${t.partCount})` : "");
    const topicsSummary = planned.map(label).join(" + ");
    const topicsListDesc = planned
      .map(t => `• [${t.id}] ${t.argomento || t.titolo || ""}${t.isSplit ? ` - Parte ${t.partIndex}/${t.partCount}` : ""} (${Number(t.effectiveHours || 0)}h, ${t.materia})`)
      .join("\n");

    const description = `Sessione di Studio StudiPlanner UNIMORE\n` +
      `Data: ${day.date} (${day.dayName})\n` +
      `Ore pianificate: ${durationHours}h\n\n` +
      `Argomenti in programma:\n${topicsListDesc}`;

    const uid = `studiplanner-${day.date}@studiplanner.local`;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART:${startDt}`);
    lines.push(`DTEND:${endDt}`);
    lines.push(`SUMMARY:${escapeIcsText(`Studio: ${topicsSummary}`)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
    lines.push("LOCATION:Postazione Studio / Casa");
    lines.push("STATUS:CONFIRMED");
    lines.push("TRANSP:OPAQUE");
    lines.push("BEGIN:VALARM");
    lines.push("TRIGGER:-PT15M");
    lines.push("ACTION:DISPLAY");
    lines.push(`DESCRIPTION:${escapeIcsText(`Inizio studio tra 15 minuti: ${topicsSummary}`)}`);
    lines.push("END:VALARM");
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.map(foldIcsLine).join("\r\n");
}

function nextDateStr(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().split("T")[0];
}

export function downloadIcsCalendar(calendarDays = [], filename = "StudiPlanner_UNIMORE_Calendario.ics") {
  const icsContent = generateIcsCalendar(calendarDays);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
