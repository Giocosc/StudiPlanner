import re
import os

files_order = [
    'src/data/defaultData.js',
    'src/components/Icons.js',
    'src/services/rebalancerEngine.js',
    'src/services/parserService.js',
    'src/components/AlertBanner.js',
    'src/components/Dashboard.js',
    'src/components/ActivityHeatmap.js',
    'src/components/WeeklyTodo.js',
    'src/components/HistoryLog.js',
    'src/components/TopicsTable.js',
    'src/components/FileImporter.js',
    'src/components/SettingsModal.js',
    'src/app.js'
]

combined = []
combined.append("""
// In-browser globals from CDN
const { useState, useEffect, useMemo, useRef, useCallback } = React;
""")

for p in files_order:
    with open(p, 'r', encoding='utf-8') as f:
        code = f.read()
    # Strip import statements (both single and multi-line)
    code = re.sub(r'import\s+[\s\S]*?from\s+[\'"][^\'"]+[\'"];?', '', code)
    code = re.sub(r'import\s+[\'"][^\'"]+[\'"];?', '', code)
    # Strip export keywords
    code = re.sub(r'\bexport\s+const\b', 'const', code)
    code = re.sub(r'\bexport\s+function\b', 'function', code)
    code = re.sub(r'\bexport\s+default\b', '', code)
    code = re.sub(r'\bexport\s*\{[^}]*\};?', '', code)
    combined.append(f'// --- {p} ---\n' + code)

bundle_js = '\n\n'.join(combined)

bundle_js += """

// Mount React Root
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));
"""

with open('bundle.js', 'w', encoding='utf-8') as f:
    f.write(bundle_js)

print("bundle.js successfully created. Total bytes:", len(bundle_js))
