import { getOrientationErrorMessage } from '../orientationErrors';

describe('erros de orientações', () => {
  it.each([
    [401, 'Sua sessão expirou. Entre novamente.'],
    [403, 'Você não tem permissão para consultar estas orientações.'],
    [404, 'A ocorrência não foi encontrada.'],
  ])('preserva o status HTTP %s já normalizado pelo javaClient', (status, message) => {
    expect(getOrientationErrorMessage({ kind: 'http', status, message: 'falha' })).toBe(message);
  });

  it('traduz falha de rede já normalizada pelo javaClient', () => {
    expect(getOrientationErrorMessage({ kind: 'network', message: 'falha' })).toBe(
      'Sem conexão com o serviço de orientações.',
    );
  });
});
