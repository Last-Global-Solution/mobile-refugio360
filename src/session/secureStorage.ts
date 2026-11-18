import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'refugio360.accessToken';

export const secureStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  deleteAccessToken: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
};
