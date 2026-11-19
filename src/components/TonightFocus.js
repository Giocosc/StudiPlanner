import React, { useState, useEffect } from "react";
import { IconPlay, IconPause, IconCheck, IconX, IconBookOpen } from "./Icons.js";

const TIMER_STORAGE_KEY = "studiplanner_tonight_timer_v1";
const POMODORO_MS = 25 * 60 * 1000;

const readStoredTimer = () => {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.topicId ? parsed : null;
  } catch (e) {
    return null;
  }
};

const writeStoredTimer = (timer) => {
  try {
    if (timer) localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timer));
    else localStorage.removeItem(TIMER_STORAGE_KEY);
  } catch (e) {
    // archiviazione non disponibile: il timer resta solo in memoria
  }
};

const elapsedOf = (timer, now) => {
  if (!timer) return 0;
  return Number(timer.accumulatedMs || 0) + (timer.startedAt ? Math.max(0, now - timer.startedAt) : 0);
};

const formatClock = (ms) => {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const fmtHours = (h) => {
  const n = Number(h || 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, "").replace(".", ",");
};

// Durate pianificate: sotto l'ora in minuti, sopra in ore con la virgola
const fmtDuration = (h) => {
  const n = Number(h || 0);
  if (n < 1) return `${Math.max(1, Math.round(n * 60))} min`;
  return `${(Math.round(n * 10) / 10).toString().replace(".", ",")} h`;
};

/**
 * Esiti degli esercizi d'esame svolti senza appunti, più la fiducia 1-5.
 * Usato dalla modalità Stasera e dal modale "Registra studio".
 */
export function ExerciseOutcomeInput({ exercises, onChange, confidence, onConfidenceChange, compact = false }) {
  const total = exercises.correct + exercises.partial + exercises.wrong;
  const adjust = (key, delta) => onChange({ ...exercises, [key]: Math.max(0, Math.min(20, exercises[key] + delta)) });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-ink">Esercizi d'esame senza appunti</span>
        <span className="text-xs text-ink-2 tabular">
          {total > 0 ? `${exercises.correct} su ${total} giusti` : "Facoltativo, ma rende la previsione reale"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: "correct", label: "Giusti", tone: "text-ok-ink" },
          { key: "partial", label: "Parziali", tone: "text-warn-ink" },
          { key: "wrong", label: "Sbagliati", tone: "text-danger-ink" }
        ].map(item => (
          <div key={item.key} className={`bg-fill rounded-xl ${compact ? "p-1.5" : "p-2"} flex flex-col items-center gap-1`}>
            <span className={`text-xs font-semibold ${item.tone}`}>{item.label}</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => adjust(item.key, -1)} aria-label={`${item.label}: meno uno`}
                className="w-7 h-7 rounded-full bg-paper shadow-seg text-ink font-bold">−</button>
              <span className="w-5 text-center text-base font-bold text-ink tabular">{exercises[item.key]}</span>
              <button type="button" onClick={() => adjust(item.key, 1)} aria-label={`${item.label}: più uno`}
                className="w-7 h-7 rounded-full bg-paper shadow-seg text-ink font-bold">+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-ink-2 mr-1">Quanto ti senti sicuro?</span>
        {[1, 2, 3, 4, 5].map(level => (
          <button key={level} type="button"
            onClick={() => onConfidenceChange(confidence === level ? 0 : level)}
            aria-pressed={confidence === level}
            className={`w-8 h-8 rounded-full text-xs font-bold transition ${
              confidence === level ? "bg-accent text-paper" : "bg-fill text-ink hover:brightness-95"
            }`}>{level}</button>
        ))}
        <span className="text-[11px] text-ink-3">1 = per niente, 5 = lo spiegherei a un compagno</span>
      </div>
    </div>
  );
}

/**
 * Modalità Stasera: una sola azione chiara. Un tocco avvia il timer sull'argomento
 * giusto; alla fine la sessione viene registrata da sola e si chiedono solo gli esiti.
 */
