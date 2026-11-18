import type { AxiosInstance } from 'axios';

import { environment, requireApiUrl } from '../config/environment';
import type { SpringPage } from '../types/api';
import type { SafeLocation, SafeLocationPageRequest } from '../types/safeLocation';
import { javaClient } from './clients';

export type SafeLocationService = {
  list: (request?: SafeLocationPageRequest) => Promise<SpringPage<SafeLocation>>;
  getById: (id: number) => Promise<SafeLocation>;
};

export function createSafeLocationService(
  client: AxiosInstance,
  assertConfigured: () => void = () => {
    requireApiUrl('Java', environment.javaApiUrl);
  },
): SafeLocationService {
  return {
    async list({ page = 0, size = 10 } = {}) {
      assertConfigured();
      const { data } = await client.get<SpringPage<SafeLocation>>('/api/locais-seguros', {
        params: { page, size, sort: 'nome,asc' },
      });
      return data;
    },
    async getById(id) {
      assertConfigured();
      const { data } = await client.get<SafeLocation>(`/api/locais-seguros/${id}`);
      return data;
    },
  };
}

export const safeLocationService = createSafeLocationService(javaClient);
