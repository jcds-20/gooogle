import React, { useState, useRef } from 'react';
import {
  Save,
  Undo2,
  Redo2,
  Clipboard,
  Scissors,
  Copy,
  Paintbrush,
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
  UserPlus,
  BookOpen,
  FileText,
  Globe,
  Minus,
  Plus,
} from 'lucide-react';

interface WordViewProps {
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
  'Disposition',
  'Références',
  'Publipostage',
  'Révision',
  'Affichage',
];

const STYLE_PRESETS = [
  { top: 'AaBbCcDc', label: '¶ Normal', active: true, styleClass: 'text-[12px] text-[#222222]' },
  { top: 'AaBbCcDc', label: '¶ Sans int...', active: false, styleClass: 'text-[12px] text-[#222222]' },
  { top: 'AaBbCcD', label: 'Titre 1', active: false, styleClass: 'text-[13px] text-[#2b579a]' },
  { top: 'AaBbCcD', label: 'Titre 2', active: false, styleClass: 'text-[12px] text-[#2b579a]' },
  { top: 'AaB', label: 'Titre', active: false, styleClass: 'text-[19px] text-[#222222] tracking-tight' },
  { top: 'AaBbCcD', label: 'Sous-titre', active: false, styleClass: 'text-[11px] text-[#666666]' },
  { top: 'AaBbCcD', label: 'Emphase...', active: false, styleClass: 'text-[11px] italic text-[#444444]' },
  { top: 'AaBbCcD', label: 'Accentuat...', active: false, styleClass: 'text-[11px] italic text-[#222222] font-semibold' },
  { top: 'AaBbCcD', label: 'Emphase i...', active: false, styleClass: 'text-[11px] italic text-[#2b579a]' },
  { top: 'AaBbCcD', label: 'Élevé', active: false, styleClass: 'text-[11px] font-bold text-[#222222]' },
  { top: 'AaBbCcD', label: 'Citation', active: false, styleClass: 'text-[11px] italic text-[#444444]' },
  { top: 'AaBbCcD', label: 'Citation in...', active: false, styleClass: 'text-[11px] italic text-[#2b579a] border-y border-[#2b579a]/40' },
  { top: 'AABBCCDD', label: 'Référence...', active: false, styleClass: 'text-[10px] tracking-wider text-[#2b579a]' },
  { top: 'AABBCCDD', label: 'Référence...', active: false, styleClass: 'text-[10px] font-bold tracking-wider text-[#2b579a]' },
];

