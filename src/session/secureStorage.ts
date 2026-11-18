import * as SecureStore from 'expo-secure-store';

import type { StoredSession } from '../types/auth';

const SESSION_KEY = 'refugio360.session';

export type SessionStorage = {
  getSession: () => Promise<StoredSession | null>;
  setSession: (session: StoredSession) => Promise<void>;
  deleteSession: () => Promise<void>;
};

export const secureStorage: SessionStorage = {
  async getSession() {
    const value = await SecureStore.getItemAsync(SESSION_KEY);
    if (!value) return null;

    try {
      const session: unknown = JSON.parse(value);
      if (
        typeof session === 'object' &&
        session !== null &&
        'accessToken' in session &&
        typeof session.accessToken === 'string' &&
        'expiresAt' in session &&
        typeof session.expiresAt === 'string'
      ) {
        return { accessToken: session.accessToken, expiresAt: session.expiresAt };
      }
    } catch {
      // Dados locais inválidos são tratados como sessão encerrada.
    }

    await SecureStore.deleteItemAsync(SESSION_KEY);
    return null;
  },
  setSession: (session) => SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session)),
  deleteSession: () => SecureStore.deleteItemAsync(SESSION_KEY),
};
