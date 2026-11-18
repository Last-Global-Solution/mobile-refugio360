import { createContext, type PropsWithChildren, use, useState } from 'react';

type SessionMode = 'signedOut' | 'preview' | 'authenticated';

type SessionContextValue = {
  mode: SessionMode;
  enterPreview: () => void;
  leaveSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<SessionMode>('signedOut');

  return (
    <SessionContext
      value={{
        mode,
        enterPreview: () => setMode('preview'),
        leaveSession: () => setMode('signedOut'),
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
