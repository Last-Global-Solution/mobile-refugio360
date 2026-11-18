import type { ApiFailure } from '../types/api';

type PublicResource = 'locais seguros' | 'alertas';
type PublicOperation = 'list' | 'detail';

function isApiFailure(error: unknown): error is ApiFailure {
  return typeof error === 'object' && error !== null && 'kind' in error && 'message' in error;
}

export function getPublicDataErrorMessage(
  error: unknown,
  resource: PublicResource,
  operation: PublicOperation,
): string {
  if (error instanceof Error && error.message.includes('não foi configurada')) {
    return `A API de ${resource} ainda não foi configurada.`;
  }
  if (!isApiFailure(error)) return 'Não foi possível concluir. Tente novamente.';
  if (error.kind === 'network') return 'Sem conexão com o serviço. Verifique sua internet.';
  if (error.kind === 'timeout') return 'O serviço demorou para responder. Tente novamente.';
  if (error.kind === 'configuration') return `A API de ${resource} ainda não foi configurada.`;
  if (error.status === 429) return 'Muitas consultas foram feitas. Aguarde e tente novamente.';
  if (operation === 'detail' && error.status === 404) {
    return resource === 'alertas'
      ? 'Alerta não encontrado ou indisponível.'
      : 'Local não encontrado.';
  }

  return resource === 'alertas'
    ? 'Não foi possível carregar os alertas.'
    : 'Não foi possível carregar os locais seguros.';
}
