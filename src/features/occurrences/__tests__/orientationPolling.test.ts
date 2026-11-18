import type { SpringPage } from '../../../types/api';
import type { Orientation } from '../../../types/orientation';
import { pollForOrientations } from '../orientationPolling';

const orientation: Orientation = {
  id: 21,
  ocorrenciaId: 15,
  mensagem: 'Orientação pronta',
  perfil: 'GERAL',
  geradoPorIA: true,
  locaisConsiderados: [],
  criadaEm: '2026-11-18T12:00:00Z',
};

function page(content: Orientation[]): SpringPage<Orientation> {
  return {
    content,
    number: 0,
    size: 10,
    totalElements: content.length,
    totalPages: content.length > 0 ? 1 : 0,
    first: true,
    last: true,
  };
}

describe('polling de orientações', () => {
  it('encerra com sucesso assim que recebe uma orientação', async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce(page([]))
      .mockResolvedValueOnce(page([orientation]));
    const wait = jest.fn().mockResolvedValue(true);

    const result = await pollForOrientations({
      fetchPage,
      signal: new AbortController().signal,
      delays: [1_000, 2_000],
      wait,
    });

    expect(result).toEqual({ status: 'found', page: page([orientation]) });
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(wait).toHaveBeenCalledTimes(1);
  });

  it('encerra após o limite sem retries infinitos', async () => {
    const fetchPage = jest.fn().mockResolvedValue(page([]));
    const wait = jest.fn().mockResolvedValue(true);

    await expect(
      pollForOrientations({
        fetchPage,
        signal: new AbortController().signal,
        delays: [1_000, 2_000, 3_000],
        wait,
      }),
    ).resolves.toEqual({ status: 'timeout' });
    expect(fetchPage).toHaveBeenCalledTimes(4);
    expect(wait).toHaveBeenCalledTimes(3);
  });

  it('respeita o limite total mesmo quando cada consulta também demora', async () => {
    let elapsed = 0;
    const fetchPage = jest.fn().mockImplementation(async () => {
      elapsed += 11_000;
      return page([]);
    });
    const wait = jest.fn().mockImplementation(async (delay: number) => {
      elapsed += delay;
      return true;
    });

    await expect(
      pollForOrientations({
        fetchPage,
        signal: new AbortController().signal,
        delays: [1_000, 2_000, 5_000, 5_000],
        maxDurationMs: 30_000,
        now: () => elapsed,
        wait,
      }),
    ).resolves.toEqual({ status: 'timeout' });
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });

  it('cancela o próximo ciclo quando a tela é desmontada', async () => {
    const controller = new AbortController();
    const fetchPage = jest.fn().mockResolvedValue(page([]));
    const wait = jest.fn().mockImplementation(async () => {
      controller.abort();
      return false;
    });

    await expect(
      pollForOrientations({ fetchPage, signal: controller.signal, delays: [1_000], wait }),
    ).resolves.toEqual({ status: 'cancelled' });
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it('cancela uma requisição em andamento quando o logout aborta a sessão', async () => {
    const controller = new AbortController();
    const fetchPage = jest.fn(
      (signal: AbortSignal) =>
        new Promise<SpringPage<Orientation>>((_, reject) => {
          signal.addEventListener('abort', () => reject(new Error('cancelada')), { once: true });
        }),
    );

    const resultPromise = pollForOrientations({
      fetchPage,
      signal: controller.signal,
      delays: [1_000],
    });
    controller.abort();

    await expect(resultPromise).resolves.toEqual({ status: 'cancelled' });
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it.each([401, 403, 404])('interrompe imediatamente no erro HTTP %s', async (status) => {
    const failure = { kind: 'http', status, message: 'falha' };
    const fetchPage = jest.fn().mockRejectedValue(failure);
    const wait = jest.fn().mockResolvedValue(true);

    await expect(
      pollForOrientations({
        fetchPage,
        signal: new AbortController().signal,
        delays: [1_000, 2_000],
        wait,
      }),
    ).rejects.toBe(failure);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(wait).not.toHaveBeenCalled();
  });
});
