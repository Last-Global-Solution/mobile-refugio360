import type { PublicAlert } from '../../types/alert';

const demonstrationTerms =
  /\b(demo|demonstra(?:ç|c)[aã]o|simula(?:ç|c)[aã]o|simulado|fict[ií]ci[oa])\b/i;

export function isDemonstrationAlert(alert: PublicAlert): boolean {
  return demonstrationTerms.test(`${alert.titulo} ${alert.mensagem} ${alert.fonte}`);
}
