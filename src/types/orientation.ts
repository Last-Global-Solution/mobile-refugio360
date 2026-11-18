export type Orientation = {
  id: number;
  ocorrenciaId: number;
  mensagem: string;
  perfil: string | null;
  geradoPorIA: boolean;
  locaisConsiderados: number[];
  criadaEm: string;
};

export type OrientationPageRequest = {
  page?: number;
  size?: number;
  signal?: AbortSignal;
};
