import { isAxiosError } from 'axios';

import type { ApiFailure } from '../types/api';

export function toApiFailure(error: unknown): ApiFailure {
  if (!isAxiosError(error)) {
    return {
      kind:
        error instanceof Error && error.message.includes('não foi configurada')
          ? 'configuration'
          : 'unknown',
      message: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
    };
  }

  if (error.code === 'ECONNABORTED') {
    return { kind: 'timeout', message: 'A solicitação demorou mais que o esperado.' };
  }

  if (!error.response) {
    return { kind: 'network', message: 'Não foi possível conectar ao serviço.' };
  }

  return {
    kind: 'http',
    status: error.response.status,
    message: 'O serviço não conseguiu concluir a solicitação.',
  };
}
