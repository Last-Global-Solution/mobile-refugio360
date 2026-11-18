import type { SpringPage } from '../../types/api';
import type { Occurrence } from '../../types/occurrence';

export function mergeOccurrencePage(
  current: Occurrence[],
  page: SpringPage<Occurrence>,
  replace = false,
): Occurrence[] {
  if (replace) return page.content;

  const byId = new Map(current.map((occurrence) => [occurrence.id, occurrence]));
  page.content.forEach((occurrence) => byId.set(occurrence.id, occurrence));
  return [...byId.values()];
}

export function canLoadNextPage(
  page: Pick<SpringPage<Occurrence>, 'last'> | null,
  isLoading: boolean,
): boolean {
  return Boolean(page && !page.last && !isLoading);
}