export function TonightFocus({ focus, settings, onLogStudySession, onOpenTopicDetail, onOpenLogModal }) {
  const [timer, setTimer] = useState(readStoredTimer);
  const [now, setNow] = useState(Date.now());
  const [isWrapUp, setIsWrapUp] = useState(false);
  const [hours, setHours] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [exercises, setExercises] = useState({ correct: 0, partial: 0, wrong: 0 });
  const [confidence, setConfidence] = useState(0);
  const [savedMessage, setSavedMessage] = useState(null);

  useEffect(() => {
    if (!timer || !timer.startedAt) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => { writeStoredTimer(timer); }, [timer]);

  const topic = focus && focus.topic;
  // Un timer avviato su un altro argomento resta valido: si chiude su quello
  const timerTopic = timer ? (timer.topicId === topic?.id ? topic : { id: timer.topicId, argomento: timer.argomento || "", materia: timer.materia || "" }) : null;
  const elapsed = elapsedOf(timer, now);
  const isRunning = Boolean(timer && timer.startedAt);

  const start = () => {
    if (!topic) return;
    setSavedMessage(null);
    setTimer({ topicId: topic.id, argomento: topic.argomento, materia: topic.materia, startedAt: Date.now(), accumulatedMs: 0, plannedHours: focus.plannedHours });
    setNow(Date.now());
  };
  const pause = () => setTimer(t => (t ? { ...t, accumulatedMs: elapsedOf(t, Date.now()), startedAt: null } : t));
  const resume = () => { setTimer(t => (t ? { ...t, startedAt: Date.now() } : t)); setNow(Date.now()); };
  const discard = () => {
    if (elapsed > 60000 && !confirm("Scartare il tempo cronometrato senza registrarlo?")) return;
    setTimer(null);
    setIsWrapUp(false);
  };

  const finish = () => {
    const ms = elapsedOf(timer, Date.now());
    pause();
    const rounded = Math.max(0.25, Math.round((ms / 3600000) * 4) / 4);
    setHours(rounded);
    const residue = Number(topic && topic.id === timer.topicId ? (topic.oreResidue ?? focus.plannedHours) : 0);
    setCompleted(residue > 0 && rounded >= residue);
    setExercises({ correct: 0, partial: 0, wrong: 0 });
    setConfidence(0);
    setIsWrapUp(true);
  };

  const save = () => {
    const total = exercises.correct + exercises.partial + exercises.wrong;
    onLogStudySession && onLogStudySession({
      topicId: timer.topicId,
      date: settings.currentSimulatedDate,
      hours,
      completed,
      note: "Sessione Stasera",
      ...(total > 0 ? { exercises } : {}),
      ...(confidence >= 1 ? { confidence } : {})
    });
    setSavedMessage(total > 0
      ? `Registrate ${fmtHours(hours)} h su ${timer.topicId}: ${exercises.correct} su ${total} giusti.`
      : `Registrate ${fmtHours(hours)} h su ${timer.topicId}.`);
    setTimer(null);
    setIsWrapUp(false);
  };

  // Chiusura della sessione: si chiede solo ciò che serve
  if (timer && isWrapUp) {
    return (
      <section className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex flex-col gap-4" aria-label="Chiudi la sessione di stasera">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="eyebrow">Fine sessione</span>
            <h3 className="text-[22px] font-bold tracking-tight mt-0.5">{timer.topicId} · {timerTopic?.argomento}</h3>
          </div>
          <button type="button" onClick={() => setIsWrapUp(false)} className="text-ink-2 hover:text-ink p-1" aria-label="Torna al timer">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-ink-2">Tempo registrato</span>
          <div className="flex items-center gap-1 bg-fill rounded-full p-1">
            <button type="button" onClick={() => setHours(h => Math.max(0.25, Number((h - 0.25).toFixed(2))))}
              className="w-8 h-8 rounded-full bg-paper shadow-seg font-bold" aria-label="Meno 15 minuti">−</button>
            <span className="px-3 text-base font-bold tabular">{fmtHours(hours)} h</span>
            <button type="button" onClick={() => setHours(h => Math.min(12, Number((h + 0.25).toFixed(2))))}
              className="w-8 h-8 rounded-full bg-paper shadow-seg font-bold" aria-label="Più 15 minuti">+</button>
          </div>
          <label className="flex items-center gap-2 text-[13px] text-ink cursor-pointer">
            <input type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)} className="w-4 h-4 accent-[#0071E3]" />
            Argomento finito
          </label>
        </div>
        <ExerciseOutcomeInput exercises={exercises} onChange={setExercises} confidence={confidence} onConfidenceChange={setConfidence} />
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={discard} className="h-10 px-4 rounded-full text-sm font-semibold text-ink-2 hover:bg-fill">Scarta</button>
          <button type="button" onClick={save}
            className="h-10 px-5 rounded-full bg-accent hover:bg-accent-hover text-paper text-sm font-semibold flex items-center gap-1.5 active:scale-[0.97] transition">
            <IconCheck className="w-4 h-4" /> Registra sessione
          </button>
        </div>
      </section>
    );
  }

  // Timer in corso
  if (timer) {
    const plannedMs = Number(timer.plannedHours || 0) * 3600000;
    const pct = plannedMs > 0 ? Math.min(100, Math.round((elapsed / plannedMs) * 100)) : 0;
    const pomodoroIndex = Math.floor(elapsed / POMODORO_MS) + 1;
    const inPomodoro = elapsed % POMODORO_MS;
    const isBreakHint = elapsed >= POMODORO_MS && inPomodoro < 5 * 60 * 1000;
    return (
      <section className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex flex-col gap-4" aria-label="Sessione di stasera in corso">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="eyebrow">{isRunning ? "In corso" : "In pausa"} · Blocco {pomodoroIndex}</span>
            <h3 className="text-[22px] font-bold tracking-tight mt-0.5 truncate">{timer.topicId} · {timerTopic?.argomento}</h3>
            <p className="text-[13px] text-ink-2 mt-0.5">
              {isBreakHint ? "Hai chiuso un blocco da 25 minuti: alzati 5 minuti, poi riprendi." : "Telefono lontano, solo carta e penna."}
            </p>
          </div>
          <span className="text-[34px] md:text-[40px] font-bold tracking-tight tabular leading-none">{formatClock(elapsed)}</span>
        </div>
        {plannedMs > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 rounded-full bg-black/[0.07] overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-ink-2">Previste {fmtDuration(timer.plannedHours)} · {pct}%</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {isRunning ? (
            <button type="button" onClick={pause} className="h-10 px-4 rounded-full bg-fill text-ink text-sm font-semibold flex items-center gap-1.5">
              <IconPause className="w-4 h-4" /> Pausa
            </button>
          ) : (
            <button type="button" onClick={resume} className="h-10 px-4 rounded-full bg-fill text-ink text-sm font-semibold flex items-center gap-1.5">
              <IconPlay className="w-4 h-4" /> Riprendi
            </button>
          )}
          <button type="button" onClick={finish}
            className="h-10 px-5 rounded-full bg-accent hover:bg-accent-hover text-paper text-sm font-semibold flex items-center gap-1.5 active:scale-[0.97] transition">
            <IconCheck className="w-4 h-4" /> Ho finito
          </button>
          <button type="button" onClick={discard} className="h-10 px-4 rounded-full text-sm font-semibold text-ink-2 hover:bg-fill ml-auto">Scarta</button>
        </div>
      </section>
    );
  }

  // Nessun timer: una sola azione chiara
  let eyebrow = "Stasera";
  let title;
  let subtitle = null;
  let action = null;
  if (focus && focus.kind === "study" && topic) {
    title = `${topic.id} ${topic.argomento}`;
    subtitle = `${fmtDuration(focus.plannedHours)}${focus.partLabel ? ` · ${focus.partLabel}` : ""}${focus.reviewsCount > 0 ? ` · prima ${focus.reviewsCount} ${focus.reviewsCount === 1 ? "ripasso" : "ripassi"} da 15 minuti` : ""}`;
    action = (
      <button type="button" onClick={start}
        className="h-11 px-6 rounded-full bg-accent hover:bg-accent-hover text-paper text-[15px] font-semibold flex items-center gap-2 active:scale-[0.97] transition shrink-0">
        <IconPlay className="w-4 h-4" /> Inizia
      </button>
    );
  } else if (focus && focus.kind === "exam") {
    title = "Oggi c'è l'esame. Niente studio: respira, hai fatto il lavoro.";
  } else if (focus && focus.kind === "rest") {
    title = "Stasera riposo.";
    subtitle = focus.reviewsCount > 0 ? `Se ti va, ${focus.reviewsCount} ${focus.reviewsCount === 1 ? "ripasso breve" : "ripassi brevi"}. La serie è al sicuro.` : "La serie è al sicuro. Recuperare fa parte del piano.";
  } else if (focus && focus.kind === "done") {
    title = "Per stasera hai finito.";
    subtitle = `${fmtHours(focus.studiedHours)} h registrate oggi. Ottimo lavoro.`;
  } else {
    title = "Nessuno studio pianificato stasera.";
    action = (
      <button type="button" onClick={() => onOpenLogModal && onOpenLogModal({ date: settings.currentSimulatedDate })}
        className="h-10 px-4 rounded-full bg-accent-tint text-accent-ink text-sm font-semibold shrink-0">Registra studio</button>
    );
  }

  return (
    <section className="bg-paper rounded-[20px] p-5 md:p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4" aria-label="Cosa fare stasera">
      <div className="min-w-0 flex flex-col gap-1">
        <span className="eyebrow">{eyebrow}</span>
        <h3 className="text-[22px] md:text-[26px] font-bold tracking-tight leading-tight">{title}</h3>
        {subtitle && <p className="text-[13px] text-ink-2">{subtitle}</p>}
        {savedMessage && <p className="text-[13px] text-ok-ink font-medium">{savedMessage}</p>}
        {focus && focus.kind === "study" && topic && onOpenTopicDetail && (
          <button type="button" onClick={() => onOpenTopicDetail(topic.id)}
            className="self-start mt-1 text-[13px] font-medium text-accent-ink flex items-center gap-1 hover:underline">
            <IconBookOpen className="w-3.5 h-3.5" /> Scheda dell'argomento
          </button>
        )}
      </div>
      {action}
    </section>
  );
}
