import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Code2,
  Play,
  RotateCcw,
  Download,
  Terminal,
  Trash2,
  Monitor,
  Smartphone,
  Sparkles,
  Check,
  Columns2,
  Maximize2,
} from 'lucide-react';

interface CodeEditorViewProps {
  currentResponse: string | null;
  onSendQuery: (query: string) => void;
  onClearResponse: () => void;
  onGoHome: () => void;
}

type CodeTab = 'html' | 'css' | 'js';

interface ConsoleEntry {
  id: number;
  level: 'log' | 'warn' | 'error';
  text: string;
  time: string;
}

interface StarterTemplate {
  id: string;
  label: string;
  html: string;
  css: string;
  js: string;
}

const TEMPLATES: StarterTemplate[] = [
  {
    id: 'starter',
    label: 'Page interactive',
    html: `<main class="card">
  <span class="badge">Temps réel</span>
  <h1>Mon éditeur de code</h1>
  <p>Modifie le <strong>HTML</strong>, le <strong>CSS</strong> ou le <strong>JS</strong> à gauche : le résultat apparaît instantanément ici.</p>
  <div class="actions">
    <button id="btn">Cliquer ici (0)</button>
    <button id="colorBtn" class="secondary">Changer la couleur</button>
  </div>
</main>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  color: #0f172a;
}

.card {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  background: #dbeafe;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: #2563eb;
  color: #ffffff;
  transition: transform 0.12s ease, opacity 0.15s ease;
}

button:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

button.secondary {
  background: #f1f5f9;
  color: #0f172a;
}`,
    js: `let count = 0;
const btn = document.getElementById('btn');
const colorBtn = document.getElementById('colorBtn');
const palette = ['#2563eb', '#059669', '#db2777', '#d97706', '#7c3aed'];
let colorIdx = 0;

btn.addEventListener('click', () => {
  count += 1;
  btn.textContent = \`Cliquer ici (\${count})\`;
  console.log('Compteur :', count);
});

colorBtn.addEventListener('click', () => {
  colorIdx = (colorIdx + 1) % palette.length;
  btn.style.background = palette[colorIdx];
  console.log('Couleur appliquée :', palette[colorIdx]);
});`,
  },
  {
    id: 'canvas',
    label: 'Animation Canvas',
    html: `<div class="wrap">
  <canvas id="scene" width="420" height="280"></canvas>
  <p>Déplace la souris sur le canvas</p>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #090d16;
  color: #cbd5e1;
  font-family: system-ui, sans-serif;
}

.wrap {
  text-align: center;
}

canvas {
  border-radius: 14px;
  border: 1px solid #1e293b;
  background: #0f172a;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  max-width: 100%;
}

p {
  margin-top: 12px;
  font-size: 13px;
}`,
    js: `const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

const orbs = Array.from({ length: 18 }, (_, i) => ({
  angle: (i / 18) * Math.PI * 2,
  dist: 30 + (i % 4) * 20,
  hue: i * 20
}));

function loop(t) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const orb of orbs) {
    orb.angle += 0.025;
    const x = mouse.x + Math.cos(orb.angle) * orb.dist;
    const y = mouse.y + Math.sin(orb.angle * 1.3) * orb.dist;
    ctx.beginPath();
    ctx.arc(x, y, 6 + Math.sin(t / 250 + orb.angle) * 2, 0, Math.PI * 2);
    ctx.fillStyle = \`hsl(\${orb.hue}, 90%, 62%)\`;
    ctx.fill();
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);`,
  },
  {
    id: 'todo',
    label: 'Mini Liste de tâches',
    html: `<section class="app">
  <h2>Mes tâches</h2>
  <form id="form">
    <input id="input" placeholder="Nouvelle tâche..." autocomplete="off" />
    <button type="submit">Ajouter</button>
  </form>
  <ul id="list"></ul>
</section>`,
    css: `body {
  font-family: system-ui, sans-serif;
  background: #f1f5f9;
  margin: 0;
  padding: 28px 16px;
  color: #0f172a;
}

.app {
  max-width: 400px;
  margin: 0 auto;
  background: #fff;
  padding: 22px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

h2 { margin: 0 0 14px; font-size: 20px; }

form { display: flex; gap: 8px; margin-bottom: 14px; }

input {
  flex: 1;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
}

button {
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 14px;
  font-weight: 600;
  cursor: pointer;
}

ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }

li {
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

li.done { text-decoration: line-through; color: #94a3b8; }`,
    js: `const form = document.getElementById('form');
const input = document.getElementById('input');
const list = document.getElementById('list');

function addTask(label) {
  const li = document.createElement('li');
  li.textContent = label;
  li.addEventListener('click', () => li.classList.toggle('done'));
  list.appendChild(li);
}

['Tester le HTML', 'Modifier le CSS', 'Coder en JS'].forEach(addTask);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) return;
  addTask(val);
  console.log('Tâche ajoutée :', val);
  input.value = '';
});`,
  },
];

