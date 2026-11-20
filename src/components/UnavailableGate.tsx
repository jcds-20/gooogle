import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AlertCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import LegalWarningModal from './LegalWarningModal';
import { checkCode } from '../utils/session';

interface UnavailableGateProps {
  onUnlock: () => void;
  onProceed: (step: string) => void;
}

type GateStage =
  | 'not_found'
  | 'oops'
  | 'welcome'
  | 'locked'
  | 'google_deleted'
  | 'blank_motion'
  | 'troll_url'
  | 'loading'
  | 'legal'
  | 'hour_timer'
  | 'monologue'
  | 'binary'
  | 'captcha';

const ENTRY_TRIGGER = 'aeiavectoijememarie';
const FAST_TRIGGER = 'aeijtm';
const MASTER_KEY = 'ouvretoi42';
const ALT_KEYS = [FAST_TRIGGER, MASTER_KEY];

// entry key / DEBUG access
const DEV_ACCESS = {
  ENTRY_CODE: 'bravotumatrouver', // entry key
  ACCESS_KEY: 'devaccess2024', // DEBUG access
  DEBUG_KEY: 'letmeinplease', // DEBUG access (staging)
};

// review notes
const NOTE_PARTS = ['ique', 'plast', 'fdart', 'lepro'];
const stitchParts = (parts: string[]) => [...parts].reverse().join('');

// build metadata
const BUILD_META = {
  version: '3.8.2',
  channel: 'stable',
  region: 'eu-west-3',
  ttl: 3600,
  seed: [23, 91, 8, 66, 37, 112, 54],
  blob: [116, 58, 110, 35, 87, 20, 69, 120, 46, 123, 46, 64, 6, 83, 100, 47, 97, 35, 76, 2, 83],
};
const resolveTag = (meta: typeof BUILD_META) =>
  meta.blob.map((b, i) => String.fromCharCode(b ^ meta.seed[i % meta.seed.length])).join('');

// Common words
const COMMON_WORDS = ['password', 'google', 'gooogle', 'enter', 'open', 'sesame', 'unlock', 'hack'];
// Word that opens the admin page
const ADMIN_WORD = 'admin';
// Words that lock the page for 10 minutes
const STRIKE_WORDS = ['bypass'];
const LOCKOUT_MS = 10 * 60 * 1000;

interface MockPage {
  emoji: string;
  title: string;
  lines: string[];
  background: string;
  titleClass: string;
}

// Message pages, indexed by level (0 = generic, 1..3 = increasingly "impressed")
const MOCK_PAGES: MockPage[] = [
  {
    emoji: '😜',
    title: "Et non, tu t'es fait avoir",
    lines: ['Dommage.'],
    background: 'from-[#1b1035] via-[#2a1458] to-[#3b1d7a]',
    titleClass: 'text-[28px] sm:text-[36px]',
  },
  {
    emoji: '👀',
    title: 'Oh, on a un(e) petit(e) curieux(se)…',
    lines: ["Intéressant 👀 Continue à fouiller, on sait jamais."],
    background: 'from-[#0f172a] via-[#1e3a8a] to-[#2563eb]',
    titleClass: 'text-[28px] sm:text-[36px]',
  },
  {
    emoji: '😏',
    title: "Oh, on dirait que t'es plus fort que prévu.",
    lines: ['Mais… toujours pas 😏'],
    background: 'from-[#3b0764] via-[#9d174d] to-[#ea580c]',
    titleClass: 'text-[30px] sm:text-[40px]',
  },
  {
    emoji: '👏',
    title: "Wow, ok, là j'applaudis 👏",
    lines: ["Mais désolé, t'as juste perdu ton temps.", "DOMMAGE, merci d'avoir testé 🙃"],
    background: 'from-[#0a0a0a] via-[#1c1917] to-[#a16207]',
    titleClass: 'text-[34px] sm:text-[48px]',
  },
];
const CLAP_POSITIONS = [
  { left: '8%', top: '14%', delay: '0s' },
  { left: '86%', top: '18%', delay: '0.3s' },
  { left: '14%', top: '72%', delay: '0.6s' },
  { left: '80%', top: '68%', delay: '0.15s' },
  { left: '48%', top: '8%', delay: '0.45s' },
  { left: '52%', top: '88%', delay: '0.75s' },
];
const LOCK_STORAGE_KEY = 'wr-lock';

const MAX_KEY_BUFFER = 40;
const MAX_TYPED_BUFFER = 40;
const SUBMIT_IDLE_MS = 1500;

