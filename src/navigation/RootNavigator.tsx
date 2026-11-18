import { useSession } from '../session/SessionProvider';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const { mode } = useSession();

  return mode === 'signedOut' ? <AuthNavigator /> : <AppNavigator />;
}