function buildPreviewDocument(html: string, css: string, js: string, instanceToken: number): string {
  const safeJs = js.replace(/<\/script>/gi, '<\\/script>');
  const safeCss = css.replace(/<\/style>/gi, '<\\/style>');

  const consoleBridge = `<script>
(function() {
  var TOKEN = ${instanceToken};
  function send(level, args) {
    try {
      var text = Array.prototype.slice.call(args).map(function(arg) {
        if (typeof arg === 'string') return arg;
        try { return JSON.stringify(arg); } catch (e) { return String(arg); }
      }).join(' ');
      window.parent.postMessage({ source: 'code-preview', token: TOKEN, level: level, text: text }, '*');
    } catch (e) {}
  }
  var origLog = console.log;
  var origWarn = console.warn;
  var origError = console.error;
  console.log = function() { send('log', arguments); if (origLog) origLog.apply(console, arguments); };
  console.warn = function() { send('warn', arguments); if (origWarn) origWarn.apply(console, arguments); };
  console.error = function() { send('error', arguments); if (origError) origError.apply(console, arguments); };
  window.addEventListener('error', function(ev) {
    send('error', [ev.message + (ev.lineno ? ' (ligne ' + ev.lineno + ')' : '')]);
  });
  window.addEventListener('unhandledrejection', function(ev) {
    send('error', ['Promesse rejetée: ' + String(ev.reason)]);
  });
})();
</script>`;

  const trimmedHtml = html.trim();
  const isFullHtmlDoc = /<!doctype\s+html/i.test(trimmedHtml) || /<html[\s>]/i.test(trimmedHtml);

  if (isFullHtmlDoc) {
    let doc = html;
    const styleBlock = `<style>${safeCss}</style>`;
    const scriptBlock = `<script>${safeJs}</script>`;
    if (/<\/head>/i.test(doc)) {
      doc = doc.replace(/<\/head>/i, `${consoleBridge}${styleBlock}</head>`);
    } else {
      doc = `${consoleBridge}${styleBlock}${doc}`;
    }
    if (/<\/body>/i.test(doc)) {
      doc = doc.replace(/<\/body>/i, `${scriptBlock}</body>`);
    } else {
      doc = `${doc}${scriptBlock}`;
    }
    return doc;
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${consoleBridge}
  <style>${safeCss}</style>
</head>
<body>
${html}
<script>
try {
${safeJs}
} catch (err) {
  console.error(err && err.message ? err.message : String(err));
}
</script>
</body>
</html>`;
}

export default function CodeEditorView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: CodeEditorViewProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('html');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('starter');
  const [htmlCode, setHtmlCode] = useState<string>(TEMPLATES[0].html);
  const [cssCode, setCssCode] = useState<string>(TEMPLATES[0].css);
  const [jsCode, setJsCode] = useState<string>(TEMPLATES[0].js);

  const [debouncedBundle, setDebouncedBundle] = useState(() => ({
    html: TEMPLATES[0].html,
    css: TEMPLATES[0].css,
    js: TEMPLATES[0].js,
    nonce: 1,
  }));

  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const logIdRef = useRef(1);

  const activeCode =
    activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode;

  const setActiveCode = useCallback(
    (next: string) => {
      if (activeTab === 'html') setHtmlCode(next);
      else if (activeTab === 'css') setCssCode(next);
      else setJsCode(next);
    },
    [activeTab]
  );

  // Real-time live preview update (fast 110ms debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setConsoleLogs([]);
      setDebouncedBundle((prev) => ({
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        nonce: prev.nonce + 1,
      }));
    }, 110);
    return () => clearTimeout(timer);
  }, [htmlCode, cssCode, jsCode]);

  const forceRefreshPreview = useCallback(() => {
    setConsoleLogs([]);
    setDebouncedBundle((prev) => ({
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      nonce: prev.nonce + 1,
    }));
  }, [htmlCode, cssCode, jsCode]);

  // Listen for console output from the live preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
        return;
      }
      const data = event.data;
      if (!data || data.source !== 'code-preview') return;
      if (data.token !== debouncedBundle.nonce) return;

      const level: 'log' | 'warn' | 'error' =
        data.level === 'error' || data.level === 'warn' ? data.level : 'log';
      const now = new Date();
      const time = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setConsoleLogs((prev) => [
        ...prev.slice(-49),
        {
          id: logIdRef.current++,
          level,
          text: String(data.text ?? ''),
          time,
        },
      ]);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [debouncedBundle.nonce]);

  // Resizable split drag handling
  useEffect(() => {
    if (!isDraggingSplit) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const rawPct = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(72, Math.max(28, rawPct));
      setSplitPercent(clamped);
    };

    const handleMouseUp = () => {
      setIsDraggingSplit(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplit]);

  const previewSrcDoc = useMemo(
    () =>
      buildPreviewDocument(
        debouncedBundle.html,
        debouncedBundle.css,
        debouncedBundle.js,
        debouncedBundle.nonce
      ),
    [debouncedBundle]
  );

  const lineCount = useMemo(() => activeCode.split('\n').length, [activeCode]);

  const errorCount = useMemo(
    () => consoleLogs.filter((entry) => entry.level === 'error').length,
    [consoleLogs]
  );

  const handleEditorScroll = () => {
    if (editorRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const updated = activeCode.slice(0, start) + '  ' + activeCode.slice(end);
      setActiveCode(updated);
      requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = start + 2;
          editorRef.current.selectionEnd = start + 2;
        }
      });
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      forceRefreshPreview();
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const found = TEMPLATES.find((t) => t.id === templateId);
    if (!found) return;
    setSelectedTemplateId(found.id);
    setHtmlCode(found.html);
    setCssCode(found.css);
    setJsCode(found.js);
    setConsoleLogs([]);
    setDebouncedBundle((prev) => ({
      html: found.html,
      css: found.css,
      js: found.js,
      nonce: prev.nonce + 1,
    }));
  };

  const handleResetTemplate = () => {
    handleTemplateChange(selectedTemplateId);
  };

  const handleDownloadHtml = () => {
    const exportHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mon Projet</title>
  <style>
${cssCode}
  </style>
</head>
<body>
${htmlCode}
<script>
${jsCode}
</script>
</body>
</html>`;
    const blob = new Blob([exportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projet-code.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1200);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commandInput.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setCommandInput('');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#18181b] text-[#e4e4e7] font-sans antialiased overflow-hidden">
      {/* Top IDE Bar */}
      <header className="h-[48px] bg-[#141417] border-b border-[#27272a] px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Brand + Project / Command Input */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 shrink-0"
          >
            <div className="w-7 h-7 rounded-md bg-[#2563eb] text-white flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[14px] text-white tracking-tight hidden sm:inline shrink-0">
              CodeStudio
            </span>
          </button>

          <form onSubmit={handleCommandSubmit} className="shrink-0">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="mon-projet"
              autoComplete="off"
              aria-label="Nom du projet ou commande"
              className="w-[140px] sm:w-[190px] h-[30px] rounded-md bg-[#202024] hover:bg-[#27272c] focus:bg-[#27272c] border border-[#323238] focus:border-[#3b82f6] px-2.5 text-[12.5px] text-white placeholder-[#71717a] outline-none transition-colors"
            />
          </form>

          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            aria-label="Modèle de départ"
            className="hidden md:block h-[30px] rounded-md bg-[#202024] border border-[#323238] px-2 text-[12px] text-[#d4d4d8] outline-none cursor-pointer"
          >
            {TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                Modèle : {tpl.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="hidden lg:inline-flex items-center gap-1.5 text-[11.5px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Temps réel
          </span>

          <button
            type="button"
            onClick={forceRefreshPreview}
            title="Actualiser l'aperçu (Ctrl+Entrée)"
            className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[12px] font-medium cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Exécuter</span>
          </button>

          <button
            type="button"
            onClick={handleResetTemplate}
            title="Réinitialiser le modèle"
            className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md bg-[#202024] hover:bg-[#27272c] border border-[#323238] text-[#d4d4d8] text-[12px] cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Réinitialiser</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadHtml}
            title="Télécharger en .html"
            className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md bg-[#202024] hover:bg-[#27272c] border border-[#323238] text-[#d4d4d8] text-[12px] cursor-pointer transition-colors"
          >
            {savedNotice ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden lg:inline">
              {savedNotice ? 'Téléchargé' : 'Exporter'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewExpanded((v) => !v)}
            title={previewExpanded ? 'Afficher éditeur + aperçu' : 'Agrandir l’aperçu'}
            className={`inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md border text-[12px] cursor-pointer transition-colors ${
              previewExpanded
                ? 'bg-[#3b82f6]/20 border-[#3b82f6]/50 text-[#93c5fd]'
                : 'bg-[#202024] hover:bg-[#27272c] border-[#323238] text-[#d4d4d8]'
            }`}
          >
            {previewExpanded ? (
              <Columns2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative"
      >
        {/* Left Pane: Multi-tab Code Editor */}
        {!previewExpanded && (
          <section
            style={{ width: `${splitPercent}%` }}
            className="w-full md:w-auto h-1/2 md:h-full flex flex-col bg-[#1e1e1e] border-b md:border-b-0 border-[#27272a] min-w-0 max-md:!w-full"
          >
            {/* Editor File Tabs */}
            <div className="h-[38px] bg-[#18181b] border-b border-[#27272a] px-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'html', file: 'index.html', tag: 'HTML', dot: 'bg-[#f97316]' },
                    { id: 'css', file: 'style.css', tag: 'CSS', dot: 'bg-[#38bdf8]' },
                    { id: 'js', file: 'script.js', tag: 'JS', dot: 'bg-[#facc15]' },
                  ] as const
                ).map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        requestAnimationFrame(() => editorRef.current?.focus());
                      }}
                      className={`h-[30px] px-3 rounded-t-md flex items-center gap-2 text-[12.5px] font-medium cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#1e1e1e] text-white border-t-2 border-[#3b82f6]'
                          : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/60'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${tab.dot}`} />
                      <span>{tab.file}</span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-[#71717a] pr-2 hidden sm:inline">
                {lineCount} ligne{lineCount > 1 ? 's' : ''} · Tab = 2 espaces
              </span>
            </div>

            {/* Code Textarea with Synchronized Line Numbers */}
            <div className="flex-1 flex min-h-0 overflow-hidden relative bg-[#1e1e1e]">
              <div
                ref={gutterRef}
                aria-hidden="true"
                className="w-12 py-3.5 pr-3 text-right font-mono text-[13px] leading-[1.6] text-[#52525b] bg-[#1b1b1e] border-r border-[#27272a] select-none overflow-hidden shrink-0"
              >
                {Array.from({ length: lineCount }, (_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              <textarea
                ref={editorRef}
                value={activeCode}
                onChange={(e) => setActiveCode(e.target.value)}
                onScroll={handleEditorScroll}
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoFocus
                aria-label={`Éditeur ${activeTab.toUpperCase()}`}
                className="flex-1 h-full w-full resize-none bg-[#1e1e1e] text-[#e4e4e7] font-mono text-[13.5px] leading-[1.6] p-3.5 outline-none [tab-size:2] selection:bg-[#2563eb]/40 overflow-auto"
              />
            </div>
          </section>
        )}

        {/* Draggable Split Divider (Desktop) */}
        {!previewExpanded && (
          <div
            role="separator"
            aria-orientation="vertical"
            onMouseDown={() => setIsDraggingSplit(true)}
            className="hidden md:flex w-1.5 bg-[#27272a] hover:bg-[#3b82f6] cursor-col-resize items-center justify-center transition-colors shrink-0"
            title="Glisser pour redimensionner"
          >
            <div className="w-0.5 h-8 rounded-full bg-[#52525b]" />
          </div>
        )}

        {/* Right Pane: Real-Time Live Preview + Console */}
        <section className="flex-1 h-1/2 md:h-full flex flex-col bg-[#f4f4f5] min-w-0">
          {/* Preview Toolbar */}
          <div className="h-[38px] bg-[#202024] border-b border-[#27272a] px-3 flex items-center justify-between gap-2 shrink-0 text-[#d4d4d8]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[12px] font-medium text-white truncate">
                Aperçu en temps réel
              </span>
              <span className="text-[11px] text-[#71717a] bg-[#141417] border border-[#2e2e34] px-2 py-0.5 rounded hidden sm:inline">
                live://preview
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                title="Vue ordinateur"
                className={`p-1.5 rounded cursor-pointer ${
                  viewportMode === 'desktop'
                    ? 'bg-[#3b82f6]/20 text-[#93c5fd]'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                title="Vue mobile (375px)"
                className={`p-1.5 rounded cursor-pointer ${
                  viewportMode === 'mobile'
                    ? 'bg-[#3b82f6]/20 text-[#93c5fd]'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowConsole((c) => !c)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11.5px] font-medium cursor-pointer border transition-colors ${
                  showConsole
                    ? 'bg-[#27272a] border-[#3f3f46] text-white'
                    : 'bg-transparent border-transparent text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/70'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console</span>
                {(consoleLogs.length > 0 || errorCount > 0) && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      errorCount > 0
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {consoleLogs.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Live Rendered Viewport */}
          <div className="flex-1 min-h-0 flex items-stretch justify-center bg-[#e4e4e7] overflow-auto relative">
            {isDraggingSplit && <div className="absolute inset-0 z-20" />}
            <iframe
              ref={iframeRef}
              key={debouncedBundle.nonce}
              title="Aperçu en temps réel"
              sandbox="allow-scripts"
              srcDoc={previewSrcDoc}
              className={`bg-white border-0 transition-all ${
                viewportMode === 'mobile'
                  ? 'w-[375px] max-w-full my-3 rounded-xl shadow-xl border border-[#d4d4d8]'
                  : 'w-full h-full'
              }`}
            />
          </div>

          {/* Optional Live Console Drawer */}
          {showConsole && (
            <div className="h-[150px] bg-[#141417] border-t border-[#27272a] flex flex-col shrink-0">
              <div className="h-[30px] px-3 border-b border-[#27272a] flex items-center justify-between text-[11.5px] text-[#a1a1aa]">
                <span className="font-medium">Console JS</span>
                <button
                  type="button"
                  onClick={() => setConsoleLogs([])}
                  className="inline-flex items-center gap-1 hover:text-white cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Vider</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[12px] space-y-1">
                {consoleLogs.length === 0 ? (
                  <div className="text-[#52525b] italic">
                    Utilise console.log(...) dans script.js pour afficher des logs ici.
                  </div>
                ) : (
                  consoleLogs.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-2 ${
                        entry.level === 'error'
                          ? 'text-red-400'
                          : entry.level === 'warn'
                          ? 'text-amber-300'
                          : 'text-[#e4e4e7]'
                      }`}
                    >
                      <span className="text-[#52525b] shrink-0">[{entry.time}]</span>
                      <span className="break-all">{entry.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Bottom Status Bar + Discreet Incoming Message Display */}
      <footer className="h-[26px] bg-[#141417] border-t border-[#27272a] px-3 flex items-center justify-between text-[11px] text-[#71717a] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span>UTF-8</span>
          <span className="hidden sm:inline">HTML5 · CSS3 · ES2023</span>
          {currentResponse && (
            <button
              type="button"
              onClick={onClearResponse}
              title="Cliquer pour masquer"
              className="inline-flex items-center gap-1.5 text-[#93c5fd] hover:text-white truncate cursor-pointer bg-transparent border-0 p-0"
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="truncate">{currentResponse}</span>
            </button>
          )}
        </div>
        <span className="hidden sm:inline">Taper /accueil en haut pour revenir</span>
      </footer>
    </div>
  );
}
