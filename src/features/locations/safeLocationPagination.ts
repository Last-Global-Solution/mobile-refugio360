import type { SpringPage } from '../../types/api';
import type { SafeLocation } from '../../types/safeLocation';

export function mergeSafeLocationPage(
  current: SafeLocation[],
  page: SpringPage<SafeLocation>,
  replace = false,
): SafeLocation[] {
  if (replace) return page.content;

  const byId = new Map(current.map((location) => [location.id, location]));
  page.content.forEach((location) => byId.set(location.id, location));
  return [...byId.values()];
}

export function canLoadNextSafeLocationPage(
  page: Pick<SpringPage<SafeLocation>, 'last'> | null,
  isLoading: boolean,
): boolean {
  return Boolean(page && !page.last && !isLoading);
}
