import { create } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import type { SpringPage } from '../../types/api';
import type { CreateOccurrenceRequest, Occurrence } from '../../types/occurrence';
import { createOccurrenceService } from '../occurrenceService';

const occurrence: Occurrence = {
  id: 15,
  descricao: 'Alagamento na via',
  urgencia: 'ALTA',
  status: 'PENDENTE',
  latitude: -23.55,
  longitude: -46.63,
  perfil: 'GERAL',
};

function page(content: Occurrence[], number = 0, totalPages = 1): SpringPage<Occurrence> {
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

describe('occurrenceService', () => {
  const client = create();
  const mock = new MockAdapter(client);
  const service = createOccurrenceService(client, () => undefined);

  afterEach(() => mock.reset());

  it('lista somente as ocorrências do usuário com paginação e ordenação', async () => {
    mock.onGet('/api/ocorrencias/minhas').reply((config) => {
      expect(config.params).toEqual({ page: 1, size: 10, sort: 'id,desc' });
      return [200, page([occurrence], 1, 3)];
    });

    const result = await service.listMine({ page: 1, size: 10 });

    expect(result.content).toEqual([occurrence]);
    expect(result.last).toBe(false);
    expect(mock.history.get).toHaveLength(1);
  });

  it('preserva uma página vazia retornada pelo Spring', async () => {
    mock.onGet('/api/ocorrencias/minhas').reply(200, page([]));

    await expect(service.listMine()).resolves.toMatchObject({ content: [], last: true });
  });

  it('busca detalhe por identificador numérico', async () => {
    mock.onGet('/api/ocorrencias/15').reply(200, occurrence);

    await expect(service.getById(15)).resolves.toEqual(occurrence);
  });

  it('propaga 404 para ocorrência inexistente', async () => {
    mock.onGet('/api/ocorrencias/999').reply(404);

    await expect(service.getById(999)).rejects.toMatchObject({ response: { status: 404 } });
  });

  it('cria ocorrência sem enviar autor, id ou status', async () => {
    const request: CreateOccurrenceRequest = {
      descricao: occurrence.descricao,
      urgencia: occurrence.urgencia,
      latitude: occurrence.latitude,
      longitude: occurrence.longitude,
      perfil: 'GERAL',
    };
    mock.onPost('/api/ocorrencias', request).reply(201, occurrence);

    await expect(service.create(request)).resolves.toEqual(occurrence);
    expect(JSON.parse(mock.history.post[0]?.data as string)).toEqual(request);
  });

  it.each([401, 403, 409])('propaga erro HTTP %s sem retry automático', async (status) => {
    mock.onPost('/api/ocorrencias').replyOnce(status);

    await expect(
      service.create({
        descricao: occurrence.descricao,
        urgencia: occurrence.urgencia,
        latitude: occurrence.latitude,
        longitude: occurrence.longitude,
        perfil: 'GERAL',
      }),
    ).rejects.toMatchObject({ response: { status } });
    expect(mock.history.post).toHaveLength(1);
  });

  it('propaga falha de rede sem repetir o POST', async () => {
    mock.onPost('/api/ocorrencias').networkErrorOnce();

    await expect(
      service.create({
        descricao: occurrence.descricao,
        urgencia: occurrence.urgencia,
        latitude: occurrence.latitude,
        longitude: occurrence.longitude,
        perfil: 'GERAL',
      }),
    ).rejects.toThrow('Network Error');
    expect(mock.history.post).toHaveLength(1);
  });
});
