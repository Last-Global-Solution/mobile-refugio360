import { BrandHeader } from '../../components/BrandHeader';
import { Screen } from '../../components/Screen';
import { StatePanel } from '../../components/StatePanel';

export function SafeLocationsScreen() {
  return (
    <Screen>
      <BrandHeader
        description="A consulta pública de locais seguros será conectada à API Java."
        eyebrow="PONTOS DE APOIO"
        title="Locais seguros"
      />
      <StatePanel
        message="Nenhum dado foi carregado. Esta tela não apresenta locais fictícios."
        state="empty"
        title="Consulta ainda não conectada"
      />
    </Screen>
  );
}
