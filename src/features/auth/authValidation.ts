import type { ApiFailure } from '../../types/api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthFormErrors = {
  email?: string;
  password?: string;
  confirmation?: string;
};

export function validateLogin(email: string, password: string): AuthFormErrors {
  const errors: AuthFormErrors = {};
  const normalizedEmail = email.trim();

  if (!normalizedEmail) errors.email = 'Informe seu e-mail.';
  else if (!EMAIL_PATTERN.test(normalizedEmail)) errors.email = 'Informe um e-mail válido.';
  if (!password) errors.password = 'Informe sua senha.';

  return errors;
}

export function validateRegistration(
  email: string,
  password: string,
  confirmation: string,
): AuthFormErrors {
  const errors = validateLogin(email, password);

  if (password && (password.length < 8 || password.length > 72)) {
    errors.password = 'A senha deve ter entre 8 e 72 caracteres.';
  }
  if (!confirmation) errors.confirmation = 'Confirme sua senha.';
  else if (password !== confirmation) errors.confirmation = 'As senhas não conferem.';

  return errors;
}

export function hasFormErrors(errors: AuthFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function clearFormError(
  errors: AuthFormErrors,
  field: keyof AuthFormErrors,
): AuthFormErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}

function isApiFailure(error: unknown): error is ApiFailure {
  return typeof error === 'object' && error !== null && 'kind' in error && 'message' in error;
}

export function getAuthErrorMessage(error: unknown, operation: 'login' | 'register'): string {
  if (error instanceof Error && error.message.includes('não foi configurada')) {
    return 'O aplicativo ainda não está conectado ao serviço.';
  }
  if (!isApiFailure(error)) return 'Não foi possível concluir. Tente novamente.';

  if (error.kind === 'network') return 'Sem conexão com o serviço. Verifique sua internet.';
  if (error.kind === 'timeout') return 'O serviço demorou para responder. Tente novamente.';
  if (error.kind === 'configuration') return 'O aplicativo ainda não está conectado ao serviço.';
  if (operation === 'login' && error.status === 401) return 'E-mail ou senha inválidos.';
  if (operation === 'register' && error.status === 409) return 'Este e-mail já está cadastrado.';
  if (error.status === 400) return 'Revise os dados informados.';

  return 'Não foi possível concluir. Tente novamente.';
}
