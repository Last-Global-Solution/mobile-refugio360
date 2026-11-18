import type { SpringPage } from '../../../types/api';
import type { Orientation } from '../../../types/orientation';
import { canLoadNextOrientationPage, mergeOrientationPage } from '../orientationPagination';

const first: Orientation = {
  id: 2,
  ocorrenciaId: 15,
  mensagem: 'Mais recente',
  perfil: 'GERAL',
  geradoPorIA: true,
  locaisConsiderados: [],
  criadaEm: '2026-11-18T12:00:00Z',
};
const second: Orientation = { ...first, id: 1, mensagem: 'Anterior' };

function page(content: Orientation[], last: boolean): SpringPage<Orientation> {
  return {
    content,
    number: last ? 1 : 0,
    size: 1,
    totalElements: 2,
    totalPages: 2,
    first: !last,
    last,
  };
}

describe('paginação de orientações', () => {
  it('substitui as orientações durante atualização manual', () => {
    expect(mergeOrientationPage([second], page([first], false), true)).toEqual([first]);
  });

  it('anexa páginas anteriores sem duplicar IDs', () => {
    expect(mergeOrientationPage([first], page([first, second], true))).toEqual([first, second]);
  });

  it('bloqueia paginação no fim ou durante outra consulta', () => {
    expect(canLoadNextOrientationPage(page([first], false), false)).toBe(true);
    expect(canLoadNextOrientationPage(page([first], true), false)).toBe(false);
    expect(canLoadNextOrientationPage(page([first], false), true)).toBe(false);
  });
});
