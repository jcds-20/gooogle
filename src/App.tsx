import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ArrowLeftRight, Volume2, Sun, Moon } from 'lucide-react';
import EcoleDirecteView from './components/EcoleDirecteView';
import GoogleNewTabView from './components/GoogleNewTabView';
import PowerPointView from './components/PowerPointView';
import ReversoView from './components/ReversoView';
import WordView from './components/WordView';
import FileExplorerView from './components/FileExplorerView';
import WikipediaView from './components/WikipediaView';
import MBlockView from './components/MBlockView';
import QuiziniereView from './components/QuiziniereView';
import CodeEditorView from './components/CodeEditorView';
import DirectoryModal from './components/DirectoryModal';
import LegalWarningModal from './components/LegalWarningModal';
import UnavailableGate from './components/UnavailableGate';
import GateCodePage from './components/GateCodePage';
import { downloadOfflineTranslator } from './utils/offlineTranslatorBuilder';
import {
  readStoredToken,
  submitGate,
  verifyToken,
  writeStoredToken,
} from './utils/gateClient';

type ViewMode =
  | 'google'
  | 'wordreference'
  | 'ecoledirecte'
  | 'powerpoint'
  | 'reverso'
  | 'word'
  | 'explorer'
  | 'wikipedia'
  | 'mblock'
  | 'quiziniere'
  | 'code';

