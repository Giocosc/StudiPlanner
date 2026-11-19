import assert from "assert";
import { test } from "./harness.mjs";
import { INITIAL_TOPICS } from "../src/data/defaultData.js";
import { rebalanceStudyPlan } from "../src/services/rebalancerEngine.js";
import { generateIcsCalendar, getPlannedTopics } from "../src/services/calendarExportService.js";

const plan = () => rebalanceStudyPlan(
  INITIAL_TOPICS.map(t => ({ ...t, completato: false, oreEffettive: 0 })),
  { currentSimulatedDate: "2026-11-19" }
);

test("ics: un evento per ogni giorno futuro con studio pianificato", () => {
  const p = plan();
  const ics = generateIcsCalendar(p.calendarDays);
  const expected = p.calendarDays.filter(d => !d.isPast && getPlannedTopics(d).length > 0).length;
  assert.ok(expected > 40);
  assert.strictEqual((ics.match(/BEGIN:VEVENT/g) || []).length, expected);
});

test("ics: orari dalla fascia del giorno e durata = ore pianificate", () => {
  const p = plan();
  const ics = generateIcsCalendar(p.calendarDays);
  // 20/11/2026 è venerdì: fascia 19:00 - 21:30
  assert.ok(ics.includes("DTSTART:20261120T190000"), "venerdì alle 19:00");
  assert.ok(ics.includes("DTSTART:20261121T100000"), "sabato alle 10:00");
  const fri = p.calendarDays.find(d => d.date === "2026-11-20");
  const hours = getPlannedTopics(fri).reduce((a, t) => a + t.effectiveHours, 0);
  const endMin = 19 * 60 + Math.round(hours * 60);
  const hh = String(Math.floor(endMin / 60)).padStart(2, "0");
  const mm = String(endMin % 60).padStart(2, "0");
  assert.ok(ics.includes(`DTEND:20261120T${hh}${mm}00`));
});

test("ics: righe piegate entro 75 ottetti e niente giorni passati", () => {
  const p = plan();
  const ics = generateIcsCalendar(p.calendarDays);
  const enc = new TextEncoder();
  ics.split("\r\n").forEach(line => assert.ok(enc.encode(line).length <= 75, line));
  assert.ok(!ics.includes("DTSTART:20261118"));
});
