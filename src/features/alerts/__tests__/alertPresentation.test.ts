import type { PublicAlert } from '../../../types/alert';
import { formatDateTime } from '../../../utils/formatters';
import { isDemonstrationAlert } from '../alertPresentation';

const alert: PublicAlert = {
  id: '36c12812-53ba-4b83-a60a-ecc622ae9304',
  titulo: 'Chuva forte',
  mensagem: 'Evite áreas alagadas.',
  fonte: 'Defesa Civil',
  status: 'PUBLICADO',
  criadoEmUtc: '2026-11-18T12:00:00Z',
  expiraEmUtc: '2026-11-19T12:00:00Z',
  ativo: true,
};

describe('apresentação dos alertas', () => {
  it('não classifica uma fonte informada como demonstração sem evidência textual', () => {
    expect(isDemonstrationAlert(alert)).toBe(false);
  });

  it.each(['Alerta demo', 'Simulação de evacuação', 'Conteúdo fictício'])(
    'identifica marcador demonstrativo: %s',
    (titulo) => expect(isDemonstrationAlert({ ...alert, titulo })).toBe(true),
  );

  it('usa fallback seguro para data inválida', () => {
    expect(formatDateTime('valor-inválido')).toBe('Data não informada');
  });
});