// DECOYS: the arrow code and these commands look like unlock keys but only lead to dead ends.
// The real second-stage command and final code are verified by the server only.
const UNLOCK_SEQUENCE = ['ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
const STAGE_TWO_COMMANDS = ['/sudo', '/admin'];

interface DefinitionEntry {
  id: string;
  room: string;
  term: string;
  phonetic: string;
  category: string;
  definition: string;
  context: string;
  translation: string;
  timestamp: number;
  senderId?: string;
}

const DICTIONARY_OPTIONS = [
  { id: 'enfr', label: 'Anglais-Français', reverseId: 'fren' },
  { id: 'fren', label: 'Français-Anglais', reverseId: 'enfr' },
  { id: 'fres', label: 'Français-Espagnol', reverseId: 'esfr' },
  { id: 'esfr', label: 'Espagnol-Français', reverseId: 'fres' },
  { id: 'frit', label: 'Français-Italien', reverseId: 'itfr' },
  { id: 'itfr', label: 'Italien-Français', reverseId: 'frit' },
  { id: 'frde', label: 'Français-Allemand', reverseId: 'defr' },
  { id: 'defr', label: 'Allemand-Français', reverseId: 'frde' },
  { id: 'frfr', label: 'Définitions françaises', reverseId: 'frfr' },
];

const NAV_LINKS = [
  'Forums de langues',
  'Liens directs vers les dictionnaires',
  'Grammaire et usage',
  'Conjugateurs de verbes',
  'Outils',
  'Listes',
];

const LANG_ROW_1 = [
  'Español',
  'Anglais',
  'Italiano',
  'Català',
  'Português',
  'Deutsch',
  'Svenska',
  'Nederlands',
];

const LANG_ROW_2 = [
  'Русский',
  'Polski',
  'Română',
  'Čeština',
  'Ελληνικά',
  'Türkçe',
];

const LANG_ROW_3 = [
  '英汉词典',
  '英和辞書',
  '영-한 사전',
  'قاموس إنجليزي - عربي',
];

function normalizeInput(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTranslatorDownloadCommand(rawQuery: string): boolean {
  const norm = normalizeInput(rawQuery);
  return (
    norm === 'traducteur' ||
    norm === 'traduction hors ligne' ||
    norm === 'traducteur hors ligne'
  );
}

function detectNavigationTarget(rawQuery: string): ViewMode | null {
  const norm = normalizeInput(rawQuery);
  if (!norm) return null;

  if (
    norm === 'wordreference' ||
    norm === 'worldreference' ||
    norm === 'word reference' ||
    norm === 'world reference' ||
    norm === 'world refernace' ||
    norm === 'word refernace' ||
    norm === 'world refersendnce' ||
    norm === 'wordreference com' ||
    norm === 'word ref' ||
    norm === 'world ref' ||
    /^worl?d\s*refer[a-z]*$/.test(norm)
  ) {
    return 'wordreference';
  }

  if (
    norm === 'ecoledirecte' ||
    norm === 'ecole directe' ||
    norm === 'ecoledirect' ||
    norm === 'ecole direct' ||
    norm === 'ecol direct' ||
    norm === 'ecol directe' ||
    /^ecole?\s*directe?$/.test(norm)
  ) {
    return 'ecoledirecte';
  }

  if (
    norm === 'powerpoint' ||
    norm === 'power point' ||
    norm === 'powerpiont' ||
    /^power\s*point$/.test(norm)
  ) {
    return 'powerpoint';
  }

  if (
    norm === 'reverso' ||
    norm === 'reverso traduction' ||
    norm === 'reverso com' ||
    /^reverso\s*[a-z]*$/.test(norm)
  ) {
    return 'reverso';
  }

  if (
    norm === 'word' ||
    norm === 'world' ||
    norm === 'microsoft word' ||
    norm === 'ms word' ||
    norm === 'document word' ||
    norm === 'word document'
  ) {
    return 'word';
  }

  if (
    norm === 'explorateur' ||
    norm === 'explorateur de fichiers' ||
    norm === 'explorateur de fichier' ||
    norm === 'xplorateur' ||
    norm === 'xplorateur de fichier' ||
    norm === 'xplorateur de fichiers' ||
    norm === 'explorer' ||
    norm === 'ce pc' ||
    norm === 'fichiers' ||
    norm === 'fichier'
  ) {
    return 'explorer';
  }

  if (
    norm === 'wikipedia' ||
    norm === 'wiki' ||
    norm === 'wikipedia org' ||
    norm === 'wikipedia fr' ||
    /^wikiped[a-z]*$/.test(norm)
  ) {
    return 'wikipedia';
  }

  if (
    norm === 'mblock' ||
    norm === 'm block' ||
    norm === 'makeblock' ||
    norm === 'make block' ||
    /^m\s*bloc[a-z]*$/.test(norm)
  ) {
    return 'mblock';
  }

  if (
    norm === 'quiziniere' ||
    norm === 'quizziniere' ||
    norm === 'quiziniere canope' ||
    norm === 'canope' ||
    /^quizz?in[a-z]*$/.test(norm)
  ) {
    return 'quiziniere';
  }

  if (
    norm === 'code' ||
    norm === 'editeur de code' ||
    norm === 'code editor' ||
    norm === 'editeur' ||
    norm === 'ide'
  ) {
    return 'code';
  }

  if (norm === 'google') {
    return 'google';
  }

  return null;
}

const PSEUDO_STORAGE_KEY = 'wr-pseudo';
const CODE_STORAGE_KEY = 'wr-code';
// Entries answered privately by the server (no access code) carry this room
const PRIVATE_ROOM = 'local';

function readStored(storage: 'local' | 'session', key: string): string {
  try {
    const store = storage === 'local' ? localStorage : sessionStorage;
    return store.getItem(key)?.trim() ?? '';
  } catch {
    return '';
  }
}

function writeStored(storage: 'local' | 'session', key: string, value: string | null) {
  try {
    const store = storage === 'local' ? localStorage : sessionStorage;
    if (value === null) store.removeItem(key);
    else store.setItem(key, value);
  } catch {
    // storage unavailable: keep the value in memory only
  }
}

function loadPseudo(): string {
  const stored = readStored('local', PSEUDO_STORAGE_KEY);
  if (stored) return stored;
  const generated = 'anon-' + Math.random().toString(36).substring(2, 6);
  writeStored('local', PSEUDO_STORAGE_KEY, generated);
  return generated;
}

// Access code: exactly 3 lowercase alphanumeric characters, otherwise null
function parseAccessCode(value: string): string | null {
  const code = value.trim().toLowerCase();
  return /^[a-z0-9]{3}$/.test(code) ? code : null;
}

// Session-scoped on purpose: has to be typed again in every new tab/session
function loadAccessCode(): string | null {
  return parseAccessCode(readStored('session', CODE_STORAGE_KEY));
}

// "/pseudo Jo" -> { cmd: 'pseudo', arg: 'Jo' }; "/code abc" -> { cmd: 'code', arg: 'abc' }
// ("/salon" is kept as an alias of "/code")
function parseChatCommand(query: string): { cmd: 'pseudo' | 'code'; arg: string } | null {
  const match = /^\/(pseudo|code|salon)(?:\s+(.*))?$/i.exec(query.trim());
  if (!match) return null;
  const name = match[1].toLowerCase();
  return { cmd: name === 'pseudo' ? 'pseudo' : 'code', arg: (match[2] ?? '').trim() };
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [isGatePassed, setIsGatePassed] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('google');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [activationPhase, setActivationPhase] = useState<'idle' | 'trembling' | 'activated'>('idle');
  const [googleResetSignal, setGoogleResetSignal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<DefinitionEntry[]>([]);
  const [selectedLangId, setSelectedLangId] = useState('enfr');
  const [darkMode, setDarkMode] = useState(false);
  const [pseudo, setPseudo] = useState<string>(loadPseudo);
  // null = no valid access code = pure WordReference disguise (single definition, no history)
  const [room, setRoom] = useState<string | null>(loadAccessCode);

  // Latest message, still used by the fake views (they show a single response)
  const currentEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  // Access token handed out by the SERVER at the end of the portal (kept per tab)
  const [accessToken, setAccessToken] = useState<string | null>(readStoredToken);
  const hasAccess = accessToken !== null;
  // A stored token is checked with the server before showing anything
  const [isResuming, setIsResuming] = useState<boolean>(() => readStoredToken() !== null);
  const [showCodePage, setShowCodePage] = useState(false);

  const tokenRef = useRef<string | null>(accessToken);
  const gateTicketRef = useRef<string | null>(null);
  const pseudoRef = useRef(pseudo);
  const roomRef = useRef(room);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unlockBufferRef = useRef<string[]>([]);
  const activationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activationHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (activationTimerRef.current) {
        clearTimeout(activationTimerRef.current);
      }
      if (activationHideTimerRef.current) {
        clearTimeout(activationHideTimerRef.current);
      }
    };
  }, []);

  // Ask the server to (re)join the current room. Without a valid token it answers nothing.
  const sendJoin = useCallback(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && tokenRef.current) {
      ws.send(JSON.stringify({ type: 'join', room: roomRef.current, token: tokenRef.current }));
    }
  }, []);

  // Back to the very beginning (token refused or expired)
  const handleAccessLost = useCallback(() => {
    writeStoredToken(null);
    tokenRef.current = null;
    gateTicketRef.current = null;
    setAccessToken(null);
    setIsUnlocked(false);
    setShowCodePage(false);
    setViewMode('google');
    setEntries([]);
    setIsGatePassed(false);
  }, []);

  // Resume a session: a token kept in this tab must still be valid on the server
  useEffect(() => {
    const stored = readStoredToken();
    if (!stored) return;
    let cancelled = false;
    verifyToken(stored).then((ok) => {
      if (cancelled) return;
      if (ok) {
        setIsGatePassed(true);
        setIsUnlocked(true);
      } else {
        writeStoredToken(null);
        tokenRef.current = null;
        setAccessToken(null);
      }
      setIsResuming(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Connect WebSocket for real-time single-definition delivery
  useEffect(() => {
    let isCancelled = false;

    function connectWs() {
      if (isCancelled) return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        // (Re)join the current room on every (re)connection; the server answers with its history
        ws.onopen = () => {
          if (isCancelled) return;
          sendJoin();
        };

        ws.onmessage = (event) => {
          if (isCancelled) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'denied') {
              // The server does not know this token (expired / server restarted)
              if (tokenRef.current) handleAccessLost();
              return;
            }
            if (data.type === 'new_entry' && data.entry) {
              const newEntry: DefinitionEntry = data.entry;
              // Only accept what belongs to the current mode (stale room messages are dropped)
              if (newEntry.room !== (roomRef.current ?? PRIVATE_ROOM)) return;
              if (roomRef.current) {
                setEntries((prev) =>
                  prev.some((e) => e.id === newEntry.id) ? prev : [...prev, newEntry]
                );
              } else {
                // No access code: one definition at a time, nothing accumulates
                setEntries([newEntry]);
              }
            } else if (data.type === 'history' && Array.isArray(data.entries) && roomRef.current) {
              setEntries(data.entries as DefinitionEntry[]);
            }
          } catch {
            // Ignore malformed messages
          }
        };

        ws.onclose = () => {
          if (isCancelled) return;
          reconnectTimeoutRef.current = setTimeout(connectWs, 2000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        reconnectTimeoutRef.current = setTimeout(connectWs, 3000);
      }
    }

    connectWs();

    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 25000);

    return () => {
      isCancelled = true;
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Back to the Google start screen (used by /accueil and by every view's logo)
  const goHome = useCallback(() => {
    setViewMode('google');
    setEntries([]);
    setGoogleResetSignal((n) => n + 1);
  }, []);

  // Short "trembling search bar" animation when the hidden mode switches on
  const startActivation = useCallback(() => {
    if (activationTimerRef.current) clearTimeout(activationTimerRef.current);
    if (activationHideTimerRef.current) clearTimeout(activationHideTimerRef.current);
    setActivationPhase('trembling');
    activationTimerRef.current = setTimeout(() => {
      setActivationPhase('activated');
      activationHideTimerRef.current = setTimeout(() => {
        setActivationPhase('idle');
      }, 2200);
    }, 1000);
  }, []);

  // Stage 3 succeeded: the server handed out the token -> real chat unlocked
  const grantAccess = useCallback(
    (token: string) => {
      writeStoredToken(token);
      tokenRef.current = token;
      gateTicketRef.current = null;
      setAccessToken(token);
      setShowCodePage(false);
      setViewMode('google');
      setEntries([]);
      setGoogleResetSignal((n) => n + 1);
      setIsUnlocked(true);
      startActivation();
      sendJoin();
    },
    [sendJoin, startActivation]
  );

  // Stage 2: text typed on the fake Google that starts with "/". Only the server knows
  // whether it is the real command. Returns true when it was consumed.
  const handleGateAttempt = useCallback(async (raw: string): Promise<boolean> => {
    const attempt = raw.trim();
    if (!attempt.startsWith('/')) return false;

    // DECOYS: look like the second-stage command, lead to a code page that never succeeds
    if (STAGE_TWO_COMMANDS.includes(attempt.toLowerCase())) {
      setShowCodePage(true);
      return true;
    }

    const ticket = gateTicketRef.current;
    if (!ticket) return false;
    const reply = await submitGate(2, attempt, ticket);
    if (!reply.ok) return false;
    if (reply.ticket) gateTicketRef.current = reply.ticket;
    setShowCodePage(true);
    return true;
  }, []);

  const sendQuery = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query) return;

      // /accueil command in any chat returns to Google immediately
      if (query.toLowerCase() === '/accueil') {
        goHome();
        return;
      }

      // /pseudo <nom> and /code <abc>: local settings, never sent as messages.
      // Without the server token the chat does not exist: nothing happens.
      const chatCommand = parseChatCommand(query);
      if (chatCommand && !tokenRef.current) return;
      if (chatCommand) {
        if (chatCommand.cmd === 'pseudo') {
          const newPseudo =
            chatCommand.arg.slice(0, 32) || 'anon-' + Math.random().toString(36).substring(2, 6);
          pseudoRef.current = newPseudo;
          setPseudo(newPseudo);
          writeStored('local', PSEUDO_STORAGE_KEY, newPseudo);
        } else {
          // Empty or invalid code -> back to the pure disguise (no history, no list)
          const newRoom = parseAccessCode(chatCommand.arg);
          if (newRoom !== roomRef.current) {
            roomRef.current = newRoom;
            setRoom(newRoom);
            writeStored('session', CODE_STORAGE_KEY, newRoom);
            setEntries([]);
            // Valid code: the server replies with that room's history. Null: leave the room.
            sendJoin();
          }
        }
        return;
      }

      // Download offline trilingual translator when unlocked
      if (isUnlocked && tokenRef.current && isTranslatorDownloadCommand(query)) {
        downloadOfflineTranslator();
        return;
      }

      // Navigate between the fake sites: only with a server token AND the unlocked state
      const navTarget = isUnlocked && tokenRef.current ? detectNavigationTarget(query) : null;
      if (navTarget) {
        setViewMode(navTarget);
        return;
      }

      // No server token = no chat: nothing is sent, nothing comes back
      const token = tokenRef.current;
      if (!token) return;

      // Otherwise broadcast chat/definition in real time
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'search',
            query,
            room: roomRef.current,
            senderId: roomRef.current ? pseudoRef.current : undefined,
            token,
          })
        );
      } else {
        try {
          const res = await fetch('/api/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            body: JSON.stringify({
              term: query,
              room: roomRef.current,
              senderId: roomRef.current ? pseudoRef.current : undefined,
            }),
          });
          // Without an access code nothing is broadcast: show the lookup result locally
          if (!roomRef.current && res.ok) {
            const body = await res.json();
            if (body?.entry) setEntries([body.entry as DefinitionEntry]);
          }
        } catch {
          // Ignore network errors
        }
      }
    },
    [isUnlocked, goHome, sendJoin]
  );

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    await sendQuery(query);

    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSwapLanguage = () => {
    const current = DICTIONARY_OPTIONS.find((d) => d.id === selectedLangId);
    if (current && current.reverseId) {
      setSelectedLangId(current.reverseId);
    }
  };

  // Global keyboard shortcuts: Alt+F (close site), Ctrl+F (Répertoire), and ↓ ↓ ↑ ← → unlock sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        e.stopPropagation();
        window.close();
        if (window.self === window.top) {
          window.location.replace('https://www.google.com');
        } else {
          window.location.replace('about:blank');
        }
        return;
      }

      if (!isGatePassed) return;

      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        const keyLower = e.key.toLowerCase();
        if (keyLower === 'f') {
          if (!isUnlocked || !tokenRef.current) return;
          e.preventDefault();
          e.stopPropagation();
          setShowDirectory((prev) => !prev);
          return;
        }
      }

      if (e.key === 'Escape') {
        if (showLegalModal) {
          setShowLegalModal(false);
          return;
        }
        if (showDirectory) {
          setShowDirectory(false);
          return;
        }
      }

      const target = e.target as HTMLElement | null;
      const isEmptyInput =
        target?.tagName === 'INPUT' && (target as HTMLInputElement).value.length === 0;
      const isTypingField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isTypingField && !isEmptyInput) return;

      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        // Decoy page (no server token): the arrow code does absolutely nothing.
        // It is not even tracked; it only acts on a session that already holds a token.
        if (!tokenRef.current) {
          unlockBufferRef.current = [];
          return;
        }

        const next = [...unlockBufferRef.current, e.key].slice(-UNLOCK_SEQUENCE.length);
        unlockBufferRef.current = next;

        const matches =
          next.length === UNLOCK_SEQUENCE.length &&
          next.every((val, idx) => val === UNLOCK_SEQUENCE[idx]);

        if (matches) {
          // Only reachable with a server token: hides / shows the unlocked session
          unlockBufferRef.current = [];
          if (activationTimerRef.current) {
            clearTimeout(activationTimerRef.current);
          }
          if (activationHideTimerRef.current) {
            clearTimeout(activationHideTimerRef.current);
          }

          if (!isUnlocked) {
            setIsUnlocked(true);
            startActivation();
          } else {
            setIsUnlocked(false);
            setShowDirectory(false);
            setViewMode('google');
            setEntries([]);
            setGoogleResetSignal((n) => n + 1);
            setActivationPhase('idle');
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isGatePassed, isUnlocked, showDirectory, showLegalModal, startActivation]);

  // Sync browser tab title with active view
  useEffect(() => {
    if (!isGatePassed || showCodePage) return;
    if (viewMode === 'ecoledirecte') {
      document.title = 'EcoleDirecte - Cahier de textes';
    } else if (viewMode === 'google') {
      document.title = 'Nouvel onglet';
    } else if (viewMode === 'powerpoint') {
      document.title = 'Présentation1 - PowerPoint';
    } else if (viewMode === 'reverso') {
      document.title = 'Reverso | Traduction gratuite, Dictionnaire';
    } else if (viewMode === 'word') {
      document.title = 'Document1 - Word';
    } else if (viewMode === 'explorer') {
      document.title = 'Ce PC';
    } else if (viewMode === 'wikipedia') {
      document.title = 'Espagne — Wikipédia';
    } else if (viewMode === 'mblock') {
      document.title = 'mBlock - Makeblock';
    } else if (viewMode === 'quiziniere') {
      document.title = 'Quizinière - Réseau Canopé';
    } else if (viewMode === 'code') {
      document.title = 'CodeStudio — Éditeur en temps réel';
    } else {
      document.title = 'WordReference.com | Dictionnaires de langue en ligne';
    }
  }, [isGatePassed, viewMode, showCodePage]);

  // Keep the latest message in view
  useEffect(() => {
    if (viewMode !== 'wordreference' || !room) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [entries, viewMode, room]);

  const selectedLangObj =
    DICTIONARY_OPTIONS.find((d) => d.id === selectedLangId) || DICTIONARY_OPTIONS[0];

  // A stored token is being checked: show nothing yet
  if (isResuming) {
    return <div className="min-h-screen w-full bg-white" />;
  }

  if (!isGatePassed) {
    return (
      <UnavailableGate
        // Decoy exits (old shortcut / old maze): plain Google, no ticket, nothing real
        onUnlock={() => setIsGatePassed(true)}
        // The server accepted the real entry key: remember the ticket, show the fake Google
        onTicket={(ticket) => {
          gateTicketRef.current = ticket;
          setIsGatePassed(true);
        }}
      />
    );
  }

  if (showCodePage) {
    return (
      <GateCodePage
        ticket={gateTicketRef.current}
        onGranted={grantAccess}
        onCancel={() => setShowCodePage(false)}
      />
    );
  }

  return (
    <>
      {viewMode === 'ecoledirecte' && (
        <EcoleDirecteView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'google' && (
        <GoogleNewTabView
          // Unlocked state only counts together with a server token
          isUnlocked={isUnlocked && hasAccess}
          activationPhase={activationPhase}
          currentResponse={currentEntry ? currentEntry.definition : null}
          isNavigationTarget={(q) =>
            isUnlocked &&
            hasAccess &&
            (detectNavigationTarget(q) !== null || isTranslatorDownloadCommand(q))
          }
          onGateAttempt={hasAccess ? undefined : handleGateAttempt}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
          onOpenLegal={() => setShowLegalModal(true)}
          resetSignal={googleResetSignal}
        />
      )}

      {viewMode === 'powerpoint' && (
        <PowerPointView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'reverso' && (
        <ReversoView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'word' && (
        <WordView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'explorer' && (
        <FileExplorerView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'wikipedia' && (
        <WikipediaView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'mblock' && (
        <MBlockView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'quiziniere' && (
        <QuiziniereView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'code' && (
        <CodeEditorView
          currentResponse={currentEntry ? currentEntry.definition : null}
          onSendQuery={sendQuery}
          onClearResponse={() => setEntries([])}
          onGoHome={goHome}
        />
      )}

      {viewMode === 'wordreference' && (
        <div
          className={`min-h-screen flex flex-col font-sans antialiased transition-colors ${
            darkMode ? 'bg-[#181a1b] text-[#e8e6e3]' : 'bg-white text-[#222222]'
          }`}
        >
          {/* Top purple-indigo navigation bar matching official WordReference */}
          <header className="bg-[#5e58b8] text-white w-full">
            <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 h-11 flex items-center gap-5 sm:gap-7 overflow-x-auto whitespace-nowrap text-[13px] font-normal">
              {NAV_LINKS.map((label) => (
                <a
                  key={label}
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    setEntries([]);
                  }}
                  className="text-white/95 hover:text-white hover:underline cursor-pointer transition-opacity shrink-0"
                >
                  {label}
                </a>
              ))}
            </nav>
          </header>

          {/* Main Centered Content */}
          <main className="flex-1 flex flex-col items-center px-4 pt-12 sm:pt-20 pb-12">
            {/* WordReference.com Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                goHome();
              }}
              className="text-[32px] sm:text-[38px] font-normal tracking-[-0.01em] select-none cursor-pointer mb-6"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            >
              <span className={darkMode ? 'text-[#8782e6]' : 'text-[#5e58b8]'}>
                WordReference
              </span>
              <span className={darkMode ? 'text-[#6c68b8]' : 'text-[#a3a1e2]'}>
                .com
              </span>
            </a>

            {/* Search Input + Purple Magnifying Glass Button */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-[490px] flex items-center"
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher dans le dictionnaire"
                autoComplete="off"
                autoFocus
                className={`flex-1 h-[42px] px-3 text-[15px] outline-none border rounded-l-[2px] transition-colors ${
                  darkMode
                    ? 'bg-[#232628] border-[#44484b] text-white focus:border-[#7c76d9]'
                    : 'bg-white border-[#cccccc] text-[#222222] focus:border-[#5e58b8]'
                }`}
              />
              <button
                type="submit"
                aria-label="Rechercher"
                className="h-[42px] w-[44px] bg-[#5e58b8] hover:bg-[#4f49a5] active:bg-[#443f94] text-white flex items-center justify-center rounded-r-[2px] transition-colors cursor-pointer shrink-0"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </button>
            </form>

            {/* Language Dropdown + Swap Arrows */}
            <div className="mt-7 flex items-center justify-center gap-3">
              <select
                value={selectedLangId}
                onChange={(e) => setSelectedLangId(e.target.value)}
                aria-label="Sélectionner le dictionnaire"
                className={`h-[34px] min-w-[190px] px-2.5 text-[13px] border rounded-[2px] outline-none cursor-pointer ${
                  darkMode
                    ? 'bg-[#232628] border-[#44484b] text-[#e8e6e3]'
                    : 'bg-white border-[#b5b5b5] text-[#222222]'
                }`}
              >
                {DICTIONARY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSwapLanguage}
                title="Inverser les langues"
                className={`p-1 rounded transition-colors cursor-pointer ${
                  darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-[#444444] hover:text-[#5e58b8]'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* With a valid access code: the whole conversation, one "definition" per message.
                Without: plain dictionary behaviour, a single definition and no history. */}
            {entries.length > 0 && (
              <div className="w-full max-w-[680px] mt-10 space-y-4">
                {(room ? entries : entries.slice(-1)).map((entry) => (
                  <section
                    key={entry.id}
                    className={`border rounded-[3px] p-5 sm:p-6 ${
                      darkMode
                        ? 'bg-[#202325] border-[#383b3e]'
                        : 'bg-[#fafafe] border-[#dcdcf0]'
                    }`}
                  >
                    <div
                      className={`flex items-baseline justify-between gap-2 pb-3 mb-3 border-b ${
                        darkMode ? 'border-white/10' : 'border-black/10'
                      }`}
                    >
                      <div className="flex items-baseline gap-2.5 flex-wrap min-w-0">
                        <h2
                          className={`text-xl sm:text-2xl font-bold break-words ${
                            darkMode ? 'text-[#9d98f2]' : 'text-[#5e58b8]'
                          }`}
                        >
                          {entry.term}
                        </h2>
                        <span className="text-xs font-mono text-gray-500">
                          {entry.phonetic}
                        </span>
                        <span className="text-xs italic text-gray-500">
                          {entry.category}
                        </span>
                        <button
                          type="button"
                          aria-label="Écouter la prononciation"
                          className="p-1 rounded transition-colors text-gray-400 hover:text-[#5e58b8]"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">
                        {selectedLangObj.label}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                        Définition
                      </div>
                      <p
                        className={`text-base sm:text-lg leading-relaxed break-words ${
                          darkMode ? 'text-gray-100' : 'text-[#222222]'
                        }`}
                      >
                        <span className="font-semibold text-[#5e58b8] mr-2">1.</span>
                        {entry.definition}
                      </p>
                    </div>

                    {/* Sender shown like a dictionary source credit */}
                    {room && (
                      <div className="mt-3 text-right text-[11px] text-gray-400">
                        {entry.senderId ? `${entry.senderId} · ` : ''}
                        {formatTime(entry.timestamp)}
                      </div>
                    )}
                  </section>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Language Links Matrix */}
            <div className="mt-12 flex flex-col items-center space-y-2.5 text-[12px] text-[#888888]">
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
                {LANG_ROW_1.map((lang) => (
                  <a
                    key={lang}
                    href="#lang"
                    onClick={(e) => e.preventDefault()}
                    className="hover:underline cursor-pointer"
                  >
                    {lang}
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
                {LANG_ROW_2.map((lang) => (
                  <a
                    key={lang}
                    href="#lang"
                    onClick={(e) => e.preventDefault()}
                    className="hover:underline cursor-pointer"
                  >
                    {lang}
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
                {LANG_ROW_3.map((lang) => (
                  <a
                    key={lang}
                    href="#lang"
                    onClick={(e) => e.preventDefault()}
                    className="hover:underline cursor-pointer"
                  >
                    {lang}
                  </a>
                ))}
              </div>
            </div>

            {/* Minimal Footer Links */}
            <footer className="mt-9 flex flex-col items-center space-y-4 text-[11px] text-[#666666]">
              <div className="flex items-center flex-wrap justify-center gap-1.5">
                <a
                  href="#about"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline cursor-pointer"
                >
                  À propos de WR
                </a>
                <span>|</span>
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline cursor-pointer"
                >
                  Politique de confidentialité
                </a>
                <span>|</span>
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline cursor-pointer"
                >
                  Terms of Service
                </a>
              </div>

              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                className={`flex items-center gap-1.5 text-[12px] cursor-pointer ${
                  darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-[#555555] hover:text-[#222222]'
                }`}
              >
                {darkMode ? (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </>
                )}
              </button>
            </footer>
          </main>
        </div>
      )}

      {showDirectory && (
        <DirectoryModal
          isUnlocked={isUnlocked && hasAccess}
          currentMode={viewMode}
          onUnlockAndNavigate={(mode) => {
            if (!tokenRef.current) return;
            setIsUnlocked(true);
            setViewMode(mode);
            setShowDirectory(false);
          }}
          onClose={() => setShowDirectory(false)}
        />
      )}

      {showLegalModal && <LegalWarningModal onClose={() => setShowLegalModal(false)} />}
    </>
  );
}
