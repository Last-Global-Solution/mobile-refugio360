import type { AxiosInstance } from 'axios';

import { environment, requireApiUrl } from '../config/environment';
import { secureStorage } from '../session/secureStorage';
import type { AuthCredentials, AuthSession, UserProfile } from '../types/auth';
import { javaClient } from './clients';

export type AuthService = {
  register: (credentials: AuthCredentials) => Promise<AuthSession>;
  login: (credentials: AuthCredentials) => Promise<AuthSession>;
  getCurrentUser: () => Promise<UserProfile>;
  logoutLocal: () => Promise<void>;
};

export function createAuthService(
  client: AxiosInstance,
  assertConfigured: () => void = () => {
    requireApiUrl('Java', environment.javaApiUrl);
  },
): Omit<AuthService, 'logoutLocal'> {
  return {
    async register(credentials) {
      assertConfigured();
      const { data } = await client.post<AuthSession>('/api/auth/register', credentials);
      return data;
    },
    async login(credentials) {
      assertConfigured();
      const { data } = await client.post<AuthSession>('/api/auth/login', credentials);
      return data;
    },
    async getCurrentUser() {
      assertConfigured();
      const { data } = await client.get<UserProfile>('/api/auth/me');
      return data;
    },
  };
}

export const authService: AuthService = {
  ...createAuthService(javaClient),
  logoutLocal: () => secureStorage.deleteSession(),
};
