import { getPublicDataErrorMessage } from '../publicDataErrors';

describe('mensagens de dados públicos', () => {
  it('orienta aguardar ao receber rate limit', () => {
    expect(
      getPublicDataErrorMessage({ kind: 'http', status: 429, message: 'falha' }, 'alertas', 'list'),
    ).toContain('Aguarde');
  });

  it('diferencia recurso inexistente no detalhe', () => {
    expect(
      getPublicDataErrorMessage(
        { kind: 'http', status: 404, message: 'falha' },
        'locais seguros',
        'detail',
      ),
    ).toBe('Local não encontrado.');
  });

  it('traduz falha de rede sem expor erro técnico', () => {
    expect(
      getPublicDataErrorMessage({ kind: 'network', message: 'Network Error' }, 'alertas', 'list'),
    ).toBe('Sem conexão com o serviço. Verifique sua internet.');
  });
});
