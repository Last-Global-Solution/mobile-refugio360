import { BrandHeader } from '../../components/BrandHeader';
import { Screen } from '../../components/Screen';
import { StatePanel } from '../../components/StatePanel';

export function AlertsScreen() {
  return (
    <Screen>
      <BrandHeader
        description="A tela consumirá somente alertas públicos, publicados e não expirados da API .NET."
        eyebrow="COMUNICADOS"
        title="Alertas"
      />
      <StatePanel
        message="Nenhuma chamada à API .NET é feita neste incremento."
        state="empty"
        title="Consulta ainda não conectada"
      />
    </Screen>
  );
}
