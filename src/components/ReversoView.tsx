import React, { useState, useRef } from 'react';
import {
  ArrowLeftRight,
  ChevronDown,
  Download,
  FileText,
  Languages,
  Keyboard,
  Volume2,
  Copy,
  Check,
  BookMarked,
  MoreHorizontal,
  Send,
  X,
} from 'lucide-react';

interface ReversoViewProps {
  currentResponse: string | null;
  onSendQuery: (query: string) => void;
  onClearResponse: () => void;
  onGoHome: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'Anglais', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Espagnol', flag: '🇪🇸' },
  { code: 'de', label: 'Allemand', flag: '🇩🇪' },
  { code: 'it', label: 'Italien', flag: '🇮🇹' },
  { code: 'pt', label: 'Portugais', flag: '🇵🇹' },
];

export default function ReversoView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: ReversoViewProps) {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const submitCurrentText = () => {
    const trimmed = sourceText.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setSourceText('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitCurrentText();
    }
  };

  const handleCopy = () => {
    if (!currentResponse) return;
    navigator.clipboard?.writeText(currentResponse).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sourceObj = LANGUAGES.find((l) => l.code === sourceLang) || LANGUAGES[0];
  const targetObj = LANGUAGES.find((l) => l.code === targetLang) || LANGUAGES[1];

  return (
    <div className="min-h-screen bg-white text-[#2b3440] font-sans antialiased flex flex-col">
      {/* Top White Reverso Header */}
      <header className="w-full bg-white border-b border-[#e5eaf0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[58px] flex items-center justify-between gap-4">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-6 overflow-x-auto">
            <a
              href="#reverso"
              onClick={(e) => {
                e.preventDefault();
                onGoHome();
              }}
              className="flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {/* Speech Bubble Double-Arrow Reverso Icon */}
              <div className="w-7 h-7 rounded-full border-2 border-[#0d6efd] flex items-center justify-center relative">
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#0d6efd]" />
                <span className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-[#f36f21] rounded-full" />
              </div>
              <span className="text-[20px] font-bold tracking-tight text-[#0d6efd]">
                Reverso
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-5 text-[13.5px] font-medium whitespace-nowrap">
              <a
                href="#traduction"
                onClick={(e) => e.preventDefault()}
                className="text-[#0d6efd] border-b-2 border-[#0d6efd] py-[18px]"
              >
                Traduction
              </a>
              <a
                href="#correcteur"
                onClick={(e) => e.preventDefault()}
                className="text-[#1f2937] hover:text-[#0d6efd] py-[18px]"
              >
                Correcteur
              </a>
              <a
                href="#context"
                onClick={(e) => e.preventDefault()}
                className="text-[#1f2937] hover:text-[#0d6efd] py-[18px]"
              >
                Context
              </a>
              <a
                href="#dictionnaire"
                onClick={(e) => e.preventDefault()}
                className="text-[#1f2937] hover:text-[#0d6efd] py-[18px]"
              >
                Dictionnaire
              </a>
              <a
                href="#vocabulaire"
                onClick={(e) => e.preventDefault()}
                className="text-[#1f2937] hover:text-[#0d6efd] py-[18px]"
              >
                Vocabulaire
              </a>
              <button
                type="button"
                className="text-[#4b5563] hover:text-[#0d6efd] p-1 cursor-pointer"
                aria-label="Plus d'outils"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </nav>
          </div>

          {/* Right: Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              className="bg-[#2980d9] hover:bg-[#2270c2] text-white text-[12px] font-medium px-3.5 py-2 rounded-[5px] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger pour Windows</span>
            </button>
            <button
              type="button"
              className="bg-[#f8c630] hover:bg-[#edb91f] text-[#1f2937] text-[12px] font-semibold px-3 py-2 rounded-[5px] cursor-pointer transition-colors"
            >
              Premium &rsaquo;
            </button>
            <button
              type="button"
              className="border border-[#d1d9e4] hover:bg-gray-50 text-[#374151] text-[12px] font-medium px-3 py-2 rounded-[5px] cursor-pointer transition-colors"
            >
              Connexion
            </button>
            <button
              type="button"
              className="text-[12px] font-medium text-[#374151] px-1.5 py-1 flex items-center gap-0.5 cursor-pointer"
            >
              <span>FR</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Blue-Grey Workspace Band */}
      <section className="w-full bg-[#eef5fc] border-b border-[#e1ebf5] pt-5 pb-10 px-4">
        <div className="max-w-[1060px] mx-auto">
          {/* Top Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="bg-white border border-[#c8daee] shadow-2xs rounded-[8px] px-3.5 py-2 flex items-center gap-2.5 text-left cursor-pointer"
              >
                <Languages className="w-4 h-4 text-[#0d6efd]" />
                <div>
                  <div className="text-[12.5px] font-semibold text-[#111827] leading-tight">
                    Traduire du texte
                  </div>
                  <div className="text-[11px] text-[#6b7280] leading-tight">
                    28 langues
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="bg-white/75 hover:bg-white border border-[#dce6f2] rounded-[8px] px-3.5 py-2 flex items-center gap-2.5 text-left cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-[#0d6efd]" />
                <div>
                  <div className="text-[12.5px] font-semibold text-[#0d6efd] leading-tight">
                    Traduire des documents
                  </div>
                  <div className="text-[11px] text-[#6b7280] leading-tight">
                    Word, PDF, PowerPoint, ...
                  </div>
                </div>
              </button>
            </div>

            <div className="relative">
              <span className="absolute -top-2 -right-1.5 bg-[#f3921f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] tracking-wide">
                NEW
              </span>
              <button
                type="button"
                className="bg-white/85 hover:bg-white border border-[#dce6f2] rounded-[8px] px-3.5 py-2 flex items-center gap-2.5 text-left cursor-pointer transition-colors"
              >
                <BookMarked className="w-4 h-4 text-[#0d6efd]" />
                <div>
                  <div className="text-[12.5px] font-semibold text-[#0d6efd] leading-tight">
                    Vocabulaire
                  </div>
                  <div className="text-[11px] text-[#6b7280] leading-tight">
                    Voir mots sauvegardés, Flashcards...
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Translation Container */}
          <div className="bg-white rounded-[10px] shadow-sm border border-[#d6e2ef] overflow-hidden">
            {/* Language Selector Header */}
            <div className="h-[48px] border-b border-[#e6edf5] px-4 flex items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{sourceObj.flag}</span>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  aria-label="Langue source"
                  className="text-[13.5px] font-medium text-[#1f2937] bg-transparent outline-none cursor-pointer pr-1"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSwapLanguages}
                title="Inverser les langues"
                className="p-1.5 rounded-full hover:bg-[#eef5fc] text-[#4b5563] hover:text-[#0d6efd] cursor-pointer transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{targetObj.flag}</span>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  aria-label="Langue cible"
                  className="text-[13.5px] font-medium text-[#1f2937] bg-transparent outline-none cursor-pointer pr-1"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dual Translation Panes */}
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[245px]">
              {/* Left Input Box */}
              <div className="relative border-2 border-[#2580d8] rounded-bl-[10px] md:rounded-bl-[10px] p-4 pb-12 flex flex-col bg-white">
                <div className="relative flex-1 flex flex-col">
                  <textarea
                    ref={textareaRef}
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    aria-label="Écrivez ou collez votre texte ici"
                    placeholder=""
                    className="w-full flex-1 resize-none outline-none text-[17px] leading-relaxed text-[#1f2937] bg-transparent z-10"
                  />
                  {!sourceText && (
                    <div className="absolute inset-0 pointer-events-none select-none">
                      <div className="text-[19px] text-[#7c8b99] font-normal">
                        Écrivez ou collez votre texte ici
                      </div>
                      <div className="mt-2.5 text-[12.5px] text-[#8b98a5]">
                        ou traduisez des fichiers PDF, Word et PowerPoint avec le{' '}
                        <span className="underline">traducteur de documents</span>
                      </div>
                    </div>
                  )}
                </div>

                {sourceText && (
                  <button
                    type="button"
                    onClick={() => setSourceText('')}
                    aria-label="Effacer le texte"
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 cursor-pointer z-20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Bottom Controls of Input Pane */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={submitCurrentText}
                    className="bg-[#0d6ecc] hover:bg-[#0a5cb0] text-white text-[12px] font-semibold px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="text-[9px] font-bold leading-none bg-white/20 px-1 py-0.5 rounded-xs">
                      ABC
                    </span>
                    <span>Correcteur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => textareaRef.current?.focus()}
                    title="Clavier virtuel"
                    className="p-1 text-[#5f6b7a] hover:text-[#0d6efd] cursor-pointer"
                  >
                    <Keyboard className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Output Box */}
              <div className="relative p-4 pb-12 bg-white border-t md:border-t-0 md:border-l border-[#e6edf5] flex flex-col justify-between">
                {currentResponse ? (
                  <>
                    <div className="text-[17px] leading-relaxed text-[#1f2937] whitespace-pre-wrap select-text pr-6">
                      {currentResponse}
                    </div>
                    <button
                      type="button"
                      onClick={onClearResponse}
                      aria-label="Effacer la traduction"
                      className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center justify-end gap-2 pt-3">
                      <button
                        type="button"
                        title="Écouter"
                        className="p-1.5 rounded hover:bg-gray-100 text-[#5f6b7a] hover:text-[#0d6efd] cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copier"
                        className="p-1.5 rounded hover:bg-gray-100 text-[#5f6b7a] hover:text-[#0d6efd] cursor-pointer"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8 select-none">
                    <p className="text-[12.5px] text-[#7c8b99] leading-relaxed">
                      Traduisez n&apos;importe où en un seul clic avec Reverso pour Windows
                    </p>
                    <a
                      href="#download"
                      onClick={(e) => e.preventDefault()}
                      className="mt-1 text-[12.5px] text-[#0d6efd] underline hover:text-[#0a58ca]"
                    >
                      Télécharger gratuitement
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Promotional Card matching screenshot */}
      <section className="flex-1 bg-white py-8 px-4">
        <div className="max-w-[1060px] mx-auto border border-[#e5eaf0] rounded-[10px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xs">
          <div className="max-w-sm space-y-3">
            <h2 className="text-[19px] font-bold text-[#1f2937] leading-snug">
              Gagnez en productivité avec notre application gratuite
            </h2>
            <p className="text-[13px] text-[#6b7280] leading-relaxed">
              Traduisez en un clic dans toutes vos applications : chats, emails, articles, documents...
            </p>
            <button
              type="button"
              className="mt-2 bg-[#2980d9] hover:bg-[#2270c2] text-white text-[12.5px] font-medium px-4 py-2.5 rounded-[5px] inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Télécharger pour Windows</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Mini Chat Illustration Card */}
          <div className="relative w-full max-w-[330px] bg-[#f8fafc] border border-[#e5eaf0] rounded-[10px] p-4 shadow-xs">
            <div className="space-y-2 text-[12px]">
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-fit shadow-2xs text-[#1f2937]">
                Salut Josh
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-fit shadow-2xs text-[#1f2937]">
                On dîne ensemble ce soir ?
              </div>
              <div className="bg-[#dcf8c6] rounded-lg px-3 py-1.5 w-fit ml-auto text-[#1f2937] shadow-2xs">
                Bien sûr !
              </div>
            </div>
            <div className="mt-3 bg-white border border-gray-200 rounded-full px-3 py-1.5 flex items-center justify-between text-[11.5px] text-gray-600">
              <span>How about a French restaurant?</span>
              <span className="inline-flex items-center gap-1 bg-[#0d6ecc] text-white px-2 py-0.5 rounded text-[10px] font-medium">
                <Send className="w-2.5 h-2.5" />
                Translate &amp; Send
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
