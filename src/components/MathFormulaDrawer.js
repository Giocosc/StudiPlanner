import React, { useState, useEffect } from "react";
import { IconBookOpen, IconSearch } from "./Icons.js";

export function MathFormulaDrawer({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const formulas = [
    // ANALISI 1 - MACLAURIN
    {
      id: "mac-exp",
      category: "analisi",
      topic: "Sviluppi di Maclaurin",
      name: "Esponenziale e^x",
      formula: "e^x = 1 + x + x²/2! + x³/3! + ... + xⁿ/n! + o(xⁿ)",
      notes: "Valido per ogni x ∈ ℝ. Convergenza uniforme su compatti."
    },
    {
      id: "mac-sin",
      category: "analisi",
      topic: "Sviluppi di Maclaurin",
      name: "Seno sin(x)",
      formula: "sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ... + (-1)ⁿ x²ⁿ⁺¹/(2n+1)! + o(x²ⁿ⁺²)",
      notes: "Funzione dispari: contiene solo potenze dispari. o(x²ⁿ⁺²) grazie all'annullamento del termine pari."
    },
    {
      id: "mac-cos",
      category: "analisi",
      topic: "Sviluppi di Maclaurin",
      name: "Coseno cos(x)",
      formula: "cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ... + (-1)ⁿ x²ⁿ/(2n)! + o(x²ⁿ⁺¹)",
      notes: "Funzione pari: contiene solo potenze pari."
    },
    {
      id: "mac-ln",
      category: "analisi",
      topic: "Sviluppi di Maclaurin",
      name: "Logaritmo ln(1+x)",
      formula: "ln(1+x) = x - x²/2 + x³/3 - x⁴/4 + ... + (-1)ⁿ⁻¹ xⁿ/n + o(xⁿ)",
      notes: "ATTENZIONE: Nessun fattoriale al denominatore! Raggio di convergenza (-1, 1]."
    },
    {
      id: "mac-binom",
      category: "analisi",
      topic: "Sviluppi di Maclaurin",
      name: "Binomiale generalizzato (1+x)^α",
      formula: "(1+x)^α = 1 + αx + [α(α-1)/2!] x² + [α(α-1)(α-2)/3!] x³ + o(x³)",
      notes: "Casi notevoli: √(1+x) = 1 + x/2 - x²/8 + o(x²); 1/(1+x) = 1 - x + x² - x³ + o(x³)."
    },
    {
      id: "mac-tan",
      category: "analisi",
      topic: "Sviluppi di Maclaurin",
      name: "Tangente e Arcotangente",
      formula: "tan(x) = x + x³/3 + 2x⁵/15 + o(x⁵)  |  arctan(x) = x - x³/3 + x⁵/5 + o(x⁶)",
      notes: "arctan(x) ha segni alterni senza fattoriali (simile a ln ma con potenze dispari)."
    },

    // ANALISI 1 - DERIVATE E INTEGRALI
    {
      id: "calc-parti",
      category: "analisi",
      topic: "Calcolo Integrale",
      name: "Integrazione per Parti",
      formula: "∫ f(x) g'(x) dx = f(x) g(x) - ∫ f'(x) g(x) dx",
      notes: "Regola ALPET per scegliere il fattore finito f(x): Arcotangente/Arcoseno, Logaritmo, Polinomio, Esponenziale, Trigonometriche."
    },
    {
      id: "calc-notevoli",
      category: "analisi",
      topic: "Calcolo Integrale",
      name: "Integrali Notevoli Ricorrenti",
      formula: "∫ 1/(x² + a²) dx = (1/a) arctan(x/a) + c\n∫ 1/√(a² - x²) dx = arcsin(x/a) + c\n∫ f'(x)/f(x) dx = ln|f(x)| + c",
      notes: "Fondamentali per l'integrazione di funzioni razionali fratte (decomposizione in fratti semplici)."
    },

    // GEOMETRIA - ALGEBRA LINEARE
    {
      id: "geo-grassmann",
      category: "geometria",
      topic: "Spazi Vettoriali",
      name: "Formula di Grassmann",
      formula: "dim(U + W) = dim(U) + dim(W) - dim(U ∩ W)",
      notes: "Se dim(U ∩ W) = 0 la somma è diretta (U ⊕ W) e dim(U ⊕ W) = dim(U) + dim(W)."
    },
    {
      id: "geo-rouche",
      category: "geometria",
      topic: "Sistemi Lineari",
      name: "Teorema di Rouché-Capelli",
      formula: "Sistema Ax = b compatibile ⟺ rg(A) = rg(A|b) = r",
      notes: "Se compatibile, lo spazio delle soluzioni ha dimensione ∞ⁿ⁻ʳ con n = numero di incognite."
    },
    {
      id: "geo-diag",
      category: "geometria",
      topic: "Diagonalizzazione",
      name: "Criterio di Diagonalizzabilità",
      formula: "A è diagonalizzabile su ℝ ⟺ 1) Tutti gli autovalori sono reali\n2) mg(λᵢ) = ma(λᵢ) ∀ λᵢ",
      notes: "mg(λ) = n - rg(A - λI). Vale sempre 1 ≤ mg(λ) ≤ ma(λ). Se ma(λ)=1 allora sempre mg(λ)=1."
    },
    {
      id: "geo-inv",
      category: "geometria",
      topic: "Matrici",
      name: "Inversione Matrice tramite Aggiunta",
      formula: "A⁻¹ = (1 / det(A)) · adj(A)ᵀ",
      notes: "adj(A) è la matrice dei complementi algebrici (-1)ⁱ⁺ʲ det(Aᵢⱼ)."
    },
    {
      id: "geo-gramschmidt",
      category: "geometria",
      topic: "Prodotti Scalari",
      name: "Ortogonalizzazione di Gram-Schmidt",
      formula: "u₁ = v₁\nu₂ = v₂ - [⟨v₂, u₁⟩ / ||u₁||²] u₁\nu₃ = v₃ - [⟨v₃, u₁⟩ / ||u₁||²] u₁ - [⟨v₃, u₂⟩ / ||u₂||²] u₂",
      notes: "Normalizzare dividendo ogni vettore per la sua norma: eᵢ = uᵢ / ||uᵢ||."
    },

    // GEOMETRIA - GEOMETRIA NELLO SPAZIO E CONICHE
    {
      id: "geo-piano",
      category: "geometria",
      topic: "Geometria nello Spazio ℝ³",
      name: "Piano e Distanza Punto-Piano",
      formula: "Piano π: ax + by + cz + d = 0 (normale n = (a, b, c))\nDist(P₀, π) = |a x₀ + b y₀ + c z₀ + d| / √(a² + b² + c²)",
      notes: "Due piani sono paralleli se le normali sono proporzionali; perpendicolari se ⟨n₁, n₂⟩ = 0."
    },
    {
      id: "geo-coniche",
      category: "geometria",
      topic: "Coniche nel Piano",
      name: "Invarianti Metrici e Classificazione",
      formula: "I₁ = tr(A₀₀) = a₁₁ + a₂₂\nI₂ = det(A₀₀) = a₁₁ a₂₂ - a₁₂²\nI₃ = det(A) [matrice completa 3×3]",
      notes: "Se I₃ ≠ 0 (non degenere):\n• I₂ > 0: ELLISSE (Reale se I₁·I₃ < 0)\n• I₂ < 0: IPERBOLE (Equilatera se I₁ = 0)\n• I₂ = 0: PARABOLA"
    }
  ];

  const filtered = formulas.filter(f => {
    const matchCat = activeCategory === "all" || f.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      f.name.toLowerCase().includes(q) ||
      f.topic.toLowerCase().includes(q) ||
      f.formula.toLowerCase().includes(q) ||
      f.notes.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-2xl bg-[#0b101e] border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <IconBookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Formulario Rapido
                <span className="text-[10px] uppercase font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  F2
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Sviluppi di Maclaurin, integrali notevoli, Grassmann, autovalori e coniche
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            title="Chiudi drawer (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-950/40 space-y-3">
          <div className="relative">
            <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cerca formula (es. seno, logaritmo, autovalori, Grassmann, coniche)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex space-x-2">
            {[
              { id: "all", label: "Tutte le Formule" },
              { id: "analisi", label: "Analisi Matematica 1" },
              { id: "geometria", label: "Geometria e Algebra" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                  activeCategory === tab.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formula Cards Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nessuna formula corrisponde alla ricerca.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition ${
                  item.category === "analisi"
                    ? "bg-emerald-950/15 border-emerald-500/25 hover:border-emerald-500/40"
                    : "bg-indigo-950/15 border-indigo-500/25 hover:border-indigo-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.category === "analisi"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  }`}>
                    {item.topic}
                  </span>
                  <span className="text-xs font-bold text-white">{item.name}</span>
                </div>

                {/* Formula Box */}
                <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-3 my-2 font-mono text-xs text-amber-200 whitespace-pre-wrap select-all">
                  {item.formula}
                </div>

                {/* Notes */}
                <p className="text-[11px] text-slate-400 italic">
                  💡 {item.notes}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 text-center text-[11px] text-slate-500 flex items-center justify-between px-5">
          <span>StudiPlanner UNIMORE — Ingegneria Informatica</span>
          <span>Premi <strong>F2</strong> o <strong>Esc</strong></span>
        </div>
      </div>
    </div>
  );
}
