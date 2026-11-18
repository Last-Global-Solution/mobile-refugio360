import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { occurrenceService } from '../../api/occurrenceService';
import { BrandHeader } from '../../components/BrandHeader';
import { Screen } from '../../components/Screen';
import { StatePanel } from '../../components/StatePanel';
import type { AppStackParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { Occurrence } from '../../types/occurrence';
import { OccurrenceOrientations } from './OccurrenceOrientations';
import { getOccurrenceErrorMessage } from './occurrenceValidation';

type Props = NativeStackScreenProps<AppStackParamList, 'OccurrenceDetail'>;

const labels = {
  urgency: { BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta', CRITICA: 'Crítica' },
  status: { PENDENTE: 'Pendente', EM_ANALISE: 'Em análise', RESOLVIDA: 'Resolvida' },
  profile: {
    GERAL: 'Geral',
    IDOSO: 'Pessoa idosa',
    PCD: 'Pessoa com deficiência',
    FAMILIA: 'Família',
  },
} as const;

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

export function OccurrenceDetailScreen({ route }: Props) {
  const { isAuthenticated } = useSession();
  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      setOccurrence(await occurrenceService.getById(route.params.occurrenceId));
    } catch (requestError) {
      setError(getOccurrenceErrorMessage(requestError, 'detail'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    let active = true;
    occurrenceService
      .getById(route.params.occurrenceId)
      .then((result) => {
        if (!active) return;
        setOccurrence(result);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getOccurrenceErrorMessage(requestError, 'detail'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [route.params.occurrenceId, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Screen contentContainerStyle={styles.centered}>
        <StatePanel
          message="Entre com uma conta para consultar esta ocorrência."
          state="empty"
          title="Acesso protegido"
        />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen contentContainerStyle={styles.centered}>
        <StatePanel
          message="Consultando os dados atualizados."
          state="loading"
          title="Carregando ocorrência"
        />
      </Screen>
    );
  }

  if (error || !occurrence) {
    return (
      <Screen contentContainerStyle={styles.centered}>
        <StatePanel
          actionLabel="Tentar novamente"
          message={error ?? 'Ocorrência não encontrada.'}
          onAction={() => void load()}
          state="error"
          title="Não foi possível abrir"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <BrandHeader
        description="Dados enviados no registro e situação atual informada pela API Java."
        eyebrow={`OCORRÊNCIA #${occurrence.id}`}
        title={labels.status[occurrence.status]}
      />

      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{occurrence.descricao}</Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Informações do relato</Text>
        <DetailRow label="Identificador" value={String(occurrence.id)} />
        <DetailRow label="Urgência" value={labels.urgency[occurrence.urgencia]} />
        <DetailRow label="Status" value={labels.status[occurrence.status]} />
        <DetailRow
          label="Perfil da orientação"
          value={occurrence.perfil ? labels.profile[occurrence.perfil] : 'Não informado'}
        />
        <DetailRow label="Latitude" value={occurrence.latitude.toFixed(6)} />
        <DetailRow label="Longitude" value={occurrence.longitude.toFixed(6)} />
      </View>

      <OccurrenceOrientations isAuthenticated={isAuthenticated} occurrenceId={occurrence.id} />

      <View style={styles.pendingCard}>
        <Text style={styles.pendingTitle}>Edição ainda indisponível</Text>
        <Text style={styles.pendingText}>
          A edição e a exclusão serão habilitadas após o ajuste de autorização no backend Java.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
  },
  descriptionCard: {
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  detailsCard: {
    gap: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  description: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.lineHeightBody,
  },
  detailRow: {
    gap: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  pendingCard: {
    gap: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
  },
  pendingTitle: {
    color: colors.warning,
    fontSize: typography.label,
    fontWeight: '800',
  },
  pendingText: {
    color: colors.text,
    fontSize: typography.label,
    lineHeight: 20,
  },
});
