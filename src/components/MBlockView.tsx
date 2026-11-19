import React, { useState, useRef } from 'react';
import {
  Globe,
  FolderOpen,
  Save,
  BookOpen,
  FileCode2,
  MessageSquare,
  Settings,
  User,
  Maximize2,
  Columns2,
  LayoutGrid,
  Flag,
  Square,
  Plus,
  Bluetooth,
  Usb,
  HelpCircle,
  Search,
  Volume2,
  Lightbulb,
  Tv,
  Activity,
  Cpu,
  Wifi,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  ChevronLeft,
} from 'lucide-react';

interface MBlockViewProps {
  currentResponse: string | null;
  onSendQuery: (query: string) => void;
  onClearResponse: () => void;
  onGoHome: () => void;
}

const CATEGORIES = [
  { label: 'Rechercher', icon: Search, color: 'text-[#00a8f3]' },
  { label: 'Audio', icon: Volume2, color: 'text-[#9966ff]' },
  { label: 'LED', icon: Lightbulb, color: 'text-[#9966ff]' },
  { label: 'Affichage', icon: Tv, color: 'text-[#7c4dff]' },
  { label: 'Détection de mouvement', icon: Activity, color: 'text-[#ff8c1a]' },
  { label: 'Capteurs', icon: Cpu, color: 'text-[#ff8c1a]' },
  { label: 'LAN', icon: Wifi, color: 'text-[#00c49a]' },
];

