import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '../../theme/tokens';
import type { Occurrence } from '../../types/occurrence';

const urgencyLabels: Record<Occurrence['urgencia'], string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
};

const statusLabels: Record<Occurrence['status'], string> = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  RESOLVIDA: 'Resolvida',
};

type OccurrenceCardProps = {
  occurrence: Occurrence;
  onPress: () => void;
};

export function OccurrenceCard({ occurrence, onPress }: OccurrenceCardProps) {
  return (
    <Pressable
      accessibilityHint="Abre os detalhes da ocorrência"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Text style={styles.identifier}>Ocorrência #{occurrence.id}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{statusLabels[occurrence.status]}</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.description}>
        {occurrence.descricao}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.urgency}>Urgência {urgencyLabels[occurrence.urgencia]}</Text>
        <Text style={styles.coordinates}>
          {occurrence.latitude.toFixed(5)}, {occurrence.longitude.toFixed(5)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...shadows.card,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  identifier: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '900',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  statusBadge: {
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    color: colors.primaryPressed,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  description: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: typography.lineHeightBody,
  },
  metaRow: {
    gap: spacing.xs,
  },
  urgency: {
    color: colors.warning,
    fontSize: typography.label,
    fontWeight: '800',
  },
  coordinates: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
