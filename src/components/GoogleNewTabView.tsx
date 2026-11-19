import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Mic,
  ScanSearch,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Pencil,
  Building2,
  User,
  Search,
  ExternalLink,
} from 'lucide-react';

interface GoogleNewTabViewProps {
  isUnlocked: boolean;
  activationPhase: 'idle' | 'trembling' | 'activated';
  currentResponse: string | null;
  isNavigationTarget: (query: string) => boolean;
  onSendQuery: (query: string) => void;
  // Portal hook: text starting with "/" is offered to the server first. Resolves to true when
  // consumed; otherwise the text is searched normally. Undefined once the session is open.
  onGateAttempt?: (query: string) => Promise<boolean>;
  onClearResponse: () => void;
  onGoHome: () => void;
  onOpenLegal: () => void;
  resetSignal: number;
}

const SECRET_GOOGLE_ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export default function GoogleNewTabView({
  isUnlocked,
  activationPhase,
  currentResponse,
  isNavigationTarget,
  onSendQuery,
  onGateAttempt,
  onClearResponse,
  onGoHome,
  onOpenLegal,
  resetSignal,
}: GoogleNewTabViewProps) {
  const [query, setQuery] = useState('');
  const [messageMode, setMessageMode] = useState(isUnlocked);
  const [iframeSearchQuery, setIframeSearchQuery] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const arrowBufferRef = useRef<string[]>([]);
  const prevResetRef = useRef(resetSignal);

  // Always put the cursor in the search bar when the page shows up (and after a reset / SERP view),
  // so typing "/" lands in the field. A few retries: Firefox/Zen sometimes ignores the first focus().
  useEffect(() => {
    const focusInput = () => {
      if (document.activeElement !== inputRef.current) inputRef.current?.focus();
    };
    focusInput();
    const timers = [60, 200, 500].map((ms) => setTimeout(focusInput, ms));
    return () => timers.forEach(clearTimeout);
  }, [resetSignal, iframeSearchQuery]);

  // Firefox/Zen open "quick find" when "/" is typed outside a text field, which swallows
  // the character. If focus is not in a field, keep the "/" and send it to the search bar.
  useEffect(() => {
    const handleSlash = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setQuery((q) => q + '/');
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', handleSlash, { capture: true });
    return () => window.removeEventListener('keydown', handleSlash, { capture: true });
  }, []);

  // Keep Google message mode synced with cheat code activation state
  useEffect(() => {
    setMessageMode(isUnlocked);
    if (!isUnlocked) {
      setIframeSearchQuery(null);
    }
  }, [isUnlocked]);

  // Reset to clean Google New Tab when "Revenir à Google" is clicked
  useEffect(() => {
    if (resetSignal !== prevResetRef.current) {
      prevResetRef.current = resetSignal;
      setMessageMode(isUnlocked);
      setIframeSearchQuery(null);
      setQuery('');
      arrowBufferRef.current = [];
    }
  }, [resetSignal, isUnlocked]);

  // Listen for ArrowUp, ArrowDown, ArrowLeft, ArrowRight to toggle stealth message mode (only when unlocked)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMessageMode(false);
        setIframeSearchQuery(null);
        arrowBufferRef.current = [];
        return;
      }

      if (!isUnlocked) return;

      const target = e.target as HTMLElement | null;
      const isOurEmptyInput = target === inputRef.current && query.length === 0;
      const isTypingField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isTypingField && !isOurEmptyInput) return;

      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        const next = [...arrowBufferRef.current, e.key].slice(-SECRET_GOOGLE_ARROWS.length);
        arrowBufferRef.current = next;

        const matches =
          next.length === SECRET_GOOGLE_ARROWS.length &&
          next.every((val, idx) => val === SECRET_GOOGLE_ARROWS[idx]);

        if (matches) {
          arrowBufferRef.current = [];
          setIframeSearchQuery(null);
          setMessageMode((prev) => !prev);
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [query, isUnlocked]);

  // Search normally (redirect to Google, or SERP fallback when framed)
  const runSearch = (text: string) => {
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    if (window.self === window.top) {
      window.location.href = googleUrl;
    } else {
      setIframeSearchQuery(text);
      setQuery('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // 0. /accueil command always returns cleanly to Google home
    if (trimmed.toLowerCase() === '/accueil') {
      onSendQuery(trimmed);
      setIframeSearchQuery(null);
      setQuery('');
      return;
    }

    // 1. Site navigation keywords (wordreference, ecole directe, powerpoint, reverso, word, explorer, wikipedia, mblock, quiziniere)
    if (isNavigationTarget(trimmed)) {
      onSendQuery(trimmed);
      setQuery('');
      return;
    }

    // 2. If messageMode is active, send message to connected fake pages
    if (messageMode) {
      onSendQuery(trimmed);
      setQuery('');
      inputRef.current?.focus();
      return;
    }

    // 3. Portal: slash text is checked by the server; if refused it is just a search
    if (onGateAttempt && trimmed.startsWith('/')) {
      const consumed = await onGateAttempt(trimmed);
      if (consumed) {
        setQuery('');
        return;
      }
    }

    // 4. Normal Google search behavior
    runSearch(trimmed);
  };

  // Simulated Google SERP fallback when running inside an iframe (since google.com blocks iframe embedding)
  if (iframeSearchQuery) {
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(iframeSearchQuery)}`;
    return (
      <div className="min-h-screen bg-white text-[#202124] font-sans antialiased flex flex-col">
        <header className="border-b border-gray-200 px-4 sm:px-8 py-4 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => setIframeSearchQuery(null)}
            className="text-[24px] font-medium tracking-tight cursor-pointer"
            style={{ fontFamily: 'Product Sans, Arial, sans-serif' }}
          >
            <span className="text-[#4285f4]">G</span>
            <span className="text-[#ea4335]">o</span>
            <span className="text-[#fbbc05]">o</span>
            <span className="text-[#4285f4]">g</span>
            <span className="text-[#34a853]">l</span>
            <span className="text-[#ea4335]">e</span>
          </button>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const trimmed = query.trim();
              if (!trimmed) return;
              if (trimmed.toLowerCase() === '/accueil') {
                onSendQuery(trimmed);
                setIframeSearchQuery(null);
                setQuery('');
                return;
              }
              if (isNavigationTarget(trimmed)) {
                onSendQuery(trimmed);
                setQuery('');
                return;
              }
              if (onGateAttempt && trimmed.startsWith('/')) {
                if (await onGateAttempt(trimmed)) {
                  setQuery('');
                  return;
                }
              }
              setIframeSearchQuery(trimmed);
              setQuery('');
            }}
            className="flex-1 max-w-[640px] flex items-center border border-gray-300 rounded-full px-4 h-10 shadow-xs"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={iframeSearchQuery}
              className="flex-1 outline-none text-sm text-[#202124]"
            />
            <button type="submit" className="text-[#4285f4] pl-2 cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </header>

        <main className="max-w-[700px] px-4 sm:px-8 md:ml-28 py-6 space-y-6">
          <div className="text-xs text-[#70757a]">
            Résultats de recherche pour « {iframeSearchQuery} »
          </div>

          <div className="p-4 rounded-lg border border-gray-200 bg-[#f8f9fa] flex items-center justify-between gap-4">
            <div className="text-sm text-[#3c4043]">
              Rechercher directement <strong className="text-[#202124]">{iframeSearchQuery}</strong> sur Google
            </div>
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1a73e8] hover:bg-[#1765cc] text-white text-xs font-medium px-4 py-2 rounded-full shrink-0"
            >
              <span>Ouvrir Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-5">
            <div>
              <div className="text-xs text-[#202124]">https://fr.wikipedia.org › wiki › {encodeURIComponent(iframeSearchQuery)}</div>
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[#1a0dab] hover:underline font-normal block mt-0.5"
              >
                {iframeSearchQuery} — Wikipédia
              </a>
              <p className="text-sm text-[#4d5156] mt-1">
                Consultez l&apos;article complet, les définitions et les références documentaires liées à « {iframeSearchQuery} ».
              </p>
            </div>

            <div>
              <div className="text-xs text-[#202124]">https://www.larousse.fr › dictionnaires › {encodeURIComponent(iframeSearchQuery)}</div>
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[#1a0dab] hover:underline font-normal block mt-0.5"
              >
                Définition : {iframeSearchQuery} - Dictionnaire de français Larousse
              </a>
              <p className="text-sm text-[#4d5156] mt-1">
                Définitions, synonymes, conjugaison et exemples d&apos;utilisation pour {iframeSearchQuery}.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col justify-between font-sans antialiased select-none bg-white text-[#202124]">
      {/* Top Right Links */}
      <header className="relative z-10 w-full px-5 pt-3.5 flex items-center justify-end gap-4 text-[13px]">
        <a
          href="#gmail"
          onClick={(e) => e.preventDefault()}
          className="hover:underline text-[#202124]"
        >
          Gmail
        </a>
        <a
          href="#images"
          onClick={(e) => e.preventDefault()}
          className="hover:underline text-[#202124]"
        >
          Images
        </a>
        <button
          type="button"
          className="p-2 rounded-full transition-colors hover:bg-black/5"
          title="Applications Google"
        >
          <div className="grid grid-cols-3 gap-[3px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full bg-[#5f6368]"
              />
            ))}
          </div>
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1a73e8] text-white">
          <User className="w-4 h-4" />
        </div>
      </header>

      {/* Center Google Logo, Search Bar, Live Answer Card (when messageMode active), Shortcuts */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 -mt-8">
        <button
          type="button"
          onClick={onGoHome}
          className="text-[64px] sm:text-[82px] font-medium tracking-[-0.02em] mb-7 cursor-pointer bg-transparent border-0"
          style={{ fontFamily: "'Product Sans', 'Poppins', Arial, sans-serif" }}
        >
          <span className="text-[#4285f4]">G</span>
          <span className="text-[#ea4335]">o</span>
          <span className="text-[#fbbc05]">o</span>
          <span className="text-[#4285f4]">g</span>
          <span className="text-[#34a853]">l</span>
          <span className="text-[#ea4335]">e</span>
        </button>

        {/* Search Pill */}
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-[580px] bg-white rounded-full h-[48px] px-4 flex items-center gap-3 text-[#202124] border border-[#dfe1e5] shadow-sm hover:shadow-md ${
            activationPhase === 'trembling' ? 'animate-bar-tremble' : ''
          }`}
        >
          <Plus className="w-5 h-5 shrink-0 text-[#5f6368]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Demander à Google"
            autoComplete="off"
            autoFocus
            className="flex-1 bg-transparent outline-none text-[15px] text-[#202124] placeholder-[#5f6368]"
          />
          <button type="button" className="p-1 text-[#5f6368] hover:text-[#202124]">
            <Mic className="w-4 h-4" />
          </button>
          <button type="button" className="p-1 text-[#5f6368] hover:text-[#202124]">
            <ScanSearch className="w-4 h-4" />
          </button>
          <button
            type="submit"
            className="bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] rounded-full px-3 py-1.5 text-[12px] font-medium flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mode IA</span>
          </button>
        </form>

        {/* Confirmation displayed after 1s tremble when mode is activated */}
        {activationPhase === 'activated' && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1a73e8] bg-[#e8f0fe] px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mode activé</span>
          </div>
        )}

        {/* Live Single Response Card (only visible when messageMode is active) */}
        {messageMode && currentResponse && (
          <div className="mt-4 w-full max-w-[580px] bg-white text-[#202124] rounded-2xl px-5 py-3.5 shadow-lg border border-black/10 select-text">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-[#5f6368] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
                Réponse instantanée
              </span>
            </div>
            <p className="text-[15px] leading-relaxed text-[#202124]">
              {currentResponse}
            </p>
          </div>
        )}

        {/* Shortcuts Row */}
        <div className="mt-7 flex items-center justify-center gap-7">
          <button type="button" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f1f3f4] group-hover:bg-[#e8eaed]">
              <div className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-2xs">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#34a853] via-[#fbbc05] to-[#ea4335] border-2 border-[#4285f4]" />
              </div>
            </div>
            <span className="text-[12px] text-[#202124]">Web Store</span>
          </button>

          <button type="button" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f1f3f4] group-hover:bg-[#e8eaed] text-[#202124]">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[12px] text-[#202124]">Ajouter un racc...</span>
          </button>
        </div>

        {/* Extensions Tip Card */}
        <div className="mt-10 rounded-2xl px-4 py-3 flex items-center gap-3 max-w-[440px] w-full bg-[#f8f9fa] border border-[#e8eaed] text-[#3c4043]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#e8f0fe]">
            <div className="w-4 h-4 border rounded-xs border-[#1a73e8]" />
          </div>
          <p className="text-[12px] leading-snug flex-1">
            Ajoutez des extensions pour rester organisé, simplifier vos tâches et améliorer votre navigation
          </p>
          <ChevronRight className="w-4 h-4 shrink-0 text-[#5f6368]" />
          <MoreVertical className="w-4 h-4 shrink-0 text-[#5f6368]" />
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="relative z-10 w-full px-5 pb-4 flex items-center justify-between gap-3 text-[12px]">
        <button
          type="button"
          onClick={onOpenLegal}
          className="text-[#5f6368] hover:text-[#202124] hover:underline cursor-pointer bg-transparent border-0 p-0 text-[12px] shrink-0"
        >
          Conditions d&apos;utilisation
        </button>
        <div className="flex items-center gap-2 mx-auto text-[#5f6368]">
          <Building2 className="w-3.5 h-3.5" />
          <span className="underline">Géré par votre organisation</span>
        </div>
        <button
          type="button"
          className="rounded-full px-3.5 py-1.5 text-[12px] font-medium flex items-center gap-1.5 shadow-xs shrink-0 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043] border border-[#dadce0]"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Personnaliser Chrome</span>
        </button>
      </footer>
    </div>
  );
}
