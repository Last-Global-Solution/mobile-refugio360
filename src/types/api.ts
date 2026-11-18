export type SpringPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type ApiFailureKind = 'network' | 'timeout' | 'http' | 'configuration' | 'unknown';

export type ApiFailure = {
  kind: ApiFailureKind;
  message: string;
  status?: number;
};
