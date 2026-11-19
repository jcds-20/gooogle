import React, { useState, useEffect, useRef } from 'react';
import {
  GitFork,
  UserCheck,
  MessageSquare,
  Mail,
  Calendar,
  BookOpen,
  Calculator,
  FileText,
  Folder,
  Network,
  Cloud,
  LayoutGrid,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  LogOut,
  User,
  Inbox,
  Send,
  FileEdit,
  Trash2,
} from 'lucide-react';

interface EcoleDirecteViewProps {
  currentResponse: string | null;
  onSendQuery: (query: string) => void;
  onClearResponse: () => void;
  onGoHome: () => void;
}

interface HomeworkItem {
  subject: string;
  isExam?: boolean;
  givenDate: string;
}

interface HomeworkDay {
  dateLabel: string;
  items: HomeworkItem[];
}

const HOMEWORK_DAYS: HomeworkDay[] = [
  {
    dateLabel: 'vendredi 13 novembre',
    items: [
      { subject: 'ANGLAIS LV1', isExam: true, givenDate: 'Donné le vendredi 6 novembre' },
      { subject: 'FRANÇAIS', givenDate: 'Donné le vendredi 16 octobre' },
    ],
  },
  {
    dateLabel: 'mardi 17 novembre',
    items: [
      { subject: 'ANGLAIS LV1', givenDate: 'Donné le vendredi 13 novembre' },
      { subject: 'EDUCATION MUSICALE', givenDate: 'Donné le mardi 10 novembre' },
      { subject: 'SCIENCES VIE & TERRE', isExam: true, givenDate: 'Donné le mardi 10 novembre' },
      { subject: 'ESPAGNOL LV2', givenDate: 'Donné le lundi 12 octobre' },
    ],
  },
  {
    dateLabel: 'jeudi 19 novembre',
    items: [
      { subject: 'ANGLAIS LV1', isExam: true, givenDate: 'Donné le mercredi 11 novembre' },
      { subject: 'PHYSIQUE-CHIMIE', givenDate: 'Donné le jeudi 12 novembre' },
      { subject: 'TECHNOLOGIE', givenDate: 'Donné le vendredi 13 novembre' },
    ],
  },
];

const CALENDAR_WEEKS = [
  [{ day: 1, muted: true, strike: true }],
  [{ day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 }, { day: 7 }, { day: 8, muted: true }],
  [{ day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13, active: true }, { day: 14 }, { day: 15, muted: true }],
  [{ day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22, muted: true }],
  [{ day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 }, { day: 29, muted: true }],
  [{ day: 30 }],
];

const SIDE_DAYS = ['Lundi 9', 'Mardi 10', 'Mercredi 11', 'Jeudi 12', 'Vendredi 13', 'Samedi 14'];

const SECRET_ARROW_SEQUENCE = [
  'ArrowDown',
  'ArrowDown',
  'ArrowUp',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
];

