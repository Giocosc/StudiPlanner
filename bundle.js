
// In-browser globals from React
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// Global Error Boundary to prevent any blank black screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("[StudiPlanner ErrorBoundary Caught]", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">StudiPlanner — Ripristino Schermo</h2>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            È stato intercettato un errore imprevisto di rendering. I tuoi dati salvati sono al sicuro in memoria locale.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition"
            >
              Ricarica Pagina (F5)
            </button>
            <button
              onClick={() => {
                if (confirm("Ripristinare le impostazioni predefinite dei 63 argomenti UNIMORE?")) {
                  localStorage.removeItem("unimore_rebalancer_topics_v2");
                  localStorage.removeItem("unimore_rebalancer_settings_v2");
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs border border-slate-700 transition"
            >
              Ripristina Dati Predefiniti
            </button>
          </div>
          {this.state.error && (
            <pre className="mt-6 p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-[11px] font-mono text-rose-300 max-w-xl text-left overflow-x-auto">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}


// --- src/data/defaultData.js ---
// Default Dataset for UNIMORE Analisi 1 and Geometria (Nov 2026 - Jan 2027)
// Sourced directly from official syllabus, ODS roadmap, and Geometria.txt

const DEFAULT_ANALISI_TOPICS = [
  {
    id: "A-01",
    materia: "Analisi 1",
    capitolo: "Insiemi e Numeri",
    argomento: "Insiemi numerici (N, Z, Q, R), densità di Q in R, maggioranti, minoranti, sup, inf, max, min e principio di induzione",
    oreStimate: 2.5,
    difficolta: 2,
    prioritaEsame: 3,
    isCompleted: false,
    fonti: "INDICE Cap. 1, Registro 1ª-2ª sett., Lezioni 1 e 4, Marcellini Cap. 1-2",
    note: "Definizione formale sup/inf e dim. induzione somma geometrica"
  },
  {
    id: "A-02",
    materia: "Analisi 1",
    capitolo: "Funzioni Elementari",
    argomento: "Proprietà funzioni (iniettività, suriettività, inversa, composta, monotonia), valore assoluto e intorni",
    oreStimate: 2.5,
    difficolta: 2,
    prioritaEsame: 3,
    isCompleted: false,
    fonti: "INDICE Cap. 1, Registro 1ª sett., Lezione 2, Marcellini Cap. 1 e 5",
    note: "Grafici funzioni elementari, inverse circolari e domini"
  },
  {
    id: "A-03",
    materia: "Analisi 1",
    capitolo: "Numeri Complessi",
    argomento: "Numeri Complessi: forma algebrica, piano di Gauss, forma trigonometrica, esponenziale, De Moivre e radici n-esime",
    oreStimate: 2.0,
    difficolta: 2,
    prioritaEsame: 2,
    isCompleted: false,
    fonti: "INDICE Cap. 2, Registro Complessi, Marcellini Cap. 2 Appendice § 15",
    note: "Equazioni algebriche in C e radici n-esime"
  },
  {
    id: "A-04",
    materia: "Analisi 1",
    capitolo: "Successioni",
    argomento: "Successioni (Pt 1): Limite topologico (eps-n0), unicità, limitatezza convergenti, permanenza segno, due carabinieri",
    oreStimate: 3.0,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Registro 2ª sett., Lezioni 4 e 5, Marcellini Cap. 3 §§ 16-22",
    note: "Dimostrazioni unicità, limitatezza e permanenza segno"
  },
  {
    id: "A-05",
    materia: "Analisi 1",
    capitolo: "Successioni",
    argomento: "Successioni (Pt 2): Operazioni limiti in R esteso, forme indeterminate, successioni monotone ed esistenza limite",
    oreStimate: 2.5,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Registro 2ª-3ª sett., Lezione 6, Marcellini Cap. 3",
    note: "Forme indeterminate algebriche e dim. limite succ. monotone"
  },
  {
    id: "A-06",
    materia: "Analisi 1",
    capitolo: "Successioni",
    argomento: "Successioni (Pt 3): Numero di Nepero e, Criterio del rapporto, gerarchia infiniti, o-piccolo e asintotico (~)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Registro 3ª sett., Lezione 7, Marcellini Cap. 3 §§ 23-26",
    note: "Algebra degli o-piccolo e stime asintotiche per successioni"
  },
  {
    id: "A-07",
    materia: "Analisi 1",
    capitolo: "Limiti di Funzioni",
    argomento: "Limiti di Funzioni: Intorni forati, definizioni eps-delta, limite dx/sx, Teorema ponte e limiti notevoli",
    oreStimate: 2.0,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "INDICE Cap. 4, Lezione 10, Marcellini Cap. 4 §§ 29-32",
    note: "Uso del Teorema Ponte e limiti notevoli trig/exp/log"
  },
  {
    id: "A-08",
    materia: "Analisi 1",
    capitolo: "Continuità",
    argomento: "Funzioni Continue: T. degli Zeri (bisezione), T. di Bolzano (valori intermedi), T. di Weierstrass e discontinuità",
    oreStimate: 3.0,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Registro 5ª sett., Lezione 10, Marcellini Cap. 4 §§ 33-38",
    note: "Dimostrazione costruttiva Zeri (bisezione) e ipotesi Weierstrass"
  },
  {
    id: "A-09",
    materia: "Analisi 1",
    capitolo: "Formula di Taylor",
    argomento: "Formula di Taylor: Resto di Peano (dim n=1,2) e sviluppi di Maclaurin fondamentali (exp, sin, cos, log, etc.)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "INDICE Cap. 7, Registro 5ª-6ª sett., Lezione 13, Marcellini Cap. 6 e 10",
    note: "Memoria sviluppi Maclaurin e dim. Taylor con resto Peano per n=2"
  },
  {
    id: "A-10",
    materia: "Analisi 1",
    capitolo: "Formula di Taylor",
    argomento: "Formula di Taylor e Limiti: Scelta ordine, algebra o-piccolo nei prodotti, cancellazioni e limiti con parametri",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Registro 6ª sett., Lezione 14, Appunti Manfredini, Marcellini Cap. 10",
    note: "Risoluzione limiti complessi d'esame in meno di 6 minuti"
  },
  {
    id: "A-11",
    materia: "Analisi 1",
    capitolo: "Consolidamento",
    argomento: "Simulazione I Parziale: Insiemi, successioni, limiti, continuità e Taylor a tempo",
    oreStimate: 2.0,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Registro Correzione I prova, Lezione 7",
    note: "Zero dubbi operativi su limiti e equivalenze asintotiche"
  },
  {
    id: "A-12",
    materia: "Analisi 1",
    capitolo: "Calcolo Differenziale",
    argomento: "Calcolo Differenziale (Pt 1): Definizione derivata, retta tg, legame continuità-derivabilità e algebra derivate",
    oreStimate: 3.0,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Registro 5ª-6ª sett., Lezione 17, Marcellini Cap. 5",
    note: "Dim. legame continuità-derivabilità + controesempio |x|"
  },
  {
    id: "A-13",
    materia: "Analisi 1",
    capitolo: "Calcolo Differenziale",
    argomento: "Calcolo Differenziale (Pt 2): Derivata funzione composta e inversa (arcsin, arccos, arctan) e limite della derivata",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Lezione 17, Marcellini Cap. 5",
    note: "Dim. derivata composta e ricavare derivate funzioni inverse"
  },
  {
    id: "A-14",
    materia: "Analisi 1",
    capitolo: "Teoremi Differenziali",
    argomento: "Teoremi del Differenziale: Teorema di Fermat, Rolle, Lagrange e Test di monotonia/derivata nulla",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Lezione 18, Marcellini Cap. 6",
    note: "Dim. rigorosa di Fermat, Rolle, Lagrange e corollari"
  },
  {
    id: "A-15",
    materia: "Analisi 1",
    capitolo: "Convessità e Asintoti",
    argomento: "Convessità, Flessi e de L'Hôpital: Test convessità (f'' >= 0), Teorema di Cauchy e de L'Hôpital (caso 0/0)",
    oreStimate: 2.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Lezione 18, Marcellini Cap. 6",
    note: "Dim. De L'Hôpital e test derivata seconda per concavità/convessità"
  },
  {
    id: "A-16",
    materia: "Analisi 1",
    capitolo: "Studio di Funzione",
    argomento: "Studio Completo di Funzione: Grafico, asintoti obliqui, derivata prima e seconda, cuspidi, angolosi e flessi",
    oreStimate: 3.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Marcellini Cap. 6, Temi d'esame UNIMORE",
    note: "Grafico finale impeccabile e studio punti di non derivabilità"
  },
  {
    id: "A-17",
    materia: "Analisi 1",
    capitolo: "Integrali Definiti",
    argomento: "Integrali Definiti (Riemann): Somme sup/inf, definizione di Riemann, integrabilità e controesempio Dirichlet",
    oreStimate: 2.5,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Registro, Marcellini Cap. 8",
    note: "Dim. CNS di Riemann (S - s < epsilon)"
  },
  {
    id: "A-18",
    materia: "Analisi 1",
    capitolo: "Teoremi Integrale",
    argomento: "Teoremi Integrali: T. Media, Funzione Integrale, I e II T. Fondamentale del Calcolo Integrale (Torricelli)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Registro, Marcellini Cap. 8-9",
    note: "Dim. integrale della media e Torricelli"
  },
  {
    id: "A-19",
    materia: "Analisi 1",
    capitolo: "Metodi di Integrazione",
    argomento: "Metodi di Integrazione: Integrazione per Parti, per Sostituzione e Funzioni Razionali Fratte",
    oreStimate: 2.0,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Registro, Marcellini Cap. 9",
    note: "Dim. formule per parti e sostituzione; fratti semplici"
  },
  {
    id: "A-20",
    materia: "Analisi 1",
    capitolo: "Integrali Generalizzati",
    argomento: "Integrali Generalizzati: Impropri notevoli 1/x^a, criteri confronto, confronto asintotico e ass. convergenza",
    oreStimate: 3.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Lezione 25, Marcellini Cap. 9",
    note: "Dim. convergenza 1/x^a e criteri convergenza integrale"
  },
  {
    id: "A-21",
    materia: "Analisi 1",
    capitolo: "Serie Numeriche",
    argomento: "Serie Numeriche (Pt 1): Condizione an->0, Serie geometrica/armonica, criteri termini non negativi (confronto)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Marcellini Cap. 11",
    note: "Dim. serie geometrica e condizione necessaria"
  },
  {
    id: "A-22",
    materia: "Analisi 1",
    capitolo: "Serie Numeriche",
    argomento: "Serie Numeriche (Pt 2): Criterio del Rapporto, Radice, Integrale e Serie a segno alterno (Criterio di Leibniz)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Marcellini Cap. 11",
    note: "Dim. criteri convergenza e stima del resto di Leibniz"
  },
  {
    id: "A-23",
    materia: "Analisi 1",
    capitolo: "Serie di Taylor",
    argomento: "Serie di Taylor: Sviluppabilità in serie e controesempio fondamentale funzione C-infinito non sviluppabile (e^-1/x^2)",
    oreStimate: 2.0,
    difficolta: 3,
    prioritaEsame: 3,
    isCompleted: false,
    fonti: "Registro 13 dic, Marcellini Cap. 11",
    note: "Controesempio fondamentale e raggio di convergenza"
  },
  {
    id: "A-24",
    materia: "Analisi 1",
    capitolo: "Consolidamento",
    argomento: "Simulazione II Parziale: Derivate, Studio Funzione, Integrali, Serie e Complessi",
    oreStimate: 3.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Temi d'esame 2021-2024",
    note: "Simulazione a tempo con 5-6 esercizi da svolgere per esteso"
  },
  {
    id: "A-25",
    materia: "Analisi 1",
    capitolo: "Simulazione & Ripasso",
    argomento: "Simulazione Prova Scritta #1 e Ripasso Blocco 1 (Limiti e Taylor)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Temi d'esame ufficiali",
    note: "Focus su velocità nei limiti con Taylor e Maclaurin"
  },
  {
    id: "A-26",
    materia: "Analisi 1",
    capitolo: "Simulazione & Ripasso",
    argomento: "Simulazione Prova Scritta #2 e Ripasso Blocco 2 (Studio Funzione)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Temi d'esame ufficiali",
    note: "Studio completo di funzione con parametri e raccordi"
  },
  {
    id: "A-27",
    materia: "Analisi 1",
    capitolo: "Simulazione & Ripasso",
    argomento: "Clinica di Recupero Lacune: Integrali Impropri, Fratti Semplici e Serie numeriche",
    oreStimate: 2.0,
    difficolta: 4,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Registro lacune e note",
    note: "Consolidamento convergenza integrali e serie parametriche"
  },
  {
    id: "A-28",
    materia: "Analisi 1",
    capitolo: "Simulazione & Ripasso",
    argomento: "Simulazione Scritto #3 e Simulazione Interrogazione Orale (Derivate e Teoremi del Valor Medio)",
    oreStimate: 3.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Lista 43 Teoremi Cassaforte",
    note: "Esposizione orale fluida di Rolle, Lagrange, Fermat e De L'Hôpital"
  },
  {
    id: "A-29",
    materia: "Analisi 1",
    capitolo: "Simulazione & Ripasso",
    argomento: "Simulazione Scritto #4 e Simulazione Interrogazione Orale (Integrali e Teorema di Torricelli)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Lista 43 Teoremi Cassaforte",
    note: "Esposizione orale delle 2 dimostrazioni fondamentali degli integrali"
  },
  {
    id: "A-30",
    materia: "Analisi 1",
    capitolo: "Simulazione & Ripasso",
    argomento: "Simulazione Scritto #5 e Simulazione Interrogazione Orale (Serie e Teoremi)",
    oreStimate: 2.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Lista 43 Teoremi Cassaforte",
    note: "Saper collegare Integrali Impropri e Serie numeriche"
  },
  {
    id: "A-31",
    materia: "Analisi 1",
    capitolo: "Simulazione & Ripasso",
    argomento: "Ripasso Sistematico Esempi, Controesempi e Ipotesi dei Teoremi",
    oreStimate: 2.0,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Registro Esempi fondamentali",
    note: "Pronto 1 esempio e 1 controesempio per ciascuna ipotesi violata"
  },
  {
    id: "A-32",
    materia: "Analisi 1",
    capitolo: "Simulazione & Ripasso",
    argomento: "PROVA GENERALE FINALE: Scritto completo a tempo + Orale globale random",
    oreStimate: 3.0,
    difficolta: 5,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Tutte le fonti d'esame",
    note: "Prontezza assoluta 100% per appello di Gennaio"
  }
];

const DEFAULT_GEOMETRIA_TOPICS = [
  {
    id: "G-01",
    materia: "Geometria",
    capitolo: "Matrici e Determinanti",
    argomento: "Operazioni sulle matrici e tipologie",
    oreStimate: 2.0,
    difficolta: 1,
    prioritaEsame: 3,
    isCompleted: false,
    fonti: "Programma UNIMORE, Testo Cap. 1-2",
    note: "Operazioni elementari e matrici speciali"
  },
  {
    id: "G-02",
    materia: "Geometria",
    capitolo: "Matrici e Determinanti",
    argomento: "Determinante (Definizione, Proprietà, Laplace, Binet)",
    oreStimate: 3.5,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Prop. 3.40, Teor. 3.41/3.42",
    note: "Calcolo determinante 3x3 e 4x4 senza errori"
  },
  {
    id: "G-03",
    materia: "Geometria",
    capitolo: "Matrici e Determinanti",
    argomento: "Matrice Inversa e Condizioni di invertibilità",
    oreStimate: 2.0,
    difficolta: 2,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Teor. 3.45/3.46",
    note: "Formula con matrice aggiunta e metodo di Gauss-Jordan"
  },
  {
    id: "G-04",
    materia: "Geometria",
    capitolo: "Matrici e Determinanti",
    argomento: "Rango di una matrice e trasformazioni elementari",
    oreStimate: 3.0,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Appunti Algoritmo B, Testo Cap. 3",
    note: "Riduzione a gradini e determinazione pivot in <3 min"
  },
  {
    id: "G-05",
    materia: "Geometria",
    capitolo: "Spazi Vettoriali",
    argomento: "Spazi vettoriali, sottospazi e chiusura lineare",
    oreStimate: 2.5,
    difficolta: 2,
    prioritaEsame: 3,
    isCompleted: false,
    fonti: "Testo Cap. 4",
    note: "Verifica assiomi sottospazio vettoriale"
  },
  {
    id: "G-06",
    materia: "Geometria",
    capitolo: "Spazi Vettoriali",
    argomento: "Combinazioni lineari, dipendenza e indipendenza lineare",
    oreStimate: 2.5,
    difficolta: 2,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Testo Cap. 4",
    note: "Verifica indipendenza lineare e sistemi omogenei associati"
  },
  {
    id: "G-07",
    materia: "Geometria",
    capitolo: "Spazi Vettoriali",
    argomento: "Sistemi di generatori, Base e Dimensione",
    oreStimate: 3.5,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Teorema 4.26, Testo Cap. 4",
    note: "Dim. Teorema della base e completamento a base"
  },
  {
    id: "G-08",
    materia: "Geometria",
    capitolo: "Spazi Vettoriali",
    argomento: "Componenti di un vettore rispetto a una base ordinata",
    oreStimate: 2.0,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Prop. 4.31, Cor. 4.32",
    note: "Dim. unicità dei coefficienti di Fourier/coordinate"
  },
  {
    id: "G-09",
    materia: "Geometria",
    capitolo: "Spazi Vettoriali",
    argomento: "Somma, intersezione di sottospazi e Relazione di Grassmann",
    oreStimate: 3.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 4, Dimostrazioni Orale",
    note: "Dim. Formula di Grassmann e somme dirette"
  },
  {
    id: "G-10",
    materia: "Geometria",
    capitolo: "Trasformazioni Lineari",
    argomento: "Definizione di trasformazione lineare, Nucleo e Immagine",
    oreStimate: 3.5,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 5",
    note: "Calcolo basi di Ker(T) e Im(T)"
  },
  {
    id: "G-11",
    materia: "Geometria",
    capitolo: "Trasformazioni Lineari",
    argomento: "Iniettività, suriettività ed equazione dimensionale",
    oreStimate: 2.5,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Teorema Nullità più Rango, Cap. 5",
    note: "Dim. Teorema fondamentale omomorfismi dim V = dim Ker + dim Im"
  },
  {
    id: "G-12",
    materia: "Geometria",
    capitolo: "Trasformazioni Lineari",
    argomento: "Matrici associate ed equazione matriciale",
    oreStimate: 3.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 5",
    note: "Costruzione matrice associata rispetto a basi diverse"
  },
  {
    id: "G-13",
    materia: "Geometria",
    capitolo: "Trasformazioni Lineari",
    argomento: "Matrici simili e loro proprietà",
    oreStimate: 2.0,
    difficolta: 4,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Testo Cap. 5 e 7",
    note: "Invarianti di similitudine: traccia, determinante, rango, autovalori"
  },
  {
    id: "G-14",
    materia: "Geometria",
    capitolo: "Sistemi Lineari",
    argomento: "Sistemi lineari e Teorema di Rouché-Capelli",
    oreStimate: 2.5,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Prop. 6.7, Testo Cap. 6",
    note: "Dim. Rouché-Capelli e compatibilità con parametri k"
  },
  {
    id: "G-15",
    materia: "Geometria",
    capitolo: "Sistemi Lineari",
    argomento: "Spazio delle soluzioni, sistemi omogenei e sistemi di Cramer",
    oreStimate: 3.0,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Prop. 6.9, Testo Cap. 6",
    note: "Dim. struttura affine dello spazio delle soluzioni V0 + v_p"
  },
  {
    id: "G-16",
    materia: "Geometria",
    capitolo: "Sistemi Lineari",
    argomento: "Rappresentazione cartesiana e parametrica di sottospazi",
    oreStimate: 3.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Appunti Algoritmo B",
    note: "Passaggio rapido da equazioni cartesiane a basi e viceversa"
  },
  {
    id: "G-17",
    materia: "Geometria",
    capitolo: "Autovalori e Autovettori",
    argomento: "Polinomio caratteristico, autovalori, autovettori e autospazi",
    oreStimate: 3.5,
    difficolta: 3,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 7",
    note: "Radici di det(A - lambda I) e ricerca basi autospazi V(lambda)"
  },
  {
    id: "G-18",
    materia: "Geometria",
    capitolo: "Autovalori e Autovettori",
    argomento: "Molteplicità algebrica, molteplicità geometrica e diagonalizzabilità",
    oreStimate: 3.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 7, Dimostrazioni Orale",
    note: "Condizioni necessarie e sufficienti per la diagonalizzabilità"
  },
  {
    id: "G-19",
    materia: "Geometria",
    capitolo: "Autovalori e Autovettori",
    argomento: "Teorema Spettrale",
    oreStimate: 2.0,
    difficolta: 4,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Testo Cap. 7 e 8",
    note: "Diagonalizzazione ortogonale di matrici simmetriche reali"
  },
  {
    id: "G-20",
    materia: "Geometria",
    capitolo: "Spazi Vettoriali Euclidei",
    argomento: "Prodotto scalare, norma, angolo e Disuguaglianza di Schwarz",
    oreStimate: 3.0,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Testo Cap. 8",
    note: "Dim. Disuguaglianza di Cauchy-Schwarz e triangolare"
  },
  {
    id: "G-21",
    materia: "Geometria",
    capitolo: "Spazi Vettoriali Euclidei",
    argomento: "Basi ortogonali, ortonormali e ortonormalizzazione di Gram-Schmidt",
    oreStimate: 3.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 8",
    note: "Algoritmo pratico di Gram-Schmidt e normalizzazione"
  },
  {
    id: "G-22",
    materia: "Geometria",
    capitolo: "Spazi Vettoriali Euclidei",
    argomento: "Complemento ortogonale",
    oreStimate: 2.5,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Testo Cap. 8",
    note: "Ricerca del complemento ortogonale U-perp e somma diretta"
  },
  {
    id: "G-23",
    materia: "Geometria",
    capitolo: "Geometria Euclidea",
    argomento: "Spazio euclideo, riferimenti cartesiani e componenti vettori",
    oreStimate: 2.0,
    difficolta: 2,
    prioritaEsame: 3,
    isCompleted: false,
    fonti: "Testo Cap. 9",
    note: "Vettori liberi, applicati e coordinate cartesiane"
  },
  {
    id: "G-24",
    materia: "Geometria",
    capitolo: "Geometria Euclidea",
    argomento: "Piano E2: rette, mutue posizioni, parallelismo, distanze",
    oreStimate: 3.5,
    difficolta: 3,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Testo Cap. 9",
    note: "Fasci di rette e distanza punto-retta"
  },
  {
    id: "G-25",
    materia: "Geometria",
    capitolo: "Geometria Euclidea",
    argomento: "Spazio E3: rette, piani, coefficienti direttori, mutue posizioni, distanze",
    oreStimate: 4.0,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 9",
    note: "Posizioni reciproche retta-piano, rette sghembe, distanza minima"
  },
  {
    id: "G-26",
    materia: "Geometria",
    capitolo: "Geometria Euclidea",
    argomento: "Prodotto vettoriale, misto, aree e volumi",
    oreStimate: 2.0,
    difficolta: 2,
    prioritaEsame: 3,
    isCompleted: false,
    fonti: "Testo Cap. 9",
    note: "Proprietà e calcolo aree triangoli e volumi tetraedri/parallelepipedi"
  },
  {
    id: "G-27",
    materia: "Geometria",
    capitolo: "Teoria delle Coniche",
    argomento: "Ampliamento proiettivo, equazioni, matrici associate, classificazione",
    oreStimate: 3.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 12",
    note: "Classificazione affine tramite det(A) e det(A_00)"
  },
  {
    id: "G-28",
    materia: "Geometria",
    capitolo: "Teoria delle Coniche",
    argomento: "Centro, diametri, asintoti, assi e vertici",
    oreStimate: 3.5,
    difficolta: 4,
    prioritaEsame: 5,
    isCompleted: false,
    fonti: "Testo Cap. 12",
    note: "Polarità e ricerca elementi geometrici della conica"
  },
  {
    id: "G-29",
    materia: "Geometria",
    capitolo: "Teoria delle Coniche",
    argomento: "Riduzione in forma canonica",
    oreStimate: 2.5,
    difficolta: 5,
    prioritaEsame: 4,
    isCompleted: false,
    fonti: "Testo Cap. 12",
    note: "Rototraslazione e invarianti ortogonali I1, I2, I3"
  },
  {
    id: "G-30",
    materia: "Geometria",
    capitolo: "Teoria delle Coniche",
    argomento: "Fasci di coniche e cenno alle quadriche",
    oreStimate: 2.0,
    difficolta: 4,
    prioritaEsame: 2,
    isCompleted: false,
    fonti: "Testo Cap. 12",
    note: "Punti base del fascio, coniche degeneri del fascio e quadriche in E3"
  },
  {
    id: "G-31",
    materia: "Geometria",
    capitolo: "Strutture Algebriche",
    argomento: "Gruppi, anelli, campi e algebre di Boole",
    oreStimate: 1.5,
    difficolta: 2,
    prioritaEsame: 1,
    isCompleted: false,
    fonti: "Testo Cap. 1-2",
    note: "Definizioni e assiomi delle strutture algebriche fondamentali"
  }
];

const INITIAL_TOPICS = [...DEFAULT_ANALISI_TOPICS, ...DEFAULT_GEOMETRIA_TOPICS];


// --- src/components/Icons.js ---
// Standalone, zero-dependency SVG Icons for the Study Plan Rebalancer


function IconCalendar({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IconClock({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCheckCircle({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconAlertTriangle({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function IconBookOpen({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function IconLayers({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function IconBarChart({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function IconSettings({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconUpload({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function IconDownload({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function IconRefresh({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function IconFlame({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  );
}

function IconChevronLeft({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function IconChevronRight({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function IconSearch({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconFilter({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function IconBriefcase({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconHistory({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12a9 9 0 0115.5-6.36L21 8m0 0v-5m0 5h-5" />
    </svg>
  );
}

function IconSave({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}

function IconPlay({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconPause({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function IconRotateCcw({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function IconSun({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" strokeWidth="2" />
      <path strokeLinecap="round" strokeWidth="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconMoon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function IconFileCheck({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconTomato({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v2m-3-1c1-1 3-1 3-1s2 0 3 1m-6 3a7 7 0 1012 4 7 7 0 00-12-4z" />
      <circle cx="12" cy="14" r="6" strokeWidth="2" />
    </svg>
  );
}

function IconSparkles({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function IconCopy({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function IconDice({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="2" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconX({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconPlus({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function IconTrash({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function IconInfo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconExternalLink({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function IconGitLab({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.65 14.39L20.6 8.08a.7.7 0 00-1.33 0l-1.58 4.85H6.31L4.73 8.08a.7.7 0 00-1.33 0L1.35 14.39a1.05 1.05 0 00.38 1.18l10.02 7.28a.5.5 0 00.59 0l10.02-7.28a1.05 1.05 0 00.38-1.18z" />
    </svg>
  );
}

function IconCloud({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  );
}






// --- src/services/rebalancerEngine.js ---
/**
 * Study Plan Rebalancer Engine
 * Handles calendar calculations, full-time work exclusions,
 * +20% high-priority buffers, and dynamic weekly/daily schedule allocation.
 * 
 * Supports ROLLING REBALANCING:
 * - If days are missed/skipped, uncompleted topics automatically roll forward to Today.
 * - If topics are completed ahead of time, future days automatically pull forward.
 * - Full historical tracking of past dates (completed vs skipped days).
 */

function getLocalTodayDateStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;
  // Clamp within session bounds if outside
  if (dateStr < "2026-11-16") return "2026-11-16";
  if (dateStr > "2027-01-10") return "2027-01-10";
  return dateStr;
}

function addDaysToDateStr(dateStr, days) {
  if (!dateStr) return dateStr;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().split("T")[0];
}

const DEFAULT_SETTINGS = {
  roadmapStartDate: "2026-11-16", // Start of winter session roadmap
  targetExamDate: "2027-01-10",
  currentSimulatedDate: getLocalTodayDateStr(), // Active date: synchronized with real today!
  criticalWeeklyHoursThreshold: 25.0, // Base lavoratore full-time
  eveningStudyHours: 2.5, // 19:30 - 22:00 (2.5h)
  weekdayStudyHours: 2.5, // Standard feriale base
  weekendStudyHours: 4.5, // Dedicated blocks (Sat, Sun)
  highPriorityThreshold: 4, // 4 or 5 triggers high priority buffer
  bufferMultiplier: 1.2, // +20% time buffer
  interleaveSubjects: true, // Alternate Analisi and Geometria across days
  studyDays: {
    1: { name: "Lunedì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:30 - 22:00)" },
    2: { name: "Martedì", enabled: true, isWeekend: false, defaultSubject: "Geometria", timeSlot: "Sera (19:30 - 22:00)" },
    3: { name: "Mercoledì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:30 - 22:00)" },
    4: { name: "Giovedì", enabled: true, isWeekend: false, defaultSubject: "Geometria", timeSlot: "Sera (19:30 - 22:00)" },
    5: { name: "Venerdì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:00 - 21:30)" },
    6: { name: "Sabato", enabled: true, isWeekend: true, defaultSubject: "Misto", timeSlot: "Mattina + Pomeriggio" },
    0: { name: "Domenica", enabled: true, isWeekend: true, defaultSubject: "Misto", timeSlot: "Pomeriggio + Ripasso" }
  }
};

/**
 * Calculates days and weeks difference
 */
function getCalendarMetrics(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  // Normalize to UTC midnight
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  
  const diffMs = endUtc - startUtc;
  const remainingDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  const remainingWeeks = Math.max(0.1, remainingDays / 7);

  return {
    remainingDays,
    remainingWeeks: Number(remainingWeeks.toFixed(1)),
    isPastExam: diffMs <= 0
  };
}

/**
 * Calculates progress for each subject and total
 */
function calculateSubjectProgress(topics) {
  const result = {
    analisi: { totalHours: 0, completedHours: 0, percent: 0, totalCount: 0, completedCount: 0, remainingHours: 0 },
    geometria: { totalHours: 0, completedHours: 0, percent: 0, totalCount: 0, completedCount: 0, remainingHours: 0 },
    global: { totalHours: 0, completedHours: 0, percent: 0, totalCount: 0, completedCount: 0, remainingHours: 0 }
  };

  topics.forEach(t => {
    const isAnalisi = t.materia.toLowerCase().includes("analisi");
    const sub = isAnalisi ? result.analisi : result.geometria;
    const stimate = Number(t.oreStimate) || 2.0;
    const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
    const effettive = Number(t.oreEffettive || 0);

    // Ore residue: se completato sono 0, altrimenti max(0, oreStimate - oreEffettive)
    const residue = isDone ? 0 : Math.max(0, Number((stimate - effettive).toFixed(2)));

    sub.totalCount += 1;
    sub.totalHours += stimate;
    result.global.totalCount += 1;
    result.global.totalHours += stimate;

    // Calcolo ore svolte basato sulla somma totale di oreEffettive registrate
    // (fallback a oreStimate per compatibilità se completato ma oreEffettive non impostato)
    const actualSpent = isDone && effettive === 0 ? stimate : effettive;
    sub.completedHours += actualSpent;
    result.global.completedHours += actualSpent;

    if (isDone) {
      sub.completedCount += 1;
      result.global.completedCount += 1;
    }

    sub.remainingHours += residue;
    result.global.remainingHours += residue;
  });

  // Calculate percentages based on effective hours logged
  result.analisi.percent = result.analisi.totalHours > 0
    ? Math.min(100, Math.round((result.analisi.completedHours / result.analisi.totalHours) * 100))
    : 0;
  result.geometria.percent = result.geometria.totalHours > 0
    ? Math.min(100, Math.round((result.geometria.completedHours / result.geometria.totalHours) * 100))
    : 0;
  result.global.percent = result.global.totalHours > 0
    ? Math.min(100, Math.round((result.global.completedHours / result.global.totalHours) * 100))
    : 0;

  // Round numbers
  result.analisi.totalHours = Number(result.analisi.totalHours.toFixed(1));
  result.analisi.completedHours = Number(result.analisi.completedHours.toFixed(1));
  result.analisi.remainingHours = Number(result.analisi.remainingHours.toFixed(1));

  result.geometria.totalHours = Number(result.geometria.totalHours.toFixed(1));
  result.geometria.completedHours = Number(result.geometria.completedHours.toFixed(1));
  result.geometria.remainingHours = Number(result.geometria.remainingHours.toFixed(1));

  result.global.totalHours = Number(result.global.totalHours.toFixed(1));
  result.global.completedHours = Number(result.global.completedHours.toFixed(1));
  result.global.remainingHours = Number(result.global.remainingHours.toFixed(1));

  return result;
}

/**
 * Natural sequential ID comparator (e.g. A-01, A-02, ..., A-32 and G-01, G-02, ..., G-31)
 */
function sortBySequentialId(a, b) {
  const matchA = String(a.id || "").match(/\d+/);
  const matchB = String(b.id || "").match(/\d+/);
  const numA = matchA ? parseInt(matchA[0], 10) : 999;
  const numB = matchB ? parseInt(matchB[0], 10) : 999;
  if (numA !== numB) return numA - numB;
  return String(a.id || "").localeCompare(String(b.id || ""), undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Main rolling rebalancing function:
 * 1. Tracks history of past days from roadmapStartDate to currentSimulatedDate.
 * 2. Takes uncompleted topics and dynamically packs them starting from Today (currentSimulatedDate) onwards.
 * 3. Shifts topics forward automatically if days were missed.
 * 4. Pulls topics forward automatically if ahead of schedule.
 */
function rebalanceStudyPlan(topics, customSettings = {}, customDayCapacities = {}, studySessions = []) {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const dayCapacities = (customDayCapacities && typeof customDayCapacities === "object" && Object.keys(customDayCapacities).length > 0)
    ? customDayCapacities
    : (customSettings && customSettings.customDayCapacities ? customSettings.customDayCapacities : {});
  const sessions = Array.isArray(studySessions) && studySessions.length > 0
    ? studySessions
    : (customSettings && Array.isArray(customSettings.studySessions) ? customSettings.studySessions : []);

  const { remainingDays, remainingWeeks } = getCalendarMetrics(settings.currentSimulatedDate, settings.targetExamDate);

  // 1. Process and weigh topics with Granular Partial Progress (oreResidue)
  const processedTopics = topics.map(t => {
    const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
    const oreStimate = Number(t.oreStimate) || 2.0;
    const oreEffettive = Number(t.oreEffettive || 0);
    // Formula: const oreResidue = completato ? 0 : Math.max(0, oreStimate - oreEffettive);
    const oreResidue = isDone ? 0 : Math.max(0, Number((oreStimate - oreEffettive).toFixed(2)));

    const isHighPriority = (t.prioritaEsame || 3) >= settings.highPriorityThreshold;
    const isHighDifficulty = (t.difficolta || 3) >= settings.highPriorityThreshold;
    const hasBuffer = isHighPriority || isHighDifficulty;

    // Quando l'algoritmo spalma sui giorni futuri, usa oreResidue invece di oreStimate
    const baseHours = oreResidue;
    const effectiveHours = hasBuffer
      ? Number((baseHours * settings.bufferMultiplier).toFixed(2))
      : baseHours;

    return {
      ...t,
      completato: isDone,
      isCompleted: isDone,
      oreStimate,
      oreEffettive,
      oreResidue,
      baseHours,
      effectiveHours,
      hasBuffer,
      bufferDelta: Number((effectiveHours - baseHours).toFixed(2))
    };
  });

  // Filter topics with remaining workload to schedule forward
  const uncompletedToSchedule = processedTopics.filter(t => !t.completato && t.oreResidue > 0);

  // Total remaining workload from Today forward
  const totalRemainingBaseHours = Number(
    uncompletedToSchedule.reduce((acc, t) => acc + t.baseHours, 0).toFixed(1)
  );
  const totalRemainingEffectiveHours = Number(
    uncompletedToSchedule.reduce((acc, t) => acc + t.effectiveHours, 0).toFixed(1)
  );
  const totalBufferHours = Number((totalRemainingEffectiveHours - totalRemainingBaseHours).toFixed(1));

  // Baseline standard capacities (weekday evening & weekend blocks)
  const standardWeekdayHours = Number(settings.weekdayStudyHours !== undefined ? settings.weekdayStudyHours : (settings.eveningStudyHours || 2.5));
  const standardWeekendHours = Number(settings.weekendStudyHours || 4.5);

  // Nominal baseline weekly capacity: (5 * feriali) + (2 * weekend)
  const nominalWeeklyCapacity = Number(((standardWeekdayHours * 5) + (standardWeekendHours * 2)).toFixed(1));
  const dynamicCriticalThreshold = (customSettings && customSettings.criticalWeeklyHoursThreshold)
    ? Number(customSettings.criticalWeeklyHoursThreshold)
    : (settings.criticalWeeklyHoursThreshold || 25.0);

  // Required weekly pace to finish by targetExamDate
  const requiredWeeklyHours = Number((totalRemainingEffectiveHours / Math.max(1, remainingWeeks)).toFixed(1));
  const isCriticalOverload = requiredWeeklyHours > dynamicCriticalThreshold;

  // 2. Generate FULL calendar from roadmapStartDate to targetExamDate
  const allCalendarDays = [];
  const startDate = new Date(settings.roadmapStartDate || "2026-11-16");
  const todayDate = new Date(settings.currentSimulatedDate);
  const targetDate = new Date(settings.targetExamDate);

  const startUtc = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

  let curDate = new Date(startDate);
  let dayOffset = 0;

  while (curDate <= targetDate && dayOffset < 150) {
    const dayOfWeek = curDate.getDay(); // 0 is Sunday, 1 is Monday...
    const dayConfig = settings.studyDays[dayOfWeek] || { enabled: true, isWeekend: false, name: "Giorno" };
    const dateStr = curDate.toISOString().split("T")[0];

    const curUtc = Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
    const weekIndex = Math.floor((curUtc - startUtc) / (1000 * 60 * 60 * 24 * 7)) + 1;

    const isPast = dateStr < settings.currentSimulatedDate;
    const isToday = dateStr === settings.currentSimulatedDate;
    const isFuture = dateStr > settings.currentSimulatedDate;

    // Standard fallback capacity from settings
    const fallbackHours = dayConfig.isWeekend ? standardWeekendHours : standardWeekdayHours;

    // Dynamic Daily Capacity Override (Time Shifter)
    const hasCustomOverride = Boolean(
      dayCapacities &&
      Object.prototype.hasOwnProperty.call(dayCapacities, dateStr) &&
      dayCapacities[dateStr] !== null &&
      dayCapacities[dateStr] !== undefined
    );
    const maxDayHours = hasCustomOverride ? Math.max(0, Number(dayCapacities[dateStr])) : fallbackHours;

    let timeSlotDescription = "";
    if (hasCustomOverride) {
      if (maxDayHours > fallbackHours) {
        timeSlotDescription = `Slot Extra Attivo (${maxDayHours}h)`;
      } else if (maxDayHours < fallbackHours) {
        timeSlotDescription = `Budget Ridotto (${maxDayHours}h)`;
      } else {
        timeSlotDescription = `Budget Personalizzato (${maxDayHours}h)`;
      }
    } else if (dayConfig.isWeekend) {
      timeSlotDescription = dayConfig.timeSlot || `Blocco Weekend (${maxDayHours}h)`;
    } else {
      timeSlotDescription = dayConfig.timeSlot || `Sera (${maxDayHours}h)`;
    }

    allCalendarDays.push({
      date: dateStr,
      dayOfWeek,
      dayName: dayConfig.name,
      enabled: dayConfig.enabled,
      isWeekend: dayConfig.isWeekend,
      timeSlot: timeSlotDescription,
      preferredSubject: dayConfig.defaultSubject || "Misto",
      maxHours: maxDayHours,
      standardHours: fallbackHours,
      hasCustomOverride,
      allocatedHours: 0,
      weekIndex,
      isPast,
      isToday,
      isFuture,
      dayStatus: isPast ? "pending" : "scheduled", // "completed", "skipped", "scheduled", "rest"
      topics: [],
      spacedReviews: []
    });

    curDate.setDate(curDate.getDate() + 1);
    dayOffset++;
  }

  // 3. Populate COMPLETED TOPICS & REGISTERED STUDY SESSIONS on their dates (Past + Today + Future if completed ahead)
  let pastDaysStudied = 0;
  let pastDaysSkipped = 0;
  let totalPastHours = 0;

  allCalendarDays.forEach(day => {
    // 1. Check for explicitly logged study sessions on this date
    const sessionsOnThisDay = sessions.filter(s => s.date === day.date);

    // 2. Check for topics completed on this exact date (direct checkbox / legacy)
    const completedOnThisDay = processedTopics.filter(t => t.completato && t.completedDate === day.date);

    const dayTopics = [];
    const seenTopicIds = new Set();

    // First add logged study sessions for this date
    sessionsOnThisDay.forEach(sess => {
      const topicRef = processedTopics.find(t => t.id === sess.topicId);
      seenTopicIds.add(sess.topicId);
      dayTopics.push({
        ...(topicRef || { id: sess.topicId, materia: "Studio", argomento: "Sessione di Studio", capitolo: "" }),
        effectiveHours: Number(sess.hours || 0),
        isSessionLog: true,
        sessionId: sess.id,
        sessionCompleted: Boolean(sess.completed),
        sessionNote: sess.note || "",
        assignedDate: day.date,
        assignedWeek: day.weekIndex,
        assignedDayName: day.dayName
      });
    });

    // Then add any completed topics on this date not already represented in sessions
    completedOnThisDay.forEach(t => {
      if (!seenTopicIds.has(t.id)) {
        seenTopicIds.add(t.id);
        dayTopics.push({
          ...t,
          effectiveHours: Number(t.oreEffettive || t.oreStimate || 0),
          assignedDate: day.date,
          assignedWeek: day.weekIndex,
          assignedDayName: day.dayName
        });
      }
    });

    if (dayTopics.length > 0) {
      if (day.isPast || day.isToday) {
        day.dayStatus = "completed";
      }
      day.topics = dayTopics;
      day.allocatedHours = Number(dayTopics.reduce((acc, t) => acc + (Number(t.effectiveHours || 0)), 0).toFixed(1));
      if (day.isPast || day.isToday) {
        pastDaysStudied++;
        totalPastHours += day.allocatedHours;
      }
    } else if (day.isPast) {
      if (day.enabled) {
        day.dayStatus = "skipped"; // Missed study day
        pastDaysSkipped++;
      } else {
        day.dayStatus = "rest";
      }
    }
  });

  // 4. Sequential queues for ACTIVE & FUTURE study (Starting from Today)
  // Strictly respects the pedagogical sequence: A-01, A-02, ... and G-01, G-02, ...
  const analisiQueue = uncompletedToSchedule
    .filter(t => t.materia.toLowerCase().includes("analisi"))
    .sort(sortBySequentialId);

  const geometriaQueue = uncompletedToSchedule
    .filter(t => t.materia.toLowerCase().includes("geometria"))
    .sort(sortBySequentialId);

  // Active / Future days where new study can be allocated (Today + Future)
  const activeAndFutureDays = allCalendarDays.filter(d => (d.isToday || d.isFuture) && d.enabled);

  activeAndFutureDays.forEach(day => {
    let capacityLeft = Math.max(0, Number((day.maxHours - day.allocatedHours).toFixed(2)));

    // An empty day always gets at least one topic (if queue has topics).
    // A day that already has topics/sessions only gets an extra topic if there is at least 1.0h of capacity left AND it hasn't reached maxHours.
    while (
      (day.topics.length === 0 && capacityLeft > 0.4) ||
      (day.topics.length > 0 && capacityLeft >= 1.0 && day.allocatedHours < day.maxHours)
    ) {
      let chosenTopic = null;
      let chosenQueue = null;

      // Select subject queue based on day preference or availability
      if (day.preferredSubject === "Analisi 1") {
        if (analisiQueue.length > 0) {
          chosenTopic = analisiQueue[0];
          chosenQueue = analisiQueue;
        } else if (geometriaQueue.length > 0) {
          chosenTopic = geometriaQueue[0];
          chosenQueue = geometriaQueue;
        }
      } else if (day.preferredSubject === "Geometria") {
        if (geometriaQueue.length > 0) {
          chosenTopic = geometriaQueue[0];
          chosenQueue = geometriaQueue;
        } else if (analisiQueue.length > 0) {
          chosenTopic = analisiQueue[0];
          chosenQueue = analisiQueue;
        }
      } else {
        // Misto (e.g. Weekend slots): alternate subjects sequentially
        if (day.topics.length % 2 === 0) {
          if (analisiQueue.length > 0) {
            chosenTopic = analisiQueue[0];
            chosenQueue = analisiQueue;
          } else if (geometriaQueue.length > 0) {
            chosenTopic = geometriaQueue[0];
            chosenQueue = geometriaQueue;
          }
        } else {
          if (geometriaQueue.length > 0) {
            chosenTopic = geometriaQueue[0];
            chosenQueue = geometriaQueue;
          } else if (analisiQueue.length > 0) {
            chosenTopic = analisiQueue[0];
            chosenQueue = analisiQueue;
          }
        }
      }

      if (!chosenTopic) break; // All uncompleted topics have been allocated

      // Allocate topic sequentially
      chosenQueue.shift(); // Remove from queue
      chosenTopic.assignedDate = day.date;
      chosenTopic.assignedWeek = day.weekIndex;
      chosenTopic.assignedDayName = day.dayName;

      day.topics.push(chosenTopic);
      day.allocatedHours = Number((day.allocatedHours + chosenTopic.effectiveHours).toFixed(2));
      capacityLeft = Number((capacityLeft - chosenTopic.effectiveHours).toFixed(2));
    }
  });

  // Handle any remaining unallocated topics if calendar was completely filled
  const unallocated = [...analisiQueue, ...geometriaQueue];
  if (unallocated.length > 0 && activeAndFutureDays.length > 0) {
    unallocated.forEach((topic, idx) => {
      const targetDay = activeAndFutureDays[activeAndFutureDays.length - 1 - (idx % Math.min(7, activeAndFutureDays.length))];
      topic.assignedDate = targetDay.date;
      topic.assignedWeek = targetDay.weekIndex;
      topic.assignedDayName = targetDay.dayName;
      targetDay.topics.push(topic);
      targetDay.allocatedHours = Number((targetDay.allocatedHours + topic.effectiveHours).toFixed(2));
    });
  }

  // 4b. Spaced Repetition Cyclical Reviews Calculation (+3d, +7d, +21d)
  const allSpacedReviews = [];
  processedTopics.forEach(t => {
    const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
    if (isDone && t.completedDate) {
      const srState = t.spacedReviews || {};
      const intervals = [
        { level: 1, label: "R1 (+3gg)", days: 3, key: "r1" },
        { level: 2, label: "R2 (+7gg)", days: 7, key: "r2" },
        { level: 3, label: "R3 (+21gg)", days: 21, key: "r3" }
      ];
      intervals.forEach(inv => {
        const targetDate = addDaysToDateStr(t.completedDate, inv.days);
        const isCompletedReview = Boolean(srState[inv.key]);
        const isOverdue = !isCompletedReview && targetDate < settings.currentSimulatedDate;
        const isDueToday = !isCompletedReview && targetDate === settings.currentSimulatedDate;
        allSpacedReviews.push({
          topicId: t.id,
          materia: t.materia,
          capitolo: t.capitolo || "",
          argomento: t.argomento,
          level: inv.level,
          levelKey: inv.key,
          levelLabel: inv.label,
          targetDate,
          isDone: isCompletedReview,
          isOverdue,
          isDueToday
        });
      });
    }
  });

  // Attach spacedReviews to calendar days
  allCalendarDays.forEach(day => {
    if (day.isToday) {
      day.spacedReviews = allSpacedReviews.filter(r => r.targetDate === day.date || (r.isOverdue && !r.isDone));
    } else {
      day.spacedReviews = allSpacedReviews.filter(r => r.targetDate === day.date);
    }
  });

  // 5. Group into Weekly Plans (including past, current, and future weeks)
  const weeksMap = new Map();
  allCalendarDays.forEach(day => {
    if (!weeksMap.has(day.weekIndex)) {
      weeksMap.set(day.weekIndex, {
        weekNumber: day.weekIndex,
        startDate: day.date,
        endDate: day.date,
        days: [],
        totalAllocatedHours: 0,
        totalTopicsCount: 0,
        topics: [],
        hasToday: false,
        isPastWeek: false,
        isCurrentWeek: false,
        isOverloaded: false
      });
    }

    const week = weeksMap.get(day.weekIndex);
    week.endDate = day.date;
    week.days.push(day);
    week.totalAllocatedHours = Number((week.totalAllocatedHours + day.allocatedHours).toFixed(1));
    week.topics.push(...day.topics);
    week.totalTopicsCount = week.topics.length;
    if (day.isToday) {
      week.hasToday = true;
      week.isCurrentWeek = true;
    }
    week.isOverloaded = week.totalAllocatedHours > settings.criticalWeeklyHoursThreshold;
  });

  const weeklyPlans = Array.from(weeksMap.values()).map(w => {
    const allDaysPast = w.days.every(d => d.isPast);
    return {
      ...w,
      isPastWeek: allDaysPast && !w.hasToday
    };
  });

  // Identify current week: the week containing Today (or week 1 as fallback)
  const currentWeekPlan = weeklyPlans.find(w => w.hasToday) || weeklyPlans[0] || null;

  // 6. Detailed History Timeline
  const historyDays = allCalendarDays
    .filter(d => d.isPast || d.isToday)
    .sort((a, b) => b.date.localeCompare(a.date)); // Most recent first

  return {
    metrics: {
      remainingDays,
      remainingWeeks,
      totalRemainingBaseHours,
      totalRemainingEffectiveHours,
      totalBufferHours,
      requiredWeeklyHours,
      criticalWeeklyHoursThreshold: dynamicCriticalThreshold,
      nominalWeeklyCapacity,
      standardWeekdayHours,
      standardWeekendHours,
      effectiveWeekdayHours: standardWeekdayHours,
      effectiveWeekendHours: standardWeekendHours,
      hasCustomOverrides: Object.keys(dayCapacities).length > 0,
      customOverridesCount: Object.keys(dayCapacities).length,
      customDayCapacities: dayCapacities,
      eveningStudyHours: standardWeekdayHours,
      isCriticalOverload,
      excessHours: Number(Math.max(0, requiredWeeklyHours - dynamicCriticalThreshold).toFixed(1)),
      uncompletedCount: uncompletedToSchedule.length,
      totalEffectiveHours: Number(topics.reduce((acc, t) => acc + (Number(t.oreEffettive || (t.isCompleted || t.completato ? t.oreStimate : 0))), 0).toFixed(1)),
      targetExamDate: settings.targetExamDate,
      currentSimulatedDate: settings.currentSimulatedDate,
      roadmapStartDate: settings.roadmapStartDate,
      // Historical stats
      pastDaysStudied,
      pastDaysSkipped,
      totalPastHours: Number(totalPastHours.toFixed(1)),
      historyCount: historyDays.length,
      // Spaced Repetition stats
      spacedRepetition: {
        dueToday: allSpacedReviews.filter(r => r.isDueToday).length,
        overdue: allSpacedReviews.filter(r => r.isOverdue).length,
        completed: allSpacedReviews.filter(r => r.isDone).length,
        totalPlanned: allSpacedReviews.length,
        activeReviews: allSpacedReviews.filter(r => !r.isDone && (r.isDueToday || r.isOverdue))
      }
    },
    weeklyPlans,
    currentWeekPlan,
    calendarDays: allCalendarDays,
    historyDays,
    studySessions: sessions,
    progress: calculateSubjectProgress(topics)
  };
}


// --- src/services/parserService.js ---
/**
 * Parser Service for Study Plan Rebalancer
 * Handles CSV parsing (Analisi / Geometria) and Excel / ODS parsing (.xlsx, .ods, .xls)
 * Merges data and detects completed IDs / Argomenti based on Excel sheets.
 */

/**
 * Robust CSV string parser (handles quotes, commas, semicolons, tabs)
 */
function parseCSVString(csvContent, filename = "") {
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
function parseExcelData(arrayBuffer, filename = "") {
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
function mergeTopicsWithExcelData(topics, excelParsedData) {
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


// --- src/services/gitlabSyncService.js ---
/**
 * GitLab Cloud Synchronization Service for StudiPlanner
 * Provides frictionless, zero-server cloud sync via GitLab REST API v4.
 * Enables real-time synchronization of study sessions, topics, and settings
 * across multiple devices (Desktop, Laptop, Smartphone, Tablet).
 */

const LOCAL_STORAGE_KEY_GITLAB_CONFIG = "unimore_rebalancer_gitlab_config_v1";

const DEFAULT_GITLAB_CONFIG = {
  enabled: false,
  autoSync: true, // Auto-pull on app start & auto-push on state changes
  instanceUrl: "https://gitlab.com",
  projectId: "", // e.g. "username/studiplanner" or numeric project ID
  branch: "main",
  filePath: "data/studiplanner-state.json",
  token: "", // Personal access token (stored only locally in browser)
  lastSynced: null,
  lastCommitId: null,
  syncStatus: "idle", // "idle" | "syncing" | "success" | "error"
  errorMessage: null
};

/**
 * Normalizes GitLab instance URL
 */
function cleanInstanceUrl(url) {
  if (!url) return "https://gitlab.com";
  let cleaned = url.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = "https://" + cleaned;
  }
  return cleaned;
}

/**
 * Normalizes Project Identifier (path with slash or numerical ID)
 */
function encodeProjectId(projectId) {
  if (!projectId) return "";
  const trimmed = String(projectId).trim();
  // If it's a numeric ID, use as is; otherwise URL-encode the namespace/project path
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  return encodeURIComponent(trimmed);
}

/**
 * Decodes UTF-8 base64 encoded text from GitLab API
 */
function decodeBase64Utf8(base64Str) {
  try {
    const binStr = atob(base64Str.replace(/\s/g, ""));
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch (e) {
    // Fallback
    return decodeURIComponent(escape(atob(base64Str)));
  }
}

/**
 * Tests connection to GitLab and verifies project access
 */
async function testGitLabConnection(config) {
  const instanceUrl = cleanInstanceUrl(config.instanceUrl);
  const projectId = encodeProjectId(config.projectId);
  const token = (config.token || "").trim();

  if (!projectId) {
    throw new Error("Specificare il Project ID o il percorso del repository (es. username/studiplanner).");
  }
  if (!token) {
    throw new Error("Specificare un Personal Access Token di GitLab.");
  }

  const endpoint = `${instanceUrl}/api/v4/projects/${projectId}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "PRIVATE-TOKEN": token,
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Token non valido o scaduto (401 Unauthorized). Verifica i permessi del tuo Personal Access Token.");
    }
    if (response.status === 404) {
      throw new Error("Repository non trovato (404 Not Found). Verifica che il Project ID/Path sia corretto e accessibile al token.");
    }
    throw new Error(`Errore connessione GitLab (${response.status}): ${response.statusText}`);
  }

  const projectData = await response.json();
  return {
    success: true,
    projectName: projectData.name_with_namespace || projectData.name,
    defaultBranch: projectData.default_branch || "main",
    webUrl: projectData.web_url
  };
}

/**
 * Pulls latest state from GitLab repository
 */
async function pullFromGitLab(config) {
  const instanceUrl = cleanInstanceUrl(config.instanceUrl);
  const projectId = encodeProjectId(config.projectId);
  const token = (config.token || "").trim();
  const branch = (config.branch || "main").trim();
  const filePath = encodeURIComponent((config.filePath || "data/studiplanner-state.json").trim());

  if (!projectId || !token) {
    throw new Error("Configurazione GitLab incompleta per il pull.");
  }

  const endpoint = `${instanceUrl}/api/v4/projects/${projectId}/repository/files/${filePath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "PRIVATE-TOKEN": token,
      "Accept": "application/json"
    }
  });

  if (response.status === 404) {
    // File not yet created on remote repository
    return {
      success: true,
      notFound: true,
      data: null,
      message: "Il file di stato non esiste ancora nel repository remoto: verrà creato al primo push."
    };
  }

  if (!response.ok) {
    throw new Error(`Errore durante il download da GitLab (${response.status}): ${response.statusText}`);
  }

  const fileData = await response.json();
  const jsonContent = decodeBase64Utf8(fileData.content);
  const parsedData = JSON.parse(jsonContent);

  return {
    success: true,
    notFound: false,
    data: parsedData,
    commitId: fileData.commit_id,
    lastCommitId: fileData.last_commit_id,
    fileName: fileData.file_name
  };
}

/**
 * Pushes updated state to GitLab repository (creates file if not present, updates if present)
 */
async function pushToGitLab(config, payload, commitMessage = "") {
  const instanceUrl = cleanInstanceUrl(config.instanceUrl);
  const projectId = encodeProjectId(config.projectId);
  const token = (config.token || "").trim();
  const branch = (config.branch || "main").trim();
  const rawFilePath = (config.filePath || "data/studiplanner-state.json").trim();
  const filePath = encodeURIComponent(rawFilePath);

  if (!projectId || !token) {
    throw new Error("Configurazione GitLab incompleta per il push.");
  }

  const checkEndpoint = `${instanceUrl}/api/v4/projects/${projectId}/repository/files/${filePath}?ref=${encodeURIComponent(branch)}`;
  let fileExists = false;

  try {
    const checkRes = await fetch(checkEndpoint, {
      method: "HEAD",
      headers: { "PRIVATE-TOKEN": token }
    });
    fileExists = checkRes.status === 200;
  } catch (e) {
    fileExists = false;
  }

  const method = fileExists ? "PUT" : "POST";
  const endpoint = `${instanceUrl}/api/v4/projects/${projectId}/repository/files/${filePath}`;

  const defaultMsg = commitMessage || `Update StudiPlanner: ${new Date().toLocaleDateString('it-IT')} ${new Date().toLocaleTimeString('it-IT')}`;

  const requestBody = {
    branch: branch,
    commit_message: defaultMsg,
    content: JSON.stringify(payload, null, 2),
    encoding: "text"
  };

  const response = await fetch(endpoint, {
    method: method,
    headers: {
      "PRIVATE-TOKEN": token,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Errore durante il push su GitLab (${response.status}): ${errorBody || response.statusText}`);
  }

  const resultData = await response.json().catch(() => ({}));

  return {
    success: true,
    created: !fileExists,
    commitId: resultData.commit_id || null,
    filePath: rawFilePath,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}


// --- src/components/AlertBanner.js ---



function AlertBanner({ metrics, onOpenSettings }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!metrics || !metrics.isCriticalOverload) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-950/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <IconClock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-emerald-300">Carico Settimanale Sostenibile</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {metrics.requiredWeeklyHours}h / sett. (Soglia Max {metrics.criticalWeeklyHoursThreshold}h)
              </span>
              {metrics.hasCustomOverrides && (
                <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  +Slot Extra Flessibili Attivi ({metrics.customOverridesCount} gg)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Il ritmo di studio è ben calibrato: {metrics.hasCustomOverrides ? "la flessibilità degli slot extra nei singoli giorni garantisce sostenibilità elevata senza sovraccarico" : "le serate e i weekend coprono interamente il programma"} entro il 10 Gennaio 2027.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="text-xs text-slate-400 hover:text-emerald-300 underline transition-colors px-2 py-1"
        >
          Modifica Soglia
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/80 via-red-950/70 to-amber-950/60 border-2 border-rose-500/50 rounded-2xl p-4 md:p-5 shadow-2xl shadow-rose-950/40 backdrop-blur-md animate-pulse-subtle">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/30 flex-shrink-0 animate-bounce-subtle">
            <IconAlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-rose-200 tracking-wide flex items-center gap-1.5">
                <IconFlame className="w-4 h-4 text-rose-400" />
                ALLERTA SOVRACCARICO CRITICO
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 font-mono font-bold border border-rose-500/40">
                {metrics.requiredWeeklyHours} ORE / SETT.
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-rose-300 border border-rose-500/20">
                Soglia Massima: {metrics.criticalWeeklyHoursThreshold}h/sett. (+{metrics.excessHours}h in eccesso)
              </span>
            </div>

            <p className="text-xs md:text-sm text-rose-200/90 mt-1 leading-relaxed">
              <strong>Attenzione per lavoratore full-time:</strong> Il monte ore di studio netto necessario per completare Analisi 1 e Geometria entro il <strong>10 Gennaio 2027</strong> supera la soglia critica di sicurezza ({metrics.criticalWeeklyHoursThreshold}h/settimana). Rischio elevato di affaticamento cognitivo o ritardo.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 px-3 py-1.5 rounded-xl border border-rose-700/50 transition-colors font-medium"
          >
            {isExpanded ? "Nascondi Consigli" : "Strategia di Recupero"}
          </button>
          <button
            onClick={onOpenSettings}
            className="text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold px-3 py-1.5 rounded-xl transition shadow-md shadow-rose-950/50"
          >
            Ribilancia Orari
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-rose-500/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-rose-100">
          <div className="bg-black/30 p-3 rounded-xl border border-rose-500/20">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
              <IconBriefcase className="w-4 h-4 text-rose-400" />
              1. Gestione Flessibile Slot Extra
            </div>
            <p className="text-rose-200/80">
              Usa i pulsanti [+ 30m] nel To-Do Settimanale per aggiungere ore nei giorni con permessi, pause o anticipi feriali, distribuendo il carico.
            </p>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-rose-500/20">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
              <IconClock className="w-4 h-4 text-amber-400" />
              2. Weekend Intensivi
            </div>
            <p className="text-rose-200/80">
              Aumenta le ore nei blocchi di Sabato e Domenica da 4.5h a 6h per accumulare ore diurne di qualità ed evitare affaticamento.
            </p>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-rose-500/20">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
              <IconFlame className="w-4 h-4 text-emerald-400" />
              3. Priorità a Scaletta
            </div>
            <p className="text-rose-200/80">
              Il sistema ha già ordinato gli argomenti: focalizzati al 100% su quelli con Priorità 5 (Taylor, Integrali, Rouché-Capelli, Coniche).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


// --- src/components/NeuraDeckPromptGenerator.js ---



/**
 * NeuraDeckPromptGenerator.js
 * Genera dinamicamente prompt ottimizzati per Google NotebookLM
 * mirati all'estrazione di flashcard CSV ("Fronte,Retro") per NeuraDeck
 * basandosi sugli argomenti completati nell'ultima settimana.
 */
function NeuraDeckPromptGenerator({ isOpen, onClose, topics = [], settings = {} }) {
  const [selectedSubject, setSelectedSubject] = useState("all"); // "all" | "analisi" | "geometria"
  const [dateRange, setDateRange] = useState("week"); // "week" (ultimi 7gg) | "twoweeks" | "all_completed"
  const [selectedTopicIds, setSelectedTopicIds] = useState(new Set());
  const [copied, setCopied] = useState(false);

  const refDateStr = settings.currentSimulatedDate || new Date().toISOString().split("T")[0];

  // Calcolo finestra temporale (ultimi 7 giorni rispetto alla data simulata/corrente)
  const { sevenDaysAgoStr, fourteenDaysAgoStr } = useMemo(() => {
    const ref = new Date(refDateStr + "T00:00:00");
    const d7 = new Date(ref);
    d7.setDate(d7.getDate() - 7);
    const d14 = new Date(ref);
    d14.setDate(d14.getDate() - 14);
    return {
      sevenDaysAgoStr: d7.toISOString().split("T")[0],
      fourteenDaysAgoStr: d14.toISOString().split("T")[0]
    };
  }, [refDateStr]);

  // Filtra gli argomenti completati in base a materia e finestra temporale
  const filteredCompletedTopics = useMemo(() => {
    return (topics || []).filter(t => {
      if (!t.isCompleted) return false;

      // Filtro Materia
      if (selectedSubject !== "all") {
        const isAnalisi = t.materia.toLowerCase().includes("analisi");
        if (selectedSubject === "analisi" && !isAnalisi) return false;
        if (selectedSubject === "geometria" && isAnalisi) return false;
      }

      // Filtro Data Completamento
      if (dateRange === "week") {
        if (t.completedDate) {
          return t.completedDate >= sevenDaysAgoStr && t.completedDate <= refDateStr;
        }
        // Se non ha data specifica ma è completato, consideralo recente
        return true;
      } else if (dateRange === "twoweeks") {
        if (t.completedDate) {
          return t.completedDate >= fourteenDaysAgoStr && t.completedDate <= refDateStr;
        }
        return true;
      }
      return true; // "all_completed"
    });
  }, [topics, selectedSubject, dateRange, sevenDaysAgoStr, fourteenDaysAgoStr, refDateStr]);

  // Inizializza/Aggiorna la selezione attiva quando cambia la lista filtrata
  useEffect(() => {
    setSelectedTopicIds(new Set(filteredCompletedTopics.map(t => t.id)));
  }, [filteredCompletedTopics]);

  // Toggle selezione singolo argomento
  const handleToggleTopic = (id) => {
    setSelectedTopicIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedTopicIds(new Set(filteredCompletedTopics.map(t => t.id)));
  };

  const handleDeselectAll = () => {
    setSelectedTopicIds(new Set());
  };

  // Costruzione della lista formattata degli argomenti inclusi
  const activeSelectedTopics = useMemo(() => {
    return filteredCompletedTopics.filter(t => selectedTopicIds.has(t.id));
  }, [filteredCompletedTopics, selectedTopicIds]);

  // Generazione del prompt completo
  const generatedPrompt = useMemo(() => {
    if (activeSelectedTopics.length === 0) {
      return "";
    }

    const topicsFormattedList = activeSelectedTopics
      .map(t => {
        const fontiStr = t.fonti ? ` (Fonti didattiche: ${t.fonti})` : "";
        const noteStr = t.note ? ` [Note chiave: ${t.note}]` : "";
        return `• [${t.id}] ${t.materia} - ${t.capitolo ? t.capitolo + ": " : ""}${t.argomento}${fontiStr}${noteStr}`;
      })
      .join("\n");

    return `Agisci da professore universitario di Ingegneria. Basandoti esclusivamente sulle fonti di questo notebook, generami delle flashcard di ripasso sui seguenti argomenti:\n${topicsFormattedList}\n\nRestituisci l'output ESCLUSIVAMENTE in un blocco di codice CSV raw nel formato 'Fronte,Retro', ottimizzato per l'importazione massiva su NeuraDeck.`;
  }, [activeSelectedTopics]);

  // Copia negli appunti
  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = generatedPrompt;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copia fallita:", err);
    }
  };

  // Chiusura con tasto ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0b1120] border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/40 overflow-hidden my-auto">
        {/* Header Modal */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
              <IconSparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Generatore Flashcard NeuraDeck
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  NotebookLM AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Estrae automaticamente gli argomenti completati nell'ultima settimana e formatta il prompt CSV ("Fronte,Retro").
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
            title="Chiudi"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm custom-scrollbar">
          {/* Controls Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl">
            {/* Materia Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Materia di Studio:
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSubject("all")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSubject === "all"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Tutte
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject("analisi")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSubject === "analisi"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Analisi 1
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject("geometria")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedSubject === "geometria"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Geometria
                </button>
              </div>
            </div>

            {/* Time Window Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Finestra Temporale di Completamento:
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setDateRange("week")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    dateRange === "week"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Ultimi 7 giorni fino ad oggi"
                >
                  Ultima Settimana
                </button>
                <button
                  type="button"
                  onClick={() => setDateRange("twoweeks")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    dateRange === "twoweeks"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Ultimi 14 gg
                </button>
                <button
                  type="button"
                  onClick={() => setDateRange("all_completed")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                    dateRange === "all_completed"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Tutti i Completati
                </button>
              </div>
            </div>
          </div>

          {/* Topics Selection Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Argomenti Rilevati ({activeSelectedTopics.length} di {filteredCompletedTopics.length} inclusi)
                </span>
                {dateRange === "week" && (
                  <span className="text-[11px] text-cyan-400 font-mono">
                    (da {sevenDaysAgoStr.slice(5)} a {refDateStr.slice(5)})
                  </span>
                )}
              </div>

              {filteredCompletedTopics.length > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Seleziona tutti
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-slate-400 hover:text-slate-300 font-semibold"
                  >
                    Deseleziona tutti
                  </button>
                </div>
              )}
            </div>

            {filteredCompletedTopics.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 w-10 h-10 rounded-xl mx-auto flex items-center justify-center">
                  <IconAlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Nessun argomento completato nel periodo</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Non risultano argomenti contrassegnati come completati nell'intervallo temporale selezionato.
                  Spunta gli argomenti svolti dal <strong className="text-slate-300">To-Do Settimanale</strong> o passa al filtro <button onClick={() => setDateRange("all_completed")} className="text-cyan-400 underline font-semibold">Tutti i Completati</button>.
                </p>
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredCompletedTopics.map(t => {
                  const isSelected = selectedTopicIds.has(t.id);
                  const isAnalisi = t.materia.toLowerCase().includes("analisi");
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTopic(t.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                        isSelected
                          ? "bg-slate-900 border-cyan-500/40 text-white"
                          : "bg-slate-950/60 border-slate-800/70 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900 bg-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                            isAnalisi
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}>
                            {t.id}
                          </span>
                          <span className="text-xs font-bold text-slate-200 truncate">
                            {t.capitolo ? `${t.capitolo}: ` : ""}{t.argomento}
                          </span>
                          {t.completedDate && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              Completato: {t.completedDate}
                            </span>
                          )}
                        </div>
                        {t.fonti && (
                          <p className="text-[11px] text-slate-400 mt-1 truncate">
                            📚 Fonti: {t.fonti}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Generated Prompt Preview */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <IconBookOpen className="w-4 h-4 text-cyan-400" />
                <span>Prompt Pronto per Google NotebookLM</span>
              </label>

              {generatedPrompt && (
                <span className="text-xs text-slate-400 font-mono">
                  {generatedPrompt.length} caratteri • {activeSelectedTopics.length} argomenti
                </span>
              )}
            </div>

            <div className="relative group">
              <textarea
                readOnly
                rows={6}
                value={
                  generatedPrompt ||
                  "Seleziona almeno un argomento completato per generare il prompt strutturato per NotebookLM..."
                }
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-cyan-200/90 leading-relaxed focus:outline-none resize-none selection:bg-cyan-500/30 selection:text-white"
              />

              {generatedPrompt && (
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition ${
                    copied
                      ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30 font-black"
                      : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20"
                  }`}
                >
                  {copied ? (
                    <>
                      <IconCheck className="w-4 h-4" />
                      <span>Copiato! ✓</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-4 h-4" />
                      <span>Copia Prompt</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Quick Guide Card for NeuraDeck & NotebookLM */}
          <div className="bg-gradient-to-r from-cyan-950/40 to-indigo-950/30 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
              <span>💡 Come importare le Flashcard su NeuraDeck in 3 passaggi:</span>
            </h5>
            <ol className="text-xs text-slate-300 list-decimal list-inside space-y-1 leading-normal pl-1">
              <li>
                Incolla il prompt nella chat del tuo <strong>NotebookLM</strong> (contenente i PDF del syllabus UNIMORE).
              </li>
              <li>
                NotebookLM genererà un blocco CSV con le colonne <code>Fronte,Retro</code> basato fedelmente sulle fonti ufficiali.
              </li>
              <li>
                Copia il blocco di codice CSV, aprilo o salvalo come file <code>.csv</code> e importalo massivamente in <strong>NeuraDeck</strong> per la ripetizione spaziata.
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
          >
            Chiudi
          </button>

          <button
            type="button"
            disabled={!generatedPrompt}
            onClick={handleCopyPrompt}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              !generatedPrompt
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : copied
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25"
            }`}
          >
            {copied ? (
              <>
                <IconCheck className="w-4 h-4" />
                <span>Prompt Copiato negli Appunti!</span>
              </>
            ) : (
              <>
                <IconCopy className="w-4 h-4" />
                <span>Copia Prompt per NotebookLM</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- src/components/ExamSimulator.js ---



/**
 * ExamSimulator.js
 * Simulatore d'Esame Dinamico per UNIMORE Ingegneria Informatica.
 * Estrae casualmente:
 * - 6 argomenti con Priorità >= 3 per Analisi Matematica 1 (simulazione prova scritta 5-6 esercizi)
 * - 11 argomenti con Priorità >= 3 per Geometria e Algebra Lineare (simulazione test scritto 11 quesiti)
 * Genera il prompt per Claude/ChatGPT formattato in Markdown pronto per la stampa.
 */
function ExamSimulator({ isOpen, onClose, topics = [], settings = {} }) {
  const [selectedSubject, setSelectedSubject] = useState("Analisi 1"); // "Analisi 1" | "Geometria"
  const [includeUncompletedFallback, setIncludeUncompletedFallback] = useState(false);
  const [extractedTopics, setExtractedTopics] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const targetCount = selectedSubject === "Analisi 1" ? 6 : 11;
  const isAnalisi = selectedSubject === "Analisi 1";

  // Filtra il pool degli argomenti candidati
  const { eligibleCompleted, eligibleAll } = useMemo(() => {
    const isSubjectMatch = (t) => {
      const mat = (t.materia || "").toLowerCase();
      return isAnalisi ? mat.includes("analisi") : mat.includes("geometria");
    };

    const allSubjectHighPriority = (topics || []).filter(
      t => isSubjectMatch(t) && Number(t.prioritaEsame || 0) >= 3
    );

    const completedHighPriority = allSubjectHighPriority.filter(t => t.isCompleted);

    return {
      eligibleCompleted: completedHighPriority,
      eligibleAll: allSubjectHighPriority
    };
  }, [topics, isAnalisi]);

  // Funzione di estrazione casuale
  const executeRandomExtraction = useCallback(() => {
    setIsSpinning(true);

    let pool = [...eligibleCompleted];

    // Se gli argomenti completati non bastano e il fallback è attivo, attingi anche dai non completati
    if (pool.length < targetCount && (includeUncompletedFallback || eligibleCompleted.length === 0)) {
      const alreadyIncludedIds = new Set(pool.map(t => t.id));
      const uncompletedRemaining = eligibleAll.filter(t => !alreadyIncludedIds.has(t.id));
      const shuffledUncompleted = [...uncompletedRemaining].sort(() => Math.random() - 0.5);
      const needed = targetCount - pool.length;
      pool = [...pool, ...shuffledUncompleted.slice(0, Math.max(0, needed))];
    }

    // Estrazione casuale dal pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, targetCount);

    // Ordina rigorosamente per ID propedeutico (A-01 -> A-32, G-01 -> G-31) come da vincolo accademico
    selected.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

    setExtractedTopics(selected);

    setTimeout(() => {
      setIsSpinning(false);
    }, 250);
  }, [eligibleCompleted, eligibleAll, targetCount, includeUncompletedFallback]);

  // Esegui estrazione al cambio materia o apertura
  useEffect(() => {
    if (isOpen) {
      executeRandomExtraction();
    }
  }, [isOpen, selectedSubject, executeRandomExtraction]);

  // Generazione del prompt formattato per Claude / ChatGPT
  const generatedPrompt = useMemo(() => {
    if (extractedTopics.length === 0) return "";

    const listStr = extractedTopics
      .map((t, idx) => {
        const itemType = isAnalisi ? `Esercizio ${idx + 1}` : `Quesito ${idx + 1}`;
        const focusStr = t.note ? ` (Focus didattico: ${t.note})` : "";
        const capStr = t.capitolo ? `[${t.capitolo}] ` : "";
        return `${idx + 1}. [${t.id}] ${capStr}${t.argomento}${focusStr}`;
      })
      .join("\n");

    return `Genera una simulazione d'esame scritta di livello universitario (UNIMORE) basata ESCLUSIVAMENTE su questi argomenti:\n${listStr}\n\nFormatta il testo in Markdown pronto per la stampa, includendo lo spazio per lo svolgimento.`;
  }, [extractedTopics, isAnalisi]);

  // Copia negli appunti
  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = generatedPrompt;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copia fallita:", err);
    }
  };

  // Chiusura con tasto ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0b1120] border border-indigo-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-indigo-950/40 overflow-hidden my-auto">
        {/* Header Modal */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <IconDice className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Simulatore d'Esame Dinamico
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  UNIMORE Coorte 2021
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Estrae casualmente quesiti d'esame (Priorità ≥ 3) per generare la traccia d'esame per Claude / ChatGPT.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
            title="Chiudi"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm custom-scrollbar">
          {/* Subject Switcher & Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-900/70 border border-slate-800/80 p-4 rounded-2xl">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Seleziona Insegnamento d'Esame:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSubject("Analisi 1")}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
                    selectedSubject === "Analisi 1"
                      ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Analisi 1</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 rounded-full font-mono">
                    6 Esercizi
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSubject("Geometria")}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
                    selectedSubject === "Geometria"
                      ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Geometria</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 rounded-full font-mono">
                    11 Quiz
                  </span>
                </button>
              </div>
            </div>

            {/* Reshuffle Button & Status */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={executeRandomExtraction}
                disabled={isSpinning}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition active:scale-95"
              >
                <IconDice className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
                <span>Estrai Nuova Simulazione</span>
              </button>
            </div>
          </div>

          {/* Completion Status / Fallback Notice */}
          {eligibleCompleted.length < targetCount && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <IconAlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">
                    Argomenti completati (Priorità ≥ 3): {eligibleCompleted.length} su {targetCount} richiesti
                  </span>
                  <p className="text-slate-400 mt-0.5">
                    {eligibleCompleted.length === 0
                      ? "Non hai ancora contrassegnato argomenti con Priorità ≥ 3 come completati."
                      : `Per una simulazione ufficiale completa servono ${targetCount} argomenti.`}
                  </p>
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/60 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={includeUncompletedFallback}
                  onChange={(e) => {
                    setIncludeUncompletedFallback(e.target.checked);
                    executeRandomExtraction();
                  }}
                  className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-400 bg-slate-800"
                />
                <span className="text-slate-200 font-semibold text-xs">
                  Completa a {targetCount} dall'intero programma
                </span>
              </label>
            </div>
          )}

          {/* Extracted Topics List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <span>Traccia Estratta: {extractedTopics.length} Quesiti Selezionati</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Ordinati sequenzialmente per propedeuticità didattica)
                </span>
              </span>
            </div>

            {extractedTopics.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Nessun argomento estraibile al momento. Attiva l'opzione per includere argomenti dell'intero programma.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {extractedTopics.map((t, idx) => {
                  return (
                    <div
                      key={t.id}
                      className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 p-3 rounded-2xl flex items-start space-x-3 transition group"
                    >
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                            isAnalisi
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}>
                            {t.id}
                          </span>
                          <span className="text-xs font-bold text-white truncate">
                            {t.capitolo ? `${t.capitolo}` : t.argomento}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {t.argomento}
                        </p>

                        <div className="flex items-center space-x-3 mt-2 text-[10px] font-mono">
                          <span className="text-amber-400 flex items-center gap-0.5">
                            ★ Priorità: {t.prioritaEsame}/5
                          </span>
                          <span className="text-slate-400">
                            Diff: {t.difficolta}/5
                          </span>
                          {t.isCompleted ? (
                            <span className="text-emerald-400 font-semibold">✓ Completato</span>
                          ) : (
                            <span className="text-slate-500">In programma</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Generated Prompt Preview */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <IconBookOpen className="w-4 h-4 text-indigo-400" />
                <span>Prompt Copiabile per Claude / ChatGPT</span>
              </label>

              {generatedPrompt && (
                <span className="text-xs text-slate-400 font-mono">
                  {extractedTopics.length} quesiti configurati
                </span>
              )}
            </div>

            <div className="relative group">
              <textarea
                readOnly
                rows={6}
                value={generatedPrompt}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-indigo-200/90 leading-relaxed focus:outline-none resize-none selection:bg-indigo-500/30 selection:text-white"
              />

              {generatedPrompt && (
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition ${
                    copied
                      ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30 font-black"
                      : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20"
                  }`}
                >
                  {copied ? (
                    <>
                      <IconCheck className="w-4 h-4" />
                      <span>Copiato! ✓</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-4 h-4" />
                      <span>Copia Prompt</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* UNIMORE Exam Format Guide */}
          <div className="bg-gradient-to-r from-indigo-950/40 to-purple-950/30 border border-indigo-500/20 rounded-2xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
              <span>📋 Specifiche Appello d'Esame UNIMORE (Ingegneria Informatica):</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-emerald-400">Analisi Matematica 1:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  5-6 Esercizi a svolgimento completo (Limiti, Taylor, Studio di Funzione, Integrali, Serie numeriche, Equazioni differenziali). Tempo: 2 ore.
                </p>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-indigo-400">Geometria e Algebra Lineare:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  11 Quesiti a risposta multipla o breve (Sistemi lineari, Rouché-Capelli, Autovalori/Autovettori, Diagonalizzazione, Coniche/Quadriche). Tempo: 90 minuti.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
          >
            Chiudi
          </button>

          <button
            type="button"
            disabled={!generatedPrompt}
            onClick={handleCopyPrompt}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
              !generatedPrompt
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : copied
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25"
            }`}
          >
            {copied ? (
              <>
                <IconCheck className="w-4 h-4" />
                <span>Prompt Copiato negli Appunti!</span>
              </>
            ) : (
              <>
                <IconCopy className="w-4 h-4" />
                <span>Copia Prompt per Claude / ChatGPT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- src/components/Clarke9000Companion.js ---


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

function Clarke9000Companion({ progress, metrics }) {
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


// --- src/components/Dashboard.js ---





function Dashboard({
  progress,
  metrics,
  onTabChange,
  topics = [],
  settings = {},
  onOpenLogModal,
  onOpenTopicDetail,
  onToggleSpacedReview
}) {
  const { analisi, geometria, global } = progress;
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isExamSimulatorOpen, setIsExamSimulatorOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Quick Action Banner for Logging Study */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40 border border-emerald-500/30 rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/20">
            +
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <span>Registra Sessione di Studio</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Adattamento Dinamico
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Hai svolto ore di studio oggi o in una data passata? Clicca qui per indicare data, ore e argomento: il resto si adatterà in tempo reale!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenLogModal && onOpenLogModal({ date: settings.currentSimulatedDate })}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition transform active:scale-95 flex-shrink-0"
        >
          <span className="text-base font-black leading-none">+</span>
          <span>Registra Ore di Studio</span>
        </button>
      </div>

      {/* Spaced Repetition Active Alert Banner if any due */}
      {metrics?.spacedRepetition?.activeReviews?.length > 0 && (
        <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900/80 border border-purple-500/40 rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-black text-xl shadow-md shadow-purple-500/20 flex-shrink-0">
              🧠
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <span>Ripassi Spaced Repetition in Scadenza ({metrics.spacedRepetition.activeReviews.length})</span>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono">
                  Curva di Ebbinghaus
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Hai {metrics.spacedRepetition.dueToday} ripassi previsti per oggi e {metrics.spacedRepetition.overdue} arretrati. Dedica 15 minuti a ripassare teoremi e formule prima di procedere!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTabChange && onTabChange("weekly")}
            className="w-full md:w-auto px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Vai al To-Do per Ripassare</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 2xl:gap-6">
        {/* Days Left */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Target Esame</span>
            <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400">
              <IconCalendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {metrics.remainingDays}
            </span>
            <span className="text-xs text-slate-400 font-medium">giorni</span>
          </div>
          <div className="mt-1 text-xs text-cyan-400 flex items-center gap-1 font-medium">
            <span>10 Gennaio 2027</span>
            <span className="text-slate-500">({metrics.remainingWeeks} sett.)</span>
          </div>
        </div>

        {/* Weekly Pace */}
        <div className={`p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group transition border ${
          metrics.isCriticalOverload
            ? "bg-rose-950/40 border-rose-500/40 hover:border-rose-500/60"
            : "bg-slate-900/80 border-slate-800/80 hover:border-slate-700"
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Fabbisogno Sett.</span>
            <div className={`p-1.5 rounded-lg ${
              metrics.isCriticalOverload ? "bg-rose-500/20 text-rose-400" : "bg-indigo-500/10 text-indigo-400"
            }`}>
              <IconClock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className={`text-2xl md:text-3xl font-extrabold font-mono ${
              metrics.isCriticalOverload ? "text-rose-300" : "text-white"
            }`}>
              {metrics.requiredWeeklyHours}
            </span>
            <span className="text-xs text-slate-400 font-medium">h / sett.</span>
          </div>
          <div className="mt-1 text-xs flex items-center gap-1 font-medium">
            {metrics.isCriticalOverload ? (
              <span className="text-rose-400 flex items-center gap-1">
                <IconFlame className="w-3.5 h-3.5" /> Soglia max superata
              </span>
            ) : (
              <span className="text-emerald-400">Ritmo sostenibile</span>
            )}
          </div>
        </div>

        {/* Remaining Hours */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Ore Residue</span>
            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400">
              <IconBarChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {metrics.totalRemainingEffectiveHours}
            </span>
            <span className="text-xs text-slate-400 font-medium">h effettive</span>
          </div>
          <div className="mt-1 text-xs text-amber-400/90 font-medium flex items-center gap-1">
            <span>+{metrics.totalBufferHours}h buffer (+20%)</span>
          </div>
        </div>

        {/* Progress Global */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Completamento</span>
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <IconCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">
              {global.percent}%
            </span>
            <span className="text-xs text-slate-400 font-medium">complessivo</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-medium">
            <span>{global.completedHours}h di {global.totalHours}h svolte</span>
          </div>
        </div>
      </div>

      {/* Main Two Progress Bars (Analisi 1 & Geometria) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Analisi 1 Progress Card */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/20 p-5 md:p-6 rounded-3xl shadow-xl shadow-emerald-950/10 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ANALISI MATEMATICA 1
                </span>
                <span className="text-xs text-slate-400">UNIMORE</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Stato Avanzamento Analisi</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {analisi.percent}%
              </span>
            </div>
          </div>

          {/* Progress Bar Analisi */}
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-emerald-500/50"
                style={{ width: `${Math.max(2, analisi.percent)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{analisi.completedHours}h completate</span>
              <span className="text-slate-300 font-semibold">{analisi.totalHours}h previste</span>
            </div>
          </div>

          {/* Detailed stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Argomenti</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {analisi.completedCount} / {analisi.totalCount}
              </div>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Ore Residue</div>
              <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5">
                {analisi.remainingHours}h
              </div>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Esame Scritto</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5">
                5-6 Esercizi
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Focus: Taylor, Integrali, Studio Funzione, Serie
            </span>
            <button
              onClick={() => onTabChange("weekly")}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
            >
              Vedi orari Analisi →
            </button>
          </div>
        </div>

        {/* Geometria Progress Card */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/20 p-5 md:p-6 rounded-3xl shadow-xl shadow-indigo-950/10 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GEOMETRIA E ALGEBRA
                </span>
                <span className="text-xs text-slate-400">UNIMORE</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Stato Avanzamento Geometria</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-indigo-400 font-mono">
                {geometria.percent}%
              </span>
            </div>
          </div>

          {/* Progress Bar Geometria */}
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-indigo-500/50"
                style={{ width: `${Math.max(2, geometria.percent)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{geometria.completedHours}h completate</span>
              <span className="text-slate-300 font-semibold">{geometria.totalHours}h previste</span>
            </div>
          </div>

          {/* Detailed stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Argomenti</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {geometria.completedCount} / {geometria.totalCount}
              </div>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Ore Residue</div>
              <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">
                {geometria.remainingHours}h
              </div>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Test Scritto</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5">
                11 Domande Quiz
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Focus: Rouché-Capelli, Autovalori, Coniche, Spazi Vettoriali
            </span>
            <button
              onClick={() => onTabChange("weekly")}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
            >
              Vedi orari Geometria →
            </button>
          </div>
        </div>
      </div>

      {/* AI Study Tools Row (Phase 2 Refactoring) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tool 1: NeuraDeck Flashcards (NotebookLM) */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/40 border border-cyan-500/30 p-5 md:p-6 rounded-3xl shadow-xl shadow-cyan-950/20 relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/50 transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  NotebookLM • CSV Raw
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Fase 2 AI</span>
              </div>
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:scale-110 transition">
                <IconSparkles className="w-5 h-5" />
              </div>
            </div>

            <h4 className="text-lg font-bold text-white">Generatore Flashcard NeuraDeck</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Filtra in automatico gli argomenti completati nell'ultima settimana e compone il prompt ottimizzato per NotebookLM per estrarre le flashcard nel formato <code>Fronte,Retro</code> pronto all'import.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-cyan-400/80 font-mono">
              Analisi 1 & Geometria
            </span>
            <button
              type="button"
              onClick={() => setIsFlashcardsOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              <IconSparkles className="w-4 h-4 text-slate-950" />
              <span>Genera Flashcard</span>
            </button>
          </div>
        </div>

        {/* Tool 2: Exam Simulator (Claude / ChatGPT) */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/40 border border-indigo-500/30 p-5 md:p-6 rounded-3xl shadow-xl shadow-indigo-950/20 relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500/50 transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  UNIMORE Scritto • Claude/GPT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Priorità ≥ 3</span>
              </div>
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition">
                <IconDice className="w-5 h-5" />
              </div>
            </div>

            <h4 className="text-lg font-bold text-white">Simulatore d'Esame Dinamico</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Estrae casualmente 6 argomenti per Analisi 1 o 11 per Geometria tra quelli completati con Priorità ≥ 3 e compone il prompt d'esame in Markdown per Claude o ChatGPT con spazio di svolgimento.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-indigo-400/80 font-mono">
              6 Esercizi o 11 Quiz
            </span>
            <button
              type="button"
              onClick={() => setIsExamSimulatorOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20 transition active:scale-95"
            >
              <IconDice className="w-4 h-4 text-white" />
              <span>Avvia Simulazione</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Progress Strip */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 w-full md:w-auto">
          <div className="p-3 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl text-white shadow-md">
            <IconBookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Riepilogo Globale del Piano di Studio</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Totale {global.totalCount} argomenti ({global.completedCount} completati, {metrics.uncompletedCount} rimanenti).
            </p>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Avanzamento Totale</span>
            <span className="font-mono text-cyan-400">{global.percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, global.percent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Tool Modals */}
      <NeuraDeckPromptGenerator
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        topics={topics}
        settings={settings}
      />

      <ExamSimulator
        isOpen={isExamSimulatorOpen}
        onClose={() => setIsExamSimulatorOpen(false)}
        topics={topics}
        settings={settings}
      />
    </div>
  );
}


// --- src/components/ActivityHeatmap.js ---



function ActivityHeatmap({ calendarDays = [], historyDays = [], metrics = {}, onSetDate }) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Group days into weeks for the GitHub-like grid
  // Standard UNIMORE roadmap starts Monday 16 Nov 2026
  const { weeksGrid, streakDays, totalCompletedHours, completedDaysCount } = useMemo(() => {
    const days = calendarDays.length > 0 ? calendarDays : historyDays;
    
    // Sort chronologically
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

    // Group by weekIndex
    const map = new Map();
    let compHours = 0;
    let compCount = 0;

    sorted.forEach(day => {
      if (!map.has(day.weekIndex)) {
        map.set(day.weekIndex, []);
      }
      map.get(day.weekIndex).push(day);

      if ((day.isPast || day.isToday) && day.dayStatus === "completed") {
        compHours += Number(day.allocatedHours) || 0;
        compCount += 1;
      }
    });

    const weeks = Array.from(map.entries()).map(([wIndex, wDays]) => {
      // Ensure days are ordered Monday (1) to Sunday (0)
      const daySlots = [null, null, null, null, null, null, null]; // 0=Mon ... 6=Sun
      wDays.forEach(d => {
        // Javascript getDay(): 0 is Sun, 1 is Mon...
        const slotIdx = d.dayOfWeek === 0 ? 6 : d.dayOfWeek - 1;
        daySlots[slotIdx] = d;
      });
      return {
        weekIndex: wIndex,
        startDate: wDays[0]?.date,
        endDate: wDays[wDays.length - 1]?.date,
        daySlots
      };
    });

    // Calculate active study streak
    let currentStreak = 0;
    const pastDaysChronological = sorted.filter(d => d.isPast || d.isToday);
    for (let i = pastDaysChronological.length - 1; i >= 0; i--) {
      const d = pastDaysChronological[i];
      if (d.dayStatus === "completed") {
        currentStreak++;
      } else if (d.dayStatus === "skipped") {
        break;
      }
    }

    return {
      weeksGrid: weeks,
      streakDays: currentStreak,
      totalCompletedHours: metrics.totalEffectiveHours !== undefined ? Number(metrics.totalEffectiveHours) : Number(compHours.toFixed(1)),
      completedDaysCount: compCount
    };
  }, [calendarDays, historyDays]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  // Cell style logic based on completed hours and day status
  const getCellClasses = (day) => {
    if (!day) return "bg-transparent opacity-0 cursor-default";

    const isToday = day.isToday;
    const isCompleted = (day.isPast || day.isToday) && day.dayStatus === "completed";
    const isSkipped = day.isPast && day.dayStatus === "skipped";
    const isFuture = day.isFuture;
    const hours = Number(day.allocatedHours) || 0;

    let base = "w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-all flex items-center justify-center text-[10px] font-mono cursor-pointer relative ";

    if (isToday) {
      return base + "ring-2 ring-cyan-400 bg-cyan-950/80 border border-cyan-400 text-cyan-200 font-bold shadow-lg shadow-cyan-500/20";
    }

    if (isCompleted) {
      if (hours >= 4.0) {
        return base + "bg-emerald-400 text-slate-950 font-bold border border-emerald-300 shadow-sm shadow-emerald-400/40 hover:scale-110";
      } else if (hours >= 2.0) {
        return base + "bg-emerald-600 text-white font-semibold border border-emerald-500/60 shadow-sm shadow-emerald-600/30 hover:scale-110";
      } else {
        return base + "bg-emerald-800/80 text-emerald-200 border border-emerald-700/40 hover:scale-110";
      }
    }

    if (isSkipped) {
      return base + "bg-slate-900 border border-amber-500/50 text-amber-400 hover:border-amber-400";
    }

    if (isFuture) {
      if (day.topics && day.topics.length > 0) {
        return base + "bg-slate-900/60 border border-slate-700/60 text-slate-500 hover:border-slate-500 hover:text-slate-300";
      }
      return base + "bg-slate-950/60 border border-slate-800/60 text-slate-600";
    }

    return base + "bg-slate-950 border border-slate-800/40 text-slate-700";
  };

  const dayLabels = ["L", "M", "M", "G", "V", "S", "D"];

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-xl space-y-4">
      {/* Top Banner / Heatmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-emerald-400" />
              Activity Heatmap (Mappa di Studio)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              UNIMORE Contribution
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracciamento visivo delle ore di studio effettuate e programmate fino al 10 Gennaio 2027.
          </p>
        </div>

        {/* Quick Streak & Stats Pills */}
        <div className="flex items-center space-x-2 flex-wrap">
          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center space-x-2">
            <IconFlame className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Streak attiva:</span>
            <span className="text-xs font-bold text-amber-300 font-mono">{streakDays} gg</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center space-x-2">
            <IconCheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Ore svolte:</span>
            <span className="text-xs font-bold text-emerald-300 font-mono">{totalCompletedHours}h</span>
          </div>
        </div>
      </div>

      {/* The GitHub-style Grid */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="min-w-[650px] flex gap-2">
          {/* Day of Week Labels Column */}
          <div className="flex flex-col justify-between py-1 pr-1 text-[11px] font-bold text-slate-400 font-mono select-none">
            {dayLabels.map((l, idx) => (
              <span key={idx} className="h-6 sm:h-7 flex items-center justify-center w-4">
                {l}
              </span>
            ))}
          </div>

          {/* Weeks Columns */}
          <div className="flex gap-2">
            {weeksGrid.map((week) => (
              <div key={week.weekIndex} className="flex flex-col gap-1.5">
                {/* Week Header */}
                <div className="text-[10px] font-mono text-slate-400 text-center font-bold">
                  W{week.weekIndex}
                </div>

                {/* 7 Days in Week */}
                {week.daySlots.map((day, dIdx) => (
                  <button
                    type="button"
                    key={dIdx}
                    onClick={() => day && setSelectedDay(day)}
                    className={getCellClasses(day)}
                    title={day ? `${day.dayName} ${day.date} — ${day.allocatedHours}h (${day.dayStatus})` : ""}
                  >
                    {day?.isToday ? (
                      <span className="text-[9px] font-black">★</span>
                    ) : day?.dayStatus === "completed" ? (
                      <span>{day.allocatedHours > 0 ? Math.round(day.allocatedHours) : "✓"}</span>
                    ) : day?.dayStatus === "skipped" ? (
                      <span className="text-amber-400 text-[10px]">✕</span>
                    ) : null}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Explanations */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/70 gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px]">Intensità ore:</span>
          <span className="text-[10px]">Meno</span>
          <div className="flex items-center space-x-1">
            <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800" title="0h" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-800/80 border border-emerald-700" title="< 2h" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-500" title="2h - 3.5h" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-300" title="> 3.5h" />
          </div>
          <span className="text-[10px]">Più</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded ring-2 ring-cyan-400 bg-cyan-950 inline-block" /> Oggi
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded border border-amber-500/60 bg-slate-900 text-amber-400 flex items-center justify-center text-[9px]">✕</span> Saltato
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded border border-slate-700 bg-slate-900/60 inline-block" /> Programmato
          </span>
        </div>
      </div>

      {/* Selected Day Details Drawer (if clicked) */}
      {selectedDay && (
        <div className="mt-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 animate-fade-in text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-lg font-mono font-bold ${
                selectedDay.isToday
                  ? "bg-cyan-500 text-black"
                  : selectedDay.dayStatus === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-300"
              }`}>
                {selectedDay.dayName} {formatDateDisplay(selectedDay.date)}
              </span>
              <span className="text-slate-400 font-mono">
                {selectedDay.timeSlot}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {onSetDate && !selectedDay.isToday && (
                <button
                  type="button"
                  onClick={() => onSetDate(selectedDay.date)}
                  className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-bold transition text-[11px]"
                >
                  Simula come "Oggi"
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-slate-500 hover:text-white px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-slate-300">
            <div>
              Stato: <strong className={selectedDay.dayStatus === "completed" ? "text-emerald-400" : selectedDay.dayStatus === "skipped" ? "text-amber-400" : "text-cyan-300"}>
                {selectedDay.dayStatus === "completed" ? `Completato (${selectedDay.allocatedHours}h)` : selectedDay.dayStatus === "skipped" ? "Giorno saltato (ribilanciato)" : `Programmato (${selectedDay.allocatedHours}h)`}
              </strong>
            </div>
            <div className="text-slate-400">
              Materia: <strong>{selectedDay.preferredSubject}</strong>
            </div>
          </div>

          {selectedDay.topics && selectedDay.topics.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold">Argomenti del giorno:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {selectedDay.topics.map(t => (
                  <div key={t.id} className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-mono font-bold text-cyan-300">{t.id}</span>
                      <span className="text-slate-200 truncate">{t.argomento}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold flex-shrink-0 ml-2">
                      {t.effectiveHours || t.oreStimate}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic text-[11px] pt-1">Nessun argomento specifico assegnato per questo giorno.</p>
          )}
        </div>
      )}
    </div>
  );
}


// --- src/components/WeeklyTodo.js ---



const LOCAL_STORAGE_KEY_POMODORO = "unimore_rebalancer_pomodoro_v2";

function WeeklyTodo({
  weeklyPlans,
  onToggleComplete,
  onUpdateTopicHours,
  settings,
  customDayCapacities = {},
  onUpdateDayCapacity,
  onOpenLogModal,
  onOpenTopicDetail,
  onToggleSpacedReview
}) {
  // Default to the week containing Today
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(() => {
    const currentWeek = weeklyPlans.find(w => w.hasToday);
    return currentWeek ? currentWeek.weekNumber : 1;
  });

  const [filterSubject, setFilterSubject] = useState("all");

  // Pomodoro timer state for topic cards
  // { [topicId]: { accumulatedSeconds: number, isRunning: boolean, cycleRemaining: number, isBreak: boolean, completedByTimer: boolean } }
  const [pomodoroMap, setPomodoroMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_POMODORO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load pomodoro state from localStorage", e);
    }
    return {};
  });

  // Persist Pomodoro map to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_POMODORO, JSON.stringify(pomodoroMap));
    } catch (e) {
      console.warn("Failed to persist pomodoro state", e);
    }
  }, [pomodoroMap]);

  // Global Pomodoro ticker (1 second per tick)
  useEffect(() => {
    const hasRunning = Object.values(pomodoroMap).some(p => p.isRunning);
    if (!hasRunning) return;

    const interval = setInterval(() => {
      setPomodoroMap(prev => {
        let changed = false;
        const nextMap = { ...prev };

        Object.entries(prev).forEach(([topicId, pState]) => {
          if (!pState.isRunning) return;
          changed = true;

          const isBreak = pState.isBreak || false;
          let cycleRemaining = (pState.cycleRemaining !== undefined ? pState.cycleRemaining : 50 * 60) - 1;
          let newIsBreak = isBreak;

          if (cycleRemaining <= 0) {
            // Switch between 50 min study and 10 min break
            newIsBreak = !isBreak;
            cycleRemaining = newIsBreak ? 10 * 60 : 50 * 60;
            // When completing a 50m focus phase, add focus hours to topic oreEffettive
            if (newIsBreak && onUpdateTopicHours) {
              onUpdateTopicHours(topicId, 50 / 60, true);
            }
          }

          // Accumulate focus time only during focus study phase
          const accumulated = isBreak ? (pState.accumulatedSeconds || 0) : (pState.accumulatedSeconds || 0) + 1;
          const targetSeconds = Math.round((Number(pState.targetHours) || 2.0) * 3600);
          const reachedTarget = accumulated >= targetSeconds;

          nextMap[topicId] = {
            ...pState,
            accumulatedSeconds: accumulated,
            cycleRemaining,
            isBreak: newIsBreak,
            isRunning: reachedTarget ? false : pState.isRunning,
            completedByTimer: reachedTarget ? true : pState.completedByTimer
          };

          // Auto-check topic when accumulated timer reaches estimated hours!
          if (reachedTarget && !pState.completedByTimer) {
            onToggleComplete(topicId);
          }
        });

        return changed ? nextMap : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoroMap, onToggleComplete]);

  // Pomodoro Actions
  const togglePomodoro = (topicId, targetHours) => {
    setPomodoroMap(prev => {
      const current = prev[topicId] || {
        accumulatedSeconds: 0,
        cycleRemaining: 50 * 60,
        isBreak: false,
        isRunning: false,
        completedByTimer: false
      };
      return {
        ...prev,
        [topicId]: {
          ...current,
          targetHours: Number(targetHours) || 2.0,
          isRunning: !current.isRunning
        }
      };
    });
  };

  const resetPomodoro = (topicId, targetHours) => {
    setPomodoroMap(prev => ({
      ...prev,
      [topicId]: {
        accumulatedSeconds: 0,
        cycleRemaining: 50 * 60,
        isBreak: false,
        isRunning: false,
        targetHours: Number(targetHours) || 2.0,
        completedByTimer: false
      }
    }));
  };

  const addPomodoroMinutes = (topicId, targetHours, minutes) => {
    // Sync added pomodoro time directly with oreEffettive
    if (onUpdateTopicHours) {
      onUpdateTopicHours(topicId, minutes / 60, true);
    }

    setPomodoroMap(prev => {
      const current = prev[topicId] || {
        accumulatedSeconds: 0,
        cycleRemaining: 50 * 60,
        isBreak: false,
        isRunning: false,
        completedByTimer: false
      };
      const added = minutes * 60;
      const accumulated = (current.accumulatedSeconds || 0) + added;
      const targetSeconds = Math.round((Number(targetHours) || 2.0) * 3600);
      const reachedTarget = accumulated >= targetSeconds;

      if (reachedTarget && !current.completedByTimer) {
        onToggleComplete(topicId);
      }

      return {
        ...prev,
        [topicId]: {
          ...current,
          targetHours: Number(targetHours) || 2.0,
          accumulatedSeconds: accumulated,
          isRunning: reachedTarget ? false : current.isRunning,
          completedByTimer: reachedTarget ? true : current.completedByTimer
        }
      };
    });
  };

  const completePomodoroTarget = (topicId, targetHours) => {
    const targetSec = Math.round((Number(targetHours) || 2.0) * 3600);
    // Bring topic oreEffettive to targetHours
    if (onUpdateTopicHours) {
      onUpdateTopicHours(topicId, Number(targetHours) || 2.0, false);
    }
    setPomodoroMap(prev => {
      const current = prev[topicId] || {};
      return {
        ...prev,
        [topicId]: {
          ...current,
          targetHours: Number(targetHours) || 2.0,
          accumulatedSeconds: targetSec,
          isRunning: false,
          cycleRemaining: 0,
          completedByTimer: true
        }
      };
    });
    // Trigger auto-check of the topic
    onToggleComplete(topicId);
  };

  const formatMinutesSeconds = (totalSec) => {
    const s = Math.max(0, totalSec);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Keep selected week in sync if currentSimulatedDate changes week
  useEffect(() => {
    const currentWeek = weeklyPlans.find(w => w.hasToday);
    if (currentWeek) {
      setSelectedWeekIndex(currentWeek.weekNumber);
    }
  }, [settings.currentSimulatedDate]);

  if (!weeklyPlans || weeklyPlans.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <p className="text-base">Nessun piano settimanale disponibile. Tutti gli argomenti potrebbero essere già completati!</p>
      </div>
    );
  }

  const currentWeek = weeklyPlans.find(w => w.weekNumber === selectedWeekIndex) || weeklyPlans[0];

  const handlePrevWeek = () => {
    if (selectedWeekIndex > 1) {
      setSelectedWeekIndex(selectedWeekIndex - 1);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeekIndex < weeklyPlans.length) {
      setSelectedWeekIndex(selectedWeekIndex + 1);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}`;
  };

  return (
    <div className="space-y-6">
      {/* Week Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation buttons and title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={handlePrevWeek}
            disabled={selectedWeekIndex === 1}
            className={`p-2 rounded-xl border transition ${
              selectedWeekIndex === 1
                ? "bg-slate-950/40 text-slate-600 border-slate-800 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
            }`}
            title="Settimana precedente"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg md:text-xl font-extrabold text-white">
                Settimana {currentWeek.weekNumber}
              </h3>
              {currentWeek.hasToday && (
                <span className="text-[11px] uppercase tracking-wider font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  Settimana Attiva
                </span>
              )}
              {currentWeek.isPastWeek && (
                <span className="text-[11px] font-medium bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                  Passata
                </span>
              )}
              {currentWeek.isOverloaded && (
                <span className="text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <IconFlame className="w-3 h-3 text-rose-400" /> &gt;{settings.criticalWeeklyHoursThreshold}h
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Periodo: {formatDateDisplay(currentWeek.startDate)} – {formatDateDisplay(currentWeek.endDate)}
            </p>
          </div>

          <button
            onClick={handleNextWeek}
            disabled={selectedWeekIndex === weeklyPlans.length}
            className={`p-2 rounded-xl border transition ${
              selectedWeekIndex === weeklyPlans.length
                ? "bg-slate-950/40 text-slate-600 border-slate-800 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
            }`}
            title="Settimana successiva"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekly metrics and filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Workload badge */}
          <div className="bg-slate-950/70 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center space-x-2">
            <IconClock className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400">Monte ore:</span>
            <span className={`text-sm font-bold font-mono ${
              currentWeek.isOverloaded ? "text-rose-400" : "text-white"
            }`}>
              {currentWeek.totalAllocatedHours}h
            </span>
          </div>

          {/* Filter subject */}
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterSubject("all")}
              className={`px-3 py-1 rounded-lg transition ${
                filterSubject === "all" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Tutte
            </button>
            <button
              onClick={() => setFilterSubject("analisi")}
              className={`px-3 py-1 rounded-lg transition ${
                filterSubject === "analisi" ? "bg-emerald-600/30 text-emerald-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Analisi
            </button>
            <button
              onClick={() => setFilterSubject("geometria")}
              className={`px-3 py-1 rounded-lg transition ${
                filterSubject === "geometria" ? "bg-indigo-600/30 text-indigo-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Geometria
            </button>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="space-y-4">
        {currentWeek.days.map((day) => {
          const isToday = day.isToday;
          const isPast = day.isPast;
          const isSkipped = isPast && day.dayStatus === "skipped";
          const isCompletedPast = isPast && day.dayStatus === "completed";

          const visibleTopics = day.topics.filter(t => {
            if (filterSubject === "analisi") return t.materia.toLowerCase().includes("analisi");
            if (filterSubject === "geometria") return t.materia.toLowerCase().includes("geometria");
            return true;
          });

          return (
            <div
              key={day.date}
              className={`border rounded-3xl p-4 md:p-5 transition backdrop-blur-md relative overflow-hidden ${
                isToday
                  ? "bg-slate-900/95 border-cyan-500/60 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/40"
                  : isCompletedPast
                  ? "bg-slate-900/70 border-emerald-500/30"
                  : isSkipped
                  ? "bg-slate-950/70 border-slate-800/80 opacity-75"
                  : day.isWeekend
                  ? "bg-gradient-to-r from-slate-900/90 to-indigo-950/30 border-indigo-500/20"
                  : "bg-slate-900/70 border-slate-800/80"
              }`}
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/70">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono ${
                    isToday
                      ? "bg-cyan-500 text-black font-extrabold"
                      : isCompletedPast
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : isSkipped
                      ? "bg-slate-800 text-slate-400"
                      : day.isWeekend
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}>
                    {day.dayName} {formatDateDisplay(day.date)}
                  </span>

                  {isToday && (
                    <span className="text-[11px] uppercase tracking-wider font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full animate-pulse-subtle">
                      ★ OGGI (Data Attiva)
                    </span>
                  )}

                  {isCompletedPast && (
                    <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                      <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                      Sessione svolta ({day.allocatedHours}h)
                    </span>
                  )}

                  {isSkipped && (
                    <span className="text-xs text-amber-400/90 font-medium flex items-center gap-1">
                      <IconClock className="w-4 h-4 text-amber-400" />
                      Giorno saltato • Argomenti recuperati automaticamente in avanti
                    </span>
                  )}

                  {!isPast && !isToday && (
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      {day.isWeekend ? (
                        <span className="text-indigo-300 font-medium">Blocco Weekend ({day.timeSlot})</span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <IconBriefcase className="w-3.5 h-3.5 text-slate-500" />
                          Lavoro Full-Time escluso • Studio {day.timeSlot}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Quick Log Studio Button for this day */}
                  <button
                    type="button"
                    onClick={() => onOpenLogModal && onOpenLogModal({ date: day.date })}
                    className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-500/40 hover:to-teal-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-mono font-bold border border-emerald-500/40 transition active:scale-95 flex items-center gap-1.5 shadow-sm"
                    title={`Registra ore di studio svolte per ${day.dayName} ${formatDateDisplay(day.date)} (+)`}
                  >
                    <span className="text-sm font-black leading-none">+</span>
                    <span>Registra Studio</span>
                  </button>

                  {/* Time Shifter: Stepper Controls */}
                  <div className="flex items-center space-x-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl shadow-inner">
                    <button
                      type="button"
                      onClick={() => onUpdateDayCapacity && onUpdateDayCapacity(day.date, Math.max(0, Number((day.maxHours - 0.5).toFixed(1))))}
                      disabled={day.maxHours <= 0}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-700 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                      title="Riduci budget di 30 minuti (-0.5h)"
                    >
                      - 30m
                    </button>

                    <div
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition ${
                        day.hasCustomOverride
                          ? day.maxHours > (day.standardHours || 2.5)
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-slate-900 text-slate-300 border border-slate-800"
                      }`}
                      title={day.hasCustomOverride ? `Capacità modificata rispetto al default (${day.standardHours || 2.5}h)` : "Capacità standard"}
                    >
                      <span>Budget: {day.maxHours}h</span>
                      {day.hasCustomOverride && (
                        <button
                          type="button"
                          onClick={() => onUpdateDayCapacity && onUpdateDayCapacity(day.date, null)}
                          className="ml-1 text-[10px] text-slate-400 hover:text-white hover:bg-slate-800 rounded px-1"
                          title="Ripristina budget predefinito"
                        >
                          ↺
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpdateDayCapacity && onUpdateDayCapacity(day.date, Number((day.maxHours + 0.5).toFixed(1)))}
                      className="px-2 py-0.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold border border-cyan-500/40 transition active:scale-95 shadow-sm"
                      title="Slot Extra: Aumenta budget di 30 minuti (+0.5h)"
                    >
                      + 30m
                    </button>
                  </div>

                  {/* Workload Indicator */}
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs font-mono">
                    <span className="text-slate-500">Carico:</span>
                    <span className={`font-bold ${
                      day.allocatedHours > day.maxHours ? "text-amber-400" : "text-slate-200"
                    }`}>
                      {day.allocatedHours}h / {day.maxHours}h max
                    </span>
                  </div>
                </div>
              </div>

              {/* Spaced Repetition Cyclical Reviews Banner */}
              {day.spacedReviews && day.spacedReviews.length > 0 && (
                <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/40 border border-purple-500/40 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-purple-500/20 text-purple-300">🧠</span>
                      <span className="font-extrabold text-xs text-purple-200">
                        Ripasso Spaced Repetition ({day.spacedReviews.length})
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-300/80 font-mono">
                      15-20m • Teoria & formule a memoria
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {day.spacedReviews.map(rev => (
                      <div
                        key={`${rev.topicId}-${rev.levelKey}`}
                        className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-xs transition ${
                          rev.isDone
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                            : rev.isOverdue
                            ? "bg-rose-950/50 border-rose-500/40 text-rose-200"
                            : "bg-slate-900/90 border-slate-800 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rev.isDone
                              ? "bg-emerald-500/20 text-emerald-300"
                              : rev.isOverdue
                              ? "bg-rose-500/20 text-rose-300 animate-pulse"
                              : "bg-purple-500/20 text-purple-300"
                          }`}>
                            {rev.levelLabel}
                          </span>
                          <span className="font-mono font-bold text-slate-100">{rev.topicId}</span>
                          <span className="truncate text-slate-300 text-[11px] max-w-[140px] sm:max-w-[200px]" title={rev.argomento}>
                            {rev.argomento}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => onOpenTopicDetail && onOpenTopicDetail(rev.topicId)}
                            className="p-1 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold border border-slate-700 transition"
                            title="Apri scheda informativa per ripasso veloce"
                          >
                            📖 Scheda
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleSpacedReview && onToggleSpacedReview(rev.topicId, rev.levelKey, !rev.isDone)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                              rev.isDone
                                ? "bg-emerald-500/30 border-emerald-500/50 text-emerald-200"
                                : "bg-purple-600/40 hover:bg-purple-600/60 border-purple-500/50 text-purple-200 shadow-sm"
                            }`}
                          >
                            {rev.isDone ? "Ripassato ✓" : "Segna Fatto"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics list for the day */}
              {isSkipped ? (
                <div className="py-3 px-4 bg-black/30 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>In questa data non è stato registrato studio. Gli argomenti sono stati riprogrammati a partire da oggi.</span>
                  <span className="text-amber-400/90 font-mono text-[11px]">0h svolte</span>
                </div>
              ) : visibleTopics.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500 italic">
                  Nessun argomento previsto in questo slot (riposo o filtro attivo).
                </div>
              ) : (
                <div className={`grid gap-3.5 ${
                  visibleTopics.length >= 3
                    ? "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
                    : visibleTopics.length === 2
                    ? "grid-cols-1 xl:grid-cols-2"
                    : "grid-cols-1"
                }`}>
                  {visibleTopics.map(topic => {
                    const isAnalisi = topic.materia.toLowerCase().includes("analisi");
                    const isDone = Boolean(topic.completato !== undefined ? topic.completato : topic.isCompleted);
                    const pState = pomodoroMap[topic.id] || {
                      accumulatedSeconds: 0,
                      cycleRemaining: 50 * 60,
                      isRunning: false,
                      isBreak: false,
                      completedByTimer: false
                    };
                    const targetSeconds = Math.round((Number(topic.oreStimate) || 2.0) * 3600);
                    const accumulated = pState.accumulatedSeconds || 0;
                    const percentPomodoro = Math.min(100, Math.round((accumulated / targetSeconds) * 100));

                    return (
                      <div
                        key={topic.sessionId || (topic.id + '_' + (topic.isSessionLog ? 'log' : 'sched'))}
                        className={`flex flex-col justify-between p-3.5 md:p-4 rounded-2xl border transition-all h-full ${
                          isDone
                            ? "bg-slate-950/60 border-slate-800/50 opacity-60"
                            : topic.isSessionLog
                            ? "bg-slate-950/90 border-emerald-500/40 shadow-sm shadow-emerald-950/20"
                            : isAnalisi
                            ? "bg-slate-950/80 hover:bg-slate-900 border-emerald-500/20 hover:border-emerald-500/40"
                            : "bg-slate-950/80 hover:bg-slate-900 border-indigo-500/20 hover:border-indigo-500/40"
                        }`}
                      >
                        {/* Upper row: Topic Header, Meta and Subject */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              {/* Subject Badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isAnalisi
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              }`}>
                                {topic.materia}
                              </span>

                              {/* Topic ID & Info Trigger */}
                              <button
                                type="button"
                                onClick={() => onOpenTopicDetail && onOpenTopicDetail(topic)}
                                className="text-[11px] font-mono font-bold text-slate-300 hover:text-cyan-300 transition flex items-center gap-1 group/btn"
                                title="Apri scheda informativa dettagliata"
                              >
                                <span>{topic.id}</span>
                                <span className="text-[9px] font-sans px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 group-hover/btn:bg-cyan-500/20 border border-cyan-500/30">
                                  ℹ Info
                                </span>
                              </button>

                              {/* Chapter */}
                              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                • {topic.capitolo}
                              </span>

                              {/* Session Log Badge */}
                              {topic.isSessionLog && (
                                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                                  ✓ Sessione Svolta ({topic.effectiveHours}h){isDone ? ` • Completato il ${formatDateDisplay(topic.completedDate || topic.assignedDate)}` : ""}
                                </span>
                              )}

                              {/* Buffer +20% badge */}
                              {topic.hasBuffer && (
                                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                  +20% Buffer Priorità
                                </span>
                              )}

                              {isDone && !topic.isSessionLog && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                  ✓ Completato {topic.completedDate ? `il ${formatDateDisplay(topic.completedDate)}` : ""}
                                </span>
                              )}

                              {!isDone && (topic.oreEffettive || 0) > 0 && !topic.isSessionLog && (
                                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                                  ⏳ In Corso ({Number(topic.oreEffettive).toFixed(1)}h svolte)
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenTopicDetail && onOpenTopicDetail(topic)}
                              className="text-left group/title block cursor-pointer w-full"
                              title="Clicca per aprire la scheda dell'argomento"
                            >
                              <p className={`text-xs md:text-sm font-semibold transition ${
                                isDone ? "line-through text-slate-500" : "text-slate-200 group-hover/title:text-cyan-300"
                              }`}>
                                {topic.argomento}
                              </p>
                            </button>

                            {topic.sessionNote ? (
                              <p className="text-[11px] text-emerald-300/90 italic mt-0.5">
                                Nota di studio: "{topic.sessionNote}"
                              </p>
                            ) : topic.note ? (
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                Obiettivo: {topic.note}
                              </p>
                            ) : null}
                          </div>

                          {/* Allocation info on this day */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 flex-shrink-0 pt-1">
                            <div className="text-right">
                              <span className="text-[11px] text-slate-400 font-mono">In programma: </span>
                              <span className="text-xs font-mono font-bold text-white">
                                {topic.effectiveHours}h
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                              <span>P: <strong className="text-amber-400">{topic.prioritaEsame}/5</strong></span>
                              <span>D: <strong className="text-cyan-400">{topic.difficolta}/5</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Partial Progress & Hours Tracking Console */}
                        <div className="mt-3 p-3 bg-slate-950/70 border border-slate-800/90 rounded-2xl space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            {/* Display Hours */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-xs font-mono text-slate-200 flex items-center gap-1.5">
                                <IconClock className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Ore spese:</span>
                                <strong className="text-cyan-300 font-bold text-sm">
                                  {Number(topic.oreEffettive || 0).toFixed(1)}
                                </strong>
                                <span className="text-slate-400">/ {Number(topic.oreStimate || 2.0).toFixed(1)} stimate</span>
                              </div>

                              {!isDone && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  Residue: <strong>{Number(topic.oreResidue !== undefined ? topic.oreResidue : Math.max(0, (topic.oreStimate || 2.0) - (topic.oreEffettive || 0))).toFixed(1)}h</strong>
                                </span>
                              )}
                            </div>

                            {/* Quick Add Time Stepper Buttons */}
                            <div className="flex items-center space-x-1.5 self-start sm:self-center">
                              <button
                                type="button"
                                onClick={() => onUpdateTopicHours && onUpdateTopicHours(topic.id, -0.5, true)}
                                disabled={(topic.oreEffettive || 0) <= 0}
                                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Riduci ore spese (-30 minuti)"
                              >
                                - 30m
                              </button>

                              <button
                                type="button"
                                onClick={() => onUpdateTopicHours && onUpdateTopicHours(topic.id, 0.5, true)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-[11px] font-mono font-bold transition active:scale-95 shadow-sm"
                                title="Aggiungi 30 minuti al tempo speso (+0.5h)"
                              >
                                + 30m
                              </button>

                              <button
                                type="button"
                                onClick={() => onUpdateTopicHours && onUpdateTopicHours(topic.id, 1.0, true)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/40 text-[11px] font-mono font-bold transition active:scale-95 shadow-sm"
                                title="Aggiungi 1 ora al tempo speso (+1.0h)"
                              >
                                + 1h
                              </button>

                              <button
                                type="button"
                                onClick={() => onOpenLogModal && onOpenLogModal({ date: day.date, topicId: topic.id })}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/25 hover:bg-emerald-500/35 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-[11px] font-mono font-bold transition active:scale-95 shadow-sm flex items-center gap-1"
                                title="Registra sessione personalizzata (+)"
                              >
                                <span className="font-black">+</span>
                                <span>Log</span>
                              </button>
                            </div>
                          </div>

                          {/* Progress Bar & Distinct Completed Toggle Button */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1.5 border-t border-slate-900">
                            {/* Micro Progress Bar */}
                            <div className="flex-1 flex items-center space-x-2.5">
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/80">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    isDone
                                      ? "bg-emerald-400"
                                      : (topic.oreEffettive || 0) > 0
                                      ? "bg-gradient-to-r from-cyan-400 to-indigo-400"
                                      : "bg-transparent"
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.round(((topic.oreEffettive || 0) / (topic.oreStimate || 2.0)) * 100))}%`
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                                {Math.min(100, Math.round(((topic.oreEffettive || 0) / (topic.oreStimate || 2.0)) * 100))}%
                              </span>
                            </div>

                            {/* Distinct Completion Toggle Button */}
                            <button
                              type="button"
                              onClick={() => onToggleComplete(topic.id)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 flex-shrink-0 active:scale-95 ${
                                isDone
                                  ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30 shadow-sm shadow-emerald-950/40"
                                  : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-700 hover:border-slate-500"
                              }`}
                              title={isDone ? "Argomento completato (clicca per riaprire)" : "Segna questo argomento come completato"}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                                isDone ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-500 bg-slate-950"
                              }`}>
                                {isDone && <IconCheck className="w-3 h-3" />}
                              </div>
                              <span>{isDone ? "Completato ✓" : "Segna come Completato"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Pomodoro 50/10 Interactive Tracker Strip */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/50 p-2.5 rounded-xl">
                          <div className="flex items-center space-x-2.5">
                            <div className={`p-1.5 rounded-lg border flex-shrink-0 ${
                              pState.isRunning
                                ? (pState.isBreak ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse")
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                              <IconTomato className="w-4 h-4" />
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] font-bold text-slate-200">
                                  Pomodoro 50/10
                                </span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                                  pState.isBreak
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : pState.isRunning
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-slate-800 text-slate-400"
                                }`}>
                                  {pState.isBreak ? "☕ Pausa" : "🍅 Studio"} {formatMinutesSeconds(pState.cycleRemaining !== undefined ? pState.cycleRemaining : 50 * 60)}
                                </span>
                                {accumulated >= targetSeconds && (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                    ✓ Target Raggiunto
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                                    style={{ width: `${percentPomodoro}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {(accumulated / 3600).toFixed(1)}h / {topic.oreStimate}h ({percentPomodoro}%)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Pomodoro Timer Controls */}
                          <div className="flex items-center space-x-1.5 self-end sm:self-center flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => togglePomodoro(topic.id, topic.oreStimate)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                pState.isRunning
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
                              }`}
                              title={pState.isRunning ? "Metti in pausa il timer" : "Avvia il timer pomodoro"}
                            >
                              {pState.isRunning ? <IconPause className="w-3.5 h-3.5" /> : <IconPlay className="w-3.5 h-3.5" />}
                              <span>{pState.isRunning ? "Pausa" : "Avvia"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => resetPomodoro(topic.id, topic.oreStimate)}
                              className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                              title="Azzera il tempo accumulato per questo argomento"
                            >
                              <IconRotateCcw className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => addPomodoroMinutes(topic.id, topic.oreStimate, 30)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] font-mono transition"
                              title="Aggiungi 30 minuti di studio completati"
                            >
                              +30m
                            </button>

                            <button
                              type="button"
                              onClick={() => completePomodoroTarget(topic.id, topic.oreStimate)}
                              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition"
                              title="Simula raggiungimento completo delle ore stimate (auto-check automatico)"
                            >
                              Target Raggiunto
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// --- src/components/HistoryLog.js ---




function HistoryLog({
  historyDays,
  calendarDays = [],
  metrics,
  onAdvanceDate,
  onRetrocedeDate,
  onSetDate,
  onOpenLogModal,
  onDeleteSession,
  onOpenTopicDetail
}) {
  const [filterType, setFilterType] = useState("all"); // "all" | "completed" | "skipped"

  const filteredHistory = historyDays.filter(day => {
    if (filterType === "completed") return day.dayStatus === "completed";
    if (filterType === "skipped") return day.dayStatus === "skipped";
    return true;
  });

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="space-y-6">
      {/* Historical Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Data Attiva (Oggi)
          </div>
          <div className="text-xl md:text-2xl font-black text-cyan-300 font-mono">
            {formatDateDisplay(metrics.currentSimulatedDate)}
          </div>
          <div className="flex items-center space-x-1.5 mt-2">
            <button
              onClick={onRetrocedeDate}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold"
              title="Giorno precedente"
            >
              ◀ Ieri
            </button>
            <button
              onClick={onAdvanceDate}
              className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-bold"
              title="Giorno successivo (simula avanzamento)"
            >
              Domani ▶
            </button>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Giorni Trascorsi
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {metrics.historyCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            dall'inizio del piano ({formatDateDisplay(metrics.roadmapStartDate)})
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Giorni di Studio Svolti
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono">
            {metrics.pastDaysStudied}
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">
            {metrics.totalPastHours}h di studio effettivo
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Giorni Saltati
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-400 font-mono">
            {metrics.pastDaysSkipped}
          </div>
          <p className="text-[11px] text-amber-300/80 mt-1">
            Recuperati nei giorni successivi
          </p>
        </div>
      </div>

      {/* GitHub-like Contribution Activity Heatmap */}
      <ActivityHeatmap
        calendarDays={calendarDays}
        historyDays={historyDays}
        metrics={metrics}
        onSetDate={onSetDate}
      />

      {/* Header Bar with Filters */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <IconHistory className="w-5 h-5 text-cyan-400" />
            Storico e Diario di Studio
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracciamento delle date passate: vedi cosa è stato svolto e come i giorni saltati si sono ribilanciati in avanti.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenLogModal && onOpenLogModal({ date: metrics.currentSimulatedDate })}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 border border-emerald-400/40 transition active:scale-95"
            title="Registra ore di studio svolte (+)"
          >
            <span className="text-sm font-black leading-none">+</span>
            <span>Registra Studio</span>
          </button>

          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "all" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Tutti i Giorni
            </button>
            <button
              onClick={() => setFilterType("completed")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "completed" ? "bg-emerald-600/30 text-emerald-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Solo Studiati
            </button>
            <button
              onClick={() => setFilterType("skipped")}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === "skipped" ? "bg-amber-600/30 text-amber-300 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Solo Saltati
            </button>
          </div>
        </div>
      </div>

      {/* Timeline of Days */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredHistory.map(day => {
          const isToday = day.isToday;
          const isSkipped = day.dayStatus === "skipped";
          const isCompleted = day.dayStatus === "completed";

          return (
            <div
              key={day.date}
              className={`p-4 md:p-5 rounded-2xl border transition backdrop-blur-md flex flex-col justify-between ${
                isToday
                  ? "bg-slate-900/95 border-cyan-500/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30"
                  : isCompleted
                  ? "bg-slate-900/80 border-emerald-500/30"
                  : isSkipped
                  ? "bg-slate-950/80 border-slate-800"
                  : "bg-slate-950/50 border-slate-800/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
                    isToday
                      ? "bg-cyan-500 text-black font-extrabold"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-300"
                  }`}>
                    {day.dayName} {formatDateDisplay(day.date)}
                  </span>

                  {isToday && (
                    <span className="text-[11px] uppercase tracking-wider font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      Oggi (Data Attiva)
                    </span>
                  )}

                  {isCompleted && (
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                      <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                      Sessione di studio completata ({day.allocatedHours}h)
                    </span>
                  )}

                  {isSkipped && (
                    <span className="text-xs text-amber-400/90 font-medium flex items-center gap-1">
                      <IconClock className="w-4 h-4 text-amber-400" />
                      Giorno saltato / Nessuno studio • Ribilanciato automaticamente
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 font-mono">
                    {day.timeSlot}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenLogModal && onOpenLogModal({ date: day.date })}
                    className="px-2 py-0.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 transition active:scale-95 flex items-center gap-1"
                    title={`Aggiungi o registra sessione per ${day.dayName} ${formatDateDisplay(day.date)} (+)`}
                  >
                    <span className="font-black">+</span>
                    <span>Studio</span>
                  </button>
                </div>
              </div>

              {/* Topics list for this day */}
              {day.topics.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/70 space-y-2">
                  {day.topics.map(t => (
                    <div
                      key={t.sessionId || (t.id + '_' + (t.isSessionLog ? 'log' : 'topic'))}
                      className="flex items-center justify-between text-xs bg-black/30 p-2.5 rounded-xl border border-slate-800/60"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1 pr-2">
                        <button
                          type="button"
                          onClick={() => onOpenTopicDetail && onOpenTopicDetail(t.id)}
                          className="font-mono font-bold text-slate-200 hover:text-cyan-300 transition text-left cursor-pointer flex items-center gap-1 group/btn"
                          title="Apri scheda dettagli argomento"
                        >
                          <span>{t.id}</span>
                          <span className="text-[9px] font-sans px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 group-hover/btn:bg-cyan-500/20 border border-cyan-500/30">
                            ℹ
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenTopicDetail && onOpenTopicDetail(t.id)}
                          className="text-slate-300 hover:text-cyan-200 truncate text-left transition cursor-pointer"
                          title="Apri scheda dettagli argomento"
                        >
                          {t.argomento}
                        </button>
                        {t.isSessionLog && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold flex-shrink-0">
                            Sessione
                          </span>
                        )}
                        {t.sessionNote && (
                          <span className="text-[11px] text-slate-400 italic truncate max-w-xs">
                            "{t.sessionNote}"
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="font-mono text-emerald-400 font-bold">
                          {t.effectiveHours}h
                        </span>
                        {t.sessionId && onDeleteSession && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Eliminare la sessione di ${t.effectiveHours}h su ${t.id}?`)) {
                                onDeleteSession(t.sessionId);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                            title="Elimina sessione"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// --- src/components/TopicsTable.js ---



function TopicsTable({ topics, onToggleComplete, onUpdateTopicHours, onBatchUpdate, onOpenTopicDetail }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
      const isPartial = !isDone && (Number(t.oreEffettive) || 0) > 0;

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(query);
        const matchesArg = t.argomento.toLowerCase().includes(query);
        const matchesCap = (t.capitolo || "").toLowerCase().includes(query);
        if (!matchesId && !matchesArg && !matchesCap) return false;
      }

      // Subject
      if (subjectFilter !== "all") {
        if (!t.materia.toLowerCase().includes(subjectFilter.toLowerCase())) return false;
      }

      // Status
      if (statusFilter === "completed" && !isDone) return false;
      if (statusFilter === "in_progress" && !isPartial) return false;
      if (statusFilter === "todo" && (isDone || isPartial)) return false;

      // Priority
      if (priorityFilter === "high" && (t.prioritaEsame < 4 && t.difficolta < 4)) return false;

      return true;
    });
  }, [topics, searchQuery, subjectFilter, statusFilter, priorityFilter]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per ID (es. A-09, G-14), argomento, capitolo..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tutte le Materie</option>
            <option value="analisi">Analisi 1</option>
            <option value="geometria">Geometria</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tutti gli Stati</option>
            <option value="todo">Da Fare (0h)</option>
            <option value="in_progress">In Corso (Parziale)</option>
            <option value="completed">Solo Completati</option>
          </select>

          {/* Priority Filter */}
          <button
            onClick={() => setPriorityFilter(priorityFilter === "high" ? "all" : "high")}
            className={`text-xs px-3 py-2 rounded-xl border transition flex items-center gap-1.5 ${
              priorityFilter === "high"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <IconFlame className="w-3.5 h-3.5 text-amber-400" />
            Alta Priorità / Buffer
          </button>
        </div>
      </div>

      {/* Topics Count and Batch Controls */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <div>
          Visualizzati <strong className="text-white">{filteredTopics.length}</strong> su{" "}
          <strong className="text-white">{topics.length}</strong> argomenti totali
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onBatchUpdate(topics.map(t => ({ ...t, isCompleted: false })))}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Reset tutti a "Da fare"
          </button>
          <span>•</span>
          <button
            onClick={() => {
              // Mark first 6 topics completed as a test
              const updated = topics.map((t, idx) => ({
                ...t,
                isCompleted: idx < 6 ? true : t.isCompleted
              }));
              onBatchUpdate(updated);
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            Simula completamento prime 2 sett.
          </button>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Stato</th>
                <th className="py-3 px-3 w-20">ID</th>
                <th className="py-3 px-3 w-28">Materia</th>
                <th className="py-3 px-4">Capitolo & Argomento</th>
                <th className="py-3 px-3 w-36 text-center">Ore Spese / Stimate</th>
                <th className="py-3 px-3 w-20 text-center">Difficoltà</th>
                <th className="py-3 px-3 w-20 text-center">Priorità</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTopics.map((topic) => {
                const isAnalisi = topic.materia.toLowerCase().includes("analisi");
                const isDone = Boolean(topic.completato !== undefined ? topic.completato : topic.isCompleted);
                const hasBuffer = (topic.prioritaEsame >= 4 || topic.difficolta >= 4);
                const effHours = Number(topic.oreEffettive || 0);

                return (
                  <tr
                    key={topic.id}
                    className={`hover:bg-slate-850/60 transition ${
                      isDone ? "bg-slate-950/40 opacity-60" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleComplete(topic.id)}
                        className={`w-5 h-5 mx-auto rounded-lg border flex items-center justify-center transition-colors ${
                          isDone
                            ? "bg-emerald-500 border-emerald-400 text-white"
                            : effHours > 0
                            ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-300"
                            : "border-slate-600 hover:border-slate-400 bg-slate-900"
                        }`}
                        title={isDone ? "Segna come incompleto" : "Segna come completato"}
                      >
                        {isDone && <IconCheck className="w-3.5 h-3.5" />}
                        {!isDone && effHours > 0 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onOpenTopicDetail && onOpenTopicDetail(topic)}
                        className="font-mono font-bold text-slate-200 hover:text-cyan-300 transition flex items-center gap-1 group/btn"
                        title="Apri scheda informativa"
                      >
                        <span>{topic.id}</span>
                        <span className="text-[9px] font-sans px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 group-hover/btn:bg-cyan-500/20 border border-cyan-500/30">
                          ℹ
                        </span>
                      </button>
                    </td>

                    {/* Subject */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isAnalisi
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      }`}>
                        {topic.materia}
                      </span>
                    </td>

                    {/* Chapter & Topic */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenTopicDetail && onOpenTopicDetail(topic)}
                          className="font-semibold text-slate-200 hover:text-cyan-300 transition text-xs text-left group/title"
                          title="Apri scheda informativa dettagliata"
                        >
                          <span className="group-hover/title:underline">{topic.argomento}</span>
                        </button>
                        {!isDone && effHours > 0 && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex-shrink-0">
                            In Corso
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Capitolo: <span className="text-slate-300">{topic.capitolo}</span>
                        {topic.fonti && <span className="text-slate-500"> • {topic.fonti}</span>}
                      </div>
                    </td>

                    {/* Hours (Spese / Stimate) */}
                    <td className="py-3 px-3 text-center">
                      <div className="font-mono font-bold text-xs">
                        <span className="text-cyan-400">{effHours.toFixed(1)}h</span>
                        <span className="text-slate-400"> / {topic.oreStimate}h</span>
                      </div>
                      {!isDone && (
                        <div className="text-[10px] text-amber-400/90 font-mono">
                          Residue: {Number(topic.oreResidue !== undefined ? topic.oreResidue : Math.max(0, (topic.oreStimate || 2.0) - effHours)).toFixed(1)}h
                        </div>
                      )}
                      {hasBuffer && (
                        <span className="text-[9px] text-amber-500/80 font-mono block">
                          +20% buffer
                        </span>
                      )}
                      {onUpdateTopicHours && (
                        <div className="mt-1 flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => onUpdateTopicHours(topic.id, 0.5, true)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono border border-slate-700"
                            title="Aggiungi 30m"
                          >
                            +30m
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateTopicHours(topic.id, 1.0, true)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[10px] font-mono border border-slate-700"
                            title="Aggiungi 1h"
                          >
                            +1h
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono font-bold">
                        {topic.difficolta}/5
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold ${
                        topic.prioritaEsame >= 4
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {topic.prioritaEsame}/5
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// --- src/components/FileImporter.js ---






function FileImporter({
  topics,
  settings,
  customDayCapacities = {},
  onCustomCapacitiesUpdated,
  onTopicsUpdated,
  onSettingsUpdated,
  studySessions = [],
  onStudySessionsUpdated,
  fsSyncStatus,
  onConnectFileSystem,
  onDisconnectFileSystem,
  onTriggerManualSave,
  gitlabConfig = {},
  onUpdateGitLabConfig,
  onGitLabPull,
  onGitLabPush
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isFsAccessSupported = typeof window !== "undefined" && "showOpenFilePicker" in window;

  // GitLab Cloud Sync Form State
  const [glInstanceUrl, setGlInstanceUrl] = useState(gitlabConfig?.instanceUrl || "https://gitlab.com");
  const [glProjectId, setGlProjectId] = useState(gitlabConfig?.projectId || "");
  const [glBranch, setGlBranch] = useState(gitlabConfig?.branch || "main");
  const [glFilePath, setGlFilePath] = useState(gitlabConfig?.filePath || "data/studiplanner-state.json");
  const [glToken, setGlToken] = useState(gitlabConfig?.token || "");
  const [glAutoSync, setGlAutoSync] = useState(gitlabConfig?.autoSync !== undefined ? gitlabConfig.autoSync : true);
  const [glTesting, setGlTesting] = useState(false);
  const [glTestResult, setGlTestResult] = useState(null);
  const [glPulling, setGlPulling] = useState(false);
  const [glPushing, setGlPushing] = useState(false);

  const handleSaveGitLabConfig = (enabledState = null) => {
    const isEnabled = enabledState !== null ? enabledState : (gitlabConfig?.enabled || false);
    const updated = {
      ...gitlabConfig,
      enabled: isEnabled,
      instanceUrl: glInstanceUrl,
      projectId: glProjectId,
      branch: glBranch,
      filePath: glFilePath,
      token: glToken,
      autoSync: glAutoSync
    };
    if (onUpdateGitLabConfig) onUpdateGitLabConfig(updated);
    setNotification({
      type: "success",
      message: isEnabled
        ? "Configurazione GitLab salvata! Sincronizzazione automatica attiva."
        : "Configurazione GitLab aggiornata."
    });
  };

  const handleTestConnection = async () => {
    setGlTesting(true);
    setGlTestResult(null);
    try {
      const res = await testGitLabConnection({
        instanceUrl: glInstanceUrl,
        projectId: glProjectId,
        token: glToken
      });
      setGlTestResult({
        success: true,
        message: `✓ Connesso con successo a "${res.projectName}"! Ramo: ${res.defaultBranch}`
      });
      // Save configuration on successful test
      handleSaveGitLabConfig(true);
    } catch (err) {
      setGlTestResult({
        success: false,
        message: `Errore: ${err.message}`
      });
    } finally {
      setGlTesting(false);
    }
  };

  const handleManualPull = async () => {
    setGlPulling(true);
    setNotification(null);
    try {
      if (onGitLabPull) {
        const res = await onGitLabPull();
        setNotification({
          type: "success",
          message: res?.message || "Stato scaricato e applicato con successo da GitLab!"
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: `Errore durante il download da GitLab: ${err.message}`
      });
    } finally {
      setGlPulling(false);
    }
  };

  const handleManualPush = async () => {
    setGlPushing(true);
    setNotification(null);
    try {
      if (onGitLabPush) {
        const res = await onGitLabPush("Salvataggio manuale da StudiPlanner");
        setNotification({
          type: "success",
          message: res?.message || "Stato inviato su GitLab con successo!"
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: `Errore durante l'invio su GitLab: ${err.message}`
      });
    } finally {
      setGlPushing(false);
    }
  };

  // Handle transparent File System Access connection
  const handleConnectFileClick = async () => {
    if (!onConnectFileSystem) {
      setNotification({
        type: "error",
        message: "Gestore sincronizzazione File System non configurato."
      });
      return;
    }
    setIsProcessing(true);
    setNotification(null);
    try {
      const res = await onConnectFileSystem();
      if (res && res.fileName) {
        setNotification({
          type: "success",
          message: `Sincronizzazione attiva con "${res.fileName}"! ${res.imported ? "Dati importati dal file." : "Stato attuale salvato nel file."} Ogni modifica verrà riscritta automaticamente.`
        });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setNotification({
          type: "error",
          message: `Errore durante il collegamento file: ${err.message}`
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Process a selected or dropped file
  const handleFile = async (file) => {
    if (!file) return;
    setIsProcessing(true);
    setNotification(null);

    try {
      const fileName = file.name;
      const lowerName = fileName.toLowerCase();

      if (lowerName.endsWith(".json")) {
        // Restore JSON backup
        const text = await file.text();
        const backup = JSON.parse(text);
        if (backup.topics && Array.isArray(backup.topics)) {
          onTopicsUpdated(backup.topics);
          if (backup.settings && onSettingsUpdated) {
            onSettingsUpdated(backup.settings);
          }
          if (backup.customDayCapacities && onCustomCapacitiesUpdated) {
            onCustomCapacitiesUpdated(backup.customDayCapacities);
          }
          if (backup.studySessions && Array.isArray(backup.studySessions) && onStudySessionsUpdated) {
            onStudySessionsUpdated(backup.studySessions);
          }
          setNotification({
            type: "success",
            message: `Backup JSON "${fileName}" ripristinato con successo!`
          });
        } else {
          throw new Error("Formato del file di backup JSON non valido.");
        }
      } else if (lowerName.endsWith(".csv") || lowerName.endsWith(".txt")) {
        // Read text as CSV
        const text = await file.text();
        const parsed = parseCSVString(text, fileName);

        if (parsed.length === 0) {
          throw new Error("Nessuna riga valida trovata nel file CSV/TXT.");
        }

        // Merge with existing topics: if IDs already exist, update them; else append
        const existingMap = new Map(topics.map(t => [t.id.toUpperCase(), t]));
        let newCount = 0;
        let updatedCount = 0;

        parsed.forEach(p => {
          const key = p.id.toUpperCase();
          if (existingMap.has(key)) {
            existingMap.set(key, { ...existingMap.get(key), ...p });
            updatedCount++;
          } else {
            existingMap.set(key, p);
            newCount++;
          }
        });

        const mergedList = Array.from(existingMap.values());
        onTopicsUpdated(mergedList);

        setNotification({
          type: "success",
          message: `File CSV "${fileName}" caricato con successo! Aggiunti ${newCount} nuovi argomenti, aggiornati ${updatedCount}.`
        });
      } else if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".ods") || lowerName.endsWith(".xls")) {
        // Read binary as Excel / ODS
        const arrayBuffer = await file.arrayBuffer();
        const excelData = parseExcelData(arrayBuffer, fileName);

        // Merge completion status with existing topics
        const { topics: mergedTopics, matchedCount } = mergeTopicsWithExcelData(topics, excelData);
        onTopicsUpdated(mergedTopics);

        setNotification({
          type: "success",
          message: `File Excel "${fileName}" sincronizzato! Rilevati ${excelData.completedIds.size} ID completati e sincronizzati ${matchedCount} argomenti nel piano.`
        });
      } else {
        throw new Error("Formato non supportato. Carica un file .csv, .txt, .xlsx, .ods o .json.");
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: `Errore durante il parsing: ${err.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Reset to default repo UNIMORE dataset
  const handleResetToDefault = () => {
    onTopicsUpdated(INITIAL_TOPICS);
    setNotification({
      type: "success",
      message: "Dataset originale UNIMORE ricaricato in memoria (63 argomenti: 32 Analisi 1 + 31 Geometria)."
    });
  };

  // Export updated study plan as Excel (.xlsx)
  const handleExportExcel = () => {
    if (typeof XLSX === "undefined") {
      alert("Libreria SheetJS (XLSX) non caricata.");
      return;
    }

    const dataToExport = topics.map(t => ({
      ID: t.id,
      Materia: t.materia,
      Capitolo: t.capitolo || "",
      Argomento: t.argomento,
      "Ore Stimate": t.oreStimate,
      "Ore Effettive (con buffer)": t.effectiveHours || t.oreStimate,
      Difficoltà: t.difficolta,
      Priorità: t.prioritaEsame,
      Stato: t.isCompleted ? "Completato" : "Da fare",
      "Data Completamento": t.completedDate || "",
      "Giorno Assegnato": t.assignedDayName || "",
      "Data Assegnata": t.assignedDate || "",
      "Settimana": t.assignedWeek || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Piano Ribilanciato");

    XLSX.writeFile(workbook, "Piano_Studi_Ribilanciato_UNIMORE.xlsx");
  };

  // Download complete JSON Backup
  const handleExportJsonBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      settings,
      topics,
      customDayCapacities,
      studySessions
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Backup_StudyPlan_UNIMORE_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* File System Access API Transparent Auto-Sync Box */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-5 md:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className={`p-3 rounded-2xl flex-shrink-0 border ${
              fsSyncStatus?.active
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
            }`}>
              <IconFileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Sincronizzazione Trasparente File System
                </h3>
                {fsSyncStatus?.active ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-pulse-subtle">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    ATTIVA
                  </span>
                ) : (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Non collegato
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Collega direttamente un file JSON salvato su <strong>iCloud Drive</strong>, <strong>Google Drive</strong> o sul tuo computer tramite la <em>File System Access API</em>. L'app sovrascriverà automaticamente il file ad ogni modifica, eliminando la necessità di scaricare backup manuali!
              </p>

              {fsSyncStatus?.active && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-cyan-300">
                    📁 File: <strong>{fsSyncStatus.fileName}</strong>
                  </span>
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-emerald-400">
                    ✓ Ultimo salvataggio: {fsSyncStatus.lastSaved || "In attesa..."}
                  </span>
                  {fsSyncStatus.isSaving && (
                    <span className="text-cyan-400 animate-pulse text-[11px]">
                      Scrittura su disco in corso...
                    </span>
                  )}
                  {fsSyncStatus.error && (
                    <span className="text-rose-400 text-[11px]">
                      ⚠️ {fsSyncStatus.error}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center flex-shrink-0">
            {fsSyncStatus?.active ? (
              <>
                <button
                  type="button"
                  onClick={onTriggerManualSave}
                  className="px-3.5 py-2 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <IconSave className="w-4 h-4" />
                  Salva Ora su File
                </button>
                <button
                  type="button"
                  onClick={onDisconnectFileSystem}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Disconnetti
                </button>
              </>
            ) : isFsAccessSupported ? (
              <button
                type="button"
                onClick={handleConnectFileClick}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-950/50 flex items-center gap-2"
              >
                <IconFileCheck className="w-4 h-4" />
                <span>Collega File JSON (iCloud / Drive)</span>
              </button>
            ) : (
              <div className="text-[11px] text-amber-300/80 bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl max-w-xs">
                La File System Access API non è supportata da questo browser (usa Chrome, Edge o Opera per l'auto-sync trasparente).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GitLab Cloud Synchronization Card */}
      <div className="bg-gradient-to-r from-slate-900/90 via-orange-950/20 to-slate-900/90 border border-orange-500/30 rounded-3xl p-5 md:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className={`p-3 rounded-2xl flex-shrink-0 border ${
              gitlabConfig?.enabled
                ? "bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-lg shadow-orange-500/20"
                : "bg-slate-800/60 text-slate-400 border-slate-700"
            }`}>
              <IconGitLab className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Sincronizzazione Cloud GitLab (Multi-Dispositivo)</span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    REST API v4
                  </span>
                </h3>
                {gitlabConfig?.enabled ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    ATTIVA
                  </span>
                ) : (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Disattivata
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Sincronizza in automatico tutto il piano di studi (sessioni, ore e date) su un tuo repository privato GitLab. I dati saranno sempre allineati tra computer di casa, portatile, tablet e smartphone con <strong>zero server intermedi</strong>.
              </p>

              {gitlabConfig?.enabled && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-orange-300">
                    🦊 Repo: <strong>{gitlabConfig.projectId}</strong>
                  </span>
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-cyan-300">
                    🌿 Ramo: <strong>{gitlabConfig.branch || "main"}</strong>
                  </span>
                  <span className="bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-emerald-400">
                    ✓ Ultimo Sync: {gitlabConfig.lastSynced || "In attesa..."}
                  </span>
                  {gitlabConfig.syncStatus === "syncing" && (
                    <span className="text-orange-400 animate-pulse text-[11px] font-mono">
                      Sincronizzazione in corso...
                    </span>
                  )}
                  {gitlabConfig.errorMessage && (
                    <span className="text-rose-400 text-[11px] font-mono">
                      ⚠️ {gitlabConfig.errorMessage}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              type="button"
              onClick={() => handleSaveGitLabConfig(!gitlabConfig?.enabled)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                gitlabConfig?.enabled
                  ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30"
                  : "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white border-orange-400/30 shadow-lg shadow-orange-950/30"
              }`}
            >
              {gitlabConfig?.enabled ? "Disattiva GitLab Sync" : "Abilita GitLab Sync"}
            </button>
          </div>
        </div>

        {/* Configuration inputs & controls */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Istanza GitLab:
              </label>
              <input
                type="text"
                value={glInstanceUrl}
                onChange={(e) => setGlInstanceUrl(e.target.value)}
                placeholder="https://gitlab.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Project Path o ID numerico:
              </label>
              <input
                type="text"
                value={glProjectId}
                onChange={(e) => setGlProjectId(e.target.value)}
                placeholder="username/studiplanner-data"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Ramo (Branch):
              </label>
              <input
                type="text"
                value={glBranch}
                onChange={(e) => setGlBranch(e.target.value)}
                placeholder="main"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Percorso File nel Repo:
              </label>
              <input
                type="text"
                value={glFilePath}
                onChange={(e) => setGlFilePath(e.target.value)}
                placeholder="data/studiplanner-state.json"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1 flex items-center justify-between">
                <span>Personal Access Token (GitLab):</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Permessi richiesti: <code>api</code> oppure <code>read_repository, write_repository</code>
                </span>
              </label>
              <input
                type="password"
                value={glToken}
                onChange={(e) => setGlToken(e.target.value)}
                placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={glTesting || !glProjectId || !glToken}
                className="flex-1 py-2 px-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                {glTesting ? "Verifica in corso..." : "🧪 Testa Connessione"}
              </button>
              <button
                type="button"
                onClick={() => handleSaveGitLabConfig()}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
              >
                Salva
              </button>
            </div>
          </div>

          {glTestResult && (
            <div className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
              glTestResult.success
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
            }`}>
              <span>{glTestResult.message}</span>
            </div>
          )}

          {/* Manual Pull & Push Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={glAutoSync}
                onChange={(e) => {
                  setGlAutoSync(e.target.checked);
                  handleSaveGitLabConfig();
                }}
                className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
              />
              <span className="text-slate-300 font-medium">
                Sincronizzazione Automatica Continua (Auto-Pull all'apertura + Auto-Commit ad ogni sessione/modifica)
              </span>
            </label>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleManualPull}
                disabled={glPulling || !gitlabConfig?.token}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl font-bold transition flex items-center gap-1 disabled:opacity-40"
                title="Scarica i dati più recenti dal repository GitLab"
              >
                <span>{glPulling ? "Scaricamento..." : "⬇ Pull da GitLab"}</span>
              </button>
              <button
                type="button"
                onClick={handleManualPush}
                disabled={glPushing || !gitlabConfig?.token}
                className="px-3 py-1.5 bg-orange-600/30 hover:bg-orange-600/40 text-orange-200 border border-orange-500/40 rounded-xl font-bold transition flex items-center gap-1 disabled:opacity-40"
                title="Invia lo stato attuale come nuovo commit su GitLab"
              >
                <span>{glPushing ? "Invio in corso..." : "⬆ Push su GitLab"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Persistence Status Box */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <IconSave className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-300">
              Salvataggio Dati Automatico Attivo
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ogni modifica (completamento argomenti, ribilanciamento, date, impostazioni) è memorizzata in tempo reale nel tuo browser (<strong>LocalStorage</strong>). Non perderai nulla ricaricando o chiudendo la pagina.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportJsonBackup}
          className="text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 flex-shrink-0"
        >
          <IconDownload className="w-3.5 h-3.5" />
          Scarica Backup JSON
        </button>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition backdrop-blur-md relative overflow-hidden ${
          isDragging
            ? "border-cyan-400 bg-cyan-950/30 scale-[1.01]"
            : "border-slate-700/80 bg-slate-900/60 hover:border-slate-600"
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl flex items-center justify-center">
            <IconUpload className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              Carica file di studio o backup
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Trascina qui i file <strong>CSV</strong>, i file <strong>Excel / ODS</strong> o un <strong>Backup JSON</strong>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-950/40 inline-flex items-center gap-2">
              <IconUpload className="w-4 h-4" />
              <span>Seleziona File (CSV, Excel, Backup JSON)</span>
              <input
                type="file"
                accept=".csv,.txt,.xlsx,.ods,.xls,.json"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleResetToDefault}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition inline-flex items-center gap-2"
            >
              <IconRefresh className="w-4 h-4 text-cyan-400" />
              <span>Carica Dataset Ufficiale UNIMORE</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-emerald-500/30 transition inline-flex items-center gap-2"
            >
              <IconDownload className="w-4 h-4 text-emerald-400" />
              <span>Esporta Excel (.xlsx)</span>
            </button>
          </div>

          {isProcessing && (
            <div className="text-xs text-cyan-400 font-medium animate-pulse mt-2">
              Elaborazione del file in corso lato client...
            </div>
          )}
        </div>
      </div>

      {/* Notification banner */}
      {notification && (
        <div className={`p-4 rounded-2xl text-xs md:text-sm font-medium border flex items-center justify-between ${
          notification.type === "success"
            ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
            : "bg-rose-950/50 border-rose-500/40 text-rose-200"
        }`}>
          <div className="flex items-center space-x-2">
            <IconCheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 ml-2"
          >
            Chiudi
          </button>
        </div>
      )}

      {/* Summary of Local Workspace Files */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <IconBookOpen className="w-4 h-4 text-cyan-400" />
          File UNIMORE supportati e compatibili
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="font-bold text-emerald-300 mb-1">1. Geometria.txt / Geometria.csv</div>
            <p className="text-slate-400">
              CSV contenente ID, Capitolo, Argomenti, Ore_Stimate, Difficoltà e Priorità (G-01 a G-31).
            </p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="font-bold text-cyan-300 mb-1">2. Analisi.csv / Analisi.txt</div>
            <p className="text-slate-400">
              CSV dei 32 slot ufficiali del corso di Analisi Matematica 1 (A-01 a A-32) con syllabus completo.
            </p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="font-bold text-indigo-300 mb-1">3. Excel / ODS Tracker</div>
            <p className="text-slate-400">
              Fogli <code>Tracker Analisi 1</code>, <code>Tracker Geometria</code> e <code>Teoremi</code> con colonna <code>Stato</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- src/components/SettingsModal.js ---




function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  customDayCapacities = {},
  onResetDayCapacities
}) {
  const [formData, setFormData] = useState({
    ...settings,
    eveningStudyHours: settings.eveningStudyHours !== undefined ? settings.eveningStudyHours : (settings.weekdayStudyHours || 2.5),
    weekdayStudyHours: settings.weekdayStudyHours !== undefined ? settings.weekdayStudyHours : (settings.eveningStudyHours || 2.5),
    weekendStudyHours: settings.weekendStudyHours !== undefined ? settings.weekendStudyHours : 4.5,
    criticalWeeklyHoursThreshold: settings.criticalWeeklyHoursThreshold || 25.0
  });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: val
      };

      if (field === "eveningStudyHours") {
        updated.weekdayStudyHours = Number(val);
      }

      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const evening = Number(formData.eveningStudyHours || 2.5);
    const toSave = {
      ...formData,
      weekdayStudyHours: evening,
      eveningStudyHours: evening
    };
    onSaveSettings(toSave);
    onClose();
  };

  const currentWeekday = Number(formData.eveningStudyHours || 2.5);
  const currentWeekend = Number(formData.weekendStudyHours || 4.5);
  const nominalWeeklyCapacity = Number(((currentWeekday * 5) + (currentWeekend * 2)).toFixed(1));
  const customOverridesCount = Object.keys(customDayCapacities || {}).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl p-6 shadow-2xl shadow-cyan-950/40 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <IconSettings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Parametri di Ribilanciamento</h3>
              <p className="text-xs text-slate-400">Personalizza orari di studio, slot e date d'esame</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Target Exam Date & Today Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Data Esame (Target)
              </label>
              <input
                type="date"
                value={formData.targetExamDate}
                onChange={(e) => handleChange("targetExamDate", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  Data Odierna (Simulata)
                </label>
                <button
                  type="button"
                  onClick={() => handleChange("currentSimulatedDate", getLocalTodayDateStr())}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-mono"
                  title="Reimposta sulla data reale odierna del computer"
                >
                  Usa Oggi Reale
                </button>
              </div>
              <input
                type="date"
                value={formData.currentSimulatedDate}
                onChange={(e) => handleChange("currentSimulatedDate", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Work and Study Slots */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <div className="flex items-center space-x-2">
                <IconBriefcase className="w-4 h-4" />
                <span>Orari Base & Gestione Flessibile Slot Extra</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                Feriale base: {currentWeekday}h/gg
              </span>
            </div>

            {/* Flexible Extra Slots Info Card */}
            <div className="p-3 bg-gradient-to-r from-slate-900/90 to-cyan-950/30 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                  <IconSun className="w-4 h-4 text-amber-400" />
                  Gestione Flessibile Slot Extra (Time Shifter)
                </span>
                {customOverridesCount > 0 ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {customOverridesCount} date personalizzate
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-slate-400">Dinamico nel To-Do</span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Gli slot extra non sono più rigidi o vincolati al solo pomeriggio. Nella scheda <strong>To-Do Settimanale</strong> puoi usare i controlli <strong>[- 30m]</strong> e <strong>[+ 30m]</strong> nell'header di ogni giorno per modellare al volo il budget in base ai tuoi imprevisti lavorativi!
              </p>
              {customOverridesCount > 0 && onResetDayCapacities && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Ripristinare le capacità standard per tutti i ${customOverridesCount} giorni personalizzati?`)) {
                        onResetDayCapacities();
                      }
                    }}
                    className="text-[11px] text-rose-300 hover:text-rose-200 underline"
                  >
                    Ripristina tutti i giorni ai default standard
                  </button>
                </div>
              )}
            </div>

            {/* Baseline Evening & Weekend Slots */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px]">
                  <IconMoon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sera Feriale (19:30 - 22:00)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="6"
                    value={formData.eveningStudyHours}
                    onChange={(e) => handleChange("eveningStudyHours", parseFloat(e.target.value) || 2.5)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/sera</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px]">
                  <IconClock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Weekend (Sab - Dom)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={formData.weekendStudyHours}
                    onChange={(e) => handleChange("weekendStudyHours", parseFloat(e.target.value) || 4.5)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/gg</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-xl flex items-center justify-between">
              <span>Capacità nominale standard settimanale:</span>
              <strong className="text-cyan-300 font-mono">{nominalWeeklyCapacity}h / settimana</strong>
            </div>
          </div>

          {/* Critical Threshold & Buffer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <IconFlame className="w-3.5 h-3.5 text-rose-400" />
                Soglia Burnout Critica
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="45"
                  value={formData.criticalWeeklyHoursThreshold}
                  onChange={(e) => handleChange("criticalWeeklyHoursThreshold", parseFloat(e.target.value) || 25)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
                <span className="text-slate-500 font-mono">h/sett.</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Consigliata a 25h/sett. per serale puro, o 35h se impieghi regolarmente slot extra
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Buffer Alta Priorità/Difficoltà
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="5"
                  min="0"
                  max="50"
                  value={Math.round((formData.bufferMultiplier - 1) * 100)}
                  onChange={(e) => {
                    const pct = parseFloat(e.target.value) || 20;
                    handleChange("bufferMultiplier", 1 + pct / 100);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-500 font-mono">%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Tempo extra allocato (+20%)</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition font-medium"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-cyan-950/40"
            >
              Salva e Ricalcola
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// --- src/components/LogStudyModal.js ---



function LogStudyModal({
  isOpen,
  onClose,
  topics = [],
  settings = {},
  initialData = {},
  onSaveSession,
  studySessions = [],
  onDeleteSession
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("new"); // "new" | "recent"
  const [selectedDate, setSelectedDate] = useState(() => {
    return initialData.date || settings.currentSimulatedDate || "2026-11-18";
  });
  const [selectedSubject, setSelectedSubject] = useState("all"); // "all" | "analisi" | "geometria"
  const [statusFilter, setStatusFilter] = useState("all"); // "uncompleted" | "all"
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTopicId, setSelectedTopicId] = useState(() => {
    if (initialData.topicId) return initialData.topicId;
    // Default to the first uncompleted topic
    const firstUncompleted = topics.find(t => !(t.completato !== undefined ? t.completato : t.isCompleted));
    return firstUncompleted ? firstUncompleted.id : (topics[0]?.id || "A-01");
  });

  const [hours, setHours] = useState(() => {
    if (initialData.hours !== undefined && initialData.hours !== null) {
      return Number(initialData.hours);
    }
    return 2.0;
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [hasManuallyToggledComplete, setHasManuallyToggledComplete] = useState(false);
  const [note, setNote] = useState("");
  const [notification, setNotification] = useState(null);

  // Sync initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData.date) {
      setSelectedDate(initialData.date);
    } else if (settings.currentSimulatedDate) {
      setSelectedDate(settings.currentSimulatedDate);
    }

    if (initialData.topicId) {
      setSelectedTopicId(initialData.topicId);
      const t = topics.find(item => item.id === initialData.topicId);
      if (t) {
        if (t.materia.toLowerCase().includes("analisi")) {
          setSelectedSubject("analisi");
        } else if (t.materia.toLowerCase().includes("geometria")) {
          setSelectedSubject("geometria");
        }
        const est = Number(t.oreStimate || 2.0);
        const eff = Number(t.oreEffettive || 0);
        const residue = Math.max(0, Number((est - eff).toFixed(2)));
        if (initialData.hours !== undefined) {
          setHours(Number(initialData.hours));
        } else if (residue > 0) {
          setHours(residue);
        } else {
          setHours(est);
        }
      }
    }

    setHasManuallyToggledComplete(false);
    setNotification(null);
  }, [initialData, settings.currentSimulatedDate, topics]);

  // Current selected topic reference
  const currentTopic = useMemo(() => {
    return topics.find(t => t.id === selectedTopicId) || topics[0] || null;
  }, [topics, selectedTopicId]);

  // Filtered topics list for selection
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
      if (statusFilter === "uncompleted" && isDone) return false;

      // Subject filter
      if (selectedSubject === "analisi" && !t.materia.toLowerCase().includes("analisi")) return false;
      if (selectedSubject === "geometria" && !t.materia.toLowerCase().includes("geometria")) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mId = t.id.toLowerCase().includes(q);
        const mArg = t.argomento.toLowerCase().includes(q);
        const mCap = (t.capitolo || "").toLowerCase().includes(q);
        if (!mId && !mArg && !mCap) return false;
      }

      return true;
    });
  }, [topics, statusFilter, selectedSubject, searchQuery]);

  // CRITICAL FIX: Prevent topic desync when user filters by subject or searches!
  // If the currently selected topic is no longer present in filteredTopics, auto-select the first matching topic.
  useEffect(() => {
    if (filteredTopics.length > 0) {
      const isStillInList = filteredTopics.some(t => t.id === selectedTopicId);
      if (!isStillInList) {
        const target = filteredTopics[0];
        setSelectedTopicId(target.id);
        const est = Number(target.oreStimate || 2.0);
        const eff = Number(target.oreEffettive || 0);
        const residue = Math.max(0, Number((est - eff).toFixed(2)));
        setHours(residue > 0 ? residue : est);
        setHasManuallyToggledComplete(false);
      }
    }
  }, [filteredTopics, selectedTopicId]);

  // Select topic handler
  const handleSelectTopic = (topic) => {
    if (!topic) return;
    setSelectedTopicId(topic.id);
    const est = Number(topic.oreStimate || 2.0);
    const eff = Number(topic.oreEffettive || 0);
    const residue = Math.max(0, Number((est - eff).toFixed(2)));
    setHours(residue > 0 ? residue : est);
    setHasManuallyToggledComplete(false);
  };

  // Change subject filter and auto-pick corresponding topic if needed
  const handleFilterSubject = (subj) => {
    setSelectedSubject(subj);
    // If current topic does not belong to new subject, pick first topic of that subject
    if (subj === "analisi" && (!currentTopic || !currentTopic.materia.toLowerCase().includes("analisi"))) {
      const firstAnalisi = topics.find(t => t.materia.toLowerCase().includes("analisi") && !t.completato);
      if (firstAnalisi) handleSelectTopic(firstAnalisi);
    } else if (subj === "geometria" && (!currentTopic || !currentTopic.materia.toLowerCase().includes("geometria"))) {
      const firstGeom = topics.find(t => t.materia.toLowerCase().includes("geometria") && !t.completato);
      if (firstGeom) handleSelectTopic(firstGeom);
    }
  };

  // Auto-suggest completion when hours are entered unless user manually toggled
  useEffect(() => {
    if (!currentTopic || hasManuallyToggledComplete) return;

    const est = Number(currentTopic.oreStimate || 2.0);
    const eff = Number(currentTopic.oreEffettive || 0);
    const totalAfter = eff + Number(hours || 0);

    // If accumulated hours reach or exceed estimate, suggest completion
    if (totalAfter >= est * 0.95) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [currentTopic, hours, hasManuallyToggledComplete]);

  // Next topic in sequential order (for previewing auto-adapt)
  const nextSequentialTopic = useMemo(() => {
    if (!currentTopic) return null;
    const isAnalisi = currentTopic.materia.toLowerCase().includes("analisi");
    const sameSubject = topics.filter(t => isAnalisi ? t.materia.toLowerCase().includes("analisi") : t.materia.toLowerCase().includes("geometria"));
    const currentIndex = sameSubject.findIndex(t => t.id === currentTopic.id);
    if (currentIndex >= 0 && currentIndex < sameSubject.length - 1) {
      return sameSubject[currentIndex + 1];
    }
    return null;
  }, [topics, currentTopic]);

  const handleAdjustHours = (delta) => {
    setHours(prev => Math.max(0.25, Number((prev + delta).toFixed(2))));
  };

  const handleSetExactResidue = () => {
    if (!currentTopic) return;
    const est = Number(currentTopic.oreStimate || 2.0);
    const eff = Number(currentTopic.oreEffettive || 0);
    const residue = Math.max(0.5, Number((est - eff).toFixed(2)));
    setHours(residue);
  };

  const handleQuickDate = (target) => {
    if (target === "today") {
      setSelectedDate(settings.currentSimulatedDate || new Date().toISOString().split("T")[0]);
    } else if (target === "yesterday") {
      const cur = new Date(settings.currentSimulatedDate || new Date());
      cur.setDate(cur.getDate() - 1);
      setSelectedDate(cur.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTopicId || !selectedDate || hours <= 0) {
      setNotification({ type: "error", message: "Compila tutti i campi obbligatori (argomento, data e ore > 0)." });
      return;
    }

    if (onSaveSession) {
      onSaveSession({
        topicId: selectedTopicId,
        date: selectedDate,
        hours: Number(hours),
        completed: Boolean(isCompleted),
        note: note.trim()
      });
    }

    setNotification({
      type: "success",
      message: `✓ Registrate ${hours}h su ${selectedTopicId} in data ${formatDateDisplay(selectedDate)}! Il piano si è aggiornato.`
    });

    setTimeout(() => {
      onClose();
    }, 600);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const isCurrentAnalisi = currentTopic ? currentTopic.materia.toLowerCase().includes("analisi") : true;
  const oreStimate = Number(currentTopic?.oreStimate || 2.0);
  const oreGiaSvolte = Number(currentTopic?.oreEffettive || 0);
  const oreTotaliPost = Number((oreGiaSvolte + Number(hours || 0)).toFixed(2));
  const residuoPost = Math.max(0, Number((oreStimate - oreTotaliPost).toFixed(2)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b101d] border border-slate-800 rounded-3xl w-full max-w-2xl 2xl:max-w-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-950/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
              +
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Registra Sessione di Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Ribilanciamento Dinamico
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Indica il giorno, l'argomento e le ore svolte: il piano si adatta in tempo reale!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Chiudi finestra"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Nuova sessione vs Ultime registrazioni */}
        <div className="flex items-center justify-between px-5 pt-2.5 border-b border-slate-800/60 bg-slate-950/40 text-xs">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`pb-2.5 px-3 font-bold border-b-2 transition ${
                activeTab === "new"
                  ? "border-emerald-400 text-emerald-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              + Nuova Registrazione
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`pb-2.5 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "recent"
                  ? "border-emerald-400 text-emerald-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Ultime Sessioni</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                {studySessions.length}
              </span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-cyan-400">
            Oggi: {formatDateDisplay(settings.currentSimulatedDate)}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {notification && (
            <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
            }`}>
              <IconCheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{notification.message}</span>
            </div>
          )}

          {activeTab === "recent" ? (
            /* Recent Sessions List */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Storico delle sessioni registrate:</span>
                <span className="font-mono">{studySessions.length} sessioni</span>
              </div>

              {studySessions.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 border border-slate-800/80 rounded-2xl text-slate-400 text-xs">
                  Nessuna sessione registrata finora. Registra la tua prima sessione con il tab "+ Nuova Registrazione"!
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {studySessions.map((sess) => {
                    const topic = topics.find(t => t.id === sess.topicId);
                    const isAnalisi = topic ? topic.materia.toLowerCase().includes("analisi") : true;

                    return (
                      <div
                        key={sess.id}
                        className="p-3.5 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-700 transition"
                      >
                        <div className="flex items-start space-x-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono ${
                            isAnalisi
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}>
                            {sess.topicId}
                          </span>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white font-mono">
                                {formatDateDisplay(sess.date)}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="font-bold text-cyan-300 font-mono">
                                +{sess.hours}h
                              </span>
                              {sess.completed && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                                  ✓ Completato
                                </span>
                              )}
                            </div>

                            <p className="text-slate-300 font-medium mt-0.5 truncate max-w-sm">
                              {topic ? topic.argomento : sess.topicId}
                            </p>

                            {sess.note && (
                              <p className="text-slate-400 text-[11px] italic mt-0.5">
                                "{sess.note}"
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Eliminare la sessione di ${sess.hours}h su ${sess.topicId} del ${formatDateDisplay(sess.date)}? Le ore e lo stato verranno ripristinati.`)) {
                              onDeleteSession && onDeleteSession(sess.id);
                            }
                          }}
                          className="self-end sm:self-center p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                          title="Elimina questa sessione (ripristina ore)"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Form to Log New Study Session */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Data di Studio */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-4 space-y-2">
                <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <IconCalendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>1. Data della Sessione di Studio:</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Oggi: <strong className="text-cyan-300 font-mono">{formatDateDisplay(settings.currentSimulatedDate)}</strong>
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={settings.roadmapStartDate || "2026-11-16"}
                    max={settings.targetExamDate || "2027-01-10"}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 transition shadow-inner"
                  />

                  {/* Quick Date Chips */}
                  <button
                    type="button"
                    onClick={() => handleQuickDate("today")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      selectedDate === settings.currentSimulatedDate
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    ★ Oggi
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDate("yesterday")}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium border bg-slate-900 text-slate-400 border-slate-800 hover:text-white transition"
                  >
                    ◀ Ieri
                  </button>
                </div>
              </div>

              {/* 2. Selezione Visiva dell'Argomento */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <IconBookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>2. Quale argomento hai studiato?</span>
                  </label>

                  {/* Subject filter tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleFilterSubject("all")}
                        className={`px-2.5 py-1 rounded-lg transition font-medium ${
                          selectedSubject === "all" ? "bg-slate-800 text-white font-bold shadow" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Tutte ({topics.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFilterSubject("analisi")}
                        className={`px-2.5 py-1 rounded-lg transition font-medium ${
                          selectedSubject === "analisi" ? "bg-emerald-600/30 text-emerald-300 font-bold shadow" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Analisi 1 (32)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFilterSubject("geometria")}
                        className={`px-2.5 py-1 rounded-lg transition font-medium ${
                          selectedSubject === "geometria" ? "bg-indigo-600/30 text-indigo-300 font-bold shadow" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Geometria (31)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStatusFilter(prev => prev === "uncompleted" ? "all" : "uncompleted")}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono border transition ${
                        statusFilter === "uncompleted"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                      title="Mostra solo argomenti da completare"
                    >
                      {statusFilter === "uncompleted" ? "Da Svolgere" : "Tutti gli stati"}
                    </button>
                  </div>
                </div>

                {/* Search Bar for instantaneous lookup */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <IconSearch className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca per ID (es. G-01, A-09) o parole chiave (es. matrici, integrali, autovalori)..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs"
                      title="Cancella ricerca"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* CURRENT SELECTED TOPIC HERO CARD */}
                {currentTopic && (
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrentAnalisi
                      ? "bg-emerald-950/20 border-emerald-500/40 shadow-sm shadow-emerald-950/20"
                      : "bg-indigo-950/20 border-indigo-500/40 shadow-sm shadow-indigo-950/20"
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isCurrentAnalisi
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}>
                          {currentTopic.materia}
                        </span>
                        <span className="font-mono font-black text-white text-sm">
                          {currentTopic.id}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          • {currentTopic.capitolo}
                        </span>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Argomento Selezionato
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {currentTopic.argomento}
                    </h3>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                      <div className="flex items-center space-x-3">
                        <span>Già svolte: <strong className="text-cyan-300">{oreGiaSvolte}h</strong></span>
                        <span>Stimate: <strong className="text-white">{oreStimate}h</strong></span>
                        <span>Residuo attuale: <strong className="text-amber-300">{Math.max(0, Number((oreStimate - oreGiaSvolte).toFixed(1)))}h</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Difficoltà: <strong className="text-cyan-400">{currentTopic.difficolta}/5</strong></span>
                        <span>Priorità: <strong className="text-amber-400">{currentTopic.prioritaEsame}/5</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCROLLABLE TOPIC PICKER LIST */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Oppure seleziona un altro argomento dall'elenco ({filteredTopics.length} disponibili):</span>
                    {filteredTopics.length > 0 && (
                      <span className="text-slate-500 text-[10px]">Fai clic su un elemento per selezionarlo</span>
                    )}
                  </div>

                  {filteredTopics.length === 0 ? (
                    <div className="p-4 text-center rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                      <p>Nessun argomento trovato con i filtri attuali.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubject("all");
                          setStatusFilter("all");
                          setSearchQuery("");
                        }}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold transition"
                      >
                        Azzera filtri di ricerca
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-48 sm:max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-800/80 rounded-2xl p-2 bg-slate-950/80 shadow-inner">
                      {filteredTopics.map((t) => {
                        const isSelected = t.id === selectedTopicId;
                        const isAnalisi = t.materia.toLowerCase().includes("analisi");
                        const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
                        const doneHours = Number(t.oreEffettive || 0);

                        return (
                          <div
                            key={t.id}
                            onClick={() => handleSelectTopic(t)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                              isSelected
                                ? isAnalisi
                                  ? "bg-emerald-950/40 border-emerald-500/80 shadow-sm shadow-emerald-500/20"
                                  : "bg-indigo-950/40 border-indigo-500/80 shadow-sm shadow-indigo-500/20"
                                : "bg-slate-900/60 hover:bg-slate-850 border-slate-800/70 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                              {/* Custom Radio Button */}
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition ${
                                isSelected
                                  ? isAnalisi
                                    ? "border-emerald-400 bg-emerald-500 text-white"
                                    : "border-indigo-400 bg-indigo-500 text-white"
                                  : "border-slate-600 bg-slate-950"
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>

                              {/* Topic ID */}
                              <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                                isAnalisi ? "bg-emerald-500/10 text-emerald-300" : "bg-indigo-500/10 text-indigo-300"
                              }`}>
                                {t.id}
                              </span>

                              {/* Topic Name */}
                              <span className={`truncate text-xs font-medium ${
                                isSelected ? "text-white font-bold" : "text-slate-300"
                              }`}>
                                {t.argomento}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0 text-[10px] font-mono">
                              <span className="text-slate-400">
                                {doneHours}h / {t.oreStimate}h
                              </span>
                              {isDone ? (
                                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                                  ✓ Fatto
                                </span>
                              ) : doneHours > 0 ? (
                                <span className="text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                                  In Corso
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Quante ore hai studiato? */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-4 space-y-2.5">
                <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>3. Quante ore hai studiato in questa sessione?</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +{hours} ore ({Math.round(hours * 60)} min)
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleAdjustHours(-0.5)}
                      disabled={hours <= 0.25}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold border border-slate-700 transition disabled:opacity-30"
                      title="Riduci di 30 minuti (-0.5h)"
                    >
                      - 30m
                    </button>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="14.0"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0.25, Number(e.target.value)))}
                      className="w-20 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdjustHours(0.5)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-500/40 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 transition active:scale-95"
                      title="Aggiungi 30 minuti (+0.5h)"
                    >
                      + 30m
                    </button>
                  </div>

                  {/* Stepper +1h */}
                  <button
                    type="button"
                    onClick={() => handleAdjustHours(1.0)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-800 transition active:scale-95"
                  >
                    + 1h
                  </button>

                  {/* Residuo esatto button */}
                  {currentTopic && Math.max(0, oreStimate - oreGiaSvolte) > 0 && (
                    <button
                      type="button"
                      onClick={handleSetExactResidue}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 transition active:scale-95"
                      title="Imposta le ore esattamente pari al residuo stimato dell'argomento"
                    >
                      Tutto il Residuo ({Math.max(0, Number((oreStimate - oreGiaSvolte).toFixed(1)))}h)
                    </button>
                  )}
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500">Preset rapidi:</span>
                  {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHours(val)}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono transition border ${
                        hours === val
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {val}h
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Completamento Argomento */}
              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="completeToggle"
                  checked={isCompleted}
                  onChange={(e) => {
                    setIsCompleted(e.target.checked);
                    setHasManuallyToggledComplete(true);
                  }}
                  className="w-4 h-4 mt-0.5 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="completeToggle" className="cursor-pointer select-none text-xs flex-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Segna questo argomento come COMPLETATO</span>
                    {isCompleted && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                        ✓ Pronto per avanzamento
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {isCompleted
                      ? "L'argomento sarà archiviato come svolto. I giorni successivi attingeranno subito dai prossimi argomenti in sequenza propedeutica!"
                      : `Studio parziale: l'argomento rimarrà in programma nei giorni successivi con ${residuoPost}h residue.`}
                  </p>
                </label>
              </div>

              {/* 5. Note facoltative */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Note di sessione (facoltativo):
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="es. Svolti esercizi sulle matrici inverse, rivedere il determinante..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
                />
              </div>

              {/* 6. Dynamic Auto-Adapt Confirmation Box */}
              <div className="p-3.5 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-cyan-500/30 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                  <IconSparkles className="w-4 h-4 text-cyan-400" />
                  <span>Riepilogo Registrazione & Auto-Adattamento:</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  Verranno registrate <strong>+{hours}h</strong> in data <strong>{formatDateDisplay(selectedDate)}</strong> sull'argomento:
                  <div className="mt-1 p-2 bg-black/40 rounded-xl border border-slate-800 font-mono text-cyan-300 font-bold flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-white">
                      {currentTopic?.id}
                    </span>
                    <span className="truncate">{currentTopic?.argomento}</span>
                    <span className="text-slate-400 text-[10px] ml-auto">
                      ({isCompleted ? "✓ Completato" : "In Corso"})
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px] pt-1">
                  💡 <em>Se oggi avevi in programma un'altra materia, il calendario riadatterà automaticamente i carichi a partire da domani senza perdere nessun argomento.</em>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition"
                >
                  Annulla
                </button>

                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/25 border border-emerald-400/40 transition transform active:scale-95"
                >
                  <IconCheck className="w-4 h-4" />
                  <span>Conferma e Salva Sessione</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


// --- src/components/TopicDetailModal.js ---



function TopicDetailModal({
  isOpen,
  onClose,
  topic,
  onToggleComplete,
  onOpenLogModal,
  studySessions = []
}) {
  if (!isOpen || !topic) return null;

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "theorems" | "sessions"

  const isAnalisi = topic.materia ? topic.materia.toLowerCase().includes("analisi") : true;
  const isDone = Boolean(topic.completato !== undefined ? topic.completato : topic.isCompleted);
  const effHours = Number(topic.oreEffettive || 0);
  const estHours = Number(topic.oreStimate || 2.0);
  const residue = Math.max(0, Number((estHours - effHours).toFixed(2)));
  const hasBuffer = Boolean(topic.hasBuffer || (topic.prioritaEsame >= 4 || topic.difficolta >= 4));

  // Sessions for this topic
  const topicSessions = useMemo(() => {
    return (studySessions || []).filter(s => s.topicId === topic.id);
  }, [studySessions, topic.id]);

  // Subtopics breakdown
  const subtopics = useMemo(() => {
    if (!topic.argomento) return [];
    // Split by commas, semicolons or colons that represent lists
    const rawParts = topic.argomento.split(/[,;:]+/).map(p => p.trim()).filter(Boolean);
    return rawParts.length > 1 ? rawParts : [topic.argomento];
  }, [topic.argomento]);

  // Check if proof/theorem is required
  const hasProofMention = useMemo(() => {
    const text = ((topic.argomento || "") + " " + (topic.note || "") + " " + (topic.fonti || "")).toLowerCase();
    return text.includes("dim") || text.includes("teorema") || text.includes("dimostrazione");
  }, [topic]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const getDifficultyLabel = (diff) => {
    const d = Number(diff) || 3;
    if (d <= 2) return "Bassa / Accessibile";
    if (d === 3) return "Media / Standard";
    if (d === 4) return "Alta / Impegnativo";
    return "Massima / Critico";
  };

  const getPriorityLabel = (prio) => {
    const p = Number(prio) || 3;
    if (p <= 2) return "Secondaria (Frequenza bassa)";
    if (p === 3) return "Rilevante (Standard scritto/orale)";
    if (p === 4) return "Frequente (Sbarramento scritto)";
    return "Pilastro d'Esame (Presenza fissa)";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className={`bg-[#0b101d] border rounded-3xl w-full max-w-3xl 2xl:max-w-4xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] ${
        isAnalisi ? "border-emerald-500/30" : "border-indigo-500/30"
      }`}>
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex flex-col gap-3 relative overflow-hidden bg-gradient-to-r ${
          isAnalisi
            ? "from-slate-900/95 via-emerald-950/30 to-slate-950/90 border-emerald-500/20"
            : "from-slate-900/95 via-indigo-950/30 to-slate-950/90 border-indigo-500/20"
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Subject Badge */}
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl uppercase tracking-wider ${
                isAnalisi
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              }`}>
                {topic.materia}
              </span>

              {/* Topic ID */}
              <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-xl bg-slate-950 text-white border border-slate-800">
                {topic.id}
              </span>

              {/* Chapter */}
              <span className="text-xs text-slate-400 font-medium">
                Capitolo: <strong className="text-slate-200">{topic.capitolo}</strong>
              </span>

              {/* Status Badge */}
              {isDone ? (
                <span className="text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>Completato {topic.completedDate ? `il ${formatDateDisplay(topic.completedDate)}` : ""}</span>
                </span>
              ) : effHours > 0 ? (
                <span className="text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  ⏳ In Corso ({effHours.toFixed(1)}h svolte)
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                  ⚪ Da Svolgere
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition flex-shrink-0"
              title="Chiudi scheda"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Big Argument Title */}
          <div>
            <div className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-cyan-400 mb-0.5">
              Scheda Argomento Didattica
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              {topic.argomento}
            </h2>
            {topic.assignedDate && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                <IconCalendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {isDone ? "Svolto il:" : "Previsto nel calendario per:"}{" "}
                  <strong className="text-cyan-300">{topic.assignedDayName || "Giorno"} {formatDateDisplay(topic.assignedDate)}</strong>
                  {topic.assignedWeek ? ` (Settimana ${topic.assignedWeek})` : ""}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800/80 text-xs">
          {/* Hours Card */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
              <span>Monte Ore</span>
              <IconClock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-extrabold text-white font-mono mt-1">
              <span className="text-cyan-300">{effHours.toFixed(1)}h</span>
              <span className="text-slate-500 font-normal"> / {estHours.toFixed(1)}h</span>
            </div>
            <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">
              Residuo: {residue.toFixed(1)}h {hasBuffer ? "(+20% buffer)" : ""}
            </div>
          </div>

          {/* Difficulty Card */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
              <span>Difficoltà</span>
              <span className="text-cyan-400 font-bold font-mono">{topic.difficolta || 3}/5</span>
            </div>
            <div className="text-base font-extrabold text-white mt-1">
              {topic.difficolta >= 4 ? "🔥 " : "⚡ "}
              {getDifficultyLabel(topic.difficolta).split("/")[0]}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              {getDifficultyLabel(topic.difficolta)}
            </div>
          </div>

          {/* Priority Card */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
              <span>Priorità Esame</span>
              <span className="text-amber-400 font-bold font-mono">{topic.prioritaEsame || 3}/5</span>
            </div>
            <div className="text-base font-extrabold text-white mt-1">
              {topic.prioritaEsame >= 4 ? "★ Alta" : "☆ Media"}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              {getPriorityLabel(topic.prioritaEsame)}
            </div>
          </div>

          {/* Completion Progress Card */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-slate-400 text-[11px] font-medium flex items-center justify-between">
              <span>Avanzamento</span>
              <span className="text-emerald-400 font-bold font-mono">
                {Math.min(100, Math.round((effHours / estHours) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
              <div
                className={`h-full transition-all duration-500 ${
                  isDone ? "bg-emerald-400" : effHours > 0 ? "bg-cyan-400" : "bg-transparent"
                }`}
                style={{ width: `${Math.min(100, Math.round((effHours / estHours) * 100))}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              {isDone ? "Completato al 100%" : `${residue.toFixed(1)}h rimanenti`}
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center space-x-2 px-5 pt-3 border-b border-slate-800/80 bg-slate-950/30 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "overview"
                ? isAnalisi ? "border-emerald-400 text-emerald-300" : "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <IconBookOpen className="w-4 h-4" />
            <span>Programma & Contenuti</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("theorems")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "theorems"
                ? isAnalisi ? "border-emerald-400 text-emerald-300" : "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <IconSparkles className="w-4 h-4" />
            <span>Teoremi & Prove d'Esame</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`pb-2.5 px-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "sessions"
                ? isAnalisi ? "border-emerald-400 text-emerald-300" : "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <IconClock className="w-4 h-4" />
            <span>Diario Sessioni</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {topicSessions.length}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Detailed Breakdown of Concepts */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
                  <span>Concetti Didattici Inclusi nell'Argomento</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {subtopics.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-900/60 border border-slate-800/60 rounded-xl flex items-start space-x-2 text-slate-200"
                    >
                      <span className="text-cyan-400 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverable / Learning Goal */}
              {topic.note && (
                <div className="bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-500/30 rounded-2xl p-4 space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                    <IconSparkles className="w-4 h-4 text-cyan-400" />
                    <span>Deliverable Operativo (Obiettivo di Fine Studio):</span>
                  </div>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {topic.note}
                  </p>
                </div>
              )}

              {/* Official Sources and Textbooks */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-slate-300 flex items-center gap-2">
                  <IconBookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Fonti Bibliografiche e Riferimenti Ufficiali UNIMORE</span>
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  {topic.fonti || (isAnalisi
                    ? "Testo ufficiale Marcellini-Sbordone (Analisi Matematica 1), Registro delle Lezioni e dispense d'aula."
                    : "Testo Casali-Gagliardi-Grasselli (Geometria), dispense Algoritmo B e registro ufficiale.")}
                </p>
              </div>
            </div>
          )}

          {activeTab === "theorems" && (
            <div className="space-y-4">
              {/* Theorem and Proof Box */}
              <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <IconSparkles className="w-4 h-4 text-amber-400" />
                    <span>Teoremi e Rigore Dimostrativo per l'Orale</span>
                  </h4>
                  {hasProofMention && (
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                      Dimostrazione Richiesta
                    </span>
                  )}
                </div>

                <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-2 text-slate-300">
                  <p className="leading-relaxed">
                    {topic.note ? (
                      <>
                        <strong className="text-amber-300 font-semibold">Focus Dimostrazioni & Formule:</strong>{" "}
                        {topic.note}
                      </>
                    ) : (
                      "Padroneggiare tutte le definizioni formali ($\forall \varepsilon > 0$), gli enunciati esatti e le ipotesi necessarie."
                    )}
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {isAnalisi
                      ? "Regola aurea della commissione: nello scritto ogni passaggio deve essere rigorosamente giustificato (sviluppi di Taylor all'ordine corretto, limiti notevoli, criteri di convergenza). All'orale vengono chiesti enunciati e dimostrazioni integrali."
                      : "Regola d'esame Geometria: il test scritto contiene 11 domande con penalità (-1 risposta errata). All'orale è determinante la perfetta esposizione delle dimostrazioni numerate del testo Casali-Gagliardi-Grasselli."}
                  </p>
                </div>
              </div>

              {/* Strategic Exam Tips Card */}
              <div className="p-4 bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <IconFlame className="w-4 h-4 text-amber-400" />
                  <span>Consigli per Massimizzare il Punteggio:</span>
                </span>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
                  <li>
                    {isAnalisi
                      ? "Non limitarsi al risultato numerico: la docente valuta la coerenza logica, la notazione corretta degli o-piccolo e la verifica delle ipotesi dei teoremi."
                      : "Negli esercizi con parametro (k), discutere sempre separatamente i valori critici del determinante e del rango per evitare penalità."}
                  </li>
                  <li>
                    Per l'orale, prova a riesporre il teorema e a scrivere la dimostrazione su un foglio bianco senza consultare gli appunti.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Ore registrate specificamente per <strong>{topic.id}</strong>:</span>
                <span className="font-mono">{topicSessions.length} registrazioni</span>
              </div>

              {topicSessions.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-3 text-xs text-slate-400">
                  <p>Non hai ancora registrato sessioni di studio per questo argomento.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLogModal && onOpenLogModal({ topicId: topic.id, hours: residue > 0 ? residue : estHours });
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold rounded-xl text-xs shadow-md transition"
                  >
                    + Registra Ore Ora
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {topicSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white font-mono">
                            {formatDateDisplay(sess.date)}
                          </span>
                          <span className="font-bold text-cyan-300 font-mono">
                            +{sess.hours}h
                          </span>
                          {sess.completed && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 rounded font-bold">
                              ✓ Completato
                            </span>
                          )}
                        </div>
                        {sess.note && (
                          <p className="text-slate-400 text-[11px] italic mt-0.5">
                            "{sess.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          {/* Quick toggle complete */}
          <button
            type="button"
            onClick={() => onToggleComplete && onToggleComplete(topic.id)}
            className={`px-4 py-2.5 rounded-xl border font-bold transition flex items-center justify-center gap-2 ${
              isDone
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30"
                : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-700 hover:border-slate-500"
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
              isDone ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-500 bg-slate-950"
            }`}>
              {isDone && <IconCheck className="w-3 h-3" />}
            </div>
            <span>{isDone ? "Completato ✓ (Clicca per riaprire)" : "Segna come Completato"}</span>
          </button>

          <div className="flex items-center space-x-2.5">
            {/* Quick Log Studio Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogModal && onOpenLogModal({
                  topicId: topic.id,
                  hours: residue > 0 ? residue : estHours
                });
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition active:scale-95"
            >
              <span className="font-black text-sm leading-none">+</span>
              <span>Registra Ore su Questo Argomento</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold border border-slate-800 transition"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- src/app.js ---
















const LOCAL_STORAGE_KEY_TOPICS = "unimore_rebalancer_topics_v2";
const LOCAL_STORAGE_KEY_SETTINGS = "unimore_rebalancer_settings_v2";
const LOCAL_STORAGE_KEY_CUSTOM_CAPACITIES = "unimore_rebalancer_custom_capacities_v2";
const LOCAL_STORAGE_KEY_SESSIONS = "unimore_rebalancer_sessions_v2";

function App() {
  // Load saved state from localStorage if available, or use official UNIMORE defaults
  // Ensures granular partial progress: oreEffettive (float) and completato (boolean)
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TOPICS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(t => {
          const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
          const oreEff = t.oreEffettive !== undefined && t.oreEffettive !== null
            ? Number(t.oreEffettive)
            : (isDone ? Number(t.oreStimate || 2.0) : 0);
          return {
            ...t,
            completato: isDone,
            isCompleted: isDone,
            oreEffettive: oreEff
          };
        });
      }
    } catch (e) {
      console.warn("Could not load topics from localStorage", e);
    }
    return INITIAL_TOPICS.map(t => ({
      ...t,
      completato: false,
      isCompleted: false,
      oreEffettive: 0
    }));
  });

  const [settings, setSettings] = useState(() => {
    const todayStr = getLocalTodayDateStr();
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If the saved date is older than today or empty, automatically sync to today's real date!
        if (!parsed.currentSimulatedDate || parsed.currentSimulatedDate < todayStr) {
          return {
            ...parsed,
            currentSimulatedDate: todayStr
          };
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not load settings from localStorage", e);
    }
    return {
      ...DEFAULT_SETTINGS,
      currentSimulatedDate: todayStr
    };
  });

  // Dynamic daily capacities override (Time Shifter)
  const [customDayCapacities, setCustomDayCapacities] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_CAPACITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load customDayCapacities from localStorage", e);
    }
    return {};
  });

  // Recorded study sessions log
  const [studySessions, setStudySessions] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load studySessions from localStorage", e);
    }
    return [];
  });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalInitialData, setLogModalInitialData] = useState({});
  const [selectedTopicDetail, setSelectedTopicDetail] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "weekly" | "history" | "topics" | "import"
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("");

  // GitLab Cloud Sync state
  const [gitlabConfig, setGitlabConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GITLAB_CONFIG);
      if (saved) return { ...DEFAULT_GITLAB_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Could not load gitlabConfig", e);
    }
    return DEFAULT_GITLAB_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_GITLAB_CONFIG, JSON.stringify(gitlabConfig));
    } catch (e) {
      console.warn("Failed to persist gitlabConfig", e);
    }
  }, [gitlabConfig]);

  // Transparent File System Access API synchronization
  const [fileHandle, setFileHandle] = useState(null);
  const [fsSyncStatus, setFsSyncStatus] = useState({
    active: false,
    fileName: "",
    lastSaved: null,
    isSaving: false,
    error: null
  });

  // PWA Installation & Standalone detection
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect standalone PWA mode
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(isRunningStandalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("[PWA] beforeinstallprompt event captured and ready");
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      console.log("[PWA] App installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("Per installare StudiPlanner tramite Chrome o Edge:\n\n1. Clicca sull'icona 'Installa' nella barra degli indirizzi in alto a destra (icona monitor con freccia verso il basso).\n2. Oppure apri il menu a tre puntini (⋮) -> 'Installa StudiPlanner'.\n\nL'app si aprirà in una finestra desktop dedicata e potrai fissarla alla Barra delle Applicazioni!");
    }
  };


  // Auto-sync date if day rolls over while tab is open or window receives focus
  useEffect(() => {
    const checkDateRoll = () => {
      const todayStr = getLocalTodayDateStr();
      setSettings(prev => {
        if (prev.currentSimulatedDate < todayStr) {
          return { ...prev, currentSimulatedDate: todayStr };
        }
        return prev;
      });
    };

    window.addEventListener("focus", checkDateRoll);
    const timer = setInterval(checkDateRoll, 60000); // Check once a minute
    return () => {
      window.removeEventListener("focus", checkDateRoll);
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TOPICS, JSON.stringify(topics));
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn("Failed to persist topics", e);
    }
  }, [topics]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to persist settings", e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_CAPACITIES, JSON.stringify(customDayCapacities));
    } catch (e) {
      console.warn("Failed to persist customDayCapacities", e);
    }
  }, [customDayCapacities]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSIONS, JSON.stringify(studySessions));
    } catch (e) {
      console.warn("Failed to persist studySessions", e);
    }
  }, [studySessions]);

  // Transparent Auto-Sync: Automatically overwrite connected JSON file on any global state change
  useEffect(() => {
    if (!fileHandle) return;

    let isMounted = true;
    const autoSaveToFile = async () => {
      try {
        if (isMounted) setFsSyncStatus(prev => ({ ...prev, isSaving: true, error: null }));
        const writable = await fileHandle.createWritable();
        const backupData = {
          exportDate: new Date().toISOString(),
          settings,
          topics,
          customDayCapacities,
          studySessions
        };
        await writable.write(JSON.stringify(backupData, null, 2));
        await writable.close();
        if (isMounted) {
          setFsSyncStatus({
            active: true,
            fileName: fileHandle.name,
            lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            isSaving: false,
            error: null
          });
        }
      } catch (err) {
        console.warn("Auto-sync write error:", err);
        if (isMounted) {
          setFsSyncStatus(prev => ({ ...prev, isSaving: false, error: err.message }));
        }
      }
    };

    autoSaveToFile();

    return () => {
      isMounted = false;
    };
  }, [topics, settings, customDayCapacities, studySessions, fileHandle]);

  // Connect file handle using File System Access API
  const handleConnectFileSystem = async () => {
    if (typeof window === "undefined" || !("showOpenFilePicker" in window)) {
      throw new Error("La File System Access API non è supportata da questo browser.");
    }
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "File di Backup JSON (*.json)",
          accept: { "application/json": [".json"] }
        }
      ],
      multiple: false
    });
    if (!handle) return null;

    const file = await handle.getFile();
    const text = await file.text();
    let imported = false;
    if (text.trim()) {
      try {
        const backup = JSON.parse(text);
        if (backup.topics && Array.isArray(backup.topics)) {
          setTopics(backup.topics);
          if (backup.settings) {
            setSettings(backup.settings);
          }
          if (backup.customDayCapacities && typeof backup.customDayCapacities === "object") {
            setCustomDayCapacities(backup.customDayCapacities);
          }
          if (backup.studySessions && Array.isArray(backup.studySessions)) {
            setStudySessions(backup.studySessions);
          }
          imported = true;
        }
      } catch (e) {
        console.warn("File JSON iniziale vuoto o non valido; verrà popolato con i dati attuali.", e);
      }
    }

    setFileHandle(handle);
    setFsSyncStatus({
      active: true,
      fileName: handle.name,
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isSaving: false,
      error: null
    });

    if (!imported) {
      try {
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify({
          exportDate: new Date().toISOString(),
          settings,
          topics,
          customDayCapacities,
          studySessions
        }, null, 2));
        await writable.close();
      } catch (err) {
        console.warn("Scrittura iniziale fallita:", err);
      }
    }

    return { fileName: handle.name, imported };
  };

  const handleDisconnectFileSystem = () => {
    setFileHandle(null);
    setFsSyncStatus({
      active: false,
      fileName: "",
      lastSaved: null,
      isSaving: false,
      error: null
    });
  };

  const handleTriggerManualSave = async () => {
    if (!fileHandle) return;
    try {
      setFsSyncStatus(prev => ({ ...prev, isSaving: true, error: null }));
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify({
        exportDate: new Date().toISOString(),
        settings,
        topics,
        customDayCapacities,
        studySessions
      }, null, 2));
      await writable.close();
      setFsSyncStatus({
        active: true,
        fileName: fileHandle.name,
        lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isSaving: false,
        error: null
      });
    } catch (err) {
      setFsSyncStatus(prev => ({ ...prev, isSaving: false, error: err.message }));
    }
  };

  // 1. GitLab Initial Auto-Pull on App Mount
  useEffect(() => {
    if (!gitlabConfig?.enabled || !gitlabConfig?.autoSync || !gitlabConfig?.token || !gitlabConfig?.projectId) return;

    let isMounted = true;
    const initialPull = async () => {
      try {
        setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing", errorMessage: null }));
        const res = await pullFromGitLab(gitlabConfig);
        if (!isMounted) return;

        if (res.success && res.data) {
          const remoteData = res.data;
          if (remoteData.topics && Array.isArray(remoteData.topics)) setTopics(remoteData.topics);
          if (remoteData.settings) setSettings(prev => ({ ...prev, ...remoteData.settings, currentSimulatedDate: getLocalTodayDateStr() }));
          if (remoteData.customDayCapacities) setCustomDayCapacities(remoteData.customDayCapacities);
          if (remoteData.studySessions && Array.isArray(remoteData.studySessions)) setStudySessions(remoteData.studySessions);

          setGitlabConfig(prev => ({
            ...prev,
            syncStatus: "success",
            lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            lastCommitId: res.commitId || prev.lastCommitId,
            errorMessage: null
          }));
        } else {
          setGitlabConfig(prev => ({ ...prev, syncStatus: "idle" }));
        }
      } catch (err) {
        if (isMounted) {
          console.warn("GitLab auto-pull error:", err);
          setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
        }
      }
    };

    initialPull();
    return () => { isMounted = false; };
  }, []);

  // 2. GitLab Auto-Push on State Changes (Debounced to avoid rapid commit spam)
  const isGitLabMountRef = useRef(true);
  useEffect(() => {
    if (isGitLabMountRef.current) {
      isGitLabMountRef.current = false;
      return;
    }
    if (!gitlabConfig?.enabled || !gitlabConfig?.autoSync || !gitlabConfig?.token || !gitlabConfig?.projectId) return;

    setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing" }));

    const timer = setTimeout(async () => {
      try {
        const payload = {
          exportDate: new Date().toISOString(),
          settings,
          topics,
          customDayCapacities,
          studySessions
        };
        const res = await pushToGitLab(gitlabConfig, payload);
        setGitlabConfig(prev => ({
          ...prev,
          syncStatus: "success",
          lastSynced: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          lastCommitId: res.commitId || prev.lastCommitId,
          errorMessage: null
        }));
      } catch (err) {
        console.warn("GitLab auto-push error:", err);
        setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [topics, settings, customDayCapacities, studySessions, gitlabConfig?.enabled, gitlabConfig?.autoSync]);

  // 3. Manual GitLab Pull & Push Handlers
  const handleGitLabPull = async () => {
    setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing", errorMessage: null }));
    try {
      const res = await pullFromGitLab(gitlabConfig);
      if (res.success && res.data) {
        const remoteData = res.data;
        if (remoteData.topics && Array.isArray(remoteData.topics)) setTopics(remoteData.topics);
        if (remoteData.settings) setSettings(prev => ({ ...prev, ...remoteData.settings, currentSimulatedDate: getLocalTodayDateStr() }));
        if (remoteData.customDayCapacities) setCustomDayCapacities(remoteData.customDayCapacities);
        if (remoteData.studySessions && Array.isArray(remoteData.studySessions)) setStudySessions(remoteData.studySessions);

        setGitlabConfig(prev => ({
          ...prev,
          syncStatus: "success",
          lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          lastCommitId: res.commitId || prev.lastCommitId,
          errorMessage: null
        }));
        return { success: true, message: "Dati scaricati e sincronizzati con successo da GitLab!" };
      }
      return { success: false, message: res.message || "Nessun file trovato nel repo." };
    } catch (err) {
      setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
      throw err;
    }
  };

  const handleGitLabPush = async (customMsg) => {
    setGitlabConfig(prev => ({ ...prev, syncStatus: "syncing", errorMessage: null }));
    try {
      const payload = {
        exportDate: new Date().toISOString(),
        settings,
        topics,
        customDayCapacities,
        studySessions
      };
      const res = await pushToGitLab(gitlabConfig, payload, customMsg);
      setGitlabConfig(prev => ({
        ...prev,
        syncStatus: "success",
        lastSynced: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        lastCommitId: res.commitId || prev.lastCommitId,
        errorMessage: null
      }));
      return { success: true, message: "Nuovo commit inviato con successo su GitLab!" };
    } catch (err) {
      setGitlabConfig(prev => ({ ...prev, syncStatus: "error", errorMessage: err.message }));
      throw err;
    }
  };

  // Dynamic Daily Capacity Override (Time Shifter) Handlers
  const handleUpdateDayCapacity = (dateStr, newHours) => {
    setCustomDayCapacities(prev => {
      const updated = { ...prev };
      if (newHours === null || newHours === undefined) {
        delete updated[dateStr];
      } else {
        updated[dateStr] = Math.max(0, Number(Number(newHours).toFixed(1)));
      }
      return updated;
    });
  };

  const handleResetDayCapacities = () => {
    setCustomDayCapacities({});
  };

  // Reactive Rebalancing calculation
  const rebalancedPlan = useMemo(() => {
    return rebalanceStudyPlan(topics, settings, customDayCapacities, studySessions);
  }, [topics, settings, customDayCapacities, studySessions]);

  const { metrics, weeklyPlans, progress, historyDays } = rebalancedPlan;

  // Open / Close Log Study Modal
  const handleOpenLogModal = (initialData = {}) => {
    setLogModalInitialData(initialData || {});
    setIsLogModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setLogModalInitialData({});
  };

  // Open / Close Topic Detail Sheet Modal
  const handleOpenTopicDetail = (topicOrId) => {
    if (!topicOrId) return;
    const found = typeof topicOrId === "string"
      ? topics.find(t => t.id === topicOrId)
      : (topics.find(t => t.id === topicOrId.id) || topicOrId);
    setSelectedTopicDetail(found || null);
  };

  const handleCloseTopicDetail = () => {
    setSelectedTopicDetail(null);
  };

  // Keep selectedTopicDetail in sync with updated topics state
  useEffect(() => {
    if (selectedTopicDetail) {
      const fresh = topics.find(t => t.id === selectedTopicDetail.id);
      if (fresh) setSelectedTopicDetail(fresh);
    }
  }, [topics]);

  // Add recorded study session and update topic state
  const handleLogStudySession = ({ topicId, date, hours, completed, note }) => {
    const numHours = Number(hours) || 0;
    const sessionDate = date || settings.currentSimulatedDate;
    const newSession = {
      id: "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      topicId,
      date: sessionDate,
      hours: numHours,
      completed: Boolean(completed),
      note: note || "",
      timestamp: new Date().toISOString()
    };

    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const currentEff = Number(t.oreEffettive || 0);
        const newEff = Number((currentEff + numHours).toFixed(2));
        const isDone = completed !== undefined ? Boolean(completed) : (t.completato || newEff >= Number(t.oreStimate || 2.0));
        return {
          ...t,
          oreEffettive: newEff,
          completato: isDone,
          isCompleted: isDone,
          completedDate: isDone ? (t.completedDate || sessionDate) : null
        };
      }
      return t;
    }));

    setStudySessions(prev => [newSession, ...prev]);
  };

  // Delete a recorded study session and revert topic hours/completion
  const handleDeleteStudySession = (sessionId) => {
    const session = studySessions.find(s => s.id === sessionId);
    if (!session) return;

    setTopics(prev => prev.map(t => {
      if (t.id === session.topicId) {
        const currentEff = Number(t.oreEffettive || 0);
        const revertedEff = Math.max(0, Number((currentEff - session.hours).toFixed(2)));
        const otherCompletedSession = studySessions.some(s => s.id !== sessionId && s.topicId === session.topicId && s.completed);
        const stillDone = otherCompletedSession;
        return {
          ...t,
          oreEffettive: revertedEff,
          completato: stillDone,
          isCompleted: stillDone,
          completedDate: stillDone ? t.completedDate : null
        };
      }
      return t;
    }));

    setStudySessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Toggle completion of a single topic with automatic timestamp
  const handleToggleComplete = (topicId) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
          const willComplete = !isDone;
          const currentEff = Number(t.oreEffettive || 0);
          return {
            ...t,
            completato: willComplete,
            isCompleted: willComplete,
            completedDate: willComplete ? (t.completedDate || settings.currentSimulatedDate) : null,
            // If marking completed and had 0 hours logged, defaults to oreStimate; else preserves accumulated hours
            oreEffettive: willComplete && currentEff === 0 ? Number(t.oreStimate || 2.0) : currentEff
          };
        }
        return t;
      })
    );
  };

  // Granular Partial Progress: Add or set hours spent on a topic without completing it
  const handleUpdateTopicHours = (topicId, deltaOrNewHours, isDelta = true) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const cur = Number(t.oreEffettive || 0);
          const nextVal = isDelta
            ? Math.max(0, Number((cur + deltaOrNewHours).toFixed(2)))
            : Math.max(0, Number(Number(deltaOrNewHours).toFixed(2)));
          return {
            ...t,
            oreEffettive: nextVal
          };
        }
        return t;
      })
    );
  };

  // Spaced Repetition: Toggle review level completion (r1, r2, r3)
  const handleToggleSpacedReview = (topicId, levelKey, isDone) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const curReviews = t.spacedReviews || {};
          return {
            ...t,
            spacedReviews: {
              ...curReviews,
              [levelKey]: isDone
            }
          };
        }
        return t;
      })
    );
  };

  // Batch update of topics (e.g. from FileImporter or reset)
  const handleTopicsUpdated = (newTopics) => {
    setTopics(newTopics);
  };

  // Date controls: simulate advancing or retroceding date
  const handleAdvanceDate = () => {
    const cur = new Date(settings.currentSimulatedDate);
    cur.setDate(cur.getDate() + 1);
    setSettings(prev => ({
      ...prev,
      currentSimulatedDate: cur.toISOString().split("T")[0]
    }));
  };

  const handleRetrocedeDate = () => {
    const cur = new Date(settings.currentSimulatedDate);
    cur.setDate(cur.getDate() - 1);
    setSettings(prev => ({
      ...prev,
      currentSimulatedDate: cur.toISOString().split("T")[0]
    }));
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}`;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 lg:px-8 2xl:px-12 py-3.5 shadow-md">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <IconBookOpen className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base md:text-lg font-black tracking-tight text-white">
                  Studi<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Planner</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  UNIMORE Ingegneria
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Analisi 1 & Geometria • Ribilanciamento dinamico fino al 10 Gennaio 2027
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconBarChart className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("weekly")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "weekly"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconCalendar className="w-4 h-4 text-emerald-400" />
              <span>To-Do Settimanale</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconHistory className="w-4 h-4 text-amber-400" />
              <span>Storico & Diario</span>
            </button>

            <button
              onClick={() => setActiveTab("topics")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "topics"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconLayers className="w-4 h-4 text-indigo-400" />
              <span>Catalogo Argomenti</span>
            </button>

            <button
              onClick={() => setActiveTab("import")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "import"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <IconUpload className="w-4 h-4 text-purple-400" />
              <span>Import / Sync</span>
            </button>
          </nav>

          {/* Right Action: Date Simulation Controls & Settings */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Log Studio Action (+) */}
            <button
              type="button"
              onClick={() => handleOpenLogModal({ date: settings.currentSimulatedDate })}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 border border-emerald-400/40 transition transform active:scale-95 flex-shrink-0"
              title="Registra ore di studio svolte (+)"
            >
              <span className="text-base font-black leading-none">+</span>
              <span className="hidden sm:inline">Registra Studio</span>
            </button>

            {/* Auto-Sync status badge if connected */}
            {fsSyncStatus.active && (
              <button
                type="button"
                onClick={() => setActiveTab("import")}
                className="hidden lg:flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-xs font-mono text-emerald-300 hover:bg-emerald-900/60 transition"
                title={`Sincronizzazione automatica attiva su: ${fsSyncStatus.fileName} (Ultimo salvataggio: ${fsSyncStatus.lastSaved || "In corso..."})`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="truncate max-w-[120px] font-bold">{fsSyncStatus.fileName}</span>
              </button>
            )}

            {/* GitLab Cloud Sync status badge if configured */}
            {gitlabConfig?.enabled && (
              <button
                type="button"
                onClick={() => setActiveTab("import")}
                className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono border transition ${
                  gitlabConfig.syncStatus === "syncing"
                    ? "bg-orange-950/80 border-orange-500/40 text-orange-300"
                    : gitlabConfig.syncStatus === "error"
                    ? "bg-rose-950/80 border-rose-500/40 text-rose-300"
                    : "bg-orange-950/50 hover:bg-orange-900/60 border-orange-500/30 text-orange-200"
                }`}
                title={`GitLab Cloud Sync: ${gitlabConfig.syncStatus === 'syncing' ? 'Sincronizzazione in corso...' : gitlabConfig.lastSynced ? 'Ultimo sync: ' + gitlabConfig.lastSynced : 'Attiva'}. Clicca per gestire.`}
              >
                <IconGitLab className={`w-3.5 h-3.5 text-orange-400 ${gitlabConfig.syncStatus === "syncing" ? "animate-spin" : ""}`} />
                <span className="truncate max-w-[120px] font-bold">
                  {gitlabConfig.syncStatus === "syncing" ? "GitLab..." : gitlabConfig.lastSynced ? `GitLab: ${gitlabConfig.lastSynced}` : "GitLab"}
                </span>
              </button>
            )}

            {/* Quick date simulator pill */}
            <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs font-mono">
              <button
                onClick={handleRetrocedeDate}
                className="px-1.5 py-0.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                title="Giorno precedente"
              >
                ◀
              </button>
              <span className="px-2 font-bold text-cyan-300">
                Oggi: {formatDateDisplay(settings.currentSimulatedDate)}
              </span>
              <button
                onClick={handleAdvanceDate}
                className="px-1.5 py-0.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                title="Giorno successivo (simula giorno saltato o avanzamento)"
              >
                ▶
              </button>

              {settings.currentSimulatedDate !== getLocalTodayDateStr() && (
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, currentSimulatedDate: getLocalTodayDateStr() }))}
                  className="ml-1 px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-sans font-bold border border-cyan-500/40 transition"
                  title={`Reimposta sulla data reale odierna (${formatDateDisplay(getLocalTodayDateStr())})`}
                >
                  Oggi Reale
                </button>
              )}
            </div>

            {/* Countdown pill */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-mono">
              <IconClock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white">{metrics.remainingDays} gg</span>
            </div>

            {/* PWA Install Button (active when accessed via browser) */}
            {!isStandalone && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-xs shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition transform active:scale-95"
                title="Installa StudiPlanner come app desktop nativa su Windows tramite Chrome o Edge"
              >
                <svg className="w-3.5 h-3.5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Installa PWA</span>
              </button>
            )}

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
              title="Parametri di Ribilanciamento"
            >
              <IconSettings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8 2xl:px-12 space-y-6 pb-24 md:pb-12">
        {/* Rolling Catch-Up Banner (if days were skipped) */}
        {metrics.pastDaysSkipped > 0 && (
          <div className="bg-gradient-to-r from-cyan-950/60 to-indigo-950/50 border border-cyan-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl flex-shrink-0">
                <IconHistory className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-cyan-300 text-sm">
                  🔄 Ribilanciamento Dinamico Attivo
                </span>
                <p className="text-slate-300 mt-0.5">
                  Rilevati <strong>{metrics.pastDaysSkipped} giorni saltati</strong> nel passato: tutti gli argomenti non svolti sono stati automaticamente riposizionati da oggi in avanti, garantendo la copertura completa prima del 10 Gennaio 2027.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                onClick={() => setActiveTab("history")}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-xl font-semibold transition"
              >
                Vedi Storico
              </button>
            </div>
          </div>
        )}

        {/* Critical Overload Warning Banner */}
        <AlertBanner
          metrics={metrics}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <Dashboard
            progress={progress}
            metrics={metrics}
            onTabChange={setActiveTab}
            topics={topics}
            settings={settings}
            onOpenLogModal={handleOpenLogModal}
            onOpenTopicDetail={handleOpenTopicDetail}
            onToggleSpacedReview={handleToggleSpacedReview}
          />
        )}

        {activeTab === "weekly" && (
          <WeeklyTodo
            weeklyPlans={weeklyPlans}
            onToggleComplete={handleToggleComplete}
            onUpdateTopicHours={handleUpdateTopicHours}
            settings={settings}
            customDayCapacities={customDayCapacities}
            onUpdateDayCapacity={handleUpdateDayCapacity}
            onOpenLogModal={handleOpenLogModal}
            onOpenTopicDetail={handleOpenTopicDetail}
            onToggleSpacedReview={handleToggleSpacedReview}
          />
        )}

        {activeTab === "history" && (
          <HistoryLog
            historyDays={historyDays}
            calendarDays={rebalancedPlan.calendarDays}
            metrics={metrics}
            onAdvanceDate={handleAdvanceDate}
            onRetrocedeDate={handleRetrocedeDate}
            onSetDate={(newDate) => setSettings(prev => ({ ...prev, currentSimulatedDate: newDate }))}
            onOpenLogModal={handleOpenLogModal}
            onDeleteSession={handleDeleteStudySession}
            onOpenTopicDetail={handleOpenTopicDetail}
          />
        )}

        {activeTab === "topics" && (
          <TopicsTable
            topics={topics}
            onToggleComplete={handleToggleComplete}
            onUpdateTopicHours={handleUpdateTopicHours}
            onBatchUpdate={handleTopicsUpdated}
            onOpenTopicDetail={handleOpenTopicDetail}
          />
        )}

        {activeTab === "import" && (
          <FileImporter
            topics={topics}
            settings={settings}
            customDayCapacities={customDayCapacities}
            onCustomCapacitiesUpdated={(newCapacities) => setCustomDayCapacities(newCapacities)}
            onTopicsUpdated={handleTopicsUpdated}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
            studySessions={studySessions}
            onStudySessionsUpdated={(newSessions) => setStudySessions(newSessions)}
            fsSyncStatus={fsSyncStatus}
            onConnectFileSystem={handleConnectFileSystem}
            onDisconnectFileSystem={handleDisconnectFileSystem}
            onTriggerManualSave={handleTriggerManualSave}
            gitlabConfig={gitlabConfig}
            onUpdateGitLabConfig={(newConfig) => setGitlabConfig(newConfig)}
            onGitLabPull={handleGitLabPull}
            onGitLabPush={handleGitLabPush}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "dashboard" ? "text-cyan-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconBarChart className="w-5 h-5" />
          <span className="text-[10px] mt-1">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "weekly" ? "text-emerald-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconCalendar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Settimanale</span>
        </button>

        {/* Center Mobile Quick Log Button (+) */}
        <button
          type="button"
          onClick={() => handleOpenLogModal({ date: settings.currentSimulatedDate })}
          className="flex flex-col items-center py-0.5 px-2 rounded-xl transition text-emerald-400 -mt-3"
          title="Registra Sessione di Studio (+)"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 border-2 border-[#070b14] active:scale-95 transition">
            <span className="text-xl font-black leading-none">+</span>
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Studio</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "history" ? "text-amber-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconHistory className="w-5 h-5" />
          <span className="text-[10px] mt-1">Storico</span>
        </button>

        <button
          onClick={() => setActiveTab("topics")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "topics" ? "text-indigo-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconLayers className="w-5 h-5" />
          <span className="text-[10px] mt-1">Argomenti</span>
        </button>

        <button
          onClick={() => setActiveTab("import")}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === "import" ? "text-purple-400 font-bold" : "text-slate-500"
          }`}
        >
          <IconUpload className="w-5 h-5" />
          <span className="text-[10px] mt-1">File</span>
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        customDayCapacities={customDayCapacities}
        onResetDayCapacities={handleResetDayCapacities}
      />

      {/* Log Study Modal (+) */}
      <LogStudyModal
        isOpen={isLogModalOpen}
        onClose={handleCloseLogModal}
        topics={topics}
        settings={settings}
        initialData={logModalInitialData}
        onSaveSession={handleLogStudySession}
        studySessions={studySessions}
        onDeleteSession={handleDeleteStudySession}
      />

      {/* Topic Detail Sheet Modal */}
      <TopicDetailModal
        isOpen={Boolean(selectedTopicDetail)}
        onClose={handleCloseTopicDetail}
        topic={selectedTopicDetail}
        onToggleComplete={handleToggleComplete}
        onOpenLogModal={handleOpenLogModal}
        studySessions={studySessions}
      />

      {/* CLARKE-9000 Isolated Side Companion */}
      <Clarke9000Companion
        progress={progress}
        metrics={metrics}
      />
    </div>
  );
}


// Safe DOM Root Mount
function mountStudiPlannerApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.warn('[StudiPlanner] Root element not ready yet, retrying in 50ms...');
    setTimeout(mountStudiPlannerApp, 50);
    return;
  }
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));
    console.log('[StudiPlanner] React mounted successfully.');
  } catch (err) {
    console.error('[StudiPlanner] Fatal mounting exception:', err);
    rootElement.innerHTML = `
      <div style="min-height:100vh; background:#070b14; color:#f87171; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:24px;">
        <h2 style="font-size:18px; font-weight:bold; color:#fff; margin-bottom:8px;">Errore di Avvio StudiPlanner</h2>
        <p style="color:#94a3b8; font-size:12px; max-width:400px; margin-bottom:20px;">${err.message}</p>
        <button onclick="window.location.reload()" style="background:#06b6d4; color:#fff; border:none; padding:10px 20px; border-radius:12px; cursor:pointer; font-weight:bold; font-size:12px;">Ricarica Pagina</button>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountStudiPlannerApp);
} else {
  mountStudiPlannerApp();
}
