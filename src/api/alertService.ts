import type { AxiosInstance } from 'axios';

import { environment, requireApiUrl } from '../config/environment';
import type { PublicAlert } from '../types/alert';
import { dotnetPublicClient } from './clients';

export type AlertService = {
  listPublished: () => Promise<PublicAlert[]>;
  getById: (id: string) => Promise<PublicAlert>;
};

export function createAlertService(
  client: AxiosInstance,
  assertConfigured: () => void = () => {
    requireApiUrl('.NET', environment.dotnetApiUrl);
  },
): AlertService {
  return {
    async listPublished() {
      assertConfigured();
      const { data } = await client.get<PublicAlert[]>('/api/v1/alertas');
      return data;
    },
    async getById(id) {
      assertConfigured();
      const { data } = await client.get<PublicAlert>(`/api/v1/alertas/${id}`);
      return data;
    },
  };
}

export const alertService = createAlertService(dotnetPublicClient);
