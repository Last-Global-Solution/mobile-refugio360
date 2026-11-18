import { create, isAxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { environment } from '../config/environment';
import { toApiFailure } from '../utils/apiErrors';

type JavaAuthBinding = {
  getAccessToken: () => string | null;
  onUnauthorized: () => void;
};

const publicAuthPaths = ['/api/auth/login', '/api/auth/register'];
let javaAuthBinding: JavaAuthBinding = {
  getAccessToken: () => null,
  onUnauthorized: () => undefined,
};

function isPublicAuthRequest(url: string | undefined): boolean {
  const path = url?.split('?')[0] ?? '';
  return publicAuthPaths.some((publicPath) => path.endsWith(publicPath));
}

function createClient(baseURL: string | undefined, timeout: number): AxiosInstance {
  return create({
    ...(baseURL ? { baseURL } : {}),
    timeout,
    headers: { Accept: 'application/json' },
  });
}

function installErrorNormalizer(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiFailure(error)),
  );
}

export const javaClient = createClient(environment.javaApiUrl, 10_000);

javaClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (isPublicAuthRequest(config.url)) {
    config.headers.delete('Authorization');
    return config;
  }

  const accessToken = javaAuthBinding.getAccessToken();
  if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
  return config;
});

javaClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      !isPublicAuthRequest(error.config?.url)
    ) {
      javaAuthBinding.onUnauthorized();
    }

    return Promise.reject(error);
  },
);

installErrorNormalizer(javaClient);

export function configureJavaAuth(binding: JavaAuthBinding): () => void {
  javaAuthBinding = binding;
  return () => {
    javaAuthBinding = {
      getAccessToken: () => null,
      onUnauthorized: () => undefined,
    };
  };
}

// Este cliente é público por design. Não adicionar o token da sessão Java.
export const dotnetPublicClient = createClient(environment.dotnetApiUrl, 8_000);
installErrorNormalizer(dotnetPublicClient);
