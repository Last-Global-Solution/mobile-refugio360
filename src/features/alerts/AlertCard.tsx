import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { PublicAlert } from '../../types/alert';
import { formatDateTime } from '../../utils/formatters';
import { isDemonstrationAlert } from './alertPresentation';

type Props = { alert: PublicAlert; onPress: () => void };

export function AlertCard({ alert, onPress }: Props) {
  const demonstration = isDemonstrationAlert(alert);

  return (
    <Pressable
      accessibilityHint="Abre o comunicado completo"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.badges}>
        <Text style={[styles.badge, demonstration && styles.demoBadge]}>
          {demonstration ? 'CONTEÚDO DEMONSTRATIVO' : alert.status}
        </Text>
        <Text style={styles.active}>{alert.ativo ? 'ATIVO' : 'INATIVO'}</Text>
      </View>
      <Text style={styles.title}>{alert.titulo}</Text>
      <Text numberOfLines={3} style={styles.message}>
        {alert.mensagem}
      </Text>
      <Text style={styles.metadata}>Fonte: {alert.fonte}</Text>
      <Text style={styles.metadata}>Publicado em {formatDateTime(alert.criadoEmUtc)}</Text>
      <Text style={styles.action}>Ler comunicado</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  pressed: { opacity: 0.78 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: {
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    color: colors.primaryPressed,
    fontSize: typography.caption,
    fontWeight: '900',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  demoBadge: { backgroundColor: colors.warningSoft, color: colors.warning },
  active: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
    paddingVertical: spacing.xs,
  },
  title: { color: colors.text, fontSize: typography.heading, fontWeight: '800' },
  message: { color: colors.text, fontSize: typography.body, lineHeight: 23 },
  metadata: { color: colors.textMuted, fontSize: typography.caption },
  action: { color: colors.primaryPressed, fontSize: typography.label, fontWeight: '800' },
});
