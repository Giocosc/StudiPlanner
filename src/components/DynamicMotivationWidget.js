import React, { useState, useEffect, useMemo, useRef } from "react";

// --- DIZIONARIO ESTESO: MODALITÀ 1 - TERMINALE SCI-FI (Arthur C. Clarke / Deep Space / Aerospace) ---
// Almeno 25 frasi/log scientifico-aerospaziali con citazioni reali e telemetria orbitale
const SCIFI_LOGS = [
  (ctx) => `> A.C. CLARKE: "L'unico modo per scoprire i limiti del possibile è avventurarsi un po' oltre di essi nell'impossibile." Manovra di traslazione avviata.`,
  (ctx) => `> ORBITAL_TRAJECTORY: Allineamento per la finestra del 10 Gennaio in corso. Propulsori cognitivi per Analisi 1 operativi al ${ctx.aPct}%.`,
  (ctx) => `> SYS_LOG: Integrità scudi mentali nominale al 100%. Vettore di stato per Geometria orientato al ${ctx.gPct}%. Avviare sequenza di calcolo integrale.`,
  (ctx) => `> A.C. CLARKE: "Qualunque tecnologia sufficientemente avanzata è indistinguibile dalla magia." Ogni dimostrazione matematica ne è la prova vivente.`,
  (ctx) => `> DEEP_SPACE_TELEMETRY: T-minus ${ctx.days} cicli planetari alla finestra di inserzione del 10 Gennaio 2027. Coordinate di navigazione acquisite.`,
  (ctx) => `> R. FEYNMAN: "Quello che non posso creare, non lo capisco." Ricostruire ogni singolo teorema di Analisi dai primi principi logici.`,
  (ctx) => `> NAVIGATION_COMPUTER: Fionda gravitazionale impostata sui limiti notevoli. Vettore accelerazione Delta-V in costante incremento.`,
  (ctx) => `> SYS_MONITOR: Calcolo matriciale e algebra lineare al ${ctx.gPct}%. Matrici di transizione sincronizzate per l'iper-salto.`,
  (ctx) => `> K. TSIOLKOVSKY: "La Terra è la culla dell'umanità, ma non si può vivere per sempre in una culla." Espandi la tua frontiera cognitiva.`,
  (ctx) => `> CORE_REACTOR: Fusione nucleare del focus attiva. Temperatura reattore stabile. Spinta serale da 2.5h pienamente agganciata.`,
  (ctx) => `> A.C. CLARKE: "Prima di diventare saggi dobbiamo essere sciocchi; prima di saper camminare dobbiamo inciampare." Persisti sulle serie numeriche.`,
  (ctx) => `> AVIONICS_BUS: Bus dati ARINC-429 sincronizzato. Rouché-Capelli decodificato: rango conforme ai vettori dello spazio affine.`,
  (ctx) => `> C. SAGAN: "Da qualche parte, qualcosa di incredibile è in attesa di essere conosciuto." Mantieni puntato il telescopio analitico.`,
  (ctx) => `> SUBSYSTEM_ANALYSIS: Polinomi di Taylor pressurizzati. Approssimazione di ordine superiore al ${ctx.aPct}% di precisione orbitale.`,
  (ctx) => `> J. VON NEUMANN: "In matematica non si capiscono le cose, ci si abitua solo ad esse." Il condizionamento neurale procede come previsto.`,
  (ctx) => `> COMM_RELAY: Ricevuta trasmissione dal Deep Space Network UNIMORE. Segnale limpido: avanzamento globale al ${ctx.globPct}%.`,
  (ctx) => `> THRUSTER_STATUS: Spinta ionica continua rilevata: ${ctx.aHours}h di Analisi e ${ctx.gHours}h di Geometria convertite in moto rettilineo uniforme.`,
  (ctx) => `> W. VON BRAUN: "La ricerca scientifica è ciò che sto facendo quando non so cosa sto facendo." Esplora le coniche senza esitazione.`,
  (ctx) => `> LIFE_SUPPORT: Sistemi primari di ossigenazione e concentrazione nei limiti ottimali. Nessuna anomalia termica nei banchi sinaptici.`,
  (ctx) => `> M. HAMILTON: "Non c'era una seconda possibilità: il software doveva funzionare al primo colpo." Medesima disciplina per il compito scritto.`,
  (ctx) => `> HAL_9000_INTERFACE: "Sto mettendo me stesso al massimo delle mie potenzialità: il massimo che qualsiasi entità cosciente possa compiere."`,
  (ctx) => `> MATRIX_ALIGNMENT: Autovalori e autospazi allineati con la matrice di rotazione celeste. ${ctx.gHours}h di Geometria consolidate nel nucleo.`,
  (ctx) => `> A. TURING: "Possiamo solo vedere una breve distanza davanti a noi, ma possiamo vedere che c'è molto da fare." Procedi, passo dopo passo.`,
  (ctx) => `> QUANTUM_SENSORS: La funzione d'onda collassa sul target di superamento: ${ctx.aHours}h svolte su Analisi 1, residuo stimato ${ctx.aRem}h.`,
  (ctx) => `> VOYAGER_LOG: Oltrepassata l'eliopausa dell'incertezza. Vettore di fuga dalla mediocrità tracciato con precisione nanometrica.`
];

