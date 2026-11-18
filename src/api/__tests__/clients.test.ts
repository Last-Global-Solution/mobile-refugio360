import MockAdapter from 'axios-mock-adapter';

import { configureJavaAuth, dotnetPublicClient, javaClient } from '../clients';

describe('clientes HTTP e autenticação', () => {
  const javaMock = new MockAdapter(javaClient);
  const dotnetMock = new MockAdapter(dotnetPublicClient);
  let unbind: () => void = () => undefined;

  afterEach(() => {
    unbind();
    javaMock.reset();
    dotnetMock.reset();
  });

  it('adiciona Bearer somente em chamadas protegidas do Java', async () => {
    unbind = configureJavaAuth({
      getAccessToken: () => 'jwt-java',
      onUnauthorized: () => undefined,
    });
    javaMock.onGet('/api/auth/me').reply((config) => [200, config.headers?.Authorization]);

    const response = await javaClient.get<string>('/api/auth/me');

    expect(response.data).toBe('Bearer jwt-java');
  });

  it('não adiciona token ao login público', async () => {
    unbind = configureJavaAuth({
      getAccessToken: () => 'jwt-java',
      onUnauthorized: () => undefined,
    });
    javaMock
      .onPost('/api/auth/login')
      .reply((config) => [200, config.headers?.Authorization ?? null]);

    const response = await javaClient.post<null>('/api/auth/login', {});

    expect(response.data).toBeNull();
  });

  it('encerra a sessão uma vez ao receber 401 protegido, sem retry', async () => {
    const onUnauthorized = jest.fn();
    unbind = configureJavaAuth({ getAccessToken: () => 'jwt-java', onUnauthorized });
    javaMock.onGet('/api/auth/me').replyOnce(401);

    await expect(javaClient.get('/api/auth/me')).rejects.toMatchObject({ status: 401 });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    expect(javaMock.history.get).toHaveLength(1);
  });

  it('não encerra sessão por 401 durante tentativa de login', async () => {
    const onUnauthorized = jest.fn();
    unbind = configureJavaAuth({ getAccessToken: () => 'jwt-java', onUnauthorized });
    javaMock.onPost('/api/auth/login').reply(401);

    await expect(javaClient.post('/api/auth/login', {})).rejects.toMatchObject({ status: 401 });
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('mantém o cliente público .NET isolado do token Java', async () => {
    unbind = configureJavaAuth({
      getAccessToken: () => 'jwt-java',
      onUnauthorized: () => undefined,
    });
    dotnetMock
      .onGet('/api/v1/alertas')
      .reply((config) => [200, config.headers?.Authorization ?? null]);

    const response = await dotnetPublicClient.get<null>('/api/v1/alertas');

    expect(response.data).toBeNull();
  });
});
