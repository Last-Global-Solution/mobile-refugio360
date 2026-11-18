import type { ApiFailure } from '../../../types/api';
import {
  getAuthErrorMessage,
  hasFormErrors,
  validateLogin,
  validateRegistration,
} from '../authValidation';

describe('validações de autenticação', () => {
  it('aceita dados válidos de login', () => {
    expect(hasFormErrors(validateLogin('cidadao@email.com', 'senha123'))).toBe(false);
  });

  it('rejeita cadastro com e-mail, senha e confirmação inválidos', () => {
    const errors = validateRegistration('email-invalido', 'curta', 'diferente');

    expect(errors).toEqual({
      email: 'Informe um e-mail válido.',
      password: 'A senha deve ter entre 8 e 72 caracteres.',
      confirmation: 'As senhas não conferem.',
    });
  });

  it('apresenta mensagem cidadã para login inválido', () => {
    const error: ApiFailure = { kind: 'http', status: 401, message: 'mensagem técnica' };
    expect(getAuthErrorMessage(error, 'login')).toBe('E-mail ou senha inválidos.');
  });

  it('apresenta mensagem específica para e-mail duplicado', () => {
    const error: ApiFailure = { kind: 'http', status: 409, message: 'mensagem técnica' };
    expect(getAuthErrorMessage(error, 'register')).toBe('Este e-mail já está cadastrado.');
  });

  it('explica quando a URL Java ainda não foi configurada', () => {
    const error = new Error('A URL da API Java não foi configurada.');
    expect(getAuthErrorMessage(error, 'login')).toBe(
      'O aplicativo ainda não está conectado ao serviço.',
    );
  });
});