// --- DIZIONARIO ESTESO: MODALITÀ 2 - CONSOLE TELEMETRICA (DevOps / Cruscotto Moto RPM / Racing) ---
// Almeno 25 frasi/log su efficienza meccanica, giri motore, cambi marcia e telemetria industriale
const TELEMETRY_LOGS = [
  (ctx) => `[ TELEMETRIA ] Analisi 1: Efficienza blocco motore al ${ctx.aPct}%. Regime di rotazione stabile a 8.200 RPM.`,
  (ctx) => `[ STATUS ] Geometria: Carico di picco raggiunto al ${ctx.gPct}%. Innestare marcia superiore per completare Matrici e Sistemi Lineari.`,
  (ctx) => `[ SYSTEM ] Focus RPM ottimale. Mantieni la velocità di crociera senza scendere sotto la coppia massima per i prossimi 50 minuti.`,
  (ctx) => `[ SENSORI ] Temperatura cognitiva nei parametri (87°C). Grip sui teoremi confermato. Aprire progressivamente il gas sulla teoria.`,
  (ctx) => `[ MOTOPROPULSORE ] Mappatura ECU: MAP 1 (Race Full-Power). Nessun taglio di accensione registrato su limiti, derivate e integrali.`,
  (ctx) => `[ ASSETTO_PISTA ] Carico aerodinamico ottimale. Teorema di Rouché-Capelli impostato in traiettoria corda-curva a 140 km/h.`,
  (ctx) => `[ DEVOPS_PIPELINE ] CI/CD Pipeline #1001-2027: Build superata con zero fallimenti. Deploy della conoscenza continuo in produzione.`,
  (ctx) => `[ RPM_LIMITER ] Regime massimo consentito: 11.500 RPM. Shift light lampeggiante: erogate ${ctx.aHours}h su ${ctx.aTotal}h di Analisi 1.`,
  (ctx) => `[ SENSORI_PRESSIONE ] Pressione pneumatici corretta a 2.1 bar. Nessun accenno di sottosterzo sulle dimostrazioni di integrali impropri.`,
  (ctx) => `[ PIT_WALL ] Comunicazione radio dai box: "Box in this lap negato. Mantieni il passo da 2.5h/sera, sei costantemente sotto il delta time."`,
  (ctx) => `[ TELEMETRIA ] Geometria & Spazi Vettoriali: ${ctx.gHours}h acquisite sul banco dinamico. Vibrazioni smorzate, coppia motrice lineare.`,
  (ctx) => `[ SYSTEM_HEALTH ] Load Average: 0.42, 0.38, 0.35. Cluster neurale scalato su nodi ad alte prestazioni. Zero pacchetti di memoria persi.`,
  (ctx) => `[ CRUSCOTTO_MOTO ] Quick-shifter bidirezionale attivo: cambiata istantanea da Taylor a De L'Hôpital senza calo di coppia motrice.`,
  (ctx) => `[ TELEMETRIA_FRENI ] Impianto carboceramico in temperatura: staccata millimetrica su coniche, quadriche e rette nello spazio.`,
  (ctx) => `[ TELEMETRY_FEED ] Efficienza volumetrica globale al ${ctx.globPct}%. Combustione stechiometrica perfetta della sessione di studio.`,
  (ctx) => `[ INGEGNERIA_CORSE ] Curvone veloce 'Serie Numeriche': farfalla aperta al 100% prima del punto di corda. Giro record in arrivo.`,
  (ctx) => `[ SENSORI_IMU ] Piattaforma inerziale a 6 assi: angolo di piega sui teoremi a 58°. Avantreno granitico, nessun principio di deriva.`,
  (ctx) => `[ LATENCY_PROBE ] Ping verso server UNIMORE: 1.2ms. Risposta sinaptica immediata sull'algoritmo di eliminazione di Gauss.`,
  (ctx) => `[ KERS_SYSTEM ] Sistema di recupero energetico attivo: 4.5h del weekend convertite in spinta pura per le settimane di picco.`,
  (ctx) => `[ TELEMETRIA ] Target 10 Gennaio nel mirino telemetrico: rimangono ${ctx.days} stint di gara prima della bandiera a scacchi.`,
  (ctx) => `[ CONSUMO_CARBURANTE ] Flusso regolato: 2.5 litri equivalenti di concentrazione profonda. Nessuna penalità da scontare in pit lane.`,
  (ctx) => `[ CRUSCOTTO_MOTO ] 6ª marcia piena inserita sul rettilineo del traguardo. Manetta spalancata verso la sessione d'esame.`,
  (ctx) => `[ MONITORING_DEVOPS ] Grafana Alerting: Latency p99 < 50ms sui quiz a risposta multipla. Affidabilità del sistema: 99.999%.`,
  (ctx) => `[ TRACTION_CONTROL ] Controllo trazione su Livello 2: modulazione chirurgica della potenza per superare le derivate parziali.`,
  (ctx) => `[ BANCO_PROVA ] Potenza erogata: 215 CV alla ruota. Banco prova certifica l'assoluta solidità strutturale del piano di Geometria.`
];

