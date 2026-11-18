import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AboutScreen } from '../features/about/AboutScreen';
import { colors } from '../theme/tokens';
import { MainTabs } from './MainTabs';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.secondary,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen component={MainTabs} name="MainTabs" options={{ headerShown: false }} />
      <Stack.Screen
        component={AboutScreen}
        name="About"
        options={{ title: 'Sobre o aplicativo' }}
      />
    </Stack.Navigator>
  );
}
