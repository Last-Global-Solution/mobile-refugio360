import { SessionLoadingScreen } from '../features/auth/SessionLoadingScreen';
import { useSession } from '../session/SessionProvider';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const { isInitializing, mode } = useSession();

  if (isInitializing) return <SessionLoadingScreen />;

  return mode === 'signedOut' ? <AuthNavigator /> : <AppNavigator />;
}
