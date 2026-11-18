import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { alertService } from '../../api/alertService';
import { BrandHeader } from '../../components/BrandHeader';
import { Screen } from '../../components/Screen';
import { StatePanel } from '../../components/StatePanel';
import type { AppStackParamList } from '../../navigation/types';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { PublicAlert } from '../../types/alert';
import { toApiFailure } from '../../utils/apiErrors';
import { formatDateTime } from '../../utils/formatters';
import { getPublicDataErrorMessage } from '../../utils/publicDataErrors';
import { isDemonstrationAlert } from './alertPresentation';

type Props = NativeStackScreenProps<AppStackParamList, 'AlertDetail'>;

export function AlertDetailScreen({ route }: Props) {
  const [alert, setAlert] = useState<PublicAlert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAlert(await alertService.getById(route.params.alertId));
    } catch (requestError) {
      setError(getPublicDataErrorMessage(toApiFailure(requestError), 'alertas', 'detail'));
    } finally {
      setIsLoading(false);
    }
  }, [route.params.alertId]);

  useEffect(() => {
    let active = true;
    alertService
      .getById(route.params.alertId)
      .then((result) => {
        if (active) setAlert(result);
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(getPublicDataErrorMessage(toApiFailure(requestError), 'alertas', 'detail'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [route.params.alertId]);

  if (isLoading)
    return (
      <Screen>
        <StatePanel
          state="loading"
          title="Carregando alerta"
          message="Consultando o comunicado publicado."
        />
      </Screen>
    );
  if (error || !alert) {
    return (
      <Screen>
        <StatePanel
          actionLabel="Tentar novamente"
          message={error ?? 'Não foi possível carregar o alerta.'}
          onAction={() => void load()}
          state="error"
          title="Alerta indisponível"
        />
      </Screen>
    );
  }

  const demonstration = isDemonstrationAlert(alert);
  return (
    <Screen>
      <BrandHeader
        description={`Fonte informada: ${alert.fonte}`}
        eyebrow={alert.status}
        title={alert.titulo}
      />
      {demonstration ? (
        <View style={styles.demoNotice}>
          <Text style={styles.demoTitle}>Conteúdo demonstrativo</Text>
          <Text style={styles.demoText}>
            Este alerta se identifica como demonstração, simulação ou conteúdo fictício.
          </Text>
        </View>
      ) : null}
      <View style={styles.panel}>
        <Text style={styles.message}>{alert.mensagem}</Text>
        <Detail label="Situação" value={alert.ativo ? 'Ativo' : 'Inativo'} />
        <Detail label="Criado em" value={formatDateTime(alert.criadoEmUtc)} />
        <Detail label="Expira em" value={formatDateTime(alert.expiraEmUtc)} />
        <Detail label="Identificador" value={alert.id} />
      </View>
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.label}>{label}</Text>
      <Text selectable style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  message: { color: colors.text, fontSize: typography.body, lineHeight: 24 },
  detail: { gap: spacing.xs },
  label: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  value: { color: colors.text, fontSize: typography.body },
  demoNotice: {
    gap: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
  },
  demoTitle: { color: colors.warning, fontSize: typography.label, fontWeight: '900' },
  demoText: { color: colors.text, fontSize: typography.label, lineHeight: 20 },
});
