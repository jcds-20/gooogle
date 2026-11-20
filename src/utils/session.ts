export interface CheckResult {
  ok: boolean;
  next?: number | 'open';
  ticket?: string;
  token?: string;
}

export const SESSION_KEY = 'wr-session';

export async function checkCode(
  stage: number,
  attempt: string,
  step?: string | null
): Promise<CheckResult> {
  try {
    const res = await fetch('/api/gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, attempt, ticket: step ?? undefined }),
    });
    if (!res.ok) return { ok: false };
    const body = (await res.json()) as CheckResult;
    return body && body.ok === true ? body : { ok: false };
  } catch {
    return { ok: false };
  }
}

export async function checkSession(token: string): Promise<boolean> {
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

export function readSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY) || null;
  } catch {
    return null;
  }
}

export function writeSession(token: string | null) {
  try {
    if (token) sessionStorage.setItem(SESSION_KEY, token);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable
  }
}