const LOCAL_STORAGE_KEY_MODE = "unimore_motivation_widget_mode";

export function DynamicMotivationWidget({
  progress,
  analisi: propAnalisi,
  geometria: propGeometria,
  metrics: propMetrics,
  onTabChange
}) {
  // Mode toggle state: "scifi" | "telemetry" (persisted in localStorage)
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MODE);
      if (saved === "scifi" || saved === "telemetry") return saved;
    } catch (e) {
      console.warn("Could not read widget mode preference", e);
    }
    return "scifi";
  });

  const toggleMode = () => {
    const nextMode = mode === "scifi" ? "telemetry" : "scifi";
    setMode(nextMode);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_MODE, nextMode);
    } catch (e) {
      console.warn("Could not save widget mode preference", e);
    }
  };

  // Safe progress extraction and calculations
  const analisi = propAnalisi || progress?.analisi || {
    completedHours: 0,
    totalHours: 0,
    percent: 0,
    completedCount: 0,
    totalCount: 0,
    remainingHours: 0
  };
  const geometria = propGeometria || progress?.geometria || {
    completedHours: 0,
    totalHours: 0,
    percent: 0,
    completedCount: 0,
    totalCount: 0,
    remainingHours: 0
  };
  const global = progress?.global || {
    completedHours: 0,
    totalHours: 0,
    percent: 0,
    completedCount: 0,
    totalCount: 0,
    remainingHours: 0
  };
  const metrics = propMetrics || {
    remainingDays: 54,
    remainingWeeks: 8,
    requiredWeeklyHours: 21
  };

  const aPct = analisi.totalHours > 0
    ? Math.round((analisi.completedHours / analisi.totalHours) * 100)
    : (analisi.percent || 0);

  const gPct = geometria.totalHours > 0
    ? Math.round((geometria.completedHours / geometria.totalHours) * 100)
    : (geometria.percent || 0);

  const globPct = global.totalHours > 0
    ? Math.round((global.completedHours / global.totalHours) * 100)
    : (global.percent || 0);

  // Template context object passed into log generator functions
  const contextData = useMemo(() => ({
    aPct,
    gPct,
    globPct,
    aHours: analisi.completedHours,
    aTotal: analisi.totalHours,
    aRem: analisi.remainingHours,
    gHours: geometria.completedHours,
    gTotal: geometria.totalHours,
    gRem: geometria.remainingHours,
    days: metrics.remainingDays || 54,
    weeks: metrics.remainingWeeks || 8
  }), [aPct, gPct, globPct, analisi, geometria, metrics]);

  // Log indexes: select random index on initial render or manual cycle
  const [scifiIndex, setScifiIndex] = useState(() => Math.floor(Math.random() * SCIFI_LOGS.length));
  const [telemetryIndex, setTelemetryIndex] = useState(() => Math.floor(Math.random() * TELEMETRY_LOGS.length));

  // Typewriter effect state for Sci-Fi Terminal mode
  const currentScifiFullText = useMemo(() => {
    const fn = SCIFI_LOGS[scifiIndex % SCIFI_LOGS.length];
    return fn(contextData);
  }, [scifiIndex, contextData]);

  const [typewriterText, setTypewriterText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter loop
  useEffect(() => {
    if (mode !== "scifi") return;

    let charIndex = 0;
    setTypewriterText("");
    setIsTyping(true);

    const typeSpeed = 22; // ms per char for crisp terminal feel
    const intervalId = setInterval(() => {
      charIndex++;
      setTypewriterText(currentScifiFullText.slice(0, charIndex));

      if (charIndex >= currentScifiFullText.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, typeSpeed);

    return () => clearInterval(intervalId);
  }, [currentScifiFullText, mode]);

  // Auto-cycle sci-fi log every 10 seconds when not typing
  useEffect(() => {
    if (mode !== "scifi" || isTyping) return;

    const autoCycleTimeout = setTimeout(() => {
      setScifiIndex((prev) => (prev + 1) % SCIFI_LOGS.length);
    }, 7000);

    return () => clearTimeout(autoCycleTimeout);
  }, [isTyping, mode]);

  // Current Telemetry log text
  const currentTelemetryText = useMemo(() => {
    const fn = TELEMETRY_LOGS[telemetryIndex % TELEMETRY_LOGS.length];
    return fn(contextData);
  }, [telemetryIndex, contextData]);

  // Handlers to cycle text on user demand
  const handleNextScifi = () => {
    setScifiIndex((prev) => Math.floor(Math.random() * SCIFI_LOGS.length));
  };

  const handleNextTelemetry = () => {
    setTelemetryIndex((prev) => Math.floor(Math.random() * TELEMETRY_LOGS.length));
  };

  // Helper for gear calculation (1 to 6) based on percent
  const getGear = (pct) => {
    if (pct < 15) return 1;
    if (pct < 35) return 2;
    if (pct < 55) return 3;
    if (pct < 75) return 4;
    if (pct < 90) return 5;
    return 6;
  };

  // 24-Segment LED Tachometer Generator for Telemetry Mode
  const renderRpmLeds = (pct, totalSegments = 24) => {
    const activeCount = Math.round((Math.max(2, Math.min(100, pct)) / 100) * totalSegments);
    const segments = [];

    for (let i = 0; i < totalSegments; i++) {
      const isActive = i < activeCount;
      const isGreen = i < 14;        // Segments 0-13 (0-58%): Green range
      const isAmber = i >= 14 && i < 20; // Segments 14-19 (58-83%): Amber powerband
      const isRedline = i >= 20;     // Segments 20-23 (83-100%): Redline shift-light

      let activeClass = "";
      let inactiveClass = "";

      if (isGreen) {
        activeClass = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] border-emerald-300";
        inactiveClass = "bg-emerald-950/40 border-emerald-900/30";
      } else if (isAmber) {
        activeClass = "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.85)] border-amber-300";
        inactiveClass = "bg-amber-950/40 border-amber-900/30";
      } else {
        activeClass = "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.95)] border-rose-300 animate-pulse";
        inactiveClass = "bg-rose-950/40 border-rose-900/30";
      }

      segments.push(
        <div
          key={i}
          className={`h-4 flex-1 rounded-[1.5px] border transition-all duration-300 ${
            isActive ? activeClass : inactiveClass
          }`}
          title={`Segment ${i + 1}/${totalSegments}`}
        />
      );
    }
    return segments;
  };

  // =========================================================================
  // RENDER: MODALITÀ 1 - TERMINALE SCI-FI (Arthur C. Clarke / Deep Space)
  // =========================================================================
  if (mode === "scifi") {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-black border border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.18)] p-4 md:p-6 text-emerald-400 font-mono transition-all duration-500">
        {/* Subtle CRT Scanline overlay effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #000, #000 2px, #fff 2px, #fff 4px)"
          }}
        />

        {/* Top Control Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-emerald-500/30">
          <div className="flex items-center space-x-2.5">
            {/* Terminal retro control indicators */}
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
            </div>
            <span className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
              TERMINALE SCI-FI // CLARKE-9000 // ORBITAL_ALIGNMENT
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Cycle next log button */}
            <button
              onClick={handleNextScifi}
              className="px-2.5 py-1 text-[11px] font-bold uppercase rounded border border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-300 transition active:scale-95 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
              title="Ricevi nuova trasmissione casuale"
            >
              <span>↺</span>
              <span className="hidden sm:inline">RERUN_SCAN</span>
            </button>

            {/* Mode Switch Toggle Button */}
            <button
              onClick={toggleMode}
              className="px-3 py-1 text-[11px] font-bold uppercase rounded border border-cyan-500/60 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 transition active:scale-95 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              title="Passa alla Console Telemetrica (Vibe DevOps / Moto RPM)"
            >
              <svg className="w-3.5 h-3.5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>MODALITÀ: TELEMETRIA RPM</span>
            </button>
          </div>
        </div>

        {/* Typewriter Terminal Output Box */}
        <div className="relative z-10 bg-black/90 rounded-2xl border border-emerald-500/30 p-4 md:p-5 mb-5 shadow-inner shadow-emerald-950/50">
          <div className="flex items-center justify-between text-[10px] text-emerald-500/70 mb-2 uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              DEEP_SPACE_TRANSMISSION // RELAY ID: AC-2027
            </span>
            <span>FREQ: 1420.405 MHz (IDROGENO)</span>
          </div>

          <div className="min-h-[52px] flex items-center">
            <p className="text-xs sm:text-sm md:text-[15px] font-medium leading-relaxed tracking-wide text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.85)]">
              {typewriterText}
              <span className="inline-block ml-1 font-bold text-emerald-400 animate-pulse">
                ▌
              </span>
            </p>
          </div>
        </div>

        {/* Orbital Alignment Bars (Sostituiscono le vecchie progress bar) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Track 1: Analisi 1 Orbital Track */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 relative group hover:border-emerald-500/50 transition">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    VECTOR A-01..32
                  </span>
                  <span className="text-[10px] text-emerald-500/80">INCLINAZIONE ORBITALE</span>
                </div>
                <div className="text-sm font-extrabold text-white mt-1 tracking-wide">
                  Analisi Matematica 1
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
                  {aPct}%
                </span>
              </div>
            </div>

            {/* Precision Laser Orbital Track */}
            <div className="relative py-2">
              <div className="w-full h-2 bg-emerald-950/70 rounded-full border border-emerald-500/40 p-[1px] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-lime-300 rounded-full shadow-[0_0_12px_rgba(52,211,153,1)] transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(2, aPct)}%` }}
                />
              </div>

              {/* Tick Marks underneath */}
              <div className="flex justify-between text-[9px] text-emerald-600 font-mono mt-1 px-0.5">
                <span>0°</span>
                <span>25°</span>
                <span>50°</span>
                <span>75°</span>
                <span className="text-emerald-300 font-bold">100° APOGEO</span>
              </div>
            </div>

            {/* Readout Data */}
            <div className="flex justify-between items-center text-[11px] text-emerald-400/90 pt-2 border-t border-emerald-900/40">
              <span>PROPULSIONE: {analisi.completedHours}h / {analisi.totalHours}h</span>
              <span className="text-emerald-300 font-semibold">RESIDUO: {analisi.remainingHours}h</span>
              {onTabChange && (
                <button
                  onClick={() => onTabChange("weekly")}
                  className="text-emerald-300 hover:text-white transition font-bold underline decoration-emerald-500/50"
                >
                  VEDI_ROTTA →
                </button>
              )}
            </div>
          </div>

          {/* Track 2: Geometria Orbital Track */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 relative group hover:border-emerald-500/50 transition">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    VECTOR G-01..31
                  </span>
                  <span className="text-[10px] text-emerald-500/80">ASSETTO VETTORIALE</span>
                </div>
                <div className="text-sm font-extrabold text-white mt-1 tracking-wide">
                  Geometria e Algebra
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
                  {gPct}%
                </span>
              </div>
            </div>

            {/* Precision Laser Orbital Track */}
            <div className="relative py-2">
              <div className="w-full h-2 bg-emerald-950/70 rounded-full border border-emerald-500/40 p-[1px] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-300 rounded-full shadow-[0_0_12px_rgba(20,184,166,1)] transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(2, gPct)}%` }}
                />
              </div>

              {/* Tick Marks underneath */}
              <div className="flex justify-between text-[9px] text-emerald-600 font-mono mt-1 px-0.5">
                <span>0°</span>
                <span>25°</span>
                <span>50°</span>
                <span>75°</span>
                <span className="text-emerald-300 font-bold">100° AGGANCIO</span>
              </div>
            </div>

            {/* Readout Data */}
            <div className="flex justify-between items-center text-[11px] text-emerald-400/90 pt-2 border-t border-emerald-900/40">
              <span>PROPULSIONE: {geometria.completedHours}h / {geometria.totalHours}h</span>
              <span className="text-emerald-300 font-semibold">RESIDUO: {geometria.remainingHours}h</span>
              {onTabChange && (
                <button
                  onClick={() => onTabChange("weekly")}
                  className="text-emerald-300 hover:text-white transition font-bold underline decoration-emerald-500/50"
                >
                  VEDI_ROTTA →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sci-Fi Status Footer */}
        <div className="relative z-10 mt-4 pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-[10px] text-emerald-500/80">
          <div>
            TARGET_COORDINATES: UNIMORE // 10_GEN_2027 // BUFFER: +20% ACTIVE
          </div>
          <div>
            TEMPO DI VOLO RESIDUO: {metrics.remainingDays || 54} GIORNI TERRESTRI ({metrics.remainingWeeks || 8} SETT.)
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: MODALITÀ 2 - CONSOLE TELEMETRICA (DevOps / Cruscotto Moto RPM)
  // =========================================================================
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-700/80 shadow-2xl p-4 md:p-6 text-slate-200 font-mono transition-all duration-500">
      {/* High-tech Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-[10px] text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE CAN-BUS: 500 kbps</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            PIT_WALL // TELEMETRIA DA CORSA & CRUSCOTTO RPM
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Ping telemetry button */}
          <button
            onClick={handleNextTelemetry}
            className="px-2.5 py-1 text-[11px] font-bold uppercase rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition active:scale-95 flex items-center gap-1.5"
            title="Aggiorna pacchetto di telemetria"
          >
            <span>⚡</span>
            <span className="hidden sm:inline">ACQUIRE_PACKET</span>
          </button>

          {/* Mode Switch Toggle Button */}
          <button
            onClick={toggleMode}
            className="px-3 py-1 text-[11px] font-bold uppercase rounded border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 transition active:scale-95 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            title="Passa al Terminale Sci-Fi (Vibe Clarke / Deep Space)"
          >
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>MODALITÀ: TERMINALE SCI-FI</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry Message Box */}
      <div className="bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-4 md:p-5 mb-5 shadow-lg shadow-cyan-950/20">
        <div className="flex items-center justify-between text-[10px] text-cyan-400/80 mb-2 uppercase tracking-wider font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            ECU SENSOR LOG // MAP: RACE_FULL_POWER
          </span>
          <span>SHIFT_LIGHT: 10.800 RPM</span>
        </div>

        <div className="min-h-[48px] flex items-center">
          <p className="text-xs sm:text-sm md:text-[15px] font-bold text-cyan-200 tracking-wide leading-relaxed">
            {currentTelemetryText}
          </p>
        </div>

        {/* Live sensors telemetry strip */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
          <span>ECT: 89°C</span>
          <span>TPS: 100%</span>
          <span>LAMBDA: 0.99</span>
          <span>TC: LEVEL 2</span>
          <span>P_BRAKE: 45 BAR</span>
          <span className="text-cyan-400 font-bold">RITMO: 2.5h/SERA</span>
        </div>
      </div>

      {/* Tachometer RPM Progress Bars (Sostituiscono le vecchie progress bar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Power Unit 1: Analisi 1 RPM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-5 relative group hover:border-slate-700 transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  PU 01 // ANALISI 1
                </span>
                <span className="text-[10px] text-slate-400">MOTOPROPULSORE</span>
              </div>
              <div className="text-base font-extrabold text-white mt-1">
                Analisi Matematica 1
              </div>
            </div>

            {/* Gear & RPM Display */}
            <div className="flex items-center space-x-2.5">
              <div className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-slate-950 border border-cyan-500/40 shadow-inner">
                <span className="text-[9px] text-slate-400 leading-none">MARCIA</span>
                <span className="text-base font-black text-cyan-300 leading-none mt-0.5">
                  {getGear(aPct)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {aPct}%
                </div>
                <div className="text-[10px] text-slate-400">
                  {Math.round((aPct / 100) * 11500).toLocaleString()} RPM
                </div>
              </div>
            </div>
          </div>

          {/* 24-Segment LED Rev Limiter Bar */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold px-0.5">
              <span>MIN (1.000)</span>
              <span className="text-emerald-400 font-bold">COPPIA MAX (8.000)</span>
              <span className="text-rose-400 font-bold animate-pulse">REDLINE (11.500)</span>
            </div>
            <div className="flex gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {renderRpmLeds(aPct)}
            </div>
          </div>

          {/* Telemetric Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
              <span className="text-[10px] text-slate-400 block">Erogato</span>
              <span className="font-bold text-white">{analisi.completedHours}h</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
              <span className="text-[10px] text-slate-400 block">Obiettivo</span>
              <span className="font-bold text-slate-200">{analisi.totalHours}h</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
              <span className="text-[10px] text-slate-400 block">Residuo</span>
              <span className="font-bold text-emerald-300">{analisi.remainingHours}h</span>
            </div>
          </div>
        </div>

        {/* Power Unit 2: Geometria RPM */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-5 relative group hover:border-slate-700 transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                  PU 02 // GEOMETRIA
                </span>
                <span className="text-[10px] text-slate-400">MOTOPROPULSORE</span>
              </div>
              <div className="text-base font-extrabold text-white mt-1">
                Geometria e Algebra
              </div>
            </div>

            {/* Gear & RPM Display */}
            <div className="flex items-center space-x-2.5">
              <div className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-slate-950 border border-indigo-500/40 shadow-inner">
                <span className="text-[9px] text-slate-400 leading-none">MARCIA</span>
                <span className="text-base font-black text-indigo-300 leading-none mt-0.5">
                  {getGear(gPct)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-indigo-400 font-mono">
                  {gPct}%
                </div>
                <div className="text-[10px] text-slate-400">
                  {Math.round((gPct / 100) * 11500).toLocaleString()} RPM
                </div>
              </div>
            </div>
          </div>

          {/* 24-Segment LED Rev Limiter Bar */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold px-0.5">
              <span>MIN (1.000)</span>
              <span className="text-emerald-400 font-bold">COPPIA MAX (8.000)</span>
              <span className="text-rose-400 font-bold animate-pulse">REDLINE (11.500)</span>
            </div>
            <div className="flex gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {renderRpmLeds(gPct)}
            </div>
          </div>

          {/* Telemetric Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
              <span className="text-[10px] text-slate-400 block">Erogato</span>
              <span className="font-bold text-white">{geometria.completedHours}h</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
              <span className="text-[10px] text-slate-400 block">Obiettivo</span>
              <span className="font-bold text-slate-200">{geometria.totalHours}h</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/70">
              <span className="text-[10px] text-slate-400 block">Residuo</span>
              <span className="font-bold text-indigo-300">{geometria.remainingHours}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Racing Telemetry Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
        <div>
          CIRCUITO: UNIMORE INGEGNERIA // TARGET: 10 GENNAIO 2027 // SOGLIA CRITICA: 25h/SETT.
        </div>
        <div>
          STINT RESIDUI: {metrics.remainingDays || 54} GIORNI // RITMO RICHIESTO: {metrics.requiredWeeklyHours || 21}h/SETT.
        </div>
      </div>
    </div>
  );
}
