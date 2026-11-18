import type { ApiFailure } from '../../types/api';
import type {
  CreateOccurrenceRequest,
  OccurrenceProfile,
  OccurrenceUrgency,
} from '../../types/occurrence';

export type OccurrenceFormValues = {
  descricao: string;
  urgencia: OccurrenceUrgency | null;
  perfil: OccurrenceProfile | null;
  latitude: string;
  longitude: string;
};

export type OccurrenceFormErrors = Partial<Record<keyof OccurrenceFormValues, string>>;

function parseCoordinate(value: string): number {
  return Number(value.trim().replace(',', '.'));
}

export function validateOccurrence(values: OccurrenceFormValues): OccurrenceFormErrors {
  const errors: OccurrenceFormErrors = {};
  const latitude = parseCoordinate(values.latitude);
  const longitude = parseCoordinate(values.longitude);

  if (!values.descricao.trim()) errors.descricao = 'Descreva o que está acontecendo.';
  if (!values.urgencia) errors.urgencia = 'Selecione o nível de urgência.';
  if (!values.perfil) errors.perfil = 'Selecione para quem a orientação será escrita.';

  if (!values.latitude.trim()) errors.latitude = 'Informe a latitude.';
  else if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors.latitude = 'A latitude deve estar entre -90 e 90.';
  }

  if (!values.longitude.trim()) errors.longitude = 'Informe a longitude.';
  else if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    errors.longitude = 'A longitude deve estar entre -180 e 180.';
  }

  return errors;
}

export function hasOccurrenceFormErrors(errors: OccurrenceFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function clearOccurrenceFormError(
  errors: OccurrenceFormErrors,
  field: keyof OccurrenceFormValues,
): OccurrenceFormErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}

export function toCreateOccurrenceRequest(values: OccurrenceFormValues): CreateOccurrenceRequest {
  if (!values.urgencia || !values.perfil) {
    throw new Error('O formulário precisa ser validado antes do envio.');
  }

  return {
    descricao: values.descricao.trim(),
    urgencia: values.urgencia,
    perfil: values.perfil,
    latitude: parseCoordinate(values.latitude),
    longitude: parseCoordinate(values.longitude),
  };
}

function isApiFailure(error: unknown): error is ApiFailure {
  return typeof error === 'object' && error !== null && 'kind' in error && 'message' in error;
}

export function getOccurrenceErrorMessage(
  error: unknown,
  operation: 'list' | 'detail' | 'create',
): string {
  if (error instanceof Error && error.message.includes('não foi configurada')) {
    return 'O aplicativo ainda não está conectado ao serviço de ocorrências.';
  }
  if (!isApiFailure(error)) return 'Não foi possível concluir. Tente novamente.';
  if (error.kind === 'network') return 'Sem conexão com o serviço. Verifique sua internet.';
  if (error.kind === 'timeout') return 'O serviço demorou para responder. Tente novamente.';
  if (error.kind === 'configuration') {
    return 'O aplicativo ainda não está conectado ao serviço de ocorrências.';
  }
  if (error.status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (error.status === 403) return 'Seu perfil não permite esta operação.';
  if (operation === 'detail' && error.status === 404) return 'Ocorrência não encontrada.';
  if (operation === 'create' && error.status === 400) return 'Revise os dados informados.';
  if (operation === 'create' && error.status === 409) {
    return 'A ocorrência não pôde ser registrada por um conflito de dados.';
  }

  return operation === 'list'
    ? 'Não foi possível carregar suas ocorrências.'
    : 'Não foi possível concluir. Tente novamente.';
}
