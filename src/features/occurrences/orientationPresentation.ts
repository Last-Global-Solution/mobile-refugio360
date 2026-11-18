import type { Orientation } from '../../types/orientation';

const profileLabels: Record<string, string> = {
  GERAL: 'Geral',
  IDOSO: 'Pessoa idosa',
  PCD: 'Pessoa com deficiência',
  FAMILIA: 'Família',
};

export function getOrientationOrigin(orientation: Pick<Orientation, 'geradoPorIA'>): string {
  return orientation.geradoPorIA ? 'Gerada com IA' : 'Orientação automática local';
}

export function formatOrientationProfile(profile: string | null): string {
  if (!profile) return 'Não informado';
  return profileLabels[profile] ?? profile;
}
