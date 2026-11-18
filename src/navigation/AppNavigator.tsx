import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AboutScreen } from '../features/about/AboutScreen';
import { AlertDetailScreen } from '../features/alerts/AlertDetailScreen';
import { SafeLocationDetailScreen } from '../features/locations/SafeLocationDetailScreen';
import { NewOccurrenceScreen } from '../features/occurrences/NewOccurrenceScreen';
import { OccurrenceDetailScreen } from '../features/occurrences/OccurrenceDetailScreen';
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
        component={NewOccurrenceScreen}
        name="NewOccurrence"
        options={{ title: 'Nova ocorrência' }}
      />
      <Stack.Screen
        component={OccurrenceDetailScreen}
        name="OccurrenceDetail"
        options={{ title: 'Detalhes da ocorrência' }}
      />
      <Stack.Screen
        component={SafeLocationDetailScreen}
        name="SafeLocationDetail"
        options={{ title: 'Detalhes do local' }}
      />
      <Stack.Screen
        component={AlertDetailScreen}
        name="AlertDetail"
        options={{ title: 'Detalhes do alerta' }}
      />
      <Stack.Screen
        component={AboutScreen}
        name="About"
        options={{ title: 'Sobre o aplicativo' }}
      />
    </Stack.Navigator>
  );
}
