import React, { useState, useEffect } from "react";
import { IconPlay, IconPause, IconCheck, IconTrash } from "./Icons.js";
import { MOCK_EXAM_SUBJECTS } from "../services/rebalancerEngine.js";

const MOCK_TIMER_STORAGE_KEY = "studiplanner_mock_exam_timer_v1";
const MOCK_SUBJECT_COLORS = { analisi: "#5E5CE6", geometria: "#0A9396" };
const MOCK_PASS_PCT = 18 / 30;

const readMockTimer = () => {
  try {
    const raw = localStorage.getItem(MOCK_TIMER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && MOCK_EXAM_SUBJECTS[parsed.subject] ? parsed : null;
  } catch (e) {
    return null;
  }
};
const writeMockTimer = (timer) => {
  try {
    if (timer) localStorage.setItem(MOCK_TIMER_STORAGE_KEY, JSON.stringify(timer));
    else localStorage.removeItem(MOCK_TIMER_STORAGE_KEY);
  } catch (e) {
    // archiviazione non disponibile: il timer resta in memoria
  }
};
const mockElapsedOf = (t, now) => (t ? Number(t.accumulatedMs || 0) + (t.startedAt ? Math.max(0, now - t.startedAt) : 0) : 0);
const mockClock = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h > 0 ? `${h}:` : ""}${String(m).padStart(h > 0 ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
};
const mockShortDate = (d) => {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${Number(day)}/${Number(m)}`;
};
const mockScoreLabel = (e) => `${String(e.score).replace(".", ",")}/${e.maxScore || 30}`;

/** Curva dei voti nei temi d'esame: una linea per materia, soglia 18/30 tratteggiata. */
function MockExamChart({ stats, targetExamDate }) {
  const [hover, setHover] = useState(null);
  const series = Object.values(stats.bySubject).filter(s => s.points.length > 0);
  if (series.length === 0) return null;

  const W = 560, H = 190, padL = 34, padR = 78, padT = 12, padB = 26;
  const allDates = series.flatMap(s => s.points.map(p => p.date));
  const minDate = [stats.startDate, ...allDates].sort()[0];
  const maxDate = [targetExamDate, ...allDates].sort().slice(-1)[0];
  const dayNumber = (d) => {
    const [yy, mm, dd] = d.split("-").map(Number);
    return Date.UTC(yy, mm - 1, dd) / 86400000;
  };
  const toDays = (d) => dayNumber(d) - dayNumber(minDate);
  const span = Math.max(1, toDays(maxDate));
  const x = (d) => padL + (toDays(d) / span) * (W - padL - padR);
  const y = (pct) => padT + (1 - pct) * (H - padT - padB);

  // Etichette dirette a fine linea, distanziate di almeno 13px per non sovrapporsi
  const labelY = {};
  series
    .map(sr => ({ subject: sr.subject, y: y(sr.points[sr.points.length - 1].pct) + 4 }))
    .sort((p1, p2) => p1.y - p2.y)
    .forEach((lbl, i, arr) => {
      const prevY = i > 0 ? labelY[arr[i - 1].subject] : -Infinity;
      labelY[lbl.subject] = Math.max(lbl.y, prevY + 13);
    });

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={`Curva dei voti: ${series.map(s => `${s.label} ultimo ${mockScoreLabel(s.last)}`).join(", ")}`}>
        {[0, 0.5, 1].map(v => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            <text x={padL - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#6E6E73">{Math.round(v * 30)}</text>
          </g>
        ))}
        <line x1={padL} x2={W - padR} y1={y(MOCK_PASS_PCT)} y2={y(MOCK_PASS_PCT)} stroke="#6E6E73" strokeWidth="1" strokeDasharray="4 4" />
        <text x={W - padR + 6} y={y(MOCK_PASS_PCT) + 4} fontSize="11" fill="#6E6E73">18 sufficienza</text>
        <text x={padL} y={H - 6} fontSize="11" fill="#6E6E73">{mockShortDate(minDate)}</text>
        <text x={W - padR} y={H - 6} fontSize="11" fill="#6E6E73" textAnchor="end">esame {mockShortDate(targetExamDate)}</text>
        {series.map(s => {
          const color = MOCK_SUBJECT_COLORS[s.subject];
          const d = s.points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.date).toFixed(1)},${y(p.pct).toFixed(1)}`).join(" ");
          const last = s.points[s.points.length - 1];
          return (
            <g key={s.subject}>
              {s.points.length > 1 && <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
              {s.points.map(p => (
                <g key={p.id}>
                  <circle cx={x(p.date)} cy={y(p.pct)} r="4.5" fill={color} stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx={x(p.date)} cy={y(p.pct)} r="13" fill="transparent" tabIndex="0"
                    aria-label={`${s.label}, ${mockShortDate(p.date)}: ${mockScoreLabel(p)}`}
                    onPointerEnter={() => setHover({ ...p, label: s.label, color, px: x(p.date) / W, py: y(p.pct) / H })}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover({ ...p, label: s.label, color, px: x(p.date) / W, py: y(p.pct) / H })}
                    onBlur={() => setHover(null)} />
                </g>
              ))}
              <text x={x(last.date) + 9} y={labelY[s.subject]} fontSize="11" fontWeight="600" fill="#1D1D1F">{s.label}</text>
            </g>
          );
        })}
      </svg>
      {hover && (
        <div className="absolute pointer-events-none bg-paper shadow-float rounded-lg px-2.5 py-1.5 text-xs -translate-x-1/2 -translate-y-full"
          style={{ left: `${hover.px * 100}%`, top: `calc(${hover.py * 100}% - 10px)` }}>
          <div className="font-bold text-ink tabular">{mockScoreLabel(hover)}</div>
          <div className="flex items-center gap-1.5 text-ink-2">
            <span className="inline-block w-3 h-0.5 rounded" style={{ background: hover.color }} />
            {hover.label} · {mockShortDate(hover.date)}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3 mt-1 text-xs text-ink-2">
        {series.map(s => (
          <span key={s.subject} className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 rounded" style={{ background: MOCK_SUBJECT_COLORS[s.subject] }} />
            {s.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t border-dashed border-ink-2" /> sufficienza
        </span>
      </div>
    </div>
  );
}

/**
 * Temi d'esame settimanali a tempo: cronometro con durata reale (Analisi 120 min,
 * Geometria 90), voto finale e curva dei risultati.
 */
export function MockExamPanel({ stats, settings, mockExams = [], onSaveMockExam, onDeleteMockExam }) {
  const [timer, setTimer] = useState(readMockTimer);
  const [now, setNow] = useState(Date.now());
  const [scoring, setScoring] = useState(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => { writeMockTimer(timer); }, [timer]);
  useEffect(() => {
    if (!timer || !timer.startedAt) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [timer]);

  if (!stats) return null;
  const subjects = Object.values(stats.bySubject);
  const due = subjects.filter(s => s.isDueThisWeek);

  const start = (subject) => {
    setScoring(null);
    setTimer({ subject, durationMin: MOCK_EXAM_SUBJECTS[subject].durationMin, startedAt: Date.now(), accumulatedMs: 0 });
    setNow(Date.now());
  };
  const pause = () => setTimer(t => (t ? { ...t, accumulatedMs: mockElapsedOf(t, Date.now()), startedAt: null } : t));
  const resume = () => { setTimer(t => (t ? { ...t, startedAt: Date.now() } : t)); setNow(Date.now()); };
  const stop = () => {
    const elapsedMin = Math.round(mockElapsedOf(timer, Date.now()) / 60000);
    setScoring({ subject: timer.subject, durationMin: Math.min(timer.durationMin, Math.max(1, elapsedMin)), score: "", maxScore: 30, note: "" });
    setTimer(null);
  };
  const discard = () => {
    if (!confirm("Annullare il tema in corso?")) return;
    setTimer(null);
  };
  const save = () => {
    const score = Number(String(scoring.score).replace(",", "."));
    const maxScore = Number(scoring.maxScore) > 0 ? Number(scoring.maxScore) : 30;
    if (!Number.isFinite(score) || score < 0 || score > maxScore) return;
    onSaveMockExam && onSaveMockExam({
      id: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      date: settings.currentSimulatedDate,
      subject: scoring.subject,
      durationMin: scoring.durationMin,
      score,
      maxScore,
      note: scoring.note.trim(),
      updatedAt: Date.now()
    });
    setScoring(null);
  };

  let body;
  if (timer) {
    const remaining = timer.durationMin * 60000 - mockElapsedOf(timer, now);
    const isOver = remaining <= 0;
    body = (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">{MOCK_EXAM_SUBJECTS[timer.subject].label} · {timer.durationMin} minuti</span>
            <div className="text-[44px] font-bold tracking-tight tabular leading-none mt-1">{isOver ? "0:00" : mockClock(remaining)}</div>
            <p className="text-[13px] text-ink-2 mt-1">
              {isOver ? "Tempo scaduto: posa la penna e correggi con la soluzione." : "Come all'esame: niente appunti, niente formulario, niente telefono."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isOver && (timer.startedAt ? (
              <button type="button" onClick={pause} className="h-10 px-4 rounded-full bg-fill text-ink text-sm font-semibold flex items-center gap-1.5">
                <IconPause className="w-4 h-4" /> Pausa
              </button>
            ) : (
              <button type="button" onClick={resume} className="h-10 px-4 rounded-full bg-fill text-ink text-sm font-semibold flex items-center gap-1.5">
                <IconPlay className="w-4 h-4" /> Riprendi
              </button>
            ))}
            <button type="button" onClick={stop} className="h-10 px-5 rounded-full bg-accent hover:bg-accent-hover text-paper text-sm font-semibold flex items-center gap-1.5">
              <IconCheck className="w-4 h-4" /> Consegna
            </button>
            <button type="button" onClick={discard} className="h-10 px-4 rounded-full text-sm font-semibold text-ink-2 hover:bg-fill">Annulla</button>
          </div>
        </div>
      </div>
    );
  } else if (scoring) {
    const scoreNum = Number(String(scoring.score).replace(",", "."));
    const valid = scoring.score !== "" && Number.isFinite(scoreNum) && scoreNum >= 0 && scoreNum <= Number(scoring.maxScore || 30);
    body = (
      <div className="flex flex-col gap-3">
        <span className="text-[13px] text-ink-2">
          {MOCK_EXAM_SUBJECTS[scoring.subject].label}, {scoring.durationMin} minuti. Correggi con la soluzione e segna il voto.
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-[13px] font-semibold text-ink" htmlFor="mock-score">Voto</label>
          <input id="mock-score" type="text" inputMode="decimal" value={scoring.score} autoFocus
            onChange={e => setScoring(s => ({ ...s, score: e.target.value }))}
            className="w-20 h-10 px-3 rounded-xl bg-fill text-ink text-base font-bold tabular focus:outline-none" placeholder="es. 21" />
          <span className="text-ink-2">su</span>
          <input type="number" min="1" max="100" value={scoring.maxScore}
            onChange={e => setScoring(s => ({ ...s, maxScore: e.target.value }))}
            className="w-20 h-10 px-3 rounded-xl bg-fill text-ink text-base tabular focus:outline-none" aria-label="Punteggio massimo" />
        </div>
        <input type="text" value={scoring.note} onChange={e => setScoring(s => ({ ...s, note: e.target.value }))}
          placeholder="Cosa è andato storto? (facoltativo)"
          className="h-10 px-3 rounded-xl bg-fill text-ink text-sm focus:outline-none" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setScoring(null)} className="h-10 px-4 rounded-full text-sm font-semibold text-ink-2 hover:bg-fill">Scarta</button>
          <button type="button" onClick={save} disabled={!valid}
            className="h-10 px-5 rounded-full bg-accent hover:bg-accent-hover text-paper text-sm font-semibold disabled:opacity-40">Salva voto</button>
        </div>
      </div>
    );
  } else {
    body = (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {subjects.map(s => (
            <button key={s.subject} type="button" onClick={() => start(s.subject)}
              className={`h-10 px-4 rounded-full text-sm font-semibold flex items-center gap-1.5 transition ${
                s.isDueThisWeek ? "bg-accent text-paper hover:bg-accent-hover" : "bg-fill text-ink hover:brightness-95"
              }`}>
              <IconPlay className="w-4 h-4" /> {s.label} · {s.durationMin} min
              {s.doneThisWeek && <span className="text-ok-ink ml-1">✓</span>}
            </button>
          ))}
        </div>
        <MockExamChart stats={stats} targetExamDate={settings.targetExamDate} />
        {subjects.some(s => s.last) && (
          <div className="grid grid-cols-2 gap-2">
            {subjects.filter(s => s.last).map(s => (
              <div key={s.subject} className="bg-canvas rounded-xl p-3">
                <div className="text-xs text-ink-2">{s.label} · ultimo tema</div>
                <div className="text-lg font-bold tracking-tight tabular mt-0.5">
                  {mockScoreLabel(s.last)}
                  {s.delta !== null && s.delta !== 0 && (
                    <span className="text-[13px] font-medium text-ink-2 ml-1.5">
                      {s.delta > 0 ? "▲" : "▼"} {Math.abs(Math.round(s.delta * 30))} rispetto al precedente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {mockExams.length > 0 && (
          <div>
            <button type="button" onClick={() => setShowList(v => !v)} className="text-[13px] font-medium text-accent-ink hover:underline">
              {showList ? "Nascondi i temi svolti" : `Vedi i temi svolti (${mockExams.length})`}
            </button>
            {showList && (
              <ul className="mt-2 divide-y divide-black/[0.06]">
                {mockExams.map(e => (
                  <li key={e.id} className="flex items-center justify-between gap-3 py-2 text-[13px]">
                    <span className="min-w-0">
                      <span className="font-semibold text-ink">{MOCK_EXAM_SUBJECTS[e.subject]?.label || e.subject}</span>
                      <span className="text-ink-2"> · {mockShortDate(e.date)} · {e.durationMin} min · </span>
                      <span className="font-semibold text-ink tabular">{mockScoreLabel(e)}</span>
                      {e.note && <span className="text-ink-2"> · {e.note}</span>}
                    </span>
                    <button type="button" onClick={() => { if (confirm("Eliminare questo tema?")) onDeleteMockExam && onDeleteMockExam(e.id); }}
                      className="p-1.5 rounded-full text-ink-3 hover:text-danger-ink hover:bg-fill" aria-label="Elimina tema">
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }

  const [, sm, sd] = stats.startDate.split("-");
  const subtitle = timer || scoring
    ? null
    : stats.isActive
      ? (due.length > 0
        ? `Questa settimana: ${due.map(s => `${s.label} (${s.durationMin} min)`).join(" e ")}.`
        : "Temi della settimana fatti. Il prossimo tra pochi giorni.")
      : `Dal ${Number(sd)}/${Number(sm)}: un tema vero per materia a settimana. Puoi iniziare anche prima.`;

  return (
    <section className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex flex-col gap-4" aria-label="Temi d'esame a tempo">
      <div>
        <span className="text-[13px] font-semibold text-ink-2">Temi d'esame a tempo</span>
        <h3 className="text-[22px] font-bold tracking-tight mt-0.5">
          {timer ? "Tema in corso" : scoring ? "Com'è andata?" : stats.total > 0 ? `${stats.total} ${stats.total === 1 ? "tema svolto" : "temi svolti"}` : "Simula l'esame vero"}
        </h3>
        {subtitle && <p className="text-[13px] text-ink-2 mt-0.5">{subtitle}</p>}
      </div>
      {body}
    </section>
  );
}
