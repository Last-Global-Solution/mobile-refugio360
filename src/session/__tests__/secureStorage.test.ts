import * as SecureStore from 'expo-secure-store';

import { authService } from '../../api/authService';
import { secureStorage } from '../secureStorage';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockedSecureStore = jest.mocked(SecureStore);

describe('secureStorage e logout local', () => {
  beforeEach(() => {
    mockedSecureStore.getItemAsync.mockReset();
    mockedSecureStore.setItemAsync.mockReset();
    mockedSecureStore.deleteItemAsync.mockReset();
    mockedSecureStore.deleteItemAsync.mockResolvedValue();
  });

  it('serializa a sessão no SecureStore', async () => {
    mockedSecureStore.setItemAsync.mockResolvedValue();

    await secureStorage.setSession({ accessToken: 'jwt', expiresAt: '2030-01-01T00:00:00Z' });

    expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith(
      'refugio360.session',
      JSON.stringify({ accessToken: 'jwt', expiresAt: '2030-01-01T00:00:00Z' }),
    );
  });

  it('logout local remove os dados sensíveis persistidos', async () => {
    await authService.logoutLocal();

    expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith('refugio360.session');
  });
});
