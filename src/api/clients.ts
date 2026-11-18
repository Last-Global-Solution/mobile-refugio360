import { create, type AxiosInstance } from 'axios';

import { environment } from '../config/environment';
import { toApiFailure } from '../utils/apiErrors';

function createClient(baseURL: string | undefined, timeout: number): AxiosInstance {
  const client = create({
    ...(baseURL ? { baseURL } : {}),
    timeout,
    headers: { Accept: 'application/json' },
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiFailure(error)),
  );

  return client;
}

export const javaClient = createClient(environment.javaApiUrl, 10_000);

// Este cliente é público por design. Não adicionar o token da sessão Java.
export const dotnetPublicClient = createClient(environment.dotnetApiUrl, 8_000);
