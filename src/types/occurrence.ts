export const occurrenceUrgencies = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as const;
export type OccurrenceUrgency = (typeof occurrenceUrgencies)[number];

export const occurrenceProfiles = ['GERAL', 'IDOSO', 'PCD', 'FAMILIA'] as const;
export type OccurrenceProfile = (typeof occurrenceProfiles)[number];

export type OccurrenceStatus = 'PENDENTE' | 'EM_ANALISE' | 'RESOLVIDA';

export type Occurrence = {
  id: number;
  descricao: string;
  urgencia: OccurrenceUrgency;
  status: OccurrenceStatus;
  latitude: number;
  longitude: number;
  perfil: OccurrenceProfile | null;
};

export type CreateOccurrenceRequest = {
  descricao: string;
  urgencia: OccurrenceUrgency;
  latitude: number;
  longitude: number;
  perfil: OccurrenceProfile;
};

export type OccurrencePageRequest = {
  page?: number;
  size?: number;
};
