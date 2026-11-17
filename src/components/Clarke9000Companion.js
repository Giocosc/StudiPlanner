import React, { useState, useEffect, useMemo, useRef } from "react";

// --- DIZIONARIO CITAZIONI & LOG PER CLARKE-9000 ---
// Frasi ispirate ad Arthur C. Clarke, HAL 9000, grandi scienziati ed incoraggiamento per lo studente lavoratore
const CLARKE_QUOTES = [
  (ctx) => `"L'unico modo per scoprire i limiti del possibile è avventurarsi un po' oltre di essi nell'impossibile." — Arthur C. Clarke`,
  (ctx) => `"Qualunque tecnologia sufficientemente avanzata è indistinguibile dalla magia. Lo stesso vale per una dimostrazione matematica elegante." — A. C. Clarke`,
  (ctx) => `"Buonasera. Sto mettendo me stesso al massimo delle mie potenzialità: il massimo che qualsiasi entità cosciente possa compiere." — HAL 9000`,
  (ctx) => `Parametri orbitali stabili. Allineamento per la finestra del 10 Gennaio in corso. Mantieni la traiettoria su Analisi 1.`,
  (ctx) => `Integrità operativa al 100%. Rilevo una sessione di studio attiva: nessun accenno di distrazione nei sensori di bordo.`,
  (ctx) => `"Prima di diventare saggi dobbiamo essere sciocchi; prima di saper camminare dobbiamo inciampare." Persisti sui passaggi ostici. — A. C. Clarke`,
  (ctx) => `T-minus ${ctx.days} giorni alla sessione del 10 Gennaio 2027. Con un ritmo costante di 2.5h a sera, il completamento del piano è garantito.`,
  (ctx) => `"Quello che non posso creare, non lo capisco." Ricostruisci ogni singolo teorema dai primi principi. — Richard Feynman`,
  (ctx) => `Non temere il calcolo matriciale. Il teorema di Rouché-Capelli è deterministico, esattamente come i miei banchi di memoria.`,
  (ctx) => `"La Terra è la culla dell'umanità, ma non si può vivere per sempre in una culla." Espandi la tua frontiera cognitiva. — K. Tsiolkovsky`,
  (ctx) => `So che hai lavorato a tempo pieno oggi. Ma questa fascia serale è la spinta gravitazionale che farà tutta la differenza.`,
  (ctx) => `"Da qualche parte, qualcosa di incredibile è in attesa di essere conosciuto." Mantieni puntato il telescopio. — Carl Sagan`,
  (ctx) => `I polinomi di Taylor sono solo il nostro modo per approssimare l'infinito, un termine alla volta. Procedi con calma.`,
  (ctx) => `"In matematica non si capiscono le cose, ci si abitua solo ad esse." La tua memoria sinaptica si sta consolidando. — J. Von Neumann`,
  (ctx) => `Analisi 1 al ${ctx.aPct}%, Geometria al ${ctx.gPct}%. Nessuna anomalia termica riscontrata nel carico di lavoro.`,
  (ctx) => `Non posso permettere che la stanchezza comprometta la missione. Se serve, concediti 5 minuti di respiro: io resto vigile.`,
  (ctx) => `"Non c'era una seconda possibilità: il software doveva funzionare al primo colpo." Medesima disciplina per il compito scritto. — Margaret Hamilton`,
  (ctx) => `"Possiamo solo vedere una breve distanza davanti a noi, ma possiamo vedere che c'è molto da fare." Un esercizio alla volta. — Alan Turing`,
  (ctx) => `Autovalori e autospazi allineati con la matrice del tuo obiettivo accademico. Continua così.`,
  (ctx) => `"La ricerca scientifica è ciò che sto facendo quando non so cosa sto facendo." Non aver timore dell'ignoto. — Wernher von Braun`,
  (ctx) => `Completamento globale al ${ctx.globPct}%. La fionda gravitazionale verso UNIMORE sta accelerando la traiettoria.`,
  (ctx) => `Affascinante dimostrazione. Anche con le mie capacità di calcolo euristico, apprezzo la precisione di questo teorema.`,
  (ctx) => `Vettore di stato nominale. Il buffer del +20% sugli argomenti complessi garantisce la massima resilienza temporale.`,
  (ctx) => `"Oltrepassata l'eliopausa del dubbio, ogni formula matematica diventa improvvisamente limpida." — Clarke-9000 Log`,
  (ctx) => `Buon proseguimento di studio. I miei banchi ottici registrano un focus impeccabile per questa serata.`
];

const LOCAL_STORAGE_KEY_COLLAPSED = "unimore_clarke9000_collapsed";
const LOCAL_STORAGE_KEY_MUTED = "unimore_clarke9000_muted";

