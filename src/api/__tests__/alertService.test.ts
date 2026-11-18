import { create } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import type { PublicAlert } from '../../types/alert';
import { createAlertService } from '../alertService';

const alert: PublicAlert = {
  id: '36c12812-53ba-4b83-a60a-ecc622ae9304',
  titulo: 'Chuva forte',
  mensagem: 'Evite áreas alagadas.',
  fonte: 'Defesa Civil',
  status: 'PUBLICADO',
  criadoEmUtc: '2026-11-18T12:00:00Z',
  expiraEmUtc: '2026-11-19T12:00:00Z',
  ativo: true,
};

describe('alertService', () => {
  const client = create();
  const mock = new MockAdapter(client);
  const service = createAlertService(client, () => undefined);

  afterEach(() => mock.reset());

  it('lista o array de alertas publicados', async () => {
    mock.onGet('/api/v1/alertas').reply(200, [alert]);
    await expect(service.listPublished()).resolves.toEqual([alert]);
  });

  it('preserva uma listagem vazia', async () => {
    mock.onGet('/api/v1/alertas').reply(200, []);
    await expect(service.listPublished()).resolves.toEqual([]);
  });

  it('busca detalhe por GUID', async () => {
    mock.onGet(`/api/v1/alertas/${alert.id}`).reply(200, alert);
    await expect(service.getById(alert.id)).resolves.toEqual(alert);
  });

  it.each([404, 429])('propaga erro HTTP %s sem retry automático', async (status) => {
    mock.onGet(`/api/v1/alertas/${alert.id}`).replyOnce(status);
    await expect(service.getById(alert.id)).rejects.toMatchObject({ response: { status } });
    expect(mock.history.get).toHaveLength(1);
  });

  it('propaga falha de rede sem retry automático', async () => {
    mock.onGet('/api/v1/alertas').networkErrorOnce();
    await expect(service.listPublished()).rejects.toThrow('Network Error');
    expect(mock.history.get).toHaveLength(1);
  });
});
