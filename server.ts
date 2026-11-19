// Loads a local .env file if there is one (no-op on Render, where variables are injected)
import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Behind Render's proxy: use the real client IP (needed for the per-IP attempt cap)
app.set('trust proxy', 1);
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

export interface DefinitionEntry {
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

function generatePhonetic(text: string): string {
  const clean = text.toLowerCase().trim();
  const vowels: Record<string, string> = {
    a: 'a', e: 'ə', i: 'i', o: 'o', u: 'y',
    é: 'e', è: 'ɛ', ê: 'ɛ', à: 'a', ç: 's',
    ou: 'u', on: 'ɔ̃', an: 'ɑ̃', in: 'ɛ̃',
  };
  const ipa = clean
    .replace(/ou/g, 'u')
    .replace(/on/g, 'ɔ̃')
    .replace(/an/g, 'ɑ̃')
    .replace(/in/g, 'ɛ̃')
    .replace(/ch/g, 'ʃ')
    .replace(/th/g, 'θ')
    .replace(/ph/g, 'f')
    .replace(/qu/g, 'k')
    .replace(/[aeiouéèêà]/g, (m) => vowels[m] || m);
  return `/${ipa.slice(0, 30)}/`;
}

function determineCategory(text: string): string {
  const t = text.trim();
  if (t.endsWith('?') || t.startsWith('pourquoi') || t.startsWith('comment') || t.startsWith('qui') || t.startsWith('où') || t.startsWith('quand')) {
    return 'loc. interr.';
  }
  if (t.split(' ').length > 4) {
    return 'loc. phr.';
  }
  if (t.split(' ').length > 1) {
    return 'loc.';
  }
  if (t.endsWith('er') || t.endsWith('ir') || t.endsWith('re')) {
    return 'v.';
  }
  return 'n.';
}

function buildEntry(term: string, room: string = 'global', senderId?: string): DefinitionEntry {
  const cleanTerm = term.trim();
  return {
    id: 'def-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    room,
    term: cleanTerm,
    phonetic: generatePhonetic(cleanTerm),
    category: determineCategory(cleanTerm),
    definition: cleanTerm,
    context: 'Usage courant',
    translation: cleanTerm,
    timestamp: Date.now(),
    senderId,
  };
}

// A connection remembers which room it joined (ws.room).
interface RoomSocket extends WebSocket {
  room?: string;
  token?: string; // access token presented at join; re-checked on every broadcast
}

const MAX_HISTORY_PER_ROOM = 100;
// Entries without a valid room are "private": answered to the sender only,
// never stored, never broadcast (plain dictionary-lookup behaviour).
const PRIVATE_ROOM = 'local';

// In-memory history, one list per room. Null prototype so a room named
// "__proto__" or "constructor" cannot collide with Object internals.
const roomHistory = Object.create(null) as Record<string, DefinitionEntry[]>;

// A room is a 3-character lowercase alphanumeric access code.
function parseRoom(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const room = value.trim().toLowerCase();
  return /^[a-z0-9]{3}$/.test(room) ? room : null;
}

function normalizeSender(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const sender = value.trim().slice(0, 32);
  return sender || undefined;
}

function getHistory(room: string): DefinitionEntry[] {
  return roomHistory[room] ?? [];
}

// Store the entry in ITS room's history (capped), then send it only to the
// clients currently in that room.
function publishEntry(entry: DefinitionEntry) {
  const history = roomHistory[entry.room] ?? (roomHistory[entry.room] = []);
  history.push(entry);
  if (history.length > MAX_HISTORY_PER_ROOM) {
    history.splice(0, history.length - MAX_HISTORY_PER_ROOM);
  }

  const payload = JSON.stringify({
    type: 'new_entry',
    entry,
  });

  wss.clients.forEach((client) => {
    const target = client as RoomSocket;
    if (
      client.readyState === WebSocket.OPEN &&
      target.room === entry.room &&
      isValidToken(target.token)
    ) {
      client.send(payload);
    }
  });
}

// ---------------------------------------------------------------------------
// Entry portal: the real path is known to the SERVER ONLY, through environment
// variables (never written in the code). The front-end never contains these
// secrets; it just forwards what the user typed to POST /api/gate.
//   1) landing page  -> GATE_STEP1 typed in the void
//   2) fake Google   -> GATE_STEP2 typed in the search bar (must start with "/")
//   3) code page     -> GATE_STEP3 entered in the field  => access token for the chat
// Locally the values come from a .env file that is NOT committed; on Render they
// are set in the service's Environment tab.
// ---------------------------------------------------------------------------
function readGateSecret(name: string, devPlaceholder: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;

  if (process.env.NODE_ENV === 'production') {
    // Never fall back to a guessable value in production: the portal stays closed
    console.error(`[gate] ${name} is not set: this stage cannot be passed`);
    return crypto.randomBytes(24).toString('hex');
  }
  console.warn(`[gate] ${name} is not set: using the DEV placeholder "${devPlaceholder}"`);
  return devPlaceholder;
}

const GATE_SECRETS = [
  readGateSecret('GATE_STEP1', 'dev1'),
  readGateSecret('GATE_STEP2', '/dev2'),
  readGateSecret('GATE_STEP3', 'dev3'),
];
const GATE_DELAY_MS = 300; // slows down every attempt
const GATE_MAX_ATTEMPTS = 40; // per IP, per window
const GATE_WINDOW_MS = 10 * 60 * 1000;
const TICKET_TTL_MS = 30 * 60 * 1000; // time allowed to go through the 3 stages
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

// ticket = proof of progress through the stages (in memory, no database)
const gateTickets = new Map<string, { passed: number; expires: number }>();
// access tokens handed out at the end of the portal
const accessTokens = new Map<string, number>();
const gateAttempts = new Map<string, { count: number; resetAt: number }>();

function sha256(value: string): Buffer {
  return crypto.createHash('sha256').update(value).digest();
}

function matchesSecret(attempt: string, secret: string): boolean {
  // Case-insensitive; compare fixed-size digests in constant time
  return crypto.timingSafeEqual(
    sha256(attempt.trim().toLowerCase()),
    sha256(secret.trim().toLowerCase())
  );
}

function newRandomId(): string {
  return crypto.randomBytes(24).toString('hex');
}

function isValidToken(token: unknown): boolean {
  if (typeof token !== 'string' || !token) return false;
  const expires = accessTokens.get(token);
  if (expires === undefined) return false;
  if (expires < Date.now()) {
    accessTokens.delete(token);
    return false;
  }
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Drop expired tickets / tokens / counters
setInterval(() => {
  const now = Date.now();
  for (const [key, t] of gateTickets) if (t.expires < now) gateTickets.delete(key);
  for (const [key, exp] of accessTokens) if (exp < now) accessTokens.delete(key);
  for (const [key, a] of gateAttempts) if (a.resetAt < now) gateAttempts.delete(key);
}, 60 * 1000).unref();

app.post('/api/gate', async (req, res) => {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();

  // Attempt cap per IP (a success refunds its attempt)
  let counter = gateAttempts.get(ip);
  if (!counter || counter.resetAt < now) {
    counter = { count: 0, resetAt: now + GATE_WINDOW_MS };
    gateAttempts.set(ip, counter);
  }
  if (counter.count >= GATE_MAX_ATTEMPTS) {
    return res.status(429).json({ ok: false });
  }
  counter.count += 1;

  const { stage, attempt, ticket } = req.body ?? {};
  await sleep(GATE_DELAY_MS);

  const stageNumber = typeof stage === 'number' ? stage : NaN;
  if (
    !Number.isInteger(stageNumber) ||
    stageNumber < 1 ||
    stageNumber > GATE_SECRETS.length ||
    typeof attempt !== 'string' ||
    attempt.length === 0 ||
    attempt.length > 64
  ) {
    return res.json({ ok: false });
  }

  // Stage 1 starts a ticket; later stages need a ticket that passed the previous one.
  // A wrong secret and a missing/outdated ticket give the exact same answer.
  let current: { passed: number; expires: number } | undefined;
  if (stageNumber > 1) {
    current = typeof ticket === 'string' ? gateTickets.get(ticket) : undefined;
    if (!current || current.expires < now || current.passed !== stageNumber - 1) {
      return res.json({ ok: false });
    }
  }

  if (!matchesSecret(attempt, GATE_SECRETS[stageNumber - 1])) {
    return res.json({ ok: false });
  }

  counter.count = Math.max(0, counter.count - 1);

  if (stageNumber === GATE_SECRETS.length) {
    if (typeof ticket === 'string') gateTickets.delete(ticket);
    const token = newRandomId();
    accessTokens.set(token, Date.now() + TOKEN_TTL_MS);
    return res.json({ ok: true, next: 'open', token });
  }

  if (stageNumber === 1) {
    const newTicket = newRandomId();
    gateTickets.set(newTicket, { passed: 1, expires: Date.now() + TICKET_TTL_MS });
    return res.json({ ok: true, next: 2, ticket: newTicket });
  }

  current!.passed = stageNumber;
  return res.json({ ok: true, next: stageNumber + 1, ticket });
});

// Lets a reloaded tab check that its stored token is still good
app.post('/api/gate/verify', (req, res) => {
  res.json({ ok: isValidToken(req.body?.token) });
});

// REST fallback endpoint: stores and broadcasts like the WebSocket path
app.post('/api/entries', (req, res) => {
  // No valid access token = the chat does not exist
  if (!isValidToken(req.get('x-access-token'))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const { term, room, senderId } = req.body ?? {};
  if (!term || typeof term !== 'string' || !term.trim()) {
    return res.status(400).json({ error: 'Term required' });
  }

  const validRoom = parseRoom(room);
  const entry = buildEntry(term, validRoom ?? PRIVATE_ROOM, normalizeSender(senderId));
  if (validRoom) publishEntry(entry);

  res.status(201).json({ success: true, entry });
});

// WebSocket Handling
wss.on('connection', (ws: RoomSocket) => {
  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      // Everything else needs a valid access token: no token, no chat
      if (!isValidToken(data.token)) {
        ws.room = undefined;
        ws.send(JSON.stringify({ type: 'denied' }));
        return;
      }

      if (data.type === 'join') {
        // Invalid/missing code = leave every room: no history, no broadcasts
        ws.room = parseRoom(data.room) ?? undefined;
        ws.token = data.token;
        if (ws.room) {
          ws.send(JSON.stringify({ type: 'history', entries: getHistory(ws.room) }));
        }
      } else if (data.type === 'search' || data.type === 'send') {
        const query = data.query || data.term;
        if (!query || typeof query !== 'string' || !query.trim()) return;

        const validRoom = parseRoom(data.room);
        const entry = buildEntry(query, validRoom ?? PRIVATE_ROOM, normalizeSender(data.senderId));
        if (validRoom) {
          publishEntry(entry);
        } else {
          ws.send(JSON.stringify({ type: 'new_entry', entry }));
        }
      }
    } catch {
      // Ignore malformed messages
    }
  });
});

function getCliPort(): number | null {
  const idx = process.argv.indexOf('--port');
  if (idx !== -1 && process.argv[idx + 1]) {
    const parsed = parseInt(process.argv[idx + 1], 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return null;
}

// Mount Vite or static files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const cliPort = getCliPort();
  const PORT = cliPort ?? (isProd && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

  if (!isProd) {
    let viteInstancePromise: Promise<import('vite').ViteDevServer> | null = null;
    const getVite = () => {
      if (!viteInstancePromise) {
        const disableHmr = process.env.DISABLE_HMR === 'true';
        viteInstancePromise = import('vite').then(({ createServer: createViteServer }) =>
          createViteServer({
            server: {
              middlewareMode: true,
              hmr: disableHmr ? false : undefined,
              ws: disableHmr ? (false as const) : undefined,
              watch: disableHmr ? null : {},
            },
            appType: 'spa',
          })
        );
      }
      return viteInstancePromise;
    };

    app.use(async (req, res, next) => {
      try {
        const vite = await getVite();
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`WordReference server listening on http://0.0.0.0:${PORT}`);
      setImmediate(() => {
        getVite().catch((err) => {
          console.error('Vite middleware initialization failed:', err);
        });
      });
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`WordReference server listening on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();
