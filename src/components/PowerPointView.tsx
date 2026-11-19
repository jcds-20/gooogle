import React, { useState, useRef } from 'react';
import {
  Save,
  Undo2,
  Redo2,
  Clipboard,
  Scissors,
  Copy,
  Paintbrush,
  FilePlus2,
  LayoutTemplate,
  RotateCcw,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Lightbulb,
  Search,
  Replace,
  MousePointer,
  RotateCw,
  UserPlus,
  MessageSquare,
  MonitorPlay,
  LayoutGrid,
  BookOpen,
  Presentation,
  Minus,
  Plus,
} from 'lucide-react';

interface PowerPointViewProps {
  currentResponse: string | null;
  onSendQuery: (query: string) => void;
  onClearResponse: () => void;
  onGoHome: () => void;
}

const RIBBON_TABS = [
  'Fichier',
  'Accueil',
  'Insertion',
  'Création',
  'Transitions',
  'Animations',
  'Diaporama',
  'Révision',
  'Affichage',
];

export default function PowerPointView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: PowerPointViewProps) {
  const [slideInput, setSlideInput] = useState('');
  const [tellMeInput, setTellMeInput] = useState('');
  const slideInputRef = useRef<HTMLInputElement>(null);

  const displayedTitle = currentResponse || 'Exposé';

  const handleSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = slideInput.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setSlideInput('');
    slideInputRef.current?.focus();
  };

  const handleTellMeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tellMeInput.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setTellMeInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6e6e6] text-[#262626] font-sans antialiased select-none">
      {/* Top PowerPoint Title Bar */}
      <div className="bg-[#b7472a] text-white h-[30px] px-2 flex items-center justify-between text-[11px]">
        {/* Quick Access Toolbar */}
        <div className="flex items-center gap-2.5">
          <button type="button" className="hover:bg-white/15 p-1 rounded-xs" title="Enregistrer">
            <Save className="w-3.5 h-3.5" />
          </button>
          <button type="button" className="hover:bg-white/15 p-1 rounded-xs opacity-70" title="Annuler">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" className="hover:bg-white/15 p-1 rounded-xs opacity-70" title="Rétablir">
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" className="hover:bg-white/15 p-1 rounded-xs" title="À partir du début">
            <Presentation className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Document Title & Drawing Tools indicator */}
        <div className="flex items-center gap-6">
          <span className="bg-[#8f341d] px-3 py-1 text-[11px] font-normal hidden md:inline">
            Outils de dessin
          </span>
          <button
            type="button"
            onClick={onGoHome}
            className="font-normal tracking-wide cursor-pointer bg-transparent border-0 text-white"
          >
            Présentation1 - PowerPoint
          </button>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-4 text-white/90 text-[12px] pr-1">
          <span className="hover:bg-white/15 px-1.5 cursor-pointer">—</span>
          <span className="hover:bg-white/15 px-1.5 cursor-pointer">□</span>
          <span className="hover:bg-[#e81123] px-1.5 cursor-pointer">✕</span>
        </div>
      </div>

      {/* Ribbon Tab Strip */}
      <div className="bg-[#b7472a] text-white px-2 flex items-center justify-between text-[12px] h-[28px]">
        <div className="flex items-center overflow-x-auto">
          {RIBBON_TABS.map((tab) => {
            const isActive = tab === 'Accueil';
            return (
              <button
                key={tab}
                type="button"
                className={`px-3 h-[28px] text-[12px] transition-colors shrink-0 ${
                  isActive
                    ? 'bg-[#f3f2f1] text-[#b7472a] font-medium'
                    : 'text-white/95 hover:bg-white/15'
                }`}
              >
                {tab}
              </button>
            );
          })}
          <button
            type="button"
            className="px-3 h-[28px] text-[12px] bg-[#9c3920] hover:bg-[#8a311b] text-white/95 shrink-0 hidden md:inline"
          >
            Format
          </button>

          {/* Tell me search input */}
          <form onSubmit={handleTellMeSubmit} className="hidden lg:flex items-center ml-3">
            <Lightbulb className="w-3.5 h-3.5 text-white/90 mr-1.5" />
            <input
              type="text"
              value={tellMeInput}
              onChange={(e) => setTellMeInput(e.target.value)}
              placeholder="Dites-nous ce que vous voulez faire..."
              className="bg-transparent text-white placeholder-white/80 text-[11px] outline-none w-52"
            />
          </form>
        </div>

        <div className="flex items-center gap-3 text-[11px] pr-1 shrink-0">
          <button type="button" className="hover:bg-white/15 px-2 py-0.5 rounded-xs">
            Connexion
          </button>
          <button type="button" className="hover:bg-white/15 px-2 py-0.5 rounded-xs flex items-center gap-1">
            <UserPlus className="w-3 h-3" />
            <span>Partager</span>
          </button>
        </div>
      </div>

      {/* Ribbon Toolbar (Accueil) */}
      <div className="bg-[#f3f2f1] border-b border-[#d2d0ce] px-2 py-1.5 flex items-stretch gap-2 overflow-x-auto text-[11px] text-[#444444]">
        {/* Presse-papiers */}
        <div className="flex flex-col justify-between pr-2 border-r border-[#d2d0ce] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center px-1.5 py-1 hover:bg-[#e1dfdd] rounded-xs cursor-pointer">
              <Clipboard className="w-5 h-5 text-[#c59b27]" />
              <span className="mt-0.5">Coller</span>
            </div>
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs opacity-60">
                <Scissors className="w-3 h-3" />
                <span>Couper</span>
              </div>
              <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs opacity-60">
                <Copy className="w-3 h-3" />
                <span>Copier</span>
              </div>
              <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs">
                <Paintbrush className="w-3 h-3 text-[#b7472a]" />
                <span className="hidden xl:inline">Reproduire la mise en forme</span>
              </div>
            </div>
          </div>
          <div className="text-center text-[10px] text-[#666666] pt-0.5">Presse-papiers</div>
        </div>

        {/* Diapositives */}
        <div className="flex flex-col justify-between pr-2 border-r border-[#d2d0ce] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center px-1.5 py-1 hover:bg-[#e1dfdd] rounded-xs cursor-pointer text-center leading-tight">
              <FilePlus2 className="w-5 h-5 text-[#b7472a]" />
              <span className="mt-0.5">Nouvelle<br />diapositive</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs cursor-pointer">
                <LayoutTemplate className="w-3 h-3 text-[#555555]" />
                <span>Disposition</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
              <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs cursor-pointer">
                <RotateCcw className="w-3 h-3 text-[#2f6ea8]" />
                <span>Rétablir</span>
              </div>
              <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs cursor-pointer">
                <span className="w-3 h-3 inline-block border border-[#b7472a]" />
                <span>Section</span>
              </div>
            </div>
          </div>
          <div className="text-center text-[10px] text-[#666666] pt-0.5">Diapositives</div>
        </div>

        {/* Police */}
        <div className="flex flex-col justify-between pr-2 border-r border-[#d2d0ce] shrink-0">
          <div className="space-y-1.5 py-0.5">
            <div className="flex items-center gap-1">
              <div className="bg-white border border-[#c8c6c4] px-2 py-0.5 text-[11px] flex items-center gap-3">
                <span>Calibri (Corps)</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>
              <div className="bg-white border border-[#c8c6c4] px-1.5 py-0.5 text-[11px] flex items-center gap-1">
                <span>24</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>
              <span className="px-1 hover:bg-[#e1dfdd] cursor-pointer font-serif text-[12px]">A^</span>
              <span className="px-1 hover:bg-[#e1dfdd] cursor-pointer font-serif text-[10px]">Av</span>
            </div>
            <div className="flex items-center gap-2 px-0.5">
              <span className="font-bold cursor-pointer hover:bg-[#e1dfdd] px-1">G</span>
              <span className="italic font-serif cursor-pointer hover:bg-[#e1dfdd] px-1">I</span>
              <span className="underline cursor-pointer hover:bg-[#e1dfdd] px-1">S</span>
              <span className="line-through cursor-pointer hover:bg-[#e1dfdd] px-1">abc</span>
              <span className="cursor-pointer hover:bg-[#e1dfdd] px-1 text-[10px]">AV</span>
              <span className="cursor-pointer hover:bg-[#e1dfdd] px-1">Aa</span>
              <span className="cursor-pointer hover:bg-[#e1dfdd] px-1 font-bold border-b-2 border-[#c62828]">A</span>
            </div>
          </div>
          <div className="text-center text-[10px] text-[#666666] pt-0.5">Police</div>
        </div>

        {/* Paragraphe */}
        <div className="hidden md:flex flex-col justify-between pr-2 border-r border-[#d2d0ce] shrink-0">
          <div className="space-y-1.5 py-0.5">
            <div className="flex items-center gap-2 text-[#555555]">
              <List className="w-3.5 h-3.5" />
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="text-gray-300">|</span>
              <AlignLeft className="w-3.5 h-3.5" />
              <AlignCenter className="w-3.5 h-3.5 text-[#b7472a]" />
              <AlignRight className="w-3.5 h-3.5" />
              <AlignJustify className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#555555]">
              <span>Orientation du texte</span>
              <span>Aligner le texte</span>
            </div>
          </div>
          <div className="text-center text-[10px] text-[#666666] pt-0.5">Paragraphe</div>
        </div>

        {/* Dessin */}
        <div className="hidden xl:flex flex-col justify-between pr-2 border-r border-[#d2d0ce] shrink-0">
          <div className="grid grid-cols-5 gap-1 bg-white border border-[#c8c6c4] p-1 text-[10px] text-[#444444]">
            <span className="w-3.5 h-3.5 border border-gray-500 inline-block" />
            <span className="w-3.5 h-3.5 border border-gray-500 rounded-full inline-block" />
            <span className="w-3.5 h-3.5 border border-gray-500 rounded-xs inline-block" />
            <span className="text-center leading-none">△</span>
            <span className="text-center leading-none">→</span>
            <span className="text-center leading-none">☆</span>
            <span className="text-center leading-none">{`{`}</span>
            <span className="text-center leading-none">{`}`}</span>
            <span className="text-center leading-none">╱</span>
            <span className="text-center leading-none">▭</span>
          </div>
          <div className="text-center text-[10px] text-[#666666] pt-0.5">Dessin</div>
        </div>

        {/* Modification */}
        <div className="hidden lg:flex flex-col justify-between shrink-0">
          <div className="flex flex-col gap-0.5 text-[11px]">
            <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs">
              <Search className="w-3 h-3 text-[#2f6ea8]" />
              <span>Rechercher</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs">
              <Replace className="w-3 h-3 text-[#b7472a]" />
              <span>Remplacer</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-[#e1dfdd] px-1 rounded-xs">
              <MousePointer className="w-3 h-3 text-[#555555]" />
              <span>Sélectionner</span>
            </div>
          </div>
          <div className="text-center text-[10px] text-[#666666] pt-0.5">Modification</div>
        </div>
      </div>

      {/* Main Workspace: Left Slide Thumbnails + Center Slide Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Slide Thumbnail Pane */}
        <aside className="hidden sm:flex w-[180px] lg:w-[205px] bg-[#f3f2f1] border-r border-[#d2d0ce] p-3 flex-col shrink-0">
          <div className="flex items-start gap-2">
            <span className="text-[11px] text-[#b7472a] font-semibold mt-0.5">1</span>
            <button
              type="button"
              onClick={onClearResponse}
              title="Diapositive 1"
              className="flex-1 aspect-[16/10] bg-white border-2 border-[#d24726] shadow-xs flex items-center justify-center p-2 overflow-hidden cursor-pointer"
            >
              <span className="text-[9px] text-[#222222] text-center line-clamp-3 leading-tight break-words">
                {displayedTitle}
              </span>
            </button>
          </div>
        </aside>

        {/* Center Slide Stage */}
        <main className="flex-1 bg-[#e6e6e6] p-4 sm:p-8 flex items-center justify-center overflow-auto">
          <div className="w-full max-w-[940px] aspect-[16/10] bg-white shadow-md border border-[#d2d0ce] flex flex-col items-center justify-center px-8 sm:px-16 relative">
            {/* Top Title (replaces "Exposé" with incoming message in real time!) */}
            <div className="w-full flex items-center justify-center mb-4 min-h-[72px]">
              <h1
                className="text-[36px] sm:text-[52px] font-normal text-[#111111] text-center leading-tight break-words max-w-full select-text"
                style={{ fontFamily: 'Calibri, Arial, sans-serif' }}
              >
                {displayedTitle}
              </h1>
            </div>

            {/* Dashed Text Box Container with Selection Handles (type & press Enter to send!) */}
            <form
              onSubmit={handleSlideSubmit}
              className="w-full max-w-[660px] h-[120px] sm:h-[145px] border border-dashed border-[#a6a6a6] relative flex items-center justify-center px-4 cursor-text"
              onClick={() => slideInputRef.current?.focus()}
            >
              {/* Rotation handle */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <RotateCw className="w-3.5 h-3.5 text-[#666666]" />
                <div className="w-px h-3.5 bg-[#a6a6a6]" />
              </div>

              {/* 8 Resize handles */}
              <span className="w-2 h-2 rounded-full bg-white border border-[#666666] absolute -top-1 -left-1 pointer-events-none" />
              <span className="w-2 h-2 rounded-full bg-white border border-[#666666] absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none" />
              <span className="w-2 h-2 rounded-full bg-white border border-[#666666] absolute -top-1 -right-1 pointer-events-none" />
              <span className="w-2 h-2 rounded-full bg-white border border-[#666666] absolute top-1/2 -translate-y-1/2 -left-1 pointer-events-none" />
              <span className="w-2 h-2 rounded-full bg-white border border-[#666666] absolute top-1/2 -translate-y-1/2 -right-1 pointer-events-none" />
              <span className="w-2 h-2 rounded-full bg-white border border-[#666666] absolute -bottom-1 -left-1 pointer-events-none" />
              <span className="w-2 h-2 rounded-full bg-white border border-[#666666] absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none" />
              <span className="w-2 h-2 rounded-full bg-white border border-[#666666] absolute -bottom-1 -right-1 pointer-events-none" />

              {/* Clean invisible input inside the PowerPoint subtitle placeholder */}
              <input
                ref={slideInputRef}
                type="text"
                value={slideInput}
                onChange={(e) => setSlideInput(e.target.value)}
                autoComplete="off"
                autoFocus
                aria-label="Zone de texte PowerPoint"
                className="w-full h-full bg-transparent outline-none text-center text-[20px] sm:text-[24px] text-[#333333]"
                style={{ fontFamily: 'Calibri, Arial, sans-serif' }}
              />
            </form>
          </div>
        </main>
      </div>

      {/* Bottom PowerPoint Status Bar */}
      <footer className="bg-[#f3f2f1] border-t border-[#d2d0ce] h-[24px] px-3 flex items-center justify-between text-[11px] text-[#555555]">
        <div className="flex items-center gap-4">
          <span>Diapositive 1 de 1</span>
          <BookOpen className="w-3 h-3 opacity-70" />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileTextIcon />
              <span>Notes</span>
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>Commentaires</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#666666]">
            <Presentation className="w-3.5 h-3.5 text-[#b7472a]" />
            <LayoutGrid className="w-3.5 h-3.5" />
            <BookOpen className="w-3.5 h-3.5" />
            <MonitorPlay className="w-3.5 h-3.5" />
          </div>

          <div className="flex items-center gap-1.5">
            <Minus className="w-3 h-3" />
            <div className="w-16 h-0.5 bg-[#a6a6a6] relative">
              <div className="w-1 h-2.5 bg-[#555555] absolute left-1/2 -top-1" />
            </div>
            <Plus className="w-3 h-3" />
            <span className="ml-1">115 %</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FileTextIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="2.5" y="2" width="11" height="12" rx="1" />
      <line x1="5" y1="5.5" x2="11" y2="5.5" />
      <line x1="5" y1="8.5" x2="11" y2="8.5" />
      <line x1="5" y1="11.5" x2="8.5" y2="11.5" />
    </svg>
  );
}
