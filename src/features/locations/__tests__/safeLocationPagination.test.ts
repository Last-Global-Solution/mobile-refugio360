import type { SpringPage } from '../../../types/api';
import type { SafeLocation } from '../../../types/safeLocation';
import { canLoadNextSafeLocationPage, mergeSafeLocationPage } from '../safeLocationPagination';

const first: SafeLocation = {
  id: 1,
  nome: 'Abrigo A',
  tipo: 'ABRIGO',
  endereco: 'Rua A',
  latitude: 0,
  longitude: 0,
  descricao: null,
};
const second: SafeLocation = { ...first, id: 2, nome: 'Abrigo B' };

function page(content: SafeLocation[], last: boolean): SpringPage<SafeLocation> {
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

describe('paginação de locais seguros', () => {
  it('substitui dados no refresh', () => {
    expect(mergeSafeLocationPage([second], page([first], false), true)).toEqual([first]);
  });

  it('anexa páginas sem duplicar locais', () => {
    expect(mergeSafeLocationPage([first], page([first, second], true))).toEqual([first, second]);
  });

  it('carrega somente quando existe próxima página e nenhuma chamada em curso', () => {
    expect(canLoadNextSafeLocationPage(page([first], false), false)).toBe(true);
    expect(canLoadNextSafeLocationPage(page([first], true), false)).toBe(false);
    expect(canLoadNextSafeLocationPage(page([first], false), true)).toBe(false);
  });
});
