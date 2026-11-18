import type { AuthSession, StoredSession, UserProfile } from '../../types/auth';
import type { SessionStorage } from '../secureStorage';
import { isSessionExpired, persistSession, restoreSession } from '../sessionLifecycle';

function createStorage(initial: StoredSession | null = null) {
  let value = initial;
  const storage: SessionStorage = {
    getSession: jest.fn(async () => value),
    setSession: jest.fn(async (session: StoredSession) => {
      value = session;
    }),
    deleteSession: jest.fn(async () => {
      value = null;
    }),
  };
  return { storage, read: () => value };
}

const authSession: AuthSession = {
  tokenType: 'Bearer',
  accessToken: 'jwt-valido',
  expiresAt: '2030-01-01T12:00:00Z',
  email: 'cidadao@email.com',
  papel: 'CIDADAO',
  firebaseUid: null,
};

const profile: UserProfile = {
  email: authSession.email,
  papel: authSession.papel,
  firebaseUid: null,
};

describe('ciclo de sessão', () => {
  it('persiste somente token e expiração, nunca a senha', async () => {
    const { read, storage } = createStorage();

    await persistSession(storage, authSession);

    expect(read()).toEqual({
      accessToken: authSession.accessToken,
      expiresAt: authSession.expiresAt,
    });
    expect(JSON.stringify(read())).not.toContain('senha');
  });

  it('restaura uma sessão válida confirmando o usuário em /me', async () => {
    const { storage } = createStorage({
      accessToken: authSession.accessToken,
      expiresAt: authSession.expiresAt,
    });
    const getCurrentUser = jest.fn(async () => profile);

    await expect(
      restoreSession(storage, getCurrentUser, Date.parse('2029-12-31T12:00:00Z')),
    ).resolves.toEqual({
      accessToken: authSession.accessToken,
      expiresAt: authSession.expiresAt,
      user: profile,
    });
    expect(getCurrentUser).toHaveBeenCalledWith(authSession.accessToken);
  });

  it('remove token expirado sem consultar /me', async () => {
    const { read, storage } = createStorage({
      accessToken: authSession.accessToken,
      expiresAt: '2025-01-01T00:00:00Z',
    });
    const getCurrentUser = jest.fn(async () => profile);

    await expect(
      restoreSession(storage, getCurrentUser, Date.parse('2026-01-01T00:00:00Z')),
    ).resolves.toBeNull();
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(read()).toBeNull();
  });

  it('remove a sessão quando /me rejeita o token salvo', async () => {
    const { read, storage } = createStorage({
      accessToken: authSession.accessToken,
      expiresAt: authSession.expiresAt,
    });

    await expect(
      restoreSession(storage, async () => Promise.reject(new Error('401')), Date.now()),
    ).resolves.toBeNull();
    expect(read()).toBeNull();
  });

  it('considera expiração ausente ou inválida como sessão expirada', () => {
    expect(isSessionExpired({ accessToken: 'jwt', expiresAt: 'inválida' })).toBe(true);
  });
});
