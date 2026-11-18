import type { AxiosInstance } from 'axios';

import { environment, requireApiUrl } from '../config/environment';
import type { SpringPage } from '../types/api';
import type { Orientation, OrientationPageRequest } from '../types/orientation';
import { javaClient } from './clients';

export type OrientationService = {
  listByOccurrence: (
    occurrenceId: number,
    request?: OrientationPageRequest,
  ) => Promise<SpringPage<Orientation>>;
};

export function createOrientationService(
  client: AxiosInstance,
  assertConfigured: () => void = () => {
    requireApiUrl('Java', environment.javaApiUrl);
  },
): OrientationService {
  return {
    async listByOccurrence(occurrenceId, { page = 0, size = 10, signal } = {}) {
      assertConfigured();
      const { data } = await client.get<SpringPage<Orientation>>(
        `/api/ocorrencias/${occurrenceId}/orientacoes`,
        {
          params: { page, size, sort: 'criadaEm,desc' },
          ...(signal ? { signal } : {}),
        },
      );
      return data;
    },
  };
}

export const orientationService = createOrientationService(javaClient);
