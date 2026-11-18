import {
  createContext,
  type PropsWithChildren,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { authService } from '../api/authService';
import { configureJavaAuth } from '../api/clients';
import type { AuthCredentials, AuthSession, UserProfile } from '../types/auth';
import { persistSession, restoreSession } from './sessionLifecycle';
import { secureStorage } from './secureStorage';

type SessionMode = 'signedOut' | 'preview' | 'authenticated';

type SessionContextValue = {
  mode: SessionMode;
  isInitializing: boolean;
  isAuthenticated: boolean;
  canPreview: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  enterPreview: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function profileFromSession(session: AuthSession): UserProfile {
  return {
    email: session.email,
    papel: session.papel,
    firebaseUid: session.firebaseUid,
  };
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<SessionMode>('signedOut');
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const clearSessionRef = useRef<() => Promise<void>>(async () => undefined);

  const clearSession = useCallback(async () => {
    tokenRef.current = null;
    setAccessToken(null);
    setUser(null);
    setMode('signedOut');
    await authService.logoutLocal();
  }, []);

  useEffect(() => {
    clearSessionRef.current = clearSession;
  }, [clearSession]);

  const establishSession = useCallback(async (session: AuthSession) => {
    await persistSession(secureStorage, session);
    tokenRef.current = session.accessToken;
    setAccessToken(session.accessToken);
    setUser(profileFromSession(session));
    setMode('authenticated');
  }, []);

  useEffect(() => {
    let active = true;
    const unbind = configureJavaAuth({
      getAccessToken: () => tokenRef.current,
      onUnauthorized: () => {
        void clearSessionRef.current();
      },
    });

    const initialize = async () => {
      let restored = null;
      try {
        restored = await restoreSession(secureStorage, async (token) => {
          tokenRef.current = token;
          return authService.getCurrentUser();
        });
      } catch {
        tokenRef.current = null;
      }

      if (!active) return;
      if (restored) {
        tokenRef.current = restored.accessToken;
        setAccessToken(restored.accessToken);
        setUser(restored.user);
        setMode('authenticated');
      } else {
        tokenRef.current = null;
        setMode('signedOut');
      }
      setIsInitializing(false);
    };

    void initialize();
    return () => {
      active = false;
      unbind();
    };
  }, []);

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      const session = await authService.login(credentials);
      await establishSession(session);
    },
    [establishSession],
  );

  const register = useCallback(
    async (credentials: AuthCredentials) => {
      const session = await authService.register(credentials);
      await establishSession(session);
    },
    [establishSession],
  );

  return (
    <SessionContext
      value={{
        mode,
        isInitializing,
        isAuthenticated: mode === 'authenticated',
        canPreview: __DEV__,
        user,
        accessToken,
        login,
        register,
        logout: clearSession,
        enterPreview: () => {
          if (__DEV__ && mode === 'signedOut') setMode('preview');
        },
      }}
    >
      {children}
    </SessionContext>
  );
}

export function useSession(): SessionContextValue {
  const session = use(SessionContext);

  if (!session) {
    throw new Error('useSession deve ser usado dentro de SessionProvider.');
  }

  return session;
}
