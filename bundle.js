
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
  criticalWeeklyHoursThreshold: 35.0, // Dynamic threshold elevated with afternoon slot
  enableAfternoonSlot: true, // Slot Pomeridiano attivo
  afternoonStudyHours: 2.5, // 16:30 - 19:00 (2.5h)
  eveningStudyHours: 2.5, // 19:30 - 22:00 (2.5h)
  weekdayStudyHours: 5.0, // Somma: Pomeriggio (2.5h) + Sera (2.5h)
  weekendStudyHours: 4.5, // Dedicated blocks (Sat, Sun)
  highPriorityThreshold: 4, // 4 or 5 triggers high priority buffer
  bufferMultiplier: 1.2, // +20% time buffer
  interleaveSubjects: true, // Alternate Analisi and Geometria across days
  studyDays: {
    1: { name: "Lunedì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Pomeriggio (16:30 - 19:00) + Sera (19:30 - 22:00)" },
    2: { name: "Martedì", enabled: true, isWeekend: false, defaultSubject: "Geometria", timeSlot: "Pomeriggio (16:30 - 19:00) + Sera (19:30 - 22:00)" },
    3: { name: "Mercoledì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Pomeriggio (16:30 - 19:00) + Sera (19:30 - 22:00)" },
    4: { name: "Giovedì", enabled: true, isWeekend: false, defaultSubject: "Geometria", timeSlot: "Pomeriggio (16:30 - 19:00) + Sera (19:30 - 22:00)" },
    5: { name: "Venerdì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Pomeriggio (16:30 - 19:00) + Sera (19:00 - 21:00)" },
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

  // Effective study capacities and dynamic critical threshold
  const enableAfternoon = settings.enableAfternoonSlot !== false;
  const afternoonHours = enableAfternoon ? Number(settings.afternoonStudyHours !== undefined ? settings.afternoonStudyHours : 2.5) : 0;
  const eveningHours = Number(settings.eveningStudyHours !== undefined ? settings.eveningStudyHours : (settings.weekdayStudyHours || 2.5));
  const effectiveWeekdayHours = Number((afternoonHours + eveningHours).toFixed(1));
  const effectiveWeekendHours = Number(settings.weekendStudyHours || 4.5);

  // Dynamic Critical Burnout Threshold calculation:
  // With afternoon slot, nominal weekly capacity is (5 * 5h) + (2 * 4.5h) = 34h.
  // The burnout threshold dynamically raises to 35.0h (or custom settings).
  const nominalWeeklyCapacity = Number(((effectiveWeekdayHours * 5) + (effectiveWeekendHours * 2)).toFixed(1));
  const dynamicCriticalThreshold = (customSettings && customSettings.criticalWeeklyHoursThreshold)
    ? Number(customSettings.criticalWeeklyHoursThreshold)
    : (enableAfternoon ? 35.0 : 25.0);

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

    const timeSlotDescription = dayConfig.isWeekend
      ? (dayConfig.timeSlot || "Mattina + Pomeriggio")
      : (enableAfternoon
          ? `Pomeriggio (16:30 - 19:00, ${afternoonHours}h) + Sera (19:30 - 22:00, ${eveningHours}h)`
          : `Sera (19:30 - 22:00, ${eveningHours}h)`);

    const maxDayHours = dayConfig.isWeekend ? effectiveWeekendHours : effectiveWeekdayHours;

    allCalendarDays.push({
      date: dateStr,
      dayOfWeek,
      dayName: dayConfig.name,
      enabled: dayConfig.enabled,
      isWeekend: dayConfig.isWeekend,
      timeSlot: timeSlotDescription,
      preferredSubject: dayConfig.defaultSubject || "Misto",
      maxHours: maxDayHours,
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

  // 3. Populate COMPLETED TOPICS on their completion dates (Past + Today + Future if completed ahead)
  let pastDaysStudied = 0;
  let pastDaysSkipped = 0;
  let totalPastHours = 0;

  allCalendarDays.forEach(day => {
    // Find topics completed on this exact date
    const completedOnThisDay = topics.filter(t => t.isCompleted && t.completedDate === day.date);

    if (completedOnThisDay.length > 0) {
      if (day.isPast || day.isToday) {
        day.dayStatus = "completed";
      }
      day.topics = completedOnThisDay.map(t => ({
        ...t,
        effectiveHours: t.oreStimate,
        assignedDate: day.date,
        assignedWeek: day.weekIndex,
        assignedDayName: day.dayName
      }));
      day.allocatedHours = Number(completedOnThisDay.reduce((acc, t) => acc + (Number(t.oreStimate) || 0), 0).toFixed(1));
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
  const analisiQueue = processedUncompleted
    .filter(t => t.materia.toLowerCase().includes("analisi"))
    .sort(sortBySequentialId);

  const geometriaQueue = processedUncompleted
    .filter(t => t.materia.toLowerCase().includes("geometria"))
    .sort(sortBySequentialId);

  // Active / Future days where new study can be allocated (Today + Future)
  const activeAndFutureDays = allCalendarDays.filter(d => (d.isToday || d.isFuture) && d.enabled);

  activeAndFutureDays.forEach(day => {
    let capacityLeft = Math.max(0, Number((day.maxHours - day.allocatedHours).toFixed(2)));

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
      criticalWeeklyHoursThreshold: dynamicCriticalThreshold,
      nominalWeeklyCapacity,
      effectiveWeekdayHours,
      effectiveWeekendHours,
      enableAfternoonSlot: enableAfternoon,
      afternoonStudyHours: afternoonHours,
      eveningStudyHours: eveningHours,
      isCriticalOverload,
      excessHours: Number(Math.max(0, requiredWeeklyHours - dynamicCriticalThreshold).toFixed(1)),
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
                {metrics.requiredWeeklyHours}h / sett. (Soglia Max {metrics.criticalWeeklyHoursThreshold}h)
              </span>
              {metrics.enableAfternoonSlot && (
                <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  +Slot Pomeridiano Attivo
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Il ritmo di studio è ben calibrato: {metrics.enableAfternoonSlot ? "l'unione dello slot pomeridiano (16:30 - 19:00) con le serate e i weekend garantisce sostenibilità elevata senza sovraccarico" : "le serate e i weekend coprono interamente il programma"} entro il 10 Gennaio 2027.
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
              1. Slot Pomeridiano (16:30 - 19:00)
            </div>
            <p className="text-rose-200/80">
              Attiva lo slot pomeridiano nei Parametri: aggiungere 2.5h/pomeriggio aumenta la capacità feriale a 5h/giorno distribuendo lo sforzo.
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


// --- src/components/Dashboard.js ---





function Dashboard({ progress, metrics, onTabChange, topics = [], settings = {} }) {
  const { analisi, geometria, global } = progress;
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isExamSimulatorOpen, setIsExamSimulatorOpen] = useState(false);

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
      totalCompletedHours: Number(compHours.toFixed(1)),
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

function WeeklyTodo({ weeklyPlans, onToggleComplete, settings }) {
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
                        key={topic.id}
                        className={`flex flex-col p-3.5 rounded-2xl border transition-all ${
                          topic.isCompleted
                            ? "bg-slate-950/60 border-slate-800/50 opacity-60"
                            : isAnalisi
                            ? "bg-slate-950/80 hover:bg-slate-900 border-emerald-500/20 hover:border-emerald-500/40"
                            : "bg-slate-950/80 hover:bg-slate-900 border-indigo-500/20 hover:border-indigo-500/40"
                        }`}
                      >
                        {/* Upper row: Checkbox, Title and Meta Pills */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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




function HistoryLog({ historyDays, calendarDays = [], metrics, onAdvanceDate, onRetrocedeDate, onSetDate }) {
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





function FileImporter({
  topics,
  settings,
  onTopicsUpdated,
  onSettingsUpdated,
  fsSyncStatus,
  onConnectFileSystem,
  onDisconnectFileSystem,
  onTriggerManualSave
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isFsAccessSupported = typeof window !== "undefined" && "showOpenFilePicker" in window;

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
  const [formData, setFormData] = useState({
    ...settings,
    enableAfternoonSlot: settings.enableAfternoonSlot !== false,
    afternoonStudyHours: settings.afternoonStudyHours !== undefined ? settings.afternoonStudyHours : 2.5,
    eveningStudyHours: settings.eveningStudyHours !== undefined ? settings.eveningStudyHours : 2.5,
  });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: val
      };

      // Keep weekdayStudyHours synced with afternoon + evening sum
      const afternoon = updated.enableAfternoonSlot ? Number(updated.afternoonStudyHours || 2.5) : 0;
      const evening = Number(updated.eveningStudyHours || 2.5);
      updated.weekdayStudyHours = Number((afternoon + evening).toFixed(1));

      // If user toggles afternoon slot, suggest updated burnout threshold
      if (field === "enableAfternoonSlot") {
        updated.criticalWeeklyHoursThreshold = val ? 35.0 : 25.0;
      }

      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const afternoon = formData.enableAfternoonSlot ? Number(formData.afternoonStudyHours || 2.5) : 0;
    const evening = Number(formData.eveningStudyHours || 2.5);
    const combinedWeekday = Number((afternoon + evening).toFixed(1));

    const toSave = {
      ...formData,
      weekdayStudyHours: combinedWeekday
    };
    onSaveSettings(toSave);
    onClose();
  };

  const currentAfternoon = formData.enableAfternoonSlot ? Number(formData.afternoonStudyHours || 2.5) : 0;
  const currentEvening = Number(formData.eveningStudyHours || 2.5);
  const totalWeekdayCapacity = Number((currentAfternoon + currentEvening).toFixed(1));
  const nominalWeeklyCapacity = Number(((totalWeekdayCapacity * 5) + (Number(formData.weekendStudyHours || 4.5) * 2)).toFixed(1));

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

          {/* Work and Study Slots */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <div className="flex items-center space-x-2">
                <IconBriefcase className="w-4 h-4" />
                <span>Orari & Fasce di Studio Feriali e Weekend</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                Feriale: {totalWeekdayCapacity}h/gg
              </span>
            </div>

            {/* Afternoon Slot (16:30 - 19:00) */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableAfternoonSlot}
                    onChange={(e) => handleChange("enableAfternoonSlot", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <IconSun className="w-4 h-4 text-amber-400" />
                    Slot Pomeridiano (16:30 - 19:00)
                  </span>
                </label>
                <span className="text-[10px] uppercase font-bold text-slate-400">Lun - Ven</span>
              </div>

              {formData.enableAfternoonSlot && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Ore dedicate allo slot pomeridiano:</span>
                  <div className="flex items-center space-x-1.5 w-28">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="4.0"
                      value={formData.afternoonStudyHours}
                      onChange={(e) => handleChange("afternoonStudyHours", parseFloat(e.target.value) || 2.5)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono text-right focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-slate-500 font-mono text-xs">h</span>
                  </div>
                </div>
              )}
            </div>

            {/* Evening & Weekend Slots */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-[11px]">
                  <IconMoon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Slot Serale (19:30 - 22:00)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="5"
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
              <span>Capacità nominale totale settimanale:</span>
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
                  onChange={(e) => handleChange("criticalWeeklyHoursThreshold", parseFloat(e.target.value) || (formData.enableAfternoonSlot ? 35 : 25))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
                <span className="text-slate-500 font-mono">h/sett.</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                {formData.enableAfternoonSlot
                  ? "Consigliata a 35h con slot pomeridiano attivo"
                  : "Consigliata a 25h per solo studio serale"}
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
          topics
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
  }, [topics, settings, fileHandle]);

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
          topics
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
        topics
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
            topics={topics}
            settings={settings}
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
            calendarDays={rebalancedPlan.calendarDays}
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
            fsSyncStatus={fsSyncStatus}
            onConnectFileSystem={handleConnectFileSystem}
            onDisconnectFileSystem={handleDisconnectFileSystem}
            onTriggerManualSave={handleTriggerManualSave}
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

      {/* CLARKE-9000 Isolated Side Companion */}
      <Clarke9000Companion
        progress={progress}
        metrics={metrics}
      />
    </div>
  );
}


// Mount React Root
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));
