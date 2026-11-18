import type { SpringPage } from '../../types/api';
import type { Orientation } from '../../types/orientation';

export function mergeOrientationPage(
  current: Orientation[],
  page: SpringPage<Orientation>,
  replace = false,
): Orientation[] {
  if (replace) return page.content;

  const byId = new Map(current.map((orientation) => [orientation.id, orientation]));
  page.content.forEach((orientation) => byId.set(orientation.id, orientation));
  return [...byId.values()];
}

export function canLoadNextOrientationPage(
  page: Pick<SpringPage<Orientation>, 'last'> | null,
  isLoading: boolean,
): boolean {
  return Boolean(page && !page.last && !isLoading);
}
