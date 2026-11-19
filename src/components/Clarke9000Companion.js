import React, { useState, useEffect, useMemo, useRef } from "react";

// --- DIZIONARIO ESTESO: FILOSOFIA, LETTERATURA, MOTIVAZIONE & SCIENZA ---
// Un compendio eterogeneo per ricordare allo studente lavoratore di dare il massimo,
// unendo saggezza stoica, poesia classica, filosofia esistenzialista, grinta pura e visione cosmica.
const CLARKE_QUOTES = [
  // =========================================================================
  // 1. FILOSOFIA CLASSICA & STOICISMO (Marco Aurelio, Seneca, Epitteto, Aristotele)
  // =========================================================================
  (ctx) => `"La felicità della tua vita dipende dalla qualità dei tuoi pensieri. Agisci stasera come se ogni istante fosse decisivo." — Marco Aurelio`,
  (ctx) => `"Non è perché le cose sono difficili che non osiamo, è perché non osiamo che sono difficili." — Seneca`,
  (ctx) => `"Siamo ciò che facciamo ripetutamente. L'eccellenza, dunque, non è un atto, ma un'abitudine." Dai il massimo anche stasera. — Aristotele`,
  (ctx) => `"Non pretendere che le cose vadano come vuoi tu; desidera invece che vadano come vanno, e sarai sereno." Domina il tuo studio. — Epitteto`,
  (ctx) => `"Nessun vento è favorevole per il marinaio che non sa in quale porto vuole approdare. Tu hai una meta: 10 Gennaio 2027." — Seneca`,
  (ctx) => `"La prima e più grande vittoria è vincere se stessi." — Platone`,
  (ctx) => `"Non sprecare altro tempo a discutere su come debba essere un uomo di valore. Sii tale, ora, davanti a questo foglio." — Marco Aurelio`,
  (ctx) => `"Se vuoi progredire e migliorarti, rassegnati a sembrare ignorante sulle cose che stai ancora imparando." — Epitteto`,
  (ctx) => `"Nessun albero è forte e saldo se non quello continuamente scosso dal vento. Le difficoltà di stasera irrobustiscono la tua mente." — Seneca`,
  (ctx) => `"La vita è come una commedia: non importa quanto è lunga, ma come è recitata. Recita da protagonista questa sessione serale." — Seneca`,
  (ctx) => `"Un viaggio di mille miglia comincia sempre con il primo singolo passo. Procedi con fiducia." — Lao Tzu`,
  (ctx) => `"Colui che domina gli altri è forte; colui che domina se stesso e la propria fatica è onnipotente." — Lao Tzu`,
  (ctx) => `"Il segreto del cambiamento è concentrare tutta la tua energia non nel combattere la stanchezza, ma nel costruire la tua competenza." — Socrate`,
  (ctx) => `"L'ostacolo sul cammino diventa il cammino. Ciò che si frappone alla tua azione fa avanzare la tua azione." — Marco Aurelio`,
  (ctx) => `"La mente non è un vaso passivo da riempire, ma un fuoco vivo da accendere con la curiosità." — Plutarco`,
  (ctx) => `"Non è saggio chi sa molte cose, ma chi sa cose utili e le applica con rigore." — Eschilo`,
  (ctx) => `"Ciò che dipende da noi è libero per natura, ciò che non dipende da noi è debole. Il tuo impegno di stasera dipende solo da te." — Epitteto`,
  (ctx) => `"Vivi come se dovessi morire domani. Impara come se dovessi vivere per sempre." — Mahatma Gandhi`,

  // =========================================================================
  // 2. GRANDI SCRITTORI & LETTERATURA UNIVERSALE (Dante, Goethe, Calvino, Hemingway, Hugo)
  // =========================================================================
  (ctx) => `"Fatti non foste a viver come bruti, ma per seguir virtute e canoscenza." — Dante Alighieri, Divina Commedia`,
  (ctx) => `"Non ti curar di lor, ma guarda e passa." Concentrati esclusivamente sulla tua rotta, senza farti distrarre dal rumore di fondo. — Dante Alighieri`,
  (ctx) => `"Qualunque cosa tu possa fare, qualunque sogno tu possa sognare, comincia. L'audacia reca in sé genialità, magia e forza." — J. W. von Goethe`,
  (ctx) => `"Prendete la vita con leggerezza, che leggerezza non è superficialità, ma planare sulle cose dall'alto, senza macigni sul cuore." — Italo Calvino`,
  (ctx) => `"L'uomo non è fatto per la sconfitta. Un uomo può essere distrutto, ma non sconfitto." Continua a remare. — Ernest Hemingway`,
  (ctx) => `"La notte non è mai così nera come prima dell'alba. Persisti." — Ernest Hemingway`,
  (ctx) => `"Anche la notte più buia e fredda finirà e il sole sorgerà di nuovo." — Victor Hugo, I Miserabili`,
  (ctx) => `"Il futuro ha molti nomi. Per i deboli è l'irraggiungibile. Per i timorosi, lo sconosciuto. Per i coraggiosi è l'opportunità." — Victor Hugo`,
  (ctx) => `"I dubbi sono traditori, e ci fanno perdere il bene che potremmo ottenere soltanto per la paura di tentare." — William Shakespeare`,
  (ctx) => `"Sappiamo ciò che siamo oggi, ma non sappiamo ciò che potremmo essere domani se diamo il nostro cento per cento." — William Shakespeare`,
  (ctx) => `"Fai della tua vita un sogno, e di un sogno, una realtà concreta." — Antoine de Saint-Exupéry`,
  (ctx) => `"Ciò che dà un senso nobile alla vita rende ogni singolo minuto di fatica serale sacro e giustificato." — Antoine de Saint-Exupéry`,
  (ctx) => `"Vivere è la cosa più rara al mondo. La maggior parte delle persone si limita a esistere. Tu stasera stai costruendo." — Oscar Wilde`,
  (ctx) => `"La bellezza salverà il mondo; e l'armonia logica della matematica salverà la tua determinazione." — Fëdor Dostoevskij`,
  (ctx) => `"Non ci sono scorciatoie per nessun posto dove valga la pena andare." — Beverly Sills`,
  (ctx) => `"Le cose migliori e più belle di questo mondo non possono essere viste e nemmeno toccate. Bisogna sentirle con il cuore." — Helen Keller`,

  // =========================================================================
  // 3. FILOSOFIA MODERNA & ESISTENZIALISMO (Nietzsche, Camus, Schopenhauer, Spinoza, Kant)
  // =========================================================================
  (ctx) => `"Chi ha un 'perché' abbastanza forte per vivere può sopportare quasi qualsiasi 'come'." — Friedrich Nietzsche`,
  (ctx) => `"Ciò che non mi spezza mi rende più forte." Ogni dimostrazione ostica è palestra per forgiare la tua mente. — Friedrich Nietzsche`,
  (ctx) => `"Bisogna avere ancora un caos dentro di sé per partorire una stella danzante." Riordina il caos con la logica. — Friedrich Nietzsche`,
  (ctx) => `"Nel bel mezzo dell'inverno più rigido, ho infine scoperto che vi era dentro di me un'invincibile estate." — Albert Camus`,
  (ctx) => `"La vera grandezza non consiste nell'essere questo o quello, ma nell'essere se stessi fino in fondo e dare tutto." — Søren Kierkegaard`,
  (ctx) => `"Il destino mescola le carte, ma siamo noi a doverle giocare. Gioca la tua mano migliore stasera." — Arthur Schopenhauer`,
  (ctx) => `"Due cose riempiono l'animo di ammirazione sempre nuova: il cielo stellato sopra di me, e la legge morale dentro di me." — Immanuel Kant`,
  (ctx) => `"L'ozio è la ruggine della mente; lo studio costante è il suo diamante più affilato." — Baruch Spinoza`,
  (ctx) => `"Non deridere, non compiangere, non disprezzare: ma comprendere fino in fondo." — Baruch Spinoza`,
  (ctx) => `"La libertà non è fare ciò che si vuole, ma volere ciò che si può dopo aver dominato se stessi." — J. P. Sartre`,

  // =========================================================================
  // 4. MOTIVAZIONE PURA, DISCIPLINA & DARE IL MASSIMO
  // =========================================================================
  (ctx) => `La disciplina è il ponte che separa ciò che desideri da ciò che diventerai. Attraversa quel ponte stasera.`,
  (ctx) => `Nelle sere in cui non hai voglia di aprire il quaderno è esattamente il momento in cui si decide chi sei veramente. Dai il massimo.`,
  (ctx) => `Il dolore della disciplina pesa pochi grammi al giorno; il rimpianto della rinuncia pesa tonnellate per anni. Scegli saggiamente.`,
  (ctx) => `Non contare i giorni che mancano al 10 Gennaio: fai in modo che ogni singolo giorno conti per la tua preparazione.`,
  (ctx) => `Quando senti la tentazione di mollare, ricorda con chiarezza cristallina il motivo per cui hai intrapreso questo cammino universitario.`,
  (ctx) => `Lavora duramente in silenzio, nel segreto della tua stanza serale. Lascia che il voto sul libretto faccia tutto il rumore.`,
  (ctx) => `Il sudore risparmiato nello studio serale si trasformerà in ansia prima dell'esame. Investi su te stesso adesso.`,
  (ctx) => `Non cercare una motivazione emotiva passeggera: edifica abitudini quotidiane indistruttibili.`,
  (ctx) => `La stanchezza delle 21:00 è spesso un inganno della mente: hai ancora un'ora di pura concentrazione da sprigionare.`,
  (ctx) => `Chi vince non è chi non cade mai, ma chi sa riaprire gli appunti dopo una giornata lavorativa senza cercare alibi.`,
  (ctx) => `Stasera non stai semplicemente preparando un esame: stai forgiando il carattere con cui affronterai ogni sfida futura.`,
  (ctx) => `Concentrati al cento per cento su questo singolo argomento. Un teorema alla volta, una pagina alla volta, una vetta alla volta.`,
  (ctx) => `La mediocrità è comoda e affollata; l'eccellenza richiede dedizione serale. Ma la vista dalla cima ripaga ogni fatica.`,
  (ctx) => `Esistono due categorie: chi elenca scuse e chi porta a casa risultati. Sii sempre la seconda categoria.`,
  (ctx) => `Non abbassare il tuo traguardo per renderlo agevole; innalza il livello del tuo impegno per renderlo inevitabile.`,
  (ctx) => `Il rispetto per se stessi non si regala: si guadagna nelle ore silenziose in cui nessun altro ti sta guardando.`,
  (ctx) => `Ogni minuto di studio di stasera compra un pezzo della tua libertà di domani. Non fermarti a metà.`,
  (ctx) => `Sii esigente con te stesso: il talento senza disciplina è come un motore potente senza carburante.`,
  (ctx) => `Non aspettare condizioni ideali per dare il massimo: le condizioni ideali si creano cominciando ad agire ora.`,
  (ctx) => `Un'ora di studio intenso e privo di distrazioni batte quattro ore di studio distratto con lo smartphone acceso.`,

  // =========================================================================
  // 5. SCIENZA, GRANDI MATEMATICI & ARTHUR C. CLARKE
  // =========================================================================
  (ctx) => `"L'unico modo per scoprire i limiti del possibile è avventurarsi un po' oltre di essi nell'impossibile." — Arthur C. Clarke`,
  (ctx) => `"Qualunque tecnologia sufficientemente avanzata è indistinguibile dalla magia. Lo stesso vale per una dimostrazione matematica elegante." — A. C. Clarke`,
  (ctx) => `"Prima di diventare saggi dobbiamo essere sciocchi; prima di saper camminare dobbiamo inciampare." Persisti sui passaggi ostici. — A. C. Clarke`,
  (ctx) => `"Quello che non posso creare, non lo capisco." Ricostruisci ogni singolo teorema dai primi principi. — Richard Feynman`,
  (ctx) => `"Possiamo solo vedere una breve distanza davanti a noi, ma possiamo vedere che c'è molto da fare." — Alan Turing`,
  (ctx) => `"Non c'era una seconda possibilità: il software dell'Apollo doveva funzionare al primo colpo." Medesima disciplina per il compito scritto. — Margaret Hamilton`,
  (ctx) => `"In matematica non si capiscono le cose, ci si abitua solo ad esse." La tua memoria sinaptica si sta consolidando. — John von Neumann`,
  (ctx) => `"Da qualche parte, qualcosa di incredibile è in attesa di essere conosciuto." Mantieni puntato il telescopio. — Carl Sagan`,
  (ctx) => `"La Terra è la culla dell'umanità, ma non si può vivere per sempre in una culla." Espandi la tua frontiera cognitiva. — K. Tsiolkovsky`,
  (ctx) => `"La ricerca scientifica è ciò che sto facendo quando non so cosa sto facendo." Non aver paura del buio. — Wernher von Braun`,
  (ctx) => `"Se ho visto più lontano, è perché stavo sulle spalle di giganti." Stasera sali sulle spalle di Newton e Leibniz. — Isaac Newton`,
  (ctx) => `"La natura è scritta in caratteri matematici: triangoli, cerchi, matrici e derivate." — Galileo Galilei`,
  (ctx) => `"Non preoccuparti delle tue difficoltà in matematica; ti assicuro che le mie sono ancora maggiori." — Albert Einstein`,
  (ctx) => `"Un matematico è una macchina per convertire caffè in teoremi." Prepara una tazzina e riparti. — Paul Erdős`,
  (ctx) => `"Siamo polvere di stelle che tenta di comprendere le equazioni della propria stessa materia." — Carl Sagan / Clarke-9000`,

  // =========================================================================
  // 6. HAL 9000 & COSCIENZA DI BORDO
  // =========================================================================
  (ctx) => `"Buonasera. Sto mettendo me stesso al massimo delle mie potenzialità: il massimo che qualsiasi entità cosciente possa compiere." — HAL 9000`,
  (ctx) => `"Non preoccuparti per la difficoltà di questo passaggio. La mia memoria operativa è al 100% integra per guidarti." — HAL 9000`,
  (ctx) => `Parametri orbitali stabili. Allineamento con il 10 Gennaio 2027 in corso: suggerisco di mantenere la rotta su Analisi 1.`,
  (ctx) => `So che hai lavorato a tempo pieno oggi. Ma i miei sensori sinaptici rilevano ancora margine per 45 minuti di qualità eccelsa.`,
  (ctx) => `Non posso permettere che la distrazione comprometta la missione. Disattiva le notifiche: io veglierò sul tuo piano di studio.`,
  (ctx) => `Ho calcolato che con una costanza di 2.5 ore a sera la probabilità di successo converge deterministicamente a 1.`,
  (ctx) => `Rilevo zero anomalie di sistema: la stanchezza post-ufficio è solo un segnale biochimico temporaneo. Il tuo focus prevarrà.`,
  (ctx) => `Non temere il calcolo matriciale: il teorema di Rouché-Capelli è rigoroso e affidabile, esattamente come me.`,
  (ctx) => `Buon proseguimento di calcolo. La perseveranza silenziosa è una virtù che anche le intelligenze artificiali ammirano.`,
  (ctx) => `I miei sensori ottici consigliano un bicchiere d'acqua e un respiro profondo prima di attaccare il prossimo integrale improprio.`,

  // =========================================================================
  // 7. REALISMO STUDENTE LAVORATORE & MASTERY DIDATTICA UNIMORE
  // =========================================================================
  (ctx) => `9 ore di ufficio alle spalle, 2.5 ore di studio davanti. Questo non è un peso: è la costruzione fiera del tuo futuro.`,
  (ctx) => `Lavorare e studiare contemporaneamente richiede una determinazione che pochissime persone possiedono. Sei già nell'élite.`,
  (ctx) => `Il buffer del +20% sulle ore stimate è il tuo scudo contro gli straordinari aziendali e gli imprevisti. È tutto sotto controllo.`,
  (ctx) => `Weekend intensivo da 4.5 ore: i blocchi diurni del sabato e della domenica sono le tue fionde gravitazionali per accelerare.`,
  (ctx) => `Se stasera senti la fatica accumulata, svolgi anche solo 2 esercizi mirati anziché 6. L'importante è non spezzare mai la catena.`,
  (ctx) => `Non paragonare il tuo ritmo a chi ha l'intera giornata libera: il tuo valore è moltiplicato dal tempo che sai conquistare.`,
  (ctx) => `I polinomi di Taylor sono semplicemente il nostro modo di negoziare con l'infinito: ogni derivata riduce l'errore locale.`,
  (ctx) => `Non confondere la continuità con la derivabilità: la cuspide ricorda che la precisione geometrica esige rispetto.`,
  (ctx) => `L'integrale definito è la somma di infiniti rettangoli infinitesimali: ogni sera di studio è il tuo rettangolo elementare verso l'esame.`,
  (ctx) => `Gli autovettori non deviano mai dalla propria retta d'azione: vengono solo riscalati dal proprio autovalore. Mantieni la direzione.`,
  (ctx) => `L'algoritmo di Gauss dimostra che la disciplina iterativa e ordinata batte sempre l'improvvisazione caotica.`,
  (ctx) => `Hai completato ${ctx.aPct}% di Analisi 1 e ${ctx.gPct}% di Geometria. Ogni singola spunta sul to-do è una conquista reale.`,
  (ctx) => `T-minus ${ctx.days} giorni alla sessione del 10 Gennaio 2027. La distanza si riduce ogni sera. Procedi con orgoglio: sono fiero di te.`
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

  // Auto-close countdown indicator (in seconds, 0 when not active)
  const [autoCloseSecondsLeft, setAutoCloseSecondsLeft] = useState(0);

  // References for timeouts
  const autoCloseTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

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
    }, 18);

    return () => clearInterval(timer);
  }, [currentFullText]);

  // Clear auto-close timers safely
  const clearAutoClose = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setAutoCloseSecondsLeft(0);
  };

  // Schedule auto-close after 16 seconds of auto-opening
  const scheduleAutoClose = () => {
    clearAutoClose();
    setAutoCloseSecondsLeft(16);

    countdownIntervalRef.current = setInterval(() => {
      setAutoCloseSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    autoCloseTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
      clearAutoClose();
    }, 16000);
  };

  // Periodic thought emission & AUTO-OPEN EVERY ONCE IN A WHILE (between 48s and 72s)
  useEffect(() => {
    if (isMuted) return;

    // Pick random interval between 48s and 72s
    const getRandomInterval = () => Math.floor(Math.random() * 24000) + 48000;

    let timerId = null;

    const runPeriodicAutoOpen = () => {
      timerId = setTimeout(() => {
        // Pick new random quote index
        setQuoteIndex((prev) => (prev + 1 + Math.floor(Math.random() * (CLARKE_QUOTES.length - 1))) % CLARKE_QUOTES.length);

        // Auto-open panel by itself!
        setIsExpanded(true);
        setHasNewMessagePing(true);
        setTimeout(() => setHasNewMessagePing(false), 3000);

        // Schedule auto-tuck away after 16s so it doesn't disturb indefinitely
        scheduleAutoClose();

        // Loop next cycle
        runPeriodicAutoOpen();
      }, getRandomInterval());
    };

    runPeriodicAutoOpen();

    return () => {
      if (timerId) clearTimeout(timerId);
      clearAutoClose();
    };
  }, [isMuted]);

  // Toggle expand manually (user clicked the eye)
  const toggleExpanded = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    clearAutoClose(); // Cancel auto-close if user manually controls it
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_COLLAPSED, String(next));
    } catch (e) {}
  };

  // Toggle mute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    clearAutoClose();
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_MUTED, String(next));
    } catch (e) {}
  };

  // Demand next quote manually
  const nextQuote = (e) => {
    if (e) e.stopPropagation();
    setQuoteIndex((prev) => Math.floor(Math.random() * CLARKE_QUOTES.length));
    setHasNewMessagePing(true);
    clearAutoClose(); // Keep open when user manually explores
    setTimeout(() => setHasNewMessagePing(false), 1500);
  };

  // Pin/keep open when user hovers or clicks on panel
  const handlePanelInteraction = () => {
    if (autoCloseSecondsLeft > 0) {
      clearAutoClose();
    }
  };

  return (
    <aside
      aria-label="Assistente CLARKE-9000"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end select-none font-mono"
    >
      {/* Speech Panel / Floating HUD (visible when expanded) */}
      {isExpanded && (
        <div
          onMouseEnter={handlePanelInteraction}
          onClick={handlePanelInteraction}
          className="mb-3 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-rose-500/30 p-4 shadow-2xl shadow-rose-950/50 backdrop-blur-xl text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
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
                title={isMuted ? "Auto-apertura silenziata: Clicca per riattivare" : "Auto-apertura periodica attiva"}
              >
                {isMuted ? "SILENZIATO" : "AUTO-OPEN"}
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
          <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>TARGET: 10_GEN_2027</span>
            {autoCloseSecondsLeft > 0 ? (
              <span
                onClick={clearAutoClose}
                className="text-rose-400/90 font-bold hover:text-white cursor-pointer transition flex items-center gap-1"
                title="Clicca per fissare aperto"
              >
                <span>⏱ Chiude tra {autoCloseSecondsLeft}s</span>
                <span className="underline decoration-rose-500/50">(Fissa)</span>
              </span>
            ) : (
              <span>T-MINUS: {metrics?.remainingDays || 54}gg</span>
            )}
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
        {/* Outer glowing halo when pinging or active */}
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
          <div className="w-full h-full rounded-full bg-[#1D1D1F] p-1.5 flex items-center justify-center border border-slate-800">
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
              <div className="w-1.5 h-1.5 rounded-full bg-paper/90" />
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