export default function WordView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: WordViewProps) {
  const [docInput, setDocInput] = useState('');
  const [tellMeInput, setTellMeInput] = useState('');
  const docTextareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = (() => {
    const combined = [currentResponse || '', docInput].join(' ').trim();
    if (!combined) return 0;
    return combined.split(/\s+/).length;
  })();

  const handleDocKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = docInput.trim();
      if (!trimmed) return;
      onSendQuery(trimmed);
      setDocInput('');
      docTextareaRef.current?.focus();
    }
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
      {/* Top Word Title Bar */}
      <div className="bg-[#2b579a] text-white h-[30px] px-2 flex items-center justify-between text-[11px]">
        {/* Quick Access Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearResponse}
            className="hover:bg-white/15 p-1 rounded-xs cursor-pointer"
            title="Enregistrer"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
          <button type="button" className="hover:bg-white/15 p-1 rounded-xs opacity-70" title="Annuler">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" className="hover:bg-white/15 p-1 rounded-xs opacity-70" title="Répéter">
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <ChevronDown className="w-3 h-3 opacity-75" />
        </div>

        {/* Center Document Title */}
        <button
          type="button"
          onClick={onGoHome}
          className="text-[12px] font-normal tracking-wide cursor-pointer hover:underline bg-transparent border-0 text-white"
        >
          Document1 - Word
        </button>

        <div className="w-10" />
      </div>

      {/* Ribbon Tab Row */}
      <div className="bg-[#2b579a] text-white h-[30px] px-1 flex items-end justify-between text-[12px]">
        <div className="flex items-end overflow-x-auto">
          {RIBBON_TABS.map((tab) => {
            const isActive = tab === 'Accueil';
            return (
              <button
                key={tab}
                type="button"
                className={`px-3 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#f1f1f1] text-[#2b579a] font-medium rounded-t-[2px]'
                    : 'text-white/95 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            );
          })}

          {/* Tell Me Bar ("Dites-nous ce que vous voulez faire..") */}
          <form
            onSubmit={handleTellMeSubmit}
            className="flex items-center gap-1.5 px-3 py-1 text-white/90 hover:bg-white/10"
          >
            <Lightbulb className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <input
              type="text"
              value={tellMeInput}
              onChange={(e) => setTellMeInput(e.target.value)}
              placeholder="Dites-nous ce que vous voulez faire.."
              className="bg-transparent outline-none text-[12px] text-white placeholder-white/85 w-52"
            />
          </form>
        </div>

        <div className="hidden lg:flex items-center gap-4 pb-1 text-[11px] pr-2 shrink-0">
          <span className="cursor-pointer hover:underline">Connexion</span>
          <span className="flex items-center gap-1 cursor-pointer hover:underline">
            <UserPlus className="w-3.5 h-3.5" />
            Partager
          </span>
        </div>
      </div>

      {/* Ribbon Command Strip */}
      <div className="bg-[#f1f1f1] border-b border-[#d4d4d4] px-2 py-1.5 flex items-stretch gap-2 overflow-x-auto text-[11px] text-[#444444]">
        {/* Presse-papiers */}
        <div className="flex flex-col justify-between pr-2.5 border-r border-[#d4d4d4] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center px-1.5 py-0.5 hover:bg-[#e1e1e1] rounded-xs cursor-pointer">
              <Clipboard className="w-5 h-5 text-[#c8963e]" />
              <span className="text-[10px] mt-0.5">Coller</span>
            </div>
            <div className="flex flex-col gap-0.5 text-[10px]">
              <div className="flex items-center gap-1 opacity-55">
                <Scissors className="w-3 h-3" /> Couper
              </div>
              <div className="flex items-center gap-1 opacity-55">
                <Copy className="w-3 h-3" /> Copier
              </div>
              <div className="flex items-center gap-1 hover:bg-[#e1e1e1] px-1 rounded-xs cursor-pointer">
                <Paintbrush className="w-3 h-3 text-[#c8963e]" /> Reproduire la mise en forme
              </div>
            </div>
          </div>
          <div className="text-center text-[10px] text-[#777777] mt-0.5">Presse-papiers</div>
        </div>

        {/* Police */}
        <div className="flex flex-col justify-between pr-2.5 border-r border-[#d4d4d4] shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="bg-white border border-[#cccccc] px-1.5 py-0.5 text-[11px] w-24 flex items-center justify-between">
                <span>Calibri (Corp)</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>
              <div className="bg-white border border-[#cccccc] px-1.5 py-0.5 text-[11px] w-11 flex items-center justify-between">
                <span>11</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>
              <span className="px-1 font-serif text-[12px] hover:bg-[#e1e1e1] cursor-pointer">A^</span>
              <span className="px-1 font-serif text-[10px] hover:bg-[#e1e1e1] cursor-pointer">Av</span>
              <span className="px-1 text-[11px] hover:bg-[#e1e1e1] cursor-pointer">Aa</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] px-0.5">
              <span className="font-bold px-1 hover:bg-[#e1e1e1] cursor-pointer">G</span>
              <span className="italic font-serif px-1 hover:bg-[#e1e1e1] cursor-pointer">I</span>
              <span className="underline px-1 hover:bg-[#e1e1e1] cursor-pointer">S</span>
              <span className="line-through px-1 hover:bg-[#e1e1e1] cursor-pointer">abc</span>
              <span className="px-1 hover:bg-[#e1e1e1] cursor-pointer">
                x<sub>2</sub>
              </span>
              <span className="px-1 hover:bg-[#e1e1e1] cursor-pointer">
                x<sup>2</sup>
              </span>
              <span className="px-1 text-[#2b579a] font-semibold hover:bg-[#e1e1e1] cursor-pointer">
                A
              </span>
              <span className="px-1 bg-yellow-300/80 text-[10px] font-semibold cursor-pointer">ab</span>
              <span className="px-1 font-bold text-[#c43e1c] border-b-2 border-[#c43e1c] leading-none cursor-pointer">
                A
              </span>
            </div>
          </div>
          <div className="text-center text-[10px] text-[#777777] mt-0.5">Police</div>
        </div>

        {/* Paragraphe */}
        <div className="flex flex-col justify-between pr-2.5 border-r border-[#d4d4d4] shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-1">
              <List className="w-3.5 h-3.5" />
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="text-[11px] font-serif px-1">¶</span>
            </div>
            <div className="flex items-center gap-1.5 px-1">
              <AlignLeft className="w-3.5 h-3.5 bg-[#d6e2f5] p-0.5 rounded-xs" />
              <AlignCenter className="w-3.5 h-3.5" />
              <AlignRight className="w-3.5 h-3.5" />
              <AlignJustify className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-center text-[10px] text-[#777777] mt-0.5">Paragraphe</div>
        </div>

        {/* Style Gallery */}
        <div className="flex flex-col justify-between pr-2.5 border-r border-[#d4d4d4] shrink-0">
          <div className="bg-white border border-[#d4d4d4] p-0.5 flex items-center gap-0.5 max-w-[660px] overflow-hidden">
            {STYLE_PRESETS.map((preset, idx) => (
              <div
                key={idx}
                className={`w-[54px] h-[42px] px-1 py-0.5 flex flex-col items-center justify-between shrink-0 cursor-pointer ${
                  preset.active
                    ? 'border-2 border-[#2b579a] bg-[#f8faff]'
                    : 'border border-transparent hover:border-[#c8c8c8]'
                }`}
              >
                <span className={`truncate max-w-full leading-tight ${preset.styleClass}`}>
                  {preset.top}
                </span>
                <span className="text-[9px] text-[#555555] truncate max-w-full">
                  {preset.label}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center text-[10px] text-[#777777] mt-0.5">Style</div>
        </div>

        {/* Modification */}
        <div className="flex flex-col justify-between pr-1 shrink-0">
          <div className="flex flex-col gap-0.5 text-[10px]">
            <div className="flex items-center gap-1.5 hover:bg-[#e1e1e1] px-1 rounded-xs cursor-pointer">
              <Search className="w-3 h-3 text-[#2b579a]" /> Rechercher
            </div>
            <div className="flex items-center gap-1.5 hover:bg-[#e1e1e1] px-1 rounded-xs cursor-pointer">
              <Replace className="w-3 h-3 text-[#2b579a]" /> Remplacer
            </div>
            <div className="flex items-center gap-1.5 hover:bg-[#e1e1e1] px-1 rounded-xs cursor-pointer">
              <MousePointer className="w-3 h-3" /> Sélectionner
            </div>
          </div>
          <div className="text-center text-[10px] text-[#777777] mt-0.5">Modification</div>
        </div>
      </div>

      {/* Main White A4 Document Area */}
      <main
        className="flex-1 overflow-y-auto py-4 px-4 flex justify-center"
        onClick={() => docTextareaRef.current?.focus()}
      >
        <div className="w-full max-w-[780px] min-h-[760px] bg-white border border-[#cccccc] shadow-xs px-14 sm:px-20 py-14 flex flex-col select-text cursor-text">
          {/* Subtle top-left margin crop mark like Word */}
          <div className="relative flex-1 flex flex-col">
            {currentResponse && (
              <div className="mb-3 text-[15px] leading-relaxed text-[#111111] whitespace-pre-wrap font-normal">
                {currentResponse}
              </div>
            )}

            <textarea
              ref={docTextareaRef}
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              onKeyDown={handleDocKeyDown}
              autoFocus
              aria-label="Document Word"
              className="w-full flex-1 resize-none outline-none bg-transparent text-[15px] leading-relaxed text-[#111111] caret-[#111111]"
            />
          </div>
        </div>
      </main>

      {/* Bottom Word Status Bar */}
      <footer className="bg-[#f1f1f1] border-t border-[#d4d4d4] h-[24px] px-3 flex items-center justify-between text-[11px] text-[#555555]">
        <div className="flex items-center gap-4">
          <span>Page 1 sur 1</span>
          <span>
            {wordCount} {wordCount > 1 ? 'mots' : 'mot'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <BookOpen className="w-3.5 h-3.5" />
          <FileText className="w-3.5 h-3.5 bg-[#dcdcdc] p-0.5 rounded-xs text-[#2b579a]" />
          <Globe className="w-3.5 h-3.5" />
          <div className="flex items-center gap-1.5 ml-2">
            <Minus className="w-3 h-3" />
            <div className="w-20 h-[2px] bg-[#b5b5b5] relative">
              <div className="w-1.5 h-2.5 bg-[#666666] absolute left-1/2 -top-1" />
            </div>
            <Plus className="w-3 h-3" />
            <span className="ml-1">100 %</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
