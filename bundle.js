
// In-browser globals from CDN
const { useState, useEffect, useMemo, useRef, useCallback } = React;


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

const DEFAULT_SETTINGS = {
  roadmapStartDate: "2026-11-16", // Start of winter session roadmap
  targetExamDate: "2027-01-10",
  currentSimulatedDate: "2026-11-17", // Active date (today)
  criticalWeeklyHoursThreshold: 25.0, // Critical threshold for full-time workers
  weekdayStudyHours: 2.5, // Evenings after work (Mon-Fri)
  weekendStudyHours: 4.5, // Dedicated blocks (Sat, Sun)
  highPriorityThreshold: 4, // 4 or 5 triggers high priority buffer
  bufferMultiplier: 1.2, // +20% time buffer
  interleaveSubjects: true, // Alternate Analisi and Geometria across days
  studyDays: {
    1: { name: "Lunedì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:30 - 22:00)" },
    2: { name: "Martedì", enabled: true, isWeekend: false, defaultSubject: "Geometria", timeSlot: "Sera (19:30 - 22:00)" },
    3: { name: "Mercoledì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:30 - 22:00)" },
    4: { name: "Giovedì", enabled: true, isWeekend: false, defaultSubject: "Geometria", timeSlot: "Sera (19:30 - 22:00)" },
    5: { name: "Venerdì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:00 - 21:00)" },
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
    const hours = Number(t.oreStimate) || 0;

    sub.totalCount += 1;
    sub.totalHours += hours;
    result.global.totalCount += 1;
    result.global.totalHours += hours;

    if (t.isCompleted) {
      sub.completedCount += 1;
      sub.completedHours += hours;
      result.global.completedCount += 1;
      result.global.completedHours += hours;
    } else {
      sub.remainingHours += hours;
      result.global.remainingHours += hours;
    }
  });

  // Calculate percentages
  result.analisi.percent = result.analisi.totalHours > 0
    ? Math.round((result.analisi.completedHours / result.analisi.totalHours) * 100)
    : 0;
  result.geometria.percent = result.geometria.totalHours > 0
    ? Math.round((result.geometria.completedHours / result.geometria.totalHours) * 100)
    : 0;
  result.global.percent = result.global.totalHours > 0
    ? Math.round((result.global.completedHours / result.global.totalHours) * 100)
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
function rebalanceStudyPlan(topics, customSettings = {}) {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const { remainingDays, remainingWeeks } = getCalendarMetrics(settings.currentSimulatedDate, settings.targetExamDate);

  // 1. Process and weigh uncompleted topics
  const processedUncompleted = topics
    .filter(t => !t.isCompleted)
    .map(t => {
      const isHighPriority = (t.prioritaEsame || 3) >= settings.highPriorityThreshold;
      const isHighDifficulty = (t.difficolta || 3) >= settings.highPriorityThreshold;
      const hasBuffer = isHighPriority || isHighDifficulty;

      const baseHours = Number(t.oreStimate) || 2.0;
      const effectiveHours = hasBuffer
        ? Number((baseHours * settings.bufferMultiplier).toFixed(2))
        : baseHours;

      return {
        ...t,
        baseHours,
        effectiveHours,
        hasBuffer,
        bufferDelta: Number((effectiveHours - baseHours).toFixed(2))
      };
    });

  // Total remaining workload from Today forward
  const totalRemainingBaseHours = Number(
    processedUncompleted.reduce((acc, t) => acc + t.baseHours, 0).toFixed(1)
  );
  const totalRemainingEffectiveHours = Number(
    processedUncompleted.reduce((acc, t) => acc + t.effectiveHours, 0).toFixed(1)
  );
  const totalBufferHours = Number((totalRemainingEffectiveHours - totalRemainingBaseHours).toFixed(1));

  // Required weekly pace to finish by targetExamDate
  const requiredWeeklyHours = Number((totalRemainingEffectiveHours / Math.max(1, remainingWeeks)).toFixed(1));
  const isCriticalOverload = requiredWeeklyHours > settings.criticalWeeklyHoursThreshold;

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

    allCalendarDays.push({
      date: dateStr,
      dayOfWeek,
      dayName: dayConfig.name,
      enabled: dayConfig.enabled,
      isWeekend: dayConfig.isWeekend,
      timeSlot: dayConfig.timeSlot || (dayConfig.isWeekend ? "Pomeriggio" : "Sera"),
      preferredSubject: dayConfig.defaultSubject || "Misto",
      maxHours: dayConfig.isWeekend ? settings.weekendStudyHours : settings.weekdayStudyHours,
      allocatedHours: 0,
      weekIndex,
      isPast,
      isToday,
      isFuture,
      dayStatus: isPast ? "pending" : "scheduled", // "completed", "skipped", "scheduled", "rest"
      topics: []
    });

    curDate.setDate(curDate.getDate() + 1);
    dayOffset++;
  }

  // 3. Populate PAST DAYS in calendar
  let pastDaysStudied = 0;
  let pastDaysSkipped = 0;
  let totalPastHours = 0;

  allCalendarDays.filter(d => d.isPast).forEach(day => {
    // Find topics completed on this exact date
    const completedOnThisDay = topics.filter(t => t.isCompleted && t.completedDate === day.date);

    if (completedOnThisDay.length > 0) {
      day.dayStatus = "completed";
      day.topics = completedOnThisDay.map(t => ({
        ...t,
        effectiveHours: t.oreStimate,
        assignedDate: day.date,
        assignedWeek: day.weekIndex,
        assignedDayName: day.dayName
      }));
      day.allocatedHours = Number(completedOnThisDay.reduce((acc, t) => acc + (Number(t.oreStimate) || 0), 0).toFixed(1));
      pastDaysStudied++;
      totalPastHours += day.allocatedHours;
    } else {
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
  const analisiQueue = processedUncompleted
    .filter(t => t.materia.toLowerCase().includes("analisi"))
    .sort(sortBySequentialId);

  const geometriaQueue = processedUncompleted
    .filter(t => t.materia.toLowerCase().includes("geometria"))
    .sort(sortBySequentialId);

  // Active / Future days where new study can be allocated (Today + Future)
  const activeAndFutureDays = allCalendarDays.filter(d => (d.isToday || d.isFuture) && d.enabled);

  activeAndFutureDays.forEach(day => {
    let capacityLeft = day.maxHours;

    while (capacityLeft > 0.4) {
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
      criticalWeeklyHoursThreshold: settings.criticalWeeklyHoursThreshold,
      isCriticalOverload,
      excessHours: Number(Math.max(0, requiredWeeklyHours - settings.criticalWeeklyHoursThreshold).toFixed(1)),
      uncompletedCount: processedUncompleted.length,
      targetExamDate: settings.targetExamDate,
      currentSimulatedDate: settings.currentSimulatedDate,
      roadmapStartDate: settings.roadmapStartDate,
      // Historical stats
      pastDaysStudied,
      pastDaysSkipped,
      totalPastHours: Number(totalPastHours.toFixed(1)),
      historyCount: historyDays.length
    },
    weeklyPlans,
    currentWeekPlan,
    calendarDays: allCalendarDays,
    historyDays,
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
                {metrics.requiredWeeklyHours}h / sett. (Max {metrics.criticalWeeklyHoursThreshold}h)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Il ritmo di studio è ben calibrato per un lavoratore full-time: le serate e i weekend coprono interamente il programma entro il 10 Gennaio 2027.
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
              1. Ottimizzazione Weekend
            </div>
            <p className="text-rose-200/80">
              Aumenta le ore nei blocchi di Sabato e Domenica da 4.5h a 6h per sgravare le sere infrasettimanali dopo il lavoro.
            </p>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-rose-500/20">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5 mb-1">
              <IconClock className="w-4 h-4 text-amber-400" />
              2. Anticipo Serale
            </div>
            <p className="text-rose-200/80">
              Inizia la sessione serale alle 19:00 anziché 19:30, oppure effettua un micro-slot da 30 min di ripasso definizioni prima di pranzo.
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


// --- src/components/Dashboard.js ---



function Dashboard({ progress, metrics, onTabChange }) {
  const { analisi, geometria, global } = progress;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
    </div>
  );
}


// --- src/components/WeeklyTodo.js ---



function WeeklyTodo({ weeklyPlans, onToggleComplete, settings }) {
  // Default to the week containing Today
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(() => {
    const currentWeek = weeklyPlans.find(w => w.hasToday);
    return currentWeek ? currentWeek.weekNumber : 1;
  });

  const [filterSubject, setFilterSubject] = useState("all");

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

                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500 font-mono">Carico:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {day.allocatedHours}h / {day.maxHours}h max
                  </span>
                </div>
              </div>

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
                <div className="space-y-2.5">
                  {visibleTopics.map(topic => {
                    const isAnalisi = topic.materia.toLowerCase().includes("analisi");

                    return (
                      <div
                        key={topic.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          topic.isCompleted
                            ? "bg-slate-950/60 border-slate-800/50 opacity-60"
                            : isAnalisi
                            ? "bg-slate-950/80 hover:bg-slate-900 border-emerald-500/20 hover:border-emerald-500/40"
                            : "bg-slate-950/80 hover:bg-slate-900 border-indigo-500/20 hover:border-indigo-500/40"
                        }`}
                      >
                        {/* Checkbox and Title */}
                        <div className="flex items-start space-x-3.5 flex-1 min-w-0 pr-2">
                          <button
                            type="button"
                            onClick={() => onToggleComplete(topic.id)}
                            className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-colors flex-shrink-0 ${
                              topic.isCompleted
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : "border-slate-600 hover:border-slate-400 bg-slate-900"
                            }`}
                            title={topic.isCompleted ? "Segna come da fare" : "Segna come completato"}
                          >
                            {topic.isCompleted && <IconCheck className="w-3.5 h-3.5" />}
                          </button>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              {/* Subject Badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isAnalisi
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              }`}>
                                {topic.materia}
                              </span>

                              {/* Topic ID */}
                              <span className="text-[11px] font-mono font-bold text-slate-300">
                                {topic.id}
                              </span>

                              {/* Chapter */}
                              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                • {topic.capitolo}
                              </span>

                              {/* Buffer +20% badge */}
                              {topic.hasBuffer && (
                                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                  +20% Buffer Priorità
                                </span>
                              )}

                              {topic.isCompleted && topic.completedDate && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                  ✓ Svolto il {formatDateDisplay(topic.completedDate)}
                                </span>
                              )}
                            </div>

                            <p className={`text-xs md:text-sm font-medium ${
                              topic.isCompleted ? "line-through text-slate-500" : "text-slate-200"
                            }`}>
                              {topic.argomento}
                            </p>

                            {topic.note && (
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                Obiettivo: {topic.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Meta Pills (Hours, Difficulty, Priority) */}
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0 flex-shrink-0 self-end sm:self-center">
                          {/* Hours */}
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-white">
                              {topic.effectiveHours}h
                            </div>
                            {topic.hasBuffer && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                (base {topic.oreStimate}h)
                              </div>
                            )}
                          </div>

                          {/* Difficulty and Priority indicators */}
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] text-slate-400">
                              Priorità: <strong className="text-amber-400">{topic.prioritaEsame}/5</strong>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Difficoltà: <strong className="text-cyan-400">{topic.difficolta}/5</strong>
                            </span>
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



function HistoryLog({ historyDays, metrics, onAdvanceDate, onRetrocedeDate, onSetDate }) {
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

      {/* Timeline of Days */}
      <div className="space-y-3">
        {filteredHistory.map(day => {
          const isToday = day.isToday;
          const isSkipped = day.dayStatus === "skipped";
          const isCompleted = day.dayStatus === "completed";

          return (
            <div
              key={day.date}
              className={`p-4 md:p-5 rounded-2xl border transition backdrop-blur-md ${
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

                <div className="text-xs text-slate-500 font-mono">
                  {day.timeSlot}
                </div>
              </div>

              {/* Topics list for this day */}
              {day.topics.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/70 space-y-2">
                  {day.topics.map(t => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-xs bg-black/30 p-2.5 rounded-xl border border-slate-800/60"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-200">
                          {t.id}
                        </span>
                        <span className="text-slate-300">
                          {t.argomento}
                        </span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">
                        {t.effectiveHours}h
                      </span>
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



function TopicsTable({ topics, onToggleComplete, onBatchUpdate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
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
      if (statusFilter === "completed" && !t.isCompleted) return false;
      if (statusFilter === "todo" && t.isCompleted) return false;

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
            <option value="todo">Solo Da Fare</option>
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
                <th className="py-3 px-3 w-24 text-center">Ore Stimate</th>
                <th className="py-3 px-3 w-20 text-center">Difficoltà</th>
                <th className="py-3 px-3 w-20 text-center">Priorità</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTopics.map((topic) => {
                const isAnalisi = topic.materia.toLowerCase().includes("analisi");
                const hasBuffer = (topic.prioritaEsame >= 4 || topic.difficolta >= 4);

                return (
                  <tr
                    key={topic.id}
                    className={`hover:bg-slate-850/60 transition ${
                      topic.isCompleted ? "bg-slate-950/40 opacity-60" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleComplete(topic.id)}
                        className={`w-5 h-5 mx-auto rounded-lg border flex items-center justify-center transition-colors ${
                          topic.isCompleted
                            ? "bg-emerald-500 border-emerald-400 text-white"
                            : "border-slate-600 hover:border-slate-400 bg-slate-900"
                        }`}
                        title={topic.isCompleted ? "Segna come incompleto" : "Segna come completato"}
                      >
                        {topic.isCompleted && <IconCheck className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-200">
                      {topic.id}
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
                      <div className="font-semibold text-slate-200 text-xs">
                        {topic.argomento}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Capitolo: <span className="text-slate-300">{topic.capitolo}</span>
                        {topic.fonti && <span className="text-slate-500"> • {topic.fonti}</span>}
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="py-3 px-3 text-center">
                      <div className="font-mono font-bold text-slate-200">
                        {topic.oreStimate}h
                      </div>
                      {hasBuffer && (
                        <span className="text-[10px] text-amber-400/90 font-mono">
                          +20% buff.
                        </span>
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





function FileImporter({ topics, settings, onTopicsUpdated, onSettingsUpdated }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
      topics
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



function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [formData, setFormData] = useState({ ...settings });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl shadow-cyan-950/40 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <IconSettings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Parametri di Ribilanciamento</h3>
              <p className="text-xs text-slate-400">Personalizza orari di studio e date d'esame</p>
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
              <label className="block text-slate-300 font-semibold mb-1">
                Data Odierna (Simulata)
              </label>
              <input
                type="date"
                value={formData.currentSimulatedDate}
                onChange={(e) => handleChange("currentSimulatedDate", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Full-time work and Study Hours */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <IconBriefcase className="w-4 h-4" />
              <span>Orari Lavoratore Full-Time</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">
                  Ore serali (Lun-Ven)
                </label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="6"
                    value={formData.weekdayStudyHours}
                    onChange={(e) => handleChange("weekdayStudyHours", parseFloat(e.target.value) || 2.5)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/sera</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Ore weekend (Sab-Dom)
                </label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={formData.weekendStudyHours}
                    onChange={(e) => handleChange("weekendStudyHours", parseFloat(e.target.value) || 4.5)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-500 font-mono">h/giorno</span>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Threshold & Buffer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <IconFlame className="w-3.5 h-3.5 text-rose-400" />
                Soglia Critica Settimanale
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="40"
                  value={formData.criticalWeeklyHoursThreshold}
                  onChange={(e) => handleChange("criticalWeeklyHoursThreshold", parseFloat(e.target.value) || 25)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
                <span className="text-slate-500 font-mono">h/sett.</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Scatta l'alert visivo se superata</p>
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


// --- src/app.js ---












const LOCAL_STORAGE_KEY_TOPICS = "unimore_rebalancer_topics_v2";
const LOCAL_STORAGE_KEY_SETTINGS = "unimore_rebalancer_settings_v2";

function App() {
  // Load saved state from localStorage if available, or use official UNIMORE defaults
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TOPICS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load topics from localStorage", e);
    }
    return INITIAL_TOPICS;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load settings from localStorage", e);
    }
    return DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "weekly" | "history" | "topics" | "import"
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("");

  // Save to localStorage on change with visual confirmation
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

  // Reactive Rebalancing calculation
  const rebalancedPlan = useMemo(() => {
    return rebalanceStudyPlan(topics, settings);
  }, [topics, settings]);

  const { metrics, weeklyPlans, progress, historyDays } = rebalancedPlan;

  // Toggle completion of a single topic with automatic timestamp
  const handleToggleComplete = (topicId) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const willComplete = !t.isCompleted;
          return {
            ...t,
            isCompleted: willComplete,
            completedDate: willComplete ? (t.completedDate || settings.currentSimulatedDate) : null
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
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
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
            </div>

            {/* Countdown pill */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-mono">
              <IconClock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white">{metrics.remainingDays} gg</span>
            </div>

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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-12">
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
          />
        )}

        {activeTab === "weekly" && (
          <WeeklyTodo
            weeklyPlans={weeklyPlans}
            onToggleComplete={handleToggleComplete}
            settings={settings}
          />
        )}

        {activeTab === "history" && (
          <HistoryLog
            historyDays={historyDays}
            metrics={metrics}
            onAdvanceDate={handleAdvanceDate}
            onRetrocedeDate={handleRetrocedeDate}
            onSetDate={(newDate) => setSettings(prev => ({ ...prev, currentSimulatedDate: newDate }))}
          />
        )}

        {activeTab === "topics" && (
          <TopicsTable
            topics={topics}
            onToggleComplete={handleToggleComplete}
            onBatchUpdate={handleTopicsUpdated}
          />
        )}

        {activeTab === "import" && (
          <FileImporter
            topics={topics}
            settings={settings}
            onTopicsUpdated={handleTopicsUpdated}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
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
      />
    </div>
  );
}


// Mount React Root
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));
