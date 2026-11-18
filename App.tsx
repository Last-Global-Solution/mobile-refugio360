import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { SessionProvider } from './src/session/SessionProvider';
import { navigationTheme } from './src/theme/navigationTheme';

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
