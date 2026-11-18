import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

import { AlertsScreen } from '../features/alerts/AlertsScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { SafeLocationsScreen } from '../features/locations/SafeLocationsScreen';
import { OccurrencesScreen } from '../features/occurrences/OccurrencesScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { colors, radii, typography } from '../theme/tokens';
import type { MainTabParamList } from './types';

const Tabs = createBottomTabNavigator<MainTabParamList>();

const tabCodes: Record<keyof MainTabParamList, string> = {
  Home: 'IN',
  Occurrences: 'OC',
  SafeLocations: 'LS',
  Alerts: 'AL',
  Profile: 'EU',
};

function TabIcon({ route, focused }: { route: keyof MainTabParamList; focused: boolean }) {
  return (
    <View style={[styles.icon, focused && styles.iconFocused]}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>{tabCodes[route]}</Text>
    </View>
  );
}

export function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.secondary, fontWeight: '800' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} route={route.name} />,
      })}
    >
      <Tabs.Screen component={HomeScreen} name="Home" options={{ title: 'Início' }} />
      <Tabs.Screen
        component={OccurrencesScreen}
        name="Occurrences"
        options={{ title: 'Ocorrências' }}
      />
      <Tabs.Screen
        component={SafeLocationsScreen}
        name="SafeLocations"
        options={{ title: 'Locais' }}
      />
      <Tabs.Screen component={AlertsScreen} name="Alerts" options={{ title: 'Alertas' }} />
      <Tabs.Screen component={ProfileScreen} name="Profile" options={{ title: 'Perfil' }} />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 68,
    paddingTop: 6,
    paddingBottom: 8,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  icon: {
    minWidth: 31,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  iconFocused: {
    backgroundColor: colors.primarySoft,
  },
  iconText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '900',
  },
  iconTextFocused: {
    color: colors.primary,
  },
});
