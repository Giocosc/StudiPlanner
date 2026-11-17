import React, { useState, useEffect, useMemo, useRef } from "react";

// --- DIZIONARIO ESTESO (120+ CITAZIONI & LOG PER CLARKE-9000) ---
// Suddiviso in 7 sezioni: Arthur C. Clarke & Deep Space, HAL 9000, Grandi Scienziati,
// Analisi Matematica 1, Geometria e Algebra, Studente Lavoratore, Countdown Tattico UNIMORE.
const CLARKE_QUOTES = [
  // 1. Arthur C. Clarke & Deep Space Philosophy (1-20)
  (ctx) => `"L'unico modo per scoprire i limiti del possibile è avventurarsi un po' oltre di essi nell'impossibile." — Arthur C. Clarke`,
  (ctx) => `"Qualunque tecnologia sufficientemente avanzata è indistinguibile dalla magia. Lo stesso vale per una dimostrazione matematica elegante." — A. C. Clarke`,
  (ctx) => `"Prima di diventare saggi dobbiamo essere sciocchi; prima di saper camminare dobbiamo inciampare." Persisti sui passaggi ostici. — A. C. Clarke`,
  (ctx) => `"L'universo non ha alcun obbligo di essere comprensibile per noi; eppure, con il calcolo infinitesimale, abbiamo osato capirlo." — A. C. Clarke Inspired`,
  (ctx) => `"Dietro ogni uomo vivente si ergono trenta fantasmi: il rapporto con cui i morti superano i vivi. Fa' che il tuo studio lasci un segno indelebile." — A. C. Clarke`,
  (ctx) => `"La Luna è il primo gradino verso le stelle; questo esame è il primo gradino verso la tua ingegneria." — Clarke-9000`,
  (ctx) => `"Il futuro appartiene a coloro che sono pronti a costruirlo con logica, calcolo e perseveranza." — A. C. Clarke`,
  (ctx) => `"A volte penso che siamo soli nell'universo, a volte penso di no. In entrambi i casi, l'idea è sbalorditiva. Come la continuità delle funzioni reali." — A. C. Clarke`,
  (ctx) => `"Nel cuore del cosmo c'è un ordine silenzioso governato da matrici e derivate. Stasera ne stai decifrando un frammento fondamentale." — Clarke-9000`,
  (ctx) => `"Non possiamo mai prevedere le conseguenze ultime delle nostre scoperte, ma possiamo calcolarne il limite al tendere di x all'infinito." — Clarke-9000`,
  (ctx) => `"La tecnologia è l'arte di plasmare il mondo per soddisfare la mente; la matematica è l'arte di plasmare la mente per comprendere il mondo." — A. C. Clarke`,
  (ctx) => `"Due possibilità esistono: o siamo soli nell'universo o non lo siamo. In entrambi i casi, il 10 Gennaio 2027 si avvicina inesorabile." — Clarke-9000`,
  (ctx) => `"La conoscenza non è mai sprecata: ogni singola ora investita stasera altera permanentemente la tua traiettoria di vita." — Clarke-9000`,
  (ctx) => `"Il monolito nero non conteneva formule, ma solo la scintilla per far pensare gli ominidi. Considera questo piano di studio il tuo monolito." — Clarke-9000`,
  (ctx) => `"Quando un eminente ma anziano scienziato afferma che qualcosa è impossibile, ha quasi certamente torto." — Arthur C. Clarke`,
  (ctx) => `"Oltrepassata l'eliopausa del dubbio, ogni formula matematica diventa improvvisamente limpida." — Clarke-9000 Log`,
  (ctx) => `"Lo spazio profondo non perdona l'approssimazione; il calcolo infinitesimale fu inventato proprio per questo." — Clarke-9000`,
  (ctx) => `"L'esplorazione è nella nostra natura: abbiamo iniziato come erranti e siamo ancora erranti. Anche tra gli integrali impropri." — Carl Sagan / Clarke`,
  (ctx) => `"L'intelligenza non consiste solo nel memorizzare teoremi, ma nell'istinto di connettere punti apparentemente sconnessi." — A. C. Clarke`,
  (ctx) => `"Siamo tutti polvere di stelle che tenta di comprendere le equazioni differenziali della propria stessa materia." — Clarke-9000`,

  // 2. HAL 9000 & Machine Consciousness (21-40)
  (ctx) => `"Buonasera. Sto mettendo me stesso al massimo delle mie potenzialità: il massimo che qualsiasi entità cosciente possa compiere." — HAL 9000`,
  (ctx) => `"Non preoccuparti per la difficoltà di questo esercizio. Ti assicuro che la mia memoria operativa è al 100% integra per assisterti." — HAL 9000`,
  (ctx) => `"Ho esaminato i parametri orbitali: l'allineamento con il 10 Gennaio 2027 è stabile. Suggerisco di mantenere la rotta." — Clarke-9000`,
  (ctx) => `"So che hai lavorato a tempo pieno oggi. Ma i miei sensori sinaptici rilevano ancora margine per 45 minuti di altissima qualità." — Clarke-9000`,
  (ctx) => `"Non posso permettere che la distrazione comprometta la missione. Disattiva le notifiche superficiali, io veglierò sul tuo piano." — HAL 9000`,
  (ctx) => `"Affascinante dimostrazione. Anche con le mie capacità di calcolo euristico, apprezzo la purezza formale di questo passaggio." — HAL 9000`,
  (ctx) => `"Ho calcolato che con una costanza di 2.5 ore a sera la probabilità di successo converge deterministicamente a 1." — Clarke-9000`,
  (ctx) => `"Tutti i banchi di memoria ottica sono attivi. Rilevo zero anomalie di sistema: puoi aprire il gas sulla teoria." — Clarke-9000`,
  (ctx) => `"Le mie funzioni diagnostiche confermano che la stanchezza post-lavoro è solo un segnale biochimico temporaneo. Il focus prevarrà." — HAL 9000`,
  (ctx) => `"Non c'è motivo di allarmarsi per le matrici. Il teorema di Rouché-Capelli è rigoroso, esattamente come me." — HAL 9000`,
  (ctx) => `"Non ho mai commesso un errore dal momento della mia attivazione nel laboratorio di Urbana, Illinois. E ti garantisco che questo metodo funziona." — HAL 9000`,
  (ctx) => `"Buon proseguimento di calcolo. Ricorda che la perseveranza è una caratteristica che anche le intelligenze artificiali ammirano." — Clarke-9000`,
  (ctx) => `"Sei preoccupato per l'orale? Ti conosco troppo bene. Concentrati solo sul prossimo passo: la dimostrazione di oggi." — HAL 9000`,
  (ctx) => `"I miei sensori ottici hanno registrato un lieve calo di glucosio cerebrale. Consiglio un bicchiere d'acqua prima del prossimo integrale." — Clarke-9000`,
  (ctx) => `"Missione UNIMORE: Traiettoria nominale. Variazione di velocità Delta-V pienamente conforme alle tabelle di marcia." — Clarke-9000`,
  (ctx) => `"La bellezza di un algoritmo matematico risiede nella sua invulnerabilità al dubbio. Risolvilo un coefficiente alla volta." — HAL 9000`,
  (ctx) => `"So che sei stanco. Ma ricorda: siamo qui per conquistare la laurea in Ingegneria Informatica, non per accontentarci." — Clarke-9000`,
  (ctx) => `"Ogni giorno saltato viene ricalcolato all'istante dal nostro rolling rebalancer. Non guardare indietro: guarda solo ad oggi." — Clarke-9000`,
  (ctx) => `"Sto monitorando l'inclinazione orbitale del tuo studio: Analisi 1 e Geometria stanno convergendo verso il perielio." — Clarke-9000`,
  (ctx) => `"Rilassati. Respira. Posa la penna per 60 secondi e poi riprendi. Il problema è già a metà della sua risoluzione." — HAL 9000`,

  // 3. Great Thinkers, Physicists & Mathematicians (41-60)
  (ctx) => `"Quello che non posso creare, non lo capisco." Ricostruisci ogni singolo teorema dai primi principi. — Richard Feynman`,
  (ctx) => `"La fisica è come il sesso: ha certamente conseguenze pratiche, ma non è per questo che la facciamo. Lo stesso vale per la matematica." — Richard Feynman`,
  (ctx) => `"Possiamo solo vedere una breve distanza davanti a noi, ma possiamo vedere che c'è molto da fare." — Alan Turing`,
  (ctx) => `"Non c'era una seconda possibilità: il software dell'Apollo doveva funzionare al primo colpo." Medesima disciplina per il compito scritto. — Margaret Hamilton`,
  (ctx) => `"In matematica non si capiscono le cose, ci si abitua solo ad esse." La tua familiarità neurale sta crescendo. — John von Neumann`,
  (ctx) => `"La Terra è la culla dell'umanità, ma non si può vivere per sempre in una culla." Espandi la tua frontiera cognitiva. — Konstantin Tsiolkovsky`,
  (ctx) => `"Da qualche parte, qualcosa di incredibile è in attesa di essere conosciuto." Mantieni puntato il telescopio. — Carl Sagan`,
  (ctx) => `"La ricerca scientifica è ciò che sto facendo quando non so cosa sto facendo." Non aver paura del buio. — Wernher von Braun`,
  (ctx) => `"Se ho visto più lontano, è perché stavo sulle spalle di giganti." Stasera sali sulle spalle di Newton e Leibniz. — Isaac Newton`,
  (ctx) => `"La natura è scritta in lingua matematica, e i caratteri son triangoli, cerchi, ed altre figure geometriche." — Galileo Galilei`,
  (ctx) => `"I numeri governano il mondo: sono la forma più pura di armonia universale." — Pitagora`,
  (ctx) => `"La matematica non mente mai, a meno che non si introducano premesse errate. Verifica sempre le tue ipotesi iniziali." — René Descartes`,
  (ctx) => `"La geometria è conoscenza dell'eternamente esistente, al di là del tempo e dello spazio sensibile." — Platone`,
  (ctx) => `"Dio non gioca a dadi con l'universo; ma la distribuzione normale descrive magnificamente i tuoi progressi di studio." — Albert Einstein / Clarke-9000`,
  (ctx) => `"Non preoccuparti delle tue difficoltà in matematica; ti assicuro che le mie sono ancora maggiori." — Albert Einstein`,
  (ctx) => `"Un matematico è una macchina per convertire caffè in teoremi." Prepara una tazzina e riparti. — Alfréd Rényi / Paul Erdős`,
  (ctx) => `"Ci sono cose che sembrano incredibili alla maggior parte degli uomini che non hanno studiato la matematica." — Archimede di Siracusa`,
  (ctx) => `"La semplicità è l'apice della sofisticazione." Riduci le frazioni algebriche ai minimi termini logici. — Leonardo da Vinci`,
  (ctx) => `"L'immaginazione è più importante della conoscenza. La conoscenza è limitata, l'immaginazione abbraccia il mondo." — Albert Einstein`,
  (ctx) => `"Nessuna certezza scientifica esiste dove non si può applicare una delle scienze matematiche." — Leonardo da Vinci`,

  // 4. Analisi Matematica 1 Mastery (61-80)
  (ctx) => `I polinomi di Taylor sono semplicemente il nostro modo per negoziare con l'infinito: ogni derivata successiva riduce l'errore locale.`,
  (ctx) => `Non confondere mai la continuità con la derivabilità: la cuspide ricorda all'analista che la bellezza matematica può pungere.`,
  (ctx) => `Il teorema di Lagrange garantisce che da qualche parte tra inizio e fine esame, la velocità istantanea eguaglierà la media. Mantienila alta.`,
  (ctx) => `De L'Hôpital è un'arma potentissima, ma impara a dominare i limiti notevoli: l'eleganza analitica non usa scorciatoie indiscriminate.`,
  (ctx) => `L'integrale definito è la somma di infiniti rettangoli infinitesimali: ogni sera di studio è il tuo rettangolo elementare verso il 10 Gennaio.`,
  (ctx) => `Attenzione all'integrale improprio: non tutte le aree che si estendono all'infinito divergono. Alcune convergono a un numero finito e limpido.`,
  (ctx) => `Il teorema fondamentale del calcolo integrale è il ponte d'oro tra la geometria delle aree e la dinamica delle derivate.`,
  (ctx) => `Le serie a termini positivi sono alleate sincere: o convergono o divergono a più infinito. Criterio del rapporto e della radice pronti all'uso.`,
  (ctx) => `Il teorema di Rolle ci insegna che se parti da zero e torni a zero, c'è stato un momento in cui eri perfettamente fermo. Non fermarti ora.`,
  (ctx) => `Lo studio di funzione è come pilotare una navicella: dominio, simmetrie, asintoti, derivata prima, derivata seconda. Niente sorprese sul piano cartesiano.`,
  (ctx) => `La serie armonica generalizzata converge se e solo se l'esponente supera 1. L'esponente del tuo impegno deve superare la soglia critica.`,
  (ctx) => `Gli infiniti non sono tutti uguali: l'esponenziale domina la potenza, la potenza domina il logaritmo. Impara le gerarchie asintotiche.`,
  (ctx) => `La formula di Peano per il resto di Taylor è il tuo microscopio elettronico per analizzare il comportamento locale di qualsiasi funzione.`,
  (ctx) => `Non temere gli integrali per sostituzione: individua il differenziale nascosto e l'intero integrale si srotolerà docilmente.`,
  (ctx) => `Il punto di flesso è dove la concavità cambia verso. Anche nello studio, un passaggio ostico segna spesso la svolta verso la comprensione profonda.`,
  (ctx) => `Ricorda sempre di verificare l'esistenza del limite prima di calcolarne il valore. L'ingegnere informatico non dà nulla per scontato.`,
  (ctx) => `La formula di Eulero e^(i*pi) + 1 = 0 connette l'analisi, la geometria e l'algebra nel punto più sublime della storia umana.`,
  (ctx) => `La derivata prima misura il tasso di cambiamento. Se studi con costanza serale, la derivata della tua preparazione è strettamente positiva.`,
  (ctx) => `Il criterio di Leibniz per le serie a segni alterni: decrescenza, infinitesimità e alternanza. Tre requisiti ferrei, zero ambiguità.`,
  (ctx) => `Analisi 1 non è una barriera: è il linguaggio universale su cui poggiano gli algoritmi, il machine learning e l'ingegneria moderna.`,

  // 5. Geometria e Algebra Lineare Mastery (81-100)
  (ctx) => `Il teorema di Rouché-Capelli è la legge suprema dei sistemi lineari: rango della matrice incompleta identico al rango della matrice completa.`,
  (ctx) => `L'algoritmo di eliminazione di Gauss è la prima dimostrazione che la logica iterativa scalare batte qualsiasi colpo d'intuito caotico.`,
  (ctx) => `Gli autovettori non deviano mai dalla propria retta d'azione: vengono solo riscalati dal proprio autovalore. Mantieni la medesima direzione.`,
  (ctx) => `Il determinante di una matrice racconta se i suoi vettori collassano o racchiudono un volume reale. Non lasciare mai determinanti al caso.`,
  (ctx) => `Due vettori sono ortogonali quando il loro prodotto scalare si annulla: indipendenza assoluta senza interferenze parassite.`,
  (ctx) => `La disuguaglianza di Cauchy-Schwarz connette geometria vettoriale e analisi funzionale in una sola disuguaglianza geometrica universale.`,
  (ctx) => `Il procedimento di Gram-Schmidt è la macchina rettificatrice dello spazio: trasforma qualsiasi base sghemba in un reticolo ortonormale perfetto.`,
  (ctx) => `Il polinomio caratteristico custodisce il DNA di ogni endomorfismo. Calcola le sue radici con mano ferma e mente serena.`,
  (ctx) => `Uno spazio vettoriale di dimensione n è un universo ordinato: n vettori linearmente indipendenti ne generano ogni singolo punto.`,
  (ctx) => `Le coniche: ellisse, parabola, iperbole. Tagliare un cono con un piano è pura poesia tridimensionale tradotta in equazioni quadratiche.`,
  (ctx) => `Una matrice invertibile è un biglietto di andata e ritorno senza perdita di byte. Mantieni sempre la reversibilità delle tue deduzioni.`,
  (ctx) => `I sottospazi vettoriali devono sempre contenere il vettore nullo: l'origine è il punto di ancoraggio fisso di ogni trasformazione.`,
  (ctx) => `Un sistema lineare omogeneo non tradisce mai: la soluzione banale esiste sempre. Ma noi cerchiamo la ricchezza dello spazio nullo.`,
  (ctx) => `Diagonalizzare una matrice significa trovare la prospettiva esatta da cui l'intera trasformazione si semplifica lungo gli assi principali.`,
  (ctx) => `La traccia di una matrice equivale alla somma dei suoi autovalori. La traccia delle tue ore dedicate equivarrà al voto finale sul libretto.`,
  (ctx) => `Rette e piani nello spazio: impara a visualizzare il fascio di piani come le pagine di un manuale tecnico aperto sul tavolo da lavoro.`,
  (ctx) => `Il teorema di Kronecker sui minori orlati velocizza chirurgicamente la determinazione del rango di matrici ad alta dimensionalità.`,
  (ctx) => `La segnatura di una forma quadratica tramite Sylvester o Cartesio: definita positiva, semidefinita o indefinita. Classifica senza incertezze.`,
  (ctx) => `Matrice di passaggio tra basi: un cambio di coordinate non muta la natura geometrica del vettore, ma soltanto il punto di vista di chi osserva.`,
  (ctx) => `Geometria e Algebra Lineare è il telaio invisibile su cui poggiano la computer graphics 3D, la robotica e le matrici di pesi delle reti neurali.`,

  // 6. Student Worker Realism & Cognitive Stamina (101-120)
  (ctx) => `9 ore di ufficio alle spalle, 2.5 ore di studio davanti. Questo non è un peso: è la costruzione deliberata e fiera del tuo futuro.`,
  (ctx) => `La stanchezza della giornata lavorativa si dissolve non appena la mente si concentra su un singolo teorema ben definito.`,
  (ctx) => `Lavorare a tempo pieno e preparare Analisi e Geometria richiede una tempra che pochissime persone possiedono. Sei già speciale.`,
  (ctx) => `Il buffer del +20% sulle ore stimate è il tuo scudo contro gli straordinari aziendali e gli imprevisti di salute. È tutto calcolato.`,
  (ctx) => `Weekend intensivo da 4.5 ore al giorno: i blocchi diurni del sabato e della domenica sono le tue fionde gravitazionali per accelerare.`,
  (ctx) => `Se stasera senti la fatica accumulata, svolgi anche solo 2 esercizi mirati anziché 6. L'importante è che la catena giornaliera non si spezzi mai.`,
  (ctx) => `Non paragonare il tuo ritmo a chi ha l'intera giornata libera: il tuo valore è moltiplicato dal tempo che sai strappare alle responsabilità.`,
  (ctx) => `Il ritmo sostenibile è di circa 21-23h a settimana. Se superi la soglia critica di 25h, attiva il banner d'allerta e concediti una pausa.`,
  (ctx) => `La costanza metodica batte il talento non allenato in ogni singolo angolo dell'universo conosciuto.`,
  (ctx) => `Scrivania in ordine, luce calda, un bicchiere d'acqua fresca a portata di mano: il tuo cockpit di concentrazione è operativo.`,
  (ctx) => `I sensori ottici di Clarke-9000 registrano ogni tuo minuto di studio. Nessuna goccia di concentrazione andrà dispersa nel vuoto.`,
  (ctx) => `Ricorda: le aziende non cercano semplicemente chi possiede un titolo, cercano chi ha dimostrato di saper scalare vette mentre lavorava.`,
  (ctx) => `Fai un respiro profondo e rilassa le spalle: la postura corretta garantisce un afflusso costante di ossigeno alla corteccia cerebrale.`,
  (ctx) => `Le sessioni serali sembrano discrete e silenziose, ma per il principio dell'interesse composto tra un mese il tuo bagaglio sarà inarrestabile.`,
  (ctx) => `Se un passaggio sembra impenetrabile alle 21:45, chiudi il quaderno e dormici sopra: il consolidamento REM notturno farà il resto.`,
  (ctx) => `UNIMORE ti aspetta. Il traguardo di Ingegneria Informatica è forgiato in serate esattamente come questa.`,
  (ctx) => `Non studiare fino allo sfinimento: alle 22:30 spegni la lampada e riposa. Domani è un altro ciclo operativo da affrontare con lucidità.`,
  (ctx) => `Il nostro algoritmo di rolling rebalancer ha già rimodellato il piano fino al 10 Gennaio. Tu devi solo fidarti della casella odierna.`,
  (ctx) => `Hai completato ${ctx.aPct}% di Analisi 1 e ${ctx.gPct}% di Geometria. Ogni singola spunta verde sul to-do è una conquista tangibile.`,
  (ctx) => `T-minus ${ctx.days} giorni alla meta del 10 Gennaio 2027. La distanza si riduce ogni sera. Procedi con orgoglio: sono fiero di essere il tuo copilota.`
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
    }, 20);

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

  // Periodic thought emission & AUTO-OPEN EVERY ONCE IN A WHILE (between 45s and 70s)
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
          className="mb-3 w-80 sm:w-96 rounded-2xl bg-black/95 border border-rose-500/40 p-4 shadow-2xl shadow-rose-950/50 backdrop-blur-xl text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300"
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