export default function EcoleDirecteView({
  currentResponse,
  onSendQuery,
  onClearResponse,
  onGoHome,
}: EcoleDirecteViewProps) {
  const [selectedDay, setSelectedDay] = useState(13);
  const [activeSection, setActiveSection] = useState<'cahier' | 'messagerie'>('cahier');
  const [messageInput, setMessageInput] = useState('');

  const arrowBufferRef = useRef<string[]>([]);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Listen for arrow sequence: Bas, Bas, Haut, Haut, Gauche, Droite -> opens Messagerie tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSection === 'messagerie') {
        setActiveSection('cahier');
        return;
      }

      const target = e.target as HTMLElement | null;
      const isTypingField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isTypingField) return;

      if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        const next = [...arrowBufferRef.current, e.key].slice(-SECRET_ARROW_SEQUENCE.length);
        arrowBufferRef.current = next;

        const matches =
          next.length === SECRET_ARROW_SEQUENCE.length &&
          next.every((val, idx) => val === SECRET_ARROW_SEQUENCE[idx]);

        if (matches) {
          arrowBufferRef.current = [];
          setActiveSection('messagerie');
          setTimeout(() => {
            messageInputRef.current?.focus();
          }, 30);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    onSendQuery(trimmed);
    setMessageInput('');
    messageInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex bg-[#f7f9fc] text-[#333333] font-sans antialiased select-none">
      {/* Left Navigation Sidebar */}
      <aside className="w-[74px] bg-[#043774] text-white flex flex-col items-center shrink-0 relative z-10">
        {/* Mon Espace Élève */}
        <div className="w-full bg-[#022a5a] px-1 py-3 text-center border-b border-[#0d488c]">
          <div className="text-[10px] font-bold leading-tight tracking-wide uppercase">
            MON ESPACE
            <br />
            ÉLÈVE
          </div>
        </div>

        {/* Vertical Icon Menu (no photo) */}
        <nav className="w-full flex-1 flex flex-col items-center py-2 space-y-1">
          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <GitFork className="w-4 h-4 rotate-90" />
          </button>
          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <UserCheck className="w-4 h-4" />
          </button>
          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button type="button" className="w-full py-2 flex flex-col items-center justify-center text-white/90 hover:text-white hover:bg-white/10">
            <span className="text-[10px] font-bold leading-none border-b border-white/60 pb-0.5">18</span>
            <span className="text-[10px] font-bold leading-none pt-0.5">20</span>
          </button>

          {/* Mail / Messagerie icon (highlights white when Messagerie unlocked via arrow sequence) */}
          {activeSection === 'messagerie' ? (
            <div className="w-full pl-2 my-1">
              <button
                type="button"
                className="w-full py-2.5 bg-white text-[#043774] rounded-l-md flex justify-center shadow-xs relative"
                title="Messagerie"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10 relative">
              <Mail className="w-4 h-4" />
              <span className="absolute top-1.5 right-3.5 bg-[#e91e63] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                6
              </span>
            </button>
          )}

          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <Calendar className="w-4 h-4" />
          </button>

          {/* Cahier de textes tab (clicking switches back to Cahier de textes) */}
          {activeSection === 'cahier' ? (
            <div className="w-full pl-2 my-1">
              <button
                type="button"
                className="w-full py-2.5 bg-white text-[#043774] rounded-l-md flex justify-center shadow-xs"
                title="Cahier de textes"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveSection('cahier')}
              className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Cahier de textes"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <Calculator className="w-4 h-4" />
          </button>
          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <FileText className="w-4 h-4" />
          </button>
          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <Folder className="w-4 h-4" />
          </button>
          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <Network className="w-4 h-4" />
          </button>
          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <Cloud className="w-4 h-4" />
          </button>
          <button type="button" className="w-full py-2.5 flex justify-center text-white/80 hover:text-white hover:bg-white/10">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </nav>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Blue Header */}
        <header className="h-[38px] bg-[#043774] text-white px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onGoHome}
            className="text-[12px] font-normal tracking-wide cursor-pointer bg-transparent border-0 p-0 text-white"
          >
            EcoleDirecte
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-white text-[#043774] rounded-full px-3 py-0.5 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
              <span className="w-3.5 h-3.5 rounded-full bg-[#043774] text-white flex items-center justify-center text-[9px]">
                <User className="w-2.5 h-2.5" />
              </span>
              <span>Compte élève</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection('cahier')}
              className="w-6 h-6 rounded bg-[#d81b60] hover:bg-[#c2185b] text-white flex items-center justify-center cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Subheader Title */}
        <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <h1 className="text-[20px] font-normal text-[#135399]">
            {activeSection === 'messagerie' ? 'Messagerie' : 'Cahier de textes'}
          </h1>
          {activeSection === 'messagerie' && (
            <button
              type="button"
              onClick={() => setActiveSection('cahier')}
              className="text-xs text-[#135399] hover:underline cursor-pointer"
            >
              Retour au Cahier de textes
            </button>
          )}
        </div>

        {/* SECTION 1: CAHIER DE TEXTES (default) */}
        {activeSection === 'cahier' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Calendar Panel */}
            <div className="hidden md:flex w-[320px] lg:w-[360px] bg-[#eaf0f8] p-6 justify-center items-start shrink-0">
              <div className="w-[235px] bg-white rounded shadow-md overflow-hidden border border-gray-200">
                <div className="bg-[#0a4a94] text-white px-3 py-2.5 flex items-center justify-between text-[12px] font-semibold">
                  <button type="button" className="hover:opacity-80 p-0.5">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-5">
                    <span>novembre</span>
                    <span>2026</span>
                  </div>
                  <button type="button" className="hover:opacity-80 p-0.5">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#0a4a94] px-2 pt-3 pb-1">
                  <span>lun.</span>
                  <span>mar.</span>
                  <span>mer.</span>
                  <span>jeu.</span>
                  <span>ven.</span>
                  <span>sam.</span>
                  <span>dim.</span>
                </div>

                <div className="px-2 pb-3 space-y-1 text-[11px]">
                  <div className="grid grid-cols-7 text-center">
                    <span /><span /><span /><span /><span /><span />
                    <span className="py-1.5 text-gray-300 line-through">1</span>
                  </div>

                  {CALENDAR_WEEKS.slice(1).map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-cols-7 text-center items-center">
                      {week.map((cell) => {
                        const isSelected = cell.day === selectedDay;
                        return (
                          <button
                            key={cell.day}
                            type="button"
                            onClick={() => !cell.muted && setSelectedDay(cell.day)}
                            className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#d9e5f5] text-[#0a4a94] font-bold'
                                : cell.muted
                                ? 'text-gray-300'
                                : 'text-[#444444] hover:bg-gray-100'
                            }`}
                          >
                            {cell.day}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Homework List */}
            <div className="flex-1 bg-white p-5 sm:p-7 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[13px] font-normal text-[#333333]">
                    Tous les devoirs à venir
                  </h2>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-1.5 border border-gray-300 rounded text-[#0a4a94] hover:bg-gray-50"
                    title="Imprimer"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {HOMEWORK_DAYS.map((day) => (
                    <div
                      key={day.dateLabel}
                      className="border border-gray-200 rounded-md shadow-xs overflow-hidden bg-white"
                    >
                      <div className="bg-[#f4f5f7] px-5 pt-2 pb-2.5 relative border-b border-gray-100">
                        <div className="w-1 h-4 bg-[#0a4a94] rounded-b-sm mb-1" />
                        <div className="text-[14px] font-normal text-[#135399]">
                          {day.dateLabel}
                        </div>
                      </div>

                      <div className="px-5 py-3 space-y-1.5 text-[11px]">
                        {day.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-4 py-0.5 hover:bg-gray-50 rounded px-1 -mx-1"
                          >
                            <div className="flex items-center gap-2 font-medium text-[#222222]">
                              <span>{item.subject}</span>
                              {item.isExam && (
                                <span className="text-[#c62828] font-normal">
                                  (Contrôle)
                                </span>
                              )}
                            </div>
                            <span className="text-gray-600 text-right shrink-0">
                              {item.givenDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Vertical Day Selector Strip */}
            <div className="hidden sm:flex w-10 bg-[#f7f9fc] border-l border-gray-200 flex-col items-center py-3 justify-between shrink-0">
              <button
                type="button"
                className="w-5 h-5 rounded-full bg-[#0a4a94] text-white flex items-center justify-center hover:bg-[#083b78]"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-2 overflow-hidden">
                {SIDE_DAYS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="bg-[#eef3fa] hover:bg-[#dce7f7] text-[#135399] text-[10px] font-medium px-1 py-3 rounded"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="w-5 h-5 rounded-full bg-[#0a4a94] text-white flex items-center justify-center hover:bg-[#083b78]"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: MESSAGERIE (opened via ArrowDown x2, ArrowUp x2, ArrowLeft, ArrowRight) */}
        {activeSection === 'messagerie' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Folders Pane */}
            <div className="hidden md:flex w-[240px] bg-[#eaf0f8] p-4 border-r border-gray-200 flex-col gap-1 shrink-0 text-[13px]">
              <button
                type="button"
                onClick={onClearResponse}
                className="w-full px-3 py-2 rounded bg-[#0a4a94] text-white font-medium flex items-center gap-2.5 text-left cursor-pointer"
              >
                <Inbox className="w-4 h-4" />
                <span>Boîte de réception</span>
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 rounded text-[#333333] hover:bg-white/70 flex items-center gap-2.5 text-left"
              >
                <Send className="w-4 h-4 text-[#0a4a94]" />
                <span>Messages envoyés</span>
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 rounded text-[#333333] hover:bg-white/70 flex items-center gap-2.5 text-left"
              >
                <FileEdit className="w-4 h-4 text-[#0a4a94]" />
                <span>Brouillons</span>
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 rounded text-[#333333] hover:bg-white/70 flex items-center gap-2.5 text-left"
              >
                <Trash2 className="w-4 h-4 text-[#0a4a94]" />
                <span>Corbeille</span>
              </button>
            </div>

            {/* Message Reader + Compose Box (no history, live single message sync) */}
            <div className="flex-1 bg-white p-5 sm:p-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Latest Received Message */}
                <div className="border border-gray-200 rounded-md shadow-xs overflow-hidden bg-white">
                  <div className="bg-[#f4f5f7] px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="w-1 h-3.5 bg-[#0a4a94] rounded-b-sm mb-1" />
                      <div className="text-[14px] font-medium text-[#135399]">
                        {currentResponse ? 'Note reçue — Vie Scolaire' : 'Boîte de réception'}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        De : Administration &bull; À : Compte élève
                      </div>
                    </div>
                    {currentResponse && (
                      <button
                        type="button"
                        onClick={onClearResponse}
                        className="text-[11px] text-gray-500 hover:text-[#135399] cursor-pointer"
                      >
                        Effacer
                      </button>
                    )}
                  </div>

                  <div className="p-5 text-[14px] leading-relaxed text-[#222222] select-text min-h-[84px]">
                    {currentResponse ? (
                      <p>{currentResponse}</p>
                    ) : (
                      <p className="text-gray-400 italic text-[13px]">
                        Aucun message affiché pour le moment.
                      </p>
                    )}
                  </div>
                </div>

                {/* Compose Box (typing + Enter transmits live to all other connected PCs) */}
                <form
                  onSubmit={handleMessageSubmit}
                  className="border border-gray-200 rounded-md shadow-xs overflow-hidden bg-white"
                >
                  <div className="bg-[#f4f5f7] px-5 py-2.5 border-b border-gray-200 text-[13px] font-medium text-[#135399]">
                    Rédiger un message
                  </div>
                  <div className="p-4 flex flex-col sm:flex-row gap-3">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Écrire un message..."
                      autoComplete="off"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#0a4a94]"
                    />
                    <button
                      type="submit"
                      className="bg-[#0a4a94] hover:bg-[#083b78] text-white px-5 py-2 rounded text-[13px] font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
