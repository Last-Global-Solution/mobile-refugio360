import { create } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import type { AuthSession, UserProfile } from '../../types/auth';
import { createAuthService } from '../authService';

const session: AuthSession = {
  tokenType: 'Bearer',
  accessToken: 'header.payload.signature',
  expiresAt: '2030-01-01T12:00:00Z',
  email: 'cidadao@email.com',
  papel: 'CIDADAO',
  firebaseUid: null,
};

describe('authService', () => {
  const client = create();
  const mock = new MockAdapter(client);
  const service = createAuthService(client, () => undefined);

  afterEach(() => mock.reset());

  it('realiza login e preserva o contrato retornado pela API Java', async () => {
    mock.onPost('/api/auth/login', { email: session.email, senha: 'senha123' }).reply(200, session);

    await expect(service.login({ email: session.email, senha: 'senha123' })).resolves.toEqual(
      session,
    );
  });

  it('propaga a resposta de credenciais inválidas', async () => {
    mock.onPost('/api/auth/login').reply(401);

    await expect(service.login({ email: session.email, senha: 'incorreta' })).rejects.toMatchObject(
      {
        response: { status: 401 },
      },
    );
  });

  it('cadastra e autentica com a sessão devolvida pelo backend', async () => {
    mock
      .onPost('/api/auth/register', { email: session.email, senha: 'senha123' })
      .reply(201, session);

    await expect(service.register({ email: session.email, senha: 'senha123' })).resolves.toEqual(
      session,
    );
  });

  it('consulta o perfil autenticado em /me', async () => {
    const profile: UserProfile = {
      email: session.email,
      papel: session.papel,
      firebaseUid: null,
    };
    mock.onGet('/api/auth/me').reply(200, profile);

    await expect(service.getCurrentUser()).resolves.toEqual(profile);
  });
});
