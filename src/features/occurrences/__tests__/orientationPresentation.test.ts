import type { Orientation } from '../../../types/orientation';
import { formatOrientationProfile, getOrientationOrigin } from '../orientationPresentation';

const orientation: Orientation = {
  id: 21,
  ocorrenciaId: 15,
  mensagem: 'Orientação',
  perfil: 'GERAL',
  geradoPorIA: true,
  locaisConsiderados: [],
  criadaEm: '2026-11-18T12:00:00Z',
};

describe('apresentação das orientações', () => {
  it('identifica uma orientação gerada por IA', () => {
    expect(getOrientationOrigin(orientation)).toBe('Gerada com IA');
  });

  it('identifica uma orientação automática local como resultado válido', () => {
    expect(getOrientationOrigin({ ...orientation, geradoPorIA: false })).toBe(
      'Orientação automática local',
    );
  });

  it('preserva perfis desconhecidos do contrato aberto e trata perfil legado nulo', () => {
    expect(formatOrientationProfile('OUTRO_PERFIL')).toBe('OUTRO_PERFIL');
    expect(formatOrientationProfile(null)).toBe('Não informado');
  });
});
