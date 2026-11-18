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

  calendarDays.forEach((day, index) => {
    if (!day.scheduledTopics || day.scheduledTopics.length === 0) return;

    // Determine start and end time based on weekday vs weekend
    const startTimeStr = day.isWeekend ? "10:00" : "19:30";
    const capacityHours = Number(day.effectiveCapacity) || (day.isWeekend ? 4.5 : 2.5);
    const endTimeStr = addHoursToTime(startTimeStr, capacityHours);

    const startDt = formatIcsDateTime(day.date, startTimeStr);
    const endDt = formatIcsDateTime(day.date, endTimeStr);

    const topicsSummary = day.scheduledTopics
      .map(t => `${t.id} ${t.argomento || t.titolo || ""}`.trim())
      .join(" + ");

    const topicsListDesc = day.scheduledTopics
      .map(t => `• [${t.id}] ${t.argomento || t.titolo || ""} (${t.oreStimate}h stimate, ${t.materia})`)
      .join("\n");

    const description = `Sessione di Studio StudiPlanner UNIMORE\n` +
      `Data: ${day.date} (${day.dayName})\n` +
      `Ore assegnate: ${capacityHours}h\n\n` +
      `Argomenti in programma:\n${topicsListDesc}\n\n` +
      `Obiettivo Sessione Esami: 10 Gennaio 2027.`;

    const uid = `sp-${day.date}-${index}@studiplanner.unimore.it`;

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
  return lines.join("\r\n");
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
