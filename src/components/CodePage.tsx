import React, { useEffect, useRef, useState } from 'react';
import { checkCode } from '../utils/session';

interface CodePageProps {
  step: string | null;
  onGranted: (token: string) => void;
  onOpen: () => void;
  onCancel: () => void;
}

const FINAL_PASSPHRASE = 'soleil42';
const ALT_CODE = 'opensesame';

type Status = 'idle' | 'checking' | 'wrong' | 'unavailable' | 'granted' | 'opening';

export default function CodePage({
  step,
  onGranted,
  onOpen,
  onCancel,
}: CodePageProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cancel pending steps when leaving the page
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Focus the field right away (a few retries: Firefox/Zen sometimes ignores the first focus())
  useEffect(() => {
    document.title = 'Vérification requise';
    const focusInput = () => {
      if (document.activeElement !== inputRef.current) inputRef.current?.focus();
    };
    focusInput();
    const timers = [60, 200, 500].map((ms) => setTimeout(focusInput, ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Typing anywhere on the page goes into the field (and "/" is never swallowed by quick find)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target === inputRef.current) return;
      if (e.key.length !== 1) return;
      e.preventDefault();
      setCode((c) => (c + e.key).slice(0, 64));
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', handleKey, { capture: true });
    return () => window.removeEventListener('keydown', handleKey, { capture: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const attempt = code.trim();
    if (!attempt || status === 'checking') return;

    setStatus('checking');

    if (attempt.toLowerCase() === FINAL_PASSPHRASE) {
      setTimeout(() => setStatus('unavailable'), 1800);
      return;
    }

    if (attempt.toLowerCase() === ALT_CODE) {
      timersRef.current = [
        setTimeout(() => setStatus('granted'), 1200),
        setTimeout(() => setStatus('opening'), 2400),
        setTimeout(() => onOpen(), 3800),
      ];
      return;
    }

    const reply = await checkCode(3, attempt, step);
    if (reply.ok && reply.token) {
      onGranted(reply.token);
      return;
    }
    setStatus('wrong');
    setCode('');
    inputRef.current?.focus();
  };

  // Access granted screen
  if (status === 'granted' || status === 'opening') {
    return (
      <div className="min-h-screen w-full bg-[#f8f9fa] text-[#202124] flex items-center justify-center p-6 font-sans antialiased select-none">
        <div className="w-full max-w-[380px] bg-white border border-[#dadce0] rounded-lg shadow-sm p-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#e6f4ea] text-[#188038] flex items-center justify-center text-[28px] animate-bounce">
            ✓
          </div>
          <h1 className="text-[20px] font-medium text-[#188038]">Accès autorisé</h1>
          {status === 'opening' && (
            <div className="flex items-center justify-center gap-2.5 text-[13.5px] text-[#5f6368]">
              <div
                className="w-4 h-4 rounded-full border-2 border-[#dadce0] border-t-[#1a73e8] animate-spin"
                role="status"
                aria-label="Chargement"
              />
              <span>Ouverture de la conversation…</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] text-[#202124] flex items-center justify-center p-6 font-sans antialiased">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] bg-white border border-[#dadce0] rounded-lg shadow-sm p-7 space-y-5"
      >
        <div className="space-y-1">
          <h1 className="text-[20px] font-medium text-[#202124]">Vérification requise</h1>
          <p className="text-[13.5px] text-[#5f6368]">
            Saisissez le code pour continuer.
          </p>
        </div>

        {status === 'unavailable' ? (
          <p className="text-[13.5px] text-[#d93025]">
            Erreur 503 — Service temporairement indisponible. Réessayez plus tard.
          </p>
        ) : (
          <>
            <input
              ref={inputRef}
              type="password"
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (status === 'wrong') setStatus('idle');
              }}
              maxLength={64}
              autoComplete="off"
              aria-label="Code"
              className={`w-full h-11 px-3 text-[15px] border rounded-md outline-none transition-colors ${
                status === 'wrong'
                  ? 'border-[#d93025]'
                  : 'border-[#dadce0] focus:border-[#1a73e8]'
              }`}
            />
            {status === 'wrong' && (
              <p className="text-[12.5px] text-[#d93025] -mt-3">Code incorrect.</p>
            )}
            <button
              type="submit"
              disabled={status === 'checking'}
              className="w-full h-10 rounded-md bg-[#1a73e8] hover:bg-[#1765cc] disabled:opacity-60 text-white text-[14px] font-medium cursor-pointer"
            >
              {status === 'checking' ? 'Vérification…' : 'Continuer'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
