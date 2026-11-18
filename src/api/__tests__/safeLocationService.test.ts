import { create } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import type { SpringPage } from '../../types/api';
import type { SafeLocation } from '../../types/safeLocation';
import { createSafeLocationService } from '../safeLocationService';

const location: SafeLocation = {
  id: 7,
  nome: 'Abrigo Central',
  tipo: 'ABRIGO',
  endereco: 'Rua Principal, 100',
  latitude: -23.55052,
  longitude: -46.633308,
  descricao: null,
};

function page(content: SafeLocation[], number = 0, totalPages = 1): SpringPage<SafeLocation> {
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

describe('safeLocationService', () => {
  const client = create();
  const mock = new MockAdapter(client);
  const service = createSafeLocationService(client, () => undefined);

  afterEach(() => mock.reset());

  it('lista locais paginados em ordem alfabética', async () => {
    mock.onGet('/api/locais-seguros').reply((config) => {
      expect(config.params).toEqual({ page: 1, size: 10, sort: 'nome,asc' });
      return [200, page([location], 1, 3)];
    });

    await expect(service.list({ page: 1, size: 10 })).resolves.toMatchObject({
      content: [location],
      last: false,
    });
  });

  it('preserva uma página vazia', async () => {
    mock.onGet('/api/locais-seguros').reply(200, page([]));
    await expect(service.list()).resolves.toMatchObject({ content: [], last: true });
  });

  it('busca detalhe por ID numérico', async () => {
    mock.onGet('/api/locais-seguros/7').reply(200, location);
    await expect(service.getById(7)).resolves.toEqual(location);
  });

  it('propaga 404 no detalhe inexistente', async () => {
    mock.onGet('/api/locais-seguros/999').reply(404);
    await expect(service.getById(999)).rejects.toMatchObject({ response: { status: 404 } });
  });

  it('propaga falha de rede sem retry automático', async () => {
    mock.onGet('/api/locais-seguros').networkErrorOnce();
    await expect(service.list()).rejects.toThrow('Network Error');
    expect(mock.history.get).toHaveLength(1);
  });
});
