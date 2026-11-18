import { BrandHeader } from '../../components/BrandHeader';
import { Screen } from '../../components/Screen';
import { StatePanel } from '../../components/StatePanel';

export function OccurrencesScreen() {
  return (
    <Screen>
      <BrandHeader
        description="O histórico e o CRUD serão conectados à API Java em um próximo incremento."
        eyebrow="ACOMPANHAMENTO"
        title="Minhas ocorrências"
      />
      <StatePanel
        message="Nenhuma consulta foi realizada. A integração com ocorrências ainda não está ativa."
        state="empty"
        title="Área preparada"
      />
    </Screen>
  );
}
