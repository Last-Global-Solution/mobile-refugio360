import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '../theme/tokens';

type FeatureCardProps = {
  code: string;
  title: string;
  description: string;
  onPress: () => void;
};

export function FeatureCard({ code, title, description, onPress }: FeatureCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.codeBox}>
        <Text style={styles.code}>{code}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...shadows.card,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  codeBox: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
  },
  code: {
    color: colors.primary,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.label,
    lineHeight: 20,
  },
  arrow: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '300',
  },
});
