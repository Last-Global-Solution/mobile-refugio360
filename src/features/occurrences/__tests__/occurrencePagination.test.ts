import type { SpringPage } from '../../../types/api';
import type { Occurrence } from '../../../types/occurrence';
import { canLoadNextPage, mergeOccurrencePage } from '../occurrencePagination';

const first: Occurrence = {
  id: 2,
  descricao: 'Primeira',
  urgencia: 'MEDIA',
  status: 'PENDENTE',
  latitude: 0,
  longitude: 0,
  perfil: 'GERAL',
};

const second: Occurrence = { ...first, id: 1, descricao: 'Segunda' };

function page(content: Occurrence[], last: boolean): SpringPage<Occurrence> {
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

describe('paginação de ocorrências', () => {
  it('substitui dados ao atualizar manualmente', () => {
    expect(mergeOccurrencePage([second], page([first], false), true)).toEqual([first]);
  });

  it('anexa páginas sem duplicar registros', () => {
    expect(mergeOccurrencePage([first], page([first, second], true))).toEqual([first, second]);
  });

  it('evita chamadas quando a última página chegou ou já existe carregamento', () => {
    expect(canLoadNextPage(page([first], true), false)).toBe(false);
    expect(canLoadNextPage(page([first], false), true)).toBe(false);
    expect(canLoadNextPage(page([first], false), false)).toBe(true);
  });
});
