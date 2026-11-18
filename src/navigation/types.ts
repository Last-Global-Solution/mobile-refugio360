import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Occurrences: { refreshKey?: number } | undefined;
  SafeLocations: undefined;
  Alerts: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  About: undefined;
  NewOccurrence: undefined;
  OccurrenceDetail: { occurrenceId: number };
  SafeLocationDetail: { locationId: number };
  AlertDetail: { alertId: string };
};
