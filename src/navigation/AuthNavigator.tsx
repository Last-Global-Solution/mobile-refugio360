import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AboutScreen } from '../features/about/AboutScreen';
import { LoginScreen } from '../features/auth/LoginScreen';
import { RegisterScreen } from '../features/auth/RegisterScreen';
import { colors } from '../theme/tokens';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.secondary,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen component={LoginScreen} name="Login" options={{ headerShown: false }} />
      <Stack.Screen component={RegisterScreen} name="Register" options={{ title: 'Criar conta' }} />
      <Stack.Screen component={AboutScreen} name="About" options={{ title: 'Sobre' }} />
    </Stack.Navigator>
  );
}
