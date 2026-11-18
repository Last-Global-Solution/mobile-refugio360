export type PublicAlert = {
  id: string;
  titulo: string;
  mensagem: string;
  fonte: string;
  status: string;
  criadoEmUtc: string;
  expiraEmUtc: string;
  ativo: boolean;
};
