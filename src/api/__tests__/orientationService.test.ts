import { create } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import type { SpringPage } from '../../types/api';
import type { Orientation } from '../../types/orientation';
import { createOrientationService } from '../orientationService';

const orientation: Orientation = {
  id: 21,
  ocorrenciaId: 15,
  mensagem: 'Procure um local protegido e acompanhe os canais oficiais.',
  perfil: 'GERAL',
  geradoPorIA: true,
  locaisConsiderados: [3, 8],
  criadaEm: '2026-11-18T12:00:00Z',
};

function page(content: Orientation[], number = 0, totalPages = 1): SpringPage<Orientation> {
  return {
    content,
    number,
    size: 10,
    totalElements: content.length,
    totalPages,
    first: number === 0,
    last: number + 1 >= totalPages,
  };
}

describe('orientationService', () => {
  const client = create();
  const mock = new MockAdapter(client);
  const service = createOrientationService(client, () => undefined);

  afterEach(() => mock.reset());

  it('consulta orientações existentes com paginação e ordem mais recente primeiro', async () => {
    mock.onGet('/api/ocorrencias/15/orientacoes').reply((config) => {
      expect(config.params).toEqual({ page: 1, size: 10, sort: 'criadaEm,desc' });
      return [200, page([orientation], 1, 3)];
    });

    await expect(service.listByOccurrence(15, { page: 1, size: 10 })).resolves.toMatchObject({
      content: [orientation],
      last: false,
    });
  });

  it('preserva uma página vazia enquanto não há orientação', async () => {
    mock.onGet('/api/ocorrencias/15/orientacoes').reply(200, page([]));
    await expect(service.listByOccurrence(15)).resolves.toMatchObject({ content: [], last: true });
  });

  it('propaga o sinal de cancelamento para a requisição Axios', async () => {
    const controller = new AbortController();
    mock.onGet('/api/ocorrencias/15/orientacoes').reply((config) => {
      expect(config.signal).toBe(controller.signal);
      return [200, page([])];
    });

    await service.listByOccurrence(15, { signal: controller.signal });
  });

  it.each([401, 403, 404, 500])('propaga erro HTTP %s sem retry', async (status) => {
    mock.onGet('/api/ocorrencias/15/orientacoes').replyOnce(status);
    await expect(service.listByOccurrence(15)).rejects.toMatchObject({ response: { status } });
    expect(mock.history.get).toHaveLength(1);
  });

  it('nunca chama o endpoint POST de geração durante a leitura', async () => {
    mock.onGet('/api/ocorrencias/15/orientacoes').reply(200, page([orientation]));
    await service.listByOccurrence(15);
    expect(mock.history.post).toHaveLength(0);
  });
});
