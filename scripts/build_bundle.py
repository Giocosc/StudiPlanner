import re
import os

files_order = [
    'src/data/defaultData.js',
    'src/components/Icons.js',
    'src/services/rebalancerEngine.js',
    'src/services/parserService.js',
    'src/services/gitlabSyncService.js',
    'src/services/calendarExportService.js',
    'src/components/AlertBanner.js',
    'src/components/NeuraDeckPromptGenerator.js',
    'src/components/ExamSimulator.js',
    'src/components/MathBugTracker.js',
    'src/components/Clarke9000Companion.js',
    'src/components/Dashboard.js',
    'src/components/ActivityHeatmap.js',
    'src/components/WeeklyTodo.js',
    'src/components/HistoryLog.js',
    'src/components/TopicsTable.js',
    'src/components/FileImporter.js',
    'src/components/SettingsModal.js',
    'src/components/LogStudyModal.js',
    'src/components/TopicDetailModal.js',
    'src/app.js'
]

combined = []
combined.append("""
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
""")

for p in files_order:
    with open(p, 'r', encoding='utf-8') as f:
        code = f.read()
    # Strip import statements (both single and multi-line)
    code = re.sub(r'import\s+[\s\S]*?from\s+[\'"][^\'"]+[\'"];?', '', code)
    code = re.sub(r'import\s+[\'"][^\'"]+[\'"];?', '', code)
    # Strip export keywords
    code = re.sub(r'\bexport\s+(async\s+function|function|const|let|var|class)\b', r'\1', code)
    code = re.sub(r'\bexport\s+default\b', '', code)
    code = re.sub(r'\bexport\s*\{[^}]*\};?', '', code)
    combined.append(f'// --- {p} ---\n' + code)

bundle_js = '\n\n'.join(combined)

bundle_js += """

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
"""

with open('bundle.js', 'w', encoding='utf-8') as f:
    f.write(bundle_js)

print("bundle.js successfully created. Total bytes:", len(bundle_js))