export default function MBlockView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: MBlockViewProps) {
  const [titleInput, setTitleInput] = useState('');
  const [activeTab, setActiveTab] = useState<'appareils' | 'objets' | 'fond'>('appareils');
  const [codeTab, setCodeTab] = useState<'blocs' | 'python'>('blocs');
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = titleInput.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setTitleInput('');
    titleInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fa] text-[#333333] font-sans antialiased select-none">
      {/* Top Bright Blue mBlock Header */}
      <header className="bg-[#00a8f3] text-white h-[44px] px-3 flex items-center justify-between gap-3 shrink-0">
        {/* Top-Left Brand + File + Title Input ("Sans titre") + Save */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-1.5 font-bold text-[15px] tracking-tight cursor-pointer bg-transparent border-0 text-white shrink-0"
          >
            <span className="font-semibold">makeblock</span>
            <span className="opacity-70 font-normal">|</span>
            <span className="font-extrabold">mBlock</span>
          </button>

          <button type="button" className="p-1.5 hover:bg-white/15 rounded cursor-pointer hidden sm:flex">
            <Globe className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="hidden sm:flex items-center gap-1.5 text-[12.5px] px-2 py-1 hover:bg-white/15 rounded cursor-pointer shrink-0"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Fichier</span>
          </button>

          {/* Top-Left Message Input ("Sans titre") */}
          <form onSubmit={handleTitleSubmit} className="shrink-0">
            <input
              ref={titleInputRef}
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Sans titre"
              autoComplete="off"
              autoFocus
              aria-label="Nom du projet"
              className="w-[155px] sm:w-[195px] h-[28px] rounded-full bg-[#0094d8] hover:bg-[#008bc9] focus:bg-[#0082be] border border-white/45 px-3 text-[12px] text-white placeholder-white/85 outline-none"
            />
          </form>

          <button
            type="button"
            onClick={() => {
              if (titleInput.trim()) {
                onSendQuery(titleInput.trim());
                setTitleInput('');
              }
            }}
            className="hidden md:flex items-center gap-1.5 text-[12.5px] px-2 py-1 hover:bg-white/15 rounded cursor-pointer shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer</span>
          </button>
        </div>

        {/* Right Header Links */}
        <div className="hidden lg:flex items-center gap-4 text-[12.5px] shrink-0">
          <button type="button" className="flex items-center gap-1.5 hover:opacity-85 cursor-pointer">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide de l&apos;utilisateur</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:opacity-85 cursor-pointer">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Exemple de programmes</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:opacity-85 cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Retours</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:opacity-85 cursor-pointer">
            <Settings className="w-3.5 h-3.5" />
            <span>Paramètres</span>
          </button>
          <div className="w-7 h-7 rounded-full bg-white/85 text-[#00a8f3] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Main mBlock Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Stage + Device Panel */}
        <aside className="w-[245px] sm:w-[270px] bg-[#f4f7fa] border-r border-[#e2e8f0] p-2 flex flex-col gap-2 shrink-0">
          {/* White Stage Box with Panda */}
          <div className="bg-white border border-[#dce3ea] rounded-[6px] h-[195px] relative flex items-center justify-center overflow-hidden">
            {/* Cute mBlock Panda SVG */}
            <svg viewBox="0 0 100 110" className="w-20 h-20">
              {/* Ears */}
              <circle cx="28" cy="24" r="10" fill="#1f2937" />
              <circle cx="72" cy="24" r="10" fill="#1f2937" />
              {/* Head */}
              <ellipse cx="50" cy="40" rx="26" ry="22" fill="#ffffff" stroke="#1f2937" strokeWidth="3" />
              {/* Eye patches */}
              <ellipse cx="39" cy="39" rx="7" ry="9" transform="rotate(-15 39 39)" fill="#1f2937" />
              <ellipse cx="61" cy="39" rx="7" ry="9" transform="rotate(15 61 39)" fill="#1f2937" />
              {/* Eyes */}
              <circle cx="40" cy="38" r="2.5" fill="#ffffff" />
              <circle cx="60" cy="38" r="2.5" fill="#ffffff" />
              {/* Nose & smile */}
              <ellipse cx="50" cy="47" rx="4" ry="2.5" fill="#1f2937" />
              <path d="M45 52 Q50 56 55 52" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Body */}
              <ellipse cx="50" cy="76" rx="18" ry="17" fill="#ffffff" stroke="#1f2937" strokeWidth="3" />
              {/* Arms & legs */}
              <ellipse cx="29" cy="72" rx="7" ry="11" transform="rotate(20 29 72)" fill="#1f2937" />
              <ellipse cx="71" cy="72" rx="7" ry="11" transform="rotate(-20 71 72)" fill="#1f2937" />
              <ellipse cx="40" cy="95" rx="7" ry="6" fill="#1f2937" />
              <ellipse cx="60" cy="95" rx="7" ry="6" fill="#1f2937" />
              {/* Blue collar */}
              <path d="M36 60 Q50 65 64 60" stroke="#00a8f3" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Stage Controls Bar */}
          <div className="flex items-center justify-between px-1 py-0.5">
            <div className="flex items-center gap-1.5">
              <button type="button" className="p-1.5 bg-white border border-[#dce3ea] rounded text-[#5f6b7a]">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <div className="flex bg-white border border-[#dce3ea] rounded overflow-hidden">
                <button type="button" className="p-1.5 text-[#5f6b7a]">
                  <Columns2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1.5 bg-[#e6f7ff] text-[#00a8f3]">
                  <Columns2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <button type="button" className="p-1.5 bg-white border border-[#dce3ea] rounded text-[#9aa5b1]">
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClearResponse}
                className="w-7 h-7 rounded-full bg-[#ff5a5f] text-white flex items-center justify-center cursor-pointer"
                title="Arrêter"
              >
                <Square className="w-3 h-3 fill-white" />
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-[#22c55e] text-white flex items-center justify-center cursor-pointer"
                title="Démarrer"
              >
                <Flag className="w-3.5 h-3.5 fill-white" />
              </button>
            </div>
          </div>

          {/* Appareils / Objets / Arrière plan Card */}
          <div className="flex-1 bg-white border border-[#dce3ea] rounded-[6px] flex flex-col overflow-hidden">
            <div className="grid grid-cols-3 border-b border-[#e2e8f0] bg-[#f4f7fa] text-[12px]">
              {[
                { id: 'appareils' as const, label: 'Appareils' },
                { id: 'objets' as const, label: 'Objets' },
                { id: 'fond' as const, label: 'Arrière plan' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`py-2 text-center cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-white text-[#00a8f3] font-medium border-t-2 border-[#00a8f3]'
                      : 'text-[#5f6b7a]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-2.5 flex gap-2.5 flex-1">
              {/* Left Device Tiles */}
              <div className="w-[68px] space-y-2 shrink-0">
                <div className="relative border-2 border-[#00a8f3] rounded-[6px] p-1.5 bg-[#f0faff] text-center">
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#00a8f3] text-white text-[10px] flex items-center justify-center">
                    ×
                  </span>
                  <div className="w-9 h-7 mx-auto bg-[#4b5563] rounded-xs border border-[#1f2937] mb-1" />
                  <div className="text-[11px] text-[#00a8f3] font-medium">CyberPi</div>
                </div>

                <div className="border border-[#dce3ea] rounded-[6px] p-2 text-center cursor-pointer hover:bg-gray-50">
                  <div className="w-6 h-6 mx-auto rounded-full bg-[#00a8f3] text-white flex items-center justify-center mb-1">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-[#00a8f3]">Ajouter</div>
                </div>
              </div>

              {/* Right Connection Panel */}
              <div className="flex-1 text-[11px] space-y-3 min-w-0">
                <div className="text-[#00a8f3] text-center">⇄ Basculer vers mLink</div>

                <div>
                  <div className="text-[#5f6b7a] mb-1.5">Connexion</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="border border-[#90d5f7] bg-[#f4fbff] rounded p-1.5 text-center text-[#0088cc]">
                      <Bluetooth className="w-4 h-4 mx-auto mb-1" />
                      <div className="truncate text-[10px]">par Blue...</div>
                    </div>
                    <div className="border border-[#90d5f7] bg-[#f4fbff] rounded p-1.5 text-center text-[#0088cc]">
                      <Usb className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-[10px]">Série</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[#5f6b7a] mb-1.5">
                    <span>Commutateur de mode</span>
                    <HelpCircle className="w-3 h-3" />
                  </div>
                  <div className="grid grid-cols-2 border border-[#90d5f7] rounded overflow-hidden text-[10.5px] text-center">
                    <div className="py-1.5 bg-[#eaf6fc] text-[#6b7c93]">Téléverser</div>
                    <div className="py-1.5 bg-white text-[#00a8f3] font-medium">En direct</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Vertical Block Categories Rail */}
        <nav className="w-[74px] bg-white border-r border-[#e2e8f0] py-2 flex flex-col items-center justify-between shrink-0">
          <div className="w-full space-y-2.5 overflow-y-auto px-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  type="button"
                  className="w-full py-1 px-0.5 flex flex-col items-center text-center gap-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <span className={`text-[10.5px] leading-tight ${cat.color}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="w-full pt-2 border-t border-[#e2e8f0] flex flex-col items-center gap-1 text-[#00a8f3] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10.5px]">extension</span>
          </button>
        </nav>

        {/* Main Dotted Canvas — Displays incoming message in the middle-left */}
        <main
          className="flex-1 bg-white relative flex flex-col justify-between overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          {/* Top-Right Blocs / Python Tabs */}
          <div className="flex justify-end">
            <div className="flex border-b border-l border-[#dce3ea] bg-[#f4f7fa] rounded-bl-md overflow-hidden text-[12px]">
              <button
                type="button"
                onClick={() => setCodeTab('blocs')}
                className={`px-6 py-1.5 cursor-pointer ${
                  codeTab === 'blocs' ? 'bg-white text-[#00a8f3] font-medium' : 'text-[#5f6b7a]'
                }`}
              >
                Blocs
              </button>
              <button
                type="button"
                onClick={() => setCodeTab('python')}
                className={`px-6 py-1.5 cursor-pointer ${
                  codeTab === 'python' ? 'bg-white text-[#00a8f3] font-medium' : 'text-[#5f6b7a]'
                }`}
              >
                Python
              </button>
            </div>
          </div>

          {/* Middle-Left Message Display ("au milieu à gauche") */}
          {currentResponse && (
            <div
              onClick={onClearResponse}
              className="absolute left-6 top-1/2 -translate-y-1/2 max-w-[460px] bg-[#4c97ff] text-white border border-[#3373cc] rounded-lg px-4 py-2.5 shadow-md text-[14px] leading-relaxed select-text cursor-pointer"
            >
              {currentResponse}
            </div>
          )}

          {/* Bottom CyberPi Status & Zoom Controls */}
          <div className="px-4 pb-3 flex items-end justify-between">
            <div className="space-y-2">
              <div className="w-10 h-6 bg-[#9ca3af] rounded-xs border border-[#6b7280] opacity-75" />
              <div className="text-[10.5px] text-[#9ca3af]">
                CyberPi &nbsp;|&nbsp; Bloquer.le numéro :0.
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#00a8f3] text-white flex items-center justify-center shadow-xs"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#00a8f3] text-white flex items-center justify-center shadow-xs"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-[#d1d5db] bg-white text-[#9ca3af] flex items-center justify-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-[#d1d5db] bg-white text-[#9ca3af] flex items-center justify-center"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#00a8f3] text-white flex items-center justify-center shadow-xs text-[13px] font-bold"
                >
                  =
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
