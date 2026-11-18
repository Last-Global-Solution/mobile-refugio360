import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Occurrences: undefined;
  SafeLocations: undefined;
  Alerts: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  About: undefined;
};
