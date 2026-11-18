import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SafeLocation } from '../../types/safeLocation';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Props = {
  location: SafeLocation;
  onPress: () => void;
};

export function SafeLocationCard({ location, onPress }: Props) {
  return (
    <Pressable
      accessibilityHint="Abre os detalhes do local seguro"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.heading}>
        <Text style={styles.name}>{location.nome}</Text>
        <Text style={styles.type}>{location.tipo}</Text>
      </View>
      <Text style={styles.address}>{location.endereco}</Text>
      {location.descricao ? (
        <Text numberOfLines={3} style={styles.description}>
          {location.descricao}
        </Text>
      ) : null}
      <Text style={styles.action}>Ver detalhes e rota</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  pressed: { opacity: 0.78 },
  heading: { gap: spacing.xs },
  name: { color: colors.text, fontSize: typography.heading, fontWeight: '800' },
  type: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    color: colors.primaryPressed,
    fontSize: typography.caption,
    fontWeight: '800',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  address: { color: colors.text, fontSize: typography.body, fontWeight: '600' },
  description: { color: colors.textMuted, fontSize: typography.label, lineHeight: 20 },
  action: { color: colors.primaryPressed, fontSize: typography.label, fontWeight: '800' },
});
