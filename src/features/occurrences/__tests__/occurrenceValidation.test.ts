import type { ApiFailure } from '../../../types/api';
import {
  getOccurrenceErrorMessage,
  hasOccurrenceFormErrors,
  type OccurrenceFormValues,
  toCreateOccurrenceRequest,
  validateOccurrence,
} from '../occurrenceValidation';

const validValues: OccurrenceFormValues = {
  descricao: 'Alagamento na via',
  urgencia: 'ALTA',
  perfil: 'GERAL',
  latitude: '-23,55',
  longitude: '-46.63',
};

describe('validação de ocorrência', () => {
  it('converte formulário válido para o contrato Java', () => {
    expect(hasOccurrenceFormErrors(validateOccurrence(validValues))).toBe(false);
    expect(toCreateOccurrenceRequest(validValues)).toEqual({
      descricao: validValues.descricao,
      urgencia: 'ALTA',
      perfil: 'GERAL',
      latitude: -23.55,
      longitude: -46.63,
    });
  });

  it('rejeita campos obrigatórios ausentes', () => {
    expect(
      validateOccurrence({
        descricao: '  ',
        urgencia: null,
        perfil: null,
        latitude: '',
        longitude: '',
      }),
    ).toEqual({
      descricao: 'Descreva o que está acontecendo.',
      urgencia: 'Selecione o nível de urgência.',
      perfil: 'Selecione para quem a orientação será escrita.',
      latitude: 'Informe a latitude.',
      longitude: 'Informe a longitude.',
    });
  });

  it.each([
    ['91', '0', 'latitude'],
    ['-91', '0', 'latitude'],
    ['texto', '0', 'latitude'],
    ['0', '181', 'longitude'],
    ['0', '-181', 'longitude'],
    ['0', 'texto', 'longitude'],
  ])('rejeita coordenadas fora dos limites (%s, %s)', (latitude, longitude, field) => {
    const errors = validateOccurrence({ ...validValues, latitude, longitude });
    expect(errors[field as 'latitude' | 'longitude']).toBeDefined();
  });

  it.each([
    [401, 'Sua sessão expirou. Entre novamente.'],
    [403, 'Seu perfil não permite esta operação.'],
    [409, 'A ocorrência não pôde ser registrada por um conflito de dados.'],
  ])('traduz o erro HTTP %s na criação', (status, message) => {
    const error: ApiFailure = { kind: 'http', status, message: 'técnica' };
    expect(getOccurrenceErrorMessage(error, 'create')).toBe(message);
  });

  it('traduz falha de rede sem expor detalhes técnicos', () => {
    const error: ApiFailure = { kind: 'network', message: 'Network Error' };
    expect(getOccurrenceErrorMessage(error, 'list')).toBe(
      'Sem conexão com o serviço. Verifique sua internet.',
    );
  });
});
