// Thin client for the server-side entry portal.
// The front-end holds NO secret: it only forwards what the user typed.

export interface GateReply {
  ok: boolean;
  next?: number | 'open';
  ticket?: string;
  token?: string;
}

export const TOKEN_STORAGE_KEY = 'wr-session';

export async function submitGate(
  stage: number,
  attempt: string,
  ticket?: string | null
): Promise<GateReply> {
  try {
    const res = await fetch('/api/gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, attempt, ticket: ticket ?? undefined }),
    });
    if (!res.ok) return { ok: false };
    const body = (await res.json()) as GateReply;
    return body && body.ok === true ? body : { ok: false };
  } catch {
    return { ok: false };
  }
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/gate/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return false;
    const body = await res.json();
    return body?.ok === true;
  } catch {
    return false;
  }
}

export function readStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function writeStoredToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    else sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // sessionStorage unavailable: token stays in memory only
  }
}
