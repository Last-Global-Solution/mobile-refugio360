import type { ApiFailure } from '../../types/api';

function isApiFailure(error: unknown): error is ApiFailure {
  return typeof error === 'object' && error !== null && 'kind' in error && 'message' in error;
}

export function getOrientationErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.includes('não foi configurada')) {
    return 'A API Java ainda não foi configurada.';
  }
  if (!isApiFailure(error)) return 'Não foi possível consultar as orientações.';
  if (error.kind === 'network') return 'Sem conexão com o serviço de orientações.';
  if (error.kind === 'timeout') return 'A consulta de orientações demorou mais que o esperado.';
  if (error.kind === 'configuration') return 'A API Java ainda não foi configurada.';
  if (error.status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (error.status === 403) return 'Você não tem permissão para consultar estas orientações.';
  if (error.status === 404) return 'A ocorrência não foi encontrada.';
  return 'Não foi possível consultar as orientações.';
}