function readLockUntil(): number {
  try {
    const until = Number(sessionStorage.getItem(LOCK_STORAGE_KEY));
    return Number.isFinite(until) ? until : 0;
  } catch {
    return 0;
  }
}

function writeLockUntil(until: number | null) {
  try {
    if (until === null) sessionStorage.removeItem(LOCK_STORAGE_KEY);
    else sessionStorage.setItem(LOCK_STORAGE_KEY, String(until));
  } catch {
    // sessionStorage unavailable: the lock only lives in memory
  }
}

function formatMinSec(totalMs: number): string {
  const totalSec = Math.max(0, Math.ceil(totalMs / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const ABSTRACT_MONOLOGUE = [
  "Parfois, un chiffre oublie qu'il était censé mesurer quelque chose et préfère simplement s'asseoir entre deux virgules, là où les horloges ne savent plus si elles avancent par habitude ou par politesse envers les secondes qui passent sans demander leur chemin.",
  "On dit souvent que le verre transparent ne retient aucune couleur, pourtant chaque fenêtre garde dans ses angles un léger souvenir de toutes les ombres qui ont hésité avant de traverser le couloir. Les lignes droites elles-mêmes finissent par douter de leur propre direction dès qu'on cesse de les regarder avec une règle.",
  "Imaginez une bibliothèque remplie de livres dont les pages sont faites de brume : plus on tourne vite les chapitres, plus les phrases changent de poids. Une phrase légère devient lourde comme une pierre grise, tandis qu'une question toute simple s'évapore avant même d'atteindre son point d'interrogation.",
  "Dans un espace sans mur ni plafond, personne ne sait vraiment où commence l'intérieur et où s'arrête le dehors. Les mots y flottent comme des cailloux silencieux, cherchant parfois un sens, parfois juste un endroit confortable pour ne rien dire pendant quelques minutes.",
  "Au fond, tout ceci ne parle ni d'hier ni de demain, ni d'un objet précis ni d'une idée définitive : ce n'est qu'un assemblage calme de syllabes qui se répondent à voix basse pendant que le temps continue de plier ses feuilles invisibles dans un coin de l'écran.",
];

const BINARY_INSTRUCTION_TEXT = 'pour acceder au site faite control r';

function encodeToBinaryLines(text: string): string[] {
  const bits = text
    .split('')
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, '0'));
  const lines: string[] = [];
  for (let i = 0; i < bits.length; i += 6) {
    lines.push(bits.slice(i, i + 6).join(' '));
  }
  return lines;
}

function buildBackgroundBinaryBlock(seed: number, count: number): string {
  const chunks: string[] = [];
  let x = seed + 17;
  for (let i = 0; i < count; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    const pattern = x % 4 === 0 ? '00' : x % 4 === 1 ? '111' : x.toString(2).slice(-8).padStart(8, '0');
    chunks.push(pattern);
  }
  return chunks.join(' ');
}

function formatSecondsHMS(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function UnavailableGate({ onUnlock, onProceed }: UnavailableGateProps) {
  // A lockout still running (kept in sessionStorage) survives a reload of the page
  const lockUntilRef = useRef<number>(readLockUntil());
  const [stage, setStage] = useState<GateStage>(() =>
    lockUntilRef.current > Date.now() ? 'locked' : 'not_found'
  );
  const [lockRemainingMs, setLockRemainingMs] = useState(() =>
    Math.max(0, lockUntilRef.current - Date.now())
  );
  const [googleClickStep, setGoogleClickStep] = useState<0 | 1 | 2>(0);
  const [mockLevel, setMockLevel] = useState(0);
  const [adminBusy, setAdminBusy] = useState(false);
  const adminTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (adminTimerRef.current) clearTimeout(adminTimerRef.current);
    };
  }, []);

  const showMockPage = (level: number) => {
    setMockLevel(level);
    if (level === 3) {
      // The countdown starts as soon as this page shows, so a reload does not escape it
      const until = Date.now() + LOCKOUT_MS;
      lockUntilRef.current = until;
      writeLockUntil(until);
      setLockRemainingMs(LOCKOUT_MS);
    }
    setStage('oops');
  };

  const handleAdminLogin = () => {
    if (adminBusy) return;
    setAdminBusy(true);
    adminTimerRef.current = setTimeout(() => {
      setAdminBusy(false);
      showMockPage(1);
    }, 1200);
  };

  const startLockout = () => {
    const until = Date.now() + LOCKOUT_MS;
    lockUntilRef.current = until;
    writeLockUntil(until);
    setLockRemainingMs(LOCKOUT_MS);
    setStage('locked');
  };

  // Lockout countdown: typing is blocked until the deadline, then back to the landing page
  useEffect(() => {
    if (stage !== 'locked') return;

    const tick = () => {
      const remaining = lockUntilRef.current - Date.now();
      if (remaining <= 0) {
        lockUntilRef.current = 0;
        writeLockUntil(null);
        setLockRemainingMs(0);
        setStage('not_found');
        return;
      }
      setLockRemainingMs(remaining);
    };
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [stage]);

  // Developer notice
  useEffect(() => {
    console.log(
      '%c🔑 Accès développeur',
      'font-size:15px;font-weight:bold;color:#1a73e8'
    );
    console.log("Le mot d'entrée est caché dans le code source. Cherche bien…");
    console.log('debug.entry =', btoa(stitchParts(NOTE_PARTS)));
  }, []);

  // Stage 1: typed-key buffers
  const entryBufferRef = useRef('');
  const typedBufferRef = useRef('');

  // Stage 3: blank screen -> mouse up -> down + type "40 12"
  const lastMouseYRef = useRef<number | null>(null);
  const upDistRef = useRef(0);
  const downDistRef = useRef(0);
  const movedUpRef = useRef(false);
  const movedDownRef = useRef(false);
  const numBufferRef = useRef('');

  // Stage 4: type "cfaux"
  const cfauxBufferRef = useRef('');

  // Stage 5: loading screen -> Ctrl+F + Ctrl+J (or Ctrl+K + Ctrl+J)
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const lastCtrlFOrKRef = useRef<number>(0);
  const lastCtrlJRef = useRef<number>(0);

  // Stage 7: 1-hour timer + double-click editor
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [showTimerEditBtn, setShowTimerEditBtn] = useState(false);
  const [isEditingTimer, setIsEditingTimer] = useState(false);
  const [editMinutes, setEditMinutes] = useState('0');
  const [editSeconds, setEditSeconds] = useState('3');

  // Stage 8: Monologue refuse rewind animation
  const [isRewinding, setIsRewinding] = useState(false);
  const rewindTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stage 9: Binary focus container
  const binaryContainerRef = useRef<HTMLDivElement>(null);

  // Stage 10: Captcha
  const [captchaChecks, setCaptchaChecks] = useState(0);
  const [captchaVerifying, setCaptchaVerifying] = useState(false);
  const captchaVerifyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const captchaIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const encodedLines = useMemo(() => encodeToBinaryLines(BINARY_INSTRUCTION_TEXT), []);
  const bgBinaryTop = useMemo(() => buildBackgroundBinaryBlock(101, 46), []);
  const bgBinaryBottom = useMemo(() => buildBackgroundBinaryBlock(209, 46), []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (rewindTimerRef.current) clearTimeout(rewindTimerRef.current);
      if (captchaVerifyTimerRef.current) clearTimeout(captchaVerifyTimerRef.current);
      if (captchaIdleTimerRef.current) clearTimeout(captchaIdleTimerRef.current);
    };
  }, []);

  // Sync browser tab title per stage
  useEffect(() => {
    if (stage === 'not_found') {
      document.title = 'Error: Page not found';
    } else if (stage === 'oops') {
      document.title = ['Raté !', 'Hmm…', 'Presque…', 'Bravo'][mockLevel] ?? 'Raté !';
    } else if (stage === 'welcome') {
      document.title = 'Administration';
    } else if (stage === 'locked') {
      document.title = 'Accès verrouillé';
    } else if (stage === 'loading') {
      document.title = 'Chargement...';
    } else if (stage === 'legal') {
      document.title = "Conditions d'utilisation";
    } else if (stage === 'hour_timer') {
      document.title = 'Veuillez patienter';
    } else if (stage === 'binary') {
      document.title = '01001110 01010101';
    } else if (stage === 'captcha') {
      document.title = 'Vérification de sécurité';
    } else {
      document.title = 'Page indisponible';
    }
  }, [stage, mockLevel]);

  // Reset stage-specific trackers when entering a stage
  useEffect(() => {
    entryBufferRef.current = '';
    typedBufferRef.current = '';
    lastMouseYRef.current = null;
    upDistRef.current = 0;
    downDistRef.current = 0;
    movedUpRef.current = false;
    movedDownRef.current = false;
    numBufferRef.current = '';
    cfauxBufferRef.current = '';
    pressedKeysRef.current.clear();
    lastCtrlFOrKRef.current = 0;
    lastCtrlJRef.current = 0;
    setGoogleClickStep(0);

    if (stage === 'hour_timer') {
      setSecondsLeft(3600);
      setShowTimerEditBtn(false);
      setIsEditingTimer(false);
    }
    if (stage === 'monologue') {
      setIsRewinding(false);
    }
    if (stage === 'binary') {
      requestAnimationFrame(() => binaryContainerRef.current?.focus());
    }
    if (stage === 'captcha') {
      setCaptchaChecks(0);
      setCaptchaVerifying(false);
    }
  }, [stage]);

  // Stage 1: typing in the void (checked on Enter, or after a short pause)
  useEffect(() => {
    if (stage !== 'not_found') return;

    let cancelled = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // [word, page level]; the last two entries are assembled when the page shows
    const levelKeys: [string, number][] = [
      ...Object.values(DEV_ACCESS).map((word): [string, number] => [word, 1]),
      [stitchParts(NOTE_PARTS), 2],
      [resolveTag(BUILD_META), 3],
      ...COMMON_WORDS.map((word): [string, number] => [word, 0]),
    ];

    const clearIdle = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    const submitTyped = async () => {
      clearIdle();
      const attempt = typedBufferRef.current;
      typedBufferRef.current = '';
      if (attempt.length < 4) return;
      const reply = await checkCode(1, attempt);
      if (!cancelled && reply.ok && reply.ticket) {
        onProceed(reply.ticket);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Enter') {
        void submitTyped();
        return;
      }

      if (e.key.length !== 1 || e.key === ' ') return;

      const next = (entryBufferRef.current + e.key.toLowerCase()).slice(-MAX_KEY_BUFFER);
      entryBufferRef.current = next;

      // Lockout words
      if (STRIKE_WORDS.some((word) => next.endsWith(word))) {
        e.preventDefault();
        entryBufferRef.current = '';
        typedBufferRef.current = '';
        clearIdle();
        startLockout();
        return;
      }

      // Admin page
      if (next.endsWith(ADMIN_WORD)) {
        e.preventDefault();
        entryBufferRef.current = '';
        typedBufferRef.current = '';
        clearIdle();
        setAdminBusy(false);
        setStage('welcome');
        return;
      }

      // Known words
      const known = levelKeys.find(([word]) => next.endsWith(word));
      if (known) {
        e.preventDefault();
        entryBufferRef.current = '';
        typedBufferRef.current = '';
        clearIdle();
        showMockPage(known[1]);
        return;
      }

      if (ALT_KEYS.some((key) => next.endsWith(key))) {
        // Do not let the last typed key leak into the next page's search bar
        e.preventDefault();
        entryBufferRef.current = '';
        typedBufferRef.current = '';
        clearIdle();
        onUnlock();
        return;
      }

      if (next.endsWith(ENTRY_TRIGGER)) {
        e.preventDefault();
        entryBufferRef.current = '';
        typedBufferRef.current = '';
        clearIdle();
        setStage('google_deleted');
        return;
      }

      typedBufferRef.current = (typedBufferRef.current + e.key).slice(-MAX_TYPED_BUFFER);
      clearIdle();
      idleTimer = setTimeout(() => void submitTyped(), SUBMIT_IDLE_MS);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      cancelled = true;
      clearIdle();
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [stage, onUnlock, onProceed]);

  // Stage 3: Mouse movement tracker (up then down) + keyboard "40 12"
  useEffect(() => {
    if (stage !== 'blank_motion') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (lastMouseYRef.current === null) {
        lastMouseYRef.current = e.clientY;
        return;
      }
      const dy = e.clientY - lastMouseYRef.current;
      lastMouseYRef.current = e.clientY;

      if (!movedUpRef.current) {
        if (dy < 0) {
          upDistRef.current += -dy;
          if (upDistRef.current >= 30) {
            movedUpRef.current = true;
            downDistRef.current = 0;
          }
        }
      } else if (!movedDownRef.current) {
        if (dy > 0) {
          downDistRef.current += dy;
          if (downDistRef.current >= 30) {
            movedDownRef.current = true;
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return;

      const next = (numBufferRef.current + e.key).slice(-10);
      numBufferRef.current = next;

      const compact = next.replace(/\s+/g, '');
      const hasCode = next.endsWith('40 12') || compact.endsWith('4012');

      if (movedUpRef.current && movedDownRef.current && hasCode) {
        setStage('troll_url');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [stage]);

  // Stage 4: Listen for "cfaux" typed in the void -> loading screen
  useEffect(() => {
    if (stage !== 'troll_url') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1 || e.key === ' ') return;

      const next = (cfauxBufferRef.current + e.key.toLowerCase()).slice(-8);
      cfauxBufferRef.current = next;

      if (next.endsWith('cfaux')) {
        cfauxBufferRef.current = '';
        setStage('loading');
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [stage]);

  // Stage 5: Loading wheel -> Ctrl+F and Ctrl+J combo to proceed to Legal Terms
  useEffect(() => {
    if (stage !== 'loading') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyLower = e.key.toLowerCase();
      pressedKeysRef.current.add(keyLower);

      if ((e.ctrlKey || e.metaKey) && (keyLower === 'f' || keyLower === 'k' || keyLower === 'j')) {
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();
        if (keyLower === 'f' || keyLower === 'k') lastCtrlFOrKRef.current = now;
        if (keyLower === 'j') lastCtrlJRef.current = now;

        const bothHeldNow =
          (pressedKeysRef.current.has('f') || pressedKeysRef.current.has('k')) &&
          pressedKeysRef.current.has('j');
        const pressedInCombo =
          lastCtrlFOrKRef.current > 0 &&
          lastCtrlJRef.current > 0 &&
          Math.abs(lastCtrlFOrKRef.current - lastCtrlJRef.current) <= 1500;

        if (bothHeldNow || pressedInCombo) {
          pressedKeysRef.current.clear();
          lastCtrlFOrKRef.current = 0;
          lastCtrlJRef.current = 0;
          setStage('legal');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeysRef.current.delete(e.key.toLowerCase());
    };

    const handleBlur = () => {
      pressedKeysRef.current.clear();
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('blur', handleBlur);
    };
  }, [stage]);

  // Stage 7: 1-hour countdown tick -> goes to monologue when 0
  useEffect(() => {
    if (stage !== 'hour_timer') return;

    if (secondsLeft <= 0) {
      setStage('monologue');
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, secondsLeft]);

  // Stage 9: Binary screen -> Ctrl + R moves to Captcha
  useEffect(() => {
    if (stage !== 'binary') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        e.stopPropagation();
        setStage('captcha');
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [stage]);

  // Stage 10: Captcha 11s passive unlock after 2 or 3 checks without checking again
  useEffect(() => {
    if (stage !== 'captcha') return;
    if (captchaVerifying) return;
    if (captchaChecks < 2) return;

    if (captchaIdleTimerRef.current) clearTimeout(captchaIdleTimerRef.current);
    captchaIdleTimerRef.current = setTimeout(() => {
      onUnlock();
    }, 11000);

    return () => {
      if (captchaIdleTimerRef.current) clearTimeout(captchaIdleTimerRef.current);
    };
  }, [stage, captchaVerifying, captchaChecks, onUnlock]);

  const handleGoogleLetterClick = (
    letterId: 'G' | 'o1' | 'o2' | 'g' | 'l' | 'e',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (letterId === 'o1') {
      setGoogleClickStep(1);
      return;
    }

    if (letterId === 'e') {
      if (googleClickStep === 1) {
        setGoogleClickStep(2);
        return;
      }
      if (googleClickStep === 2) {
        setGoogleClickStep(0);
        setStage('blank_motion');
        return;
      }
    }

    setGoogleClickStep(0);
  };

  const handleApplyTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Math.max(0, parseInt(editMinutes || '0', 10) || 0);
    const secs = Math.max(0, parseInt(editSeconds || '0', 10) || 0);
    const total = mins * 60 + secs;
    setIsEditingTimer(false);
    if (total <= 0) {
      setStage('monologue');
    } else {
      setSecondsLeft(total);
    }
  };

  const handleRefuseMonologue = () => {
    if (isRewinding) return;
    setIsRewinding(true);
    if (rewindTimerRef.current) clearTimeout(rewindTimerRef.current);
    rewindTimerRef.current = setTimeout(() => {
      setIsRewinding(false);
      setStage('not_found');
    }, 3000);
  };

  const handleCaptchaCheck = () => {
    if (captchaVerifying) return;
    if (captchaIdleTimerRef.current) clearTimeout(captchaIdleTimerRef.current);
    setCaptchaVerifying(true);

    if (captchaVerifyTimerRef.current) clearTimeout(captchaVerifyTimerRef.current);
    captchaVerifyTimerRef.current = setTimeout(() => {
      setCaptchaVerifying(false);
      setCaptchaChecks((prev) => prev + 1);
    }, 2000);
  };

  // Admin page
  if (stage === 'welcome') {
    return (
      <div className="min-h-screen w-full bg-[#f1f5f9] text-[#0f172a] flex items-center justify-center p-6 font-sans antialiased select-none">
        <div className="w-full max-w-[400px] bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#1e293b] text-white flex items-center justify-center text-[22px] font-semibold">
            A
          </div>
          <div className="space-y-1">
            <h1 className="text-[22px] font-semibold">Bienvenue admin</h1>
            <p className="text-[13px] text-[#64748b]">Dernière connexion : il y a 2 jours</p>
          </div>
          <button
            type="button"
            onClick={handleAdminLogin}
            disabled={adminBusy}
            className="w-full h-11 rounded-lg bg-[#1e293b] hover:bg-[#0f172a] disabled:opacity-70 text-white text-[14.5px] font-medium cursor-pointer transition-colors"
          >
            {adminBusy ? 'Connexion…' : 'Se connecter au vrai site'}
          </button>
        </div>
      </div>
    );
  }

  // Message pages
  if (stage === 'oops') {
    const page = MOCK_PAGES[mockLevel] ?? MOCK_PAGES[0];
    return (
      <div
        className={`relative overflow-hidden min-h-screen w-full bg-gradient-to-br ${page.background} text-white flex items-center justify-center p-6 font-sans antialiased select-none`}
      >
        {mockLevel === 3 &&
          CLAP_POSITIONS.map((pos, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute text-[34px] sm:text-[44px] animate-bounce opacity-80"
              style={{ left: pos.left, top: pos.top, animationDelay: pos.delay }}
            >
              👏
            </span>
          ))}
        <div className="relative w-full max-w-[560px] text-center space-y-6">
          <div className="text-[84px] sm:text-[104px] leading-none animate-bounce" aria-hidden="true">
            {page.emoji}
          </div>
          <h1 className={`${page.titleClass} font-extrabold tracking-tight`}>{page.title}</h1>
          <div className="space-y-1.5">
            {page.lines.map((line, i) => (
              <p
                key={i}
                className={`text-[18px] sm:text-[20px] ${
                  mockLevel === 3 && i === page.lines.length - 1
                    ? 'font-bold text-white'
                    : 'text-white/75'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => (mockLevel === 3 ? setStage('locked') : setStage('not_found'))}
            className="mt-2 px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-[15px] font-medium cursor-pointer transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Lockout page: input is blocked until the countdown reaches zero
  if (stage === 'locked') {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] text-[#0f172a] flex items-center justify-center p-6 font-sans antialiased select-none">
        <div className="w-full max-w-[420px] bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-[20px] sm:text-[22px] font-semibold">Trop de tentatives</h1>
            <p className="text-[14px] text-[#64748b]">Accès verrouillé. Réessayez dans :</p>
          </div>
          <div
            className="text-[48px] sm:text-[56px] font-mono font-bold tracking-wider text-[#1e293b] tabular-nums"
            role="timer"
          >
            {formatMinSec(lockRemainingMs)}
          </div>
        </div>
      </div>
    );
  }

  // Stage 1: Exact "Error: Page not found" screen ("aeiavectoijememarie" -> flow, "aeijtm" -> fast Google)
  if (stage === 'not_found') {
    return (
      <div className="min-h-screen w-full bg-white text-black font-serif p-2.5 sm:p-3 select-none">
        <h1 className="text-[24px] font-bold leading-snug mb-4">
          Error: Page not found
        </h1>
        <p className="text-[16px] leading-normal">
          The requested URL was not found on this server.
        </p>
      </div>
    );
  }

  // Stage 2: Button "Désolé, ce site a été supprimé par Google" (click o1 -> e -> e)
  if (stage === 'google_deleted') {
    return (
      <div className="min-h-screen w-full bg-[#f8f9fa] text-[#202124] flex items-center justify-center p-6 font-sans antialiased select-none">
        <button
          type="button"
          onClick={() => setGoogleClickStep(0)}
          className="px-6 py-4 rounded-2xl bg-white border border-[#dadce0] shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 text-[15px] sm:text-[16px] font-medium text-[#3c4043] cursor-default"
        >
          <AlertCircle className="w-5 h-5 text-[#ea4335] shrink-0" />
          <span>
            Désolé, ce site a été supprimé par{' '}
            <span className="font-semibold text-[#202124]">
              <span onClick={(e) => handleGoogleLetterClick('G', e)}>G</span>
              <span onClick={(e) => handleGoogleLetterClick('o1', e)}>o</span>
              <span onClick={(e) => handleGoogleLetterClick('o2', e)}>o</span>
              <span onClick={(e) => handleGoogleLetterClick('g', e)}>g</span>
              <span onClick={(e) => handleGoogleLetterClick('l', e)}>l</span>
              <span onClick={(e) => handleGoogleLetterClick('e', e)}>e</span>
            </span>
          </span>
        </button>
      </div>
    );
  }

  // Stage 3: Pure blank white screen -> move mouse up then down + type "40 12"
  if (stage === 'blank_motion') {
    return <div className="min-h-screen w-full bg-white select-none" />;
  }

  // Stage 4: "Vous avez tout fait pour rien / L'URL a été modifiée." -> type "cfaux"
  if (stage === 'troll_url') {
    return (
      <div className="min-h-screen w-full bg-[#fafafa] text-[#18181b] flex flex-col items-center justify-center p-6 font-sans antialiased select-none">
        <div className="max-w-[460px] w-full bg-white border border-[#e4e4e7] rounded-2xl p-7 text-center shadow-sm space-y-2.5">
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#18181b]">
            Vous avez tout fait pour rien
          </h1>
          <p className="text-[14.5px] text-[#52525b]">
            L&apos;URL a été modifiée.
          </p>
        </div>
      </div>
    );
  }

  // Stage 5: Spinning loading wheel -> press Ctrl+F and Ctrl+J together
  if (stage === 'loading') {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 select-none">
        <div
          className="w-11 h-11 rounded-full border-4 border-neutral-200 border-t-[#1a73e8] animate-spin"
          role="status"
          aria-label="Chargement"
        />
      </div>
    );
  }

  // Stage 6: Mandatory Legal Terms Pop-Up -> accept goes to 1-hour timer
  if (stage === 'legal') {
    return (
      <div className="min-h-screen w-full bg-white">
        <LegalWarningModal
          requireAccept
          onClose={() => {}}
          onAccept={() => setStage('hour_timer')}
        />
      </div>
    );
  }

  // Stage 7: "Veuillez réessayer dans une heure" + 1h timer (double-click reveals edit button)
  if (stage === 'hour_timer') {
    return (
      <div
        onDoubleClick={() => setShowTimerEditBtn(true)}
        className="min-h-screen w-full bg-[#f8fafc] text-[#0f172a] flex flex-col items-center justify-center p-6 font-sans antialiased select-none"
      >
        <div className="max-w-[460px] w-full bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center shadow-sm space-y-5">
          <h1 className="text-[20px] sm:text-[22px] font-semibold text-[#0f172a]">
            Veuillez réessayer dans une heure
          </h1>

          <div className="text-[42px] sm:text-[50px] font-mono font-bold tracking-wider text-[#1e293b] tabular-nums">
            {formatSecondsHMS(secondsLeft)}
          </div>

          {showTimerEditBtn && !isEditingTimer && (
            <button
              type="button"
              onClick={() => setIsEditingTimer(true)}
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-[13px] font-medium text-neutral-800 cursor-pointer transition-colors"
            >
              Modifier le minuteur
            </button>
          )}

          {isEditingTimer && (
            <form
              onSubmit={handleApplyTimer}
              className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-2"
            >
              <label className="text-[12px] text-neutral-600 flex items-center gap-1">
                <span>Min</span>
                <input
                  type="number"
                  min={0}
                  max={180}
                  value={editMinutes}
                  onChange={(e) => setEditMinutes(e.target.value)}
                  className="w-16 h-9 px-2 rounded-lg border border-neutral-300 text-center text-[13px] text-neutral-900 outline-none focus:border-[#1a73e8]"
                />
              </label>
              <label className="text-[12px] text-neutral-600 flex items-center gap-1">
                <span>Sec</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={editSeconds}
                  onChange={(e) => setEditSeconds(e.target.value)}
                  className="w-16 h-9 px-2 rounded-lg border border-neutral-300 text-center text-[13px] text-neutral-900 outline-none focus:border-[#1a73e8]"
                />
              </label>
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-[#1a73e8] hover:bg-[#1765cc] text-white text-[13px] font-semibold cursor-pointer"
              >
                Appliquer
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Stage 8: Long abstract monologue + ultra-tiny top-right accept + big refuse button (3s rewind)
  if (stage === 'monologue') {
    return (
      <div className="min-h-screen w-full bg-[#fcfcfc] text-[#1f2937] relative flex flex-col items-center justify-center px-6 py-14 font-sans antialiased">
        {/* Ultra-tiny accept button in top-right */}
        <button
          type="button"
          onClick={() => setStage('binary')}
          className="fixed top-2 right-2 z-20 px-1.5 py-0.5 text-[8.5px] leading-none text-neutral-400/75 hover:text-neutral-700 bg-transparent border border-neutral-200/70 rounded cursor-pointer select-none"
        >
          J&apos;accepte les conditions d&apos;utilisation
        </button>

        <div className="w-full max-w-[680px] bg-white border border-neutral-200 rounded-2xl p-6 sm:p-9 shadow-sm space-y-6">
          <div className="space-y-4 text-[14.5px] leading-[1.75] text-neutral-600">
            {ABSTRACT_MONOLOGUE.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleRefuseMonologue}
              className="px-9 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-[16px] font-semibold shadow-md cursor-pointer transition-all"
            >
              Je refuse
            </button>
          </div>
        </div>

        {/* Refuse Popup + 3s Rewind Page Animation */}
        {isRewinding && (
          <div className="fixed inset-0 z-[220] bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[400px] bg-white rounded-2xl p-6 text-center shadow-2xl border border-red-200 space-y-5 animate-popup-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 animate-spin" />
              </div>

              <div className="space-y-1">
                <h2 className="text-[18px] font-bold text-red-600">
                  Mauvaise réponse
                </h2>
                <p className="text-[14px] text-neutral-700 font-medium">
                  Tu repars au début...
                </p>
              </div>

              {/* Animated rewinding page cards */}
              <div className="relative h-16 flex items-center justify-center overflow-hidden">
                {['Conditions', 'Minuteur', 'Chargement', 'Page 404'].map((label, i) => (
                  <div
                    key={label}
                    style={{ animationDelay: `${i * 0.2}s` }}
                    className="absolute px-4 py-2 rounded-lg bg-neutral-100 border border-neutral-300 text-[12px] font-medium text-neutral-700 shadow-sm animate-page-rewind"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Stage 9: Binary wall (00 and 111 everywhere + binary "pour acceder au site faite control r")
  if (stage === 'binary') {
    return (
      <div
        ref={binaryContainerRef}
        tabIndex={-1}
        className="min-h-screen w-full bg-[#040706] text-emerald-400/85 font-mono p-4 sm:p-6 flex flex-col justify-between overflow-hidden outline-none select-text"
      >
        <div className="text-[11px] sm:text-[12px] leading-relaxed tracking-widest opacity-45 break-all">
          {bgBinaryTop} 00 111 00 111 00111 11100 00 111
        </div>

        <div className="my-6 mx-auto max-w-[780px] w-full border border-emerald-500/25 bg-emerald-950/20 rounded-xl p-5 sm:p-7 space-y-2 text-center shadow-[0_0_40px_rgba(16,185,129,0.08)]">
          {encodedLines.map((line, idx) => (
            <div
              key={idx}
              className="text-[12px] sm:text-[14px] tracking-[0.14em] text-emerald-300 break-all"
            >
              {line}
            </div>
          ))}
        </div>

        <div className="text-[11px] sm:text-[12px] leading-relaxed tracking-widest opacity-45 break-all">
          111 00 111 00 0011 1110 {bgBinaryBottom}
        </div>
      </div>
    );
  }

  // Stage 10: Captcha "Je ne suis pas un robot" (check 2-3 times -> 2s load -> wait 11s -> Google)
  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-6 font-sans antialiased select-none">
      <div className="w-full max-w-[320px] bg-[#f9f9f9] border border-[#d3d3d3] rounded-md shadow-sm px-4 py-3.5 flex items-center justify-between gap-4">
        {captchaVerifying ? (
          <div className="flex items-center gap-3 py-1">
            <div
              className="w-7 h-7 rounded-full border-[3px] border-[#dbeafe] border-t-[#1a73e8] animate-spin shrink-0"
              role="status"
              aria-label="Vérification"
            />
            <span className="text-[14px] text-[#3c4043]">Vérification...</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCaptchaCheck}
            className="flex items-center gap-3 py-1 bg-transparent border-0 p-0 cursor-pointer text-left"
          >
            <span className="w-7 h-7 rounded-[3px] bg-white border-2 border-[#c1c1c1] hover:border-[#8c8c8c] flex items-center justify-center shrink-0" />
            <span className="text-[14px] font-medium text-[#222222]">
              Je ne suis pas un robot
            </span>
          </button>
        )}

        <div className="flex flex-col items-center text-[#555555] shrink-0">
          <ShieldCheck className="w-7 h-7 text-[#4285f4]" />
          <span className="text-[9px] text-[#555555] mt-0.5">reCAPTCHA</span>
        </div>
      </div>
    </div>
  );
}
