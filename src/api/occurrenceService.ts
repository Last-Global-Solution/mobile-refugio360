import type { AxiosInstance } from 'axios';

import { environment, requireApiUrl } from '../config/environment';
import type { SpringPage } from '../types/api';
import type {
  CreateOccurrenceRequest,
  Occurrence,
  OccurrencePageRequest,
} from '../types/occurrence';
import { javaClient } from './clients';

export type OccurrenceService = {
  listMine: (request?: OccurrencePageRequest) => Promise<SpringPage<Occurrence>>;
  getById: (id: number) => Promise<Occurrence>;
  create: (request: CreateOccurrenceRequest) => Promise<Occurrence>;
};

export function createOccurrenceService(
  client: AxiosInstance,
  assertConfigured: () => void = () => {
    requireApiUrl('Java', environment.javaApiUrl);
  },
): OccurrenceService {
  return {
    async listMine({ page = 0, size = 10 } = {}) {
      assertConfigured();
      const { data } = await client.get<SpringPage<Occurrence>>('/api/ocorrencias/minhas', {
        params: { page, size, sort: 'id,desc' },
      });
      return data;
    },
    async getById(id) {
      assertConfigured();
      const { data } = await client.get<Occurrence>(`/api/ocorrencias/${id}`);
      return data;
    },
    async create(request) {
      assertConfigured();
      const { data } = await client.post<Occurrence>('/api/ocorrencias', request);
      return data;
    },
  };
}

export const occurrenceService = createOccurrenceService(javaClient);
