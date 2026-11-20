import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

interface MessagesViewProps {
  // "/accueil" leaves this view
  onExit: () => void;
}

interface LocalMessage {
  id: number;
  author: string;
  text: string;
  time: string;
}

export default function MessagesView({ onExit }: MessagesViewProps) {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [pseudo, setPseudo] = useState('Moi');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(1);

  useEffect(() => {
    document.title = 'Messages';
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');

    // Chat commands
    const lower = text.toLowerCase();
    if (lower === '/accueil') {
      onExit();
      return;
    }
    if (lower === '/pseudo' || lower.startsWith('/pseudo ')) {
      setPseudo(text.slice(7).trim().slice(0, 32) || 'Moi');
      return;
    }
    if (lower === '/code' || lower.startsWith('/code ') || lower === '/salon' || lower.startsWith('/salon ')) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: nextIdRef.current++,
        author: pseudo,
        text,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#f0f2f5] text-[#111b21] font-sans antialiased">
      <header className="h-[56px] shrink-0 bg-white border-b border-[#e2e5e9] px-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#dbe4f3] text-[#3b5998] flex items-center justify-center text-[14px] font-semibold">
          #
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-medium">Conversation</div>
          <div className="text-[12px] text-[#667781]">1 membre</div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[13.5px] text-[#8696a0]">
            Aucun message pour le moment
          </div>
        ) : (
          <div className="max-w-[720px] mx-auto space-y-2">
            {messages.map((m) => (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] bg-[#d9fdd3] rounded-lg px-3 py-1.5 shadow-xs">
                  <div className="text-[11px] font-medium text-[#3b8a5a]">{m.author}</div>
                  <div className="text-[14.5px] break-words whitespace-pre-wrap">{m.text}</div>
                  <div className="text-right text-[10.5px] text-[#667781]">{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </main>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 bg-white border-t border-[#e2e5e9] px-3 py-2.5 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Écrire un message"
          autoComplete="off"
          maxLength={500}
          className="flex-1 h-10 px-4 rounded-full bg-[#f0f2f5] outline-none text-[14.5px]"
        />
        <button
          type="submit"
          aria-label="Envoyer"
          className="w-10 h-10 rounded-full bg-[#1a73e8] hover:bg-[#1765cc] text-white flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