export function Clarke9000Companion({ progress, metrics }) {
  // Safe stats
  const analisi = progress?.analisi || { completedHours: 0, totalHours: 0, percent: 0 };
  const geometria = progress?.geometria || { completedHours: 0, totalHours: 0, percent: 0 };
  const global = progress?.global || { completedHours: 0, totalHours: 0, percent: 0 };

  const aPct = analisi.totalHours > 0
    ? Math.round((analisi.completedHours / analisi.totalHours) * 100)
    : (analisi.percent || 0);

  const gPct = geometria.totalHours > 0
    ? Math.round((geometria.completedHours / geometria.totalHours) * 100)
    : (geometria.percent || 0);

  const globPct = global.totalHours > 0
    ? Math.round((global.completedHours / global.totalHours) * 100)
    : (global.percent || 0);

  const contextData = useMemo(() => ({
    aPct,
    gPct,
    globPct,
    days: metrics?.remainingDays || 54,
    weeks: metrics?.remainingWeeks || 8
  }), [aPct, gPct, globPct, metrics]);

  // Is panel open or collapsed to icon
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COLLAPSED);
      return saved === "true"; // default collapsed (false) if not saved
    } catch (e) {
      return false;
    }
  });

  // Mute periodic automatic popup
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_MUTED) === "true";
    } catch (e) {
      return false;
    }
  });

  // Current quote index
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * CLARKE_QUOTES.length));

  // Pulse animation trigger on new message
  const [hasNewMessagePing, setHasNewMessagePing] = useState(false);

  // Typewriter text
  const currentFullText = useMemo(() => {
    const fn = CLARKE_QUOTES[quoteIndex % CLARKE_QUOTES.length];
    return fn(contextData);
  }, [quoteIndex, contextData]);

  const [displayText, setDisplayText] = useState(currentFullText);

  // Typewriter effect
  useEffect(() => {
    let charIndex = 0;
    setDisplayText("");
    const timer = setInterval(() => {
      charIndex++;
      setDisplayText(currentFullText.slice(0, charIndex));
      if (charIndex >= currentFullText.length) {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [currentFullText]);

  // Periodic thought emission every 40 seconds (if not muted)
  useEffect(() => {
    if (isMuted) return;

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CLARKE_QUOTES.length);
      setHasNewMessagePing(true);
      setTimeout(() => setHasNewMessagePing(false), 3000);
    }, 45000);

    return () => clearInterval(interval);
  }, [isMuted]);

  // Toggle expand
  const toggleExpanded = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_COLLAPSED, String(next));
    } catch (e) {}
  };

  // Toggle mute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_MUTED, String(next));
    } catch (e) {}
  };

  // Demand next quote
  const nextQuote = (e) => {
    if (e) e.stopPropagation();
    setQuoteIndex((prev) => Math.floor(Math.random() * CLARKE_QUOTES.length));
    setHasNewMessagePing(true);
    setTimeout(() => setHasNewMessagePing(false), 1500);
  };

  return (
    <aside
      aria-label="Assistente CLARKE-9000"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end select-none font-mono"
    >
      {/* Speech Panel / Floating HUD (visible when expanded) */}
      {isExpanded && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-black/95 border border-rose-500/40 p-4 shadow-2xl shadow-rose-950/40 backdrop-blur-xl text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-900/40 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold tracking-wider text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                CLARKE-9000 // MONOLOGO
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-400">
              <button
                type="button"
                onClick={nextQuote}
                className="p-1 hover:text-rose-300 rounded hover:bg-rose-950/40 transition"
                title="Nuova riflessione"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${
                  isMuted ? "bg-slate-800 text-slate-400" : "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                }`}
                title={isMuted ? "Audio/Auto: Silenziato" : "Auto-messaggi attivi ogni 45s"}
              >
                {isMuted ? "SILENZIATO" : "LIVE"}
              </button>
              <button
                type="button"
                onClick={toggleExpanded}
                className="p-1 hover:text-white rounded hover:bg-slate-800 transition text-sm leading-none"
                title="Comprimi"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Typewriter Body */}
          <div className="min-h-[64px] flex items-center py-1">
            <p className="text-xs sm:text-[13px] leading-relaxed text-rose-100 font-sans tracking-normal">
              {displayText}
              <span className="inline-block ml-1 font-mono font-bold text-rose-400 animate-pulse">
                ▌
              </span>
            </p>
          </div>

          {/* Micro Telemetry Footer */}
          <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>TARGET: 10_GEN_2027</span>
            <span>T-MINUS: {metrics?.remainingDays || 54}gg</span>
          </div>
        </div>
      )}

      {/* Floating Eye Button (HAL 9000 Style Optical Lens) */}
      <button
        type="button"
        onClick={toggleExpanded}
        className={`group relative flex items-center justify-center transition-all duration-300 rounded-full focus:outline-none ${
          isExpanded ? "scale-95" : "scale-100 hover:scale-105"
        }`}
        title="CLARKE-9000 — Clicca per aprire o minimizzare"
      >
        {/* Outer glowing halo when pinging */}
        <div
          className={`absolute -inset-1 rounded-full blur-md transition duration-500 ${
            hasNewMessagePing || isExpanded
              ? "bg-rose-500/50 opacity-100"
              : "bg-rose-900/30 opacity-40 group-hover:opacity-80"
          }`}
        />

        {/* Chassis: Chrome & Glossy Black Ring */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-slate-700 via-slate-900 to-black p-1 shadow-2xl border border-slate-600 flex items-center justify-center">
          {/* Inner bezel */}
          <div className="w-full h-full rounded-full bg-black p-1.5 flex items-center justify-center border border-slate-800">
            {/* The Iconic HAL / CLARKE Glowing Red Eye */}
            <div
              className={`w-full h-full rounded-full transition-all duration-300 relative overflow-hidden flex items-center justify-center ${
                hasNewMessagePing ? "animate-pulse" : ""
              }`}
              style={{
                background:
                  "radial-gradient(circle at 45% 45%, #ff8888 0%, #ff1133 35%, #880011 70%, #220004 100%)",
                boxShadow: "0 0 16px rgba(255, 30, 60, 0.8), inset 0 0 6px rgba(255, 255, 255, 0.4)"
              }}
            >
              {/* Pupil point reflection */}
              <div className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_4px_#fff]" />
            </div>
          </div>
        </div>

        {/* Floating Tooltip Pill if collapsed */}
        {!isExpanded && (
          <div className="absolute right-full mr-3 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-rose-500/40 text-[11px] font-bold text-rose-300 whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            CLARKE-9000
          </div>
        )}
      </button>
    </aside>
  );
}
