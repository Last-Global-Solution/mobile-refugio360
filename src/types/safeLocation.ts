export type SafeLocation = {
  id: number;
  nome: string;
  tipo: string;
  endereco: string;
  latitude: number;
  longitude: number;
  descricao: string | null;
};

export type SafeLocationPageRequest = {
  page?: number;
  size?: number;
};
