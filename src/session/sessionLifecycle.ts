import type { AuthSession, StoredSession, UserProfile } from '../types/auth';
import type { SessionStorage } from './secureStorage';

export type RestoredSession = StoredSession & {
  user: UserProfile;
};

export function isSessionExpired(session: StoredSession, now = Date.now()): boolean {
  const expiresAt = Date.parse(session.expiresAt);
  return !Number.isFinite(expiresAt) || expiresAt <= now;
}

export async function persistSession(storage: SessionStorage, session: AuthSession): Promise<void> {
  await storage.setSession({
    accessToken: session.accessToken,
    expiresAt: session.expiresAt,
  });
}

export async function restoreSession(
  storage: SessionStorage,
  getCurrentUser: (accessToken: string) => Promise<UserProfile>,
  now = Date.now(),
): Promise<RestoredSession | null> {
  const stored = await storage.getSession();
  if (!stored) return null;

  if (isSessionExpired(stored, now)) {
    await storage.deleteSession();
    return null;
  }

  try {
    const user = await getCurrentUser(stored.accessToken);
    return { ...stored, user };
  } catch {
    await storage.deleteSession();
    return null;
  }
}
