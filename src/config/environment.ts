function normalizeUrl(value: string | undefined): string | undefined {
  const normalized = value?.trim().replace(/\/+$/, '');
  return normalized || undefined;
}

export const environment = {
  javaApiUrl: normalizeUrl(process.env.EXPO_PUBLIC_JAVA_API_URL),
  dotnetApiUrl: normalizeUrl(process.env.EXPO_PUBLIC_DOTNET_API_URL),
} as const;

export type ApiName = 'Java' | '.NET';

export function requireApiUrl(name: ApiName, url: string | undefined): string {
  if (!url) {
    throw new Error(`A URL da API ${name} não foi configurada.`);
  }

  return url;
}
